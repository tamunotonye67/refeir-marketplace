import { db, isFirebaseConfigured } from './firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';

export type SquadDivision =
  | 'GENERAL'
  | 'TECHNOLOGY'
  | 'CREATIVE'
  | 'GROWTH'
  | 'COMMUNITY'
  | 'OPERATIONS'
  | 'ENTERPRISE';

export type TaskFrequency = 'DAILY' | 'WEEKLY' | 'FLASH_BOUNTY';

export type BountyType = 'AIRTIME' | 'DATA' | 'CASH' | 'XP_CREDIT' | 'CUSTOM' | 'NONE';

export interface SquadTask {
  id: string; // e.g. "TASK-2026-041"
  title: string;
  squad: SquadDivision;
  frequency: TaskFrequency;
  category: string; // e.g. "Social Media Sharing", "UI/UX Design", "Smart Contracts", etc.
  description: string;
  requirements: string[];
  submission_format: string; // e.g. "Live Post URL + Screenshot", "GitHub PR link", "Figma link"
  bounty_type: BountyType;
  bounty_reward?: string; // e.g. "₦2,000 Airtime Giveaway", "5GB Data Subscription", "₦10,000 Cash"
  bounty_slots?: string; // e.g. "First 5 Verified Submissions", "Top 3 Deliverables", "All Verified"
  bounty_instructions?: string; // e.g. "Airtime top-up sent directly to your phone number on profile"
  deadline: string; // ISO date string or formatted date
  status: 'ACTIVE' | 'ARCHIVED' | 'COMPLETED';
  announced_by: string; // e.g. "Tonye Taylor (Founder)", "Chidi (Tech Lead)", etc.
  created_at: string;
}

export const SQUAD_INFO: Record<SquadDivision, { name: string; tag: string; color: string; description: string }> = {
  GENERAL: {
    name: 'General Community',
    tag: 'All Pioneers',
    color: '#18FC5C',
    description: 'Universal platform missions open to every Pioneer across all squads and applicants.'
  },
  TECHNOLOGY: {
    name: 'Technology & Core Protocol',
    tag: 'Tech Squad',
    color: '#60A5FA',
    description: 'Frontend engineering, smart contracts, APIs, QA testing, and technical documentation.'
  },
  CREATIVE: {
    name: 'Creative, UI/UX & Design',
    tag: 'Design Squad',
    color: '#F472B6',
    description: 'Visual branding, motion design, social assets, design systems, and Figma prototypes.'
  },
  GROWTH: {
    name: 'Growth & Referral Strategy',
    tag: 'Growth Squad',
    color: '#FBBF24',
    description: 'Viral referral loops, influencer distribution, Twitter/X spaces, and conversion analytics.'
  },
  COMMUNITY: {
    name: 'Campus Leadership & Ambassador',
    tag: 'Campus Squad',
    color: '#A78BFA',
    description: 'University campus organizing, developer student clubs, co-working takeovers, and meetups.'
  },
  OPERATIONS: {
    name: 'Operations & Quality Assurance',
    tag: 'Ops Squad',
    color: '#34D399',
    description: 'Deliverable audits, onboarding coordination, task verification, and community moderation.'
  },
  ENTERPRISE: {
    name: 'Enterprise & Commercialization',
    tag: 'Enterprise Squad',
    color: '#F87171',
    description: 'Corporate client acquisition, freelance talent sourcing, and commercial partnership deals.'
  }
};

const STORAGE_KEY = 'refeir_squad_tasks_v1';

