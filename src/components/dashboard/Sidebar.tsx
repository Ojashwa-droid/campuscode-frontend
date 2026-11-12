import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  FolderGit2,
  LogOut,
  Sparkles,
  User as UserIcon,
  X,
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import type { User } from '../../types/auth';

export type DashboardSection = 'repositories' | 'history' | 'profile';

interface SidebarProps {
  activeSection: DashboardSection;
  onSelectSection: (section: DashboardSection) => void;
  repoCount: number;
  historyCount: number;
  user: User | null;
  onOpenDemo: () => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  activeSection,
  onSelectSection,
  repoCount,
  historyCount,
  user,
  onOpenDemo,
  onLogout,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const navItems: {
    id: DashboardSection;
    label: string;
    icon: typeof FolderGit2;
    badge?: number;
  }[] = [
    { id: 'repositories', label: 'Your Repositories', icon: FolderGit2, badge: repoCount },
    { id: 'history', label: 'History', icon: Clock, badge: historyCount },
    { id: 'profile', label: 'User Profile', icon: UserIcon },
  ];

  const handleNavClick = (section: DashboardSection) => {
    onSelectSection(section);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[color:var(--color-source)] text-[color:var(--color-ink)]">
      <div>
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-[var(--color-rule)] px-5">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <img src="/assets/logo.png" alt="CampusCode" width={22} height={22} className="h-5 w-5 invert" />
            <span className="text-sm font-semibold tracking-[-0.04em] text-[color:var(--color-ink)]">
              CampusCode
            </span>
          </Link>

          <button
            type="button"
            onClick={onCloseMobile}
            className="cc-button cc-button--quiet min-h-8 w-8 border-0 px-0 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Workspace Navigation */}
        <div className="px-3 py-5">
          <p className="cc-label px-3 mb-2 text-[10px] uppercase tracking-[0.16em]">
            Workspace
          </p>
          <nav aria-label="Dashboard navigation" className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center justify-between rounded-[var(--radius-control)] px-3 py-2.5 text-left text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[color:var(--color-surface)] text-[color:var(--color-ink)] border border-[var(--color-rule-strong)]'
                      : 'border border-transparent text-[color:var(--color-muted)] hover:bg-[color:var(--color-surface)]/50 hover:text-[color:var(--color-ink-soft)]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 ${
                        active
                          ? 'text-[color:var(--color-instrument)]'
                          : 'text-[color:var(--color-muted)]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </span>

                  {item.badge !== undefined && (
                    <span
                      className={`cc-measured rounded px-1.5 py-0.5 text-[10px] ${
                        active
                          ? 'bg-[color:var(--color-instrument-soft)] text-[color:var(--color-instrument)]'
                          : 'text-[color:var(--color-muted)]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-6 border-t border-[var(--color-rule)] pt-5">
            <p className="cc-label px-3 mb-2 text-[10px] uppercase tracking-[0.16em]">
              Resources
            </p>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  onCloseMobile();
                  onOpenDemo();
                }}
                className="flex w-full items-center gap-2.5 rounded-[var(--radius-control)] px-3 py-2.5 text-left text-xs text-[color:var(--color-ok)] hover:bg-[color:var(--color-surface)]/50 transition-colors cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Interactive Demo</span>
              </button>

              <Link
                to="/"
                onClick={onCloseMobile}
                className="flex w-full items-center gap-2.5 rounded-[var(--radius-control)] px-3 py-2.5 text-xs text-[color:var(--color-muted)] hover:bg-[color:var(--color-surface)]/50 hover:text-[color:var(--color-ink-soft)] transition-colors no-underline"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Overview</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom User Card */}
      <div className="border-t border-[var(--color-rule)] p-3">
        <div className="rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-surface)] p-3">
          <div className="flex items-center gap-2.5">
            <img
              src={
                user?.avatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  user?.name || 'User'
                )}`
              }
              alt={user?.name}
              className="h-8 w-8 rounded-full border border-[var(--color-rule-strong)] object-cover bg-[color:var(--color-ground)]"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-[color:var(--color-ink)]">
                {user?.name}
              </p>
              <p className="truncate text-[10px] text-[color:var(--color-muted)] flex items-center gap-1">
                {user?.provider === 'github' ? (
                  <>
                    <FontAwesomeIcon icon={faGithub} className="text-[10px]" />
                    <span>@{user?.githubHandle}</span>
                  </>
                ) : (
                  user?.email
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-source)] py-1.5 text-[11px] font-medium text-[color:var(--color-ink-soft)] hover:border-[var(--color-warning)] hover:text-[color:var(--color-warning)] transition cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block lg:w-64 lg:shrink-0 lg:border-r lg:border-[var(--color-rule)] lg:sticky lg:top-0 lg:h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Dashboard navigation drawer"
          onClick={onCloseMobile}
        >
          <aside
            className="h-full w-72 border-r border-[var(--color-rule)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
