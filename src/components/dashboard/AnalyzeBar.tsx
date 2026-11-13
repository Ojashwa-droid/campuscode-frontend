import { type FormEvent, useState } from 'react';
import { GitBranch, Loader2, Sparkles } from 'lucide-react';

interface AnalyzeBarProps {
  onAnalyze: (repoUrl: string) => void;
  isAnalyzing: boolean;
}

export function AnalyzeBar({ onAnalyze, isAnalyzing }: AnalyzeBarProps) {
  const [repoUrl, setRepoUrl] = useState('');

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
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Start repository review</span>
            </>
          )}
        </button>
      </form>

      <p className="cc-label mt-3 text-[11px]">
        Public GitHub repositories · follow ingestion and scorecard progress from your workspace.
      </p>
    </section>
  );
}
