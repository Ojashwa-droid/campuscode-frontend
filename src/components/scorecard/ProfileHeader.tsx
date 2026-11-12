import { ExternalLink, ShieldCheck } from 'lucide-react';
import type { AnalyzedProject } from '../../lib/types';

interface ProfileHeaderProps {
  project: AnalyzedProject;
}

export function ProfileHeader({ project }: ProfileHeaderProps) {
  return (
    <header className="cc-panel p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-[var(--color-ok)]/40 bg-[color:var(--color-ok-soft)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-ok)]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{project.levelBadge}</span>
            </span>

            <span className="rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-source)] px-2.5 py-1 text-[11px] text-[color:var(--color-instrument)]">
              {project.globalPercentile}
            </span>
          </div>

          <h1 className="cc-heading mt-4 text-2xl sm:text-4xl">{project.name}</h1>

          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cc-link mt-3 inline-flex items-center gap-1.5 text-xs no-underline hover:underline"
          >
            <span>{project.repoUrl}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <div className="mt-4 flex flex-wrap gap-2">
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

        {/* Right Metric Block */}
        <div className="cc-seamed grid grid-cols-3 sm:min-w-[340px] shrink-0">
          <div className="p-4">
            <p className="cc-label uppercase tracking-[0.12em]">Overall</p>
            <p className="cc-measured mt-2 text-2xl font-semibold text-[color:var(--color-ok)]">
              {project.overallScore}
              <span className="text-xs text-[color:var(--color-muted)]"> / 100</span>
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
            <p className="cc-label mt-1 text-[10px]">{project.filesCount} files</p>
          </div>
        </div>
      </div>

      {/* Repo Telemetry Strip */}
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[var(--color-rule)] pt-4 sm:grid-cols-4">
        <div>
          <p className="cc-label uppercase tracking-[0.12em]">Modules</p>
          <p className="cc-measured mt-1 text-sm font-medium">{project.modulesCount}</p>
        </div>
        <div>
          <p className="cc-label uppercase tracking-[0.12em]">Graph Edges</p>
          <p className="cc-measured mt-1 text-sm font-medium">{project.edgesCount}</p>
        </div>
        <div>
          <p className="cc-label uppercase tracking-[0.12em]">Commit</p>
          <p className="cc-measured mt-1 text-sm font-medium text-[color:var(--color-instrument)]">
            {project.commitHash}
          </p>
        </div>
        <div>
          <p className="cc-label uppercase tracking-[0.12em]">Last Activity</p>
          <p className="mt-1 truncate text-xs text-[color:var(--color-ink-soft)]">
            {project.lastCommit}
          </p>
        </div>
      </div>
    </header>
  );
}
