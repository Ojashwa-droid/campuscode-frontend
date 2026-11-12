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
      'CampusCode is designed to make every evaluation explainable. Instead of giving you a score with no context, findings can point to specific files and lines of code that support the evaluation. This lets you understand and verify why a particular conclusion was reached.',
  },
  {
    question: 'Does CampusCode send my source code to an AI service?',
    answer:
      'CampusCode is designed around local graph-based analysis. The goal is to keep your source code private while still extracting meaningful architectural and engineering signals from the repository.',
  },
  {
    question: 'What happens when I connect my GitHub repository?',
    answer:
      'You select a repository that you own or maintain, and CampusCode analyzes its structure and engineering signals to generate your scorecard. You remain in control of which repository you choose to evaluate.',
  },
  {
    question: 'Can recruiters actually verify my score?',
    answer:
      'Yes. The scorecard is designed to be evidence-driven rather than a black-box rating. Recruiters can follow findings back to relevant source-code locations and understand the engineering decisions behind the evaluation.',
  },
  {
    question: 'Can I use CampusCode to improve my projects?',
    answer:
      'Absolutely. The scorecard is intended to be useful before you share a project with recruiters. Use the category-level scores and evidence to identify areas that need improvement, then re-evaluate the repository as your codebase evolves.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="bg-[#FAFAF7] px-6 py-14"
    >
      <div className="mx-auto max-w-[980px]">

        {/* Header */}
        <div className="text-center">

          <p className="font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-[#10B981]">
            FAQ
          </p>

          <h2 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] text-[#121316] sm:text-[42px]">
            Everything you want to know
            <span className="text-[#10B981]">.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-[620px] text-[16px] leading-7 text-[#6B7280]">
            From repository analysis to recruiter-ready evidence,
            here is how CampusCode works.
          </p>

        </div>

        {/* FAQ List */}
        <div className="mt-9 overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white shadow-[0_8px_30px_rgba(17,24,39,0.03)]">

          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="border-b border-[#E5E7EB] last:border-b-0"
              >

                {/* Question */}
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition hover:bg-[#FAFAF7] sm:px-7"
                >
                  <div className="flex items-center gap-4">

                    <span className="hidden font-mono text-[11px] text-[#10B981] sm:block">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="text-[15px] font-semibold leading-6 text-[#121316]">
                      {faq.question}
                    </span>

                  </div>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] text-[#6B7280] transition-all duration-200 ${
                      isOpen
                        ? 'rotate-45 border-[#10B981] text-[#10B981]'
                        : ''
                    }`}
                  >
                    <Plus size={16} />
                  </span>
                </button>

                {/* Answer */}
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? 'grid-rows-[1fr]'
                      : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pl-6 sm:px-7 sm:pl-[76px]">
                      <p className="max-w-[760px] text-[14px] leading-7 text-[#6B7280]">
                        {faq.answer}
                      </p>
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