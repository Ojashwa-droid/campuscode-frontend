import type { ProjectSkillScore } from '../../lib/types';

interface SkillsRadarProps {
  skills: ProjectSkillScore[];
  selectedDimension: string | null;
  onSelectDimension: (dimension: string | null) => void;
}

export function SkillsRadar({
  skills,
  selectedDimension,
  onSelectDimension,
}: SkillsRadarProps) {
  const cx = 140;
  const cy = 140;
  const maxR = 92;
  const count = skills.length || 6;

  const getPoint = (index: number, ratio: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * maxR * ratio,
      y: cy + Math.sin(angle) * maxR * ratio,
    };
  };

  const rings = [0.25, 0.5, 0.75, 1];
  const polygonPoints = skills
    .map((skill, idx) => {
      const pt = getPoint(idx, skill.score / 100);
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <section aria-label="Engineering dimension scores" className="cc-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-rule)] pb-4">
        <div>
          <p className="cc-label uppercase tracking-[0.14em] text-[color:var(--color-instrument)]">
            Engineering Radar &amp; Dimensions
          </p>
          <h2 className="cc-title mt-1 text-base">Six-dimension evaluation</h2>
        </div>

        <span className="cc-label text-[11px]">
          Click any dimension to inspect code evidence
        </span>

        {selectedDimension && (
          <button
            type="button"
            onClick={() => onSelectDimension(null)}
            className="cc-button cc-button--quiet min-h-8 px-3 text-xs"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[290px_1fr] lg:items-center">
        {/* SVG Radar Chart */}
        <div className="cc-source flex items-center justify-center p-4">
          <svg viewBox="0 0 280 280" className="h-64 w-64" aria-label="Skills radar chart">
            {/* Concentric rings */}
            {rings.map((ring) => {
              const ringPts = skills
                .map((_, idx) => {
                  const pt = getPoint(idx, ring);
                  return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
                })
                .join(' ');
              return (
                <polygon
                  key={ring}
                  points={ringPts}
                  fill="none"
                  stroke="var(--color-rule)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Axes */}
            {skills.map((skill, idx) => {
              const end = getPoint(idx, 1);
              const labelPt = getPoint(idx, 1.22);
              return (
                <g key={skill.dimension}>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={end.x}
                    y2={end.y}
                    stroke="var(--color-rule)"
                    strokeWidth="1"
                  />
                  <text
                    x={labelPt.x}
                    y={labelPt.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="var(--color-ink-soft)"
                    fontSize="9"
                  >
                    {skill.shortLabel}
                  </text>
                </g>
              );
            })}

            {/* Score Polygon */}
            <polygon
              points={polygonPoints}
              fill="color-mix(in oklab, var(--color-ok) 22%, transparent)"
              stroke="var(--color-ok)"
              strokeWidth="2"
            />

            {/* Vertices */}
            {skills.map((skill, idx) => {
              const pt = getPoint(idx, skill.score / 100);
              const active = selectedDimension === skill.dimension;
              return (
                <circle
                  key={skill.dimension}
                  cx={pt.x}
                  cy={pt.y}
                  r={active ? 5 : 3.5}
                  fill={active ? 'var(--color-recruiter)' : 'var(--color-ok)'}
                  stroke="var(--color-ground)"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>
        </div>

        {/* Dimension Score Bars */}
        <div className="space-y-3">
          {skills.map((skill) => {
            const active = selectedDimension === skill.dimension;
            const barColor =
              skill.score >= 85
                ? 'bg-[color:var(--color-ok)]'
                : skill.score >= 65
                ? 'bg-[color:var(--color-instrument)]'
                : 'bg-[color:var(--color-warning)]';

            return (
              <button
                key={skill.dimension}
                type="button"
                onClick={() =>
                  onSelectDimension(active ? null : skill.dimension)
                }
                className={`w-full rounded-[var(--radius-control)] border p-3.5 text-left transition cursor-pointer ${
                  active
                    ? 'border-[var(--color-recruiter)] bg-[color:var(--color-recruiter-soft)]/35'
                    : 'border-[var(--color-rule)] bg-[color:var(--color-source)] hover:border-[var(--color-rule-strong)]'
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-xs">
                  <span className="font-medium text-[color:var(--color-ink)]">
                    {skill.dimension}
                  </span>
                  <span className="cc-measured shrink-0 text-[color:var(--color-ink-soft)]">
                    {skill.score}% · {skill.fiveScale}/5
                  </span>
                </div>

                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--color-rule)]">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                    style={{ width: `${skill.score}%` }}
                  />
                </div>

                <p className="cc-label mt-2 text-[11px]">{skill.summary}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
