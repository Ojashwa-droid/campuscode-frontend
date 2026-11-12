import { Terminal } from 'lucide-react';

interface ConsoleLogsProps {
  logs: string[];
}

export function ConsoleLogs({ logs }: ConsoleLogsProps) {
  return (
    <div className="cc-source overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--color-rule)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-[color:var(--color-instrument)]" />
          <span className="cc-label uppercase tracking-[0.12em]">Ingestion Console</span>
        </div>
        <span className="cc-label text-[10px]">local-sandbox</span>
      </div>

      <div className="max-h-36 overflow-y-auto p-4 text-[11px] leading-6 text-[color:var(--color-ink-soft)]">
        {logs.map((line, index) => (
          <div key={`${index}-${line}`} className="whitespace-pre-wrap">
            <span className="mr-2 text-[color:var(--color-ok)]">$</span>
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
