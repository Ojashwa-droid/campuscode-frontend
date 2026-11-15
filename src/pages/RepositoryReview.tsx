import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check, CircleAlert, Clock3, Download, ExternalLink, FileJson2, LoaderCircle, Network, Printer, RefreshCw, ShieldCheck } from 'lucide-react';
import { ApiError, getGraphVisualization, getIngestion, getReport, getReportGraphContext, streamEvaluation, type EvaluationProgress, type EvaluationReport, type IngestionStatus, type ReportGraphContext } from '../lib/api';
import { ReportGraphExplorer } from '../components/ReportGraphExplorer';
import { RepositoryChatPanel } from '../components/RepositoryChatPanel';
import { SAMPLE_REPORT } from '../lib/sampleReport';

const stages = [
  { key: 'QUEUED', title: 'Queued', detail: 'Waiting for an ingestion worker.' },
  { key: 'INGESTING', title: 'Reading repository', detail: 'Fetching the public repository contents.' },
  { key: 'COGNIFYING', title: 'Indexing code', detail: 'Building a searchable repository memory.' },
  { key: 'COMPLETED', title: 'Repository ready', detail: 'Evidence is ready for engineering evaluation.' },
];

function friendlyDimension(name: string) {
  return name.replaceAll('_', ' ').split('/').map((part) => part.trim()).map((part) => part.replace(/\b\w/g, (letter) => letter.toUpperCase())).join(' / ');
}

function dimensionPercent(score: number) {
  return Math.round(Math.min(5, Math.max(0, score)) * 20);
}

function compactDimension(name: string) {
  const key = name.toLowerCase();
  if (key.includes('architecture')) return 'ARCH';
  if (key.includes('maintain')) return 'MAINT';
  if (key.includes('testing')) return 'TEST';
  if (key.includes('reliability')) return 'RELY';
  if (key.includes('security')) return 'SEC';
  if (key.includes('performance')) return 'SCALE';
  return name.slice(0, 5).toUpperCase();
}

function shortRepo(url: string) {
  return url.replace(/\/+$/, '').split('/').slice(-2).join('/').replace(/\.git$/i, '');
}

