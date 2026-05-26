import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const normalizeFirebaseEnvValue = (value: string) => {
  const trimmed = value.trim();

  // If someone accidentally stored the entire `.env` line as the secret value,
  // e.g. "VITE_FIREBASE_API_KEY = AIza...", strip the prefix.
  const withoutPrefix = trimmed.replace(/^VITE_FIREBASE_[A-Z_]+\s*=\s*/i, '');

  // Strip wrapping quotes if present.
  return withoutPrefix.replace(/^['"]|['"]$/g, '').trim();
};

const readFirebaseEnv = (value: string | undefined, fallback: string) =>
  normalizeFirebaseEnvValue(value ?? fallback);

const firebaseConfig = {
  apiKey: readFirebaseEnv(import.meta.env.VITE_FIREBASE_API_KEY, 'AIzaSyDummyApiKeyForDevelopment'),
  authDomain: readFirebaseEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, 'techlingo-demo.firebaseapp.com'),
  projectId: readFirebaseEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID, 'techlingo-demo'),
  storageBucket: readFirebaseEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, 'techlingo-demo.appspot.com'),
  messagingSenderId: readFirebaseEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, '123456789'),
  appId: readFirebaseEnv(import.meta.env.VITE_FIREBASE_APP_ID, '1:123456789:web:abcdef123456'),
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
// Firebase secrets rebuild
