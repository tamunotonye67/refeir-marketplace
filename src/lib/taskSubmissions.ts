import { db, isFirebaseConfigured } from './firebase';
import { collection, doc, getDocs, setDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { issueCertificate } from './certificates';
import { touchContributorActivity } from './contributorAuth';

export interface ScreenshotAttachment {
  id: string;
  data_url: string;
  name: string;
  size?: number;
  caption?: string;
}

export interface TaskSubmissionRecord {
  id: string;
  reference_id: string;
  full_name: string;
  email: string;
  application_number: string;
  pioneer_id: string;
  division: string;
  target_level: 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5';
  task_title: string;
  task_category: string;
  task_description: string;
  deliverable_url?: string;
  additional_url?: string;
  screenshots: ScreenshotAttachment[];
  status: 'PENDING' | 'VERIFIED' | 'NEEDS_REVISION' | 'REJECTED';
  admin_feedback?: string;
  created_at: string;
}

export const MIN_JOBS_FOR_PROMOTION: Record<'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5', number> = {
  LEVEL_1: 0,
  LEVEL_2: 15,  // Minimum 15 verified jobs required to advance to Refeir Pioneer (5x quota)
  LEVEL_3: 40,  // Minimum 40 verified jobs required to advance to Refeir Builder (5x quota)
  LEVEL_4: 75,  // Minimum 75 verified jobs required to advance to Refeir Lead (5x quota)
  LEVEL_5: 125  // Minimum 125 verified jobs required to advance to Refeir Core Team (5x quota)
};

const STORAGE_KEY = 'refeir_task_submissions_v1';

// Initial Demo Submissions for instant preview
const INITIAL_DEMO_TASKS: TaskSubmissionRecord[] = [
  {
    id: 'tsk-demo-1',
    reference_id: 'POW-2026-90412',
    full_name: 'Chioma Okafor',
    email: 'chioma.okafor@example.com',
    application_number: 'RP-2026-881920',
    pioneer_id: 'RP-034',
    division: 'DESIGN',
    target_level: 'LEVEL_2',
    task_title: 'Designed Mobile Escrow & Milestone Payment Components',
    task_category: 'UI/UX & Product Design',
    task_description: 'Designed 6 high-fidelity mobile prototype frames for milestone payments and disputes, adopting the Refeir Sovereign Forest Green (#0F2E1E) palette.',
    deliverable_url: 'https://figma.com/@chioma-demo/refeir-escrow',
    additional_url: 'https://dribbble.com/shots/refeir-preview',
    screenshots: [
      {
        id: 'img-1',
        name: 'refeir_escrow_mockup.png',
        data_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360"><rect width="600" height="360" fill="%230F2E1E"/><rect x="20" y="20" width="560" height="320" rx="16" fill="%23122B1A" stroke="%2366BB2A" stroke-width="2"/><text x="40" y="60" fill="%2318FC5C" font-family="sans-serif" font-size="20" font-weight="bold">Refeir Escrow UI Component System</text><text x="40" y="95" fill="%23FFFFFF" font-family="sans-serif" font-size="14" opacity="0.8">Designer: Chioma Okafor | Division: Product &amp; Design</text><rect x="40" y="120" width="240" height="180" rx="12" fill="%2307180F" stroke="%232E7D32" stroke-width="1.5"/><text x="60" y="160" fill="%2366BB2A" font-family="sans-serif" font-size="16">Milestone Contract</text><text x="60" y="190" fill="%23FFFFFF" font-family="sans-serif" font-size="13">Budget: $1,200 USDC</text><text x="60" y="220" fill="%2318FC5C" font-family="sans-serif" font-size="12">&#x2713; Work Verified &amp; Signed</text><rect x="300" y="120" width="260" height="180" rx="12" fill="%2307180F" stroke="%232E7D32" stroke-width="1.5"/><text x="320" y="160" fill="%23F6B21A" font-family="sans-serif" font-size="16">Dispute Mediation</text><text x="320" y="190" fill="%23FFFFFF" font-family="sans-serif" font-size="13">Peer Arbiter: 3/3 Consensus</text><text x="320" y="220" fill="%23F47C20" font-family="sans-serif" font-size="12">Automatic payout executed</text></svg>',
        caption: 'High-fidelity escrow payment & dispute arbitration flow in Figma'
      }
    ],
    status: 'VERIFIED',
    admin_feedback: 'Outstanding component hierarchy. Adheres cleanly to Refeir brand guidelines. Approved for Level 2 Pioneer rank.',
    created_at: new Date(Date.now() - 3600000 * 28).toISOString()
  },
  {
    id: 'tsk-demo-2',
    reference_id: 'POW-2026-64188',
    full_name: 'Kwame Mensah',
    email: 'kwame.mensah@example.com',
    application_number: 'RP-2026-492019',
    pioneer_id: 'RP-045',
    division: 'GROWTH',
    target_level: 'LEVEL_2',
    task_title: 'University of Ghana Campus Developer Orientation',
    task_category: 'Campus & Community Growth',
    task_description: 'Organized a campus orientation session introducing 40+ computer science students to Refeir open-source contributor tracks. 22 applied as Pioneers on the spot.',
    deliverable_url: 'https://twitter.com/kwame_gh/status/refeir-ug-demo',
    additional_url: 'https://docs.google.com/spreadsheets/d/demo-attendance',
    screenshots: [
      {
        id: 'img-2',
        name: 'campus_workshop_photo.png',
        data_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360"><rect width="600" height="360" fill="%2307180F"/><rect x="20" y="20" width="560" height="320" rx="16" fill="%230F2E1E" stroke="%2318FC5C" stroke-width="2"/><text x="40" y="60" fill="%2318FC5C" font-family="sans-serif" font-size="20" font-weight="bold">Refeir Pioneers Campus Session - Univ of Ghana</text><text x="40" y="95" fill="%23FFFFFF" font-family="sans-serif" font-size="14" opacity="0.8">Organizer: Kwame Mensah | Attendees: 40 | New Signups: 22</text><rect x="40" y="120" width="520" height="180" rx="12" fill="%23122B1A" stroke="%2366BB2A" stroke-width="1.5"/><text x="60" y="170" fill="%23FFFFFF" font-family="sans-serif" font-size="16">Live smart contract demonstration and Q&amp;A on freelance trust mechanisms</text><text x="60" y="210" fill="%2318FC5C" font-family="sans-serif" font-size="14">&#x25AA; 22 Verified Pioneers onboarded</text><text x="60" y="240" fill="%2318FC5C" font-family="sans-serif" font-size="14">&#x25AA; Campus lead chapter established</text></svg>',
        caption: 'Presentation slide and attendance verification list'
      }
    ],
    status: 'PENDING',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString()
  }
];

export const getTaskSubmissions = async (): Promise<TaskSubmissionRecord[]> => {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, 'pioneer_proof_of_work'), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const records: TaskSubmissionRecord[] = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        } as TaskSubmissionRecord));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        return records;
      }
    } catch (err) {
      console.warn('Firestore proof_of_work fetch notice:', err);
    }
  }

  // Check localStorage
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // ignore
    }
  }

  // Initialize with demos
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_TASKS));
  return INITIAL_DEMO_TASKS;
};