// Initial pre-seeded tasks for instant real-world motivation
const INITIAL_TASKS: SquadTask[] = [
  {
    id: 'TASK-2026-101',
    title: 'Daily Viral Blitz: Quote-Tweet Tonye Taylor’s Refeir Vision & Tag 3 Founders',
    squad: 'GENERAL',
    frequency: 'DAILY',
    category: 'Social Media Sharing',
    description: 'Help amplify the Refeir Founding 100 recruitment drive across Twitter/X and LinkedIn. Quote-tweet our latest vision announcement, share what sovereign work means to you, and tag 3 founders or builders who should join the cohort.',
    requirements: [
      'Quote-tweet the pinned Refeir announcement on X (@RefeirProtocol)',
      'Include your personal perspective on why peer referrals beat 20% freelance platforms',
      'Tag 3 active builders, designers, or campus founders',
      'Include #RefeirPioneers and link refeir.com'
    ],
    submission_format: 'Live Tweet URL + Screenshot of published quote-tweet',
    bounty_type: 'AIRTIME',
    bounty_reward: '₦1,500 Airtime Giveaway',
    bounty_slots: 'First 10 Verified Pioneers',
    bounty_instructions: 'Direct instant airtime top-up dispatched to the Nigerian/African mobile number on your profile within 4 hours of verification.',
    deadline: new Date(Date.now() + 86400000).toISOString(),
    status: 'ACTIVE',
    announced_by: 'Tonye Taylor (Platform Architect & Founder)',
    created_at: new Date().toISOString()
  },
  {
    id: 'TASK-2026-102',
    title: 'Tech Squad Sprint: Build & Test Idempotent Payout Webhook Mock',
    squad: 'TECHNOLOGY',
    frequency: 'DAILY',
    category: 'Smart Contracts & Code',
    description: 'The protocol is integrating automated multi-bank and mobile money webhooks. Write a clean TypeScript/Node script simulating idempotent webhook delivery with replay attack prevention and signature hashing.',
    requirements: [
      'Create a lightweight test harness verifying HMAC-SHA256 signature headers',
      'Demonstrate deduplication when the same transaction payload is delivered twice',
      'Push code to a public GitHub repository or Gist with documentation'
    ],
    submission_format: 'GitHub Repository / Gist URL with working test command',
    bounty_type: 'CASH',
    bounty_reward: '₦15,000 Cash Bounty',
    bounty_slots: 'Top 2 Cleanest Implementations',
    bounty_instructions: 'Paid directly to your verified settlement bank account upon Tech Lead review.',
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'ACTIVE',
    announced_by: 'Chidi (Tech Lead)',
    created_at: new Date().toISOString()
  },
  {
    id: 'TASK-2026-103',
    title: 'Creative Sprint: Design 3 Eye-Catching Social Carousel Cards for Squad Recruitment',
    squad: 'CREATIVE',
    frequency: 'WEEKLY',
    category: 'UI/UX & Design',
    description: 'Produce high-converting 1080x1350 carousel cards showcasing the 6 Pioneer squads, the 5x verified jobs ladder, and official level completion certificates.',
    requirements: [
      'Adhere to Refeir sovereign brand guidelines (Emerald, Mint, Gold, Plus Jakarta Sans typography)',
      'Deliver 3 slides: The Problem, The Squads, The Rewards Ladder',
      'Provide Figma view link or high-resolution PNG export'
    ],
    submission_format: 'Figma Community / Shareable View Link + Exported Preview',
    bounty_type: 'DATA',
    bounty_reward: '10GB Data Subscription Voucher',
    bounty_slots: 'First 5 Approved Submissions',
    bounty_instructions: 'Data voucher code sent to your registered WhatsApp/Email for MTN, Airtel, or Glo.',
    deadline: new Date(Date.now() + 86400000 * 4).toISOString(),
    status: 'ACTIVE',
    announced_by: 'Chioma Okafor (Creative Lead)',
    created_at: new Date().toISOString()
  },
  {
    id: 'TASK-2026-104',
    title: 'Growth Squad Sprint: Onboard 5 Qualified Applicants With Valid IDs',
    squad: 'GROWTH',
    frequency: 'WEEKLY',
    category: 'Referrals & Growth Loops',
    description: 'Drive high-caliber talent into the Refeir Founding 100 cohort. Guide 5 skilled peers through the application process and ensure they record their squad reasoning survey.',
    requirements: [
      'Share your unique referral pitch in developer/designer WhatsApp or Telegram groups',
      'Direct applicants to submit at refeir.com/#apply',
      'Provide the 5 Application IDs of candidates who referenced you'
    ],
    submission_format: 'List of 5 Application IDs + Screenshot proofs from group conversations',
    bounty_type: 'CASH',
    bounty_reward: '₦10,000 Cash + 5 Verified Deliverable Credits',
    bounty_slots: 'All Pioneers who achieve 5 validated applicants',
    bounty_instructions: 'Direct bank payout and +5 verified jobs credited towards your Level 2/3 certificate!',
    deadline: new Date(Date.now() + 86400000 * 6).toISOString(),
    status: 'ACTIVE',
    announced_by: 'Kwame Mensah (Growth Strategist)',
    created_at: new Date().toISOString()
  },
  {
    id: 'TASK-2026-105',
    title: 'Campus Leadership: Host a 30-Minute Refeir Briefing at University Hub',
    squad: 'COMMUNITY',
    frequency: 'WEEKLY',
    category: 'Community & Meetups',
    description: 'Organize a physical or virtual micro-meetup with tech/design students at your campus (UNILAG, OAU, UNN, KNUST, Makerere, etc.) introducing the Founding 100 recruitment.',
    requirements: [
      'Gather at least 8 student builders or creatives',
      'Walk through the Refeir Story, the 6 squads, and how proof-of-work certificates operate',
      'Capture photo/video documentation of the session or Google Meet recording'
    ],
    submission_format: 'Photo/Video Google Drive link + list of attendees with their campus names',
    bounty_type: 'AIRTIME',
    bounty_reward: '₦5,000 Airtime + Swag Allocation Priority',
    bounty_slots: 'First 4 Campuses to execute and report',
    bounty_instructions: 'Airtime dispatched instantly upon photo verification by Admissions Desk.',
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    status: 'ACTIVE',
    announced_by: 'Refeir Campus Directorate',
    created_at: new Date().toISOString()
  }
];

