import { Router, Request, Response, NextFunction } from 'express';
import { memoryStore, PioneerCertificate } from '../store/memoryStore.js';
import { adminDb } from '../config/firebaseAdmin.js';
import { requireStaffRole, requireSuperAdmin } from '../middleware/auth.js';

export const certificatesRouter = Router();

const TIER_NAMES: Record<string, string> = {
  LEVEL_1: 'Refeir Member',
  LEVEL_2: 'Verified Contributor',
  LEVEL_3: 'Squad Builder',
  LEVEL_4: 'Ecosystem Architect',
  LEVEL_5: 'Refeir Fellow'
};

// 1. GET /api/certificates (Fetch certificates, filter by email or verify by cert number)
certificatesRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.query.email as string;
    const certNum = req.query.certNumber as string;

    if (adminDb) {
      let queryRef: any = adminDb.collection('pioneer_certificates').orderBy('issued_at', 'desc');
      if (certNum) {
        queryRef = adminDb.collection('pioneer_certificates').where('certificate_number', '==', certNum.toUpperCase());
      } else if (email) {
        queryRef = adminDb.collection('pioneer_certificates').where('pioneer_email', '==', email.toLowerCase());
      }
      const snap = await queryRef.get();
      if (!snap.empty) {
        const certs = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
        return res.json({ success: true, count: certs.length, data: certs });
      }
    }

    let list = memoryStore.certificates;
    if (certNum) {
      list = list.filter(c => c.certificate_number.toUpperCase() === certNum.toUpperCase());
    } else if (email) {
      list = list.filter(c => c.pioneer_email.toLowerCase() === email.toLowerCase());
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    next(error);
  }
});

// 2. POST /api/certificates (Issue new milestone certificate)
certificatesRouter.post(
  '/',
  requireStaffRole(['MANAGER']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pioneer_name, pioneer_email, pioneer_id, division, tier_completed, issued_by, metadata } = req.body;

      if (!pioneer_name || !pioneer_email || !tier_completed) {
        return res.status(400).json({
          success: false,
          error: 'Pioneer name, email, and tier are required.'
        });
      }

      const certNumber = `CERT-RP-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCert: PioneerCertificate = {
        id: `cert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        certificate_number: certNumber,
        pioneer_name: pioneer_name.trim(),
        pioneer_email: pioneer_email.trim().toLowerCase(),
        pioneer_id: pioneer_id || 'RP-PIONEER',
        division: division || 'GROWTH',
        tier_completed,
        tier_name: TIER_NAMES[tier_completed] || 'Refeir Member',
        issued_at: new Date().toISOString(),
        issued_by: issued_by || 'Refeir Pioneer Admissions Council',
        verified: true,
        metadata: metadata || { total_deliverables: 1 }
      };

      memoryStore.certificates.unshift(newCert);

      if (adminDb) {
        await adminDb.collection('pioneer_certificates').doc(newCert.id).set(newCert, { merge: true });
      }

      res.status(201).json({
        success: true,
        message: `Certificate ${certNumber} issued successfully!`,
        data: newCert
      });
    } catch (error) {
      next(error);
    }
  }
);

// 3. DELETE /api/certificates/:id (Revoke certificate - Super Admin only)
certificatesRouter.delete('/:id', requireSuperAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    memoryStore.certificates = memoryStore.certificates.filter(c => c.id !== id && c.certificate_number !== id);

    if (adminDb) {
      await adminDb.collection('pioneer_certificates').doc(id).delete();
    }

    res.json({ success: true, message: 'Certificate revoked successfully.' });
  } catch (error) {
    next(error);
  }
});
