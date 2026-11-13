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

const bytesToHex = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

const derivePasswordHash = async (password: string, salt: Uint8Array, iterations: number) => {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const digest = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt.slice().buffer as ArrayBuffer, iterations, hash: 'SHA-256' },
    key,
    256
  );
  return bytesToHex(new Uint8Array(digest));
};

const hashPassword = async (password: string) => {
  const iterations = 210_000;
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derivePasswordHash(password, salt, iterations);
  return `pbkdf2:${iterations}:${bytesToHex(salt)}:${hash}`;
};

const passwordMatches = async (stored: string | undefined, password: string) => {
  if (!stored) return true;
  if (stored.startsWith('pbkdf2:')) {
    const [, iterationText, saltText, expectedHash] = stored.split(':');
    const salt = new Uint8Array(saltText.match(/.{2}/g)?.map((part) => parseInt(part, 16)) ?? []);
    return await derivePasswordHash(password, salt, Number(iterationText)) === expectedHash;
  }
  if (stored.startsWith('sha256:')) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
    return stored === `sha256:${bytesToHex(new Uint8Array(digest))}`;
  }
  return stored === password;
};

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

  const [user, setUser] = useState<User | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
      const existingDb = localStorage.getItem(STORAGE_KEY_USERS_DB);
      if (!existingDb) {
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(DEFAULT_USERS));
      }
    } catch (e) {
      console.error('Failed to initialize auth store', e);
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

      if (!(await passwordMatches(foundUser.passwordHash, password))) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      if (foundUser.passwordHash && !foundUser.passwordHash.startsWith('pbkdf2:')) {
        foundUser.passwordHash = await hashPassword(password);
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(db));
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
        passwordHash: await hashPassword(password),
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
    setIsGithubModalOpen(false);
    setIsAuthModalOpen(false);
    showToast(`Connected with GitHub as @${cleanHandle}!`, 'success');
    navigate('/dashboard');
    return { success: true };
  };

  const updateProfile = async (name: string, email: string) => {
    if (!user) return { success: false, error: 'Sign in to edit your profile.' };
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanName || !/\S+@\S+\.\S+/.test(cleanEmail)) {
      return { success: false, error: 'Enter a name and a valid email address.' };
    }
    try {
      const updatedUser = { ...user, name: cleanName, email: cleanEmail };
      if (user.provider === 'email') {
        const dbRaw = localStorage.getItem(STORAGE_KEY_USERS_DB);
        const db: StoredUserRecord[] = dbRaw ? JSON.parse(dbRaw) : [];
        if (db.some((record) => record.id !== user.id && record.email.toLowerCase() === cleanEmail)) {
          return { success: false, error: 'That email address is already in use.' };
        }
        localStorage.setItem(
          STORAGE_KEY_USERS_DB,
          JSON.stringify(db.map((record) => record.id === user.id ? { ...record, name: cleanName, email: cleanEmail } : record))
        );
      }
      setUser(updatedUser);
      return { success: true };
    } catch {
      return { success: false, error: 'Profile changes could not be saved.' };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user || user.provider !== 'email') {
      return { success: false, error: 'Password changes are only available for email accounts.' };
    }
    if (newPassword.length < 8) {
      return { success: false, error: 'Use at least 8 characters for your new password.' };
    }
    try {
      const dbRaw = localStorage.getItem(STORAGE_KEY_USERS_DB);
      const db: StoredUserRecord[] = dbRaw ? JSON.parse(dbRaw) : [];
      const record = db.find((item) => item.id === user.id);
      if (!record || !(await passwordMatches(record.passwordHash, currentPassword))) {
        return { success: false, error: 'Current password is incorrect.' };
      }
      record.passwordHash = await hashPassword(newPassword);
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(db));
      return { success: true };
    } catch {
      return { success: false, error: 'Password could not be updated.' };
    }
  };

  const logout = useCallback(() => {
    navigate('/');
    setUser(null);
    showToast('You have been signed out.', 'info');
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
        updateProfile,
        changePassword,
        loginWithGithub,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
