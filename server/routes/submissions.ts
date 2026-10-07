import { Router, Request, Response, NextFunction } from 'express';
import { memoryStore, TaskSubmissionRecord, ContributorProfile } from '../store/memoryStore.js';
import { adminDb } from '../config/firebaseAdmin.js';
import { requireStaffRole } from '../middleware/auth.js';

export const submissionsRouter = Router();

// Promotion threshold helper
function calculateNextLevel(verifiedCount: number): 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5' {
  if (verifiedCount >= 10) return 'LEVEL_5';
  if (verifiedCount >= 6) return 'LEVEL_4';
  if (verifiedCount >= 3) return 'LEVEL_3';
  if (verifiedCount >= 1) return 'LEVEL_2';
  return 'LEVEL_1';
}

// 1. GET /api/proofs (List all proof submissions)
submissionsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.query.email as string;

    if (adminDb) {
      let queryRef: any = adminDb.collection('pioneer_proof_of_work').orderBy('created_at', 'desc');
      if (email) {
        queryRef = adminDb.collection('pioneer_proof_of_work').where('email', '==', email.toLowerCase());
      }
      const snap = await queryRef.get();
      if (!snap.empty) {
        const proofs = snap.docs.map((d: any) => ({ reference_id: d.id, ...d.data() }));
        return res.json({ success: true, count: proofs.length, data: proofs });
      }
    }

    let list = memoryStore.submissions;
    if (email) {
      list = list.filter(s => s.email.toLowerCase() === email.toLowerCase());
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    next(error);
  }
});

// 2. POST /api/proofs (Submit deliverable proof of work)
submissionsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { task_id, task_title, division, applicant_name, email, whatsapp_number, deliverable_url, notes } = req.body;

    if (!task_id || !email || !deliverable_url) {
      return res.status(400).json({
        success: false,
        error: 'Task ID, email, and deliverable URL are required.'
      });
    }

    const refId = `POW-${Math.floor(100000 + Math.random() * 900000)}`;
    const submission: TaskSubmissionRecord = {
      reference_id: refId,
      task_id,
      task_title: task_title || 'Squad Mission',
      division: division || 'GROWTH',
      applicant_name: applicant_name || email,
      email: email.trim().toLowerCase(),
      whatsapp_number: whatsapp_number || undefined,
      deliverable_url: deliverable_url.trim(),
      notes: notes || undefined,
      status: 'PENDING_REVIEW',
      created_at: new Date().toISOString()
    };

    memoryStore.submissions.unshift(submission);

    // Touch user activity timestamp
    const user = memoryStore.contributors.find(u => u.email.toLowerCase() === submission.email);
    if (user) {
      user.last_active_at = new Date().toISOString();
      user.demoted_due_to_inactivity = false;
    }

    if (adminDb) {
      await adminDb.collection('pioneer_proof_of_work').doc(refId).set(submission, { merge: true });
      if (user) {
        await adminDb.collection('contributor_profiles').doc(submission.email).set({
          last_active_at: user.last_active_at,
          demoted_due_to_inactivity: false
        }, { merge: true });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Proof of work submitted successfully!',
      data: submission
    });
  } catch (error) {
    next(error);
  }
});

// 3. PATCH /api/proofs/:refId/status (Review / verify proof & advance contributor rank)
submissionsRouter.patch(
  '/:refId/status',
  requireStaffRole(['MANAGER', 'SQUAD_LEAD', 'TASK_VERIFIER']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refId = req.params.refId as string;
      const { status, admin_feedback, awarded_reward, reviewed_by } = req.body;

      let sub = memoryStore.submissions.find(s => s.reference_id === refId);
      if (adminDb && !sub) {
        const snap = await adminDb.collection('pioneer_proof_of_work').doc(refId).get();
        if (snap.exists) {
          sub = { reference_id: snap.id, ...snap.data() } as TaskSubmissionRecord;
        }
      }

      if (!sub) {
        return res.status(404).json({ success: false, error: 'Task submission not found.' });
      }

      sub.status = status || 'VERIFIED';
      sub.admin_feedback = admin_feedback || sub.admin_feedback;
      sub.awarded_reward = awarded_reward || sub.awarded_reward;
      sub.reviewed_by = reviewed_by || 'Admissions Reviewer';
      sub.reviewed_at = new Date().toISOString();

      let newTierEarned: string | null = null;

      // When verified, compute total verified tasks for this contributor and auto-promote if eligible
      if (sub.status === 'VERIFIED') {
        const userAllVerified = memoryStore.submissions.filter(
          s => s.email.toLowerCase() === sub!.email.toLowerCase() && (s.status === 'VERIFIED' || s.reference_id === refId)
        );
        const verifiedCount = userAllVerified.length;
        const targetLevel = calculateNextLevel(verifiedCount);

        const contributor = memoryStore.contributors.find(u => u.email.toLowerCase() === sub!.email.toLowerCase());
        if (contributor && contributor.contributor_level !== targetLevel) {
          contributor.contributor_level = targetLevel;
          newTierEarned = targetLevel;
          if (adminDb) {
            await adminDb.collection('contributor_profiles').doc(sub.email).set({
              contributor_level: targetLevel
            }, { merge: true });
          }
        }
      }

      if (adminDb) {
        await adminDb.collection('pioneer_proof_of_work').doc(refId).set(sub, { merge: true });
      }

      res.json({
        success: true,
        message: `Task submission ${sub.status}.`,
        data: sub,
        tier_advanced: newTierEarned
      });
    } catch (error) {
      next(error);
    }
  }
);
