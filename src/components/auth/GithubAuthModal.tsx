import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { X, ShieldCheck, Check, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

export const GithubAuthModal: React.FC = () => {
  const { isGithubModalOpen, closeGithubModal, loginWithGithub } = useAuth();
  const [handle, setHandle] = useState('octodev');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isGithubModalOpen) {
        closeGithubModal();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isGithubModalOpen, closeGithubModal]);

  if (!isGithubModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loginWithGithub(handle.trim() || 'octodev');
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Authorize with GitHub"
      onClick={closeGithubModal}
    >
      <div
        className="cc-panel relative w-full max-w-[460px] overflow-hidden shadow-2xl"
        style={{
          animation: 'modalSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-[var(--color-rule)] bg-[color:var(--color-source)] px-6 py-6 text-center relative">
          <button
            type="button"
            onClick={closeGithubModal}
            className="cc-button cc-button--quiet absolute top-4 right-4 min-h-8 w-8 border-0 px-0"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-surface)] border border-[var(--color-rule-strong)] bg-[color:var(--color-surface)] text-[color:var(--color-ink)]">
              <FontAwesomeIcon icon={faGithub} className="text-2xl" />
            </div>

            <div className="flex items-center gap-1.5 text-[color:var(--color-ok)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-ok)] animate-ping" />
              <ArrowRight className="h-4 w-4" />
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-surface)] border border-[var(--color-recruiter)] bg-[color:var(--color-recruiter-soft)] text-[color:var(--color-recruiter)] font-bold text-sm">
              CC
            </div>
          </div>

          <h3 className="cc-title mt-4">Authorize with GitHub</h3>
          <p className="cc-copy mt-1 text-xs">
            Sign in using your GitHub handle to open the engineering dashboard.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="cc-source p-4 text-left">
            <label className="cc-label block uppercase tracking-[0.12em] mb-2">
              GitHub Username / Handle
            </label>
            <div className="flex items-center gap-2 rounded-[var(--radius-control)] border border-[var(--color-rule-strong)] bg-[color:var(--color-surface)] px-3 py-2 focus-within:border-[var(--color-recruiter)] transition">
              <span className="text-sm font-medium text-[color:var(--color-muted)]">@</span>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="username (e.g. torvalds)"
                className="w-full bg-transparent text-sm text-[color:var(--color-ink)] outline-none placeholder:text-[color:var(--color-muted)]"
                autoFocus
              />
              <img
                src={`https://github.com/${handle.trim() || 'github'}.png?size=64`}
                alt="Avatar preview"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
                }}
                className="h-7 w-7 rounded-full border border-[var(--color-rule-strong)] bg-[color:var(--color-ground)] object-cover"
              />
            </div>
            <p className="mt-2 text-[11px] text-[color:var(--color-muted)]">
              Enter your GitHub username or keep{' '}
              <span className="text-[color:var(--color-instrument)] font-medium">octodev</span> for a quick demo profile.
            </p>
          </div>

          <div className="mt-4 space-y-2.5 text-left">
            <p className="cc-label uppercase tracking-[0.12em]">Requested Permissions</p>

            <div className="flex items-start gap-2.5 text-xs text-[color:var(--color-ink-soft)]">
              <Check className="h-4 w-4 text-[color:var(--color-ok)] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[color:var(--color-ink)]">Read public repositories:</strong> Build local architectural knowledge graphs.
              </span>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-[color:var(--color-ink-soft)]">
              <Check className="h-4 w-4 text-[color:var(--color-ok)] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[color:var(--color-ink)]">Verify profile info:</strong> Link GitHub identity to engineering scorecards.
              </span>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-[color:var(--color-ok)] border border-[var(--color-rule)] bg-[color:var(--color-ok-soft)] rounded-[var(--radius-control)] p-2.5 mt-2">
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                <strong>Zero code uploaded:</strong> Parsing executes locally in your browser sandbox.
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="submit"
              disabled={loading}
              className="cc-button cc-button--primary w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authorizing with GitHub...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faGithub} className="text-base" />
                  <span>Authorize &amp; Open Dashboard</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={closeGithubModal}
              disabled={loading}
              className="cc-button cc-button--quiet w-full border-0 text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
