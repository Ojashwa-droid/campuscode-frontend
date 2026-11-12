const evidenceLog = [
    {
      type: "Strength",
      claim:
        "Checkout uses pessimistic row locking, preventing overselling under concurrent requests.",
      file: "OrderService.java",
      line: "L88",
    },
    {
      type: "Concern",
      claim:
        "Payment retries carry no idempotency key, risking a duplicate charge on network retry.",
      file: "PaymentService.java",
      line: "L42",
    },
    {
      type: "Strength",
      claim:
        "Controllers stay thin — request handling is consistently delegated to the service layer.",
      file: "OrderController.java",
      line: "L1",
    },
    {
      type: "Concern",
      claim:
        "InventoryService and OrderService import each other directly, forming a circular dependency.",
      file: "InventoryService.java",
      line: "L15",
    },
  ];
  
  const EvidenceView = () => {
    return (
      <div className="grid min-h-[470px] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
  
        {/* LEFT — Evidence information */}
        <div>
  
          <p className="text-[13px] font-medium text-[#6B7280]">
            Engineering Evidence
          </p>
  
          <div className="mt-3 flex items-center gap-3">
            <h3 className="text-[26px] font-bold tracking-[-0.04em] text-[#121316]">
              campus-store
            </h3>
  
            <span className="rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[11px] font-medium text-[#047857]">
              XAI
            </span>
          </div>
  
          <p className="mt-3 max-w-[420px] text-[14px] leading-6 text-[#6B7280]">
            The model is instructed to return the exact file and line
            behind every claim it makes — no unlinked scores. Each
            finding is validated against the schema before it reaches
            the report.
          </p>
  
          {/* Evidence metadata */}
          <div className="mt-7 grid grid-cols-3 border-y border-[#E5E7EB] py-5">
  
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#9CA3AF]">
                Claims
              </p>
  
              <p className="mt-1 text-[20px] font-semibold text-[#121316]">
                42
              </p>
            </div>
  
            <div className="border-l border-[#E5E7EB] pl-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#9CA3AF]">
                Strengths
              </p>
  
              <p className="mt-1 text-[20px] font-semibold text-[#121316]">
                27
              </p>
            </div>
  
            <div className="border-l border-[#E5E7EB] pl-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#9CA3AF]">
                Concerns
              </p>
  
              <p className="mt-1 text-[20px] font-semibold text-[#121316]">
                15
              </p>
            </div>
  
          </div>
  
          {/* Pipeline stages */}
          <div className="mt-7">
  
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#9CA3AF]">
              Validation pipeline
            </p>
  
            <div className="mt-3 flex flex-wrap gap-2">
  
              <span className="border border-[#E5E7EB] bg-white px-3 py-1.5 text-[12px] text-[#4B5563]">
                Subgraph retrieval
              </span>
  
              <span className="border border-[#E5E7EB] bg-white px-3 py-1.5 text-[12px] text-[#4B5563]">
                Ollama analysis
              </span>
  
              <span className="border border-[#E5E7EB] bg-white px-3 py-1.5 text-[12px] text-[#4B5563]">
                XAI format validator
              </span>
  
            </div>
  
          </div>
  
          {/* Report status */}
          <div className="mt-7 border-l-2 border-[#10B981] pl-4">
  
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#9CA3AF]">
              Report status
            </p>
  
            <p className="mt-1 text-[13px] font-semibold text-[#121316]">
              Schema validated · saved
            </p>
  
            <p className="mt-1 font-mono text-[11px] text-[#6B7280]">
              report.json · 42 claims mapped to source
            </p>
  
          </div>
  
        </div>
  
        {/* RIGHT — Evidence log */}
        <div className="border border-[#E5E7EB] bg-white">
  
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
  
            <div>
              <p className="font-mono text-[11px] font-medium text-[#121316]">
                EVIDENCE LOG
              </p>
  
              <p className="mt-1 font-mono text-[10px] text-[#9CA3AF]">
                main / engineering-profile
              </p>
            </div>
  
            <span className="font-mono text-[10px] text-[#9CA3AF]">
              42 claims
            </span>
  
          </div>
  
          {/* Log entries */}
          <div className="divide-y divide-[#E5E7EB]">
            {evidenceLog.map((item) => (
              <div key={item.file + item.line} className="px-5 py-4">
  
                <div className="flex items-center justify-between">
                  <span
                    className={
                      item.type === "Strength"
                        ? "rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[11px] font-medium text-[#047857]"
                        : "rounded-full bg-[#FFFBEB] px-2.5 py-1 text-[11px] font-medium text-[#B45309]"
                    }
                  >
                    {item.type}
                  </span>
  
                  <span className="font-mono text-[11px] text-[#10B981]">
                    {item.file}:{item.line}
                  </span>
                </div>
  
                <p className="mt-2 text-[13px] leading-6 text-[#4B5563]">
                  {item.claim}
                </p>
  
              </div>
            ))}
          </div>
  
          {/* Selected claim */}
          <div className="border-t border-[#E5E7EB] bg-[#FAFAF7] px-5 py-4">
  
            <div className="flex items-center justify-between">
  
              <div>
                <p className="font-mono text-[11px] text-[#10B981]">
                  Engineering Profile Dashboard
                </p>
  
                <p className="mt-1 font-mono text-[10px] text-[#9CA3AF]">
                  every claim links back to campus-store on GitHub
                </p>
              </div>
  
              <span className="font-mono text-[10px] text-[#6B7280]">
                student-facing
              </span>
  
            </div>
  
          </div>
  
        </div>
  
      </div>
    );
  };
  
  export default EvidenceView;