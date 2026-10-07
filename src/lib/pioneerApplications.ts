import { db, isFirebaseConfigured } from './firebase';
import { collection, doc, getDocs, setDoc, query, orderBy } from 'firebase/firestore';

export type PioneerReviewStatus = 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'WAITLISTED' | 'REJECTED';
export type ContributorTier = 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5';

export interface PioneerApplicationRecord {
  id: string;
  application_number: string;
  full_name: string;
  email: string;
  whatsapp_number: string;
  country: string;
  city?: string | null;
  roles: string[];
  skills?: string | null;
  portfolio_url?: string | null;
  primary_division?: string | null;
  contribution?: string | null;
  availability?: string | null;
  motivation?: string | null;
  learning_goals?: string | null;
  discovery_source?: string | null;
  status: PioneerReviewStatus;
  contributor_level?: ContributorTier;
  is_founding_100: boolean;
  pioneer_id?: string | null;
  acceptance_code?: string | null;
  account_created?: boolean;
  internal_notes?: string | null;
  created_at: string;
}

const APPS_STORAGE_KEY = 'refeir_pioneer_applications_v2';

// Seed demo applications with Acceptance Codes for ACCEPTED members
export const INITIAL_DEMO_APPLICATIONS: PioneerApplicationRecord[] = [
  {
    id: 'app-demo-1',
    application_number: 'RP-2026-849201',
    full_name: 'Chidubem Nwosu',
    email: 'chidubem.nwosu@example.com',
    whatsapp_number: '+2348031234567',
    country: 'Nigeria',
    city: 'Lagos',
    roles: ['Developer', 'Product'],
    skills: 'TypeScript, React, Node.js, Smart Contract Escrows, PostgreSQL',
    portfolio_url: 'https://github.com/chidubem-demo',
    primary_division: 'TECH_PRODUCT',
    contribution: 'Want to build and audit the smart contract milestone escrow system.',
    availability: '6–10 hours/week',
    motivation: 'Africa needs decentralized trust infrastructure to unlock cross-border freelance payouts.',
    learning_goals: 'Deep dive into decentralized referral loops and tokenomics.',
    discovery_source: 'Twitter / X',
    status: 'ACCEPTED',
    contributor_level: 'LEVEL_3',
    is_founding_100: true,
    pioneer_id: 'RP-012',
    acceptance_code: 'ACC-8492-9041',
    account_created: false,
    internal_notes: 'Strong fullstack candidate. Approved for Tech & Product squad. Delivered smart escrow contract tests.',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: 'app-demo-2',
    application_number: 'RP-2026-612948',
    full_name: 'Amina Kimani',
    email: 'amina.k@example.com',
    whatsapp_number: '+254712345678',
    country: 'Kenya',
    city: 'Nairobi',
    roles: ['Designer'],
    skills: 'Figma, UI/UX, Design Systems, Mobile Interaction Design',
    portfolio_url: 'https://dribbble.com/amina-demo',
    primary_division: 'CREATIVE',
    contribution: 'Crafting the mobile app UI component library and freelancer profile screens.',
    availability: '3–5 hours/week',
    motivation: 'Excited about shaping the visual identity and usability of Refeir.',
    learning_goals: 'Leading design critique sessions with fellow African designers.',
    discovery_source: 'LinkedIn',
    status: 'ACCEPTED',
    contributor_level: 'LEVEL_2',
    is_founding_100: true,
    pioneer_id: 'RP-028',
    acceptance_code: 'ACC-6129-3319',
    account_created: false,
    internal_notes: 'High-quality portfolio. Submitted pioneer mobile design mocks.',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'app-demo-3',
    application_number: 'RP-2026-492019',
    full_name: 'Kwame Mensah',
    email: 'kwame.mensah@example.com',
    whatsapp_number: '+233241234567',
    country: 'Ghana',
    city: 'Accra',
    roles: ['Marketer', 'Community Builder'],
    skills: 'Viral loops, Campus Ambassador Growth, Content Strategy',
    portfolio_url: 'https://linkedin.com/in/kwame-demo',
    primary_division: 'GROWTH',
    contribution: 'Organizing campus developer orientation hackathons across Ghanaian universities.',
    availability: '5–8 hours/week',
    motivation: 'Refeir can solve graduate underemployment by turning student networks into economic assets.',
    learning_goals: 'Mastering viral referral design and Web3 community growth frameworks.',
    discovery_source: 'University Campus Club',
    status: 'ACCEPTED',
    contributor_level: 'LEVEL_2',
    is_founding_100: true,
    pioneer_id: 'RP-045',
    acceptance_code: 'ACC-4920-7712',
    account_created: true,
    internal_notes: 'Campus ambassador and developer advocate in Accra.',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 'app-demo-4',
    application_number: 'RP-2026-728193',
    full_name: 'Thabo Mokoena',
    email: 'thabo.m@example.com',
    whatsapp_number: '+27821234567',
    country: 'South Africa',
    city: 'Johannesburg',
    roles: ['Business Developer', 'Entrepreneur'],
    skills: 'B2B Sales, Fintech Partnerships, Legal Frameworks',
    portfolio_url: 'https://linkedin.com/in/thabo-demo',
    primary_division: 'BUSINESS',
    contribution: 'Connecting Refeir with South African venture studios and tech agencies for pilot jobs.',
    availability: '3–5 hours/week',
    motivation: 'Refeir’s referral model solves the trust deficit between foreign clients and African talent.',
    learning_goals: 'Exploring cross-border fiat-to-stablecoin rails.',
    discovery_source: 'TechCabal Article',
    status: 'PENDING',
    contributor_level: 'LEVEL_1',
    is_founding_100: false,
    pioneer_id: null,
    acceptance_code: null,
    account_created: false,
    internal_notes: '',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString()
  }
];

