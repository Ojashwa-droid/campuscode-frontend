import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { X, ShieldCheck, Check, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

export const GithubAuthModal: React.FC = () => {
  const { isGithubModalOpen, closeGithubModal, loginWithGithub } = useAuth();
  const [handle, setHandle] = useState('octodev');
  const [loading, setLoading] = useState(false);

  if (!isGithubModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loginWithGithub(handle.trim() || 'octodev');
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={closeGithubModal}
    >
      <div
        className="relative w-full max-w-[460px] overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#E5E7EB] transition-all"
        style={{
          animation: 'modalSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="bg-[#111827] px-6 py-6 text-white text-center relative">
          <button
            onClick={closeGithubModal}
            className="absolute top-4 right-4 rounded-full p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 transition"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Connected Logos */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white shadow-inner">
              <FontAwesomeIcon icon={faGithub} className="text-2xl" />
            </div>

            <div className="flex items-center gap-1 text-[#10B981]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-ping" />
              <ArrowRight className="h-4 w-4" />
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981] text-white font-extrabold text-sm shadow-md">
              CC
            </div>
          </div>

          <h3 className="mt-4 text-xl font-bold text-white tracking-tight">
            Authorize with GitHub
          </h3>
          <p className="mt-1 text-xs text-gray-300">
            Sign up or log in using your GitHub account for instant codebase evaluation.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="rounded-xl border border-gray-100 bg-[#FAFAF7] p-4 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              GitHub Username / Handle
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 focus-within:border-[#10B981] focus-within:ring-2 focus-within:ring-[#10B981]/20 transition">
              <span className="text-sm font-semibold text-gray-400">@</span>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="username (e.g. torvalds or your handle)"
                className="w-full text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                autoFocus
              />
              <img
                src={`https://github.com/${handle.trim() || 'github'}.png?size=64`}
                alt="Avatar preview"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
                }}
                className="h-7 w-7 rounded-full border border-gray-200 bg-gray-100 object-cover"
              />
            </div>
            <p className="mt-2 text-[11px] text-gray-500">
              Type your GitHub username or keep <span className="font-mono text-gray-700 font-semibold">octodev</span> for a quick demo profile.
            </p>
          </div>

          {/* Requested Permissions */}
          <div className="mt-4 space-y-2.5 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Requested Permissions:
            </p>

            <div className="flex items-start gap-2.5 text-xs text-gray-600">
              <Check className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
              <span>
                <strong>Read public repositories:</strong> To build local architectural knowledge graphs.
              </span>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-gray-600">
              <Check className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
              <span>
                <strong>Verify profile info:</strong> Use GitHub avatar, name, and commits to back engineering scorecards.
              </span>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-[#059669] bg-[#10B981]/10 rounded-lg p-2.5 mt-2">
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                <strong>Zero code uploaded:</strong> CampusCode executes parsing and analysis directly in client sandbox.
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#111827] text-sm font-bold text-white shadow-md transition hover:bg-[#1f2937] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authorizing with GitHub...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faGithub} className="text-base" />
                  <span>Authorize & Continue</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={closeGithubModal}
              disabled={loading}
              className="h-10 w-full text-xs font-semibold text-gray-500 hover:text-gray-900 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
