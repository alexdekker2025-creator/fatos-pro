'use client';

import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
}

interface AuthResult {
  success: boolean;
  error?: string;
  requiresTwoFactor?: boolean;
  userId?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Проверка сессии при загрузке
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/auth/session?sessionId=${sessionId}`);
      const data = await response.json();

      if (data.valid) {
        setUser(data.user);
      } else {
        localStorage.removeItem('sessionId');
      }
    } catch (error) {
      console.error('Session check error:', error);
      localStorage.removeItem('sessionId');
    } finally {
      setLoading(false);
    }
  };

  const register = useCallback(async (
    email: string,
    password: string,
    name: string
  ): Promise<AuthResult> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('sessionId', data.session.id);
        setUser(data.user);
        return { success: true };
      }

      return { success: false, error: data.error };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error' };
    }
  }, []);

  const login = useCallback(async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Check if 2FA is required
      if (data.requiresTwoFactor) {
        return { 
          success: false, 
          requiresTwoFactor: true, 
          userId: data.userId 
        };
      }

      if (data.success) {
        localStorage.setItem('sessionId', data.session.id);
        setUser(data.user);
        return { success: true };
      }

      return { success: false, error: data.error };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  }, []);

  const logout = useCallback(async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('sessionId');
      setUser(null);
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  };
}
