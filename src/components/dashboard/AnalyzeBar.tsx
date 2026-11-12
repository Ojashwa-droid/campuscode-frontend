import { type FormEvent, useState } from 'react';
import { GitBranch, Loader2, Sparkles } from 'lucide-react';

interface AnalyzeBarProps {
  onAnalyze: (repoUrl: string) => void;
  isAnalyzing: boolean;
}

const SAMPLE_URLS = [
  { label: 'spring-boot-ecommerce', url: 'https://github.com/campuscode-demo/spring-boot-ecommerce' },
  { label: 'multithreaded-queue', url: 'https://github.com/campuscode-demo/multithreaded-task-queue' },
  { label: 'OmniSearch', url: 'https://github.com/Ojashwa-droid/OmniSearch' },
];

export function AnalyzeBar({ onAnalyze, isAnalyzing }: AnalyzeBarProps) {
  const [repoUrl, setRepoUrl] = useState('https://github.com/campuscode-demo/realtime-collab-engine');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim() || isAnalyzing) return;
    onAnalyze(repoUrl.trim());
  };

  return (
    <section aria-label="Analyze repository" className="cc-panel p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="h-3.5 w-3.5 text-[color:var(--color-instrument)]" />
            <label htmlFor="dashboard-repo-url" className="cc-label uppercase tracking-[0.14em]">
              Analyze GitHub Repository (Local Graph Sandbox)
            </label>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:flex-row">
            <input
              id="dashboard-repo-url"
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repository"
              className="cc-input flex-1"
            />
            <button
              type="submit"
              disabled={isAnalyzing || !repoUrl.trim()}
              className="cc-button cc-button--primary shrink-0 px-5"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Analyze Your Repository</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:pb-1">
          <span className="cc-label text-[11px]">Presets:</span>
          {SAMPLE_URLS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              disabled={isAnalyzing}
              onClick={() => setRepoUrl(preset.url)}
              className="rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-source)] px-2.5 py-1.5 text-[11px] text-[color:var(--color-ink-soft)] hover:border-[var(--color-instrument)] hover:text-[color:var(--color-ink)] transition cursor-pointer disabled:opacity-50"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
