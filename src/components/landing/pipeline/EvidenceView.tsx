const evidenceLog = [
  {
    type: 'Strength',
    claim: 'Checkout uses pessimistic row locking, preventing overselling under concurrent requests.',
    file: 'OrderService.java',
    line: 'L88',
  },
  {
    type: 'Concern',
    claim: 'Payment retries carry no idempotency key, risking a duplicate charge on network retry.',
    file: 'PaymentService.java',
    line: 'L42',
  },
  {
    type: 'Strength',
    claim: 'Controllers stay thin — request handling is consistently delegated to the service layer.',
    file: 'OrderController.java',
    line: 'L1',
  },
  {
    type: 'Concern',
    claim: 'InventoryService and OrderService import each other directly, forming a circular dependency.',
    file: 'InventoryService.java',
    line: 'L15',
  },
];

const EvidenceView = () => {
  return (
    <div className="grid min-h-[460px] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      {/* LEFT — Evidence information */}
      <div>
        <p className="cc-label">Engineering Evidence</p>

        <div className="mt-3 flex items-center gap-3">
          <h3 className="cc-title text-2xl">campus-store</h3>

          <span className="rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-recruiter-soft)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-recruiter)]">
            XAI
          </span>
        </div>

        <p className="cc-copy mt-3 max-w-[420px]">
          The model is instructed to return the exact file and line behind every claim it makes —
          no unlinked scores. Each finding is validated against the schema before it reaches the
          report.
        </p>

        {/* Evidence metadata */}
        <div className="mt-7 grid grid-cols-3 border-y border-[var(--color-rule)] py-5">
          <div>
            <p className="cc-label uppercase tracking-[0.12em]">Claims</p>
            <p className="cc-measured mt-1 text-xl font-medium">42</p>
          </div>

          <div className="border-l border-[var(--color-rule)] pl-5">
            <p className="cc-label uppercase tracking-[0.12em]">Strengths</p>
            <p className="cc-measured mt-1 text-xl font-medium text-[color:var(--color-ok)]">27</p>
          </div>

          <div className="border-l border-[var(--color-rule)] pl-5">
            <p className="cc-label uppercase tracking-[0.12em]">Concerns</p>
            <p className="cc-measured mt-1 text-xl font-medium text-[color:var(--color-warning)]">
              15
            </p>
          </div>
        </div>

        {/* Pipeline stages */}
        <div className="mt-7">
          <p className="cc-label uppercase tracking-[0.12em]">Validation pipeline</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {['Subgraph retrieval', 'Ollama analysis', 'XAI format validator'].map((stage) => (
              <span
                key={stage}
                className="rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-surface)] px-3 py-1.5 text-xs text-[color:var(--color-ink-soft)]"
              >
                {stage}
              </span>
            ))}
          </div>
        </div>

        {/* Report status */}
        <div className="mt-7 border-l-2 border-[var(--color-ok)] pl-4">
          <p className="cc-label uppercase tracking-[0.12em]">Report status</p>
          <p className="mt-1 text-xs font-medium text-[color:var(--color-ink)]">
            Schema validated · saved
          </p>
          <p className="cc-label mt-1">report.json · 42 claims mapped to source</p>
        </div>
      </div>

      {/* RIGHT — Evidence log */}
      <div className="cc-panel overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-[var(--color-rule)] bg-[color:var(--color-ground)] px-5 py-4">
            <div>
              <p className="text-[11px] font-medium text-[color:var(--color-ink)]">EVIDENCE LOG</p>
              <p className="cc-label mt-1 text-[10px]">main / engineering-profile</p>
            </div>
            <span className="cc-label text-[10px]">42 claims</span>
          </div>

          <div className="divide-y divide-[var(--color-rule)]">
            {evidenceLog.map((item) => (
              <div key={item.file + item.line} className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <span
                    className={
                      item.type === 'Strength'
                        ? 'rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-ok-soft)] px-2.5 py-0.5 text-[11px] font-medium text-[color:var(--color-ok)]'
                        : 'rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-recruiter-soft)] px-2.5 py-0.5 text-[11px] font-medium text-[color:var(--color-recruiter)]'
                    }
                  >
                    {item.type}
                  </span>

                  <span className="text-[11px] text-[color:var(--color-instrument)]">
                    {item.file}:{item.line}
                  </span>
                </div>

                <p className="cc-copy mt-2 text-xs text-[color:var(--color-ink-soft)]">
                  {item.claim}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--color-rule)] bg-[color:var(--color-ground)] px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-[color:var(--color-instrument)]">
                Engineering Profile Dashboard
              </p>
              <p className="cc-label mt-1 text-[10px]">
                every claim links back to campus-store on GitHub
              </p>
            </div>
            <span className="cc-label text-[10px] text-[color:var(--color-ink-soft)]">
              student-facing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceView;
