import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { RainbowPrismWave } from '../ui/RainbowPrismWave';

interface PreviewSample {
  id: 'spring' | 'queue';
  tabLabel: string;
  badge: string;
  repoName: string;
  stack: string;
  bars: { label: string; value: number }[];
  fileBadge: string;
  findingTitle: string;
  findingDescription: string;
  codeLines: { num: string; text: string; highlight?: boolean }[];
}

const PREVIEW_SAMPLES: PreviewSample[] = [
  {
    id: 'spring',
    tabLabel: 'Spring Boot Store',
    badge: 'Level 4: Production Ready',
    repoName: 'spring-boot-ecommerce',
    stack: 'Primary: Java 21 • Spring Boot 3.2 • PostgreSQL',
    bars: [
      { label: 'Modularity & Clean Architecture', value: 94 },
      { label: 'Concurrency & Thread Safety', value: 88 },
      { label: 'Testing & Error Handling', value: 91 },
    ],
    fileBadge: 'OrderService.java : L84',
    findingTitle: 'Thread-Safe Distributed Locking',
    findingDescription:
      'Correctly uses Redis distributed lock before checking inventory race conditions.',
    codeLines: [
      { num: '83', text: 'public OrderResponse checkout(UUID' },
      { num: '84', text: 'Lock lock =' },
      { num: '85', text: 'redis.getLock(cartId);', highlight: true },
      { num: '86', text: 'if (lock.tryLock(5,' },
      { num: '87', text: 'TimeUnit.SECONDS)) { ...' },
    ],
  },
  {
    id: 'queue',
    tabLabel: 'MultiThreaded Queue',
    badge: 'Level 4: Systems Grade',
    repoName: 'multithreaded-task-queue',
    stack: 'Primary: Java 21 • ReentrantLock • Virtual Threads',
    bars: [
      { label: 'Modularity & Clean Architecture', value: 90 },
      { label: 'Concurrency & Thread Safety', value: 96 },
      { label: 'Testing & Error Handling', value: 86 },
    ],
    fileBadge: 'WorkerPool.java : L140',
    findingTitle: 'Condition-Guarded Bounded Backpressure',
    findingDescription:
      'Uses explicit Condition variables inside a finally-guarded lock block to prevent busy-wait.',
    codeLines: [
      { num: '138', text: 'lock.lockInterruptibly();' },
      { num: '139', text: 'try {' },
      { num: '140', text: '  while (count == items.length) notFull.await();', highlight: true },
      { num: '141', text: '  enqueue(task); notEmpty.signal();' },
      { num: '142', text: '} finally { lock.unlock(); }' },
    ],
  },
];

interface ScoreBarProps {
  label: string;
  value: number;
}

