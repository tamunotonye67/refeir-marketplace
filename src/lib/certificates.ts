import { ContributorProfile } from './contributorAuth';
import { db, isFirebaseConfigured } from './firebase';
import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';

export type ContributorTier = 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5';

export interface PioneerCertificate {
  id: string; // e.g. "CERT-RF-2026-90412"
  pioneer_id: string; // "RP-034"
  application_number: string;
  recipient_name: string;
  recipient_email: string;
  level: ContributorTier;
  level_title: string; // "Level 2: Refeir Pioneer"
  division: string;
  verified_jobs_count: number;
  issued_at: string;
  issued_by: string;
  special_distinction?: string;
  verification_hash: string;
  status: 'ISSUED' | 'REVOKED';
  revocation_reason?: string;
}

export const LEVEL_NAMES: Record<ContributorTier, string> = {
  LEVEL_1: 'Level 1: Pioneer Associate',
  LEVEL_2: 'Level 2: Refeir Pioneer',
  LEVEL_3: 'Level 3: Refeir Builder',
  LEVEL_4: 'Level 4: Refeir Lead',
  LEVEL_5: 'Level 5: Refeir Core Team'
};

export const LEVEL_DESCRIPTIONS: Record<ContributorTier, string> = {
  LEVEL_1: 'Orientation & Verified Sovereign Pioneer Credential',
  LEVEL_2: 'Consistent Sprint Execution & Tangible Squad Deliverables',
  LEVEL_3: 'Sustained Engineering, Design, or Growth Impact & Peer Endorsement',
  LEVEL_4: 'Squad Architecture, Cross-functional Leadership & Milestone Governance',
  LEVEL_5: 'Protocol Ownership, Strategic Roadmap Execution & Sovereign Network Stewardship'
};

const CERTIFICATES_STORAGE_KEY = 'refeir_certificates_v1';

// Initial realistic certificates for preview
const INITIAL_DEMO_CERTIFICATES: PioneerCertificate[] = [
  {
    id: 'CERT-RF-2026-8091',
    pioneer_id: 'RP-034',
    application_number: 'RP-2026-881920',
    recipient_name: 'Chioma Okafor',
    recipient_email: 'chioma.okafor@example.com',
    level: 'LEVEL_2',
    level_title: 'Level 2: Refeir Pioneer',
    division: 'DESIGN',
    verified_jobs_count: 16,
    issued_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    issued_by: 'Tonye Taylor (Platform Architect & Founder)',
    special_distinction: 'Founding 100 Cohort Distinction • Outstanding UI Architecture',
    verification_hash: '0x8f2a49b671c890123d4e5f67a8b9c0d1e2f3a4b5',
    status: 'ISSUED'
  },
  {
    id: 'CERT-RF-2026-8090',
    pioneer_id: 'RP-034',
    application_number: 'RP-2026-881920',
    recipient_name: 'Chioma Okafor',
    recipient_email: 'chioma.okafor@example.com',
    level: 'LEVEL_1',
    level_title: 'Level 1: Pioneer Associate',
    division: 'DESIGN',
    verified_jobs_count: 0,
    issued_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    issued_by: 'Refeir Admissions Committee',
    special_distinction: 'Founding Cohort Orientation & Sovereign Identity Accreditation',
    verification_hash: '0x3c7e91a25b4f80164c2d3e4f5a6b7c8d9e0f1a2b',
    status: 'ISSUED'
  },
  {
    id: 'CERT-RF-2026-7241',
    pioneer_id: 'RP-012',
    application_number: 'RP-2026-849201',
    recipient_name: 'Chidubem Nwosu',
    recipient_email: 'chidubem.nwosu@example.com',
    level: 'LEVEL_2',
    level_title: 'Level 2: Refeir Pioneer',
    division: 'TECHNOLOGY',
    verified_jobs_count: 18,
    issued_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    issued_by: 'Tonye Taylor (Platform Architect & Founder)',
    special_distinction: 'Smart Contract Escrow Infrastructure Lead',
    verification_hash: '0x7e8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
    status: 'ISSUED'
  },
  {
    id: 'CERT-RF-2026-7240',
    pioneer_id: 'RP-012',
    application_number: 'RP-2026-849201',
    recipient_name: 'Chidubem Nwosu',
    recipient_email: 'chidubem.nwosu@example.com',
    level: 'LEVEL_1',
    level_title: 'Level 1: Pioneer Associate',
    division: 'TECHNOLOGY',
    verified_jobs_count: 0,
    issued_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    issued_by: 'Refeir Admissions Committee',
    special_distinction: 'Founding Cohort Orientation & Sovereign Identity Accreditation',
    verification_hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    status: 'ISSUED'
  }
];

export function getAllCertificates(): PioneerCertificate[] {
  const data = localStorage.getItem(CERTIFICATES_STORAGE_KEY);
  if (data) {
    try {
      const parsed: PioneerCertificate[] = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // ignore
    }
  }
  localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_CERTIFICATES));
  return INITIAL_DEMO_CERTIFICATES;
}

