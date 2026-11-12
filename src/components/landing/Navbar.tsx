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
  FileCode2,
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
    <header className="sticky top-0 z-40 border-b border-[var(--color-rule)] bg-[color:var(--color-ground)]/95 backdrop-blur-sm">
      <div className="cc-container flex min-h-16 items-center justify-between gap-4">
        {/* Brand */}
        <Link
          to="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex shrink-0 items-center gap-2 no-underline"
        >
          <img src="/assets/logo.png" alt="CampusCode" width={24} height={24} className="h-6 w-6 invert" />
          <span className="text-sm font-medium tracking-[-0.05em] text-[color:var(--color-ink)]">
            CampusCode
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
          <Link
            to="/"
            className={`rounded-[var(--radius-control)] px-3 py-2 text-xs no-underline transition-colors duration-150 ${
              pathname === '/'
                ? 'bg-[color:var(--color-surface)] text-[color:var(--color-ink)]'
                : 'text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]'
            }`}
          >
            Overview
          </Link>

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`rounded-[var(--radius-control)] px-3 py-2 text-xs no-underline transition-colors duration-150 ${
                isDashboard
                  ? 'bg-[color:var(--color-surface)] text-[color:var(--color-ink)]'
                  : 'text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]'
              }`}
            >
              Dashboard
            </Link>
          )}

          <button
            type="button"
            onClick={openDemoModal}
            className="flex items-center gap-1.5 rounded-[var(--radius-control)] px-3 py-2 text-xs text-[color:var(--color-ok)] hover:bg-[color:var(--color-surface)] transition-colors duration-150 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Demo</span>
          </button>

          <a
            href="https://documenter.getpostman.com/view/41403866/2sBYHYuy7j"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-[var(--radius-control)] px-3 py-2 text-xs text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)] no-underline transition-colors duration-150"
          >
            <FileCode2 className="h-3.5 w-3.5" />
            <span>API docs</span>
          </a>
        </nav>

        {/* Desktop Auth Actions */}
        <div className="hidden lg:flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="cc-button cc-button--quiet min-h-10 border-0 text-xs"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="cc-button cc-button--quiet min-h-10 text-xs"
              >
                Sign Up
              </button>

              <button
                type="button"
                onClick={openGithubModal}
                className="cc-button cc-button--primary min-h-10 text-xs"
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

        {/* Mobile Menu Trigger */}
        <div className="lg:hidden flex items-center gap-2">
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
            className="cc-button cc-button--quiet min-h-10 w-10 px-0"
            aria-label={isMobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-[var(--color-rule)] bg-[color:var(--color-source)] lg:hidden animate-fadeIn"
        >
          <div className="cc-container grid gap-1 py-3">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`rounded-[var(--radius-control)] px-3 py-3 text-sm no-underline ${
                pathname === '/'
                  ? 'bg-[color:var(--color-surface)] text-[color:var(--color-ink)]'
                  : 'text-[color:var(--color-ink-soft)]'
              }`}
            >
              Overview
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`rounded-[var(--radius-control)] px-3 py-3 text-sm no-underline ${
                  isDashboard
                    ? 'bg-[color:var(--color-surface)] text-[color:var(--color-ink)]'
                    : 'text-[color:var(--color-ink-soft)]'
                }`}
              >
                Dashboard
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openDemoModal();
              }}
              className="flex items-center gap-2 rounded-[var(--radius-control)] px-3 py-3 text-left text-sm text-[color:var(--color-ok)]"
            >
              <Sparkles className="h-4 w-4" />
              <span>Interactive Demo</span>
            </button>

            <a
              href="https://documenter.getpostman.com/view/41403866/2sBYHYuy7j"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-[var(--radius-control)] px-3 py-3 text-sm text-[color:var(--color-ink-soft)] no-underline"
            >
              <FileCode2 className="h-4 w-4" />
              <span>API docs</span>
            </a>

            {!isAuthenticated ? (
              <div className="mt-2 grid gap-2 border-t border-[var(--color-rule)] pt-3">
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
                  Sign Up
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
              <div className="mt-2 grid gap-2 border-t border-[var(--color-rule)] pt-3">
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
        </nav>
      )}
    </header>
  );
};

export default Navbar;
