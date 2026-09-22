import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
      console.error('Error fetching current user:', err);
      logout();
    }
  };

  useEffect(() => {
    if (token) {
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    handleAuthSuccess(data);
    await refreshUser();
  };

  const register = async (email: string, password: string, name?: string, target_role?: string) => {
    const data = await authApi.register({ email, password, name, target_role });
    handleAuthSuccess(data);
    await refreshUser();
  };

  const demoLogin = async () => {
    const data = await authApi.demoLogin();
    handleAuthSuccess(data);
    await refreshUser();
  };

  const logout = () => {
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
