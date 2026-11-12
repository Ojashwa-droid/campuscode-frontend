import { FolderGit2 } from 'lucide-react';
import type { AnalyzedProject } from '../../lib/types';

interface ProjectCardProps {
  project: AnalyzedProject;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ProjectCard({ project, isSelected, onSelect }: ProjectCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(project.id)}
      className={`flex items-center justify-between gap-4 rounded-[var(--radius-surface)] border px-4 py-3 text-left transition-all cursor-pointer ${
        isSelected
          ? 'border-[var(--color-instrument)] bg-[color:var(--color-instrument-soft)]/50'
          : 'border-[var(--color-rule)] bg-[color:var(--color-surface)] hover:border-[var(--color-rule-strong)]'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-control)] border ${
            isSelected
              ? 'border-[var(--color-instrument)]/50 bg-[color:var(--color-source)] text-[color:var(--color-instrument)]'
              : 'border-[var(--color-rule)] bg-[color:var(--color-source)] text-[color:var(--color-muted)]'
          }`}
        >
          <FolderGit2 className="h-4 w-4" />
        </span>

        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-[color:var(--color-ink)]">
            {project.name}
          </p>
          <p className="cc-label truncate text-[11px]">{project.language}</p>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <span
          className={`cc-measured inline-block rounded border px-2 py-0.5 text-[11px] font-medium ${
            project.overallScore >= 85
              ? 'border-[var(--color-ok)]/40 bg-[color:var(--color-ok-soft)] text-[color:var(--color-ok)]'
              : 'border-[var(--color-recruiter)]/40 bg-[color:var(--color-recruiter-soft)] text-[color:var(--color-recruiter)]'
          }`}
        >
          {project.overallScore}/100
        </span>
      </div>
    </button>
  );
}
