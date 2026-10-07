import { auth, db, isFirebaseConfigured } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy
} from 'firebase/firestore';
import {
  validateAcceptanceCredentials,
  updateStoredApplication,
  generateNextPioneerId,
  getStoredApplications
} from './pioneerApplications';

export type ContributorTier = 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5';

export interface PioneerSurveyResponse {
  question_id: string;
  category: string;
  question: string;
  selected_option: string;
  reasoning_notes?: string;
}

export interface ContributorProfile {
  id: string;
  email: string;
  full_name: string;
  application_number?: string;
  pioneer_id?: string;
  acceptance_code?: string;
  division: string;
  contributor_level: ContributorTier;
  date_of_birth?: string;
  avatar_url?: string;
  whatsapp_number?: string;
  telegram_handle?: string;
  twitter_handle?: string;
  instagram_handle?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  institution?: string;
  country?: string;
  city?: string;
  bio?: string;
  skills?: string[];
  payout_preference?: 'BANK' | 'CRYPTO_USDT' | 'MOBILE_MONEY';
  payout_details?: string;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  is_profile_completed: boolean;
  is_founding_100?: boolean;
  password?: string;
  created_at: string;
  profile_completed_at?: string;
  survey_responses?: PioneerSurveyResponse[];
  survey_completed_at?: string;
  is_suspended?: boolean;
  suspension_reason?: string;
  suspended_at?: string;
  /** Timestamp of most recent deliverable or login action */
  last_active_at?: string;
  /** Set to true if rank progress was automatically withdrawn due to 14+ days inactivity */
  demoted_due_to_inactivity?: boolean;
  /** Timestamp when the 14-day inactivity withdrawal was applied */
  last_inactivity_demotion_at?: string;
  /** Previous tier held before inactivity withdrawal */
  previous_level_before_demotion?: ContributorTier;
}

const SESSION_KEY = 'refeir_contributor_session_v1';
const USERS_DB_KEY = 'refeir_contributors_db_v1';

// Seed demo contributor accounts for instant testing
const INITIAL_DEMO_USERS: ContributorProfile[] = [
  {
    id: 'usr-demo-1',
    email: 'kwame.mensah@example.com',
    full_name: 'Kwame Mensah',
    application_number: 'RP-2026-492019',
    pioneer_id: 'RP-045',
    acceptance_code: 'ACC-4920-7712',
    division: 'GROWTH',
    contributor_level: 'LEVEL_2',
    whatsapp_number: '+233241234567',
    telegram_handle: '@kwame_growth',
    country: 'Ghana',
    city: 'Accra',
    date_of_birth: '1998-05-14',
    institution: 'University of Ghana, Legon',
    bio: 'Growth lead and campus ambassador organizing developer sprints and community loops.',
    skills: ['Community Growth', 'Campus Events', 'Referral Strategy', 'Technical Writing'],
    is_profile_completed: true,
    password: 'password123',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    profile_completed_at: new Date(Date.now() - 3600000 * 40).toISOString()
  }
];

const getStoredUsers = (): ContributorProfile[] => {
  const data = localStorage.getItem(USERS_DB_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // ignore
    }
  }
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(INITIAL_DEMO_USERS));
  return INITIAL_DEMO_USERS;
};

const saveStoredUsers = (users: ContributorProfile[]) => {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
};

export const getCurrentContributor = (): ContributorProfile | null => {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return null;
  try {
    const parsed = JSON.parse(session);
    // Refresh user data from users db to get updated level
    const users = getStoredUsers();
    const fresh = users.find(u => u.email.toLowerCase() === parsed.email.toLowerCase());
    return fresh || parsed;
  } catch {
    return null;
  }
};

