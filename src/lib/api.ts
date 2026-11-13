export type IngestionState = 'QUEUED' | 'INGESTING' | 'COGNIFYING' | 'COMPLETED' | 'FAILED';
export type EvaluationState = 'QUEUED' | 'EVALUATING' | 'COMPLETED' | 'FAILED';

export interface IngestionStatus {
  id: string;
  repositoryUrl: string;
  datasetName: string;
  status: IngestionState;
  createdAt: string;
  updatedAt: string;
  error: string | null;
}

export interface EvaluationProgress {
  evaluationId: string;
  ingestionId: string;
  status: EvaluationState;
  stage: string;
  progress: number;
  message: string;
  updatedAt: string;
}

export interface EvaluationStatus {
  id: string;
  ingestionId: string;
  repositoryUrl: string;
  status: EvaluationState;
  createdAt: string;
  updatedAt: string;
  error: string | null;
}

export interface Citation {
  evidenceId: string;
  filePath: string;
  startLine: number;
  endLine: number;
  excerpt: string;
}

export interface DimensionScore {
  dimension: string;
  score: number;
  rationale: string;
  citations: Citation[];
}

export interface EvaluationReport {
  id: string;
  ingestionId: string;
  repositoryUrl: string;
  overallScore: number;
  summary: string;
  dimensions: DimensionScore[];
  createdAt: string;
  completedAt: string;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: { Accept: 'application/json', ...init?.headers },
    });
  } catch {
    throw new ApiError('CampusCode API could not be reached. Check that the backend is running on port 8080.', 0);
  }
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { error?: string; detail?: string };
      message = body.detail ? `${body.error ?? message}: ${body.detail}` : body.error ?? message;
    } catch {
      // Retain the status message when the server does not return JSON.
    }
    throw new ApiError(message, response.status);
  }
  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError('CampusCode API returned an unreadable response.', response.status);
  }
}

export function createIngestion(input: { repositoryUrl: string; notificationEmail?: string }) {
  return request<IngestionStatus>('/api/repositories/ingestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export function getIngestion(id: string) {
  return request<IngestionStatus>(`/api/repositories/ingestions/${encodeURIComponent(id)}`);
}

export async function getGraphVisualization(repositoryUrl: string, signal?: AbortSignal): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`/api/repositories/graph/visualization?repositoryUrl=${encodeURIComponent(repositoryUrl)}`, {
      headers: { Accept: 'text/html' },
      signal,
    });
  } catch {
    if (signal?.aborted) throw new DOMException('Graph request cancelled.', 'AbortError');
    throw new ApiError('CampusCode API could not be reached. Check that the backend is running on port 8080.', 0);
  }
  if (!response.ok) {
    let message = `Graph visualization could not be loaded (${response.status})`;
    try {
      const body = (await response.json()) as { error?: string; detail?: string; message?: string };
      message = body.detail ?? body.error ?? body.message ?? message;
    } catch {
      // Retain the status-based message when the backend response is not JSON.
    }
    throw new ApiError(message, response.status);
  }
  if (!response.headers.get('content-type')?.includes('text/html')) {
    throw new ApiError('CampusCode API returned an unexpected graph response.', response.status);
  }
  return response.text();
}

export function getReport(ingestionId: string) {
  return request<EvaluationReport>(`/api/repositories/ingestions/${encodeURIComponent(ingestionId)}/report`);
}

export type EvaluationStreamEvent =
  | { type: 'progress'; data: EvaluationProgress }
  | { type: 'completed'; data: EvaluationReport }
  | { type: 'failed'; data: EvaluationStatus };

export async function streamEvaluation(
  ingestionId: string,
  signal: AbortSignal,
  onEvent: (event: EvaluationStreamEvent) => void,
) {
  let response: Response;
  try {
    response = await fetch(`/api/repositories/ingestions/${encodeURIComponent(ingestionId)}/evaluations/stream`, {
      method: 'POST',
      headers: { Accept: 'text/event-stream' },
      signal,
    });
  } catch {
    if (signal.aborted) return;
    throw new ApiError('The evaluation stream could not reach the CampusCode API.', 0);
  }
  if (!response.ok) {
    let message = `Evaluation could not start (${response.status})`;
    try {
      const body = (await response.json()) as { error?: string; detail?: string };
      message = body.detail ? `${body.error ?? message}: ${body.detail}` : body.error ?? message;
    } catch {
      // Keep the status-based message.
    }
    throw new ApiError(message, response.status);
  }
  if (!response.body) throw new ApiError('This browser could not open the evaluation stream.', 0);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let terminal = false;
  const dispatch = () => {
    const frames = buffer.split(/\r?\n\r?\n/);
    buffer = frames.pop() ?? '';
    for (const frame of frames) {
      let type = '';
      const data: string[] = [];
      for (const line of frame.split(/\r?\n/)) {
        if (line.startsWith('event:')) type = line.slice(6).trim();
        if (line.startsWith('data:')) data.push(line.slice(5).trimStart());
      }
      if (!data.length || !['progress', 'completed', 'failed'].includes(type)) continue;
      let parsed: unknown;
      try {
        parsed = JSON.parse(data.join('\n'));
      } catch {
        throw new ApiError('The evaluation stream returned invalid JSON.', 0);
      }
      onEvent({ type, data: parsed } as EvaluationStreamEvent);
      terminal = type === 'completed' || type === 'failed';
    }
  };

  try {
    while (!terminal && !signal.aborted) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      dispatch();
    }
    buffer += decoder.decode();
    if (buffer.trim() && !terminal) {
      buffer += '\n\n';
      dispatch();
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }
  if (!signal.aborted && !terminal) throw new ApiError('The evaluation stream ended before a final result arrived.', 0);
}