export function getAllSquadTasks(): SquadTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    return parsed;
  } catch {
    return INITIAL_TASKS;
  }
}

/**
 * Fetches squad tasks directly from Firebase Firestore if configured,
 * updates local storage cache, and returns the records.
 */
export async function fetchSquadTasksFromDatabase(): Promise<SquadTask[]> {
  if (!isFirebaseConfigured) {
    return getAllSquadTasks();
  }

  try {
    const q = query(collection(db, 'squad_tasks'), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const mapped: SquadTask[] = snapshot.docs.map(docSnap => {
        const item = docSnap.data();
        return {
          id: item.id || docSnap.id,
          title: item.title,
          squad: item.squad,
          frequency: item.frequency,
          category: item.category,
          description: item.description,
          requirements: item.requirements || [],
          submission_format: item.submission_format,
          bounty_type: item.bounty_type,
          bounty_reward: item.bounty_reward || undefined,
          bounty_slots: item.bounty_slots || undefined,
          bounty_instructions: item.bounty_instructions || undefined,
          deadline: item.deadline,
          status: item.status,
          announced_by: item.announced_by,
          created_at: item.created_at
        };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
      return mapped;
    }

    return getAllSquadTasks();
  } catch (err) {
    console.error('Failed to fetch squad tasks from Firestore:', err);
    return getAllSquadTasks();
  }
}

/**
 * Synchronizes local cached squad tasks directly to Firebase Firestore database.
 */
export async function syncSquadTasksToSupabase(): Promise<{ synced: number; error: string | null }> {
  if (!isFirebaseConfigured) {
    return { synced: 0, error: 'Firebase credentials not configured' };
  }

  try {
    const localTasks = getAllSquadTasks();
    const promises = localTasks.map(t =>
      setDoc(doc(db, 'squad_tasks', t.id), t, { merge: true })
    );
    await Promise.all(promises);
    return { synced: localTasks.length, error: null };
  } catch (err: any) {
    return { synced: 0, error: err?.message || 'Sync failed' };
  }
}

export const syncSquadTasksToFirebase = syncSquadTasksToSupabase;

export function getActiveTasksBySquad(squad?: SquadDivision | 'ALL'): SquadTask[] {
  const all = getAllSquadTasks();
  if (!squad || squad === 'ALL') {
    return all.filter(t => t.status === 'ACTIVE');
  }
  return all.filter(t => t.status === 'ACTIVE' && (t.squad === squad || t.squad === 'GENERAL'));
}

export function createSquadTask(task: Omit<SquadTask, 'id' | 'created_at'>): SquadTask {
  const all = getAllSquadTasks();
  const serial = Math.floor(100 + Math.random() * 900);
  const newTask: SquadTask = {
    ...task,
    id: `TASK-2026-${serial}`,
    created_at: new Date().toISOString()
  };
  const updated = [newTask, ...all];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Async sync to Firestore if configured
  if (isFirebaseConfigured) {
    setDoc(doc(db, 'squad_tasks', newTask.id), newTask, { merge: true })
      .catch(err => console.warn('Firestore task insert error:', err?.message));
  }

  return newTask;
}

export function updateSquadTask(id: string, updates: Partial<SquadTask>): SquadTask | undefined {
  const all = getAllSquadTasks();
  let updatedTask: SquadTask | undefined;
  const updated = all.map(t => {
    if (t.id === id) {
      updatedTask = { ...t, ...updates };
      return updatedTask;
    }
    return t;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  if (isFirebaseConfigured && updatedTask) {
    setDoc(doc(db, 'squad_tasks', id), updatedTask, { merge: true })
      .catch(err => console.warn('Firestore task update error:', err?.message));
  }

  return updatedTask;
}

export function deleteSquadTask(id: string): boolean {
  const all = getAllSquadTasks();
  const filtered = all.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

  if (isFirebaseConfigured) {
    deleteDoc(doc(db, 'squad_tasks', id))
      .catch(err => console.warn('Firestore task delete error:', err?.message));
  }

  return true;
}

export function toggleTaskStatus(id: string): SquadTask | undefined {
  const all = getAllSquadTasks();
  let updatedTask: SquadTask | undefined;
  const updated = all.map(t => {
    if (t.id === id) {
      const nextStatus: SquadTask['status'] = t.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE';
      updatedTask = { ...t, status: nextStatus };
      return updatedTask;
    }
    return t;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  if (isFirebaseConfigured && updatedTask) {
    updateDoc(doc(db, 'squad_tasks', id), { status: updatedTask.status })
      .catch(err => console.warn('Firestore task toggle status error:', err?.message));
  }

  return updatedTask;
}

// Generates an attractive, high-converting WhatsApp announcement broadcast
export function generateWhatsAppBroadcast(task: SquadTask): string {
  const squadName = SQUAD_INFO[task.squad]?.name.toUpperCase() || task.squad;
  const timeLabel = task.frequency === 'DAILY' ? 'TODAY\'S DAILY MISSION' : task.frequency === 'WEEKLY' ? 'THIS WEEK\'S SPRINT MISSION' : '⚡ FLASH BOUNTY MISSION';
  
  let bountyHeader = '';
  if (task.bounty_type === 'AIRTIME') {
    bountyHeader = `🎁 *SPECIAL BOUNTY:* ${task.bounty_reward || 'Airtime Giveaway'} (${task.bounty_slots || 'First Verified'})`;
  } else if (task.bounty_type === 'DATA') {
    bountyHeader = `📶 *SPECIAL BOUNTY:* ${task.bounty_reward || 'Data Subscription Voucher'} (${task.bounty_slots || 'First Verified'})`;
  } else if (task.bounty_type === 'CASH') {
    bountyHeader = `💰 *CASH REWARD:* ${task.bounty_reward || 'Instant Bank Cash Bounty'} (${task.bounty_slots || 'Top Deliverables'})`;
  } else if (task.bounty_type === 'XP_CREDIT') {
    bountyHeader = `⭐ *PROMOTION REWARD:* ${task.bounty_reward || 'Verified Deliverable XP & Ladder Credits'}`;
  } else if (task.bounty_reward) {
    bountyHeader = `🎉 *SPECIAL REWARD:* ${task.bounty_reward}`;
  }

  const cleanUrl = `${window.location.origin}/tasks?squad=${task.squad}#${task.id}`;

  const message = `🚨 *REFEIR PIONEERS • ${timeLabel}*
🎯 *Target Squad:* ${squadName}

📌 *Mission:* *${task.title}*
📁 *Category:* ${task.category}
${bountyHeader ? `\n${bountyHeader}\n` : ''}
📝 *Objective & Instructions:*
${task.description}

✅ *Deliverables Needed:*
${task.requirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

📤 *Submission Format:* ${task.submission_format}
⏳ *Deadline:* ${new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}

👉 *VIEW MISSION & SUBMIT YOUR PROOF:*
🔗 ${cleanUrl}

_Reported by: ${task.announced_by}_
_Let's execute with sovereign speed! 🚀_`;

  return message;
}

export function openWhatsAppShare(task: SquadTask) {
  const text = generateWhatsAppBroadcast(task);
  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${encoded}`, '_blank', 'noopener,noreferrer');
}
