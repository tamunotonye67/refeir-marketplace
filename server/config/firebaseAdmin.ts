import { initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import dotenv from 'dotenv';
dotenv.config();

let isConfigured = false;
let db: Firestore | null = null;
let auth: Auth | null = null;
let adminApp: App | null = null;

try {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;

  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id || projectId
    });
    isConfigured = true;
  } else if (projectId && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      }),
      projectId
    });
    isConfigured = true;
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    adminApp = initializeApp({
      projectId
    });
    isConfigured = true;
  }

  if (isConfigured && adminApp) {
    db = getFirestore(adminApp);
    auth = getAuth(adminApp);
  }
} catch (error) {
  console.warn('[Firebase Admin] Warning: Running without Firebase Admin credentials. Using resilient local memory store.', (error as any)?.message);
  isConfigured = false;
}

export const adminDb = db;
export const adminAuth = auth;
export const isFirebaseAdminConfigured = isConfigured;

export async function checkAdminFirebaseConnection(): Promise<{
  connected: boolean;
  mode: 'FIREBASE_ADMIN' | 'LOCAL_STORE';
  message: string;
}> {
  if (!isConfigured || !db) {
    return {
      connected: true,
      mode: 'LOCAL_STORE',
      message: 'Server is running in local memory/file store mode (No service account required).'
    };
  }

  try {
    await db.collection('pioneer_applications').limit(1).get();
    return {
      connected: true,
      mode: 'FIREBASE_ADMIN',
      message: 'Successfully connected to live Cloud Firestore via Firebase Admin SDK.'
    };
  } catch (err: any) {
    return {
      connected: false,
      mode: 'FIREBASE_ADMIN',
      message: `Firebase Admin connection error: ${err.message}`
    };
  }
}
