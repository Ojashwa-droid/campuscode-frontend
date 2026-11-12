import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, AuthMode } from '../types/auth';
import { useToast } from './useToast';
import { AuthContext } from './useAuth';

const STORAGE_KEY_USER = 'campuscode_auth_user';
const STORAGE_KEY_USERS_DB = 'campuscode_registered_users';

interface StoredUserRecord extends User {
  passwordHash?: string;
}

const DEFAULT_USERS: StoredUserRecord[] = [
  {
    id: 'user_demo_1',
    name: 'Sarah Connor',
    email: 'demo@campuscode.ai',
    passwordHash: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    provider: 'email',
    createdAt: '2026-01-15T10:00:00Z',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(() => {
    try {
      const activeSession = localStorage.getItem(STORAGE_KEY_USER);
      return activeSession ? JSON.parse(activeSession) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  useEffect(() => {
    try {
      const existingDb = localStorage.getItem(STORAGE_KEY_USERS_DB);
      if (!existingDb) {
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(DEFAULT_USERS));
      }
    } catch (e) {
      console.error('Failed to initialize local users database', e);
    }
  }, []);

  const openAuthModal = useCallback((mode: AuthMode = 'signin') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const openGithubModal = useCallback(() => {
    setIsGithubModalOpen(true);
  }, []);

  const closeGithubModal = useCallback(() => {
    setIsGithubModalOpen(false);
  }, []);

  const openDemoModal = useCallback(() => {
    setIsDemoModalOpen(true);
  }, []);

  const closeDemoModal = useCallback(() => {
    setIsDemoModalOpen(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const dbRaw = localStorage.getItem(STORAGE_KEY_USERS_DB);
      const db: StoredUserRecord[] = dbRaw ? JSON.parse(dbRaw) : DEFAULT_USERS;

      const foundUser = db.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!foundUser) {
        return { success: false, error: 'No account found with this email. Please sign up.' };
      }

      if (foundUser.passwordHash && foundUser.passwordHash !== password) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      const sessionUser: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        avatar:
          foundUser.avatar ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(foundUser.name)}`,
        provider: 'email',
        createdAt: foundUser.createdAt,
      };

      setUser(sessionUser);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionUser));
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${sessionUser.name}! Opening dashboard.`, 'success');
      navigate('/dashboard');
      return { success: true };
    } catch {
      return { success: false, error: 'An unexpected error occurred during sign in.' };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const dbRaw = localStorage.getItem(STORAGE_KEY_USERS_DB);
      const db: StoredUserRecord[] = dbRaw ? JSON.parse(dbRaw) : DEFAULT_USERS;

      const trimmedEmail = email.trim().toLowerCase();
      const existingUser = db.find((u) => u.email.toLowerCase() === trimmedEmail);

      if (existingUser) {
        return { success: false, error: 'An account with this email already exists. Please sign in.' };
      }

      const newUser: StoredUserRecord = {
        id: 'user_' + Math.random().toString(36).substring(2, 10),
        name: name.trim(),
        email: trimmedEmail,
        passwordHash: password,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=18181b`,
        provider: 'email',
        createdAt: new Date().toISOString(),
      };

      const updatedDb = [...db, newUser];
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(updatedDb));

      const sessionUser: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        provider: 'email',
        createdAt: newUser.createdAt,
      };

      setUser(sessionUser);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionUser));
      setIsAuthModalOpen(false);
      showToast(`Account created! Welcome to CampusCode, ${newUser.name}.`, 'success');
      navigate('/dashboard');
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to create account. Please try again.' };
    }
  };

  const loginWithGithub = async (handle: string = 'octodev'): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 650));

    const cleanHandle = handle.trim().replace(/^@/, '') || 'octodev';
    const githubUser: User = {
      id: 'gh_' + Math.random().toString(36).substring(2, 9),
      name: `${cleanHandle.charAt(0).toUpperCase() + cleanHandle.slice(1)} (GitHub)`,
      email: `${cleanHandle.toLowerCase()}@users.noreply.github.com`,
      avatar: `https://github.com/${cleanHandle}.png?size=150`,
      provider: 'github',
      githubHandle: cleanHandle,
      createdAt: new Date().toISOString(),
    };

    setUser(githubUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(githubUser));
    setIsGithubModalOpen(false);
    setIsAuthModalOpen(false);
    showToast(`Connected with GitHub as @${cleanHandle}!`, 'success');
    navigate('/dashboard');
    return { success: true };
  };

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    showToast('You have been signed out.', 'info');
    navigate('/');
  }, [showToast, navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authMode,
        isGithubModalOpen,
        isDemoModalOpen,
        openAuthModal,
        closeAuthModal,
        setAuthMode,
        openGithubModal,
        closeGithubModal,
        openDemoModal,
        closeDemoModal,
        login,
        signup,
        loginWithGithub,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
