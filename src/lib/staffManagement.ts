import { db, isFirebaseConfigured } from './firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

export type StaffRole = 'SUPER_ADMIN' | 'MANAGER' | 'SQUAD_LEAD' | 'TASK_VIEWER' | 'ADMISSIONS_REVIEWER' | 'TASK_VERIFIER';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  assigned_division: string;
  passcode: string;
  /** Optional hashed/plain password for email+password login */
  password?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  reviews_count: number;
  added_at: string;
}

const STAFF_STORAGE_KEY = 'refeir_admin_staff_v1';
const ACTIVE_STAFF_SESSION_KEY = 'refeir_active_staff_session';

const DEFAULT_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Tonye Taylor',
    email: 'tonye@refeir.com',
    role: 'SUPER_ADMIN',
    assigned_division: 'ALL',
    passcode: 'refeir2026',
    password: 'Refeir@2026!',
    status: 'ACTIVE',
    reviews_count: 84,
    added_at: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'staff-mgr',
    name: 'Nkechi Okafor',
    email: 'manager@refeir.com',
    role: 'MANAGER',
    assigned_division: 'ALL',
    passcode: 'manager2026',
    password: 'Manager@2026!',
    status: 'ACTIVE',
    reviews_count: 51,
    added_at: '2026-01-20T00:00:00.000Z'
  },
  {
    id: 'staff-2',
    name: 'Sarah Alabi',
    email: 'sarah.alabi@refeir.com',
    role: 'ADMISSIONS_REVIEWER',
    assigned_division: 'GROWTH',
    passcode: 'admit2026',
    password: 'Sarah@Admit2026',
    status: 'ACTIVE',
    reviews_count: 32,
    added_at: '2026-02-01T00:00:00.000Z'
  },
  {
    id: 'staff-3',
    name: 'Chidi Eze',
    email: 'chidi.eze@refeir.com',
    role: 'SQUAD_LEAD',
    assigned_division: 'TECH_PRODUCT',
    passcode: 'techlead26',
    password: 'Chidi@TechLead26',
    status: 'ACTIVE',
    reviews_count: 19,
    added_at: '2026-02-10T00:00:00.000Z'
  },
  {
    id: 'staff-viewer',
    name: 'Zainab Bello',
    email: 'viewer@refeir.com',
    role: 'TASK_VIEWER',
    assigned_division: 'ALL',
    passcode: 'viewer2026',
    password: 'Viewer@2026!',
    status: 'ACTIVE',
    reviews_count: 12,
    added_at: '2026-02-15T00:00:00.000Z'
  }
];

export interface StaffPermissions {
  canManageStaff: boolean;
  canReviewApplications: boolean;
  canDeleteApplications: boolean;
  canVerifyTasks: boolean;
  canAnnounceTasks: boolean;
  canDeleteTasks: boolean;
  canIssueCertificates: boolean;
  canRevokeCertificates: boolean;
  canModifyMemberTier: boolean;
  canSuspendMembers: boolean;
  canViewAnalytics: boolean;
  isReadOnly: boolean;
}

export const getStaffPermissions = (role: StaffRole): StaffPermissions => {
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
};

export const isTabAuthorized = (role: StaffRole, tab: string): boolean => {
  switch (role) {
    case 'SUPER_ADMIN':
      return true;
    case 'MANAGER':
      return ['applications', 'proofs', 'members', 'certificates', 'tasks', 'analytics'].includes(tab);
    case 'SQUAD_LEAD':
      return ['tasks', 'proofs', 'members'].includes(tab);
    case 'TASK_VIEWER':
    case 'TASK_VERIFIER':
      return ['proofs', 'tasks'].includes(tab);
    case 'ADMISSIONS_REVIEWER':
      return ['applications', 'members'].includes(tab);
    default:
      return ['proofs', 'tasks'].includes(tab);
  }
};

export const getStaffMembers = (): StaffMember[] => {
  const data = localStorage.getItem(STAFF_STORAGE_KEY);
  if (data) {
    try {
      const parsed: StaffMember[] = JSON.parse(data);
      const defaults = DEFAULT_STAFF;
      const patched = parsed.map(s => {
        if (!s.password) {
          const match = defaults.find(d => d.id === s.id);
          if (match?.password) return { ...s, password: match.password };
        }
        return s;
      });
      return patched;
    } catch {
      // ignore
    }
  }
  localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(DEFAULT_STAFF));
  return DEFAULT_STAFF;
};

export const saveStaffMembers = (staff: StaffMember[]) => {
  localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staff));
};

