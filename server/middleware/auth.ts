import { Request, Response, NextFunction } from 'express';
import { memoryStore, StaffMember } from '../store/memoryStore.js';
import { adminDb } from '../config/firebaseAdmin.js';

export interface AuthenticatedStaffRequest extends Request {
  staff?: StaffMember;
}

export async function findStaffMember(emailOrPasscode: string): Promise<StaffMember | null> {
  const clean = emailOrPasscode.trim().toLowerCase();

  // 1. Check in-memory store
  const memFound = memoryStore.staff.find(
    s => s.email.toLowerCase() === clean || s.passcode === clean
  );
  if (memFound && memFound.status === 'ACTIVE') return memFound;

  // 2. Check Firestore if configured
  if (adminDb) {
    try {
      const snap = await adminDb.collection('staff_members').where('email', '==', clean).get();
      if (!snap.empty) {
        const docData = snap.docs[0].data() as StaffMember;
        if (docData.status === 'ACTIVE') return docData;
      }
    } catch {
      // ignore
    }
  }

  return null;
}

export function requireSuperAdmin(
  req: AuthenticatedStaffRequest,
  res: Response,
  next: NextFunction
) {
  const staffRole = req.headers['x-staff-role'] as string;
  const staffEmail = req.headers['x-staff-email'] as string;

  if (staffRole === 'SUPER_ADMIN') {
    return next();
  }

  // Master passcode or super admin email check
  if (staffEmail && staffEmail.toLowerCase() === 'tonye@refeir.com') {
    return next();
  }

  res.status(403).json({
    success: false,
    error: 'Access Denied: Action requires Super Admin authority.'
  });
}

export function requireStaffRole(allowedRoles: string[]) {
  return (req: AuthenticatedStaffRequest, res: Response, next: NextFunction) => {
    const staffRole = (req.headers['x-staff-role'] as string) || '';
    if (staffRole === 'SUPER_ADMIN' || allowedRoles.includes(staffRole)) {
      return next();
    }

    res.status(403).json({
      success: false,
      error: `Access Denied: Role '${staffRole || 'Unknown'}' is not authorized for this operation.`
    });
  };
}
