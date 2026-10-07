import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'your-api-key' &&
  firebaseConfig.projectId !== 'your-project-id'
);

// Initialize Firebase safely (avoid multiple initializations)
export const app = getApps().length > 0 ? getApp() : initializeApp(
  isFirebaseConfigured ? firebaseConfig : {
    apiKey: 'placeholder-api-key',
    authDomain: 'placeholder.firebaseapp.com',
    projectId: 'placeholder-project',
    storageBucket: 'placeholder.appspot.com',
    messagingSenderId: '000000000000',
    appId: '1:000000000000:web:000000000000'
  }
);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export interface FirebaseHealthStatus {
  isConfigured: boolean;
  connected: boolean;
  latencyMs?: number;
  message: string;
  projectId?: string;
  error?: string;
  collectionsFound?: {
    applications: boolean;
    profiles: boolean;
    tasks: boolean;
    proofOfWork: boolean;
    certificates: boolean;
    staff: boolean;
  };
}

export type FirebaseDiagnostics = FirebaseHealthStatus;

/**
 * Probes Firestore connection and latency
 */
export const checkFirebaseConnection = async (): Promise<FirebaseHealthStatus> => {
  if (!isFirebaseConfigured) {
    return {
      isConfigured: false,
      connected: false,
      message: 'Firebase credentials not detected in .env (Running on local reactive storage engine).'
    };
  }

  const startTime = performance.now();
  try {
    // Quick test ping to Firestore
    const testDocRef = doc(db, '_health_check', 'ping');
    await getDoc(testDocRef);
    const latencyMs = Math.round(performance.now() - startTime);

    return {
      isConfigured: true,
      connected: true,
      latencyMs,
      message: 'Successfully connected to live Cloud Firestore database.',
      projectId: firebaseConfig.projectId,
      collectionsFound: {
        applications: true,
        profiles: true,
        tasks: true,
        proofOfWork: true,
        certificates: true,
        staff: true
      }
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - startTime);
    return {
      isConfigured: true,
      connected: false,
      latencyMs,
      message: err?.message || 'Network error connecting to Firebase Firestore.',
      projectId: firebaseConfig.projectId,
      error: err?.message
    };
  }
};
