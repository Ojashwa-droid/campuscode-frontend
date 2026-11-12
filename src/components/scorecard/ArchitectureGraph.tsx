import { useState } from 'react';
import { Network } from 'lucide-react';
import type { ArchitectureNode } from '../../lib/types';

interface ArchitectureGraphProps {
  nodes: ArchitectureNode[];
  projectName: string;
}

const LAYER_COLORS: Record<ArchitectureNode['layer'], string> = {
  api: 'var(--color-instrument)',
  service: 'var(--color-ok)',
  concurrency: 'var(--color-recruiter)',
  data: 'var(--color-ink-soft)',
  config: 'var(--color-muted)',
};

export function ArchitectureGraph({ nodes, projectName }: ArchitectureGraphProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0]?.id ?? '');

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? nodes[0];
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <section aria-label="Structural architecture graph" className="cc-panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-rule)] bg-[color:var(--color-source)] px-5 py-4">
        <div>
          <p className="cc-label uppercase tracking-[0.14em] text-[color:var(--color-instrument)]">
            Structural Knowledge Graph
          </p>
          <h2 className="cc-title mt-1 text-base">{projectName} // Entity Topology</h2>
        </div>

        <span className="cc-measured text-xs text-[color:var(--color-muted)]">
          {nodes.length} inspected nodes
        </span>
      </div>

      <div className="cc-seamed grid gap-px lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.6fr)]">
        {/* Interactive SVG Canvas */}
        <div className="p-4 sm:p-6">
          <svg
            viewBox="0 0 560 370"
            className="h-auto w-full rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-source)]"
          >
            {/* Edges */}
            {nodes.map((source) =>
              source.connections.map((targetId) => {
                const target = nodeMap.get(targetId);
                if (!target) return null;
                const isHighlighted =
                  selectedNode?.id === source.id || selectedNode?.id === target.id;
                return (
                  <line
                    key={`${source.id}-${target.id}`}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={isHighlighted ? 'var(--color-instrument)' : 'var(--color-rule-strong)'}
                    strokeWidth={isHighlighted ? 2 : 1.25}
                    strokeDasharray={isHighlighted ? undefined : '4 3'}
                    opacity={isHighlighted ? 1 : 0.65}
                  />
                );
              })
            )}

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const stroke = LAYER_COLORS[node.layer];
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer"
                >
                  <circle
                    r={isSelected ? 14 : 10}
                    fill={isSelected ? stroke : 'var(--color-surface)'}
                    stroke={stroke}
                    strokeWidth={isSelected ? 2.5 : 1.75}
                  />
                  <text
                    y={26}
                    textAnchor="middle"
                    fill={isSelected ? 'var(--color-ink)' : 'var(--color-ink-soft)'}
                    fontSize="10"
                    fontWeight={isSelected ? '600' : '400'}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Node Inspector Sidebar */}
        <aside className="p-5 flex flex-col justify-between">
          {selectedNode ? (
            <div>
              <div className="flex items-center gap-2 text-[color:var(--color-instrument)]">
                <Network className="h-4 w-4" />
                <span className="cc-label uppercase tracking-[0.12em]">Node Inspector</span>
              </div>

              <h3 className="cc-title mt-4 text-lg">{selectedNode.name}</h3>

              <div className="mt-2 flex items-center gap-2">
                <span className="rounded border border-[var(--color-rule)] bg-[color:var(--color-source)] px-2 py-0.5 text-[10px] uppercase text-[color:var(--color-instrument)]">
                  layer: {selectedNode.layer}
                </span>
                <span className="cc-measured text-[11px] text-[color:var(--color-muted)]">
                  {selectedNode.edgesCount} edges
                </span>
              </div>

              <p className="cc-copy mt-4 text-xs">{selectedNode.summary}</p>

              <div className="mt-5 border-t border-[var(--color-rule)] pt-4">
                <p className="cc-label uppercase tracking-[0.12em]">Outgoing dependencies</p>
                {selectedNode.connections.length ? (
                  <ul className="mt-3 space-y-2">
                    {selectedNode.connections.map((connId) => {
                      const target = nodeMap.get(connId);
                      return (
                        <li key={connId}>
                          <button
                            type="button"
                            onClick={() => setSelectedNodeId(connId)}
                            className="w-full rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-source)] px-3 py-2 text-left text-xs text-[color:var(--color-ink-soft)] hover:border-[var(--color-instrument)] hover:text-[color:var(--color-ink)] transition cursor-pointer"
                          >
                            → {target?.name ?? connId}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="cc-label mt-3 text-xs">Leaf persistence / sink node.</p>
                )}
              </div>
            </div>
          ) : null}

          <p className="cc-label mt-6 border-t border-[var(--color-rule)] pt-3 text-[10px]">
            Click any graph node to trace couplings.
          </p>
        </aside>
      </div>
    </section>
  );
}
