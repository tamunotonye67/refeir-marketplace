import { Router, Request, Response, NextFunction } from 'express';
import { memoryStore, ContributorProfile, ApplicationRecord } from '../store/memoryStore.js';
import { adminDb } from '../config/firebaseAdmin.js';
import { requireStaffRole } from '../middleware/auth.js';

export const authRouter = Router();

// Helper to sanitize profile (hide password hash from responses)
function sanitize(profile: ContributorProfile): Omit<ContributorProfile, 'password_hash'> {
  const copy = { ...profile };
  delete copy.password_hash;
  return copy;
}

// 1. POST /api/auth/signup (Register with Application ID + Acceptance Code)
authRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { application_number, acceptance_code, email, password, full_name, division, whatsapp_number } = req.body;

    if (!application_number || !acceptance_code) {
      return res.status(400).json({
        success: false,
        error: 'Application ID and Acceptance Code are required to activate a Pioneer account.'
      });
    }

    const appNum = application_number.trim().toUpperCase();
    const accCode = acceptance_code.trim().toUpperCase();
    const cleanEmail = (email || '').trim().toLowerCase();

    // Verify application
    let app: ApplicationRecord | undefined;
    if (adminDb) {
      const snap = await adminDb.collection('pioneer_applications').where('application_number', '==', appNum).limit(1).get();
      if (!snap.empty) {
        app = { id: snap.docs[0].id, ...snap.docs[0].data() } as ApplicationRecord;
      }
    }
    if (!app) {
      app = memoryStore.applications.find(a => a.application_number.toUpperCase() === appNum);
    }

    if (!app) {
      return res.status(400).json({
        success: false,
        error: `Application ${appNum} not found in the official registry.`
      });
    }

    if (app.status !== 'ACCEPTED') {
      return res.status(400).json({
        success: false,
        error: `Application ${appNum} review status is currently "${app.status}". Only accepted applicants can register.`
      });
    }

    if (app.acceptance_code && app.acceptance_code.toUpperCase() !== accCode) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Acceptance Code. Please check your credentials from the Admissions lookup.'
      });
    }

    // Check if account already registered
    const existing = memoryStore.contributors.find(
      u => u.email.toLowerCase() === cleanEmail || u.application_number?.toUpperCase() === appNum
    );
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'An account has already been activated for this Pioneer. Please sign in.'
      });
    }

    const newProfile: ContributorProfile = {
      id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      email: cleanEmail || app.email.toLowerCase(),
      full_name: full_name?.trim() || app.full_name,
      division: division || app.primary_division || 'GROWTH',
      application_number: appNum,
      pioneer_id: app.pioneer_id || '',
      acceptance_code: accCode,
      whatsapp_number: whatsapp_number?.trim() || app.whatsapp_number,
      contributor_level: app.contributor_level || 'LEVEL_1',
      is_profile_completed: false,
      password_hash: password || 'password123',
      created_at: new Date().toISOString(),
      last_active_at: new Date().toISOString()
    };

    memoryStore.contributors.push(newProfile);

    // Mark application as having an account created
    app.account_created = true;

    if (adminDb) {
      await adminDb.collection('contributor_profiles').doc(newProfile.email.toLowerCase()).set(newProfile, { merge: true });
      await adminDb.collection('pioneer_applications').doc(appNum).set({ account_created: true }, { merge: true });
    }

    res.status(201).json({
      success: true,
      message: 'Pioneer account registered successfully!',
      data: sanitize(newProfile)
    });
  } catch (error) {
    next(error);
  }
});

