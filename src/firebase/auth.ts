import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config';
import { AdminUser } from '../types/user';

/**
 * Log in admin strictly using Firebase Authentication
 * Only accounts registered in Firebase Authentication Console can sign in.
 */
export const loginAdmin = async (email: string, password: string): Promise<AdminUser> => {
  const cleanEmail = email.trim().toLowerCase();

  if (!isFirebaseConfigured || !auth) {
    throw new Error('خدمة Firebase Authentication غير مهيأة بشكل صحيح.');
  }

  try {
    const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const firebaseUser = userCred.user;

    const displayName =
      firebaseUser.displayName ||
      (cleanEmail.includes('manar') ? 'منار عماد' : cleanEmail.split('@')[0]);

    const adminUser: AdminUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName,
      role: 'admin',
    };

    return adminUser;
  } catch (err: any) {
    console.error('Firebase Auth sign-in error:', err.code, err.message);

    if (
      err.code === 'auth/invalid-credential' ||
      err.code === 'auth/invalid-login-credentials' ||
      err.code === 'auth/wrong-password' ||
      err.code === 'auth/user-not-found'
    ) {
      throw new Error(
        'بيانات الدخول غير صحيحة. يرجى التأكد من البريد الإلكتروني وكلمة المرور المسجلة في Firebase Authentication.'
      );
    } else if (err.code === 'auth/invalid-email') {
      throw new Error('صيغة البريد الإلكتروني غير صحيحة.');
    } else if (err.code === 'auth/too-many-requests') {
      throw new Error('تم حظر المحاولة مؤقتاً بسبب تكرار المحاولات الخاطئة. يرجى الانتظار قليلاً.');
    } else if (err.code === 'auth/network-request-failed') {
      throw new Error('فشل الاتصال بخوادم Firebase. يرجى التأكد من اتصال الإنترنت.');
    } else if (err.code === 'auth/user-disabled') {
      throw new Error('تم تعطيل هذا الحساب من قِبل مسؤول النظام.');
    }

    throw new Error(err.message || 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.');
  }
};

/**
 * Sign out from Firebase Auth
 */
export const logoutAdmin = async (): Promise<void> => {
  if (isFirebaseConfigured && auth) {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Sign out error:', err);
    }
  }
};

/**
 * Real-time listener for Firebase Auth state changes
 */
export const subscribeToAuthChanges = (callback: (user: AdminUser | null) => void) => {
  if (isFirebaseConfigured && auth) {
    return firebaseOnAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const isManar = firebaseUser.email?.toLowerCase().includes('manar');
        const adminUser: AdminUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName:
            firebaseUser.displayName ||
            (isManar ? 'منار عماد' : firebaseUser.email?.split('@')[0] || 'IT Admin'),
          role: 'admin',
        };
        callback(adminUser);
      } else {
        callback(null);
      }
    });
  }

  callback(null);
  return () => {};
};
