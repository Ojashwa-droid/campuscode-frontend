const KnowledgeGraph = () => {
    return (
      <div className="grid min-h-[470px] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
  
        {/* LEFT — Graph information */}
        <div>
  
          <p className="text-[13px] font-medium text-[#6B7280]">
            Knowledge Graph
          </p>
  
          <div className="mt-3 flex items-center gap-3">
            <h3 className="text-[26px] font-bold tracking-[-0.04em] text-[#121316]">
              campus-store
            </h3>
  
            <span className="rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[11px] font-medium text-[#047857]">
              Cognee
            </span>
          </div>
  
          <p className="mt-3 max-w-[420px] text-[14px] leading-6 text-[#6B7280]">
            Every class, method, and call in the repository becomes a
            node. Every import, dependency, and reference becomes an
            edge — a graph-vector hybrid memory of how the codebase
            actually fits together.
          </p>
  
          {/* Graph metadata */}
          <div className="mt-7 grid grid-cols-3 border-y border-[#E5E7EB] py-5">
  
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#9CA3AF]">
                Entities
              </p>
  
              <p className="mt-1 text-[20px] font-semibold text-[#121316]">
                612
              </p>
            </div>
  
            <div className="border-l border-[#E5E7EB] pl-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#9CA3AF]">
                Relationships
              </p>
  
              <p className="mt-1 text-[20px] font-semibold text-[#121316]">
                843
              </p>
            </div>
  
            <div className="border-l border-[#E5E7EB] pl-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#9CA3AF]">
                Embeddings
              </p>
  
              <p className="mt-1 text-[20px] font-semibold text-[#121316]">
                3,150
              </p>
            </div>
  
          </div>
  
          {/* Memory stack */}
          <div className="mt-7">
  
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#9CA3AF]">
              Memory stack
            </p>
  
            <div className="mt-3 flex flex-wrap gap-2">
  
              <span className="border border-[#E5E7EB] bg-white px-3 py-1.5 text-[12px] text-[#4B5563]">
                LanceDB (vectors)
              </span>
  
              <span className="border border-[#E5E7EB] bg-white px-3 py-1.5 text-[12px] text-[#4B5563]">
                KùzuDB (graph)
              </span>
  
              <span className="border border-[#E5E7EB] bg-white px-3 py-1.5 text-[12px] text-[#4B5563]">
                SQLite
              </span>
  
              <span className="border border-[#E5E7EB] bg-white px-3 py-1.5 text-[12px] text-[#4B5563]">
                Ollama 7b / 8b
              </span>
  
            </div>
  
          </div>
  
          {/* Most connected node */}
          <div className="mt-7 border-l-2 border-[#10B981] pl-4">
  
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#9CA3AF]">
              Most connected node
            </p>
  
            <p className="mt-1 text-[13px] font-semibold text-[#121316]">
              OrderService.java
            </p>
  
            <p className="mt-1 font-mono text-[11px] text-[#6B7280]">
              14 relationships · touches 6 modules
            </p>
  
          </div>
  
        </div>
  
        {/* RIGHT — Graph visualization */}
        <div className="border border-[#E5E7EB] bg-white">
  
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
  
            <div>
              <p className="font-mono text-[11px] font-medium text-[#121316]">
                ENTITY GRAPH
              </p>
  
              <p className="mt-1 font-mono text-[10px] text-[#9CA3AF]">
                campus-store / graph
              </p>
            </div>
  
            <span className="font-mono text-[10px] text-[#9CA3AF]">
              612 nodes
            </span>
  
          </div>
  
          {/* Graph canvas */}
          <div className="p-5">
            <svg
              viewBox="0 0 560 400"
              className="h-auto w-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* edges */}
              <g stroke="#E5E7EB" strokeWidth="1.5">
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
  
              {/* satellite nodes */}
              <g>
                <circle cx="130" cy="90" r="6" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="1.5" />
                <text x="130" y="72" textAnchor="middle" className="fill-[#6B7280]" fontFamily="monospace" fontSize="10">
                  AuthService
                </text>
  
                <circle cx="120" cy="200" r="6" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="1.5" />
                <text x="70" y="204" textAnchor="middle" className="fill-[#6B7280]" fontFamily="monospace" fontSize="10">
                  UserController
                </text>
  
                <circle cx="140" cy="310" r="6" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="1.5" />
                <text x="140" y="332" textAnchor="middle" className="fill-[#6B7280]" fontFamily="monospace" fontSize="10">
                  DatabaseConfig
                </text>
  
                <circle cx="280" cy="60" r="6" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="1.5" />
                <text x="280" y="42" textAnchor="middle" className="fill-[#6B7280]" fontFamily="monospace" fontSize="10">
                  Application
                </text>
  
                <circle cx="420" cy="90" r="6" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="1.5" />
                <text x="420" y="72" textAnchor="middle" className="fill-[#6B7280]" fontFamily="monospace" fontSize="10">
                  OrderController
                </text>
  
                <circle cx="440" cy="200" r="6" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="1.5" />
                <text x="486" y="204" textAnchor="middle" className="fill-[#6B7280]" fontFamily="monospace" fontSize="10">
                  PaymentService
                </text>
  
                <circle cx="420" cy="310" r="6" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="1.5" />
                <text x="420" y="332" textAnchor="middle" className="fill-[#6B7280]" fontFamily="monospace" fontSize="10">
                  InventoryService
                </text>
              </g>
  
              {/* central node */}
              <circle cx="280" cy="200" r="11" fill="#10B981" />
              <text x="280" y="228" textAnchor="middle" className="fill-[#121316]" fontFamily="monospace" fontSize="11" fontWeight="600">
                OrderService
              </text>
            </svg>
          </div>
  
          {/* Selected node */}
          <div className="border-t border-[#E5E7EB] bg-[#FAFAF7] px-5 py-4">
  
            <div className="flex items-center justify-between">
  
              <div>
                <p className="font-mono text-[11px] text-[#10B981]">
                  OrderService.java
                </p>
  
                <p className="mt-1 font-mono text-[10px] text-[#9CA3AF]">
                  node · 14 edges · centrality rank 1
                </p>
              </div>
  
              <span className="font-mono text-[10px] text-[#6B7280]">
                embedded
              </span>
  
            </div>
  
          </div>
  
        </div>
  
      </div>
    );
  };
  
  export default KnowledgeGraph;