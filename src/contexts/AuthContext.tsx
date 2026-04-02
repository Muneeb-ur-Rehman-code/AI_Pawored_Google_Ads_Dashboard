import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type Role = 'admin' | 'manager' | 'viewer';

interface AuthUser {
  name: string;
  email: string;
  role: Role;
  initials: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  login: (email: string, password: string) => void;
  adminLogin: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((email: string, _password: string) => {
    const u: AuthUser = { name: 'Sarah Mitchell', email, role: 'manager', initials: 'SM' };
    setUser(u);
    localStorage.setItem('auth_user', JSON.stringify(u));
  }, []);

  const adminLogin = useCallback((email: string, _password: string) => {
    const u: AuthUser = { name: 'Tariq Mohammed', email, role: 'admin', initials: 'TM' };
    setUser(u);
    localStorage.setItem('auth_user', JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.role === 'admin', login, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
