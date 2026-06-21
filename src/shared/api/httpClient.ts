import { env, assertEnv } from '@/config/env';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
}

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

function getSessionToken(): string | null {
  return window.localStorage.getItem('cpa.sessionToken');
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

function sanitizeTechnicalPaths(message: string): string {
  return message
    .replace(/https?:\/\/\S+/gi, 'servicio interno')
    .replace(/\b(?:GET|POST|PUT|PATCH|DELETE)\s+\/[^\s,;)]*/gi, 'acción del sistema')
    .replace(/\/api\/[^\s,;)]*/gi, 'servicio interno')
    .replace(/endpoint/gi, 'servicio')
    .replace(/ruta/gi, 'opción')
    .trim();
}

function fallbackErrorMessage(status: number): string {
  if (status === 400) return 'La solicitud no pudo procesarse. Revisa los datos ingresados.';
  if (status === 401) return 'Tu sesión expiró o no es válida. Vuelve a iniciar sesión.';
  if (status === 403) return 'No tienes permisos para realizar esta acción.';
  if (status === 404) return 'La información solicitada no está disponible.';
  if (status >= 500) return 'El servicio no está disponible en este momento. Intenta nuevamente.';
  return `No se pudo completar la operación. Código ${status}.`;
}

function resolveErrorMessage(payload: unknown, status: number): string {
  if (typeof payload === 'object' && payload !== null && 'message' in payload) {
    const message = sanitizeTechnicalPaths(String((payload as { message?: unknown }).message));
    return message || fallbackErrorMessage(status);
  }

  if (typeof payload === 'string' && payload.trim()) {
    const message = sanitizeTechnicalPaths(payload);
    return message || fallbackErrorMessage(status);
  }

  return fallbackErrorMessage(status);
}

export async function request<TResponse, TBody = unknown>(
  path: string,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> {
  assertEnv();
  const token = getSessionToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...options.headers,
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['X-Session-Token'] = token;
  }

  const response = await fetch(`${env.apiBaseUrl}${normalizePath(path)}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new HttpError(resolveErrorMessage(payload, response.status), response.status, payload);
  }

  return payload as TResponse;
}

export async function upload<TResponse>(
  path: string,
  formData: FormData,
  method: HttpMethod = 'POST',
): Promise<TResponse> {
  assertEnv();
  const token = getSessionToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (token) {
    headers['X-Session-Token'] = token;
  }

  const response = await fetch(`${env.apiBaseUrl}${normalizePath(path)}`, {
    method,
    headers,
    body: formData,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new HttpError(resolveErrorMessage(payload, response.status), response.status, payload);
  }

  return payload as TResponse;
}

export const httpClient = {
  get: <TResponse>(path: string) => request<TResponse>(path),
  post: <TResponse, TBody = unknown>(path: string, body: TBody) =>
    request<TResponse, TBody>(path, { method: 'POST', body }),
  put: <TResponse, TBody = unknown>(path: string, body: TBody) =>
    request<TResponse, TBody>(path, { method: 'PUT', body }),
  patch: <TResponse, TBody = unknown>(path: string, body: TBody) =>
    request<TResponse, TBody>(path, { method: 'PATCH', body }),
  delete: <TResponse>(path: string) => request<TResponse>(path, { method: 'DELETE' }),
  upload,
};
