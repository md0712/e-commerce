import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Sync authentication state and verify custom claims
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setAuthError(null);

      if (user) {
        setCurrentUser(user);
        try {
          // Read verified ID token claims directly from Firebase Auth
          const tokenResult = await user.getIdTokenResult();
          const adminClaim = Boolean(tokenResult.claims.admin);
          setIsAdmin(adminClaim);

          // Fetch or initialize customer/admin profile in Firestore
          const userRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userRef);

          if (snap.exists()) {
            setUserProfile(snap.data());
          } else {
            // First time login profile document
            const newProfile = {
              uid: user.uid,
              name: user.displayName || user.email?.split('@')[0] || 'Customer',
              email: user.email,
              photoURL: user.photoURL || null,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };
            try {
              await setDoc(userRef, newProfile);
              setUserProfile(newProfile);
            } catch (err) {
              console.warn('Could not persist user profile to Firestore:', err);
              setUserProfile(newProfile);
            }
          }
        } catch (err) {
          console.error('Error verifying auth claims or profile:', err);
          setIsAdmin(false);
          setUserProfile(null);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Customer / Admin Login
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      // Immediately check claims
      const tokenResult = await userCredential.user.getIdTokenResult(true);
      const adminClaim = Boolean(tokenResult.claims.admin);
      setIsAdmin(adminClaim);
      return { user: userCredential.user, isAdmin: adminClaim };
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // Customer Registration (never grants admin claims)
  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      if (name) {
        await updateProfile(user, { displayName: name.trim() });
      }

      const newProfile = {
        uid: user.uid,
        name: name ? name.trim() : (user.email?.split('@')[0] || 'Customer'),
        email: user.email,
        photoURL: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      try {
        await setDoc(doc(db, 'users', user.uid), newProfile);
      } catch (err) {
        console.warn('Could not write initial profile to Firestore:', err);
      }

      setUserProfile(newProfile);
      return user;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setIsAdmin(false);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // Password Reset
  const resetPassword = async (email) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // Force token refresh (useful after running admin provisioning script)
  const refreshClaims = async () => {
    if (!auth.currentUser) return false;
    try {
      const tokenResult = await auth.currentUser.getIdTokenResult(true);
      const adminClaim = Boolean(tokenResult.claims.admin);
      setIsAdmin(adminClaim);
      return adminClaim;
    } catch (err) {
      console.error('Failed to refresh claims:', err);
      return false;
    }
  };

  const value = {
    currentUser,
    userProfile,
    isAdmin,
    loading,
    authError,
    login,
    register,
    logout,
    resetPassword,
    refreshClaims
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
