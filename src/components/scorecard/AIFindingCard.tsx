import { Code2, ExternalLink } from 'lucide-react';
import type { AIFinding } from '../../lib/types';

interface AIFindingCardProps {
  finding: AIFinding;
  repoUrl: string;
}

export function AIFindingCard({ finding, repoUrl }: AIFindingCardProps) {
  const badgeStyle =
    finding.type === 'Strength'
      ? 'border-[var(--color-ok)]/40 bg-[color:var(--color-ok-soft)] text-[color:var(--color-ok)]'
      : finding.type === 'Concern'
      ? 'border-[var(--color-recruiter)]/40 bg-[color:var(--color-recruiter-soft)] text-[color:var(--color-recruiter)]'
      : 'border-[var(--color-warning)]/40 bg-[color:var(--color-warning-soft)] text-[color:var(--color-warning)]';

  const lineAnchor = finding.lineRange.replace(/[^0-9-]/g, '').replace('-', '-L');
  const fileHref =
    finding.lineRange === 'Unverified'
      ? repoUrl
      : `${repoUrl}/blob/main/${finding.filePath}#L${lineAnchor}`;

  return (
    <article className="cc-panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-[var(--radius-control)] border px-2.5 py-0.5 text-[11px] font-medium ${badgeStyle}`}>
            {finding.type}
          </span>
          <span className="cc-label text-[11px]">{finding.dimension}</span>
        </div>

        <a
          href={fileHref}
          target="_blank"
          rel="noopener noreferrer"
          className="cc-link inline-flex items-center gap-1.5 text-[11px] text-[color:var(--color-instrument)] no-underline hover:underline"
        >
          <Code2 className="h-3.5 w-3.5" />
          <span>
            {finding.filePath}:{finding.lineRange}
          </span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <h3 className="mt-3 text-sm font-medium text-[color:var(--color-ink)]">{finding.title}</h3>

      <p className="cc-copy mt-2 text-xs">{finding.description}</p>

      <pre className="cc-source mt-4 overflow-x-auto p-3.5 text-[11px] leading-6 text-[color:var(--color-ink-soft)]">
        <code>{finding.excerpt.join('\n')}</code>
      </pre>
    </article>
  );
}