export const saveTaskSubmission = async (
  input: Omit<TaskSubmissionRecord, 'id' | 'reference_id' | 'created_at' | 'status'>
): Promise<TaskSubmissionRecord> => {
  const referenceId = `POW-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const record: TaskSubmissionRecord = {
    ...input,
    id: `tsk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    reference_id: referenceId,
    status: 'PENDING',
    created_at: new Date().toISOString()
  };

  // Touch contributor activity timestamp for 14-day inactivity rule
  try {
    touchContributorActivity(record.email);
  } catch {}

  // Save to Firebase Firestore directly
  if (isFirebaseConfigured) {
    setDoc(doc(db, 'pioneer_proof_of_work', record.reference_id), record, { merge: true }).catch((err: any) => {
      console.warn('Firestore task submission save error:', err);
    });
  }

  // Local storage save
  const current = await getTaskSubmissions();
  const updated = [record, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return record;
};

export const syncTaskSubmissionsToFirebase = async (): Promise<{ synced: number; error: string | null }> => {
  if (!isFirebaseConfigured) {
    return { synced: 0, error: 'Firebase credentials not configured' };
  }

  try {
    const local = await getTaskSubmissions();
    for (const item of local) {
      await setDoc(doc(db, 'pioneer_proof_of_work', item.reference_id), item, { merge: true });
    }
    return { synced: local.length, error: null };
  } catch (err: any) {
    return { synced: 0, error: err?.message || 'Sync failed' };
  }
};