export const signUpContributor = async (data: {
  application_number: string;
  acceptance_code: string;
  email: string;
  pioneer_id?: string;
  password?: string;
  full_name?: string;
  division?: string;
  whatsapp_number?: string;
}): Promise<ContributorProfile> => {
  const appNum = data.application_number.trim().toUpperCase();
  const accCode = data.acceptance_code.trim().toUpperCase();
  const email = data.email.trim().toLowerCase();

  if (!appNum) {
    throw new Error('Application ID is required to create a contributor account.');
  }
  if (!accCode) {
    throw new Error('Acceptance Code is required. You must be accepted into the Pioneers program before signing up.');
  }
  if (!email || !email.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }

  // Verify against accepted applications database
  const check = validateAcceptanceCredentials(appNum, accCode);

  if (!check.valid || !check.application) {
    throw new Error(check.error || 'Verification failed: Only accepted applicants with valid credentials can create an account.');
  }

  const app = check.application;
  const users = getStoredUsers();

  // Check if an account is already linked to this application
  const existingByApp = users.find(u => u.application_number?.toUpperCase() === appNum);
  if (existingByApp) {
    throw new Error(`An account has already been registered for Application ${appNum} (${existingByApp.email}). Please sign in.`);
  }

  const existingByEmail = users.find(u => u.email.toLowerCase() === email);
  if (existingByEmail) {
    throw new Error('An account with this email address already exists. Please sign in.');
  }

  const newProfile: ContributorProfile = {
    id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    email,
    full_name: data.full_name?.trim() || app.full_name,
    division: data.division || app.primary_division || 'GROWTH',
    application_number: appNum,
    pioneer_id: data.pioneer_id?.trim().toUpperCase() || '',
    acceptance_code: accCode,
    whatsapp_number: data.whatsapp_number?.trim() || app.whatsapp_number,
    contributor_level: app.contributor_level || 'LEVEL_1',
    is_profile_completed: false,
    password: data.password || 'password123',
    created_at: new Date().toISOString()
  };

  users.push(newProfile);
  saveStoredUsers(users);

  // If Firebase is configured, create Auth user and store profile in Firestore
  if (isFirebaseConfigured) {
    try {
      await createUserWithEmailAndPassword(auth, email, data.password || 'password123');
    } catch (authErr: any) {
      // If user already exists in Auth, allow sign in linking
      if (authErr.code !== 'auth/email-already-in-use') {
        console.warn('Firebase Auth creation notice:', authErr.message);
      }
    }

    try {
      await setDoc(doc(db, 'contributor_profiles', email.toLowerCase()), newProfile, { merge: true });
    } catch (fsErr: any) {
      console.warn('Firestore profile creation error:', fsErr.message);
    }
  }

  // Mark application as having an account created
  updateStoredApplication(appNum, { account_created: true });

  // Set session
  const safeSession = { ...newProfile };
  delete safeSession.password;
  localStorage.setItem(SESSION_KEY, JSON.stringify(safeSession));
  notifyAuthChange();

  return safeSession;
};

