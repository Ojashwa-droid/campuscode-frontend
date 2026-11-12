import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  GitBranch,
  Network,
  Award,
  ShieldCheck,
  CheckCircle2,
  FileCode2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';

interface DemoStep {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  keyPoints: string[];
}

const DEMO_STEPS: DemoStep[] = [
  {
    id: 'ingestion',
    number: '01',
    title: '1-Click Codebase Ingestion',
    subtitle: 'From GitHub Repository to Clean AST in Seconds',
    badge: 'Step 01 · Ingestion',
    icon: GitBranch,
    description:
      'Paste your GitHub repo URL. CampusCode parses files, dependencies, and Abstract Syntax Trees (AST) locally in your browser. Zero setup, zero configuration.',
    keyPoints: [
      '100% Local & Private: Your code never leaves your device',
      'Multi-language parsing: Java, TypeScript, Python, Go, and Rust',
      'Instant breakdown of packages, modules, and file hierarchies',
    ],
  },
  {
    id: 'graph',
    number: '02',
    title: 'AI Architectural Knowledge Graph',
    subtitle: 'Deep Dependency & Concurrency Analysis',
    badge: 'Step 02 · Graph AI',
    icon: Network,
    description:
      'CampusCode builds a living semantic graph of your application. It traces module coupling, thread-safety, shared memory locks, and data flows to surface real engineering quality.',
    keyPoints: [
      'Detects cyclic dependencies and architectural anti-patterns',
      'Analyzes thread contention and race conditions before deployment',
      'Validates design patterns (Factory, Observer, Repository, CQRS)',
    ],
  },
  {
    id: 'scorecard',
    number: '03',
    title: 'Evidence-Backed Scorecard',
    subtitle: 'Objective Engineering Proofs with Line Links',
    badge: 'Step 03 · Verified Proof',
    icon: Award,
    description:
      'Resumes make claims; CampusCode provides verifiable proof. Candidates receive an interactive, recruiter-ready scorecard with clickable line-level proofs to exact source code.',
    keyPoints: [
      'Overall rating benchmarked against senior engineering standards',
      'Every score links directly to specific lines in your repository',
      'Shareable verified link that recruiters and managers trust',
    ],
  },
];

