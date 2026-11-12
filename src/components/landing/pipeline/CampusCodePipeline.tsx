import { useState } from 'react';
import RepositoryView from '../pipeline/RepositoryView';
import KnowledgeGraph from '../pipeline/KnowledgeGraph';
import EvidenceView from '../pipeline/EvidenceView';

const steps = [
  { id: 'repository', number: '01', label: 'Repository' },
  { id: 'graph', number: '02', label: 'Knowledge Graph' },
  { id: 'evidence', number: '03', label: 'Engineering Evidence' },
] as const;

type StepId = (typeof steps)[number]['id'];

const CampusCodePipeline = () => {
  const [activeStep, setActiveStep] = useState<StepId>('repository');

  return (
    <section
      id="how-it-works"
      className="bg-white px-6 py-16"
    >
      <div className="mx-auto max-w-[1180px]">

        {/* Heading */}
        <div className="max-w-[720px]">

          <p className="font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-[#10B981]">
            How CampusCode Works
          </p>

          <h2 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] text-[#121316] sm:text-[44px]">
            Your repository is the evidence
            <span className="text-[#10B981]">.</span>
          </h2>

          <p className="mt-4 text-[16px] leading-7 text-[#6B7280]">
            Follow your project from source code to engineering
            intelligence.
          </p>

        </div>

        {/* Pipeline Navigation */}
        <div className="mt-10 border-y border-[#E5E7EB]">

          <div className="grid grid-cols-3">
            {steps.map((step) => {
              const isActive = step.id === activeStep;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className={`relative flex items-center gap-3 px-4 py-5 text-left transition-colors sm:px-6 ${
                    isActive ? 'bg-[#FAFAF7]' : 'hover:bg-[#FAFAF7]/60'
                  }`}
                >
                  <span
                    className={`font-mono text-[11px] ${
                      isActive ? 'text-[#10B981]' : 'text-[#9CA3AF]'
                    }`}
                  >
                    {step.number}
                  </span>

                  <span
                    className={`text-[13px] font-semibold sm:text-[14px] ${
                      isActive ? 'text-[#121316]' : 'text-[#6B7280]'
                    }`}
                  >
                    {step.label}
                  </span>

                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#10B981]" />
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Step Content */}
        <div className="mt-8">
          {activeStep === 'repository' && <RepositoryView />}
          {activeStep === 'graph' && <KnowledgeGraph />}
          {activeStep === 'evidence' && <EvidenceView />}
        </div>

      </div>
    </section>
  );
};

export default CampusCodePipeline;