import { useState } from 'react';
import {
  Network,
  ShieldCheck,
  Zap,
  Code2,
  Link2,
  Lock,
  type LucideIcon,
} from 'lucide-react';

type FeatureRow = 'top' | 'bottom';

interface Feature {
  id: string;
  label: string;
  icon: LucideIcon;
  title: string;
  description: string;
  row: FeatureRow;
}

const features: Feature[] = [
  {
    id: 'architecture',
    label: 'Architecture',
    icon: Network,
    title: 'Architecture & Modularity',
    description:
      'Maps dependencies between modules and services to identify unnecessary coupling before it becomes a liability.',
    row: 'top',
  },
  {
    id: 'concurrency',
    label: 'Concurrency',
    icon: Zap,
    title: 'Concurrency & Thread Safety',
    description:
      'Traces shared state and locking patterns to surface unsafe access and race conditions.',
    row: 'top',
  },
  {
    id: 'testing',
    label: 'Testing',
    icon: ShieldCheck,
    title: 'Testing & Error Handling',
    description:
      'Checks critical paths, test coverage, and how failures are caught, surfaced, and recovered from.',
    row: 'top',
  },
  {
    id: 'clean',
    label: 'Clean Code',
    icon: Code2,
    title: 'Clean Code & Git Hygiene',
    description:
      'Reviews duplication, naming, structure, and repository history to understand how the codebase is maintained.',
    row: 'bottom',
  },
  {
    id: 'evidence',
    label: 'Line Proofs',
    icon: Link2,
    title: 'Evidence-linked Findings',
    description:
      'Every finding connects back to the exact file and line that supports the analysis.',
    row: 'bottom',
  },
  {
    id: 'private',
    label: '100% Private',
    icon: Lock,
    title: 'Local, Private Analysis',
    description:
      'Analyze your codebase locally without sending your source code elsewhere.',
    row: 'bottom',
  },
];

interface PopupProps {
  feature: Feature;
  hoveredFeature: string | null;
  position: string;
  origin: string;
}