// 2. POST /api/auth/signin (Sign in with email & password)
authRouter.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user: ContributorProfile | undefined;

    if (adminDb) {
      const snap = await adminDb.collection('contributor_profiles').doc(cleanEmail).get();
      if (snap.exists) {
        user = { id: snap.id, ...snap.data() } as ContributorProfile;
      }
    }
    if (!user) {
      user = memoryStore.contributors.find(u => u.email.toLowerCase() === cleanEmail);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No active account found for this email. If you have been accepted, please click "Activate Account".'
      });
    }

    if (user.password_hash && user.password_hash !== password) {
      return res.status(401).json({ success: false, error: 'Invalid password. Please check your credentials.' });
    }

    if (user.is_suspended) {
      return res.status(403).json({
        success: false,
        error: `Your account has been suspended by Administration.${user.suspension_reason ? ` Reason: ${user.suspension_reason}` : ''}`
      });
    }

    // Touch activity
    user.last_active_at = new Date().toISOString();
    user.demoted_due_to_inactivity = false;

    if (adminDb) {
      await adminDb.collection('contributor_profiles').doc(cleanEmail).set({
        last_active_at: user.last_active_at,
        demoted_due_to_inactivity: false
      }, { merge: true });
    }

    res.json({
      success: true,
      message: 'Signed in successfully.',
      data: sanitize(user)
    });
  } catch (error) {
    next(error);
  }
});

// 3. GET /api/auth/contributors (List all contributors - Staff authorized)
authRouter.get(
  '/contributors',
  requireStaffRole(['MANAGER', 'ADMISSIONS_REVIEWER', 'SQUAD_LEAD']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (adminDb) {
        const snap = await adminDb.collection('contributor_profiles').orderBy('created_at', 'desc').get();
        if (!snap.empty) {
          const list = snap.docs.map((doc: any) => sanitize({ id: doc.id, ...doc.data() } as ContributorProfile));
          return res.json({ success: true, count: list.length, data: list });
        }
      }
      const list = memoryStore.contributors.map(sanitize);
      res.json({ success: true, count: list.length, data: list });
    } catch (error) {
      next(error);
    }
  }
);

// 4. PATCH /api/auth/profile (Update / complete contributor profile)
authRouter.patch('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, ...updates } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required to update profile.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const idx = memoryStore.contributors.findIndex(u => u.email.toLowerCase() === cleanEmail);
    let user = idx !== -1 ? memoryStore.contributors[idx] : null;

    if (adminDb && !user) {
      const snap = await adminDb.collection('contributor_profiles').doc(cleanEmail).get();
      if (snap.exists) {
        user = { id: snap.id, ...snap.data() } as ContributorProfile;
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found.' });
    }

    const updatedUser: ContributorProfile = {
      ...user,
      ...updates,
      last_active_at: new Date().toISOString(),
      is_profile_completed: true,
      profile_completed_at: user.profile_completed_at || new Date().toISOString()
    };

    if (idx !== -1) {
      memoryStore.contributors[idx] = updatedUser;
    } else {
      memoryStore.contributors.push(updatedUser);
    }

    if (adminDb) {
      await adminDb.collection('contributor_profiles').doc(cleanEmail).set(updatedUser, { merge: true });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: sanitize(updatedUser)
    });
  } catch (error) {
    next(error);
  }
});

// 5. PATCH /api/auth/suspend & /api/auth/activate (Suspend or reinstate contributor)
authRouter.patch('/suspend', requireStaffRole(['MANAGER']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, reason } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required.' });

    const cleanEmail = email.trim().toLowerCase();
    const user = memoryStore.contributors.find(u => u.email.toLowerCase() === cleanEmail);

    if (user) {
      user.is_suspended = true;
      user.suspension_reason = reason || 'Administrative suspension';
      user.suspended_at = new Date().toISOString();
    }

    if (adminDb) {
      await adminDb.collection('contributor_profiles').doc(cleanEmail).set({
        is_suspended: true,
        suspension_reason: reason || 'Administrative suspension',
        suspended_at: new Date().toISOString()
      }, { merge: true });
    }

    res.json({ success: true, message: `Contributor ${email} has been suspended.` });
  } catch (error) {
    next(error);
  }
});

authRouter.patch('/activate', requireStaffRole(['MANAGER']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required.' });

    const cleanEmail = email.trim().toLowerCase();
    const user = memoryStore.contributors.find(u => u.email.toLowerCase() === cleanEmail);

    if (user) {
      user.is_suspended = false;
      delete user.suspension_reason;
      delete user.suspended_at;
    }

    if (adminDb) {
      await adminDb.collection('contributor_profiles').doc(cleanEmail).set({
        is_suspended: false,
        suspension_reason: null,
        suspended_at: null
      }, { merge: true });
    }

    res.json({ success: true, message: `Contributor ${email} has been activated.` });
  } catch (error) {
    next(error);
  }
});
