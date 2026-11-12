import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

interface ScoreBarProps {
  label: string;
  value: number;
}

const ScoreBar = ({ label, value }: ScoreBarProps) => {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-[12px]">
        <span className="text-[#6B7280]">
          {label}
        </span>

        <span className="font-semibold text-[#374151]">
          {value}%
        </span>
      </div>

      <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-[#E5E7EB]">
        <div
          className="h-full rounded-full bg-[#10B981]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

const HeroSection = () => {
  const { openGithubModal, openDemoModal, isAuthenticated, user } = useAuth();
  return (
    <section className="bg-[#FAFAF7] px-6 pb-14 pt-14 text-center">

      {/* Status Badge */}
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3.5 py-1.5">
        <span className="h-2 w-2 rounded-full bg-[#10B981]" />

        <span className="text-[12px] font-medium text-[#121316]">
          100% Local Graph AI Evaluation
        </span>
      </div>

      {/* Main Heading */}
      <h1 className="mx-auto mt-6 max-w-[800px] text-[52px] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#121316] sm:text-[64px] md:text-[70px]">
        Resumes lie.

        <span className="block text-[#10B981]">
          Code doesn't.
        </span>
      </h1>

      {/* Description */}
      <p className="mx-auto mt-5 max-w-[670px] text-[15px] leading-[1.65] text-[#6B7280] sm:text-[16px]">
        CampusCode turns entire codebases into explainable engineering
        knowledge graphs. Rate architecture, thread-safety, and code hygiene
        with direct deep-links to source code.
      </p>

      {/* CTA Buttons */}
      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">

        {!isAuthenticated ? (
          <button
            type="button"
            onClick={openGithubModal}
            className="flex h-12 items-center gap-2 rounded-full bg-[#111827] px-6 text-[14px] font-bold text-white shadow-[0_8px_20px_rgba(17,24,39,0.15)] transition hover:-translate-y-[2px] hover:bg-[#1F2937] active:scale-[0.98] cursor-pointer"
          >
            <FontAwesomeIcon
              icon={faGithub}
              className="text-[16px]"
            />

            <span>Sign in with GitHub</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 px-5 py-2.5 text-[14px] font-bold text-[#047857]">
            <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
            <span>Ready to evaluate, {user?.name?.split(' ')[0]}</span>
          </div>
        )}

        <button
          type="button"
          onClick={openDemoModal}
          className="group flex h-12 items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-6 text-[14px] font-semibold text-[#121316] transition hover:border-[#10B981] hover:text-[#10B981] hover:shadow-sm active:scale-[0.98] cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-[#10B981] transition group-hover:rotate-12" />
          <span>View a Demo</span>
        </button>

      </div>

      {/* Scorecard Preview */}
      <div className="mx-auto mt-10 w-full max-w-[980px] overflow-hidden rounded-[18px] border border-[#E5E7EB] bg-white text-left shadow-[0_15px_45px_rgba(17,24,39,0.06)]">

        {/* Preview Header */}
        <div className="flex h-[52px] items-center justify-between border-b border-[#E5E7EB] px-5 sm:px-6">

          <div className="flex items-center gap-2">

            <button className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#121316]">
              Spring Boot Store
            </button>

            <button className="rounded-full px-3 py-1.5 text-[12px] font-semibold text-[#6B7280]">
              MultiThreaded Queue
            </button>

          </div>

          <span className="hidden font-mono text-[11px] text-[#6B7280] sm:block">
            Sample Scorecard Preview
          </span>

        </div>

        {/* Preview Content */}
        <div className="grid gap-6 p-5 md:grid-cols-2">

          {/* Project Card */}
          <div className="rounded-[15px] border border-[#E5E7EB] bg-[#F9FAFA] p-5">

            <span className="inline-flex rounded-full bg-[#DCFCE7] px-3 py-1.5 text-[11px] font-bold text-[#047857]">
              Level 4: Production Ready
            </span>

            <h2 className="mt-4 text-[20px] font-bold tracking-[-0.03em] text-[#121316]">
              spring-boot-ecommerce
            </h2>

            <p className="mt-2 text-[12px] text-[#6B7280]">
              Primary: Java 21 • Spring Boot 3.2 • PostgreSQL
            </p>

            <ScoreBar
              label="Modularity & Clean Architecture"
              value={94}
            />

            <ScoreBar
              label="Concurrency & Thread Safety"
              value={88}
            />

            <ScoreBar
              label="Testing & Error Handling"
              value={91}
            />

          </div>

          {/* AI Finding Card */}
          <div className="rounded-[15px] border border-[#E5E7EB] bg-white p-5">

            <span className="inline-block rounded-md bg-[#EFF6FF] px-2 py-1 font-mono text-[11px] text-[#1D4ED8]">
              OrderService.java : L84
            </span>

            <h3 className="mt-4 text-[15px] font-bold text-[#121316]">
              Thread-Safe Distributed Locking
            </h3>

            <p className="mt-2 text-[12px] leading-[1.6] text-[#6B7280]">
              Correctly uses Redis distributed lock before checking
              inventory race conditions.
            </p>

            {/* Code Preview */}
            <div className="mt-4 overflow-hidden rounded-lg bg-[#18181B] p-3 font-mono text-[10px] leading-[1.65] text-[#E5E7EB]">

              <div>
                <span className="text-[#6B7280]">83</span>
                &nbsp; public OrderResponse checkout(UUID
              </div>

              <div>
                <span className="text-[#6B7280]">84</span>
                &nbsp; Lock lock =
              </div>

              <div>
                <span className="text-[#10B981]">85</span>
                &nbsp; redis.getLock(cartId);
              </div>

              <div>
                <span className="text-[#6B7280]">86</span>
                &nbsp; if (lock.tryLock(5,
              </div>

              <div>
                <span className="text-[#6B7280]">87</span>
                &nbsp; TimeUnit.SECONDS)) {'{'} ...
              </div>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
};

export default HeroSection;