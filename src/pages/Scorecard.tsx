import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Clock,
  FolderGit2,
  LogOut,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import Navbar from '../components/landing/Navbar';
import FooterInteractive from '../components/landing/FooterInteractive';
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

type DashboardSection = 'repositories' | 'history' | 'profile';

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
  timestamp: index === 0 ? '2 hours ago' : index === 1 ? '1 day ago' : '5 days ago',
  status: 'Verified',
}));

export default function Scorecard() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [activeNav, setActiveNav] = useState<DashboardSection>('repositories');
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
    setActiveNav('repositories');
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

  const sideNavItems: { id: DashboardSection; label: string; icon: typeof FolderGit2; count?: number }[] = [
    { id: 'repositories', label: 'Your Repositories', icon: FolderGit2, count: projects.length },
    { id: 'history', label: 'History', icon: Clock, count: history.length },
    { id: 'profile', label: 'User Profile', icon: UserIcon },
  ];

  return (
    <div className="cc-shell relative isolate flex min-h-screen flex-col">
      <StaticDotGrid />
      <Navbar />

      <main className="cc-app-section flex-1">
        <div className="cc-container">
          {/* Top Workspace Header */}
          <div className="flex flex-col gap-3 border-b border-[var(--color-rule)] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="cc-label uppercase tracking-[0.16em] text-[color:var(--color-ok)]">
                Engineering Evaluation Workspace
              </p>
              <h1 className="cc-heading mt-2 text-3xl sm:text-4xl">
                Engineering Profile Dashboard
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

          {/* Mobile Side-Nav Tabs */}
          <div className="mt-6 flex flex-wrap gap-2 lg:hidden" role="tablist" aria-label="Dashboard sections">
            {sideNavItems.map((item) => {
              const Icon = item.icon;
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveNav(item.id)}
                  className={`cc-button min-h-10 text-xs ${
                    active ? 'cc-button--primary' : 'cc-button--quiet'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span className="cc-measured opacity-75">({item.count})</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Persistent Desktop Side Navigation + Main Content */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
            {/* Side Navigation Bar */}
            <aside className="hidden lg:block lg:sticky lg:top-24 space-y-4">
              <nav aria-label="Dashboard side navigation" className="cc-panel overflow-hidden p-2 space-y-1">
                <p className="cc-label px-3 py-2 uppercase tracking-[0.14em]">Navigation</p>
                {sideNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveNav(item.id)}
                      className={`flex w-full items-center justify-between rounded-[var(--radius-control)] px-3 py-2.5 text-left text-xs font-medium transition cursor-pointer ${
                        active
                          ? 'bg-[color:var(--color-instrument-soft)] text-[color:var(--color-ink)] border border-[var(--color-instrument)]/60'
                          : 'text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-source)] hover:text-[color:var(--color-ink)] border border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 ${
                            active
                              ? 'text-[color:var(--color-instrument)]'
                              : 'text-[color:var(--color-muted)]'
                          }`}
                        />
                        <span>{item.label}</span>
                      </span>
                      {item.count !== undefined && (
                        <span className="cc-measured text-[11px] text-[color:var(--color-muted)]">
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Quick Repo Switcher inside Sidebar when on Repositories */}
              {activeNav === 'repositories' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <p className="cc-label uppercase tracking-[0.14em]">Repositories</p>
                    <span className="cc-measured text-xs text-[color:var(--color-muted)]">
                      {projects.length}
                    </span>
                  </div>
                  <div className="space-y-2.5">
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
                </div>
              )}
            </aside>

            {/* Main Panel Area */}
            <div className="min-w-0 space-y-6">
              {/* TAB 1: YOUR REPOSITORIES */}
              {activeNav === 'repositories' && (
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

                  {/* Mobile Repo Selector */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
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

                  <ProfileHeader project={activeProject} />

                  <SkillsRadar
                    skills={activeProject.skills}
                    selectedDimension={selectedDimension}
                    onSelectDimension={setSelectedDimension}
                  />

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
                </>
              )}

              {/* TAB 2: HISTORY */}
              {activeNav === 'history' && (
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
                            Commit <span className="text-[color:var(--color-instrument)]">{entry.commitHash}</span> · {entry.timestamp}
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
                              setActiveNav('repositories');
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

              {/* TAB 3: USER PROFILE */}
              {activeNav === 'profile' && (
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
                            <span>{user?.provider === 'github' ? 'GitHub Connected' : 'Verified Member'}</span>
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
          </div>
        </div>
      </main>

      <FooterInteractive />
    </div>
  );
}