export const completeContributorProfile = async (
  email: string,
  details: {
    full_name?: string;
    avatar_url?: string;
    date_of_birth?: string;
    whatsapp_number?: string;
    telegram_handle?: string;
    twitter_handle?: string;
    instagram_handle?: string;
    github_url?: string;
    linkedin_url?: string;
    portfolio_url?: string;
    institution?: string;
    country?: string;
    city?: string;
    division?: string;
    bio?: string;
    skills?: string[];
    payout_preference?: 'BANK' | 'CRYPTO_USDT' | 'MOBILE_MONEY';
    payout_details?: string;
    bank_name?: string;
    account_number?: string;
    account_name?: string;
    survey_responses?: PioneerSurveyResponse[];
  }
): Promise<ContributorProfile> => {
  const users = getStoredUsers();
  const userIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  if (userIdx === -1) {
    throw new Error('User not found. Please sign in again.');
  }

  const user = users[userIdx];
  
  // Mint or preserve Pioneer ID
  let assignedPioneerId = user.pioneer_id?.trim();
  if (!assignedPioneerId) {
    // Check if linked application already has one
    if (user.application_number) {
      const apps = getStoredApplications();
      const linkedApp = apps.find(a => a.application_number.toUpperCase() === user.application_number?.toUpperCase());
      if (linkedApp?.pioneer_id) {
        assignedPioneerId = linkedApp.pioneer_id;
      }
    }
    // Otherwise mint a fresh unique ID
    if (!assignedPioneerId) {
      assignedPioneerId = generateNextPioneerId();
    }
  }

  // Date of birth: permanent record, non-editable once set!
  let assignedDob = user.date_of_birth?.trim();
  if (!assignedDob && details.date_of_birth?.trim()) {
    assignedDob = details.date_of_birth.trim();
  }

  const updated: ContributorProfile = {
    ...user,
    full_name: details.full_name?.trim() || user.full_name,
    avatar_url: details.avatar_url || user.avatar_url,
    date_of_birth: assignedDob,
    whatsapp_number: details.whatsapp_number?.trim() || user.whatsapp_number,
    telegram_handle: details.telegram_handle?.trim() || user.telegram_handle,
    twitter_handle: details.twitter_handle?.trim() || user.twitter_handle,
    instagram_handle: details.instagram_handle?.trim() || user.instagram_handle,
    github_url: details.github_url?.trim() || user.github_url,
    linkedin_url: details.linkedin_url?.trim() || user.linkedin_url,
    portfolio_url: details.portfolio_url?.trim() || user.portfolio_url,
    institution: details.institution?.trim() || user.institution,
    country: details.country?.trim() || user.country,
    city: details.city?.trim() || user.city,
    division: details.division || user.division,
    bio: details.bio?.trim() || user.bio,
    skills: details.skills || user.skills,
    payout_preference: details.payout_preference || user.payout_preference,
    payout_details: details.payout_details?.trim() || user.payout_details,
    bank_name: details.bank_name?.trim() || user.bank_name,
    account_number: details.account_number?.trim() || user.account_number,
    account_name: details.account_name?.trim() || user.account_name,
    survey_responses: details.survey_responses || user.survey_responses,
    survey_completed_at: details.survey_responses ? new Date().toISOString() : user.survey_completed_at,
    pioneer_id: assignedPioneerId,
    is_profile_completed: true,
    profile_completed_at: new Date().toISOString()
  };

  users[userIdx] = updated;
  saveStoredUsers(users);

  // Sync to Firebase Firestore directly
  if (isFirebaseConfigured) {
    setDoc(doc(db, 'contributor_profiles', email.toLowerCase()), updated, { merge: true }).catch((err: any) => {
      console.warn('Firestore updateProfile error:', err);
    });
  }

  // Sync to pioneerApplications
  if (user.application_number) {
    updateStoredApplication(user.application_number, {
      pioneer_id: assignedPioneerId,
      full_name: updated.full_name,
      whatsapp_number: updated.whatsapp_number,
      country: updated.country,
      city: updated.city
    });
  }

  // Update session
  const safeSession = { ...updated };
  delete safeSession.password;
  localStorage.setItem(SESSION_KEY, JSON.stringify(safeSession));
  notifyAuthChange();

  return safeSession;
};