export const DemoModal: React.FC = () => {
  const { isDemoModalOpen, closeDemoModal, openAuthModal, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeGraphicTab, setActiveGraphicTab] = useState<'demo' | 'code'>('demo');

  const currentStep = DEMO_STEPS[activeStepIndex];

  const handleNext = useCallback(() => {
    setActiveStepIndex((prev) => (prev + 1) % DEMO_STEPS.length);
    setProgress(0);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveStepIndex((prev) => (prev === 0 ? DEMO_STEPS.length - 1 : prev - 1));
    setProgress(0);
  }, []);

  const handleSelectStep = (index: number) => {
    setActiveStepIndex(index);
    setProgress(0);
  };

  useEffect(() => {
    if (!isDemoModalOpen || !isPlaying) return;

    const intervalTime = 50;
    const totalDuration = 6000;
    const stepIncrement = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStepIndex((idx) => (idx + 1) % DEMO_STEPS.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isDemoModalOpen, isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDemoModalOpen) {
        closeDemoModal();
      }
      if (e.key === 'ArrowRight' && isDemoModalOpen) {
        handleNext();
      }
      if (e.key === 'ArrowLeft' && isDemoModalOpen) {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDemoModalOpen, closeDemoModal, handleNext, handlePrev]);

  if (!isDemoModalOpen) return null;

  const handleTryNow = () => {
    closeDemoModal();
    if (!isAuthenticated) {
      openAuthModal('signup');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="CampusCode Interactive Demo"
      onClick={closeDemoModal}
    >
      <div
        className="cc-panel relative my-4 w-full max-w-[960px] overflow-hidden shadow-2xl text-left"
        style={{
          animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-rule)] bg-[color:var(--color-source)] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-control)] border border-[var(--color-rule-strong)] bg-[color:var(--color-surface)] text-[color:var(--color-recruiter)]">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-[color:var(--color-ink)]">
                  CampusCode Interactive Demo
                </span>
                <span className="inline-flex items-center gap-1.5 rounded border border-[var(--color-rule)] bg-[color:var(--color-ok-soft)] px-2 py-0.5 text-[10px] font-medium text-[color:var(--color-ok)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-ok)] animate-ping" />
                  Live Walkthrough
                </span>
              </div>
              <p className="cc-label mt-0.5">
                How CampusCode turns source code into explainable engineering dossiers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="cc-button cc-button--quiet min-h-8 px-3 text-xs"
              title={isPlaying ? 'Pause walkthrough' : 'Resume auto-play'}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 text-[color:var(--color-recruiter)]" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-[color:var(--color-ok)]" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={closeDemoModal}
              className="cc-button cc-button--quiet min-h-8 w-8 border-0 px-0"
              aria-label="Close demo dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 3 Steps Navigation Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-[var(--color-rule)] bg-[color:var(--color-ground)]">
          {DEMO_STEPS.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleSelectStep(idx)}
                className={`relative flex flex-col p-3.5 sm:p-4 text-left transition-colors border-b sm:border-b-0 sm:border-r border-[var(--color-rule)] last:border-r-0 last:border-b-0 cursor-pointer ${
                  isActive ? 'bg-[color:var(--color-surface)]' : 'hover:bg-[color:var(--color-surface)]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`cc-measured text-xs font-medium ${
                      isActive ? 'text-[color:var(--color-instrument)]' : 'text-[color:var(--color-muted)]'
                    }`}
                  >
                    {step.number}
                  </span>
                  <step.icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-[color:var(--color-instrument)]' : 'text-[color:var(--color-muted)]'
                    }`}
                  />
                </div>
                <span
                  className={`text-xs sm:text-sm font-medium line-clamp-1 ${
                    isActive ? 'text-[color:var(--color-ink)]' : 'text-[color:var(--color-ink-soft)]'
                  }`}
                >
                  {step.title}
                </span>

                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[color:var(--color-rule)]">
                  {isActive && (
                    <div
                      className="h-full bg-[color:var(--color-instrument)] transition-all duration-75 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Demo Content Body */}
        <div className="p-6">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_1.35fr] items-center">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-instrument-soft)] px-3 py-1 text-xs font-medium text-[color:var(--color-instrument)]">
                <currentStep.icon className="h-3.5 w-3.5" />
                <span>{currentStep.badge}</span>
              </div>

              <div>
                <h3 className="cc-title">{currentStep.title}</h3>
                <p className="mt-1.5 text-xs font-medium text-[color:var(--color-recruiter)]">
                  {currentStep.subtitle}
                </p>
              </div>

              <p className="cc-copy">{currentStep.description}</p>

              <div className="space-y-2.5 pt-1">
                {currentStep.keyPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[color:var(--color-ink-soft)]">
                    <CheckCircle2 className="h-4 w-4 text-[color:var(--color-ok)] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="cc-source flex items-center gap-2.5 p-3 text-xs text-[color:var(--color-ink-soft)]">
                <ShieldCheck className="h-4 w-4 text-[color:var(--color-ok)] shrink-0" />
                <span>
                  <strong className="text-[color:var(--color-ink)]">Client-Side Engine:</strong> Evaluates repo topology locally via AST graph engines.
                </span>
              </div>
            </div>

            {/* Right Column: Animated Visualization */}
            <div className="cc-source relative overflow-hidden p-5 min-h-[330px] flex flex-col justify-between">
              {/* Graphic Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-rule)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-warning)]/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-recruiter)]/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-ok)]/80" />
                  <span className="ml-2 text-[11px] text-[color:var(--color-muted)]">
                    campuscode-engine // {currentStep.id}
                  </span>
                </div>

                {activeStepIndex === 0 && (
                  <div className="flex items-center gap-1 rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-surface)] p-0.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setActiveGraphicTab('demo')}
                      className={`rounded px-2 py-0.5 font-medium transition cursor-pointer ${
                        activeGraphicTab === 'demo'
                          ? 'bg-[color:var(--color-instrument)] text-[color:var(--color-source)]'
                          : 'text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]'
                      }`}
                    >
                      Visual
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveGraphicTab('code')}
                      className={`rounded px-2 py-0.5 font-medium transition cursor-pointer ${
                        activeGraphicTab === 'code'
                          ? 'bg-[color:var(--color-instrument)] text-[color:var(--color-source)]'
                          : 'text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]'
                      }`}
                    >
                      Proof
                    </button>
                  </div>
                )}
              </div>

              {/* Step 1: Repository Ingestion */}
              {activeStepIndex === 0 && (
                <div className="my-auto py-4 space-y-4">
                  {activeGraphicTab === 'demo' ? (
                    <div className="space-y-3">
                      <div className="rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-ground)] p-3.5 text-xs text-[color:var(--color-ink-soft)]">
                        <div className="flex items-center justify-between text-[11px] text-[color:var(--color-muted)] mb-2">
                          <span className="flex items-center gap-1.5 truncate">
                            <span className="h-2 w-2 rounded-full bg-[color:var(--color-ok)] animate-pulse" />
                            git clone .../developer/spring-store
                          </span>
                          <span className="text-[color:var(--color-ok)] shrink-0">100% Parsed</span>
                        </div>
                        <div className="h-1.5 w-full bg-[color:var(--color-rule)] rounded-full overflow-hidden mb-3">
                          <div
                            className="h-full bg-[color:var(--color-instrument)] rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(40, progress)}%` }}
                          />
                        </div>
                        <div className="space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between text-[color:var(--color-ok)]">
                            <span>✔ /src/main/OrderService.java</span>
                            <span className="text-[color:var(--color-muted)]">AST Indexed</span>
                          </div>
                          <div className="flex items-center justify-between text-[color:var(--color-ok)]">
                            <span>✔ /src/concurrent/WorkerPool.java</span>
                            <span className="text-[color:var(--color-muted)]">Locks Traced</span>
                          </div>
                          <div className="flex items-center justify-between text-[color:var(--color-ink-soft)]">
                            <span className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-instrument)] animate-ping" />
                              /src/api/PaymentController.ts
                            </span>
                            <span className="text-[color:var(--color-instrument)]">Analyzing...</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="cc-panel p-2.5">
                          <div className="cc-label">Files Analyzed</div>
                          <div className="cc-measured mt-1 text-sm font-medium">148</div>
                        </div>
                        <div className="cc-panel p-2.5">
                          <div className="cc-label">Parse Time</div>
                          <div className="cc-measured mt-1 text-sm font-medium text-[color:var(--color-ok)]">
                            1.2s
                          </div>
                        </div>
                        <div className="cc-panel p-2.5">
                          <div className="cc-label">Uploaded</div>
                          <div className="cc-measured mt-1 text-sm font-medium">0 KB</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-ground)] p-4 text-[11px] leading-6 text-[color:var(--color-ink-soft)]">
                      <div className="text-[color:var(--color-muted)] mb-1">// Ingestion Summary Log</div>
                      <p className="text-[color:var(--color-ok)]">$ campuscode ingest --repo spring-store</p>
                      <p>[info] Detected Java 21 + Spring Boot 3.2</p>
                      <p>[info] Parsed 24 controller classes, 18 services</p>
                      <p className="text-[color:var(--color-instrument)]">
                        [success] AST generation complete in 1,240ms
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Knowledge Graph */}
              {activeStepIndex === 1 && (
                <div className="my-auto py-2 space-y-3">
                  <div className="relative h-44 w-full rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-ground)] flex items-center justify-center p-2 overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 340 160">
                      <line
                        x1="50"
                        y1="80"
                        x2="150"
                        y2="40"
                        stroke="var(--color-ok)"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                        className="animate-pulse"
                      />
                      <line
                        x1="50"
                        y1="80"
                        x2="150"
                        y2="120"
                        stroke="var(--color-ok)"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                      />
                      <line
                        x1="150"
                        y1="40"
                        x2="280"
                        y2="80"
                        stroke="var(--color-instrument)"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                      />
                      <line
                        x1="150"
                        y1="120"
                        x2="280"
                        y2="80"
                        stroke="var(--color-ok)"
                        strokeWidth="1.5"
                      />

                      <g transform="translate(50, 80)">
                        <circle r="21" fill="var(--color-surface)" stroke="var(--color-ok)" strokeWidth="1.5" />
                        <text textAnchor="middle" dy="3" fill="var(--color-ink)" fontSize="9">
                          API
                        </text>
                      </g>

                      <g transform="translate(150, 40)">
                        <circle r="21" fill="var(--color-surface)" stroke="var(--color-instrument)" strokeWidth="1.5" />
                        <text textAnchor="middle" dy="3" fill="var(--color-ink)" fontSize="9">
                          Service
                        </text>
                      </g>

                      <g transform="translate(150, 120)">
                        <circle r="21" fill="var(--color-ok-soft)" stroke="var(--color-ok)" strokeWidth="2" />
                        <text textAnchor="middle" dy="3" fill="var(--color-ok)" fontSize="8">
                          Mutex Lock
                        </text>
                      </g>

                      <g transform="translate(280, 80)">
                        <circle r="23" fill="var(--color-surface)" stroke="var(--color-recruiter)" strokeWidth="1.5" />
                        <text textAnchor="middle" dy="3" fill="var(--color-ink)" fontSize="9">
                          Store
                        </text>
                      </g>
                    </svg>

                    <div className="absolute top-2 right-2 rounded border border-[var(--color-rule)] bg-[color:var(--color-ok-soft)] px-2 py-0.5 text-[9px] text-[color:var(--color-ok)]">
                      Thread-Safe: Verified
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="cc-panel p-2.5 flex items-center justify-between">
                      <span className="cc-label">Coupling Ratio</span>
                      <span className="cc-measured text-xs text-[color:var(--color-ok)]">0.14 (Optimal)</span>
                    </div>
                    <div className="cc-panel p-2.5 flex items-center justify-between">
                      <span className="cc-label">Race Conditions</span>
                      <span className="cc-measured text-xs text-[color:var(--color-ok)]">0 Detected</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Verified Scorecard */}
              {activeStepIndex === 2 && (
                <div className="my-auto py-2 space-y-3">
                  <div className="rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-ground)] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="cc-label">Overall Evaluation</div>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="cc-measured text-xl font-semibold text-[color:var(--color-ok)]">
                            94
                          </span>
                          <span className="text-xs text-[color:var(--color-muted)]">/ 100</span>
                          <span className="ml-2 rounded border border-[var(--color-rule)] bg-[color:var(--color-ok-soft)] px-1.5 py-0.5 text-[10px] text-[color:var(--color-ok)]">
                            Top 4% Global
                          </span>
                        </div>
                      </div>

                      <div className="h-10 w-10 rounded-full border border-[var(--color-ok)] bg-[color:var(--color-ok-soft)] flex items-center justify-center text-[color:var(--color-ok)] font-semibold text-sm">
                        A+
                      </div>
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <div>
                        <div className="flex justify-between text-[color:var(--color-ink-soft)] mb-1">
                          <span>Architecture &amp; Modularity</span>
                          <span className="cc-measured text-[color:var(--color-ok)]">96%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[color:var(--color-rule)] rounded-full overflow-hidden">
                          <div className="h-full bg-[color:var(--color-ok)] rounded-full w-[96%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[color:var(--color-ink-soft)] mb-1">
                          <span>Concurrency &amp; Thread Safety</span>
                          <span className="cc-measured text-[color:var(--color-instrument)]">92%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[color:var(--color-rule)] rounded-full overflow-hidden">
                          <div className="h-full bg-[color:var(--color-instrument)] rounded-full w-[92%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[color:var(--color-ink-soft)] mb-1">
                          <span>Test Coverage &amp; Reliability</span>
                          <span className="cc-measured text-[color:var(--color-recruiter)]">88%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[color:var(--color-rule)] rounded-full overflow-hidden">
                          <div className="h-full bg-[color:var(--color-recruiter)] rounded-full w-[88%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="cc-panel p-2.5 text-[11px] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCode2 className="h-4 w-4 text-[color:var(--color-instrument)]" />
                      <span className="text-[color:var(--color-ink-soft)]">
                        Evidence:{' '}
                        <strong className="text-[color:var(--color-instrument)]">QueueWorker.java:142</strong>
                      </span>
                    </div>
                    <span className="text-[10px] text-[color:var(--color-ok)] flex items-center gap-1">
                      Verified <CheckCircle2 className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              )}

              {/* Graphic Bottom Status */}
              <div className="flex items-center justify-between border-t border-[var(--color-rule)] pt-3 text-[11px] text-[color:var(--color-muted)]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[color:var(--color-ok)]" />
                  CampusCode Local Graph V2
                </span>
                <span className="cc-measured">
                  Step {activeStepIndex + 1} / {DEMO_STEPS.length}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[var(--color-rule)] pt-4">
            <div className="flex items-center gap-2">
              <button type="button" onClick={handlePrev} className="cc-button cc-button--quiet min-h-9 text-xs">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>

              <button type="button" onClick={handleNext} className="cc-button cc-button--quiet min-h-9 text-xs">
                <span>Next</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={closeDemoModal}
                className="cc-button cc-button--quiet min-h-9 border-0 text-xs"
              >
                Close Preview
              </button>

              <button type="button" onClick={handleTryNow} className="cc-button cc-button--primary min-h-9 text-xs">
                <span>{isAuthenticated ? 'Open Dashboard' : 'Try With Your Repo (Free)'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
