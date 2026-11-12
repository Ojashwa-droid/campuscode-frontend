import React, { useState, useEffect, useCallback } from 'react';
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
    badge: 'Step 1 • Ingestion',
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
    badge: 'Step 2 • Graph AI',
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
    badge: 'Step 3 • Verified Proof',
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
  const { isDemoModalOpen, closeDemoModal, openAuthModal } = useAuth();
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
    setActiveStepIndex((prev) =>
      prev === 0 ? DEMO_STEPS.length - 1 : prev - 1
    );
    setProgress(0);
  }, []);

  const handleSelectStep = (index: number) => {
    setActiveStepIndex(index);
    setProgress(0);
  };

  // Auto-play timer for demo carousel
  useEffect(() => {
    if (!isDemoModalOpen || !isPlaying) return;

    const intervalTime = 50; // update every 50ms for smooth bar
    const totalDuration = 6000; // 6 seconds per step
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

  // Handle ESC key to close
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
    openAuthModal('signup');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={closeDemoModal}
    >
      <div
        className="relative my-4 w-full max-w-[940px] overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#E5E7EB] text-left transition-all"
        style={{
          animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#FAFAF7] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#111827] text-white">
              <Sparkles className="h-4 w-4 text-[#10B981]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-[#121316]">
                  CampusCode Interactive Demo
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-ping" />
                  Live Walkthrough
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Understand how CampusCode turns real code into explainable engineering profiles.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-600 hover:border-gray-400 hover:text-gray-900 transition"
              title={isPlaying ? 'Pause walkthrough' : 'Resume auto-play'}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3 w-3 text-[#10B981]" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 text-[#10B981]" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              onClick={closeDemoModal}
              className="rounded-lg p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              aria-label="Close demo dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 3 Steps Navigation Bar with Progress Indicators */}
        <div className="grid grid-cols-3 border-b border-[#E5E7EB] bg-gray-50/70">
          {DEMO_STEPS.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={step.id}
                onClick={() => handleSelectStep(idx)}
                className={`relative flex flex-col p-3.5 sm:p-4 text-left transition-all ${
                  isActive ? 'bg-white' : 'hover:bg-white/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isActive ? 'text-[#10B981]' : 'text-gray-400'
                    }`}
                  >
                    {step.number}
                  </span>
                  <step.icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-[#10B981]' : 'text-gray-400'
                    }`}
                  />
                </div>
                <span
                  className={`text-xs sm:text-sm font-bold line-clamp-1 ${
                    isActive ? 'text-[#121316]' : 'text-gray-600'
                  }`}
                >
                  {step.title}
                </span>

                {/* Progress bar active step */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-200">
                  {isActive && (
                    <div
                      className="h-full bg-[#10B981] transition-all duration-75 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Demo Content Body */}
        <div className="p-6">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1.3fr] items-center">
            {/* Left Column: Easy to understand text explanation */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-[#059669]">
                <currentStep.icon className="h-3.5 w-3.5" />
                <span>{currentStep.badge}</span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold tracking-tight text-[#121316]">
                  {currentStep.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-[#10B981]">
                  {currentStep.subtitle}
                </p>
              </div>

              <p className="text-sm leading-relaxed text-[#4B5563]">
                {currentStep.description}
              </p>

              {/* Bullet Points */}
              <div className="space-y-2.5 pt-1">
                {currentStep.keyPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Privacy pill */}
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-[#FAFAF7] p-3 text-xs text-gray-600">
                <ShieldCheck className="h-5 w-5 text-[#10B981] shrink-0" />
                <span>
                  <strong>Client-Side Engine:</strong> Evaluates repo topology locally via WebAssembly and AST graph engines.
                </span>
              </div>
            </div>

            {/* Right Column: Rich Animated Visualization */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-[#111827] p-5 text-white shadow-xl min-h-[320px] flex flex-col justify-between">
              {/* Graphic Header */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                  <span className="ml-2 font-mono text-[11px] text-gray-400">
                    campuscode-engine // {currentStep.id}
                  </span>
                </div>

                <div className="flex items-center gap-1 rounded bg-gray-800/80 p-0.5 text-[10px]">
                  <button
                    onClick={() => setActiveGraphicTab('demo')}
                    className={`rounded px-2 py-0.5 font-medium transition ${
                      activeGraphicTab === 'demo'
                        ? 'bg-[#10B981] text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Visual
                  </button>
                  <button
                    onClick={() => setActiveGraphicTab('code')}
                    className={`rounded px-2 py-0.5 font-medium transition ${
                      activeGraphicTab === 'code'
                        ? 'bg-[#10B981] text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Proof
                  </button>
                </div>
              </div>

              {/* Graphic Content - Step 1: Repository Ingestion Animation */}
              {activeStepIndex === 0 && (
                <div className="my-auto py-4 space-y-4">
                  {activeGraphicTab === 'demo' ? (
                    <div className="space-y-3">
                      {/* Animated Terminal Scanning Bar */}
                      <div className="rounded-xl bg-gray-900/90 border border-gray-800 p-3.5 font-mono text-xs text-gray-300">
                        <div className="flex items-center justify-between text-gray-400 text-[11px] mb-2">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                            git clone https://github.com/developer/spring-store
                          </span>
                          <span className="text-[#10B981]">100% Parsed</span>
                        </div>
                        {/* Progress Bar Animation */}
                        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden mb-3">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-[#10B981] rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(40, progress)}%` }}
                          />
                        </div>
                        {/* Scanned Files List with Checkmarks */}
                        <div className="space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between text-emerald-400">
                            <span>✔ /src/main/OrderService.java</span>
                            <span className="text-gray-500">AST Indexed</span>
                          </div>
                          <div className="flex items-center justify-between text-emerald-400">
                            <span>✔ /src/concurrent/WorkerPool.java</span>
                            <span className="text-gray-500">Locks Traced</span>
                          </div>
                          <div className="flex items-center justify-between text-gray-400">
                            <span className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
                              /src/api/PaymentController.ts
                            </span>
                            <span className="text-blue-400">Analyzing...</span>
                          </div>
                        </div>
                      </div>

                      {/* Stat chips */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg bg-gray-900/60 border border-gray-800 p-2">
                          <div className="text-[11px] text-gray-400">Files Analyzed</div>
                          <div className="text-base font-bold text-white font-mono">148</div>
                        </div>
                        <div className="rounded-lg bg-gray-900/60 border border-gray-800 p-2">
                          <div className="text-[11px] text-gray-400">Parse Time</div>
                          <div className="text-base font-bold text-[#10B981] font-mono">1.2s</div>
                        </div>
                        <div className="rounded-lg bg-gray-900/60 border border-gray-800 p-2">
                          <div className="text-[11px] text-gray-400">Data Uploaded</div>
                          <div className="text-base font-bold text-white font-mono">0 KB (Local)</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-gray-950 p-3.5 font-mono text-[11px] text-gray-300 border border-gray-800">
                      <div className="text-gray-500 mb-2">// Ingestion Summary Log</div>
                      <p className="text-emerald-400">$ campuscode ingest --repo spring-store</p>
                      <p className="text-gray-400">[info] Detected Java 21 + Spring Boot 3.2</p>
                      <p className="text-gray-400">[info] Parsed 24 controller classes, 18 services</p>
                      <p className="text-emerald-400">[success] AST generation complete in 1,240ms</p>
                    </div>
                  )}
                </div>
              )}

              {/* Graphic Content - Step 2: Knowledge Graph Animation */}
              {activeStepIndex === 1 && (
                <div className="my-auto py-2 space-y-3">
                  {/* Interactive SVG Diagram simulating living nodes */}
                  <div className="relative h-44 w-full rounded-xl bg-gray-950/80 border border-gray-800 flex items-center justify-center p-2 overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 340 160">
                      {/* Connection lines */}
                      <line
                        x1="50"
                        y1="80"
                        x2="150"
                        y2="40"
                        stroke="#10B981"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                        className="animate-pulse"
                      />
                      <line
                        x1="50"
                        y1="80"
                        x2="150"
                        y2="120"
                        stroke="#10B981"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />
                      <line
                        x1="150"
                        y1="40"
                        x2="280"
                        y2="80"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />
                      <line
                        x1="150"
                        y1="120"
                        x2="280"
                        y2="80"
                        stroke="#10B981"
                        strokeWidth="2"
                      />

                      {/* Node 1: Controller */}
                      <g transform="translate(50, 80)">
                        <circle r="22" fill="#1F2937" stroke="#10B981" strokeWidth="2" />
                        <text textAnchor="middle" dy="4" fill="#FFFFFF" fontSize="9" fontWeight="bold">API</text>
                      </g>

                      {/* Node 2: Worker / Service */}
                      <g transform="translate(150, 40)">
                        <circle r="22" fill="#1F2937" stroke="#3B82F6" strokeWidth="2" />
                        <text textAnchor="middle" dy="4" fill="#FFFFFF" fontSize="9" fontWeight="bold">Service</text>
                      </g>

                      {/* Node 3: WorkerPool Lock */}
                      <g transform="translate(150, 120)">
                        <circle r="22" fill="#064E3B" stroke="#10B981" strokeWidth="2.5" />
                        <text textAnchor="middle" dy="4" fill="#34D399" fontSize="8" fontWeight="bold">Mutex Lock</text>
                      </g>

                      {/* Node 4: Database / Store */}
                      <g transform="translate(280, 80)">
                        <circle r="24" fill="#111827" stroke="#8B5CF6" strokeWidth="2" />
                        <text textAnchor="middle" dy="4" fill="#FFFFFF" fontSize="9" fontWeight="bold">Store</text>
                      </g>
                    </svg>

                    <div className="absolute top-2 right-2 rounded-full bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 text-[9px] font-mono text-emerald-400">
                      Thread-Safe: Verified
                    </div>
                  </div>

                  {/* Graph Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-gray-900 border border-gray-800 p-2 flex items-center justify-between">
                      <span className="text-gray-400">Coupling Ratio:</span>
                      <span className="font-mono font-bold text-emerald-400">0.14 (Optimal)</span>
                    </div>
                    <div className="rounded-lg bg-gray-900 border border-gray-800 p-2 flex items-center justify-between">
                      <span className="text-gray-400">Race Conditions:</span>
                      <span className="font-mono font-bold text-emerald-400">0 Detected</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Graphic Content - Step 3: Verified Scorecard Animation */}
              {activeStepIndex === 2 && (
                <div className="my-auto py-2 space-y-3">
                  {/* Score Meter & Ratings */}
                  <div className="rounded-xl bg-gray-950 border border-gray-800 p-3.5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-[11px] text-gray-400 font-mono">Overall Evaluation</div>
                        <div className="text-xl font-black text-white flex items-baseline gap-1.5">
                          <span className="text-[#10B981]">94</span>
                          <span className="text-xs text-gray-500">/ 100</span>
                          <span className="text-[10px] rounded bg-emerald-900/60 border border-emerald-600/40 px-1.5 py-0.2 text-emerald-300 font-semibold ml-2">
                            Top 4% Global
                          </span>
                        </div>
                      </div>

                      <div className="h-10 w-10 rounded-full border-2 border-[#10B981] flex items-center justify-center bg-emerald-950/40 text-emerald-400 font-bold text-sm">
                        A+
                      </div>
                    </div>

                    {/* Skill Bars */}
                    <div className="space-y-1.5 text-[11px]">
                      <div>
                        <div className="flex justify-between text-gray-400 mb-0.5">
                          <span>Architecture & Modularity</span>
                          <span className="text-emerald-400 font-mono">96%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-[#10B981] rounded-full w-[96%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-gray-400 mb-0.5">
                          <span>Concurrency & Thread Safety</span>
                          <span className="text-emerald-400 font-mono">92%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-[#10B981] rounded-full w-[92%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-gray-400 mb-0.5">
                          <span>Test Coverage & Reliability</span>
                          <span className="text-emerald-400 font-mono">88%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full w-[88%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clickable Line Proof Badge */}
                  <div className="rounded-lg bg-gray-900/90 border border-emerald-900/60 p-2.5 text-[11px] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCode2 className="h-4 w-4 text-[#10B981]" />
                      <span className="font-mono text-gray-300">
                        Evidence: <strong className="text-emerald-300">QueueWorker.java:142</strong>
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      Verified <CheckCircle2 className="h-3 w-3 text-[#10B981]" />
                    </span>
                  </div>
                </div>
              )}

              {/* Graphic Bottom Status */}
              <div className="flex items-center justify-between border-t border-gray-800 pt-3 text-[11px] text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                  Active Model: CampusCode Local Graph V2
                </span>
                <span className="font-mono text-gray-500">
                  Step {activeStepIndex + 1} of {DEMO_STEPS.length}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E5E7EB] pt-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex h-9 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex h-9 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                <span>Next</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={closeDemoModal}
                className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition px-2 py-1"
              >
                Close Preview
              </button>

              <button
                type="button"
                onClick={handleTryNow}
                className="flex h-10 items-center gap-2 rounded-xl bg-[#111827] px-4 text-xs font-bold text-white shadow-md transition hover:bg-[#1f2937] active:scale-[0.99] cursor-pointer"
              >
                <span>Try With Your Repo (Free)</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#10B981]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
