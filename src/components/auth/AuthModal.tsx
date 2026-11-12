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

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSwitchMode = (mode: 'signin' | 'signup') => {
    setErrorMessage(null);
    setAuthMode(mode);
  };

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

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: '', color: 'bg-[color:var(--color-rule)]' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'bg-[color:var(--color-warning)]' };
    if (score === 2 || score === 3)
      return { score: 2, text: 'Medium', color: 'bg-[color:var(--color-recruiter)]' };
    return { score: 3, text: 'Strong', color: 'bg-[color:var(--color-ok)]' };
  };

  const strength = getPasswordStrength(signUpPassword);

  const handleFillDemo = () => {
    setSignInEmail('demo@campuscode.ai');
    setSignInPassword('password123');
    setErrorMessage(null);
  };

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

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast('Password reset instructions sent! For testing, use password: password123', 'info');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={authMode === 'signin' ? 'Sign in to CampusCode' : 'Create CampusCode account'}
      onClick={closeAuthModal}
    >
      <div
        className="cc-panel relative my-8 w-full max-w-[480px] overflow-hidden shadow-2xl text-left"
        style={{
          animation: 'modalSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[var(--color-rule)] bg-[color:var(--color-source)] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <img src="/assets/logo.png" alt="" width={20} height={20} className="h-5 w-5 invert" />
            <span className="text-sm font-semibold tracking-[-0.04em] text-[color:var(--color-ink)]">
              CampusCode
            </span>
            <span className="rounded-[var(--radius-control)] border border-[var(--color-rule-strong)] bg-[color:var(--color-surface)] px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--color-instrument)]">
              AI
            </span>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            className="cc-button cc-button--quiet min-h-8 w-8 border-0 px-0"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 border-b border-[var(--color-rule)] bg-[color:var(--color-source)]">
          <button
            type="button"
            onClick={() => handleSwitchMode('signin')}
            className={`relative py-3 text-center text-xs font-medium transition-colors cursor-pointer ${
              authMode === 'signin'
                ? 'bg-[color:var(--color-surface)] text-[color:var(--color-ink)]'
                : 'text-[color:var(--color-muted)] hover:text-[color:var(--color-ink-soft)]'
            }`}
          >
            Sign In
            {authMode === 'signin' && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[color:var(--color-recruiter)]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode('signup')}
            className={`relative py-3 text-center text-xs font-medium transition-colors cursor-pointer ${
              authMode === 'signup'
                ? 'bg-[color:var(--color-surface)] text-[color:var(--color-ink)]'
                : 'text-[color:var(--color-muted)] hover:text-[color:var(--color-ink-soft)]'
            }`}
          >
            Create Account
            {authMode === 'signup' && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[color:var(--color-recruiter)]" />
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* GitHub Auth Trigger */}
          <div className="mb-5">
            <button
              type="button"
              onClick={openGithubModal}
              className="cc-button w-full justify-between border-[var(--color-rule-strong)] bg-[color:var(--color-source)] px-4 hover:border-[var(--color-instrument)]"
            >
              <span className="flex items-center gap-2.5 text-[color:var(--color-ink)]">
                <FontAwesomeIcon icon={faGithub} className="text-base" />
                <span>{authMode === 'signin' ? 'Sign in with GitHub' : 'Sign up with GitHub'}</span>
              </span>
              <span className="rounded border border-[var(--color-rule)] bg-[color:var(--color-ok-soft)] px-2 py-0.5 text-[10px] text-[color:var(--color-ok)]">
                Fast &amp; Local
              </span>
            </button>

            <div className="mt-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-[color:var(--color-rule)]" />
              <span className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-muted)]">
                or with email
              </span>
              <div className="h-px flex-1 bg-[color:var(--color-rule)]" />
            </div>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2.5 rounded-[var(--radius-control)] border border-[var(--color-warning)] bg-[color:var(--color-warning-soft)] p-3 text-xs text-[color:var(--color-ink)] animate-fadeIn"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-[color:var(--color-warning)]" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {authMode === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="cc-label block uppercase tracking-[0.12em] mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="pointer-events-none absolute left-3.5 h-4 w-4 text-[color:var(--color-muted)]" />
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="cc-input pl-10"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="cc-label uppercase tracking-[0.12em]">Password</label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] text-[color:var(--color-instrument)] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="pointer-events-none absolute left-3.5 h-4 w-4 text-[color:var(--color-muted)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="cc-input pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)] transition cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[color:var(--color-ink-soft)]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-[var(--color-rule-strong)] bg-[color:var(--color-source)] accent-[var(--color-recruiter)]"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-instrument-soft)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-instrument)] hover:border-[var(--color-instrument)] transition cursor-pointer"
                  title="Auto-fill with sample credentials"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Demo Fill</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cc-button cc-button--primary mt-2 w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In &amp; Open Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {authMode === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div>
                <label className="cc-label block uppercase tracking-[0.12em] mb-1.5">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <UserIcon className="pointer-events-none absolute left-3.5 h-4 w-4 text-[color:var(--color-muted)]" />
                  <input
                    type="text"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Alex Morgan"
                    required
                    className="cc-input min-h-10 pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="cc-label block uppercase tracking-[0.12em] mb-1.5">
                  Work or University Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="pointer-events-none absolute left-3.5 h-4 w-4 text-[color:var(--color-muted)]" />
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="alex@university.edu"
                    required
                    className="cc-input min-h-10 pl-10"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="cc-label uppercase tracking-[0.12em]">Password</label>
                  {signUpPassword && (
                    <span className="text-[11px] text-[color:var(--color-muted)]">
                      Strength:{' '}
                      <span
                        className={
                          strength.score === 3
                            ? 'text-[color:var(--color-ok)]'
                            : strength.score === 2
                            ? 'text-[color:var(--color-recruiter)]'
                            : 'text-[color:var(--color-warning)]'
                        }
                      >
                        {strength.text}
                      </span>
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className="pointer-events-none absolute left-3.5 h-4 w-4 text-[color:var(--color-muted)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="cc-input min-h-10 pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)] transition cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {signUpPassword && (
                  <div className="mt-1.5 flex gap-1 h-1 w-full bg-[color:var(--color-source)] rounded-full overflow-hidden">
                    <div className={`h-full flex-1 ${strength.score >= 1 ? strength.color : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 ${strength.score >= 2 ? strength.color : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 ${strength.score >= 3 ? strength.color : 'bg-transparent'}`} />
                  </div>
                )}
              </div>

              <div>
                <label className="cc-label block uppercase tracking-[0.12em] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="pointer-events-none absolute left-3.5 h-4 w-4 text-[color:var(--color-muted)]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className={`cc-input min-h-10 pl-10 pr-10 ${
                      signUpConfirmPassword && signUpPassword !== signUpConfirmPassword
                        ? 'border-[var(--color-warning)]'
                        : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)] transition cursor-pointer"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {signUpConfirmPassword && signUpPassword === signUpConfirmPassword && (
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-[color:var(--color-ok)]">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Passwords match</span>
                  </div>
                )}
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-[color:var(--color-ink-soft)]">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[var(--color-rule-strong)] accent-[var(--color-recruiter)]"
                  />
                  <span className="leading-tight">
                    I agree to the{' '}
                    <span className="font-medium text-[color:var(--color-ink)]">Terms of Service</span> and{' '}
                    <span className="font-medium text-[color:var(--color-ink)]">Privacy Policy</span>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cc-button cc-button--primary mt-3 w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account &amp; Open Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] text-[color:var(--color-muted)]">
            <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--color-ok)]" />
            <span>100% Client-Side Evaluation • No Raw Code Stored</span>
          </div>

          <div className="mt-4 border-t border-[var(--color-rule)] pt-4 text-center text-xs text-[color:var(--color-muted)]">
            {authMode === 'signin' ? (
              <span>
                Don&apos;t have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('signup')}
                  className="font-medium text-[color:var(--color-recruiter)] hover:underline cursor-pointer"
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
                  className="font-medium text-[color:var(--color-recruiter)] hover:underline cursor-pointer"
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
