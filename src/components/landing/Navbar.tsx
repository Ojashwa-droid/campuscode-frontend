import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  Sparkles,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Play,
  ShieldCheck,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';

const Navbar = () => {
  const {
    user,
    isAuthenticated,
    openAuthModal,
    openGithubModal,
    openDemoModal,
    logout,
  } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDashboard = pathname === '/dashboard';

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-rule)] bg-[color:var(--color-ground)]/95 backdrop-blur-md">
      <div className="cc-container flex min-h-16 items-center justify-between gap-4">
        {/* Brand */}
        <Link
          to="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex shrink-0 items-center gap-2.5 no-underline"
        >
          <img src="/assets/logo.png" alt="CampusCode" width={24} height={24} className="h-6 w-6 invert" />
          <span className="text-sm font-semibold tracking-[-0.04em] text-[color:var(--color-ink)]">
            CampusCode
          </span>
          <span className="rounded-[var(--radius-control)] border border-[var(--color-rule-strong)] bg-[color:var(--color-surface)] px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--color-instrument)]">
            AI
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Primary navigation" className="hidden items-center gap-6 lg:flex">
          {!isDashboard ? (
            <>
              <a
                href="#how-it-works"
                className="text-xs text-[color:var(--color-muted)] transition-colors hover:text-[color:var(--color-ink)] no-underline"
              >
                How it works
              </a>
              <a
                href="#features"
                className="text-xs text-[color:var(--color-muted)] transition-colors hover:text-[color:var(--color-ink)] no-underline"
              >
                Features
              </a>
              <a
                href="#faq"
                className="text-xs text-[color:var(--color-muted)] transition-colors hover:text-[color:var(--color-ink)] no-underline"
              >
                FAQ
              </a>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="text-xs text-[color:var(--color-muted)] transition-colors hover:text-[color:var(--color-ink)] no-underline"
              >
                Overview
              </Link>
              <Link
                to="/dashboard"
                className="rounded-[var(--radius-control)] bg-[color:var(--color-surface)] px-3 py-1.5 text-xs text-[color:var(--color-ink)] border border-[var(--color-rule)] no-underline"
              >
                Dashboard
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={openDemoModal}
            className="flex items-center gap-1.5 text-xs font-medium text-[color:var(--color-ok)] hover:text-[color:var(--color-ink)] transition-colors cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Demo</span>
          </button>

          {isAuthenticated && !isDashboard && (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-xs font-medium text-[color:var(--color-instrument)] hover:text-[color:var(--color-ink)] transition-colors no-underline"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {!isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="cc-button cc-button--quiet min-h-9 border-0 text-xs"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="cc-button cc-button--quiet min-h-9 text-xs"
              >
                Sign Up
              </button>

              <button
                type="button"
                onClick={openGithubModal}
                className="cc-button cc-button--primary min-h-9 text-xs"
              >
                <FontAwesomeIcon icon={faGithub} className="text-sm" />
                <span>Sign in with GitHub</span>
              </button>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 rounded-[var(--radius-control)] border border-[var(--color-rule-strong)] bg-[color:var(--color-surface)] px-2.5 py-1.5 hover:border-[var(--color-ink-soft)] transition cursor-pointer"
              >
                <img
                  src={
                    user?.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      user?.name || 'User'
                    )}`
                  }
                  alt={user?.name}
                  className="h-7 w-7 rounded-full border border-[var(--color-rule)] object-cover bg-[color:var(--color-source)]"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-medium text-[color:var(--color-ink)] leading-tight">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-[color:var(--color-muted)] flex items-center gap-1">
                    {user?.provider === 'github' ? (
                      <>
                        <FontAwesomeIcon icon={faGithub} className="text-[10px]" />
                        <span>@{user?.githubHandle || 'github'}</span>
                      </>
                    ) : (
                      'Member'
                    )}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-[color:var(--color-muted)]" />
              </button>

              {isDropdownOpen && (
                <div
                  className="cc-panel absolute right-0 mt-2 w-64 origin-top-right p-2 shadow-2xl z-50 text-left"
                  style={{
                    animation: 'modalSlideUp 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  }}
                >
                  <div className="border-b border-[var(--color-rule)] p-3">
                    <p className="cc-label uppercase tracking-[0.12em]">Signed in as</p>
                    <p className="mt-1 text-xs font-medium text-[color:var(--color-ink)] truncate">
                      {user?.name}
                    </p>
                    <p className="text-[11px] text-[color:var(--color-muted)] truncate">{user?.email}</p>
                    {user?.provider === 'github' && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded border border-[var(--color-rule)] bg-[color:var(--color-ok-soft)] px-2 py-0.5 text-[10px] font-medium text-[color:var(--color-ok)]">
                        <ShieldCheck className="h-3 w-3" />
                        <span>GitHub Verified</span>
                      </div>
                    )}
                  </div>

                  <div className="py-1 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/dashboard');
                      }}
                      className="flex w-full items-center gap-2 rounded-[var(--radius-control)] px-3 py-2 text-xs text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-source)] hover:text-[color:var(--color-ink)] transition cursor-pointer"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5 text-[color:var(--color-instrument)]" />
                      <span>Open Dashboard</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        openDemoModal();
                      }}
                      className="flex w-full items-center gap-2 rounded-[var(--radius-control)] px-3 py-2 text-xs text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-source)] hover:text-[color:var(--color-ink)] transition cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5 text-[color:var(--color-ok)]" />
                      <span>View Demo Tour</span>
                    </button>
                  </div>

                  <div className="border-t border-[var(--color-rule)] pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 rounded-[var(--radius-control)] px-3 py-2 text-xs font-medium text-[color:var(--color-warning)] hover:bg-[color:var(--color-warning-soft)] transition cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="sm:hidden flex items-center gap-2">
          {isAuthenticated && (
            <img
              src={user?.avatar}
              alt={user?.name}
              className="h-7 w-7 rounded-full border border-[var(--color-rule)] object-cover"
            />
          )}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="cc-button cc-button--quiet min-h-9 w-9 px-0"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="border-t border-[var(--color-rule)] bg-[color:var(--color-source)] px-6 py-4 sm:hidden text-left space-y-3 animate-fadeIn">
          <div className="flex flex-col gap-2 pb-3 border-b border-[var(--color-rule)]">
            {!isDashboard ? (
              <>
                <a
                  href="#how-it-works"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs font-medium text-[color:var(--color-ink-soft)] py-1.5 no-underline"
                >
                  How it works
                </a>
                <a
                  href="#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs font-medium text-[color:var(--color-ink-soft)] py-1.5 no-underline"
                >
                  Features
                </a>
                <a
                  href="#faq"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs font-medium text-[color:var(--color-ink-soft)] py-1.5 no-underline"
                >
                  FAQ
                </a>
              </>
            ) : (
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-medium text-[color:var(--color-ink-soft)] py-1.5 no-underline"
              >
                Overview
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openDemoModal();
              }}
              className="flex items-center gap-2 text-xs font-medium text-[color:var(--color-ok)] py-1.5 text-left"
            >
              <Sparkles className="h-4 w-4" />
              <span>Interactive Demo</span>
            </button>
          </div>

          {!isAuthenticated ? (
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal('signin');
                }}
                className="cc-button cc-button--quiet w-full"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal('signup');
                }}
                className="cc-button cc-button--quiet w-full"
              >
                Create Free Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openGithubModal();
                }}
                className="cc-button cc-button--primary w-full"
              >
                <FontAwesomeIcon icon={faGithub} className="text-sm" />
                <span>Sign in with GitHub</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 space-y-2">
              <div className="mb-2">
                <p className="cc-label">Logged in as</p>
                <p className="text-xs font-medium text-[color:var(--color-ink)]">{user?.name}</p>
                <p className="text-[11px] text-[color:var(--color-muted)]">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
                className="cc-button cc-button--primary w-full"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Open Dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="cc-button cc-button--quiet w-full text-[color:var(--color-warning)]"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
