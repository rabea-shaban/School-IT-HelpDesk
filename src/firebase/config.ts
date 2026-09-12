import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAALwrq_mUGhGXCWNiRZZKKTe_dJN4SYH4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "school-it-helpdesk-7fe47.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "school-it-helpdesk-7fe47",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "school-it-helpdesk-7fe47.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "310471700376",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:310471700376:web:13d5716bb43d185ace85ed",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-FTZX32J4GV",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let isFirebaseConfigured = false;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  db = getFirestore(app);
  isFirebaseConfigured = true;
} catch (error) {
  console.warn('Firebase initialization warning - running in resilient mode:', error);
}

export { app, auth, db, isFirebaseConfigured };
