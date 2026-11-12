import { ArrowUpRight, FolderGit2 } from 'lucide-react';
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
      className={`w-full text-left rounded-[var(--radius-surface)] border p-4 transition-all cursor-pointer ${
        isSelected
          ? 'border-[var(--color-instrument)] bg-[color:var(--color-instrument-soft)]/50'
          : 'border-[var(--color-rule)] bg-[color:var(--color-surface)] hover:border-[var(--color-rule-strong)] hover:bg-[color:var(--color-source)]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <FolderGit2
            className={`h-4 w-4 shrink-0 ${
              isSelected ? 'text-[color:var(--color-instrument)]' : 'text-[color:var(--color-muted)]'
            }`}
          />
          <span className="truncate text-xs font-medium text-[color:var(--color-ink)]">
            {project.name}
          </span>
        </div>

        <span
          className={`cc-measured shrink-0 rounded border px-2 py-0.5 text-[11px] font-medium ${
            project.overallScore >= 85
              ? 'border-[var(--color-ok)]/40 bg-[color:var(--color-ok-soft)] text-[color:var(--color-ok)]'
              : 'border-[var(--color-recruiter)]/40 bg-[color:var(--color-recruiter-soft)] text-[color:var(--color-recruiter)]'
          }`}
        >
          {project.overallScore}/100
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-[color:var(--color-muted)]">
        <span>{project.language}</span>
        <span className="flex items-center gap-1 text-[color:var(--color-ink-soft)]">
          Grade {project.grade}
          <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>

      <p className="cc-label mt-2 truncate text-[10px]">{project.lastCommit}</p>
    </button>
  );
}