export const generateApplicationNumber = (): string => {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `RP-2026-${timestamp}${random}`.slice(0, 15);
};

export const getStoredApplications = (): PioneerApplicationRecord[] => {
  const data = localStorage.getItem(APPS_STORAGE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // ignore
    }
  }
  localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_APPLICATIONS));
  return INITIAL_DEMO_APPLICATIONS;
};

export const saveStoredApplications = (apps: PioneerApplicationRecord[]) => {
  localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(apps));
};

export const addStoredApplication = (record: Omit<PioneerApplicationRecord, 'id' | 'created_at'> & { id?: string; created_at?: string }) => {
  const apps = getStoredApplications();
  const fullRecord: PioneerApplicationRecord = {
    ...record,
    id: record.id || `app-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    created_at: record.created_at || new Date().toISOString()
  };
  const existingIndex = apps.findIndex(
    a => a.application_number.toUpperCase() === fullRecord.application_number.toUpperCase()
  );
  if (existingIndex >= 0) {
    apps[existingIndex] = { ...apps[existingIndex], ...fullRecord };
  } else {
    apps.unshift(fullRecord);
  }
  saveStoredApplications(apps);

  // Sync to Firebase Firestore directly
  if (isFirebaseConfigured) {
    const docId = fullRecord.application_number.toUpperCase();
    setDoc(doc(db, 'pioneer_applications', docId), fullRecord, { merge: true }).catch((err: any) => {
      console.warn('Firestore application save error:', err);
    });
  }
};

export const generateAcceptanceCode = (_appNumber?: string): string => {
  const p1 = Math.floor(1000 + Math.random() * 9000);
  const p2 = Math.floor(1000 + Math.random() * 9000);
  return `ACC-${p1}-${p2}`;
};

export const updateStoredApplication = (
  idOrAppNumber: string,
  updates: Partial<PioneerApplicationRecord>
): PioneerApplicationRecord | null => {
  const apps = getStoredApplications();
  let updatedApp: PioneerApplicationRecord | null = null;

  const modified = apps.map(app => {
    if (
      app.id === idOrAppNumber ||
      app.application_number.toUpperCase() === idOrAppNumber.toUpperCase()
    ) {
      let accCode = app.acceptance_code;
      if (updates.status === 'ACCEPTED' && !accCode) {
        accCode = generateAcceptanceCode();
      }

      let pId = app.pioneer_id;
      if (updates.status === 'ACCEPTED' && !pId) {
        const numbers = apps.map(a => {
          const s = a.pioneer_id || '';
          const match = s.match(/RP-(\d+)/i);
          return match ? parseInt(match[1], 10) : 0;
        });
        const maxNum = numbers.length > 0 ? Math.max(...numbers, 45) : 45;
        pId = `RP-${String(maxNum + 1).padStart(3, '0')}`;
      }

      updatedApp = {
        ...app,
        ...updates,
        acceptance_code: accCode,
        pioneer_id: pId
      };
      return updatedApp;
    }
    return app;
  });

  if (updatedApp) {
    const finalApp: PioneerApplicationRecord = updatedApp;
    saveStoredApplications(modified);

    // Sync to Firebase Firestore directly
    if (isFirebaseConfigured) {
      const docId = (finalApp.application_number || idOrAppNumber).toUpperCase();
      setDoc(doc(db, 'pioneer_applications', docId), finalApp, { merge: true }).catch((err: any) => {
        console.warn('Firestore updateStoredApplication error:', err);
      });
    }
  }
  return updatedApp;
};

export const findApplicationByLookup = (query: string): PioneerApplicationRecord | null => {
  const clean = query.trim().toLowerCase();
  if (!clean) return null;
  const apps = getStoredApplications();
  return apps.find(a =>
    a.application_number.toLowerCase() === clean ||
    a.email.toLowerCase() === clean
  ) || null;
};

export const validateAcceptanceCredentials = (
  applicationNumber: string,
  acceptanceCode: string,
  _pioneerId?: string
): { valid: boolean; error?: string; application?: PioneerApplicationRecord } => {
  const cleanAppNum = applicationNumber.trim().toUpperCase();
  const cleanAccCode = acceptanceCode.trim().toUpperCase();

  if (!cleanAppNum) {
    return { valid: false, error: 'Application ID is required.' };
  }
  if (!cleanAccCode) {
    return { valid: false, error: 'Acceptance Code is required.' };
  }

  const apps = getStoredApplications();
  const app = apps.find(a => a.application_number.toUpperCase() === cleanAppNum);

  if (!app) {
    return {
      valid: false,
      error: `No application found for ID "${cleanAppNum}". Please verify your Application ID.`
    };
  }

  if (app.status !== 'ACCEPTED') {
    return {
      valid: false,
      error: `Application ${cleanAppNum} is currently ${app.status}. You cannot sign up until your application has been officially ACCEPTED by the Admissions Committee.`
    };
  }

  if (!app.acceptance_code || app.acceptance_code.trim().toUpperCase() !== cleanAccCode) {
    return {
      valid: false,
      error: `The Acceptance Code provided is invalid for Application ${cleanAppNum}. Please check your acceptance letter or use the "Check Status" tool.`
    };
  }

  return { valid: true, application: app };
};

export const generateNextPioneerId = (): string => {
  const apps = getStoredApplications();
  let maxId = 50;
  for (const a of apps) {
    if (a.pioneer_id && a.pioneer_id.startsWith('RP-')) {
      const num = parseInt(a.pioneer_id.replace('RP-', ''), 10);
      if (!isNaN(num) && num > maxId) {
        maxId = num;
      }
    }
  }
  const nextNum = maxId + 1;
  return `RP-${String(nextNum).padStart(3, '0')}`;
};

/**
 * Fetches applications from Cloud Firestore directly and updates local cache.
 */
export const fetchApplicationsFromDatabase = async (): Promise<PioneerApplicationRecord[]> => {
  if (!isFirebaseConfigured) {
    return getStoredApplications();
  }

  try {
    const q = query(collection(db, 'pioneer_applications'), orderBy('created_at', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const records: PioneerApplicationRecord[] = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      } as PioneerApplicationRecord));

      saveStoredApplications(records);
      return records;
    }
  } catch (err) {
    console.warn('Could not query applications from Firestore:', err);
  }

  return getStoredApplications();
};

export const syncApplicationsToFirebase = async (): Promise<{ success: boolean; count: number; error?: string }> => {
  if (!isFirebaseConfigured) {
    return { success: false, count: 0, error: 'Firebase credentials not configured' };
  }

  const apps = getStoredApplications();
  try {
    for (const app of apps) {
      const docId = app.application_number.toUpperCase();
      await setDoc(doc(db, 'pioneer_applications', docId), app, { merge: true });
    }
    return { success: true, count: apps.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'Sync failed' };
  }
};

export const syncApplicationsToSupabase = syncApplicationsToFirebase;
