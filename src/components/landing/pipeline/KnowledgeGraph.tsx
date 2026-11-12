const KnowledgeGraph = () => {
  return (
    <div className="grid min-h-[460px] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      {/* LEFT — Graph information */}
      <div>
        <p className="cc-label">Knowledge Graph</p>

        <div className="mt-3 flex items-center gap-3">
          <h3 className="cc-title text-2xl">campus-store</h3>

          <span className="rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-instrument-soft)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-instrument)]">
            Cognee
          </span>
        </div>

        <p className="cc-copy mt-3 max-w-[420px]">
          Every class, method, and call in the repository becomes a node. Every import,
          dependency, and reference becomes an edge — a graph-vector hybrid memory of how the
          codebase actually fits together.
        </p>

        {/* Graph metadata */}
        <div className="mt-7 grid grid-cols-3 border-y border-[var(--color-rule)] py-5">
          <div>
            <p className="cc-label uppercase tracking-[0.12em]">Entities</p>
            <p className="cc-measured mt-1 text-xl font-medium">612</p>
          </div>

          <div className="border-l border-[var(--color-rule)] pl-5">
            <p className="cc-label uppercase tracking-[0.12em]">Relationships</p>
            <p className="cc-measured mt-1 text-xl font-medium">843</p>
          </div>

          <div className="border-l border-[var(--color-rule)] pl-5">
            <p className="cc-label uppercase tracking-[0.12em]">Embeddings</p>
            <p className="cc-measured mt-1 text-xl font-medium">3,150</p>
          </div>
        </div>

        {/* Memory stack */}
        <div className="mt-7">
          <p className="cc-label uppercase tracking-[0.12em]">Memory stack</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {['LanceDB (vectors)', 'KùzuDB (graph)', 'SQLite', 'Ollama 7b / 8b'].map((item) => (
              <span
                key={item}
                className="rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-surface)] px-3 py-1.5 text-xs text-[color:var(--color-ink-soft)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Most connected node */}
        <div className="mt-7 border-l-2 border-[var(--color-instrument)] pl-4">
          <p className="cc-label uppercase tracking-[0.12em]">Most connected node</p>
          <p className="mt-1 text-xs font-medium text-[color:var(--color-ink)]">OrderService.java</p>
          <p className="cc-label mt-1">14 relationships · touches 6 modules</p>
        </div>
      </div>

      {/* RIGHT — Graph visualization */}
      <div className="cc-panel overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-[var(--color-rule)] bg-[color:var(--color-ground)] px-5 py-4">
          <div>
            <p className="text-[11px] font-medium text-[color:var(--color-ink)]">ENTITY GRAPH</p>
            <p className="cc-label mt-1 text-[10px]">campus-store / graph</p>
          </div>
          <span className="cc-label text-[10px]">612 nodes</span>
        </div>

        <div className="p-5">
          <svg viewBox="0 0 560 390" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
            <g stroke="var(--color-rule-strong)" strokeWidth="1.5">
              <line x1="280" y1="200" x2="130" y2="90" />
              <line x1="280" y1="200" x2="120" y2="200" />
              <line x1="280" y1="200" x2="140" y2="310" />
              <line x1="280" y1="200" x2="280" y2="60" />
              <line x1="280" y1="200" x2="420" y2="90" />
              <line x1="280" y1="200" x2="440" y2="200" />
              <line x1="280" y1="200" x2="420" y2="310" />
              <line x1="130" y1="90" x2="120" y2="200" />
              <line x1="420" y1="90" x2="440" y2="200" />
              <line x1="140" y1="310" x2="420" y2="310" />
            </g>

            <g>
              <circle cx="130" cy="90" r="6" fill="var(--color-surface)" stroke="var(--color-instrument)" strokeWidth="1.5" />
              <text x="130" y="72" textAnchor="middle" fill="var(--color-ink-soft)" fontSize="10">
                AuthService
              </text>

              <circle cx="120" cy="200" r="6" fill="var(--color-surface)" stroke="var(--color-instrument)" strokeWidth="1.5" />
              <text x="64" y="204" textAnchor="middle" fill="var(--color-ink-soft)" fontSize="10">
                UserController
              </text>

              <circle cx="140" cy="310" r="6" fill="var(--color-surface)" stroke="var(--color-muted)" strokeWidth="1.5" />
              <text x="140" y="332" textAnchor="middle" fill="var(--color-ink-soft)" fontSize="10">
                DatabaseConfig
              </text>

              <circle cx="280" cy="60" r="6" fill="var(--color-surface)" stroke="var(--color-muted)" strokeWidth="1.5" />
              <text x="280" y="42" textAnchor="middle" fill="var(--color-ink-soft)" fontSize="10">
                Application
              </text>

              <circle cx="420" cy="90" r="6" fill="var(--color-surface)" stroke="var(--color-instrument)" strokeWidth="1.5" />
              <text x="420" y="72" textAnchor="middle" fill="var(--color-ink-soft)" fontSize="10">
                OrderController
              </text>

              <circle cx="440" cy="200" r="6" fill="var(--color-surface)" stroke="var(--color-recruiter)" strokeWidth="1.5" />
              <text x="492" y="204" textAnchor="middle" fill="var(--color-ink-soft)" fontSize="10">
                PaymentService
              </text>

              <circle cx="420" cy="310" r="6" fill="var(--color-surface)" stroke="var(--color-ok)" strokeWidth="1.5" />
              <text x="420" y="332" textAnchor="middle" fill="var(--color-ink-soft)" fontSize="10">
                InventoryService
              </text>
            </g>

            <circle cx="280" cy="200" r="11" fill="var(--color-ok)" />
            <text x="280" y="228" textAnchor="middle" fill="var(--color-ink)" fontSize="11" fontWeight="600">
              OrderService
            </text>
          </svg>
        </div>

        <div className="border-t border-[var(--color-rule)] bg-[color:var(--color-ground)] px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-[color:var(--color-ok)]">OrderService.java</p>
              <p className="cc-label mt-1 text-[10px]">node · 14 edges · centrality rank 1</p>
            </div>
            <span className="cc-label text-[10px] text-[color:var(--color-ink-soft)]">embedded</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
