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
      <div className="cc-panel relative p-5 text-left shadow-2xl border-[var(--color-rule-strong)]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-[color:var(--color-ok)]" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-[color:var(--color-ok)]" />
          </span>

          <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[color:var(--color-ok)]">
            Signal detected
          </span>
        </div>

        <h3 className="mt-2.5 text-sm font-medium text-[color:var(--color-ink)]">
          {feature.title}
        </h3>

        <p className="cc-copy mt-2 text-xs">{feature.description}</p>
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
    <section id="features" className="cc-section relative overflow-hidden">
      <div className="cc-container relative">
        <div className="max-w-[700px]">
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-[color:var(--color-instrument)]" />
            <p className="cc-label uppercase tracking-[0.2em] text-[color:var(--color-instrument)]">
              Engineering intelligence
            </p>
          </div>

          <h2 className="cc-heading mt-5">
            What CampusCode
            <br />
            <span className="text-[color:var(--color-ok)]">actually checks.</span>
          </h2>

          <p className="cc-lead">
            Your repository becomes a living map of dependencies, engineering signals, and
            evidence-backed findings.
          </p>
        </div>

        {/* Mobile & Tablet Fallback Grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:hidden">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.id} className="cc-panel p-5 text-left">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-source)] text-[color:var(--color-instrument)]">
                    <Icon size={15} />
                  </span>
                  <h3 className="text-sm font-medium text-[color:var(--color-ink)]">
                    {feature.title}
                  </h3>
                </div>
                <p className="cc-copy mt-3 text-xs">{feature.description}</p>
              </article>
            );
          })}
        </div>

        {/* Desktop Interactive SVG Orchestrator Diagram */}
        <div className="cc-source relative mt-14 hidden h-[820px] overflow-visible lg:block">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--color-instrument)]/[0.04] blur-3xl" />

          <div className="absolute left-1/2 top-[30px] z-10 -translate-x-1/2">
            <span className="cc-label text-[10px] uppercase tracking-[0.18em]">
              Detection layer
            </span>
          </div>

          <div className="absolute left-1/2 top-[636px] z-10 -translate-x-1/2">
            <span className="cc-label text-[10px] uppercase tracking-[0.18em]">
              Trust &amp; output layer
            </span>
          </div>

          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1360 820"
            fill="none"
            preserveAspectRatio="none"
          >
            <path d="M204 144 V262 H680 V379" stroke="var(--color-rule-strong)" strokeWidth="1.5" strokeDasharray="5 6" />
            <path d="M680 144 V379" stroke="var(--color-rule-strong)" strokeWidth="1.5" strokeDasharray="5 6" />
            <path d="M1156 144 V262 H680 V379" stroke="var(--color-rule-strong)" strokeWidth="1.5" strokeDasharray="5 6" />
            <path d="M680 441 V559 H204 V676" stroke="var(--color-rule-strong)" strokeWidth="1.5" strokeDasharray="5 6" />
            <path d="M680 441 V676" stroke="var(--color-rule-strong)" strokeWidth="1.5" strokeDasharray="5 6" />
            <path d="M680 441 V559 H1156 V676" stroke="var(--color-rule-strong)" strokeWidth="1.5" strokeDasharray="5 6" />

            {hoveredFeature && (
              <g key={hoveredFeature}>
                <path
                  d={getActivePath()}
                  stroke="var(--color-ok)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  pathLength="1"
                  strokeDasharray="1"
                  className="animate-drawPath"
                  filter="url(#cc-signal-glow)"
                />
                <circle r="3.5" fill="var(--color-ok)" filter="url(#cc-signal-glow)">
                  <animateMotion
                    dur="1.3s"
                    begin="0.35s"
                    repeatCount="indefinite"
                    path={getActivePath()}
                  />
                </circle>
              </g>
            )}

            <defs>
              <filter id="cc-signal-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* Status Pill */}
          <div className="cc-panel absolute right-6 top-6 z-20 flex items-center gap-2 rounded-full px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-[color:var(--color-ok)]" />
              <span className="relative h-2 w-2 rounded-full bg-[color:var(--color-ok)]" />
            </span>
            <span className="cc-label text-[10px] uppercase tracking-[0.13em]">
              Analysis running
            </span>
          </div>

          {/* Top Row Cards */}
          {[
            { feature: features[0], left: 'left-[15%]', popupPos: 'top-[calc(100%+18px)] left-1/2 -translate-x-1/2', origin: 'top center' },
            { feature: features[1], left: 'left-1/2', popupPos: 'top-[calc(100%+18px)] left-0', origin: 'top left' },
            { feature: features[2], left: 'left-[85%]', popupPos: 'top-[calc(100%+18px)] left-1/2 -translate-x-1/2', origin: 'top center' },
          ].map(({ feature, left, popupPos, origin }) => {
            const Icon = feature.icon;
            const active = iconActive(feature.id);
            return (
              <div
                key={feature.id}
                className={`absolute ${left} top-[90px] w-[210px] -translate-x-1/2 transition-[z-index] ${cardZ(feature.id)}`}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <button
                  type="button"
                  onFocus={() => setHoveredFeature(feature.id)}
                  onBlur={() => setHoveredFeature(null)}
                  className={`cc-panel relative z-30 flex w-full items-center gap-2.5 px-4 py-3.5 text-left transition-all duration-300 cursor-pointer ${
                    active
                      ? 'border-[var(--color-ok)] -translate-y-0.5 bg-[color:var(--color-surface)]'
                      : 'hover:border-[var(--color-rule-strong)]'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-[var(--radius-control)] transition-all duration-300 ${
                      active
                        ? 'bg-[color:var(--color-ok-soft)] text-[color:var(--color-ok)]'
                        : 'bg-[color:var(--color-source)] text-[color:var(--color-muted)]'
                    }`}
                  >
                    <Icon size={15} />
                  </span>
                  <span className="text-xs font-medium text-[color:var(--color-ink)]">
                    {feature.label}
                  </span>
                </button>

                <Popup
                  feature={feature}
                  hoveredFeature={hoveredFeature}
                  position={popupPos}
                  origin={origin}
                />
              </div>
            );
          })}

          {/* Center Orchestrator Hub */}
          <div className="absolute left-1/2 top-[379px] z-20 -translate-x-1/2">
            <div className="absolute -inset-4 rounded-[18px] bg-[color:var(--color-ok)]/[0.06] blur-xl" />
            <div className="absolute inset-0 animate-breathe rounded-[14px] bg-[color:var(--color-ok)]/10" />
            <div className="cc-panel relative flex h-[62px] w-[290px] items-center justify-center gap-2.5 border-[var(--color-rule-strong)] bg-[color:var(--color-ground)] px-5 shadow-2xl">
              <span className="text-base text-[color:var(--color-ok)]">$</span>
              <span className="text-xs font-medium tracking-[-0.015em] text-[color:var(--color-ink)]">
                CampusCode Orchestrator
              </span>
              <span className="absolute right-3.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-[color:var(--color-ok)]" />
                <span className="relative h-2 w-2 rounded-full bg-[color:var(--color-ok)]" />
              </span>
            </div>
          </div>

          {/* Bottom Row Cards */}
          {[
            { feature: features[3], left: 'left-[15%]', popupPos: 'bottom-[calc(100%+18px)] left-1/2 -translate-x-1/2', origin: 'bottom center' },
            { feature: features[4], left: 'left-1/2', popupPos: 'bottom-[calc(100%+18px)] left-0', origin: 'bottom left' },
            { feature: features[5], left: 'left-[85%]', popupPos: 'bottom-[calc(100%+18px)] left-1/2 -translate-x-1/2', origin: 'bottom center' },
          ].map(({ feature, left, popupPos, origin }) => {
            const Icon = feature.icon;
            const active = iconActive(feature.id);
            return (
              <div
                key={feature.id}
                className={`absolute ${left} top-[676px] w-[210px] -translate-x-1/2 transition-[z-index] ${cardZ(feature.id)}`}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <button
                  type="button"
                  onFocus={() => setHoveredFeature(feature.id)}
                  onBlur={() => setHoveredFeature(null)}
                  className={`cc-panel flex w-full items-center gap-2.5 px-4 py-3.5 text-left transition-all duration-300 cursor-pointer ${
                    active
                      ? 'border-[var(--color-ok)] translate-y-0.5 bg-[color:var(--color-surface)]'
                      : 'hover:border-[var(--color-rule-strong)]'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-[var(--radius-control)] transition-all duration-300 ${
                      active
                        ? 'bg-[color:var(--color-ok-soft)] text-[color:var(--color-ok)]'
                        : 'bg-[color:var(--color-source)] text-[color:var(--color-muted)]'
                    }`}
                  >
                    <Icon size={15} />
                  </span>
                  <span className="text-xs font-medium text-[color:var(--color-ink)]">
                    {feature.label}
                  </span>
                </button>

                <Popup
                  feature={feature}
                  hoveredFeature={hoveredFeature}
                  position={popupPos}
                  origin={origin}
                />
              </div>
            );
          })}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <p className="cc-label whitespace-nowrap text-[10px] uppercase tracking-[0.16em]">
              Hover a signal to inspect
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
