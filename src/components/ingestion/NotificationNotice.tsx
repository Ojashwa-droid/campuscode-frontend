import { ShieldCheck, X } from 'lucide-react';

interface NotificationNoticeProps {
  repoName: string;
  onDismiss: () => void;
}

export function NotificationNotice({ repoName, onDismiss }: NotificationNoticeProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[var(--radius-control)] border border-[var(--color-ok)]/50 bg-[color:var(--color-ok-soft)] px-4 py-3 text-xs text-[color:var(--color-ink)] animate-fadeIn">
      <div className="flex items-center gap-2.5">
        <ShieldCheck className="h-4 w-4 shrink-0 text-[color:var(--color-ok)]" />
        <span>
          Scorecard ready for <strong className="text-[color:var(--color-ok)]">{repoName}</strong>{' '}
          — all findings mapped to line-level repository evidence.
        </span>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="rounded p-1 text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)] cursor-pointer"
        aria-label="Dismiss completion notice"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
