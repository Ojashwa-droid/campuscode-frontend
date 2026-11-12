import { useState, useRef, useEffect } from 'react';
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-[#FAFAF7]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <a href="#" className="flex items-center gap-2">
            <span className="text-[19px] font-extrabold tracking-[-0.04em] text-[#121316]">
              CampusCode
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-[#111827] text-[9px] font-bold text-white shadow-sm">
              AI
            </span>
          </a>
        </div>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#how-it-works"
            className="text-[14px] text-[#4B5563] transition hover:text-[#121316]"
          >
            How it works
          </a>

          <a
            href="#features"
            className="text-[14px] text-[#4B5563] transition hover:text-[#121316]"
          >
            Features
          </a>

          <a
            href="#faq"
            className="text-[14px] text-[#4B5563] transition hover:text-[#121316]"
          >
            FAQ
          </a>

          {/* Quick Demo Link */}
          <button
            type="button"
            onClick={openDemoModal}
            className="flex items-center gap-1.5 text-[14px] font-medium text-[#059669] hover:text-[#047857] transition cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Demo</span>
          </button>
        </div>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="text-[14px] font-semibold text-[#121316] transition hover:text-[#10B981] cursor-pointer"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="text-[14px] font-semibold text-[#4B5563] transition hover:text-[#121316] cursor-pointer"
              >
                Sign Up
              </button>

              <button
                type="button"
                onClick={openGithubModal}
                className="flex h-10 items-center gap-2 rounded-full bg-[#111827] px-4 text-[13px] font-bold text-white shadow-[0_6px_16px_rgba(17,24,39,0.14)] transition hover:-translate-y-[1px] hover:bg-[#1F2937] active:scale-[0.98] cursor-pointer"
              >
                <FontAwesomeIcon icon={faGithub} className="text-[15px]" />
                <span>Sign in with GitHub</span>
              </button>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 rounded-full border border-gray-200 bg-white p-1.5 pr-3 shadow-sm hover:border-gray-300 transition cursor-pointer"
              >
                <img
                  src={
                    user?.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      user?.name || 'User'
                    )}`
                  }
                  alt={user?.name}
                  className="h-8 w-8 rounded-full border border-gray-200 object-cover bg-gray-100"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-[#121316] leading-tight">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
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
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>

              {/* User Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl transition-all z-50 text-left"
                  style={{
                    animation: 'modalSlideUp 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  }}
                >
                  <div className="border-b border-gray-100 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Signed in as
                    </p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    {user?.provider === 'github' && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-[#059669]">
                        <ShieldCheck className="h-3 w-3" />
                        <span>GitHub Verified</span>
                      </div>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        openDemoModal();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5 text-[#10B981]" />
                      <span>View Demo Tour</span>
                    </button>
                  </div>

                  <div className="border-t border-gray-100 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
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

        {/* Mobile Hamburger Button */}
        <div className="sm:hidden flex items-center gap-2">
          {isAuthenticated && (
            <img
              src={user?.avatar}
              alt={user?.name}
              className="h-7 w-7 rounded-full border border-gray-200 object-cover"
            />
          )}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="border-b border-[#E5E7EB] bg-white px-6 py-4 sm:hidden text-left space-y-3 animate-fadeIn">
          <div className="flex flex-col gap-2 pb-3 border-b border-gray-100">
            <a
              href="#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-gray-700 py-1"
            >
              How it works
            </a>
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-gray-700 py-1"
            >
              Features
            </a>
            <a
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-gray-700 py-1"
            >
              FAQ
            </a>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openDemoModal();
              }}
              className="flex items-center gap-2 text-sm font-semibold text-[#059669] py-1 text-left"
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
                className="h-10 w-full rounded-xl border border-gray-200 text-sm font-semibold text-gray-900"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal('signup');
                }}
                className="h-10 w-full rounded-xl bg-[#10B981] text-sm font-bold text-white shadow"
              >
                Create Free Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openGithubModal();
                }}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#111827] text-sm font-bold text-white"
              >
                <FontAwesomeIcon icon={faGithub} className="text-sm" />
                <span>Sign up with GitHub</span>
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <div className="mb-3">
                <p className="text-xs text-gray-500">Logged in as</p>
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-red-50 text-sm font-semibold text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
