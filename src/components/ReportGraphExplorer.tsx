import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Maximize, Minus, Plus, RotateCcw, Search } from 'lucide-react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { GraphFact, ReportGraphContext } from '../lib/api';

const WIDTH = 1440;
const HEIGHT = 900;
type Point = { x: number; y: number };
type Camera = { x: number; y: number; zoom: number };
type Gesture = { kind: 'pan'; pointerX: number; pointerY: number; cameraX: number; cameraY: number }
  | { kind: 'node'; id: string; offsetX: number; offsetY: number };

function cameraToFit(points: Point[]): Camera | null {
  if (!points.length) return null;
  const padding = 110;
  const minX = Math.min(...points.map((point) => point.x)) - padding;
  const maxX = Math.max(...points.map((point) => point.x)) + padding;
  const minY = Math.min(...points.map((point) => point.y)) - padding;
  const maxY = Math.max(...points.map((point) => point.y)) + padding;
  const zoom = Math.max(0.25, Math.min(1.8, Math.min(WIDTH / (maxX - minX), HEIGHT / (maxY - minY))));
  return { x: WIDTH / 2 - ((minX + maxX) / 2) * zoom, y: HEIGHT / 2 - ((minY + maxY) / 2) * zoom, zoom };
}

function seedGraph(graph: ReportGraphContext): Map<string, Point> {
  const { nodes } = graph;
  const result = new Map<string, Point>();
  if (!nodes.length) return result;

  // Seed a circular cloud; edge springs and repulsion determine the final shape.
  const center = { x: WIDTH / 2, y: HEIGHT / 2 };
  const radius = Math.min(WIDTH, HEIGHT) * 0.32;
  nodes.forEach((node, index) => {
    const angle = index * 2.399963229728653;
    const distance = radius * Math.sqrt((index + 0.5) / nodes.length);
    result.set(node.id, { x: center.x + Math.cos(angle) * distance, y: center.y + Math.sin(angle) * distance });
  });
  return result;
}

