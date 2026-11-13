import { useEffect, useState } from 'react';
import { ArrowUpRight, Clock3, GitBranch, KeyRound, LogOut, Menu, Pencil, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StaticDotGrid } from '../components/ui/StaticDotGrid';
import { Sidebar, type DashboardSection } from '../components/dashboard/Sidebar';
import { AnalyzeBar } from '../components/dashboard/AnalyzeBar';
import { ReportPage as ReportPreview } from './RepositoryReview';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';
import { ApiError, createIngestion, getIngestion, getReport, type EvaluationReport, type IngestionStatus } from '../lib/api';

type DashboardJob = IngestionStatus & { report?: EvaluationReport };
const historyKey = (email: string) => `campuscode:ingestions:${email.toLowerCase()}`;

function repositoryName(url: string) {
  return url.replace(/\/+$/, '').split('/').slice(-2).join('/').replace(/\.git$/i, '');
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function statusLabel(status: IngestionStatus['status'], report?: EvaluationReport) {
  if (report) return 'Report ready';
  return ({ QUEUED: 'Queued', INGESTING: 'Ingesting', COGNIFYING: 'Indexing', COMPLETED: 'Ready for evaluation', FAILED: 'Failed' })[status];
}

export default function Scorecard() {
  const { user, logout, openDemoModal, updateProfile, changePassword } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<DashboardSection>('engineering');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [jobs, setJobs] = useState<DashboardJob[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name ?? '');
  const [profileEmail, setProfileEmail] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    const load = async () => {
      setIsLoadingHistory(true);
      try {
        const savedIds = JSON.parse(localStorage.getItem(historyKey(user.email)) || '[]') as string[];
        const uniqueIds = [...new Set(savedIds)].slice(0, 30);
        const results = await Promise.all(uniqueIds.map(async (id) => {
          try {
            const ingestion = await getIngestion(id);
            let report: EvaluationReport | undefined;
            if (ingestion.status === 'COMPLETED') {
              try { report = await getReport(id); } catch { /* It may be ready for evaluation but have no report yet. */ }
            }
            return { ...ingestion, report };
          } catch { return null; }
        }));
        if (!cancelled) setJobs(results.filter((job) => job !== null) as DashboardJob[]);
      } finally {
        if (!cancelled) setIsLoadingHistory(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [user?.email]);

  const handleAnalyze = async (repoUrl: string) => {
    if (!/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(?:\.git)?\/?$/i.test(repoUrl)) {
      showToast('Enter a public GitHub repository URL.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const ingestion = await createIngestion({ repositoryUrl: repoUrl });
      if (user?.email) {
        const key = historyKey(user.email);
        const ids = JSON.parse(localStorage.getItem(key) || '[]') as string[];
        localStorage.setItem(key, JSON.stringify([ingestion.id, ...ids.filter((id) => id !== ingestion.id)].slice(0, 30)));
      }
      setJobs((previous) => [{ ...ingestion }, ...previous.filter((job) => job.id !== ingestion.id)]);
      navigate(`/dashboard/ingestions/${ingestion.id}`);
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : 'Could not submit the repository.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionTitle = activeSection === 'engineering' ? 'Engineering' : activeSection === 'history' ? 'Analyzed Repositories' : activeSection === 'report-preview' ? 'Sample Report' : 'User Profile';
  const activeCount = jobs.filter((job) => ['QUEUED', 'INGESTING', 'COGNIFYING'].includes(job.status)).length;
  const readyCount = jobs.filter((job) => job.report).length;

  return (
    <div className="cc-shell relative isolate flex min-h-screen bg-[color:var(--color-ground)]">
      <StaticDotGrid />
      <Sidebar activeSection={activeSection} onSelectSection={setActiveSection} repoCount={jobs.length} historyCount={jobs.length} user={user} onOpenDemo={openDemoModal} onLogout={logout} mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--color-rule)] bg-[color:var(--color-ground)]/95 px-5 backdrop-blur-sm sm:px-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMobileNavOpen(true)} className="cc-button cc-button--quiet min-h-9 w-9 px-0 lg:hidden" aria-label="Open workspace navigation"><Menu className="h-4 w-4" /></button>
            <div><p className="cc-label text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-instrument)]">CampusCode workspace</p><h1 className="text-sm font-medium text-[color:var(--color-ink)]">{sectionTitle}</h1></div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-surface)] px-2.5 py-1 text-[11px] text-[color:var(--color-muted)]"><span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-instrument)]" /> Spring API · localhost:8080</span>
        </header>

        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8"><div className="mx-auto max-w-6xl space-y-6">
          {activeSection === 'engineering' && <>
            <section className="relative overflow-hidden rounded-[var(--radius-surface)] border border-[var(--color-rule)] bg-[color:var(--color-source)] px-6 py-7 sm:px-8 sm:py-9">
              <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border border-[var(--color-instrument)]/10 bg-[color:var(--color-instrument-soft)]/30 blur-3xl" />
              <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div><p className="cc-label flex items-center gap-2 uppercase tracking-[0.16em] text-[color:var(--color-instrument)]"><GitBranch className="h-3.5 w-3.5" /> Repository engineering review</p><h2 className="cc-display mt-4 text-[clamp(2.25rem,4vw,3.75rem)]">Your work, <span className="text-[color:var(--color-recruiter)]">with proof.</span></h2><p className="cc-copy mt-4 max-w-2xl text-sm sm:text-base">Welcome back, {user?.name?.split(' ')[0] || 'there'}. Submit a public GitHub repository and CampusCode will build an evidence-backed engineering scorecard.</p></div>
                <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-rule)] lg:min-w-[330px]">
                  <Stat label="Reviews" value={jobs.length} /><Stat label="In progress" value={activeCount} /><Stat label="Reports" value={readyCount} />
                </div>
              </div>
            </section>
            <div><p className="cc-label uppercase tracking-[0.14em] text-[color:var(--color-instrument)]">Start a review</p><h2 className="cc-title mt-1 text-lg">Paste a repository URL</h2></div>
            <AnalyzeBar onAnalyze={handleAnalyze} isAnalyzing={isSubmitting} />
            <JobList jobs={jobs.slice(0, 4)} isLoading={isLoadingHistory} onOpen={(id) => navigate(`/dashboard/ingestions/${id}`)} />
          </>}

          {activeSection === 'history' && <JobList jobs={jobs} isLoading={isLoadingHistory} onOpen={(id) => navigate(`/dashboard/ingestions/${id}`)} full />}

          {activeSection === 'report-preview' && <ReportPreview demo />}

          {activeSection === 'profile' && <ProfileSection user={user} logout={logout} updateProfile={updateProfile} changePassword={changePassword} showToast={showToast} isEditing={isEditingProfile} setIsEditing={setIsEditingProfile} profileName={profileName} setProfileName={setProfileName} profileEmail={profileEmail} setProfileEmail={setProfileEmail} currentPassword={currentPassword} setCurrentPassword={setCurrentPassword} newPassword={newPassword} setNewPassword={setNewPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} jobCount={jobs.length} />}
        </div></main>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="bg-[color:var(--color-surface)] p-3 sm:p-4"><p className="cc-label">{label}</p><p className="cc-measured mt-2 text-xl font-medium">{value}</p></div>;
}

