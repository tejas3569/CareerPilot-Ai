import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';
import { User, AuthResponse } from '../types';
import { authApi } from '../api/endpoints';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isDemo: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string, target_role?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('careerpilot_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isDemo = Boolean(user?.is_demo || (token && localStorage.getItem('careerpilot_is_demo') === 'true'));

  const handleAuthSuccess = (data: AuthResponse) => {
    localStorage.setItem('careerpilot_token', data.access_token);
    localStorage.setItem('careerpilot_is_demo', data.is_demo ? 'true' : 'false');
    setToken(data.access_token);
  };

  const refreshUser = async () => {
    try {
      const userData = await authApi.getMe();
      setUser(userData);
    } catch (err) {
      console.error('Error fetching current user from backend:', err);
      // Fallback: check if we have a Firebase user active
      const fbCurrentUser = auth.currentUser;
      if (fbCurrentUser) {
        let role = 'Software Developer';
        try {
          const snap = await getDoc(doc(db, 'users', fbCurrentUser.uid));
          if (snap.exists()) {
            role = snap.data()?.target_role || role;
          }
        } catch {}

        setUser({
          id: fbCurrentUser.uid,
          email: fbCurrentUser.email || 'student@careerpilot.ai',
          is_demo: false,
          profile: {
            id: fbCurrentUser.uid,
            name: fbCurrentUser.displayName || 'Student',
            target_role: role,
            created_at: new Date().toISOString()
          }
        });
      } else {
        logout();
      }
    }
  };

  // Monitor Firebase Authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        // User is authenticated via Firebase!
        let targetRole = 'Software Developer';
        let studentName = fbUser.displayName || 'Student';

        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            targetRole = data?.target_role || targetRole;
            studentName = data?.name || studentName;
          }
        } catch (e) {
          console.warn('Firestore user fetch notice:', e);
        }

        const idToken = await fbUser.getIdToken();
        localStorage.setItem('careerpilot_token', idToken);
        setToken(idToken);

        setUser({
          id: fbUser.uid,
          email: fbUser.email || '',
          is_demo: false,
          profile: {
            id: fbUser.uid,
            name: studentName,
            target_role: targetRole,
            created_at: new Date().toISOString()
          }
        });
        setIsLoading(false);
      } else {
        // No Firebase user; check local storage token (for demo or backend login)
        const localToken = localStorage.getItem('careerpilot_token');
        if (localToken) {
          refreshUser().finally(() => setIsLoading(false));
        } else {
          setIsLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    let fbSuccess = false;
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      fbSuccess = true;
      const idToken = await userCred.user.getIdToken();
      localStorage.setItem('careerpilot_token', idToken);
      localStorage.setItem('careerpilot_is_demo', 'false');
      setToken(idToken);
    } catch (fbErr: any) {
      console.warn('Firebase login attempt:', fbErr?.message);
    }

    // Also attempt backend login for local API parity
    try {
      const data = await authApi.login({ email, password });
      handleAuthSuccess(data);
      await refreshUser();
    } catch (apiErr) {
      if (!fbSuccess) {
        throw apiErr;
      }
    }
  };

  const register = async (email: string, password: string, name?: string, target_role?: string) => {
    let fbSuccess = false;
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      fbSuccess = true;

      if (name) {
        await updateProfile(userCred.user, { displayName: name });
      }

      // Persist user record in Cloud Firestore
      try {
        await setDoc(doc(db, 'users', userCred.user.uid), {
          email,
          name: name || 'Student',
          target_role: target_role || 'Software Developer',
          created_at: new Date().toISOString()
        });
      } catch (dbErr) {
        console.warn('Firestore setDoc notice:', dbErr);
      }

      const idToken = await userCred.user.getIdToken();
      localStorage.setItem('careerpilot_token', idToken);
      localStorage.setItem('careerpilot_is_demo', 'false');
      setToken(idToken);
    } catch (fbErr: any) {
      console.warn('Firebase register notice:', fbErr?.message);
    }

    // Also register in backend if reachable
    try {
      const data = await authApi.register({ email, password, name, target_role });
      handleAuthSuccess(data);
      await refreshUser();
    } catch (apiErr) {
      if (!fbSuccess) {
        throw apiErr;
      }
    }
  };

  const loginWithGoogle = async () => {
    const userCred = await signInWithPopup(auth, googleProvider);
    const fbUser = userCred.user;

    // Check / Save to Firestore
    try {
      const userDocRef = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(userDocRef);
      if (!snap.exists()) {
        await setDoc(userDocRef, {
          email: fbUser.email,
          name: fbUser.displayName || 'Student',
          target_role: 'Software Developer',
          created_at: new Date().toISOString()
        });
      }
    } catch (e) {
      console.warn('Firestore Google user sync notice:', e);
    }

    const idToken = await fbUser.getIdToken();
    localStorage.setItem('careerpilot_token', idToken);
    localStorage.setItem('careerpilot_is_demo', 'false');
    setToken(idToken);
  };

  const demoLogin = async () => {
    const data = await authApi.demoLogin();
    handleAuthSuccess(data);
    await refreshUser();
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}
    localStorage.removeItem('careerpilot_token');
    localStorage.removeItem('careerpilot_is_demo');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isDemo,
        isLoading,
        login,
        register,
        loginWithGoogle,
        demoLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
