import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Code2,
  LogOut,
  Menu,
  Network,
  Radar,
  ShieldCheck,
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { StaticDotGrid } from '../components/ui/StaticDotGrid';
import { Sidebar, type DashboardSection } from '../components/dashboard/Sidebar';
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

type ProfileTab = 'overview' | 'evidence' | 'graph';

interface HistoryEntry {
  id: string;
  projectId: string;
  repoName: string;
  repoUrl: string;
  score: number;
  grade: string;
  commitHash: string;
  timestamp: string;
  status: 'Verified' | 'Completed';
}

const INITIAL_HISTORY: HistoryEntry[] = INITIAL_PROJECTS.map((project, index) => ({
  id: `hist-${project.id}`,
  projectId: project.id,
  repoName: project.name,
  repoUrl: project.repoUrl,
  score: project.overallScore,
  grade: project.grade,
  commitHash: project.commitHash,
  timestamp: index === 0 ? '2 hours ago' : '1 day ago',
  status: 'Verified',
}));

export default function Scorecard() {
  const { user, logout, openDemoModal } = useAuth();
  const { showToast } = useToast();

  const [activeSection, setActiveSection] = useState<DashboardSection>('repositories');
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [projects, setProjects] = useState<AnalyzedProject[]>(INITIAL_PROJECTS);
  const [history, setHistory] = useState<HistoryEntry[]>(INITIAL_HISTORY);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(INITIAL_PROJECTS[0].id);
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);

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
    setActiveSection('repositories');
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
      setHistory((prev) => [
        {
          id: `hist-${created.id}`,
          projectId: created.id,
          repoName: created.name,
          repoUrl: created.repoUrl,
          score: created.overallScore,
          grade: created.grade,
          commitHash: created.commitHash,
          timestamp: 'Just now',
          status: 'Completed',
        },
        ...prev,
      ]);
      setSelectedProjectId(created.id);
      setSelectedDimension(null);
      setActiveTab('overview');
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
                `[xai] Engineering Profile #${created.dossierId} validated (${created.overallScore}/100)`,
              ],
            }
          : null
      );
      showToast(`Engineering Profile ready for ${created.name}!`, 'success');
    }, 2050);

    timersRef.current = [t1, t2, t3];
  };

  const sectionTitle =
    activeSection === 'repositories'
      ? 'Your Repositories'
      : activeSection === 'history'
      ? 'Analysis History'
      : 'User Profile';

  return (
    <div className="cc-shell relative isolate flex min-h-screen bg-[color:var(--color-ground)]">
      <StaticDotGrid />

      {/* Left Side Navigation Bar */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        repoCount={projects.length}
        historyCount={history.length}
        user={user}
        onOpenDemo={openDemoModal}
        onLogout={logout}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Right Workspace Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Clean Slim Top Workspace Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--color-rule)] bg-[color:var(--color-ground)]/95 px-5 backdrop-blur-sm sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="cc-button cc-button--quiet min-h-9 w-9 px-0 lg:hidden"
              aria-label="Open workspace navigation"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div>
              <p className="cc-label text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-instrument)]">
                Engineering Profile
              </p>
              <h1 className="text-sm font-medium text-[color:var(--color-ink)]">
                {sectionTitle}
              </h1>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-surface)] px-2.5 py-1 text-[11px] text-[color:var(--color-ok)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-ok)]" />
            Local Graph Sandbox
          </span>
        </header>

        {/* Main Workspace Content */}
        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto max-w-6xl space-y-6">
            {/* SECTION 1: YOUR REPOSITORIES */}
            {activeSection === 'repositories' && (
              <>
                <AnalyzeBar onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

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

                {/* Single Horizontal Repository Selector */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

                {/* Selected Repo Summary Header */}
                <ProfileHeader project={activeProject} />

                {/* Clean Sub-Tabs (Prevents Vertical Clutter) */}
                <div
                  role="tablist"
                  aria-label="Engineering profile views"
                  className="flex flex-wrap items-center gap-2 border-b border-[var(--color-rule)] pb-3"
                >
                  {(
                    [
                      { id: 'overview', label: 'Overview & Scores', icon: Radar },
                      {
                        id: 'evidence',
                        label: `Code Evidence (${activeProject.findings.length})`,
                        icon: Code2,
                      },
                      { id: 'graph', label: 'Knowledge Graph', icon: Network },
                    ] as const
                  ).map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setActiveTab(tab.id)}
                        className={`cc-button min-h-10 text-xs ${
                          active ? 'cc-button--primary' : 'cc-button--quiet'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-tab 1: Overview & Radar */}
                {activeTab === 'overview' && (
                  <SkillsRadar
                    skills={activeProject.skills}
                    selectedDimension={selectedDimension}
                    onSelectDimension={(dim) => {
                      setSelectedDimension(dim);
                      if (dim) setActiveTab('evidence');
                    }}
                  />
                )}

                {/* Sub-tab 2: Code Evidence */}
                {activeTab === 'evidence' && (
                  <section aria-label="Evidence-backed AI findings" className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedDimension(null)}
                          className={`rounded-[var(--radius-control)] border px-2.5 py-1 text-[11px] transition cursor-pointer ${
                            selectedDimension === null
                              ? 'border-[var(--color-instrument)] bg-[color:var(--color-instrument-soft)] text-[color:var(--color-ink)]'
                              : 'border-[var(--color-rule)] bg-[color:var(--color-surface)] text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]'
                          }`}
                        >
                          All ({activeProject.findings.length})
                        </button>
                        {activeProject.skills.map((skill) => (
                          <button
                            key={skill.dimension}
                            type="button"
                            onClick={() => setSelectedDimension(skill.dimension)}
                            className={`rounded-[var(--radius-control)] border px-2.5 py-1 text-[11px] transition cursor-pointer ${
                              selectedDimension === skill.dimension
                                ? 'border-[var(--color-instrument)] bg-[color:var(--color-instrument-soft)] text-[color:var(--color-ink)]'
                                : 'border-[var(--color-rule)] bg-[color:var(--color-surface)] text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]'
                            }`}
                          >
                            {skill.shortLabel}
                          </button>
                        ))}
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
                      <div className="cc-panel p-8 text-center">
                        <p className="cc-copy text-xs">
                          No isolated findings for this dimension — overall score reflects
                          aggregate repository checks.
                        </p>
                      </div>
                    )}
                  </section>
                )}

                {/* Sub-tab 3: Knowledge Graph */}
                {activeTab === 'graph' && (
                  <ArchitectureGraph
                    key={activeProject.id}
                    nodes={activeProject.graphNodes}
                    projectName={activeProject.name}
                  />
                )}
              </>
            )}

            {/* SECTION 2: HISTORY */}
            {activeSection === 'history' && (
              <section aria-label="Analysis history" className="cc-panel overflow-hidden">
                <div className="flex items-center justify-between border-b border-[var(--color-rule)] bg-[color:var(--color-source)] px-6 py-4">
                  <div>
                    <p className="cc-label uppercase tracking-[0.14em] text-[color:var(--color-instrument)]">
                      Ingestion Ledger
                    </p>
                    <h2 className="cc-title mt-1 text-base">Analysis History</h2>
                  </div>
                  <span className="cc-measured text-xs text-[color:var(--color-muted)]">
                    {history.length} runs
                  </span>
                </div>

                <div className="divide-y divide-[var(--color-rule)]">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-medium text-[color:var(--color-ink)]">
                            {entry.repoName}
                          </span>
                          <span className="rounded border border-[var(--color-rule)] bg-[color:var(--color-ok-soft)] px-2 py-0.5 text-[10px] text-[color:var(--color-ok)]">
                            {entry.status}
                          </span>
                        </div>
                        <p className="cc-label mt-1 truncate text-[11px]">{entry.repoUrl}</p>
                        <p className="cc-label mt-1 text-[10px]">
                          Commit{' '}
                          <span className="text-[color:var(--color-instrument)]">
                            {entry.commitHash}
                          </span>{' '}
                          · {entry.timestamp}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <p className="cc-measured text-sm font-semibold text-[color:var(--color-ok)]">
                            {entry.score} / 100
                          </p>
                          <p className="cc-label text-[10px]">Grade {entry.grade}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProjectId(entry.projectId);
                            setSelectedDimension(null);
                            setActiveTab('overview');
                            setActiveSection('repositories');
                          }}
                          className="cc-button cc-button--quiet min-h-9 text-xs"
                        >
                          <span>Open Profile</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 3: USER PROFILE */}
            {activeSection === 'profile' && (
              <section aria-label="User profile" className="cc-panel p-6 space-y-6">
                <div className="flex flex-col gap-5 border-b border-[var(--color-rule)] pb-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        user?.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          user?.name || 'User'
                        )}`
                      }
                      alt={user?.name}
                      className="h-16 w-16 rounded-full border border-[var(--color-rule-strong)] bg-[color:var(--color-source)] object-cover"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="cc-title">{user?.name}</h2>
                        <span className="inline-flex items-center gap-1 rounded border border-[var(--color-rule)] bg-[color:var(--color-ok-soft)] px-2 py-0.5 text-[10px] font-medium text-[color:var(--color-ok)]">
                          <ShieldCheck className="h-3 w-3" />
                          <span>
                            {user?.provider === 'github' ? 'GitHub Connected' : 'Verified Member'}
                          </span>
                        </span>
                      </div>
                      <p className="cc-copy mt-1 text-xs">{user?.email}</p>
                      {user?.githubHandle && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-[color:var(--color-instrument)]">
                          <FontAwesomeIcon icon={faGithub} />
                          <span>@{user.githubHandle}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={logout}
                    className="cc-button cc-button--quiet min-h-10 text-xs text-[color:var(--color-warning)] hover:border-[var(--color-warning)]"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="cc-source p-4">
                    <p className="cc-label uppercase tracking-[0.12em]">Repositories</p>
                    <p className="cc-measured mt-2 text-2xl font-medium">{projects.length}</p>
                  </div>
                  <div className="cc-source p-4">
                    <p className="cc-label uppercase tracking-[0.12em]">Analysis Runs</p>
                    <p className="cc-measured mt-2 text-2xl font-medium">{history.length}</p>
                  </div>
                  <div className="cc-source p-4">
                    <p className="cc-label uppercase tracking-[0.12em]">Session Mode</p>
                    <p className="mt-2 text-sm font-medium text-[color:var(--color-ok)]">
                      Fresh Per Run
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
