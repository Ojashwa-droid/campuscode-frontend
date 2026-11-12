const RepositoryView = () => {
    return (
      <div className="grid min-h-[470px] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
  
        {/* LEFT — Repository information */}
        <div>
  
          <p className="text-[13px] font-medium text-[#6B7280]">
            Repository
          </p>
  
          <div className="mt-3 flex items-center gap-3">
            <h3 className="text-[26px] font-bold tracking-[-0.04em] text-[#121316]">
              campus-store
            </h3>
  
            <span className="rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[11px] font-medium text-[#047857]">
              Java
            </span>
          </div>
  
          <p className="mt-3 max-w-[420px] text-[14px] leading-6 text-[#6B7280]">
            A Spring Boot e-commerce application analyzed by CampusCode
            to understand its architecture, dependencies, and engineering
            decisions.
          </p>
  
          {/* Repository metadata */}
          <div className="mt-7 grid grid-cols-3 border-y border-[#E5E7EB] py-5">
  
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#9CA3AF]">
                Files
              </p>
  
              <p className="mt-1 text-[20px] font-semibold text-[#121316]">
                184
              </p>
            </div>
  
            <div className="border-l border-[#E5E7EB] pl-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#9CA3AF]">
                Modules
              </p>
  
              <p className="mt-1 text-[20px] font-semibold text-[#121316]">
                27
              </p>
            </div>
  
            <div className="border-l border-[#E5E7EB] pl-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#9CA3AF]">
                Edges
              </p>
  
              <p className="mt-1 text-[20px] font-semibold text-[#121316]">
                843
              </p>
            </div>
  
          </div>
  
          {/* Tech stack */}
          <div className="mt-7">
  
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#9CA3AF]">
              Stack detected
            </p>
  
            <div className="mt-3 flex flex-wrap gap-2">
  
              <span className="border border-[#E5E7EB] bg-white px-3 py-1.5 text-[12px] text-[#4B5563]">
                Java 21
              </span>
  
              <span className="border border-[#E5E7EB] bg-white px-3 py-1.5 text-[12px] text-[#4B5563]">
                Spring Boot
              </span>
  
              <span className="border border-[#E5E7EB] bg-white px-3 py-1.5 text-[12px] text-[#4B5563]">
                PostgreSQL
              </span>
  
              <span className="border border-[#E5E7EB] bg-white px-3 py-1.5 text-[12px] text-[#4B5563]">
                Redis
              </span>
  
            </div>
  
          </div>
  
          {/* Latest commit */}
          <div className="mt-7 border-l-2 border-[#10B981] pl-4">
  
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#9CA3AF]">
              Latest commit
            </p>
  
            <p className="mt-1 text-[13px] font-semibold text-[#121316]">
              Improve inventory locking
            </p>
  
            <p className="mt-1 font-mono text-[11px] text-[#6B7280]">
              8f3a91c · 2 hours ago
            </p>
  
          </div>
  
        </div>
  
        {/* RIGHT — File explorer */}
        <div className="border border-[#E5E7EB] bg-white">
  
          {/* Explorer header */}
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
  
            <div>
              <p className="font-mono text-[11px] font-medium text-[#121316]">
                FILE EXPLORER
              </p>
  
              <p className="mt-1 font-mono text-[10px] text-[#9CA3AF]">
                main / src
              </p>
            </div>
  
            <span className="font-mono text-[10px] text-[#9CA3AF]">
              184 files
            </span>
  
          </div>
  
          {/* File tree */}
          <div className="p-5 font-mono text-[12px] leading-8">
  
            <div className="text-[#121316]">
              <span className="mr-2 text-[#10B981]">
                ↓
              </span>
              src/
            </div>
  
            <div className="pl-5 text-[#6B7280]">
              ├── config/
            </div>
  
            <div className="pl-5 text-[#6B7280]">
              │&nbsp;&nbsp;&nbsp;└── DatabaseConfig.java
            </div>
  
            <div className="pl-5 text-[#6B7280]">
              ├── auth/
            </div>
  
            <div className="pl-5 text-[#6B7280]">
              │&nbsp;&nbsp;&nbsp;├── AuthService.java
            </div>
  
            <div className="pl-5 text-[#6B7280]">
              │&nbsp;&nbsp;&nbsp;└── UserController.java
            </div>
  
            <div className="pl-5 text-[#121316]">
              ├── orders/
            </div>
  
            <div className="pl-5 text-[#10B981]">
              │&nbsp;&nbsp;&nbsp;├── OrderService.java
            </div>
  
            <div className="pl-5 text-[#6B7280]">
              │&nbsp;&nbsp;&nbsp;└── OrderController.java
            </div>
  
            <div className="pl-5 text-[#6B7280]">
              ├── inventory/
            </div>
  
            <div className="pl-5 text-[#6B7280]">
              │&nbsp;&nbsp;&nbsp;└── InventoryService.java
            </div>
  
            <div className="pl-5 text-[#6B7280]">
              ├── payments/
            </div>
  
            <div className="pl-5 text-[#6B7280]">
              │&nbsp;&nbsp;&nbsp;└── PaymentService.java
            </div>
  
            <div className="pl-5 text-[#6B7280]">
              └── application/
            </div>
  
            <div className="pl-5 text-[#6B7280]">
              &nbsp;&nbsp;&nbsp;&nbsp;└── Application.java
            </div>
  
          </div>
  
          {/* Selected file */}
          <div className="border-t border-[#E5E7EB] bg-[#FAFAF7] px-5 py-4">
  
            <div className="flex items-center justify-between">
  
              <div>
                <p className="font-mono text-[11px] text-[#10B981]">
                  OrderService.java
                </p>
  
                <p className="mt-1 font-mono text-[10px] text-[#9CA3AF]">
                  src/orders/OrderService.java
                </p>
              </div>
  
              <span className="font-mono text-[10px] text-[#6B7280]">
                126 lines
              </span>
  
            </div>
  
          </div>
  
        </div>
  
      </div>
    );
  };
  
  export default RepositoryView;