import { type FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, CircleAlert, LoaderCircle, RotateCcw, Send, UserRound } from 'lucide-react';
import { ApiError, streamRepositoryChat, type EvaluationReport, type RepositoryChatTurn } from '../lib/api';

type ChatMessage = {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
};

type PendingRequest = { query: string; history: RepositoryChatTurn[]; messageId: string };

export function RepositoryChatPanel({ report }: { report: EvaluationReport }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [canRetry, setCanRetry] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const pendingRef = useRef<PendingRequest | null>(null);
  const messagesViewportRef = useRef<HTMLDivElement | null>(null);
  const shouldFollowMessagesRef = useRef(true);

  useEffect(() => {
    const viewport = messagesViewportRef.current;
    if (!viewport || !shouldFollowMessagesRef.current) return;
    const frame = window.requestAnimationFrame(() => {
      viewport.scrollTop = viewport.scrollHeight;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages]);

  const runRequest = async (pending: PendingRequest) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setIsSending(true);
    setError('');
    let receivedFinal = false;
    let receivedError = false;
    const messageId = pending.messageId;
    setMessages((current) => current.some((message) => message.id === messageId)
      ? current
      : [...current, { id: messageId, role: 'ASSISTANT', content: '' }]);
    try {
      await streamRepositoryChat(report.ingestionId, { query: pending.query, history: pending.history }, controller.signal, (event) => {
        if (event.type === 'delta') {
          setMessages((current) => current.map((message) => message.id === messageId
            ? { ...message, content: message.content + event.data.text } : message));
        } else if (event.type === 'final') {
          receivedFinal = true;
          setCanRetry(false);
          setMessages((current) => current.map((message) => message.id === messageId
            ? { ...message, content: event.data.answer } : message));
        } else {
          receivedError = true;
          setCanRetry(true);
          setError(event.data.error);
          setMessages((current) => current.filter((message) => message.id !== messageId));
        }
      });
      if (!receivedFinal && !receivedError && !controller.signal.aborted) {
        setMessages((current) => current.filter((message) => message.id !== messageId));
        setError('The answer stream ended before a final response arrived. Please retry.');
        setCanRetry(true);
      }
    } catch (reason) {
      if (!controller.signal.aborted) {
        setMessages((current) => current.filter((message) => message.id !== messageId));
        setError(reason instanceof ApiError ? reason.message : 'The answer could not be generated. Please retry.');
        setCanRetry(true);
      }
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setIsSending(false);
      }
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = question.trim();
    if (!query || isSending) return;
    const history = messages.slice(-12).map((message) => ({ role: message.role, content: message.content.slice(0, 1500) })) satisfies RepositoryChatTurn[];
    const messageId = crypto.randomUUID();
    const pending = { query, history, messageId };
    pendingRef.current = pending;
    shouldFollowMessagesRef.current = true;
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'USER', content: query }]);
    setQuestion('');
    void runRequest(pending);
  };

  const startNewChat = () => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    pendingRef.current = null;
    shouldFollowMessagesRef.current = true;
    setMessages([]);
    setQuestion('');
    setError('');
    setCanRetry(false);
    setIsSending(false);
  };

  const retry = () => {
    const pending = pendingRef.current;
    if (!pending || isSending) return;
    void runRequest(pending);
  };

  return <section className="print:hidden cc-panel mb-7 overflow-hidden" aria-labelledby="repository-chat-heading">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-rule)] bg-[color:var(--color-source)] px-5 py-4 sm:px-6">
      <div><p className="cc-label uppercase tracking-[0.14em] text-[color:var(--color-instrument)]">Repository Q&amp;A</p><h2 id="repository-chat-heading" className="cc-title mt-1 text-lg">Ask this repository</h2><p className="cc-label mt-1">Scoped to {report.repositoryUrl.replace(/\/$/, '').split('/').slice(-2).join('/')}</p></div>
      <button type="button" onClick={startNewChat} disabled={!messages.length && !error && !question} className="cc-button cc-button--quiet min-h-9 text-xs"><RotateCcw className="h-3.5 w-3.5" /> New chat</button>
    </header>

    <div className="border-b border-[var(--color-rule)] px-5 py-3 text-xs text-[color:var(--color-muted)] sm:px-6">
      Answers are based on repository context retrieved from Cognee and may be limited by the material indexed.
    </div>

    <div
      ref={messagesViewportRef}
      onScroll={(event) => {
        const viewport = event.currentTarget;
        shouldFollowMessagesRef.current = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <= 56;
      }}
      className="min-h-36 max-h-[min(70dvh,42rem)] space-y-4 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6"
      aria-live="polite"
      aria-relevant="additions text"
    >
      {!messages.length && <div className="mx-auto max-w-xl py-4 text-center"><Bot className="mx-auto h-6 w-6 text-[color:var(--color-instrument)]" /><p className="cc-copy mt-3">Ask about the repository’s structure, a class or method, or how a request flows through the code.</p><p className="cc-label mt-2">Answers distinguish retrieved repository details from general recommendations.</p></div>}
      {messages.map((message) => <article key={message.id} className={`flex gap-3 ${message.role === 'USER' ? 'justify-end' : ''}`}>
        {message.role === 'ASSISTANT' && <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-instrument)]/30 bg-[color:var(--color-instrument-soft)] text-[color:var(--color-instrument)]"><Bot className="h-4 w-4" /></span>}
        <div className={`max-w-[min(90%,48rem)] rounded-[var(--radius-control)] border px-4 py-3 ${message.role === 'USER' ? 'border-[var(--color-recruiter)]/30 bg-[color:var(--color-recruiter-soft)]' : 'border-[var(--color-rule)] bg-[color:var(--color-surface)]'}`}>
          <p className="m-0 whitespace-pre-wrap text-sm leading-relaxed text-[color:var(--color-ink)]">{message.content || (isSending ? <><LoaderCircle className="mr-2 inline h-4 w-4 animate-spin" />Searching repository evidence…</> : '')}</p>
        </div>
        {message.role === 'USER' && <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-rule)] bg-[color:var(--color-ground)] text-[color:var(--color-ink-soft)]"><UserRound className="h-4 w-4" /></span>}
      </article>)}
    </div>

    {error && <div role="alert" className="mx-4 mb-3 flex items-start gap-2 rounded-[var(--radius-control)] border border-[var(--color-warning)]/30 bg-[color:var(--color-warning-soft)] p-3 text-xs text-[color:var(--color-ink-soft)] sm:mx-6"><CircleAlert className="h-4 w-4 shrink-0 text-[color:var(--color-warning)]" /><div className="flex-1">{error}{canRetry && <button type="button" onClick={retry} disabled={isSending} className="cc-link ml-2 font-medium">Retry</button>}</div></div>}

    <form onSubmit={submit} className="flex items-end gap-3 border-t border-[var(--color-rule)] bg-[color:var(--color-source)] p-4 sm:px-6">
      <label className="sr-only" htmlFor={`repository-chat-${report.ingestionId}`}>Ask a question about this repository</label>
      <textarea id={`repository-chat-${report.ingestionId}`} value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => {
        if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); }
      }} maxLength={2000} rows={2} disabled={isSending} placeholder="Ask about this repository…" className="cc-input min-h-12 min-w-0 flex-1 resize-y py-3" />
      <button type="submit" disabled={isSending || !question.trim()} className="cc-button cc-button--primary min-h-11 px-4" aria-label="Send question">{isSending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</button>
    </form>
    <p className="cc-label px-5 pb-3 text-[10px] sm:px-6">This conversation stays in this page and is cleared when you leave or refresh.</p>
  </section>;
}
