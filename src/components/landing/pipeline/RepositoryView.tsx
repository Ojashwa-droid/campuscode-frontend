const RepositoryView = () => {
  return (
    <div className="grid min-h-[460px] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      {/* LEFT — Repository information */}
      <div>
        <p className="cc-label">Repository</p>

        <div className="mt-3 flex items-center gap-3">
          <h3 className="cc-title text-2xl">campus-store</h3>

          <span className="rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-ok-soft)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-ok)]">
            Java
          </span>
        </div>

        <p className="cc-copy mt-3 max-w-[420px]">
          A Spring Boot e-commerce application analyzed by CampusCode to understand its
          architecture, dependencies, and engineering decisions.
        </p>

        {/* Repository metadata */}
        <div className="mt-7 grid grid-cols-3 border-y border-[var(--color-rule)] py-5">
          <div>
            <p className="cc-label uppercase tracking-[0.12em]">Files</p>
            <p className="cc-measured mt-1 text-xl font-medium">184</p>
          </div>

          <div className="border-l border-[var(--color-rule)] pl-5">
            <p className="cc-label uppercase tracking-[0.12em]">Modules</p>
            <p className="cc-measured mt-1 text-xl font-medium">27</p>
          </div>

          <div className="border-l border-[var(--color-rule)] pl-5">
            <p className="cc-label uppercase tracking-[0.12em]">Edges</p>
            <p className="cc-measured mt-1 text-xl font-medium">843</p>
          </div>
        </div>

        {/* Tech stack */}
        <div className="mt-7">
          <p className="cc-label uppercase tracking-[0.12em]">Stack detected</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {['Java 21', 'Spring Boot', 'PostgreSQL', 'Redis'].map((tech) => (
              <span
                key={tech}
                className="rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-surface)] px-3 py-1.5 text-xs text-[color:var(--color-ink-soft)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Latest commit */}
        <div className="mt-7 border-l-2 border-[var(--color-ok)] pl-4">
          <p className="cc-label uppercase tracking-[0.12em]">Latest commit</p>
          <p className="mt-1 text-xs font-medium text-[color:var(--color-ink)]">
            Improve inventory locking
          </p>
          <p className="cc-label mt-1">8f3a91c · 2 hours ago</p>
        </div>
      </div>

      {/* RIGHT — File explorer */}
      <div className="cc-panel overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-[var(--color-rule)] bg-[color:var(--color-ground)] px-5 py-4">
            <div>
              <p className="text-[11px] font-medium text-[color:var(--color-ink)]">FILE EXPLORER</p>
              <p className="cc-label mt-1 text-[10px]">main / src</p>
            </div>
            <span className="cc-label text-[10px]">184 files</span>
          </div>

          <div className="p-5 text-xs leading-8 text-[color:var(--color-muted)]">
            <div className="text-[color:var(--color-ink)]">
              <span className="mr-2 text-[color:var(--color-ok)]">↓</span>
              src/
            </div>
            <div className="pl-5">├── config/</div>
            <div className="pl-5">│&nbsp;&nbsp;&nbsp;└── DatabaseConfig.java</div>
            <div className="pl-5">├── auth/</div>
            <div className="pl-5">│&nbsp;&nbsp;&nbsp;├── AuthService.java</div>
            <div className="pl-5">│&nbsp;&nbsp;&nbsp;└── UserController.java</div>
            <div className="pl-5 text-[color:var(--color-ink)]">├── orders/</div>
            <div className="pl-5 text-[color:var(--color-ok)]">│&nbsp;&nbsp;&nbsp;├── OrderService.java</div>
            <div className="pl-5">│&nbsp;&nbsp;&nbsp;└── OrderController.java</div>
            <div className="pl-5">├── inventory/</div>
            <div className="pl-5">│&nbsp;&nbsp;&nbsp;└── InventoryService.java</div>
            <div className="pl-5">├── payments/</div>
            <div className="pl-5">│&nbsp;&nbsp;&nbsp;└── PaymentService.java</div>
            <div className="pl-5">└── application/</div>
            <div className="pl-5">&nbsp;&nbsp;&nbsp;&nbsp;└── Application.java</div>
          </div>
        </div>

        <div className="border-t border-[var(--color-rule)] bg-[color:var(--color-ground)] px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-[color:var(--color-ok)]">OrderService.java</p>
              <p className="cc-label mt-1 text-[10px]">src/orders/OrderService.java</p>
            </div>
            <span className="cc-measured text-[10px] text-[color:var(--color-ink-soft)]">
              126 lines
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryView;
