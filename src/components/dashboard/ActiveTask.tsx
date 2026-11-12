import { INGESTION_STEPS } from '../../lib/mockProjects';
import { ProgressSteps } from '../ingestion/ProgressSteps';
import { ConsoleLogs } from '../ingestion/ConsoleLogs';
import { NotificationNotice } from '../ingestion/NotificationNotice';

interface ActiveTaskProps {
  repoName: string;
  progress: number;
  currentStepIndex: number;
  logs: string[];
  completed: boolean;
  onDismiss: () => void;
}

export function ActiveTask({
  repoName,
  progress,
  currentStepIndex,
  logs,
  completed,
  onDismiss,
}: ActiveTaskProps) {
  return (
    <section aria-label="Active repository ingestion" className="cc-panel p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="cc-label uppercase tracking-[0.14em] text-[color:var(--color-instrument)]">
            {completed ? 'Pipeline Complete' : 'Active Pipeline Task'}
          </p>
          <h2 className="cc-title mt-1 text-base">{repoName}</h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="cc-measured text-sm font-medium text-[color:var(--color-instrument)]">
            {progress}%
          </span>
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--color-rule)]">
        <div
          className="h-full origin-left bg-[color:var(--color-instrument)] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ProgressSteps
        steps={INGESTION_STEPS}
        currentStepIndex={currentStepIndex}
        completed={completed}
      />

      <ConsoleLogs logs={logs} />

      {completed && <NotificationNotice repoName={repoName} onDismiss={onDismiss} />}
    </section>
  );
}