export function ReportGraphExplorer({ graph }: { graph: ReportGraphContext }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const initialPositions = useMemo(() => seedGraph(graph), [graph]);
  const positionsRef = useRef(new Map(initialPositions));
  const velocitiesRef = useRef(new Map(graph.nodes.map((node) => [node.id, { x: 0, y: 0 }])));
  const alphaRef = useRef(0);
  const fitOnSettleRef = useRef(true);
  const frameRef = useRef<number | null>(null);
  const draggedNodeRef = useRef<{ id: string; x: number; y: number } | null>(null);
  const [positions, setPositions] = useState(() => new Map(initialPositions));
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, zoom: 1 });
  const [selectedId, setSelectedId] = useState(graph.nodes[0]?.id ?? '');
  const [hoveredId, setHoveredId] = useState('');
  const [search, setSearch] = useState('');
  const selected = graph.nodes.find((node) => node.id === selectedId) ?? graph.nodes[0];
  const nodeById = useMemo(() => new Map(graph.nodes.map((node) => [node.id, node])), [graph.nodes]);
  const degree = useMemo(() => {
    const counts = new Map<string, number>();
    graph.edges.forEach(({ sourceId, targetId }) => {
      counts.set(sourceId, (counts.get(sourceId) ?? 0) + 1);
      counts.set(targetId, (counts.get(targetId) ?? 0) + 1);
    });
    return counts;
  }, [graph.edges]);
  const connectedEdges = selected ? graph.edges.filter((edge) => edge.sourceId === selected.id || edge.targetId === selected.id) : [];
  const matchedNode = graph.nodes.find((node) => `${node.symbolName} ${node.label} ${node.filePath}`.toLowerCase().includes(search.trim().toLowerCase()));

  const runSimulation = useCallback(() => {
    alphaRef.current = Math.max(alphaRef.current, 0.92);
    if (frameRef.current !== null) return;

    const tick = () => {
      const alpha = alphaRef.current;
      const center = { x: WIDTH / 2, y: HEIGHT / 2 };
      const forces = new Map(graph.nodes.map((node) => [node.id, { x: 0, y: 0 }]));
      const positionsNow = positionsRef.current;

      // Unconnected nodes repel each other, opening space in dense clusters.
      for (let i = 0; i < graph.nodes.length; i += 1) {
        for (let j = i + 1; j < graph.nodes.length; j += 1) {
          const first = graph.nodes[i];
          const second = graph.nodes[j];
          const firstPoint = positionsNow.get(first.id);
          const secondPoint = positionsNow.get(second.id);
          if (!firstPoint || !secondPoint) continue;
          const dx = firstPoint.x - secondPoint.x;
          const dy = firstPoint.y - secondPoint.y;
          const distance = Math.max(10, Math.hypot(dx, dy));
          const force = 16000 / (distance * distance) * alpha;
          const forceX = dx / distance * force;
          const forceY = dy / distance * force;
          forces.get(first.id)!.x += forceX;
          forces.get(first.id)!.y += forceY;
          forces.get(second.id)!.x -= forceX;
          forces.get(second.id)!.y -= forceY;
        }
      }

      // Each graph edge behaves like a spring with a comfortable resting distance.
      graph.edges.forEach((edge) => {
        if (edge.sourceId === edge.targetId) return;
        const source = positionsNow.get(edge.sourceId);
        const target = positionsNow.get(edge.targetId);
        if (!source || !target) return;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const force = (distance - 155) * 0.008 * alpha;
        forces.get(edge.sourceId)!.x += dx / distance * force;
        forces.get(edge.sourceId)!.y += dy / distance * force;
        forces.get(edge.targetId)!.x -= dx / distance * force;
        forces.get(edge.targetId)!.y -= dy / distance * force;
      });

      graph.nodes.forEach((node) => {
        const point = positionsNow.get(node.id);
        const force = forces.get(node.id);
        const velocity = velocitiesRef.current.get(node.id);
        if (!point || !force || !velocity) return;
        const dragged = draggedNodeRef.current?.id === node.id;
        if (dragged) {
          point.x = draggedNodeRef.current!.x;
          point.y = draggedNodeRef.current!.y;
          velocity.x = 0;
          velocity.y = 0;
          return;
        }
        force.x += (center.x - point.x) * 0.00065 * alpha;
        force.y += (center.y - point.y) * 0.00065 * alpha;
        velocity.x = (velocity.x + force.x) * 0.82;
        velocity.y = (velocity.y + force.y) * 0.82;
        // No hard viewport clamp: the force layout stays organic instead of piling
        // nodes against the four sides of the SVG viewBox.
        point.x += Math.max(-12, Math.min(12, velocity.x));
        point.y += Math.max(-12, Math.min(12, velocity.y));
      });

      setPositions(new Map(positionsNow));
      alphaRef.current *= 0.965;
      if (alphaRef.current > 0.018 || draggedNodeRef.current) frameRef.current = requestAnimationFrame(tick);
      else {
        frameRef.current = null;
        if (fitOnSettleRef.current) {
          const fitted = cameraToFit([...positionsNow.values()]);
          if (fitted) setCamera(fitted);
          fitOnSettleRef.current = false;
        }
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [graph.edges, graph.nodes]);

  useEffect(() => {
    const seeded = new Map(initialPositions);
    positionsRef.current = seeded;
    velocitiesRef.current = new Map(graph.nodes.map((node) => [node.id, { x: 0, y: 0 }]));
    draggedNodeRef.current = null;
    fitOnSettleRef.current = true;
    alphaRef.current = 0;
    setPositions(seeded);
    runSimulation();
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [graph.nodes, initialPositions, runSimulation]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = svg.getBoundingClientRect();
      const point = {
        x: (event.clientX - rect.left) * WIDTH / rect.width,
        y: (event.clientY - rect.top) * HEIGHT / rect.height,
      };
      setCamera((current) => {
        const zoom = Math.max(0.25, Math.min(3.2, current.zoom * (event.deltaY < 0 ? 1.12 : 0.89)));
        const worldX = (point.x - current.x) / current.zoom;
        const worldY = (point.y - current.y) / current.zoom;
        return { x: point.x - worldX * zoom, y: point.y - worldY * zoom, zoom };
      });
    };
    svg.addEventListener('wheel', handleWheel, { passive: false });
    return () => svg.removeEventListener('wheel', handleWheel);
  }, []);

  if (!graph.nodes.length) return <div className="rounded-[var(--radius-control)] border border-[var(--color-rule)] p-6"><p className="cc-copy">This evaluation did not save any graph nodes to display.</p></div>;

  const svgPoint = (event: { clientX: number; clientY: number }) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * WIDTH / rect.width, y: (event.clientY - rect.top) * HEIGHT / rect.height };
  };
  const beginPan = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.button !== 0 || (event.target as Element).closest('[data-node-id]')) return;
    const point = svgPoint(event);
    gesture.current = { kind: 'pan', pointerX: point.x, pointerY: point.y, cameraX: camera.x, cameraY: camera.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const beginNodeDrag = (event: ReactPointerEvent<SVGGElement>, node: GraphFact) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    setSelectedId(node.id);
    const pointer = svgPoint(event);
    const point = positions.get(node.id)!;
    gesture.current = { kind: 'node', id: node.id, offsetX: point.x - (pointer.x - camera.x) / camera.zoom, offsetY: point.y - (pointer.y - camera.y) / camera.zoom };
    draggedNodeRef.current = { id: node.id, x: point.x, y: point.y };
    fitOnSettleRef.current = false;
    runSimulation();
    svgRef.current?.setPointerCapture(event.pointerId);
  };
  const movePointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!gesture.current) return;
    const pointer = svgPoint(event);
    const active = gesture.current;
    if (active.kind === 'pan') setCamera((value) => ({ ...value, x: active.cameraX + pointer.x - active.pointerX, y: active.cameraY + pointer.y - active.pointerY }));
    else {
      const x = (pointer.x - camera.x) / camera.zoom + active.offsetX;
      const y = (pointer.y - camera.y) / camera.zoom + active.offsetY;
      draggedNodeRef.current = { id: active.id, x, y };
      positionsRef.current.set(active.id, { x, y });
      alphaRef.current = Math.max(alphaRef.current, 0.8);
      setPositions(new Map(positionsRef.current));
      runSimulation();
    }
  };
  const endPointer = () => {
    if (gesture.current?.kind === 'node') {
      draggedNodeRef.current = null;
      runSimulation();
    }
    gesture.current = null;
  };
  const zoomBy = (factor: number) => setCamera((value) => {
    const zoom = Math.max(0.25, Math.min(3.2, value.zoom * factor));
    const worldCenterX = (WIDTH / 2 - value.x) / value.zoom;
    const worldCenterY = (HEIGHT / 2 - value.y) / value.zoom;
    return { x: WIDTH / 2 - worldCenterX * zoom, y: HEIGHT / 2 - worldCenterY * zoom, zoom };
  });
  const fitGraph = () => {
    const fitted = cameraToFit([...positions.values()]);
    if (fitted) setCamera(fitted);
  };
  const resetGraph = () => {
    const seeded = new Map(initialPositions);
    positionsRef.current = seeded;
    velocitiesRef.current = new Map(graph.nodes.map((node) => [node.id, { x: 0, y: 0 }]));
    setPositions(seeded);
    setCamera({ x: 0, y: 0, zoom: 1 });
    fitOnSettleRef.current = true;
    alphaRef.current = 0;
    runSimulation();
  };
  const goToSearchMatch = () => {
    if (!matchedNode) return;
    setSelectedId(matchedNode.id);
    setHoveredId(matchedNode.id);
    const point = positions.get(matchedNode.id);
    if (point) setCamera((value) => ({ ...value, x: WIDTH / 2 - point.x * value.zoom, y: HEIGHT / 2 - point.y * value.zoom }));
  };

  return <div className="space-y-4">
    {graph.edgesFromCurrentGraph && <p className="m-0 rounded-[var(--radius-control)] border border-[var(--color-instrument)]/30 bg-[color:var(--color-source)] p-3 text-xs text-[color:var(--color-ink-soft)]">These edges were matched from the current Cognee dataset using the node IDs and relationships saved with this report. They may differ if the dataset changed after evaluation.</p>}
    <div className="overflow-hidden rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-ground)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-rule)] px-3 py-2">
        <div className="relative min-w-56 flex-1 sm:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-muted)]" /><input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') goToSearchMatch(); }} placeholder="Find a class, method, or file" aria-label="Search graph nodes" className="cc-input w-full pl-9 pr-3" /><button type="button" onClick={goToSearchMatch} disabled={!matchedNode} className="sr-only">Select first match</button></div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[color:var(--color-ink-soft)]"><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-instrument)]" /> Code symbol</span><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-muted)]" /> Supporting node</span><span>{graph.nodes.length} nodes · {graph.edges.length} edges</span>
          <span className="mx-1 h-4 border-l border-[var(--color-rule)]" />
          <button type="button" className="cc-button cc-button--quiet min-h-8 px-2" aria-label="Zoom out" title="Zoom out" onClick={() => zoomBy(0.82)}><Minus className="h-3.5 w-3.5" /></button><button type="button" className="cc-button cc-button--quiet min-h-8 px-2" aria-label="Fit graph" title="Fit graph" onClick={fitGraph}><Maximize className="h-3.5 w-3.5" /></button><button type="button" className="cc-button cc-button--quiet min-h-8 px-2" aria-label="Zoom in" title="Zoom in" onClick={() => zoomBy(1.22)}><Plus className="h-3.5 w-3.5" /></button><button type="button" className="cc-button cc-button--quiet min-h-8 px-2" aria-label="Reset graph layout" title="Reset graph layout" onClick={resetGraph}><RotateCcw className="h-3.5 w-3.5" /></button>
        </div>
      </div>
      <div className="report-interactive-graph grid xl:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="min-w-0 overscroll-contain border-b border-[var(--color-rule)] xl:border-b-0 xl:border-r">
          <svg ref={svgRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`Interactive repository graph with ${graph.nodes.length} nodes and ${graph.edges.length} relationships`} onPointerDown={beginPan} onPointerMove={movePointer} onPointerUp={endPointer} onPointerCancel={endPointer} className="block h-[min(78vh,900px)] min-h-[560px] w-full touch-none cursor-grab active:cursor-grabbing">
            <g transform={`translate(${camera.x} ${camera.y}) scale(${camera.zoom})`}>
              {graph.edges.map((edge, index) => {
                const from = positions.get(edge.sourceId);
                const to = positions.get(edge.targetId);
                if (!from || !to) return null;
                const active = selected?.id === edge.sourceId || selected?.id === edge.targetId || hoveredId === edge.sourceId || hoveredId === edge.targetId;
                const midX = (from.x + to.x) / 2;
                const midY = (from.y + to.y) / 2;
                return <g key={`${edge.sourceId}-${edge.targetId}-${edge.label}-${index}`}><line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={active ? 'var(--color-instrument)' : 'var(--color-rule-strong)'} strokeOpacity={active ? 0.85 : 0.28} strokeWidth={active ? 2.2 : 1.1} /><text x={midX} y={midY - 5} textAnchor="middle" fill="var(--color-ink-soft)" fontSize="10" opacity={active ? 1 : 0} pointerEvents="none">{edge.label}</text><title>{`${nodeById.get(edge.sourceId)?.symbolName || nodeById.get(edge.sourceId)?.label} —${edge.label}→ ${nodeById.get(edge.targetId)?.symbolName || nodeById.get(edge.targetId)?.label}`}</title></g>;
              })}
              {graph.nodes.map((node) => {
                const point = positions.get(node.id)!;
                const active = selected?.id === node.id;
                const hovered = hoveredId === node.id;
                const label = node.symbolName || node.label || node.id;
                const showLabel = active || hovered || (degree.get(node.id) ?? 0) >= 4;
                const isSearchMatch = matchedNode?.id === node.id && search.trim().length > 0;
                return <g key={node.id} data-node-id={node.id} onPointerDown={(event) => beginNodeDrag(event, node)} onPointerEnter={() => setHoveredId(node.id)} onPointerLeave={() => setHoveredId('')} onClick={() => setSelectedId(node.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedId(node.id); } }} role="button" tabIndex={0} aria-label={`${node.scoreable ? 'Code symbol' : 'Supporting node'} ${label}`} className="cursor-grab outline-none">
                  {isSearchMatch && <circle cx={point.x} cy={point.y} r="19" fill="none" stroke="var(--color-recruiter)" strokeWidth="2" />}
                  <circle cx={point.x} cy={point.y} r={active ? 10 : node.scoreable ? 7 : 5.5} fill={node.scoreable ? 'var(--color-instrument)' : 'var(--color-muted)'} stroke={active ? 'var(--color-recruiter)' : 'var(--color-ground)'} strokeWidth={active ? 3 : 1.5} />
                  {showLabel && <text x={point.x + 12} y={point.y - 12} fill="var(--color-ink)" fontSize="13" paintOrder="stroke" stroke="var(--color-ground)" strokeWidth="4" strokeLinejoin="round" pointerEvents="none">{label.length > 42 ? `${label.slice(0, 40)}…` : label}</text>}
                  <title>{`${label}${node.filePath ? ` · ${node.filePath}` : ''}`}</title>
                </g>;
              })}
            </g>
          </svg>
        </div>
        <aside className="max-h-[min(78vh,900px)] overflow-y-auto p-4" aria-live="polite">
          {selected ? <>
            <p className="cc-label uppercase tracking-[0.12em]">Selected node</p><h3 className="cc-title mt-2 break-words text-lg">{selected.symbolName || selected.label}</h3><p className="cc-copy mt-2 text-xs">{selected.scoreable ? 'Code symbol used as scoreable graph evidence' : 'Supporting graph context'}</p>
            <dl className="mt-4 space-y-3 text-xs"><div><dt className="cc-label">Type</dt><dd className="mt-1 text-[color:var(--color-ink-soft)]">{selected.symbolType || selected.type || 'Unknown'}</dd></div>{selected.filePath && <div><dt className="cc-label">Repository path</dt><dd className="mt-1 break-all text-[color:var(--color-ink-soft)]">{selected.filePath}</dd></div>}{selected.line && <div><dt className="cc-label">Cognee line metadata</dt><dd className="mt-1 text-[color:var(--color-ink-soft)]">{selected.line} · not source-verified</dd></div>}<div><dt className="cc-label">Dimensions</dt><dd className="mt-1 text-[color:var(--color-ink-soft)]">{selected.dimensions?.join(', ') || selected.dimension || 'None'}</dd></div><div><dt className="cc-label">Description</dt><dd className="mt-1 whitespace-pre-wrap break-words text-[color:var(--color-ink-soft)]">{selected.description || 'No graph description.'}</dd></div></dl>
            <div className="mt-5 border-t border-[var(--color-rule)] pt-4"><p className="cc-label">Connected relationships · {connectedEdges.length}</p>{connectedEdges.length ? <ul className="mt-2 space-y-2 text-xs text-[color:var(--color-ink-soft)]">{connectedEdges.map((edge, index) => { const otherId = edge.sourceId === selected.id ? edge.targetId : edge.sourceId; const other = nodeById.get(otherId); return <li key={`${edge.sourceId}-${edge.targetId}-${edge.label}-${index}`}><strong>{edge.label}</strong><span> → {other?.symbolName || other?.label || otherId}</span></li>; })}</ul> : <p className="cc-label mt-2">No saved edges connect this node in the report graph.</p>}</div>
          </> : <p className="cc-copy">Select a node to inspect its graph metadata.</p>}
        </aside>
      </div>
      <div className="flex flex-wrap justify-between gap-2 border-t border-[var(--color-rule)] px-3 py-2"><p className="cc-label">Drag nodes to rearrange · drag empty space to pan · scroll to zoom</p><p className="cc-label">{Math.round(camera.zoom * 100)}% zoom · Cognee metadata is not source-verified</p></div>
    </div>
    <div className="print-only report-print-graph-snapshot">
      <h3>Report-scoped graph overview</h3>
      <p>{graph.nodes.length} nodes · {graph.nodes.filter((node) => node.scoreable).length} code symbols · {graph.nodes.filter((node) => !node.scoreable).length} supporting nodes · {graph.edges.length} relationships</p>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`Static graph overview with ${graph.nodes.length} nodes and ${graph.edges.length} relationships`}>
        {graph.edges.map((edge, index) => {
          const from = positions.get(edge.sourceId);
          const to = positions.get(edge.targetId);
          return from && to ? <line key={`${edge.sourceId}-${edge.targetId}-${edge.label}-${index}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#9aa5b1" strokeOpacity=".55" strokeWidth="1.5" /> : null;
        })}
        {graph.nodes.map((node) => {
          const point = positions.get(node.id);
          if (!point) return null;
          const label = node.symbolName || node.label || node.id;
          return <g key={node.id}><circle cx={point.x} cy={point.y} r={node.scoreable ? 8 : 6} fill={node.scoreable ? '#1683bf' : '#89939e'} stroke="white" strokeWidth="2" />{node.scoreable && (degree.get(node.id) ?? 0) >= 2 && <text x={point.x + 12} y={point.y - 10} fill="#1f2937" fontSize="13">{label.length > 36 ? `${label.slice(0, 34)}…` : label}</text>}</g>;
        })}
      </svg>
      <small>Static overview of the graph context associated with this report. Cognee graph metadata and line numbers are not source-verified.</small>
    </div>
  </div>;
}
