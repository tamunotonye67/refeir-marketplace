import { Router, Request, Response, NextFunction } from 'express';
import { memoryStore, ContributorProfile } from '../store/memoryStore.js';
import { adminDb, isFirebaseAdminConfigured, checkAdminFirebaseConnection } from '../config/firebaseAdmin.js';

export const governanceRouter = Router();

const INACTIVITY_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

// 1. POST /api/governance/inactivity-check (Execute 14-day inactivity rank withdrawal rule)
governanceRouter.post('/inactivity-check', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const now = Date.now();
    let demotedCount = 0;
    const demotedEmails: string[] = [];

    let users: ContributorProfile[] = memoryStore.contributors;
    if (adminDb) {
      const snap = await adminDb.collection('contributor_profiles').get();
      if (!snap.empty) {
        users = snap.docs.map((d: any) => ({ id: d.id, ...d.data() })) as ContributorProfile[];
      }
    }

    for (const user of users) {
      if (user.contributor_level === 'LEVEL_1') continue;

      let lastActiveMs = 0;
      if (user.last_active_at) {
        const ms = new Date(user.last_active_at).getTime();
        if (!isNaN(ms)) lastActiveMs = ms;
      } else if (user.created_at) {
        const ms = new Date(user.created_at).getTime();
        if (!isNaN(ms)) lastActiveMs = ms;
      }

      const isInactive = lastActiveMs > 0 && (now - lastActiveMs > INACTIVITY_MS);

      if (isInactive) {
        demotedCount++;
        demotedEmails.push(user.email);
        const prevLevel = user.contributor_level;

        user.contributor_level = 'LEVEL_1';
        user.demoted_due_to_inactivity = true;
        user.last_inactivity_demotion_at = new Date().toISOString();
        user.previous_level_before_demotion = prevLevel;

        if (adminDb) {
          await adminDb.collection('contributor_profiles').doc(user.email.toLowerCase()).set({
            contributor_level: 'LEVEL_1',
            demoted_due_to_inactivity: true,
            last_inactivity_demotion_at: user.last_inactivity_demotion_at,
            previous_level_before_demotion: prevLevel
          }, { merge: true });
        }
      }
    }

    res.json({
      success: true,
      evaluated_users: users.length,
      demoted_count: demotedCount,
      demoted_emails: demotedEmails,
      message: demotedCount > 0
        ? `Protocol Governance applied: ${demotedCount} inactive pioneer(s) demoted to Level 1.`
        : 'All active pioneers are within the 14-day activity window.'
    });
  } catch (error) {
    next(error);
  }
});

// 2. GET /api/health (System health & DB connection diagnostics)
governanceRouter.get('/health', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbStatus = await checkAdminFirebaseConnection();
    res.json({
      success: true,
      status: 'ONLINE',
      uptime_seconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database: dbStatus,
      counts: {
        applications: memoryStore.applications.length,
        contributors: memoryStore.contributors.length,
        tasks: memoryStore.tasks.length,
        submissions: memoryStore.submissions.length,
        certificates: memoryStore.certificates.length,
        staff: memoryStore.staff.length
      }
    });
  } catch (error) {
    next(error);
  }
});
