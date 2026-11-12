import { CheckCircle2, Loader2 } from 'lucide-react';
import type { IngestionStep } from '../../lib/types';

interface ProgressStepsProps {
  steps: IngestionStep[];
  currentStepIndex: number;
  completed: boolean;
}

export function ProgressSteps({ steps, currentStepIndex, completed }: ProgressStepsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => {
        const isDone = completed || index < currentStepIndex;
        const isActive = !completed && index === currentStepIndex;

        return (
          <div
            key={step.id}
            className={`rounded-[var(--radius-control)] border p-3.5 transition-colors ${
              isDone
                ? 'border-[var(--color-ok)]/50 bg-[color:var(--color-ok-soft)]'
                : isActive
                ? 'border-[var(--color-instrument)] bg-[color:var(--color-instrument-soft)]'
                : 'border-[var(--color-rule)] bg-[color:var(--color-source)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`cc-measured text-xs font-medium ${
                  isDone
                    ? 'text-[color:var(--color-ok)]'
                    : isActive
                    ? 'text-[color:var(--color-instrument)]'
                    : 'text-[color:var(--color-muted)]'
                }`}
              >
                {step.number}
              </span>

              {isDone ? (
                <CheckCircle2 className="h-4 w-4 text-[color:var(--color-ok)]" />
              ) : isActive ? (
                <Loader2 className="h-4 w-4 animate-spin text-[color:var(--color-instrument)]" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-[color:var(--color-rule-strong)]" />
              )}
            </div>

            <p className="mt-2 text-xs font-medium text-[color:var(--color-ink)]">{step.label}</p>
            <p className="cc-label mt-1 text-[11px] leading-relaxed">{step.detail}</p>
          </div>
        );
      })}
    </div>
  );
}
