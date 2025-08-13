import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/lib/api';

interface User {
  token: string;
  type: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userType: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (token: string, userType: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
    setUser({ token, type: userType });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setUser(null);
  };

  const checkExistingSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      
      if (token && userType) {
        // Validate token by checking if it's still valid
        const isValidSession = await apiClient.validateSession();
        
        if (isValidSession) {
          setUser({ token, type: userType });
        } else {
          // Session is invalid, clear it
          logout();
        }
      }
    } catch (error) {
      console.error('Error restoring session:', error);
      // Clear invalid session data
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkExistingSession();
  }, []);

  const value: AuthContextType = useMemo(() => ({
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: user !== null,
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