export async function fetchCertificatesFromDatabase(): Promise<PioneerCertificate[]> {
  if (isFirebaseConfigured) {
    try {
      const colRef = collection(db, 'pioneer_certificates');
      const snapshot = await getDocs(colRef);
      if (!snapshot.empty) {
        const certs: PioneerCertificate[] = snapshot.docs.map(d => ({
          ...(d.data() as PioneerCertificate),
          id: d.id
        }));
        localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(certs));
        return certs;
      }
    } catch (err) {
      console.warn('Firebase certificates fetch notice:', err);
    }
  }

  return getAllCertificates();
}

export async function syncCertificatesToFirebase(): Promise<{ synced: number; error: string | null }> {
  if (!isFirebaseConfigured) {
    return { synced: 0, error: 'Firebase is not configured in .env' };
  }

  try {
    const localCerts = getAllCertificates();
    let synced = 0;
    for (const c of localCerts) {
      const docRef = doc(db, 'pioneer_certificates', c.id);
      await setDoc(docRef, c, { merge: true });
      synced++;
    }
    return { synced, error: null };
  } catch (err: any) {
    console.error('Firebase certificates sync failed:', err);
    return { synced: 0, error: err?.message || 'Sync failed' };
  }
}

export const syncCertificatesToSupabase = syncCertificatesToFirebase;

export function getCertificatesByEmail(email: string): PioneerCertificate[] {
  if (!email) return [];
  const all = getAllCertificates();
  return all.filter(c => c.recipient_email.toLowerCase() === email.toLowerCase());
}

export function getCertificateById(id: string): PioneerCertificate | undefined {
  const all = getAllCertificates();
  return all.find(c => c.id === id);
}

function generateVerificationHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 40; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

export function issueCertificate(params: {
  pioneer_id?: string;
  application_number?: string;
  recipient_name: string;
  recipient_email: string;
  level: ContributorTier;
  division?: string;
  verified_jobs_count?: number;
  issued_by?: string;
  special_distinction?: string;
}): PioneerCertificate {
  const all = getAllCertificates();

  // Check if certificate already exists for this email & level
  const existing = all.find(
    c =>
      c.recipient_email.toLowerCase() === params.recipient_email.toLowerCase() &&
      c.level === params.level &&
      c.status === 'ISSUED'
  );
  if (existing) {
    return existing;
  }

  const serial = Math.floor(1000 + Math.random() * 9000);
  const newCert: PioneerCertificate = {
    id: `CERT-RF-2026-${serial}`,
    pioneer_id: params.pioneer_id || 'RP-PENDING',
    application_number: params.application_number || `RP-2026-${serial}`,
    recipient_name: params.recipient_name,
    recipient_email: params.recipient_email.toLowerCase(),
    level: params.level,
    level_title: LEVEL_NAMES[params.level] || params.level,
    division: params.division || 'GENERAL',
    verified_jobs_count: params.verified_jobs_count || 0,
    issued_at: new Date().toISOString(),
    issued_by: params.issued_by || 'Tonye Taylor (Platform Architect & Founder)',
    special_distinction: params.special_distinction || 'Founding Pioneer Accreditations & Verified Proof-of-Work Deliverables',
    verification_hash: generateVerificationHash(),
    status: 'ISSUED'
  };

  const updated = [newCert, ...all];
  localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(updated));

  // Sync to Firebase Firestore directly
  if (isFirebaseConfigured) {
    const docRef = doc(db, 'pioneer_certificates', newCert.id);
    setDoc(docRef, newCert, { merge: true }).catch(err => {
      console.warn('Firebase certificate issue notice:', err);
    });
  }

  return newCert;
}

export function revokeCertificate(id: string, reason: string): PioneerCertificate | undefined {
  const all = getAllCertificates();
  let targetCert: PioneerCertificate | undefined;

  const updated = all.map(c => {
    if (c.id === id) {
      targetCert = {
        ...c,
        status: 'REVOKED' as const,
        revocation_reason: reason || 'Administrative decision'
      };
      return targetCert;
    }
    return c;
  });

  localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(updated));

  if (isFirebaseConfigured && targetCert) {
    const docRef = doc(db, 'pioneer_certificates', id);
    updateDoc(docRef, {
      status: 'REVOKED',
      revocation_reason: reason || 'Administrative decision'
    }).catch(err => {
      console.warn('Firebase certificate revoke notice:', err);
    });
  }

  return targetCert;
}

// Auto-mint Level 1 Certificate when member completes onboarding profile
export function ensureLevel1Certificate(profile: ContributorProfile): PioneerCertificate {
  return issueCertificate({
    pioneer_id: profile.pioneer_id,
    application_number: profile.application_number,
    recipient_name: profile.full_name,
    recipient_email: profile.email,
    level: 'LEVEL_1',
    division: profile.division,
    verified_jobs_count: 0,
    issued_by: 'Refeir Admissions Committee & Protocol Stewards',
    special_distinction: 'Founding Cohort Orientation & Sovereign Identity Accreditation'
  });
}