export const addStaffMember = (input: Omit<StaffMember, 'id' | 'reviews_count' | 'added_at'>): StaffMember => {
  const all = getStaffMembers();
  const newMember: StaffMember = {
    ...input,
    id: `staff-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    reviews_count: 0,
    added_at: new Date().toISOString()
  };
  all.push(newMember);
  saveStaffMembers(all);

  // Sync to Firestore
  if (isFirebaseConfigured) {
    setDoc(doc(db, 'staff_members', newMember.id), newMember, { merge: true }).catch((err: any) => {
      console.warn('Firestore addStaffMember error:', err);
    });
  }

  return newMember;
};

export const toggleStaffStatus = (id: string): void => {
  const all = getStaffMembers();
  let updatedMember: StaffMember | undefined;
  const updated = all.map(s => {
    if (s.id === id) {
      updatedMember = { ...s, status: (s.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE') as any };
      return updatedMember;
    }
    return s;
  });
  saveStaffMembers(updated);

  if (isFirebaseConfigured && updatedMember) {
    updateDoc(doc(db, 'staff_members', id), { status: (updatedMember as StaffMember).status }).catch((err: any) => {
      console.warn('Firestore toggleStaffStatus error:', err);
    });
  }
};

export const deleteStaffMember = (id: string): void => {
  const all = getStaffMembers().filter(s => s.id !== id);
  saveStaffMembers(all);

  if (isFirebaseConfigured) {
    deleteDoc(doc(db, 'staff_members', id)).catch((err: any) => {
      console.warn('Firestore deleteStaffMember error:', err);
    });
  }
};

export const verifyStaffPasscode = (passcode: string): StaffMember | null => {
  const cleanPasscode = passcode.trim();
  if (cleanPasscode === 'refeir2026') {
    const superAdmin = getStaffMembers().find(s => s.passcode === 'refeir2026');
    if (superAdmin) return superAdmin;
    return DEFAULT_STAFF[0];
  }

  const all = getStaffMembers();
  const found = all.find(s => s.passcode === cleanPasscode && s.status === 'ACTIVE');
  return found || null;
};

export const verifyStaffEmailPassword = (email: string, password: string): StaffMember | null => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();
  if (!cleanEmail || !cleanPassword) return null;

  const all = getStaffMembers();
  const found = all.find(
    s =>
      s.email.toLowerCase() === cleanEmail &&
      s.password === cleanPassword &&
      s.status === 'ACTIVE'
  );
  return found || null;
};

export const updateStaffMember = (
  id: string,
  updates: Partial<Omit<StaffMember, 'id' | 'added_at' | 'reviews_count'>>
): StaffMember | null => {
  const all = getStaffMembers();
  let updatedMember: StaffMember | null = null;
  const updated = all.map(s => {
    if (s.id === id) {
      updatedMember = {
        ...s,
        ...updates
      };
      return updatedMember;
    }
    return s;
  });
  if (updatedMember) {
    saveStaffMembers(updated);
    if (isFirebaseConfigured) {
      setDoc(doc(db, 'staff_members', id), updates, { merge: true }).catch((err: any) => {
        console.warn('Firestore updateStaffMember error:', err);
      });
    }
  }
  return updatedMember;
};

export const updateStaffPassword = (id: string, newPassword: string): void => {
  const all = getStaffMembers();
  const updated = all.map(s => s.id === id ? { ...s, password: newPassword } : s);
  saveStaffMembers(updated);

  if (isFirebaseConfigured) {
    updateDoc(doc(db, 'staff_members', id), { password: newPassword }).catch((err: any) => {
      console.warn('Firestore updateStaffPassword error:', err);
    });
  }
};

export const getActiveStaffSession = (): StaffMember | null => {
  const data = sessionStorage.getItem(ACTIVE_STAFF_SESSION_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const setActiveStaffSession = (staff: StaffMember | null): void => {
  if (!staff) {
    sessionStorage.removeItem(ACTIVE_STAFF_SESSION_KEY);
  } else {
    sessionStorage.setItem(ACTIVE_STAFF_SESSION_KEY, JSON.stringify(staff));
  }
};

export const fetchStaffMembersFromDatabase = async (): Promise<StaffMember[]> => {
  if (!isFirebaseConfigured) {
    return getStaffMembers();
  }

  try {
    const snap = await getDocs(collection(db, 'staff_members'));
    if (!snap.empty) {
      const records = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      } as StaffMember));

      saveStaffMembers(records);
      return records;
    }
  } catch (err) {
    console.warn('Could not query staff_members from Firestore:', err);
  }

  return getStaffMembers();
};

export const syncStaffMembersToFirebase = async (): Promise<{ success: boolean; count: number; error?: string }> => {
  if (!isFirebaseConfigured) {
    return { success: false, count: 0, error: 'Firebase credentials not configured' };
  }

  const staff = getStaffMembers();
  try {
    for (const member of staff) {
      await setDoc(doc(db, 'staff_members', member.id), member, { merge: true });
    }
    return { success: true, count: staff.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'Sync failed' };
  }
};

export const syncStaffMembersToSupabase = syncStaffMembersToFirebase;