const ScoreBar = ({ label, value }: ScoreBarProps) => {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[color:var(--color-muted)]">{label}</span>
        <span className="cc-measured font-medium">{value}%</span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[color:var(--color-rule)]">
        <div
          className="h-full rounded-full bg-[color:var(--color-ok)] transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

const HeroSection = () => {
  const { openGithubModal, openDemoModal, isAuthenticated, user } = useAuth();
  const [selectedSampleId, setSelectedSampleId] = useState<'spring' | 'queue'>('spring');

  const activeSample =
    PREVIEW_SAMPLES.find((sample) => sample.id === selectedSampleId) || PREVIEW_SAMPLES[0];

  return (
    <>
      {/* Full-viewport Hero matching campus-code's wave-led composition */}
      <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden border-b border-[var(--color-rule)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-60">
          <RainbowPrismWave />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[color:color-mix(in_oklab,var(--color-ground)_45%,transparent)]"
        />

        <div className="cc-container relative py-20 text-center md:py-28">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[var(--color-rule-strong)] bg-[color:var(--color-surface)]/85 px-3.5 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-[color:var(--color-ok)]" />
              <span className="relative h-2 w-2 rounded-full bg-[color:var(--color-ok)]" />
            </span>
            <span className="text-xs font-medium text-[color:var(--color-ink-soft)]">
              100% Local Graph AI Evaluation
            </span>
          </div>

          <h1 className="cc-display mx-auto mt-6 max-w-5xl">
            Resumes lie.
            <br />
            <span className="text-[color:var(--color-recruiter)]">Code doesn&apos;t.</span>
          </h1>

          <p className="cc-lead mx-auto">
            CampusCode turns entire codebases into explainable engineering knowledge graphs with
            line-level proof from the repository.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            {!isAuthenticated ? (
              <button
                type="button"
                onClick={openGithubModal}
                className="cc-button cc-button--primary min-h-12 px-6"
              >
                <FontAwesomeIcon icon={faGithub} className="text-base" />
                <span>Sign in with GitHub</span>
              </button>
            ) : (
              <Link
                to="/dashboard"
                className="cc-button cc-button--primary min-h-12 px-6 no-underline"
              >
                <span>Open Dashboard ({user?.name?.split(' ')[0]})</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}

            <button
              type="button"
              onClick={openDemoModal}
              className="group cc-button cc-button--quiet min-h-12 bg-[color:var(--color-surface)]/75 px-6 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 text-[color:var(--color-ok)] transition-transform duration-200 group-hover:rotate-12" />
              <span>View a Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Dedicated Sample Scorecard Preview Section below the fold */}
      <section className="cc-section">
        <div className="cc-container">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-end">
            <div>
              <p className="cc-label uppercase tracking-[0.18em] text-[color:var(--color-instrument)]">
                Live Dossier Sample
              </p>
              <h2 className="cc-heading mt-3">The dossier, before the interview</h2>
            </div>
            <p className="cc-lead lg:mt-0">
              Move directly from an engineering claim to the underlying file and line range without
              waiting for a screening call.
            </p>
          </div>

          <div className="cc-panel mt-10 overflow-hidden text-left">
            {/* Preview Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-rule)] bg-[color:var(--color-source)] px-5 py-3.5 sm:px-6">
              <div className="flex items-center gap-2">
                {PREVIEW_SAMPLES.map((sample) => {
                  const active = sample.id === selectedSampleId;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => setSelectedSampleId(sample.id)}
                      className={`rounded-[var(--radius-control)] border px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                        active
                          ? 'border-[var(--color-instrument)] bg-[color:var(--color-instrument-soft)] text-[color:var(--color-ink)]'
                          : 'border-transparent text-[color:var(--color-muted)] hover:text-[color:var(--color-ink-soft)]'
                      }`}
                    >
                      {sample.tabLabel}
                    </button>
                  );
                })}
              </div>

              <span className="hidden text-[11px] text-[color:var(--color-muted)] sm:block">
                Sample Scorecard Preview
              </span>
            </div>

            {/* Preview Content */}
            <div className="grid gap-6 p-5 md:grid-cols-2 sm:p-6">
              <div className="cc-source p-5">
                <span className="inline-flex rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-ok-soft)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-ok)]">
                  {activeSample.badge}
                </span>

                <h3 className="cc-title mt-4">{activeSample.repoName}</h3>

                <p className="cc-label mt-2">{activeSample.stack}</p>

                {activeSample.bars.map((bar) => (
                  <ScoreBar key={bar.label} label={bar.label} value={bar.value} />
                ))}
              </div>

              <div className="cc-source p-5">
                <span className="inline-block rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-instrument-soft)] px-2.5 py-1 text-[11px] text-[color:var(--color-instrument)]">
                  {activeSample.fileBadge}
                </span>

                <h4 className="mt-4 text-sm font-medium text-[color:var(--color-ink)]">
                  {activeSample.findingTitle}
                </h4>

                <p className="cc-copy mt-2 text-xs">{activeSample.findingDescription}</p>

                <div className="mt-4 overflow-x-auto rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-ground)] p-3 text-[11px] leading-6 text-[color:var(--color-ink-soft)]">
                  {activeSample.codeLines.map((line) => (
                    <div key={line.num} className="whitespace-pre">
                      <span
                        className={
                          line.highlight
                            ? 'text-[color:var(--color-ok)] font-medium'
                            : 'text-[color:var(--color-muted)]'
                        }
                      >
                        {line.num}
                      </span>
                      {'  '}
                      {line.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