function dateText(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? '—' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function ReviewHeader({ eyebrow, title, repositoryUrl }: { eyebrow: string; title: string; repositoryUrl?: string }) {
  return <header className="mb-7 border-b border-[var(--color-rule)] pb-6">
    <Link to="/dashboard" className="cc-link mb-5 inline-flex items-center gap-2 text-xs no-underline"><ArrowLeft className="h-3.5 w-3.5" /> Dashboard</Link>
    <p className="cc-label uppercase tracking-[0.16em] text-[color:var(--color-instrument)]">{eyebrow}</p>
    <h1 className="cc-heading mt-2 text-3xl sm:text-4xl">{title}</h1>
    {repositoryUrl && <a href={repositoryUrl} target="_blank" rel="noreferrer" className="cc-link mt-3 inline-flex max-w-full items-center gap-2 text-xs no-underline"><span className="truncate">{repositoryUrl}</span><ExternalLink className="h-3.5 w-3.5 shrink-0" /></a>}
  </header>;
}

export function IngestionPage() {
  const { ingestionId = '' } = useParams();
  const navigate = useNavigate();
  const [ingestion, setIngestion] = useState<IngestionStatus | null>(null);
  const [loadError, setLoadError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<EvaluationProgress | null>(null);
  const [streamError, setStreamError] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [reportHandoff, setReportHandoff] = useState<'generating' | 'saved' | null>(null);
  const streamingRef = useRef(false);
  const handoffRef = useRef(false);
  const redirectTimer = useRef<number | null>(null);
  const streamController = useRef<AbortController | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    const poll = async () => {
      try {
        const status = await getIngestion(ingestionId);
        if (cancelled) return;
        setIngestion(status);
        setLoadError('');
        setIsLoading(false);
        if (['QUEUED', 'INGESTING', 'COGNIFYING'].includes(status.status)) timer = window.setTimeout(poll, 2500);
      } catch (error) {
        if (cancelled) return;
        setLoadError(error instanceof Error ? error.message : 'Repository status could not be loaded.');
        setIsLoading(false);
      }
    };
    void poll();
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [ingestionId]);

  const runEvaluation = useCallback(async () => {
    if (streamingRef.current || handoffRef.current) return;
    streamingRef.current = true;
    setStreamError('');
    setIsStreaming(true);
    const requestStartedAt = Date.now();
    const controller = new AbortController();
    streamController.current = controller;
    try {
      await streamEvaluation(ingestionId, controller.signal, (event) => {
        if (event.type === 'progress') {
          setProgress(event.data);
          setReportHandoff('generating');
        }
        if (event.type === 'completed') {
          const completedAt = Date.parse(event.data.completedAt);
          const isSavedReport = Number.isFinite(completedAt) && completedAt < requestStartedAt;
          handoffRef.current = true;
          setReportHandoff(isSavedReport ? 'saved' : null);
          const openReport = () => navigate(`/dashboard/ingestions/${ingestionId}/report`, { state: { report: event.data } });
          if (isSavedReport) redirectTimer.current = window.setTimeout(openReport, 1000);
          else openReport();
        }
        if (event.type === 'failed') setStreamError(event.data.error || 'The evaluation failed. You can try again.');
      });
    } catch (error) {
      if (!controller.signal.aborted) setStreamError(error instanceof Error ? error.message : 'Evaluation could not be started.');
    } finally {
      streamingRef.current = false;
      if (streamController.current === controller) streamController.current = null;
      if (!handoffRef.current) {
        setIsStreaming(false);
        setReportHandoff(null);
      }
    }
  }, [ingestionId, navigate]);

  useEffect(() => {
    const startTimer = ingestion?.status === 'COMPLETED'
      ? window.setTimeout(() => void runEvaluation(), 0)
      : null;
    return () => {
      if (startTimer !== null) window.clearTimeout(startTimer);
      streamController.current?.abort();
      if (redirectTimer.current !== null) window.clearTimeout(redirectTimer.current);
    };
  }, [ingestion?.status, runEvaluation]);

  if (isLoading) return <ReviewFrame><div className="cc-panel flex items-center gap-3 p-7 text-sm text-[color:var(--color-ink-soft)]"><LoaderCircle className="h-5 w-5 animate-spin text-[color:var(--color-instrument)]" /> Loading repository status…</div></ReviewFrame>;
  if (loadError || !ingestion) return <ReviewFrame><ReviewHeader eyebrow="Repository review" title="We couldn’t load this review" /><div className="cc-panel p-6"><p className="cc-copy">{loadError || 'The API returned an empty status response.'}</p><Link className="cc-button cc-button--primary mt-5" to="/dashboard">Return to dashboard</Link></div></ReviewFrame>;

  const stepIndex = stages.findIndex((stage) => stage.key === ingestion.status);
  const isIngesting = ['QUEUED', 'INGESTING', 'COGNIFYING'].includes(ingestion.status);
  return <ReviewFrame animate>
    <ReviewHeader eyebrow="Repository review / live status" title={shortRepo(ingestion.repositoryUrl)} repositoryUrl={ingestion.repositoryUrl} />
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
      <section className="cc-panel p-5 sm:p-7">
        <div className="flex items-center justify-between gap-4"><div><p className="cc-label uppercase tracking-[0.14em] text-[color:var(--color-instrument)]">Repository ingestion</p><h2 className="cc-title mt-1 text-xl">{ingestion.status === 'FAILED' ? 'Review could not continue' : isIngesting ? 'Preparing repository' : 'Repository ready'}</h2></div><StatusTag label={ingestion.status} failed={ingestion.status === 'FAILED'} /></div>
        {ingestion.status === 'FAILED' ? <div className="mt-6 rounded-[var(--radius-control)] border border-[var(--color-warning)]/30 bg-[color:var(--color-warning-soft)] p-4 text-sm text-[color:var(--color-ink-soft)]"><CircleAlert className="mb-2 h-5 w-5 text-[color:var(--color-warning)]" />{ingestion.error || 'The repository could not be processed.'}</div> : <ol className="mt-7 space-y-0">{stages.map((stage, index) => {
          const complete = ingestion.status === 'COMPLETED' || index < stepIndex;
          const current = ingestion.status !== 'COMPLETED' && index === stepIndex;
          return <li className="relative flex gap-4 pb-7 last:pb-0" key={stage.key}><span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs ${complete ? 'border-[var(--color-ok)] bg-[color:var(--color-ok-soft)] text-[color:var(--color-ok)]' : current ? 'border-[var(--color-instrument)] bg-[color:var(--color-instrument-soft)] text-[color:var(--color-instrument)]' : 'border-[var(--color-rule-strong)] text-[color:var(--color-muted)]'}`}>{complete ? <Check className="h-4 w-4" /> : String(index + 1).padStart(2, '0')}</span>{index < stages.length - 1 && <span className={`absolute left-4 top-8 h-[calc(100%-2rem)] w-px ${complete ? 'bg-[color:var(--color-ok)]/50' : 'bg-[color:var(--color-rule)]'}`} />}<div className="pt-1"><h3 className={`text-sm font-medium ${current ? 'text-[color:var(--color-ink)]' : 'text-[color:var(--color-ink-soft)]'}`}>{stage.title}</h3><p className="cc-label mt-1">{stage.detail}</p></div></li>;
        })}</ol>}
        <div className="mt-6 border-t border-[var(--color-rule)] pt-4"><p className="cc-label flex items-center gap-2"><Clock3 className="h-3.5 w-3.5" />Submitted {dateText(ingestion.createdAt)}</p></div>
      </section>

      <section className="cc-panel h-fit p-5 sm:p-7">
        <p className="cc-label uppercase tracking-[0.14em] text-[color:var(--color-recruiter)]">Engineering report</p>
        <h2 className="cc-title mt-1 text-xl">{reportHandoff === 'saved' ? 'Saved scorecard found' : progress || reportHandoff === 'generating' ? 'Evaluation in progress' : ingestion.status === 'COMPLETED' && isStreaming ? 'Repository already ingested' : 'Evidence-backed scorecard'}</h2>
        <p className="cc-copy mt-3" role={reportHandoff === 'saved' ? 'status' : undefined} aria-live={reportHandoff === 'saved' ? 'polite' : undefined}>{reportHandoff === 'saved' ? 'Already ingested and evaluated. Opening the saved report…' : ingestion.status === 'COMPLETED' && isStreaming && !progress ? 'Repository is already ingested. Checking whether its scorecard is saved…' : reportHandoff === 'generating' ? 'Repository is ready. CampusCode is generating its scorecard from the available evidence.' : 'Six engineering dimensions, scored from retrieved repository evidence and linked to citations.'}</p>
        {progress && <div className="mt-5 rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-source)] p-4" role="status" aria-live="polite"><div className="flex justify-between gap-3 text-xs"><strong className="font-medium text-[color:var(--color-ink-soft)]">{progress.message}</strong><span className="cc-measured">{progress.progress}%</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[color:var(--color-rule)]"><span className="block h-full rounded-full bg-[color:var(--color-instrument)] transition-all" style={{ width: `${Math.min(100, Math.max(0, progress.progress))}%` }} /></div><p className="cc-label mt-2">{progress.stage.replaceAll('_', ' ')}</p></div>}
        {streamError && <div role="alert" className="mt-5 rounded-[var(--radius-control)] border border-[var(--color-warning)]/30 bg-[color:var(--color-warning-soft)] p-3 text-xs text-[color:var(--color-ink-soft)]">{streamError}</div>}
        {ingestion.status === 'COMPLETED' && reportHandoff !== 'saved' && <button type="button" disabled={isStreaming} onClick={() => void runEvaluation()} className="cc-button cc-button--primary mt-5 w-full">{isStreaming ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Evaluating repository…</> : <><RefreshCw className="h-4 w-4" /> {streamError ? 'Retry / reconnect' : 'Start evaluation'}</>}</button>}
        {ingestion.status === 'COMPLETED' && <Link to={`/dashboard/ingestions/${ingestionId}/graph`} className="cc-button cc-button--quiet mt-3 w-full"><Network className="h-4 w-4" /> Explore knowledge graph</Link>}
        {isIngesting && <p className="cc-label mt-5 flex items-center gap-2"><LoaderCircle className="h-3.5 w-3.5 animate-spin" />This page updates automatically while the repository is processed.</p>}
        <p className="cc-label mt-5 border-t border-[var(--color-rule)] pt-4">A score is evidence for human review, not a hiring recommendation.</p>
      </section>
    </div>
  </ReviewFrame>;
}

export function GraphVisualizationPage() {
  const { ingestionId = '' } = useParams();
  const [ingestion, setIngestion] = useState<IngestionStatus | null>(null);
  const [visualizationUrl, setVisualizationUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let objectUrl = '';
    const controller = new AbortController();

    const load = async () => {
      try {
        const status = await getIngestion(ingestionId);
        if (cancelled) return;
        setIngestion(status);
        if (status.status !== 'COMPLETED') {
          throw new ApiError('The repository graph is available after ingestion completes.', 409);
        }

        const html = await getGraphVisualization(status.repositoryUrl, controller.signal);
        const nextUrl = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
        if (cancelled) URL.revokeObjectURL(nextUrl);
        else {
          objectUrl = nextUrl;
          setVisualizationUrl(nextUrl);
        }
      } catch (reason) {
        if (!cancelled && !(reason instanceof DOMException && reason.name === 'AbortError')) {
          setError(reason instanceof Error ? reason.message : 'The repository graph could not be loaded.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [ingestionId]);

  return <ReviewFrame wide>
    <ReviewHeader eyebrow="Repository review / knowledge graph" title={ingestion ? shortRepo(ingestion.repositoryUrl) : 'Repository knowledge graph'} repositoryUrl={ingestion?.repositoryUrl} />
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <Link to={`/dashboard/ingestions/${ingestionId}`} className="cc-link inline-flex items-center gap-2 text-xs no-underline"><ArrowLeft className="h-3.5 w-3.5" /> Back to review progress</Link>
      <p className="cc-label">Cognee visualization · served by CampusCode · isolated iframe</p>
    </div>
    {loading ? <div className="cc-panel flex min-h-72 items-center justify-center gap-3 text-sm text-[color:var(--color-ink-soft)]"><LoaderCircle className="h-5 w-5 animate-spin text-[color:var(--color-instrument)]" /> Loading repository graph…</div>
      : error ? <div className="cc-panel border border-[var(--color-warning)]/30 p-6" role="alert"><CircleAlert className="mb-3 h-5 w-5 text-[color:var(--color-warning)]" /><h2 className="cc-title text-lg">Graph visualization unavailable</h2><p className="cc-copy mt-2">{error}</p></div>
        : <section className="overflow-hidden rounded-[var(--radius-surface)] border border-[var(--color-rule)] bg-white">
          <iframe title={`Knowledge graph for ${ingestion?.repositoryUrl ?? 'repository'}`} src={visualizationUrl} sandbox="allow-scripts" referrerPolicy="no-referrer" className="block h-[min(78vh,900px)] min-h-[620px] w-full border-0" />
        </section>}
  </ReviewFrame>;
}

export function ReportPage({ demo = false }: { demo?: boolean } = {}) {
  const { ingestionId = '' } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigationReport = demo ? null : reportFromNavigationState(location.state, ingestionId);
  const activeReportTab = !demo && searchParams.get('tab') === 'chat' ? 'chat' : 'scorecard';
  const [report, setReport] = useState<EvaluationReport | null>(demo ? SAMPLE_REPORT : navigationReport);
  const [reportGraph, setReportGraph] = useState<ReportGraphContext | null>(null);
  const [graphLoading, setGraphLoading] = useState(!demo);
  const [graphError, setGraphError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!demo && !navigationReport);
  const loadReportGraph = useCallback(() => {
    if (demo || !ingestionId) return;
    setGraphLoading(true);
    setGraphError('');
    void getReportGraphContext(ingestionId).then(setReportGraph).catch((reason: unknown) => {
      setGraphError(reason instanceof Error ? reason.message : 'The report graph could not be loaded.');
    }).finally(() => setGraphLoading(false));
  }, [demo, ingestionId]);
  useEffect(() => {
    if (demo) return;
    let cancelled = false;
    const loadTimer = window.setTimeout(() => {
      if (navigationReport) {
        setReport(navigationReport);
        setError('');
        setLoading(false);
      } else {
        setReport(null);
        setLoading(true);
        void getReport(ingestionId).then((value) => { if (!cancelled) setReport(value); }).catch((reason: unknown) => {
          if (cancelled) return;
          const notReady = reason instanceof ApiError && (reason.status === 400 || reason.status === 409);
          setError(notReady ? 'The scorecard will appear here when evaluation is complete.' : reason instanceof Error ? reason.message : 'The saved report could not be loaded.');
        }).finally(() => { if (!cancelled) setLoading(false); });
      }
      setReportGraph(null);
      setGraphLoading(true);
      loadReportGraph();
    }, 0);
    return () => { cancelled = true; window.clearTimeout(loadTimer); };
  }, [demo, ingestionId, loadReportGraph, navigationReport]);

  const downloadJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${shortRepo(report.repositoryUrl).replaceAll('/', '-')}-scorecard.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const selectReportTab = (tab: 'scorecard' | 'chat') => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (tab === 'chat') next.set('tab', 'chat');
      else next.delete('tab');
      return next;
    }, { state: location.state, preventScrollReset: true });
  };

  const handleReportTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const nextTab = event.key === 'ArrowRight'
      ? (activeReportTab === 'scorecard' ? 'chat' : 'scorecard')
      : (activeReportTab === 'chat' ? 'scorecard' : 'chat');
    selectReportTab(nextTab);
    requestAnimationFrame(() => document.getElementById(`report-tab-${nextTab}`)?.focus());
  };

  if (loading) return <ReviewFrame><div className="cc-panel flex items-center gap-3 p-7 text-sm text-[color:var(--color-ink-soft)]"><LoaderCircle className="h-5 w-5 animate-spin text-[color:var(--color-instrument)]" /> Loading saved report…</div></ReviewFrame>;
  if (!report) return <ReviewFrame><ReviewHeader eyebrow="Repository review / scorecard" title="Report not ready yet" /><div className="cc-panel p-6"><p className="cc-copy">{error}</p><Link to={`/dashboard/ingestions/${ingestionId}`} className="cc-button cc-button--primary mt-5">Return to review progress <ArrowUpRight className="h-4 w-4" /></Link></div></ReviewFrame>;

  const dimensions = [...report.dimensions].sort((a, b) => a.dimension.localeCompare(b.dimension));
  const chartItems = dimensions.map((d) => ({ label: friendlyDimension(d.dimension), short: compactDimension(d.dimension), value: dimensionPercent(d.score) }));
  const citationItems = dimensions.map((d) => ({ label: friendlyDimension(d.dimension), short: compactDimension(d.dimension), value: d.citations.length }));
  const totalCitations = citationItems.reduce((sum, item) => sum + item.value, 0);
  const coveragePct = dimensions.length ? Math.round((dimensions.filter((d) => d.citations.length > 0).length / dimensions.length) * 100) : 0;
  const ranked = [...dimensions].sort((a, b) => b.score - a.score);
  const strongest = ranked[0];
  const weakest = ranked[ranked.length - 1];
  return <ReviewFrame fullPage={!demo} wide animate={Boolean(navigationReport)}>
    {!demo && <div className="print-only report-print-meta"><span>CampusCode · Evidence-based engineering profile</span><span>Completed {dateText(report.completedAt)}</span></div>}
    {demo && <div className="mb-5 flex flex-wrap items-center gap-2 rounded-[var(--radius-control)] border border-[var(--color-recruiter)]/30 bg-[color:var(--color-recruiter-soft)]/50 px-4 py-3 text-xs text-[color:var(--color-recruiter)]"><FileJson2 className="h-4 w-4 shrink-0" /><strong className="font-medium">Sample preview</strong><span className="text-[color:var(--color-ink-soft)]">Illustrative JSON only · not generated from a real repository</span></div>}
    <div className="report-print-title flex flex-wrap items-start justify-between gap-4"><div className="min-w-0 flex-1"><ReviewHeader eyebrow={demo ? 'DEMO REPORT / SAMPLE JSON OUTPUT' : 'Repository review / completed report'} title={demo ? 'Sample engineering scorecard' : 'Engineering scorecard'} repositoryUrl={report.repositoryUrl} /></div><div className="flex flex-wrap gap-2 print:hidden">{!demo && <Link to={`/dashboard/ingestions/${report.ingestionId}/graph`} className="cc-button cc-button--quiet min-h-10 text-xs"><Network className="h-4 w-4" /> Knowledge graph</Link>}<button type="button" onClick={downloadJson} className="cc-button cc-button--quiet min-h-10 text-xs"><Download className="h-4 w-4" /><span className="hidden sm:inline">Download JSON</span><FileJson2 className="h-4 w-4 sm:hidden" /></button><button type="button" onClick={() => window.print()} className="cc-button cc-button--quiet min-h-10 px-3" aria-label="Print report"><Printer className="h-4 w-4" /></button></div></div>

    <p className="cc-copy report-print-summary mb-5 max-w-3xl">{report.summary}</p>

    {!demo && <div className="report-tab-nav mb-6 border-b border-[var(--color-rule)]" role="tablist" aria-label="Report views">
      <button type="button" id="report-tab-scorecard" role="tab" aria-selected={activeReportTab === 'scorecard'} aria-controls="report-panel-scorecard" tabIndex={activeReportTab === 'scorecard' ? 0 : -1} onClick={() => selectReportTab('scorecard')} onKeyDown={handleReportTabKeyDown} className={`mr-6 border-b-2 px-1 pb-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-instrument)] ${activeReportTab === 'scorecard' ? 'border-[var(--color-instrument)] text-[color:var(--color-instrument)]' : 'border-transparent text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]'}`}>Scorecard</button>
      <button type="button" id="report-tab-chat" role="tab" aria-selected={activeReportTab === 'chat'} aria-controls="report-panel-chat" tabIndex={activeReportTab === 'chat' ? 0 : -1} onClick={() => selectReportTab('chat')} onKeyDown={handleReportTabKeyDown} className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-instrument)] ${activeReportTab === 'chat' ? 'border-[var(--color-instrument)] text-[color:var(--color-instrument)]' : 'border-transparent text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]'}`}>Repository chat</button>
    </div>}

    {!demo && <div id="report-panel-chat" role="tabpanel" aria-labelledby="report-tab-chat" hidden={activeReportTab !== 'chat'}>
      <RepositoryChatPanel key={report.ingestionId} report={report} />
    </div>}

    <div id="report-panel-scorecard" role={demo ? undefined : 'tabpanel'} aria-labelledby={demo ? undefined : 'report-tab-scorecard'} hidden={!demo && activeReportTab !== 'scorecard'} className="report-scorecard-tab">
    {!demo && <section className="print-only report-print-overview" aria-label="Score overview"><h2>Score overview</h2><div className="report-print-overall"><strong>{report.overallScore}<small> / 100</small></strong><span>Overall score</span></div><table><thead><tr><th>Dimension</th><th>Score</th><th>Evidence summary</th></tr></thead><tbody>{dimensions.map((dimension) => <tr key={dimension.dimension}><th scope="row">{friendlyDimension(dimension.dimension)}</th><td>{dimension.score} / 5</td><td>{dimension.citations.length ? `${dimension.citations.length} repository reference${dimension.citations.length === 1 ? '' : 's'}` : 'Insufficient verifiable evidence'}</td></tr>)}</tbody></table></section>}

    <div className="report-screen-analytics mb-5 grid gap-4 xl:grid-cols-[12rem_minmax(0,1fr)_12rem]">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-1 xl:content-start">
        <KpiCard tone="sage" label="Dimensions scored" value={String(dimensions.length)} sub="Engineering signals" />
        <KpiCard tone="sage" label="Repository references" value={String(totalCitations)} sub={report.citationMode === 'GRAPH_METADATA' ? 'Cognee graph symbols' : 'Source citations'} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DashPanel tone="amber" title="Overall score"><div className="flex justify-center"><ScoreDonut value={report.overallScore} size={140} label="Overall" /></div></DashPanel>
        <DashPanel tone="amber" title="Evidence coverage"><div className="flex justify-center"><ScoreDonut value={coveragePct} size={140} label="Cited" /></div></DashPanel>
        <DashPanel tone="coral" title="Score by dimension"><HBarChart items={chartItems} /></DashPanel>
        <DashPanel tone="amber" title="Dimension scores (%)" className="md:col-span-2"><VBarChart items={chartItems} max={100} tone="amber" unit="%" /></DashPanel>
        <DashPanel tone="coral" title="Dimension radar"><RadarChart dimensions={report.dimensions} /></DashPanel>
        <DashPanel tone="blue" title="Citations per dimension" className="md:col-span-3"><VBarChart items={citationItems} max={Math.max(1, ...citationItems.map((item) => item.value))} tone="blue" /></DashPanel>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-1 xl:content-start">
        <KpiCard tone="sage" label="Strongest" value={friendlyDimension(strongest.dimension)} sub={`${dimensionPercent(strongest.score)}% of rubric`} compact />
        <KpiCard tone="sage" label="Weakest" value={friendlyDimension(weakest.dimension)} sub={`${dimensionPercent(weakest.score)}% of rubric`} compact />
        <KpiCard tone="sage" label="Completed" value={dateText(report.completedAt)} sub="Evaluation finished" compact />
      </div>
    </div>

    <div className="mb-5 flex items-start gap-3 rounded-[var(--radius-control)] border border-[var(--color-instrument)]/20 bg-[color:var(--color-instrument-soft)]/40 p-4"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-instrument)]" /><p className="cc-copy text-xs">Scores reflect evidence available in this repository. A low or zero score may mean evidence was not found; it is not a measure of a person’s overall ability or a hiring recommendation. Review the citations against the source.</p></div>

    <section aria-labelledby="dimensions-heading" className="mb-5"><div className="mb-4"><p className="cc-label uppercase tracking-[0.14em] text-[color:var(--color-instrument)]">Score breakdown</p><h2 id="dimensions-heading" className="cc-title mt-1 text-xl">Dimension evidence</h2></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{dimensions.map((dimension, index) => {
      const key = dimension.dimension.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
      const percent = dimensionPercent(dimension.score);
      const noEvidence = dimension.score === 0 && dimension.citations.length === 0;
      return <DashPanel key={dimension.dimension} id={`dimension-${key}`} tone={dimensionTones[index % dimensionTones.length]} title={friendlyDimension(dimension.dimension)} className="report-print-dimension scroll-mt-6">
        <div className="flex flex-col items-center gap-3 text-center"><ScoreDonut value={percent} size={110} label="" />{noEvidence && <p className="m-0 inline-flex items-center gap-2 text-xs text-[color:var(--color-recruiter)]"><CircleAlert className="h-4 w-4" />Insufficient verifiable evidence</p>}<p className="cc-copy text-left">{dimension.rationale}</p>
          {dimension.strengths?.length ? <div className="w-full text-left"><h4 className="cc-label font-semibold text-[color:var(--color-ok)]">Strengths</h4><ul className="cc-copy mt-2 list-disc space-y-1 pl-5">{dimension.strengths.map((point, i) => <li key={`${point.evidenceIds.join('-')}-${i}`}>{point.text}</li>)}</ul></div> : null}
          {dimension.areasForImprovement?.length ? <div className="w-full text-left"><h4 className="cc-label font-semibold text-[color:var(--color-recruiter)]">Areas for improvement</h4><ul className="cc-copy mt-2 list-disc space-y-1 pl-5">{dimension.areasForImprovement.map((point, i) => <li key={`${point.evidenceIds.join('-')}-${i}`}>{point.text}</li>)}</ul></div> : null}
          {dimension.citations.length > 0 && <a href={`#citations-${key}`} className="cc-link text-xs">{dimension.citations.length} {dimension.citations.length === 1 ? 'citation' : 'citations'} ↓</a>}</div>
      </DashPanel>;
    })}</div></section>

    {!demo && <section aria-labelledby="repository-graph-heading" className="report-print-graph my-8"><div className="mb-4"><p className="cc-label uppercase tracking-[0.14em] text-[color:var(--color-instrument)]">Repository structure</p><h2 id="repository-graph-heading" className="cc-title mt-1 text-xl">Knowledge graph</h2><p className="cc-copy mt-2">Explore the nodes and relationships included in this scorecard.</p></div>{graphLoading ? <div className="cc-panel print:hidden flex min-h-72 items-center justify-center gap-3 text-sm text-[color:var(--color-ink-soft)]"><LoaderCircle className="h-5 w-5 animate-spin text-[color:var(--color-instrument)]" /> Loading report graph…</div> : graphError ? <div role="alert" className="cc-panel border border-[var(--color-warning)]/30 p-5"><CircleAlert className="mb-2 h-5 w-5 text-[color:var(--color-warning)]" /><p className="cc-copy">{graphError}</p><button type="button" onClick={loadReportGraph} className="cc-link print:hidden mt-3 text-sm">Try again</button></div> : reportGraph ? <ReportGraphExplorer graph={reportGraph} /> : null}{!reportGraph && <p className="print-only">{graphLoading ? 'The graph overview was still loading when this report was printed.' : 'A report-scoped graph overview is unavailable for this report.'}</p>}</section>}

    <section aria-labelledby="citations-heading"><div className="mb-4"><p className="cc-label uppercase tracking-[0.14em] text-[color:var(--color-recruiter)]">Sources</p><h2 id="citations-heading" className="cc-title mt-1 text-xl">Repository references</h2><p className="cc-copy mt-2 text-xs">Source excerpts are line-verified. Graph references identify symbols from Cognee metadata; source contents and optional graph lines were not verified.</p></div>{report.citationMode === 'GRAPH_METADATA' && <p className="mb-4 rounded-[var(--radius-control)] border border-[var(--color-instrument)]/30 bg-[color:var(--color-source)] p-3 text-xs text-[color:var(--color-ink-soft)]">Graph-only report: linked symbol names and paths come from Cognee’s graph and are not verified source excerpts. Structural metadata cannot establish security, reliability, performance, correctness, or a person’s overall ability.</p>}<div className="grid gap-4 lg:grid-cols-2">{dimensions.map((dimension, index) => {
      const key = dimension.dimension.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
      return <DashPanel key={dimension.dimension} id={`citations-${key}`} tone={dimensionTones[index % dimensionTones.length]} title={`${friendlyDimension(dimension.dimension)} · ${dimension.citations.length}`} className="report-print-citation-group scroll-mt-6">
        {dimension.citations.length ? <div className="space-y-2">{dimension.citations.map((citation, citationIndex) => {
          const graphReference = citation.referenceType === 'COGNEE_GRAPH_METADATA';
          const link = graphReference ? githubCitationUrl(report.repositoryUrl, report.defaultBranch, citation.filePath, citation.startLine) : null;
          const label = graphReference ? citation.symbolName || citation.filePath : citation.filePath;
          return <details key={`${citation.evidenceId}-${citationIndex}`} className="group overflow-hidden rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[color:var(--color-source)]"><summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 px-3 py-3 text-xs"><span className="min-w-0 flex-1 truncate font-medium text-[color:var(--color-instrument)]" title={citation.filePath}>{link ? <a href={link} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="hover:underline">{label}<ExternalLink className="ml-1 inline h-3 w-3" /></a> : label}</span><span className="cc-measured shrink-0 text-[color:var(--color-muted)]">{graphReference ? 'Cognee graph reference' : citation.startLine && citation.endLine ? `L${citation.startLine}–${citation.endLine}` : 'Source excerpt'}</span></summary><div className="border-t border-[var(--color-rule)] px-3 py-3">{graphReference ? <><p className="cc-label">{citation.symbolType || 'Code symbol'} · {citation.filePath}</p><p className="cc-copy mt-2 text-xs">Cognee graph metadata reference. This identifies a symbol and its graph path; it is not a verified source excerpt.{citation.startLine ? ` Optional graph line metadata: ${citation.startLine} (not source-verified).` : ''}{!report.defaultBranch ? ' GitHub default branch metadata was unavailable, so no file link is shown.' : ''}</p></> : <pre className="m-0 overflow-x-auto whitespace-pre-wrap break-words text-xs leading-6 text-[color:var(--color-ink-soft)]"><code>{citation.excerpt ?? ''}</code></pre>}</div></details>;
        })}</div> : <p className="cc-label">No repository reference was returned for this dimension.</p>}
      </DashPanel>;
    })}</div></section>
    </div>
  </ReviewFrame>;
}