export const syncTaskSubmissionsToSupabase = syncTaskSubmissionsToFirebase;

export const updateTaskSubmissionStatus = async (
  id: string,
  status: 'VERIFIED' | 'NEEDS_REVISION' | 'REJECTED',
  admin_feedback?: string
): Promise<void> => {
  // Update in localStorage
  const current = await getTaskSubmissions();
  let affectedRecord: TaskSubmissionRecord | undefined;

  const updated = current.map(item => {
    if (item.id === id || item.reference_id === id) {
      affectedRecord = { ...item, status, admin_feedback: admin_feedback ?? item.admin_feedback };
      return affectedRecord;
    }
    return item;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Sync to Firebase Firestore directly
  if (isFirebaseConfigured && affectedRecord) {
    setDoc(doc(db, 'pioneer_proof_of_work', affectedRecord.reference_id), {
      status,
      admin_feedback: admin_feedback ?? affectedRecord.admin_feedback
    }, { merge: true }).catch((err: any) => {
      console.warn('Firestore submission review error:', err);
    });
  }

  // If newly verified, check for rank promotion and certificate issuance
  if (status === 'VERIFIED' && affectedRecord) {
    try {
      touchContributorActivity(affectedRecord.email);
    } catch {}
    try {
      const verifiedCount = updated.filter(
        t => t.email.toLowerCase() === affectedRecord!.email.toLowerCase() && t.status === 'VERIFIED'
      ).length;

      // Determine highest earned tier
      let earnedTier: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5' = 'LEVEL_1';
      if (verifiedCount >= MIN_JOBS_FOR_PROMOTION.LEVEL_5) {
        earnedTier = 'LEVEL_5';
      } else if (verifiedCount >= MIN_JOBS_FOR_PROMOTION.LEVEL_4) {
        earnedTier = 'LEVEL_4';
      } else if (verifiedCount >= MIN_JOBS_FOR_PROMOTION.LEVEL_3) {
        earnedTier = 'LEVEL_3';
      } else if (verifiedCount >= MIN_JOBS_FOR_PROMOTION.LEVEL_2) {
        earnedTier = 'LEVEL_2';
      }

      if (earnedTier !== 'LEVEL_1') {
        // Auto issue certificate for this tier if not already issued
        issueCertificate({
          pioneer_id: affectedRecord.pioneer_id,
          application_number: affectedRecord.application_number,
          recipient_name: affectedRecord.full_name,
          recipient_email: affectedRecord.email,
          level: earnedTier,
          division: affectedRecord.division,
          verified_jobs_count: verifiedCount,
          issued_by: 'Refeir Admissions Committee & Protocol Stewards',
          special_distinction: `Earned with ${verifiedCount} verified deliverables in the Refeir Founding 100 cohort`
        });

        // Sync contributor tier to Firestore
        if (isFirebaseConfigured) {
          updateDoc(doc(db, 'contributor_profiles', affectedRecord.email.toLowerCase()), {
            contributor_level: earnedTier
          }).catch((err: any) => console.warn('Firestore tier promotion update error:', err));
        }
      }
    } catch (promoErr) {
      console.warn('Auto promotion certificate issuance non-fatal warning:', promoErr);
    }
  }
};

