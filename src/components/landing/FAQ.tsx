import { useState } from 'react';
import { Plus } from 'lucide-react';

const faqs = [
  {
    question: 'What exactly does CampusCode evaluate?',
    answer:
      'CampusCode looks beyond individual keywords and analyzes how your codebase is actually engineered. The scorecard evaluates areas such as architecture and modularity, concurrency and thread safety, testing and error handling, clean code, and Git hygiene.',
  },
  {
    question: 'How is my engineering score calculated?',
    answer:
      'Your score is built from multiple engineering signals found across the repository. CampusCode combines these signals into an overall engineering profile and breaks the result into individual categories so you can see where your strengths and weaknesses are.',
  },
  {
    question: 'Why should I trust an AI-generated score?',
    answer:
      'CampusCode is designed to make every evaluation explainable. Instead of giving you a score with no context, findings point to specific files and lines of code that support the evaluation.',
  },
  {
    question: 'Does CampusCode send my source code to an AI service?',
    answer:
      'CampusCode is designed around local graph-based analysis. Your source code stays private while extracting meaningful architectural and engineering signals from the repository.',
  },
  {
    question: 'What happens when I connect my GitHub repository?',
    answer:
      'You select a repository that you own or maintain, and CampusCode analyzes its structure and engineering signals to generate your scorecard inside the dashboard.',
  },
  {
    question: 'Can recruiters actually verify my score?',
    answer:
      'Yes. The scorecard is designed to be evidence-driven rather than a black-box rating. Recruiters can follow findings back to relevant source-code locations and understand the engineering decisions behind the evaluation.',
  },
  {
    question: 'Can I use CampusCode to improve my projects?',
    answer:
      'Absolutely. Use the category-level scores and evidence to identify areas that need improvement, then re-evaluate the repository as your codebase evolves.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="cc-section cc-section--band">
      <div className="mx-auto max-w-[980px] px-6">
        <div className="text-center">
          <p className="cc-label uppercase tracking-[0.18em] text-[color:var(--color-instrument)]">
            FAQ
          </p>

          <h2 className="cc-heading mt-4">
            Everything you want to know<span className="text-[color:var(--color-recruiter)]">.</span>
          </h2>

          <p className="cc-lead mx-auto max-w-[620px]">
            From repository analysis to recruiter-ready evidence, here is how CampusCode works.
          </p>
        </div>

        <div className="cc-panel mt-10 overflow-hidden">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.question} className="border-b border-[var(--color-rule)] last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition hover:bg-[color:var(--color-source)]/60 sm:px-7 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="cc-measured hidden text-xs text-[color:var(--color-instrument)] sm:block">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="text-sm font-medium leading-6 text-[color:var(--color-ink)]">
                      {faq.question}
                    </span>
                  </div>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                      isOpen
                        ? 'rotate-45 border-[var(--color-recruiter)] text-[color:var(--color-recruiter)]'
                        : 'border-[var(--color-rule-strong)] text-[color:var(--color-muted)]'
                    }`}
                  >
                    <Plus size={15} />
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pl-6 sm:px-7 sm:pl-[72px]">
                      <p className="cc-copy max-w-[760px] text-xs sm:text-sm">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