function githubCitationUrl(repositoryUrl: string, defaultBranch: string | null | undefined, filePath: string, line?: number | null) {
  if (!defaultBranch || !filePath) return null;
  try {
    const repository = new URL(repositoryUrl);
    if (repository.hostname.toLowerCase() !== 'github.com') return null;
    const segments = repository.pathname.split('/').filter(Boolean);
    if (segments.length < 2) return null;
    const owner = segments[0];
    const repo = segments[1].replace(/\.git$/i, '');
    const pathParts = filePath.replaceAll('\\', '/').split('/').filter(Boolean);
    if (pathParts.some((part) => part === '.' || part === '..')) return null;
    const safePath = pathParts.map(encodeURIComponent).join('/');
    const branch = defaultBranch.split('/').map(encodeURIComponent).join('/');
    return `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/blob/${branch}/${safePath}${line && line > 0 ? `#L${line}` : ''}`;
  } catch {
    return null;
  }
}

type Tone = 'amber' | 'coral' | 'blue' | 'sage';
const dimensionTones: Tone[] = ['amber', 'coral', 'blue', 'sage'];
const toneStyles: Record<Tone, { bar: string; fill: string; text: string }> = {
  amber: { bar: 'bg-[color:var(--color-recruiter)] text-[color:var(--color-recruiter-ink)]', fill: 'var(--color-recruiter)', text: 'text-[color:var(--color-recruiter)]' },
  coral: { bar: 'bg-[color:var(--color-warning)] text-[color:var(--color-recruiter-ink)]', fill: 'var(--color-warning)', text: 'text-[color:var(--color-warning)]' },
  blue: { bar: 'bg-[color:var(--color-instrument)] text-[color:var(--color-recruiter-ink)]', fill: 'var(--color-instrument)', text: 'text-[color:var(--color-instrument)]' },
  sage: { bar: 'bg-[color:var(--color-ok)] text-[color:var(--color-recruiter-ink)]', fill: 'var(--color-ok)', text: 'text-[color:var(--color-ok)]' },
};

