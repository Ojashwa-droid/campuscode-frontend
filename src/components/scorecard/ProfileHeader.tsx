import { ExternalLink, ShieldCheck } from 'lucide-react';
import type { AnalyzedProject } from '../../lib/types';

interface ProfileHeaderProps {
  project: AnalyzedProject;
}

export function ProfileHeader({ project }: ProfileHeaderProps) {
  return (
    <header className="cc-panel p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-[var(--color-ok)]/40 bg-[color:var(--color-ok-soft)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-ok)]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{project.levelBadge}</span>
            </span>

            <span className="rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-source)] px-2.5 py-1 text-[11px] text-[color:var(--color-instrument)]">
              {project.globalPercentile}
            </span>

            <span className="cc-label text-[11px]">· {project.lastCommit}</span>
          </div>

          <h2 className="cc-heading mt-3 text-2xl sm:text-3xl">{project.name}</h2>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cc-link inline-flex items-center gap-1.5 text-xs no-underline hover:underline"
            >
              <span>{project.repoUrl}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-source)] px-2.5 py-1 text-[11px] text-[color:var(--color-ink-soft)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Clean 3-Stat Grid */}
        <div className="cc-seamed grid grid-cols-3 sm:min-w-[330px] shrink-0">
          <div className="p-4">
            <p className="cc-label uppercase tracking-[0.12em]">Score</p>
            <p className="cc-measured mt-2 text-2xl font-semibold text-[color:var(--color-ok)]">
              {project.overallScore}
              <span className="text-xs text-[color:var(--color-muted)]">/100</span>
            </p>
          </div>

          <div className="p-4">
            <p className="cc-label uppercase tracking-[0.12em]">Grade</p>
            <p className="cc-measured mt-2 text-2xl font-semibold text-[color:var(--color-recruiter)]">
              {project.grade}
            </p>
          </div>

          <div className="p-4">
            <p className="cc-label uppercase tracking-[0.12em]">Profile ID</p>
            <p className="cc-measured mt-2 text-sm font-medium text-[color:var(--color-ink)]">
              #{project.dossierId}
            </p>
            <p className="cc-label mt-1 text-[10px]">
              {project.filesCount} files · {project.edgesCount} edges
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
