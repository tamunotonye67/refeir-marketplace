import { Router, Request, Response, NextFunction } from 'express';
import { memoryStore, StaffMember } from '../store/memoryStore.js';
import { adminDb } from '../config/firebaseAdmin.js';
import { requireSuperAdmin } from '../middleware/auth.js';

export const staffRouter = Router();

// Staff Role Permissions Helper
function getStaffPermissions(role: string) {
  switch (role) {
    case 'SUPER_ADMIN':
      return {
        canManageStaff: true,
        canReviewApplications: true,
        canDeleteApplications: true,
        canVerifyTasks: true,
        canAnnounceTasks: true,
        canDeleteTasks: true,
        canIssueCertificates: true,
        canRevokeCertificates: true,
        canModifyMemberTier: true,
        canSuspendMembers: true,
        canViewAnalytics: true,
        isReadOnly: false
      };
    case 'MANAGER':
      return {
        canManageStaff: false,
        canReviewApplications: true,
        canDeleteApplications: false,
        canVerifyTasks: true,
        canAnnounceTasks: true,
        canDeleteTasks: false,
        canIssueCertificates: true,
        canRevokeCertificates: false,
        canModifyMemberTier: false,
        canSuspendMembers: true,
        canViewAnalytics: true,
        isReadOnly: false
      };
    case 'ADMISSIONS_REVIEWER':
      return {
        canManageStaff: false,
        canReviewApplications: true,
        canDeleteApplications: false,
        canVerifyTasks: false,
        canAnnounceTasks: false,
        canDeleteTasks: false,
        canIssueCertificates: false,
        canRevokeCertificates: false,
        canModifyMemberTier: false,
        canSuspendMembers: false,
        canViewAnalytics: false,
        isReadOnly: false
      };
    case 'SQUAD_LEAD':
      return {
        canManageStaff: false,
        canReviewApplications: false,
        canDeleteApplications: false,
        canVerifyTasks: true,
        canAnnounceTasks: true,
        canDeleteTasks: false,
        canIssueCertificates: false,
        canRevokeCertificates: false,
        canModifyMemberTier: false,
        canSuspendMembers: false,
        canViewAnalytics: false,
        isReadOnly: false
      };
    case 'TASK_VERIFIER':
      return {
        canManageStaff: false,
        canReviewApplications: false,
        canDeleteApplications: false,
        canVerifyTasks: true,
        canAnnounceTasks: false,
        canDeleteTasks: false,
        canIssueCertificates: false,
        canRevokeCertificates: false,
        canModifyMemberTier: false,
        canSuspendMembers: false,
        canViewAnalytics: false,
        isReadOnly: false
      };
    case 'TASK_VIEWER':
      return {
        canManageStaff: false,
        canReviewApplications: false,
        canDeleteApplications: false,
        canVerifyTasks: false,
        canAnnounceTasks: false,
        canDeleteTasks: false,
        canIssueCertificates: false,
        canRevokeCertificates: false,
        canModifyMemberTier: false,
        canSuspendMembers: false,
        canViewAnalytics: false,
        isReadOnly: true
      };
    default:
      return {
        canManageStaff: false,
        canReviewApplications: false,
        canDeleteApplications: false,
        canVerifyTasks: false,
        canAnnounceTasks: false,
        canDeleteTasks: false,
        canIssueCertificates: false,
        canRevokeCertificates: false,
        canModifyMemberTier: false,
        canSuspendMembers: false,
        canViewAnalytics: false,
        isReadOnly: true
      };
  }
}

// 1. POST /api/staff/login (Authenticate staff member)
staffRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, passcode } = req.body;

    let matched: StaffMember | undefined;

    // Master passcode check
    if (passcode && passcode.trim() === 'refeir2026') {
      matched = memoryStore.staff.find(s => s.role === 'SUPER_ADMIN') || memoryStore.staff[0];
    }

    if (!matched && email && password) {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      // Check Firestore
      if (adminDb) {
        const snap = await adminDb.collection('staff_members').where('email', '==', cleanEmail).limit(1).get();
        if (!snap.empty) {
          const docData = snap.docs[0].data() as StaffMember;
          if (docData.password === cleanPassword && docData.status === 'ACTIVE') {
            matched = { ...docData, id: snap.docs[0].id };
          }
        }
      }

      if (!matched) {
        matched = memoryStore.staff.find(
          s => s.email.toLowerCase() === cleanEmail && s.password === cleanPassword && s.status === 'ACTIVE'
        );
      }
    }

    if (!matched && passcode) {
      const cleanPasscode = passcode.trim();
      matched = memoryStore.staff.find(s => s.passcode === cleanPasscode && s.status === 'ACTIVE');
    }

    if (!matched) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Please verify your email, password, or security passcode.'
      });
    }

    const permissions = getStaffPermissions(matched.role);

    res.json({
      success: true,
      message: `Welcome, ${matched.name}! Authenticated as ${matched.role}.`,
      staff: {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        role: matched.role,
        assigned_division: matched.assigned_division,
        reviews_count: matched.reviews_count,
        permissions
      }
    });
  } catch (error) {
    next(error);
  }
});

// 2. GET /api/staff (List staff directory - Super Admin only)
staffRouter.get('/', requireSuperAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (adminDb) {
      const snap = await adminDb.collection('staff_members').get();
      if (!snap.empty) {
        const staff = snap.docs.map((d: any) => ({ id: d.id, ...d.data() })) as StaffMember[];
        return res.json({ success: true, count: staff.length, data: staff });
      }
    }
    res.json({ success: true, count: memoryStore.staff.length, data: memoryStore.staff });
  } catch (error) {
    next(error);
  }
});

// 3. POST /api/staff (Add new staff member - Super Admin only)
staffRouter.post('/', requireSuperAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, role, assigned_division, passcode, password } = req.body;

    if (!name || !email || !role || !passcode) {
      return res.status(400).json({ success: false, error: 'Name, email, role, and passcode are required.' });
    }

    const newStaff: StaffMember = {
      id: `staff-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      assigned_division: assigned_division || 'ALL',
      passcode: passcode.trim(),
      password: password?.trim() || `${name.replace(/\s+/g, '')}@2026!`,
      status: 'ACTIVE',
      reviews_count: 0,
      added_at: new Date().toISOString()
    };

    memoryStore.staff.push(newStaff);

    if (adminDb) {
      await adminDb.collection('staff_members').doc(newStaff.id).set(newStaff, { merge: true });
    }

    res.status(201).json({ success: true, message: 'Staff member added successfully.', data: newStaff });
  } catch (error) {
    next(error);
  }
});

// 4. PATCH /api/staff/:id (Update role, division, password, passcode, or status - Super Admin only)
staffRouter.patch('/:id', requireSuperAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const updates = req.body;

    const idx = memoryStore.staff.findIndex(s => s.id === id);
    if (idx !== -1) {
      memoryStore.staff[idx] = { ...memoryStore.staff[idx], ...updates };
    }

    if (adminDb) {
      await adminDb.collection('staff_members').doc(id).set(updates, { merge: true });
    }

    res.json({ success: true, message: 'Staff member updated successfully.' });
  } catch (error) {
    next(error);
  }
});

// 5. DELETE /api/staff/:id (Delete staff member - Super Admin only)
staffRouter.delete('/:id', requireSuperAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    memoryStore.staff = memoryStore.staff.filter(s => s.id !== id);

    if (adminDb) {
      await adminDb.collection('staff_members').doc(id).delete();
    }

    res.json({ success: true, message: 'Staff member removed successfully.' });
  } catch (error) {
    next(error);
  }
});