function DashPanel({ title, tone, children, className = '', id }: { title: string; tone: Tone; children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`overflow-hidden rounded-[var(--radius-surface)] border border-[var(--color-rule)] bg-[color:var(--color-surface)] ${className}`}><h3 className={`m-0 px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.08em] ${toneStyles[tone].bar}`}>{title}</h3><div className="p-4">{children}</div></section>;
}

function KpiCard({ label, value, sub, tone, compact = false }: { label: string; value: string; sub: string; tone: Tone; compact?: boolean }) {
  return <section className="overflow-hidden rounded-[var(--radius-surface)] border border-[var(--color-rule)] bg-[color:var(--color-surface)]"><h3 className={`m-0 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.08em] ${toneStyles[tone].bar}`}>{label}</h3><div className="px-3 py-4 text-center"><p className={`cc-measured m-0 font-semibold ${compact ? 'text-sm leading-5' : 'text-3xl'}`}>{value}</p><p className="cc-label mt-1">{sub}</p></div></section>;
}

type ChartItem = { label: string; short: string; value: number };

function HBarChart({ items }: { items: ChartItem[] }) {
  return <div className="space-y-3" role="img" aria-label={`Scores: ${items.map((i) => `${i.label} ${i.value} percent`).join(', ')}`}>{items.map((item) => <div key={item.label} className="grid grid-cols-[4.5rem_minmax(0,1fr)_2.25rem] items-center gap-2 text-xs"><span className="truncate text-[color:var(--color-ink-soft)]" title={item.label}>{item.short}</span><span className="h-3 overflow-hidden rounded-sm bg-[color:var(--color-rule)]"><span className="block h-full rounded-sm bg-[color:var(--color-warning)]" style={{ width: `${item.value}%` }} /></span><span className="cc-measured text-right">{item.value}</span></div>)}<div className="flex justify-between pl-[4.75rem] pr-9 text-[10px] text-[color:var(--color-muted)]"><span>0</span><span>50</span><span>100</span></div></div>;
}