export const signInContributor = async (emailInput: string, passwordInput: string): Promise<ContributorProfile> => {
  const email = emailInput.trim().toLowerCase();
  const users = getStoredUsers();
  let user = users.find(u => u.email.toLowerCase() === email);

  // 1. If Firebase is configured, authenticate via Firebase Auth & Firestore
  if (isFirebaseConfigured) {
    try {
      await signInWithEmailAndPassword(auth, email, passwordInput);
    } catch (authErr: any) {
      console.warn('Firebase Auth sign in notice:', authErr.message);
    }

    try {
      const docSnap = await getDoc(doc(db, 'contributor_profiles', email));
      if (docSnap.exists()) {
        const firestoreData = docSnap.data() as ContributorProfile;
        const idx = users.findIndex(u => u.email.toLowerCase() === email);
        if (idx !== -1) {
          users[idx] = firestoreData;
        } else {
          users.push(firestoreData);
        }
        saveStoredUsers(users);
        user = firestoreData;
      }
    } catch (fsErr: any) {
      console.warn('Firestore profile fetch error:', fsErr.message);
    }
  }

  if (!user) {
    throw new Error(
      'No active account found for this email. Membership requires an official acceptance into the Pioneer program. If you have been accepted and issued an Acceptance Code, please click "Activate Account" to register.'
    );
  }

  if (user.password && user.password !== passwordInput && !isFirebaseConfigured) {
    throw new Error('Invalid password. Please check your credentials or reset your password with Admissions.');
  }

  if (user.is_suspended) {
    throw new Error(
      `Your contributor account has been SUSPENDED by Administration.${user.suspension_reason ? ` Reason: ${user.suspension_reason}.` : ''} Please contact admissions@refeir.com for inquiries.`
    );
  }

  const safeSession = { ...user };
  delete safeSession.password;
  localStorage.setItem(SESSION_KEY, JSON.stringify(safeSession));
  notifyAuthChange();

  return safeSession;
};

/**
 * Sign in or activate account using Google Authentication
 */
export const signInWithGoogle = async (googleEmail?: string, googleName?: string, googleAvatar?: string): Promise<ContributorProfile> => {
  let email = (googleEmail || '').trim().toLowerCase();
  let name = googleName;
  let avatar = googleAvatar;

  // If Firebase is configured and no email passed in, trigger Firebase Google popup
  if (isFirebaseConfigured && !email) {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      email = (result.user.email || '').trim().toLowerCase();
      name = result.user.displayName || name;
      avatar = result.user.photoURL || avatar;
    } catch (gErr: any) {
      if (gErr.code !== 'auth/popup-closed-by-user') {
        throw new Error(`Google Sign-In failed: ${gErr.message}`);
      }
      throw gErr;
    }
  }

  if (!email) {
    throw new Error('Google authentication did not return a valid email address.');
  }

  const users = getStoredUsers();
  let user = users.find(u => u.email.toLowerCase() === email);

  // Check Cloud Firestore for existing profile
  if (isFirebaseConfigured) {
    try {
      const docSnap = await getDoc(doc(db, 'contributor_profiles', email));
      if (docSnap.exists()) {
        user = docSnap.data() as ContributorProfile;
        const idx = users.findIndex(u => u.email.toLowerCase() === email);
        if (idx !== -1) {
          users[idx] = user;
        } else {
          users.push(user);
        }
        saveStoredUsers(users);
      }
    } catch (err) {
      // ignore
    }
  }

  if (user) {
    if (user.is_suspended) {
      throw new Error(`Your contributor account has been SUSPENDED by Administration.${user.suspension_reason ? ` Reason: ${user.suspension_reason}.` : ''} Please contact admissions@refeir.com.`);
    }
    const safeSession = { ...user };
    delete safeSession.password;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeSession));
    notifyAuthChange();
    return safeSession;
  }

  // If no user exists, check if there is an ACCEPTED application for this email
  const allApps = getStoredApplications();
  const matchedApp = allApps.find(a => a.email.toLowerCase() === email);

  if (matchedApp) {
    if (matchedApp.status === 'ACCEPTED') {
      const newProfile: ContributorProfile = {
        id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        email,
        full_name: googleName || matchedApp.full_name,
        division: matchedApp.primary_division || 'GROWTH',
        application_number: matchedApp.application_number,
        pioneer_id: matchedApp.pioneer_id || '',
        acceptance_code: matchedApp.acceptance_code || '',
        whatsapp_number: matchedApp.whatsapp_number,
        avatar_url: googleAvatar,
        contributor_level: matchedApp.contributor_level || 'LEVEL_1',
        is_profile_completed: false,
        password: 'google_oauth',
        created_at: new Date().toISOString()
      };
      users.push(newProfile);
      saveStoredUsers(users);
      updateStoredApplication(matchedApp.application_number, { account_created: true });

      const safeSession = { ...newProfile };
      delete safeSession.password;
      localStorage.setItem(SESSION_KEY, JSON.stringify(safeSession));
      notifyAuthChange();
      return safeSession;
    } else {
      throw new Error(
        `Application found (${matchedApp.application_number}), but its review status is currently ${matchedApp.status}. Only accepted applicants can sign in.`
      );
    }
  }

  throw new Error(
    `No Pioneer application or account found for ${email}. Please apply to join Refeir Pioneers first, or activate with your Application ID.`
  );
};

