import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { StaticDotGrid } from '../components/ui/StaticDotGrid';
import { AnalyzeBar } from '../components/dashboard/AnalyzeBar';
import { ActiveTask } from '../components/dashboard/ActiveTask';
import { ProjectCard } from '../components/dashboard/ProjectCard';
import { ProfileHeader } from '../components/scorecard/ProfileHeader';
import { SkillsRadar } from '../components/scorecard/SkillsRadar';
import { AIFindingCard } from '../components/scorecard/AIFindingCard';
import { ArchitectureGraph } from '../components/scorecard/ArchitectureGraph';
import { INITIAL_PROJECTS, buildProjectFromUrl } from '../lib/mockProjects';
import type { AnalyzedProject } from '../lib/types';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';

export default function Scorecard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [projects, setProjects] = useState<AnalyzedProject[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(INITIAL_PROJECTS[0].id);
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);

  // Active simulated ingestion state
  const [activeJob, setActiveJob] = useState<{
    repoName: string;
    progress: number;
    stepIndex: number;
    logs: string[];
    completed: boolean;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const activeProject =
    projects.find((p) => p.id === selectedProjectId) ?? projects[0];

  const filteredFindings = selectedDimension
    ? activeProject.findings.filter((f) => f.dimension === selectedDimension)
    : activeProject.findings;

  const handleAnalyze = (repoUrl: string) => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];

    const created = buildProjectFromUrl(repoUrl);
    setIsAnalyzing(true);
    setActiveJob({
      repoName: created.name,
      progress: 20,
      stepIndex: 0,
      logs: [`git clone --depth=1 ${created.repoUrl}`],
      completed: false,
    });

    const t1 = window.setTimeout(() => {
      setActiveJob((prev) =>
        prev
          ? {
              ...prev,
              progress: 50,
              stepIndex: 1,
              logs: [
                ...prev.logs,
                `[ast] Parsed ${created.filesCount} source files across ${created.modulesCount} modules`,
              ],
            }
          : null
      );
    }, 650);

    const t2 = window.setTimeout(() => {
      setActiveJob((prev) =>
        prev
          ? {
              ...prev,
              progress: 82,
              stepIndex: 2,
              logs: [
                ...prev.logs,
                `[graph] Indexed ${created.edgesCount} structural relationships in KùzuDB + LanceDB`,
              ],
            }
          : null
      );
    }, 1350);

    const t3 = window.setTimeout(() => {
      setProjects((prev) => [created, ...prev]);
      setSelectedProjectId(created.id);
      setSelectedDimension(null);
      setIsAnalyzing(false);
      setActiveJob((prev) =>
        prev
          ? {
              ...prev,
              progress: 100,
              stepIndex: 3,
              completed: true,
              logs: [
                ...prev.logs,
                `[xai] Dossier #${created.dossierId} validated (${created.overallScore}/100)`,
              ],
            }
          : null
      );
      showToast(`Analysis complete for ${created.name}!`, 'success');
    }, 2050);

    timersRef.current = [t1, t2, t3];
  };

  return (
    <div className="cc-shell relative isolate flex min-h-screen flex-col">
      <StaticDotGrid />
      <Navbar />

      <main className="cc-app-section flex-1">
        <div className="cc-container space-y-8">
          {/* Workspace Header Strip */}
          <div className="flex flex-col gap-3 border-b border-[var(--color-rule)] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="cc-label uppercase tracking-[0.16em] text-[color:var(--color-ok)]">
                Engineering Evaluation Workspace
              </p>
              <h1 className="cc-heading mt-2 text-3xl sm:text-4xl">
                Candidate Dossier Dashboard
              </h1>
            </div>

            <div className="cc-source px-4 py-2.5 text-xs">
              <span className="text-[color:var(--color-muted)]">Signed in: </span>
              <span className="font-medium text-[color:var(--color-ink)]">{user?.name}</span>
              {user?.githubHandle && (
                <span className="ml-1.5 text-[color:var(--color-instrument)]">
                  @{user.githubHandle}
                </span>
              )}
            </div>
          </div>

          {/* Analyze Repository Bar */}
          <AnalyzeBar onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

          {/* Active Ingestion Task */}
          {activeJob && (
            <ActiveTask
              repoName={activeJob.repoName}
              progress={activeJob.progress}
              currentStepIndex={activeJob.stepIndex}
              logs={activeJob.logs}
              completed={activeJob.completed}
              onDismiss={() => setActiveJob(null)}
            />
          )}

          {/* Main Dashboard Content Grid: Sidebar Projects + Scorecard */}
          <div className="grid gap-6 xl:grid-cols-[290px_minmax(0,1fr)] xl:items-start">
            {/* Left Column: Analyzed Repositories */}
            <aside className="space-y-3 xl:sticky xl:top-24">
              <div className="flex items-center justify-between px-1">
                <p className="cc-label uppercase tracking-[0.14em]">Analyzed Repositories</p>
                <span className="cc-measured text-xs text-[color:var(--color-muted)]">
                  {projects.length}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isSelected={project.id === activeProject.id}
                    onSelect={(id) => {
                      setSelectedProjectId(id);
                      setSelectedDimension(null);
                    }}
                  />
                ))}
              </div>
            </aside>

            {/* Right Column: Scorecard Details */}
            <div className="min-w-0 space-y-6">
              <ProfileHeader project={activeProject} />

              <SkillsRadar
                skills={activeProject.skills}
                selectedDimension={selectedDimension}
                onSelectDimension={setSelectedDimension}
              />

              {/* AI Findings with Line Proofs */}
              <section aria-label="Evidence-backed AI findings" className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="cc-label uppercase tracking-[0.14em] text-[color:var(--color-instrument)]">
                      Evidence-Linked Findings
                    </p>
                    <h2 className="cc-title mt-1 text-base">
                      {selectedDimension
                        ? `Filtered: ${selectedDimension}`
                        : 'Verified code proofs & concerns'}
                    </h2>
                  </div>
                  <span className="cc-measured text-xs text-[color:var(--color-muted)]">
                    {filteredFindings.length} finding{filteredFindings.length === 1 ? '' : 's'}
                  </span>
                </div>

                {filteredFindings.length ? (
                  <div className="grid gap-4">
                    {filteredFindings.map((finding) => (
                      <AIFindingCard
                        key={finding.id}
                        finding={finding}
                        repoUrl={activeProject.repoUrl}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="cc-panel p-6 text-center">
                    <p className="cc-copy text-xs">
                      No isolated findings for this dimension — overall score reflects aggregate
                      repository checks.
                    </p>
                  </div>
                )}
              </section>

              <ArchitectureGraph
                key={activeProject.id}
                nodes={activeProject.graphNodes}
                projectName={activeProject.name}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
