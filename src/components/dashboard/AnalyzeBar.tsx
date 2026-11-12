import { type FormEvent, useState } from 'react';
import { GitBranch, Loader2, Sparkles } from 'lucide-react';

interface AnalyzeBarProps {
  onAnalyze: (repoUrl: string) => void;
  isAnalyzing: boolean;
}

const SAMPLE_URLS = [
  { label: 'spring-boot-ecommerce', url: 'https://github.com/campuscode-demo/spring-boot-ecommerce' },
  { label: 'multithreaded-queue', url: 'https://github.com/campuscode-demo/multithreaded-task-queue' },
  { label: 'realtime-collab-engine', url: 'https://github.com/campuscode-demo/realtime-collab-engine' },
];

export function AnalyzeBar({ onAnalyze, isAnalyzing }: AnalyzeBarProps) {
  const [repoUrl, setRepoUrl] = useState('https://github.com/campuscode-demo/realtime-collab-engine');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim() || isAnalyzing) return;
    onAnalyze(repoUrl.trim());
  };

  return (
    <section aria-label="Analyze repository" className="cc-panel p-4 sm:p-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 flex items-center">
          <GitBranch className="pointer-events-none absolute left-3.5 h-4 w-4 text-[color:var(--color-instrument)]" />
          <label htmlFor="dashboard-repo-url" className="sr-only">
            GitHub Repository URL
          </label>
          <input
            id="dashboard-repo-url"
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="Paste GitHub repository URL (e.g. https://github.com/owner/repo)"
            className="cc-input pl-10"
          />
        </div>

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

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="cc-label text-[11px]">Quick presets:</span>
        {SAMPLE_URLS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            disabled={isAnalyzing}
            onClick={() => setRepoUrl(preset.url)}
            className="rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-source)] px-2.5 py-1 text-[11px] text-[color:var(--color-muted)] hover:border-[var(--color-instrument)] hover:text-[color:var(--color-ink)] transition cursor-pointer disabled:opacity-50"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </section>
  );
}
