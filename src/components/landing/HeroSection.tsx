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
    <section className="relative isolate overflow-hidden border-b border-[var(--color-rule)] px-6 pb-16 pt-16 text-center md:pt-20">
      {/* Campus-Code WebGL Wave Animation Style */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-55">
        <RainbowPrismWave />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[color:color-mix(in_oklab,var(--color-ground)_48%,transparent)]"
      />

      <div className="cc-container relative">
        {/* Status Badge */}
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[var(--color-rule-strong)] bg-[color:var(--color-surface)]/90 px-3.5 py-1.5 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-[color:var(--color-ok)]" />
            <span className="relative h-2 w-2 rounded-full bg-[color:var(--color-ok)]" />
          </span>
          <span className="text-xs font-medium text-[color:var(--color-ink-soft)]">
            100% Local Graph AI Evaluation
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="cc-display mx-auto mt-6 max-w-4xl">
          Resumes lie.
          <span className="block text-[color:var(--color-recruiter)]">Code doesn&apos;t.</span>
        </h1>

        {/* Description */}
        <p className="cc-lead mx-auto">
          CampusCode turns entire codebases into explainable engineering knowledge graphs. Rate
          architecture, thread-safety, and code hygiene with direct deep-links to source code.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
            <Link to="/dashboard" className="cc-button cc-button--primary min-h-12 px-6 no-underline">
              <span>Open Dashboard ({user?.name?.split(' ')[0]})</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}

          <button
            type="button"
            onClick={openDemoModal}
            className="group cc-button cc-button--quiet min-h-12 bg-[color:var(--color-surface)]/80 px-6 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-[color:var(--color-ok)] transition-transform duration-200 group-hover:rotate-12" />
            <span>View a Demo</span>
          </button>
        </div>

        {/* Sample Scorecard Preview */}
        <div className="cc-panel mx-auto mt-12 w-full max-w-[980px] overflow-hidden text-left shadow-2xl">
          {/* Preview Header */}
          <div className="flex h-14 items-center justify-between border-b border-[var(--color-rule)] bg-[color:var(--color-source)] px-5 sm:px-6">
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
          <div className="grid gap-6 p-5 md:grid-cols-2">
            {/* Project Summary Card */}
            <div className="cc-source p-5">
              <span className="inline-flex rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-ok-soft)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-ok)]">
                {activeSample.badge}
              </span>

              <h2 className="cc-title mt-4">{activeSample.repoName}</h2>

              <p className="cc-label mt-2">{activeSample.stack}</p>

              {activeSample.bars.map((bar) => (
                <ScoreBar key={bar.label} label={bar.label} value={bar.value} />
              ))}
            </div>

            {/* AI Finding Card */}
            <div className="cc-source p-5">
              <span className="inline-block rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-instrument-soft)] px-2.5 py-1 text-[11px] text-[color:var(--color-instrument)]">
                {activeSample.fileBadge}
              </span>

              <h3 className="mt-4 text-sm font-medium text-[color:var(--color-ink)]">
                {activeSample.findingTitle}
              </h3>

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
  );
};

export default HeroSection;