const Popup = ({ feature, hoveredFeature, position, origin }: PopupProps) => {
  if (hoveredFeature !== feature.id) return null;

  return (
    <div
      key={feature.id}
      className={`absolute z-[100] w-[270px] animate-popIn ${position}`}
      style={{ transformOrigin: origin }}
    >
      <div className="relative rounded-[14px] border border-[#E1E6E3] bg-white p-5 text-left shadow-[0_18px_50px_rgba(18,19,22,0.13)]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-[#10B981]" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-[#10B981]" />
          </span>

          <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#10B981]">
            Signal detected
          </span>
        </div>

        <h3 className="mt-2.5 text-[14px] font-semibold text-[#121316]">
          {feature.title}
        </h3>

        <p className="mt-2 text-[12px] leading-[1.65] text-[#6B7280]">
          {feature.description}
        </p>
      </div>
    </div>
  );
};

const Features = () => {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const getActivePath = (): string => {
    switch (hoveredFeature) {
      case 'architecture':
        return 'M204 144 V262 H680 V379';
      case 'concurrency':
        return 'M680 144 V379';
      case 'testing':
        return 'M1156 144 V262 H680 V379';
      case 'clean':
        return 'M680 441 V559 H204 V676';
      case 'evidence':
        return 'M680 441 V676';
      case 'private':
        return 'M680 441 V559 H1156 V676';
      default:
        return '';
    }
  };

  const cardZ = (id: string): string => (hoveredFeature === id ? 'z-[60]' : 'z-30');
  const iconActive = (id: string): boolean => hoveredFeature === id;

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#FAFAF8] px-6 py-16"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'radial-gradient(circle, #D9DED9 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)',
        }}
      />

      <div className="relative mx-auto max-w-[1180px]">
        <div className="max-w-[700px]">
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-[#10B981]" />
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#047857]">
              Engineering intelligence
            </p>
          </div>

          <h2 className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-[-0.045em] text-[#121316] sm:text-[42px]">
            What CampusCode
            <br />
            <span className="text-[#10B981]">actually checks.</span>
          </h2>

          <p className="mt-5 max-w-[610px] text-[16px] leading-7 text-[#6B7280]">
            Your repository becomes a living map of dependencies, engineering signals,
            and evidence-backed findings.
          </p>
        </div>

        <div className="relative mt-16 h-[820px] overflow-visible rounded-[30px] border border-[#DDE3DF] bg-white/85 shadow-[0_20px_70px_rgba(18,19,22,0.035)]">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#10B981]/[0.035] blur-3xl" />

          <div className="absolute left-1/2 top-[30px] z-10 -translate-x-1/2">
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9CA3AF]">
              Detection layer
            </span>
          </div>

          <div className="absolute left-1/2 top-[636px] z-10 -translate-x-1/2">
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9CA3AF]">
              Trust & output layer
            </span>
          </div>

          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1360 820"
            fill="none"
            preserveAspectRatio="none"
          >
            <path d="M204 144 V262 H680 V379" stroke="#D8DEDA" strokeWidth="1.5" strokeDasharray="5 6" />
            <path d="M680 144 V379" stroke="#D8DEDA" strokeWidth="1.5" strokeDasharray="5 6" />
            <path d="M1156 144 V262 H680 V379" stroke="#D8DEDA" strokeWidth="1.5" strokeDasharray="5 6" />
            <path d="M680 441 V559 H204 V676" stroke="#D8DEDA" strokeWidth="1.5" strokeDasharray="5 6" />
            <path d="M680 441 V676" stroke="#D8DEDA" strokeWidth="1.5" strokeDasharray="5 6" />
            <path d="M680 441 V559 H1156 V676" stroke="#D8DEDA" strokeWidth="1.5" strokeDasharray="5 6" />

            {hoveredFeature && (
              <g key={hoveredFeature}>
                <path
                  d={getActivePath()}
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  pathLength="1"
                  strokeDasharray="1"
                  className="animate-drawPath"
                  filter="url(#glow)"
                />
                <circle r="3.5" fill="#10B981" filter="url(#glow)">
                  <animateMotion
                    dur="1.3s"
                    begin="0.4s"
                    repeatCount="indefinite"
                    path={getActivePath()}
                  />
                </circle>
              </g>
            )}

            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          <div className="absolute right-6 top-6 z-20 flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 shadow-[0_4px_15px_rgba(18,19,22,0.04)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-[#10B981]" />
              <span className="relative h-2 w-2 rounded-full bg-[#10B981]" />
            </span>
            <span className="font-mono text-[9px] font-medium uppercase tracking-[0.13em] text-[#6B7280]">
              Analysis running
            </span>
          </div>

          <div
            className={`absolute left-[15%] top-[90px] w-[205px] -translate-x-1/2 transition-[z-index] ${cardZ('architecture')}`}
            onMouseEnter={() => setHoveredFeature('architecture')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <button
              type="button"
              className={`relative z-30 flex w-full items-center gap-2.5 rounded-[13px] border bg-white px-4 py-3.5 text-left shadow-[0_6px_22px_rgba(18,19,22,0.055)] transition-all duration-300 ${
                hoveredFeature === 'architecture'
                  ? 'border-[#8DDDC5] -translate-y-0.5 shadow-[0_10px_30px_rgba(16,185,129,0.13)]'
                  : 'border-[#E5E7EB]'
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-[8px] transition-all duration-300 ${
                  iconActive('architecture')
                    ? 'bg-[#10B981]/10 text-[#10B981] -translate-y-0.5'
                    : 'bg-[#F5F6F5] text-[#6B7280]'
                }`}
              >
                <Network size={15} />
              </span>
              <span className="text-[13px] font-semibold text-[#25272A]">Architecture</span>
            </button>

            <Popup
              feature={features[0]}
              hoveredFeature={hoveredFeature}
              position="top-[calc(100%+18px)] left-1/2 -translate-x-1/2"
              origin="top center"
            />
          </div>

          <div
            className={`absolute left-1/2 top-[90px] w-[205px] -translate-x-1/2 transition-[z-index] ${cardZ('concurrency')}`}
            onMouseEnter={() => setHoveredFeature('concurrency')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <button
              type="button"
              className={`relative z-30 flex w-full items-center gap-2.5 rounded-[13px] border bg-white px-4 py-3.5 text-left shadow-[0_6px_22px_rgba(18,19,22,0.055)] transition-all duration-300 ${
                hoveredFeature === 'concurrency'
                  ? 'border-[#8DDDC5] -translate-y-0.5 shadow-[0_10px_30px_rgba(16,185,129,0.13)]'
                  : 'border-[#E5E7EB]'
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-[8px] transition-all duration-300 ${
                  iconActive('concurrency')
                    ? 'bg-[#10B981]/10 text-[#10B981] -translate-y-0.5'
                    : 'bg-[#F5F6F5] text-[#6B7280]'
                }`}
              >
                <Zap size={15} />
              </span>
              <span className="text-[13px] font-semibold text-[#25272A]">Concurrency</span>
            </button>

            <Popup
              feature={features[1]}
              hoveredFeature={hoveredFeature}
              position="top-[calc(100%+18px)] left-0"
              origin="top left"
            />
          </div>

          <div
            className={`absolute left-[85%] top-[90px] w-[205px] -translate-x-1/2 transition-[z-index] ${cardZ('testing')}`}
            onMouseEnter={() => setHoveredFeature('testing')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <button
              type="button"
              className={`relative z-30 flex w-full items-center gap-2.5 rounded-[13px] border bg-white px-4 py-3.5 text-left shadow-[0_6px_22px_rgba(18,19,22,0.055)] transition-all duration-300 ${
                hoveredFeature === 'testing'
                  ? 'border-[#8DDDC5] -translate-y-0.5 shadow-[0_10px_30px_rgba(16,185,129,0.13)]'
                  : 'border-[#E5E7EB]'
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-[8px] transition-all duration-300 ${
                  iconActive('testing')
                    ? 'bg-[#10B981]/10 text-[#10B981] -translate-y-0.5'
                    : 'bg-[#F5F6F5] text-[#6B7280]'
                }`}
              >
                <ShieldCheck size={15} />
              </span>
              <span className="text-[13px] font-semibold text-[#25272A]">Testing</span>
            </button>

            <Popup
              feature={features[2]}
              hoveredFeature={hoveredFeature}
              position="top-[calc(100%+18px)] left-1/2 -translate-x-1/2"
              origin="top center"
            />
          </div>

          <div className="absolute left-1/2 top-[379px] z-20 -translate-x-1/2">
            <div className="absolute -inset-4 rounded-[18px] bg-[#10B981]/[0.045] blur-xl" />
            <div className="absolute inset-0 animate-breathe rounded-[14px] bg-[#10B981]/10" />
            <div className="relative flex h-[62px] w-[280px] items-center justify-center gap-2.5 rounded-[13px] border border-[#1E293B] bg-[#111827] px-5 shadow-[0_15px_40px_rgba(17,24,39,0.2)]">
              <span className="font-mono text-[16px] text-[#34D399]">$</span>
              <span className="text-[13px] font-semibold tracking-[-0.015em] text-white">
                CampusCode Orchestrator
              </span>
              <span className="absolute right-3.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-[#34D399]" />
                <span className="relative h-2 w-2 rounded-full bg-[#34D399]" />
              </span>
            </div>
          </div>

          <div
            className={`absolute left-[15%] top-[676px] w-[205px] -translate-x-1/2 transition-[z-index] ${cardZ('clean')}`}
            onMouseEnter={() => setHoveredFeature('clean')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <button
              type="button"
              className={`flex w-full items-center gap-2.5 rounded-[13px] border bg-white px-4 py-3.5 text-left shadow-[0_6px_22px_rgba(18,19,22,0.055)] transition-all duration-300 ${
                hoveredFeature === 'clean'
                  ? 'border-[#8DDDC5] translate-y-0.5 shadow-[0_10px_30px_rgba(16,185,129,0.13)]'
                  : 'border-[#E5E7EB]'
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-[8px] transition-all duration-300 ${
                  iconActive('clean')
                    ? 'bg-[#10B981]/10 text-[#10B981] translate-y-0.5'
                    : 'bg-[#F5F6F5] text-[#6B7280]'
                }`}
              >
                <Code2 size={15} />
              </span>
              <span className="text-[13px] font-semibold text-[#25272A]">Clean Code</span>
            </button>

            <Popup
              feature={features[3]}
              hoveredFeature={hoveredFeature}
              position="bottom-[calc(100%+18px)] left-1/2 -translate-x-1/2"
              origin="bottom center"
            />
          </div>

          <div
            className={`absolute left-1/2 top-[676px] w-[205px] -translate-x-1/2 transition-[z-index] ${cardZ('evidence')}`}
            onMouseEnter={() => setHoveredFeature('evidence')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <button
              type="button"
              className={`flex w-full items-center gap-2.5 rounded-[13px] border bg-white px-4 py-3.5 text-left shadow-[0_6px_22px_rgba(18,19,22,0.055)] transition-all duration-300 ${
                hoveredFeature === 'evidence'
                  ? 'border-[#8DDDC5] translate-y-0.5 shadow-[0_10px_30px_rgba(16,185,129,0.13)]'
                  : 'border-[#E5E7EB]'
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-[8px] transition-all duration-300 ${
                  iconActive('evidence')
                    ? 'bg-[#10B981]/10 text-[#10B981] translate-y-0.5'
                    : 'bg-[#F5F6F5] text-[#6B7280]'
                }`}
              >
                <Link2 size={15} />
              </span>
              <span className="text-[13px] font-semibold text-[#25272A]">Line Proofs</span>
            </button>

            <Popup
              feature={features[4]}
              hoveredFeature={hoveredFeature}
              position="bottom-[calc(100%+18px)] left-0"
              origin="bottom left"
            />
          </div>

          <div
            className={`absolute left-[85%] top-[676px] w-[205px] -translate-x-1/2 transition-[z-index] ${cardZ('private')}`}
            onMouseEnter={() => setHoveredFeature('private')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <button
              type="button"
              className={`flex w-full items-center gap-2.5 rounded-[13px] border bg-white px-4 py-3.5 text-left shadow-[0_6px_22px_rgba(18,19,22,0.055)] transition-all duration-300 ${
                hoveredFeature === 'private'
                  ? 'border-[#8DDDC5] translate-y-0.5 shadow-[0_10px_30px_rgba(16,185,129,0.13)]'
                  : 'border-[#E5E7EB]'
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-[8px] transition-all duration-300 ${
                  iconActive('private')
                    ? 'bg-[#10B981]/10 text-[#10B981] translate-y-0.5'
                    : 'bg-[#F5F6F5] text-[#6B7280]'
                }`}
              >
                <Lock size={15} />
              </span>
              <span className="text-[13px] font-semibold text-[#25272A]">100% Private</span>
            </button>

            <Popup
              feature={features[5]}
              hoveredFeature={hoveredFeature}
              position="bottom-[calc(100%+18px)] left-1/2 -translate-x-1/2"
              origin="bottom center"
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <p className="whitespace-nowrap font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-[#9CA3AF]">
              Hover a signal to inspect
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes drawPath {
          from { stroke-dashoffset: 1; }
          to { stroke-dashoffset: 0; }
        }
        .animate-drawPath {
          animation: drawPath 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.94); filter: blur(3px); }
          to { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        .animate-popIn {
          animation: popIn 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.55; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .animate-pulseRing {
          animation: pulseRing 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes breathe {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.02); }
        }
        .animate-breathe {
          animation: breathe 3.4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-drawPath,
          .animate-popIn,
          .animate-pulseRing,
          .animate-breathe {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Features;