export const getAllContributors = (): ContributorProfile[] => {
  return getStoredUsers();
};

export const suspendContributor = (email: string, reason: string = 'Violation of Refeir Pioneer Code of Conduct'): ContributorProfile => {
  const users = getStoredUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (idx === -1) {
    throw new Error('Contributor not found.');
  }

  users[idx] = {
    ...users[idx],
    is_suspended: true,
    suspension_reason: reason.trim(),
    suspended_at: new Date().toISOString()
  };
  saveStoredUsers(users);

  // Sync active session if this user is signed in
  const currentSession = localStorage.getItem(SESSION_KEY);
  if (currentSession) {
    try {
      const parsed = JSON.parse(currentSession);
      if (parsed.email.toLowerCase() === email.trim().toLowerCase()) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({
          ...parsed,
          is_suspended: true,
          suspension_reason: reason.trim(),
          suspended_at: users[idx].suspended_at
        }));
      }
    } catch {
      // ignore
    }
  }

  notifyAuthChange();
  return users[idx];
};

export const activateContributor = (email: string): ContributorProfile => {
  const users = getStoredUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (idx === -1) {
    throw new Error('Contributor not found.');
  }

  users[idx] = {
    ...users[idx],
    is_suspended: false,
    suspension_reason: undefined,
    suspended_at: undefined
  };
  saveStoredUsers(users);

  // Sync active session
  const currentSession = localStorage.getItem(SESSION_KEY);
  if (currentSession) {
    try {
      const parsed = JSON.parse(currentSession);
      if (parsed.email.toLowerCase() === email.trim().toLowerCase()) {
        const updated = { ...parsed, is_suspended: false };
        delete updated.suspension_reason;
        delete updated.suspended_at;
        localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      }
    } catch {
      // ignore
    }
  }

  notifyAuthChange();
  return users[idx];
};

export const signOutContributor = (): void => {
  localStorage.removeItem(SESSION_KEY);
  notifyAuthChange();
};

export const updateContributorLevel = (email: string, newLevel: ContributorTier): void => {
  const users = getStoredUsers();
  const updated = users.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, contributor_level: newLevel } : u);
  saveStoredUsers(updated);

  const current = getCurrentContributor();
  if (current && current.email.toLowerCase() === email.toLowerCase()) {
    current.contributor_level = newLevel;
    localStorage.setItem(SESSION_KEY, JSON.stringify(current));
    notifyAuthChange();
  }
};

export const updateContributorAvatar = (email: string, avatarUrl: string): ContributorProfile | null => {
  const users = getStoredUsers();
  const userIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (userIdx !== -1) {
    users[userIdx] = { ...users[userIdx], avatar_url: avatarUrl };
    saveStoredUsers(users);
  }

  const current = getCurrentContributor();
  if (current && current.email.toLowerCase() === email.toLowerCase()) {
    const updated = { ...current, avatar_url: avatarUrl };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    notifyAuthChange();
    return updated;
  }
  return null;
};

// ─── STRICT PROTOCOL INACTIVITY GOVERNANCE RULE ──────────────────────────
export const INACTIVITY_LIMIT_DAYS = 14; // Strict 2-week inactivity threshold
export const INACTIVITY_LIMIT_MS = INACTIVITY_LIMIT_DAYS * 24 * 60 * 60 * 1000;