function VBarChart({ items, max, tone, unit = '' }: { items: ChartItem[]; max: number; tone: Tone; unit?: string }) {
  return <div className="flex h-48 items-end gap-3" role="img" aria-label={`Bar chart: ${items.map((i) => `${i.label} ${i.value}${unit}`).join(', ')}`}>{items.map((item) => <div key={item.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1"><span className="cc-measured text-[11px]">{item.value}{unit}</span><span className="w-full max-w-10 rounded-t-sm" style={{ height: `${Math.max(2, (item.value / max) * 100)}%`, background: toneStyles[tone].fill }} /><span className="mt-1 text-[10px] text-[color:var(--color-muted)]">{item.short}</span></div>)}</div>;
}

function ScoreDonut({ value, size, label }: { value: number; size: number; label: string }) {
  const safeValue = Math.min(100, Math.max(0, value));
  const center = size / 2;
  const radius = size * 0.39;
  const stroke = Math.max(4, size * 0.085);
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - safeValue / 100);
  const large = size >= 120;
  return <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${label || 'Dimension score'} ${safeValue}%`}>
    <svg className="h-full w-full overflow-visible" viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--color-rule)" strokeWidth={stroke} />
      <circle cx={center} cy={center} r={radius - stroke * 0.72} fill="none" stroke="rgba(226,184,78,0.16)" strokeWidth="1" />
      <circle cx={center} cy={center} r={radius} fill="none" stroke="#E2B84E" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} transform={`rotate(-90 ${center} ${center})`} className="score-ring-progress" />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center"><span className={`cc-measured font-semibold tracking-tight text-[#F4D47A] ${large ? 'text-3xl' : 'text-sm'}`}>{safeValue}<span className={large ? 'text-lg' : 'text-[10px]'}>%</span></span>{label && <span className={`cc-label text-center ${large ? 'mt-1 text-[9px] uppercase tracking-[0.1em]' : 'sr-only'}`}>{label}</span>}</div>
  </div>;
}

function RadarChart({ dimensions }: { dimensions: EvaluationReport['dimensions'] }) {
  const center = 120;
  const radius = 72;
  const axisPoint = (index: number, factor: number) => {
    const angle = -Math.PI / 2 + index * (2 * Math.PI / 6);
    return [center + Math.cos(angle) * radius * factor, center + Math.sin(angle) * radius * factor] as const;
  };
  const dataPoints = dimensions.map((item, index) => axisPoint(index, dimensionPercent(item.score) / 100));
  const polygonPoints = dataPoints.map(([x, y]) => `${x},${y}`).join(' ');
  return <div className="rounded-2xl border border-[var(--color-rule)] bg-[color:var(--color-ground)]/45 p-3"><div className="mb-1 flex items-center justify-between px-2"><span className="cc-label uppercase tracking-[0.12em]">Dimension radar</span><span className="h-2 w-2 rounded-full bg-[color:var(--color-ok)] shadow-[0_0_10px_var(--color-ok)]" /></div><svg viewBox="0 0 240 240" role="img" aria-label={`Dimension score radar: ${dimensions.map((item) => `${friendlyDimension(item.dimension)} ${dimensionPercent(item.score)} percent`).join(', ')}`} className="mx-auto block w-full max-w-[250px] overflow-visible"><defs><linearGradient id="report-radar-fill" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="var(--color-instrument)" stopOpacity=".32" /><stop offset="100%" stopColor="var(--color-ok)" stopOpacity=".13" /></linearGradient><filter id="report-radar-glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>{[0.25, 0.5, 0.75, 1].map((scale) => <polygon key={scale} points={dimensions.map((_, index) => { const [x, y] = axisPoint(index, scale); return `${x},${y}`; }).join(' ')} fill="none" stroke="var(--color-rule-strong)" strokeOpacity={scale === 1 ? '.65' : '.35'} strokeDasharray={scale === 1 ? undefined : '2 4'} />)}{dimensions.map((item, index) => { const [x, y] = axisPoint(index, 1); return <g key={item.dimension}><line x1={center} y1={center} x2={x} y2={y} stroke="var(--color-rule-strong)" strokeOpacity=".48" /><text x={center + Math.cos(-Math.PI / 2 + index * Math.PI / 3) * 103} y={center + Math.sin(-Math.PI / 2 + index * Math.PI / 3) * 103} fill="var(--color-muted)" fontSize="8" fontFamily="var(--font-product)" textAnchor="middle" dominantBaseline="middle">{compactDimension(item.dimension)}</text></g>; })}<polygon points={polygonPoints} fill="url(#report-radar-fill)" stroke="var(--color-instrument)" strokeWidth="1.8" filter="url(#report-radar-glow)" />{dataPoints.map(([x, y], index) => <circle key={dimensions[index].dimension} cx={x} cy={y} r="3.4" fill="var(--color-ok)" stroke="var(--color-source)" strokeWidth="1.5" />)}</svg><p className="cc-label text-center">0–100% · normalized from the API’s 0–5 scores</p></div>;
}

function StatusTag({ label, failed = false }: { label: string; failed?: boolean }) {
  const text = ({ QUEUED: 'Queued', INGESTING: 'Ingesting', COGNIFYING: 'Indexing', COMPLETED: 'Ready', FAILED: 'Failed' } as Record<string, string>)[label] ?? label;
  return <span className={`rounded-full border px-3 py-1 text-[11px] ${failed ? 'border-[var(--color-warning)]/40 text-[color:var(--color-warning)]' : label === 'COMPLETED' ? 'border-[var(--color-ok)]/40 text-[color:var(--color-ok)]' : 'border-[var(--color-instrument)]/35 text-[color:var(--color-instrument)]'}`}>{text}</span>;
}

function reportFromNavigationState(state: unknown, ingestionId: string): EvaluationReport | null {
  if (!state || typeof state !== 'object' || !('report' in state)) return null;
  const report = (state as { report?: unknown }).report;
  if (!report || typeof report !== 'object') return null;
  const candidate = report as Partial<EvaluationReport>;
  return candidate.ingestionId === ingestionId && typeof candidate.id === 'string'
    && typeof candidate.repositoryUrl === 'string' && typeof candidate.overallScore === 'number'
    && typeof candidate.summary === 'string' && Array.isArray(candidate.dimensions)
    && typeof candidate.completedAt === 'string' ? candidate as EvaluationReport : null;
}

function ReviewFrame({ children, fullPage = true, wide = false, animate = false }: { children: React.ReactNode; fullPage?: boolean; wide?: boolean; animate?: boolean }) {
  return fullPage
    ? <div className={`cc-shell min-h-screen bg-[color:var(--color-ground)]${animate ? ' animate-fadeIn' : ''}`}><div className={`mx-auto w-full ${wide ? 'max-w-7xl' : 'max-w-5xl'} px-5 py-7 sm:px-8 sm:py-10`}>{children}</div></div>
    : <div className={`mx-auto w-full ${wide ? 'max-w-7xl' : 'max-w-5xl'} space-y-5`}>{children}</div>;
}
