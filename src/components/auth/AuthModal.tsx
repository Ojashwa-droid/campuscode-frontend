import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authMode,
    setAuthMode,
    openGithubModal,
    login,
    signup,
  } = useAuth();
  const { showToast } = useToast();

  // Sign in form state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up form state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSwitchMode = (mode: 'signin' | 'signup') => {
    setErrorMessage(null);
    setAuthMode(mode);
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  // Password strength calculator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: '', color: 'bg-gray-200' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'bg-red-500' };
    if (score === 2 || score === 3)
      return { score: 2, text: 'Medium', color: 'bg-amber-500' };
    return { score: 3, text: 'Strong', color: 'bg-[#10B981]' };
  };

  const strength = getPasswordStrength(signUpPassword);

  // 1-Click Demo Fill for easy testing
  const handleFillDemo = () => {
    setSignInEmail('demo@campuscode.ai');
    setSignInPassword('password123');
    setErrorMessage(null);
  };

  // Sign In handler
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signInEmail.trim() || !signInPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(signInEmail, signInPassword);
    setLoading(false);

    if (!result.success && result.error) {
      setErrorMessage(result.error);
    }
  };

  // Sign Up handler
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signUpName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!signUpEmail.trim() || !/\S+@\S+\.\S+/.test(signUpEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Service to continue.');
      return;
    }

    setLoading(true);
    const result = await signup(signUpName, signUpEmail, signUpPassword);
    setLoading(false);

    if (!result.success && result.error) {
      setErrorMessage(result.error);
    }
  };

  const handleGithubClick = () => {
    openGithubModal();
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast(
      'Password reset instructions sent! For testing, use password: password123',
      'info'
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={closeAuthModal}
    >
      <div
        className="relative my-8 w-full max-w-[480px] overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#E5E7EB] text-left transition-all"
        style={{
          animation: 'modalSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4 bg-[#FAFAF7]">
          <div className="flex items-center gap-2">
            <span className="text-[17px] font-extrabold tracking-[-0.04em] text-[#121316]">
              CampusCode
            </span>
            <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-[#111827] text-[8px] font-bold text-white">
              AI
            </span>
          </div>

          <button
            onClick={closeAuthModal}
            className="rounded-full p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Toggle: Sign In vs Create Account */}
        <div className="flex border-b border-[#E5E7EB] bg-gray-50/50">
          <button
            type="button"
            onClick={() => handleSwitchMode('signin')}
            className={`flex-1 py-3 text-center text-sm font-semibold transition-all relative ${
              authMode === 'signin'
                ? 'text-[#121316] bg-white'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign In
            {authMode === 'signin' && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#10B981]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode('signup')}
            className={`flex-1 py-3 text-center text-sm font-semibold transition-all relative ${
              authMode === 'signup'
                ? 'text-[#121316] bg-white'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Create Account
            {authMode === 'signup' && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#10B981]" />
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* GitHub Auth Button (Primary feature) */}
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGithubClick}
              className="group flex h-11 w-full items-center justify-center gap-3 rounded-xl bg-[#111827] px-4 text-sm font-bold text-white shadow-md transition hover:bg-[#1f2937] active:scale-[0.99] cursor-pointer"
            >
              <FontAwesomeIcon
                icon={faGithub}
                className="text-[17px] transition group-hover:rotate-6"
              />
              <span>
                {authMode === 'signin'
                  ? 'Sign in with GitHub'
                  : 'Sign up with GitHub'}
              </span>
              <span className="ml-auto rounded bg-white/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                Fast & Local
              </span>
            </button>

            <div className="mt-4 flex items-center gap-3">
              <div className="h-[1px] flex-1 bg-gray-200" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                or with email
              </span>
              <div className="h-[1px] flex-1 bg-gray-200" />
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 animate-fadeIn">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="h-11 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-[#10B981] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-11 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & 1-Click Demo */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#10B981] focus:ring-[#10B981]"
                  />
                  <span>Remember me for 30 days</span>
                </label>

                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-[#059669] hover:bg-emerald-100 transition"
                  title="Auto-fill with sample credentials"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Demo Fill</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#10B981] text-sm font-bold text-white shadow-md transition hover:bg-[#059669] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to CampusCode</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* SIGN UP FORM */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <UserIcon className="absolute left-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Alex Morgan"
                    required
                    className="h-10 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Work or University Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="alex@university.edu"
                    required
                    className="h-10 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Password
                  </label>
                  {signUpPassword && (
                    <span className="text-[11px] font-semibold text-gray-500">
                      Strength:{' '}
                      <span
                        className={
                          strength.score === 3
                            ? 'text-[#10B981]'
                            : strength.score === 2
                            ? 'text-amber-500'
                            : 'text-red-500'
                        }
                      >
                        {strength.text}
                      </span>
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="h-10 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Password strength bar */}
                {signUpPassword && (
                  <div className="mt-1.5 flex gap-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full flex-1 rounded-full ${
                        strength.score >= 1 ? strength.color : 'bg-transparent'
                      }`}
                    />
                    <div
                      className={`h-full flex-1 rounded-full ${
                        strength.score >= 2 ? strength.color : 'bg-transparent'
                      }`}
                    />
                    <div
                      className={`h-full flex-1 rounded-full ${
                        strength.score >= 3 ? strength.color : 'bg-transparent'
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className={`h-10 w-full rounded-xl border bg-white pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition ${
                      signUpConfirmPassword &&
                      signUpPassword !== signUpConfirmPassword
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-gray-300 focus:border-[#10B981] focus:ring-[#10B981]/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition"
                    aria-label={
                      showConfirmPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {signUpConfirmPassword &&
                  signUpPassword === signUpConfirmPassword && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-[#10B981]">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Passwords match</span>
                    </div>
                  )}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#10B981] focus:ring-[#10B981] mt-0.5"
                  />
                  <span className="leading-tight">
                    I agree to the{' '}
                    <span className="font-semibold text-gray-800">
                      Terms of Service
                    </span>{' '}
                    and{' '}
                    <span className="font-semibold text-gray-800">
                      Privacy Policy
                    </span>
                    .
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#10B981] text-sm font-bold text-white shadow-md transition hover:bg-[#059669] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Privacy & Local AI Assurance */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] text-gray-500">
            <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
            <span>100% Client-Side Evaluation • No Raw Code Stored</span>
          </div>

          {/* Toggle between modes */}
          <div className="mt-4 border-t border-gray-100 pt-4 text-center text-xs text-gray-600">
            {authMode === 'signin' ? (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('signup')}
                  className="font-bold text-[#10B981] hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('signin')}
                  className="font-bold text-[#10B981] hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
