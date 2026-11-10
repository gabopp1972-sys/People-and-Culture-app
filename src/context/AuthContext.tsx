import React, { createContext, useContext, useState, useCallback } from 'react';
import { AuthUser } from '../types/auth';
import {
  loginWithGoogleGIS,
  getStoredUserSession,
  clearUserSession,
} from '../services/auth/oauthService';

interface DeniedInfo {
  email: string;
  name?: string;
  isInactive?: boolean;
  reason?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  deniedInfo: DeniedInfo | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUserSession());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deniedInfo, setDeniedInfo] = useState<DeniedInfo | null>(null);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDeniedInfo(null);

    try {
      const loggedUser = await loginWithGoogleGIS();
      setUser(loggedUser);
      setError(null);
      setDeniedInfo(null);
    } catch (err: unknown) {
      const typedErr = err as Error & {
        isInactive?: boolean;
        deniedEmail?: string;
        deniedName?: string;
      };
      const message = typedErr instanceof Error ? typedErr.message : 'Error al iniciar sesión con Google';

      if (typedErr.isInactive || typedErr.deniedEmail) {
        setDeniedInfo({
          email: typedErr.deniedEmail || '',
          name: typedErr.deniedName,
          isInactive: typedErr.isInactive,
          reason: message,
        });
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearUserSession();
    setUser(null);
    setError(null);
    setDeniedInfo(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setDeniedInfo(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        deniedInfo,
        loginWithGoogle,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe utilizarse dentro de AuthProviderComponent');
  }
  return ctx;
};
