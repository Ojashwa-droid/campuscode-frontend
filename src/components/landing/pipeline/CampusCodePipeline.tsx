import { useState } from 'react';
import RepositoryView from './RepositoryView';
import KnowledgeGraph from './KnowledgeGraph';
import EvidenceView from './EvidenceView';

const steps = [
  { id: 'repository', number: '01', label: 'Repository' },
  { id: 'graph', number: '02', label: 'Knowledge Graph' },
  { id: 'evidence', number: '03', label: 'Engineering Evidence' },
] as const;

type StepId = (typeof steps)[number]['id'];

const CampusCodePipeline = () => {
  const [activeStep, setActiveStep] = useState<StepId>('repository');

  return (
    <section id="how-it-works" className="cc-section cc-section--band">
      <div className="cc-container">
        {/* Heading */}
        <div className="max-w-[720px]">
          <p className="cc-label uppercase tracking-[0.18em] text-[color:var(--color-instrument)]">
            How CampusCode Works
          </p>

          <h2 className="cc-heading mt-4">
            Your repository is the evidence<span className="text-[color:var(--color-recruiter)]">.</span>
          </h2>

          <p className="cc-lead">
            Follow your project from source code to engineering intelligence.
          </p>
        </div>

        {/* Pipeline Navigation */}
        <div className="mt-10 border-y border-[var(--color-rule)]">
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {steps.map((step) => {
              const isActive = step.id === activeStep;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className={`relative flex items-center gap-3 px-4 py-5 text-left transition-colors sm:px-6 cursor-pointer border-b sm:border-b-0 sm:border-r border-[var(--color-rule)] last:border-b-0 last:border-r-0 ${
                    isActive
                      ? 'bg-[color:var(--color-surface)]'
                      : 'hover:bg-[color:var(--color-surface)]/50'
                  }`}
                >
                  <span
                    className={`cc-measured text-xs ${
                      isActive ? 'text-[color:var(--color-instrument)]' : 'text-[color:var(--color-muted)]'
                    }`}
                  >
                    {step.number}
                  </span>

                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      isActive ? 'text-[color:var(--color-ink)]' : 'text-[color:var(--color-ink-soft)]'
                    }`}
                  >
                    {step.label}
                  </span>

                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[color:var(--color-instrument)]" />
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