/**
 * Updates the last active timestamp for a contributor whenever they sign in,
 * submit a deliverable, or complete an official action.
 */
export const touchContributorActivity = (email: string): void => {
  const cleanEmail = email.trim().toLowerCase();
  const users = getStoredUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
  if (idx !== -1) {
    users[idx] = {
      ...users[idx],
      last_active_at: new Date().toISOString(),
      demoted_due_to_inactivity: false
    };
    saveStoredUsers(users);

    const current = getCurrentContributor();
    if (current && current.email.toLowerCase() === cleanEmail) {
      const updatedSession = {
        ...current,
        last_active_at: users[idx].last_active_at,
        demoted_due_to_inactivity: false
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
      notifyAuthChange();
    }
  }
};

/**
 * Returns activity metrics and days remaining for a specific contributor.
 */
export const getContributorActivityStatus = (
  contributor: ContributorProfile,
  taskSubmissions?: Array<{ email: string; created_at: string }>
): {
  daysSinceActive: number;
  daysRemainingBeforeDemotion: number;
  isAtRisk: boolean;
  isDemoted: boolean;
  lastActiveDateStr: string;
} => {
  let latestActivityMs = 0;

  if (contributor.last_active_at) {
    const ms = new Date(contributor.last_active_at).getTime();
    if (!isNaN(ms) && ms > latestActivityMs) latestActivityMs = ms;
  }

  if (taskSubmissions && taskSubmissions.length > 0) {
    const userTasks = taskSubmissions.filter(t => t.email.toLowerCase() === contributor.email.toLowerCase());
    for (const t of userTasks) {
      const ms = new Date(t.created_at).getTime();
      if (!isNaN(ms) && ms > latestActivityMs) latestActivityMs = ms;
    }
  }

  if (latestActivityMs === 0) {
    if (contributor.profile_completed_at) {
      const ms = new Date(contributor.profile_completed_at).getTime();
      if (!isNaN(ms)) latestActivityMs = ms;
    } else if (contributor.created_at) {
      const ms = new Date(contributor.created_at).getTime();
      if (!isNaN(ms)) latestActivityMs = ms;
    }
  }

  const now = Date.now();
  const diffMs = latestActivityMs > 0 ? now - latestActivityMs : 0;
  const daysSinceActive = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  const daysRemainingBeforeDemotion = Math.max(0, INACTIVITY_LIMIT_DAYS - daysSinceActive);
  const isAtRisk = contributor.contributor_level !== 'LEVEL_1' && daysSinceActive >= 10 && daysSinceActive < INACTIVITY_LIMIT_DAYS;
  const isDemoted = Boolean(contributor.demoted_due_to_inactivity);

  return {
    daysSinceActive,
    daysRemainingBeforeDemotion,
    isAtRisk,
    isDemoted,
    lastActiveDateStr: latestActivityMs > 0 ? new Date(latestActivityMs).toLocaleDateString() : 'N/A'
  };
};

/**
 * Strict Protocol Governance Rule:
 * Pioneers who remain inactive for two weeks (14 days) will have their rank progress
 * withdrawn and reset back to LEVEL_1 automatically.
 */
export const enforceInactivityRule = (
  customContributors?: ContributorProfile[],
  taskSubmissions?: Array<{ email: string; created_at: string; status?: string }>
): { updatedContributors: ContributorProfile[]; demotedCount: number; demotedEmails: string[] } => {
  const users = customContributors || getStoredUsers();
  const now = Date.now();
  let demotedCount = 0;
  const demotedEmails: string[] = [];

  const updated = users.map(user => {
    // Level 1 users cannot be demoted further
    if (user.contributor_level === 'LEVEL_1') {
      return user;
    }

    let latestActivityMs = 0;

    if (user.last_active_at) {
      const ms = new Date(user.last_active_at).getTime();
      if (!isNaN(ms) && ms > latestActivityMs) latestActivityMs = ms;
    }

    if (taskSubmissions && taskSubmissions.length > 0) {
      const userTasks = taskSubmissions.filter(t => t.email.toLowerCase() === user.email.toLowerCase());
      for (const t of userTasks) {
        const ms = new Date(t.created_at).getTime();
        if (!isNaN(ms) && ms > latestActivityMs) latestActivityMs = ms;
      }
    }

    if (latestActivityMs === 0) {
      if (user.profile_completed_at) {
        const ms = new Date(user.profile_completed_at).getTime();
        if (!isNaN(ms)) latestActivityMs = ms;
      } else if (user.created_at) {
        const ms = new Date(user.created_at).getTime();
        if (!isNaN(ms)) latestActivityMs = ms;
      }
    }

    // Check if 14+ days have passed with zero activity
    const isInactiveOver14Days = latestActivityMs > 0 && (now - latestActivityMs > INACTIVITY_LIMIT_MS);

    if (isInactiveOver14Days) {
      demotedCount++;
      demotedEmails.push(user.email);
      const prevLevel = user.contributor_level;

      const demotedUser: ContributorProfile = {
        ...user,
        contributor_level: 'LEVEL_1',
        demoted_due_to_inactivity: true,
        last_inactivity_demotion_at: new Date().toISOString(),
        previous_level_before_demotion: prevLevel
      };

      // Sync linked application if any
      if (user.application_number) {
        try {
          updateStoredApplication(user.application_number, { contributor_level: 'LEVEL_1' });
        } catch {}
      }

      // Sync to Firebase Firestore directly
      if (isFirebaseConfigured) {
        setDoc(doc(db, 'contributor_profiles', user.email.toLowerCase()), demotedUser, { merge: true }).catch((err: any) => {
          console.warn('Firestore demotion sync notice:', err);
        });
      }

      return demotedUser;
    }

    return user;
  });

  if (demotedCount > 0) {
    saveStoredUsers(updated);

    // Check if currently active session was demoted
    const current = getCurrentContributor();
    if (current && demotedEmails.some(e => e.toLowerCase() === current.email.toLowerCase())) {
      const freshDemoted = updated.find(u => u.email.toLowerCase() === current.email.toLowerCase());
      if (freshDemoted) {
        const safeSession = { ...freshDemoted };
        delete safeSession.password;
        localStorage.setItem(SESSION_KEY, JSON.stringify(safeSession));
        notifyAuthChange();
      }
    }
  }

  return { updatedContributors: updated, demotedCount, demotedEmails };
};

// Dispatch custom event for reactive UI updates
export const notifyAuthChange = () => {
  window.dispatchEvent(new Event('refeir-auth-change'));
};

/**
 * Fetches all contributor profiles from Cloud Firestore and updates local cache.
 */
export const fetchContributorsFromDatabase = async (): Promise<ContributorProfile[]> => {
  if (!isFirebaseConfigured) {
    return getStoredUsers();
  }

  try {
    const q = query(collection(db, 'contributor_profiles'), orderBy('created_at', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const mapped = snap.docs.map(d => ({
        ...d.data(),
        id: d.id,
        password: d.data().password_hash || d.data().password || 'password123'
      })) as ContributorProfile[];

      saveStoredUsers(mapped);
      notifyAuthChange();
      return mapped;
    }
  } catch (err) {
    console.warn('Could not query contributor_profiles from Firestore:', err);
  }

  return getStoredUsers();
};

/**
 * Pushes all locally stored contributors to Cloud Firestore directly.
 */
export const syncContributorsToFirebase = async (): Promise<{ success: boolean; count: number; error?: string }> => {
  if (!isFirebaseConfigured) {
    return { success: false, count: 0, error: 'Firebase credentials not configured' };
  }

  const users = getStoredUsers();
  try {
    for (const u of users) {
      await setDoc(doc(db, 'contributor_profiles', u.email.toLowerCase()), u, { merge: true });
    }
    return { success: true, count: users.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'Sync failed' };
  }
};

export const syncContributorsToSupabase = syncContributorsToFirebase;

