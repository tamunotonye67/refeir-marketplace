import { Router, Request, Response, NextFunction } from 'express';
import { memoryStore, ApplicationRecord } from '../store/memoryStore.js';
import { adminDb } from '../config/firebaseAdmin.js';
import { requireStaffRole, requireSuperAdmin } from '../middleware/auth.js';

export const applicationsRouter = Router();

// Helper to generate Application ID
function generateAppNumber(): string {
  const randNum = Math.floor(100000 + Math.random() * 900000);
  return `RP-2026-${randNum}`;
}

// Helper to generate Acceptance Code
function generateAcceptanceCode(): string {
  const p1 = Math.floor(1000 + Math.random() * 9000);
  const p2 = Math.floor(1000 + Math.random() * 9000);
  return `ACC-${p1}-${p2}`;
}

// Helper to mint next Pioneer ID
function mintPioneerId(allApps: ApplicationRecord[]): string {
  const numMatches: number[] = [];
  for (const app of allApps) {
    if (app.pioneer_id && /^RP-\d+$/i.test(app.pioneer_id.trim())) {
      const n = parseInt(app.pioneer_id.trim().replace(/^RP-/i, ''), 10);
      if (!isNaN(n)) numMatches.push(n);
    }
  }
  const max = numMatches.length > 0 ? Math.max(...numMatches, 45) : 45;
  return `RP-${String(max + 1).padStart(3, '0')}`;
}

// 1. GET /api/applications (Fetch all applications)
applicationsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (adminDb) {
      const snap = await adminDb.collection('pioneer_applications').orderBy('created_at', 'desc').get();
      if (!snap.empty) {
        const apps = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as ApplicationRecord[];
        return res.json({ success: true, count: apps.length, data: apps });
      }
    }
    return res.json({ success: true, count: memoryStore.applications.length, data: memoryStore.applications });
  } catch (error) {
    next(error);
  }
});

// 2. GET /api/applications/lookup (Check status by App Number or Email)
applicationsRouter.get('/lookup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = ((req.query.q as string) || (req.query.query as string) || '').trim();
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter "q" is required.' });
    }

    const clean = query.toUpperCase();
    const cleanEmail = query.toLowerCase();

    // Check Firestore
    if (adminDb) {
      let snap = await adminDb.collection('pioneer_applications').where('application_number', '==', clean).limit(1).get();
      if (snap.empty) {
        snap = await adminDb.collection('pioneer_applications').where('email', '==', cleanEmail).limit(1).get();
      }
      if (!snap.empty) {
        const app = { id: snap.docs[0].id, ...snap.docs[0].data() } as ApplicationRecord;
        return res.json({ success: true, found: true, data: app });
      }
    }

    // Check local memory store
    const found = memoryStore.applications.find(
      a => a.application_number.toUpperCase() === clean || a.email.toLowerCase() === cleanEmail
    );

    if (found) {
      return res.json({ success: true, found: true, data: found });
    }

    return res.status(404).json({ success: false, found: false, error: 'Application not found.' });
  } catch (error) {
    next(error);
  }
});

// 3. POST /api/applications (Submit application)
applicationsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    if (!body.full_name || !body.email || !body.whatsapp_number) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: full_name, email, and whatsapp_number are mandatory.'
      });
    }

    const appNumber = generateAppNumber();
    const record: ApplicationRecord = {
      id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      application_number: appNumber,
      full_name: body.full_name.trim(),
      email: body.email.trim().toLowerCase(),
      whatsapp_number: body.whatsapp_number.trim(),
      country: body.country || 'Nigeria',
      city: body.city || '',
      roles: Array.isArray(body.roles) ? body.roles : [],
      skills: body.skills || null,
      portfolio_url: body.portfolio_url || null,
      primary_division: body.primary_division || 'GROWTH',
      contribution: body.contribution || null,
      availability: body.availability || '3-5 hours/week',
      motivation: body.motivation || null,
      learning_goals: body.learning_goals || null,
      discovery_source: body.discovery_source || null,
      status: 'PENDING',
      is_founding_100: false,
      contributor_level: 'LEVEL_1',
      created_at: new Date().toISOString()
    };

    memoryStore.applications.unshift(record);

    if (adminDb) {
      await adminDb.collection('pioneer_applications').doc(record.application_number).set(record, { merge: true });
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: record
    });
  } catch (error) {
    next(error);
  }
});

// 4. PATCH /api/applications/:id/status (Review & update status, mint pioneer ID & acceptance code)
applicationsRouter.patch(
  '/:id/status',
  requireStaffRole(['MANAGER', 'ADMISSIONS_REVIEWER']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const { status, contributor_level, is_founding_100, internal_notes } = req.body;

      const idx = memoryStore.applications.findIndex(
        a => a.id === id || a.application_number.toUpperCase() === id.toUpperCase()
      );
      let app = idx !== -1 ? memoryStore.applications[idx] : null;

      let firestoreDocId = id;
      if (adminDb && !app) {
        const snap = await adminDb.collection('pioneer_applications').doc(id).get();
        if (snap.exists) {
          app = { id: snap.id, ...snap.data() } as ApplicationRecord;
          firestoreDocId = snap.id;
        }
      }

      if (!app) {
        return res.status(404).json({ success: false, error: 'Application not found.' });
      }

      const updates: Partial<ApplicationRecord> = {};
      if (status) updates.status = status;
      if (contributor_level) updates.contributor_level = contributor_level;
      if (typeof is_founding_100 === 'boolean') updates.is_founding_100 = is_founding_100;
      if (internal_notes !== undefined) updates.internal_notes = internal_notes;

      // When accepted, generate Acceptance Code and Pioneer ID if not already assigned
      if (status === 'ACCEPTED') {
        if (!app.acceptance_code) {
          updates.acceptance_code = generateAcceptanceCode();
        }
        if (!app.pioneer_id) {
          updates.pioneer_id = mintPioneerId(memoryStore.applications);
        }
      }

      const updated = { ...app, ...updates };

      if (idx !== -1) {
        memoryStore.applications[idx] = updated;
      } else {
        memoryStore.applications.push(updated);
      }

      if (adminDb) {
        await adminDb.collection('pioneer_applications').doc(firestoreDocId).set(updates, { merge: true });
      }

      res.json({
        success: true,
        message: `Application updated to ${updated.status}.`,
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }
);

// 5. DELETE /api/applications/:id (Delete application - Super Admin only)
applicationsRouter.delete('/:id', requireSuperAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    memoryStore.applications = memoryStore.applications.filter(a => a.id !== id && a.application_number !== id);

    if (adminDb) {
      await adminDb.collection('pioneer_applications').doc(id).delete();
    }

    res.json({ success: true, message: 'Application deleted successfully.' });
  } catch (error) {
    next(error);
  }
});