function JobList({ jobs, isLoading, onOpen, full = false }: { jobs: DashboardJob[]; isLoading: boolean; onOpen: (id: string) => void; full?: boolean }) {
  return <section aria-label="Repository history" className="cc-panel overflow-hidden">
    <div className="flex items-center justify-between border-b border-[var(--color-rule)] bg-[color:var(--color-source)] px-5 py-4 sm:px-6"><div><p className="cc-label uppercase tracking-[0.14em] text-[color:var(--color-instrument)]">{full ? 'Your workspace' : 'Recent activity'}</p><h2 className="cc-title mt-1 text-base">{full ? 'Analyzed repositories' : 'Recent repository reviews'}</h2></div><span className="cc-measured text-xs text-[color:var(--color-muted)]">{jobs.length} {jobs.length === 1 ? 'repository' : 'repositories'}</span></div>
    {isLoading ? <div className="p-8 text-center"><span className="cc-label">Loading your repository history…</span></div> : jobs.length ? <div className="divide-y divide-[var(--color-rule)]">{jobs.map((job) => <article key={job.id} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-sm font-medium text-[color:var(--color-ink)]">{repositoryName(job.repositoryUrl)}</h3><span className={`rounded-full border px-2 py-0.5 text-[10px] ${job.status === 'FAILED' ? 'border-[var(--color-warning)]/40 text-[color:var(--color-warning)]' : job.report ? 'border-[var(--color-ok)]/40 text-[color:var(--color-ok)]' : 'border-[var(--color-rule-strong)] text-[color:var(--color-ink-soft)]'}`}>{statusLabel(job.status, job.report)}</span></div><a className="cc-label mt-1 block truncate text-[11px] hover:text-[color:var(--color-instrument)]" href={job.repositoryUrl} target="_blank" rel="noreferrer">{job.repositoryUrl}</a><p className="cc-label mt-1 text-[10px]">Updated {formatDate(job.updatedAt)}{job.report ? ` · Score ${job.report.overallScore}/100` : ''}</p></div><div className="flex items-center gap-3"><button type="button" onClick={() => onOpen(job.id)} className="cc-button cc-button--quiet min-h-9 text-xs">{job.report ? 'Open report' : 'View progress'} <ArrowUpRight className="h-3.5 w-3.5" /></button></div></article>)}</div> : <div className="px-6 py-12 text-center"><span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-instrument)]/30 bg-[color:var(--color-instrument-soft)] text-[color:var(--color-instrument)]"><Clock3 className="h-5 w-5" /></span><h3 className="cc-title mt-4 text-lg">No repository reviews yet</h3><p className="cc-copy mx-auto mt-2 max-w-md">Repositories you submit will appear here with live status and their final scorecards.</p></div>}
  </section>;
}

function ProfileSection({ user, logout, updateProfile, changePassword, showToast, isEditing, setIsEditing, profileName, setProfileName, profileEmail, setProfileEmail, currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword, jobCount }: any) {
  return <div className="space-y-5">
    <section className="relative overflow-hidden rounded-[var(--radius-surface)] border border-[var(--color-rule)] bg-[color:var(--color-source)] p-6 sm:p-8"><div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[color:var(--color-instrument-soft)]/50 blur-3xl" /><div className="relative flex flex-wrap items-center justify-between gap-5"><div className="flex items-center gap-4"><img src={user?.avatar} alt={user?.name} className="h-16 w-16 rounded-2xl border border-[var(--color-rule-strong)] bg-[color:var(--color-surface)] object-cover" /><div><p className="cc-label uppercase tracking-[0.16em] text-[color:var(--color-instrument)]">Your account</p><h2 className="cc-title mt-1 text-2xl">{user?.name}</h2><p className="cc-copy mt-1 text-xs">{user?.email}</p></div></div><div className="flex gap-2"><button type="button" onClick={() => { setProfileName(user?.name ?? ''); setProfileEmail(user?.email ?? ''); setIsEditing((value: boolean) => !value); }} className="cc-button cc-button--quiet min-h-10 text-xs">{isEditing ? <X className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}{isEditing ? 'Cancel edit' : 'Edit profile'}</button><button type="button" onClick={logout} className="cc-button cc-button--quiet min-h-10 text-xs text-[color:var(--color-warning)]"><LogOut className="h-3.5 w-3.5" /> Sign out</button></div></div><div className="relative mt-7 grid gap-3 border-t border-[var(--color-rule)] pt-5 sm:grid-cols-3"><div><p className="cc-label">Sign-in method</p><p className="mt-1 text-sm text-[color:var(--color-ink-soft)]">{user?.provider === 'github' ? 'GitHub' : 'Email & password'}</p></div><div><p className="cc-label">Repositories reviewed</p><p className="cc-measured mt-1 text-sm">{jobCount}</p></div><div><p className="cc-label">Member since</p><p className="mt-1 text-sm text-[color:var(--color-ink-soft)]">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : '—'}</p></div></div></section>
    {isEditing && <section className="cc-panel p-6"><p className="cc-label uppercase tracking-[0.14em] text-[color:var(--color-instrument)]">Personal details</p><h3 className="cc-title mt-1 text-lg">Edit your profile</h3><form onSubmit={async (event: React.FormEvent) => { event.preventDefault(); const result = await updateProfile(profileName, profileEmail); if (result.success) { setIsEditing(false); showToast('Profile updated.', 'success'); } else showToast(result.error || 'Could not update profile.', 'error'); }} className="mt-5 grid gap-4 sm:grid-cols-2"><label className="cc-label">Full name<input className="cc-input mt-2" value={profileName} onChange={(event) => setProfileName(event.target.value)} required /></label><label className="cc-label">Email address<input className="cc-input mt-2" type="email" value={profileEmail} onChange={(event) => setProfileEmail(event.target.value)} disabled={user?.provider === 'github'} required /></label><div className="sm:col-span-2"><button className="cc-button cc-button--primary" type="submit"><Save className="h-4 w-4" /> Save changes</button></div></form></section>}
    {user?.provider === 'email' && <section className="cc-panel p-6"><div className="mb-5 flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-recruiter)]/25 bg-[color:var(--color-recruiter-soft)] text-[color:var(--color-recruiter)]"><KeyRound className="h-4 w-4" /></span><div><p className="cc-label uppercase tracking-[0.14em]">Account security</p><h3 className="cc-title mt-1 text-lg">Change password</h3></div></div><form onSubmit={async (event: React.FormEvent) => { event.preventDefault(); if (newPassword !== confirmPassword) { showToast('New passwords do not match.', 'error'); return; } const result = await changePassword(currentPassword, newPassword); if (result.success) { setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); showToast('Password updated.', 'success'); } else showToast(result.error || 'Could not change password.', 'error'); }} className="grid gap-4 sm:grid-cols-3"><label className="cc-label">Current password<input className="cc-input mt-2" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required /></label><label className="cc-label">New password<input className="cc-input mt-2" type="password" minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required /></label><label className="cc-label">Confirm new password<input className="cc-input mt-2" type="password" minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /></label><div className="sm:col-span-3"><button className="cc-button cc-button--quiet" type="submit">Update password <ArrowUpRight className="h-4 w-4" /></button></div></form></section>}
  </div>;
}
