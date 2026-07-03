import type { CrudRecord } from '@/features/resources/domain/CrudResource';

const DRAFT_PREFIX = 'cpa.localDraft';
const DRAFT_VERSION = 1;
const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /contrasena/i,
  /contraseña/i,
  /token/i,
  /secret/i,
  /hash/i,
  /session/i,
];

export interface LocalDraft<T = CrudRecord> {
  version: number;
  key: string;
  savedAt: string;
  expiresAt: string;
  payload: T;
}

function storageKey(key: string): string {
  return `${DRAFT_PREFIX}:${key}`;
}

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
}

export function sanitizeDraftPayload<T>(payload: T): T {
  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizeDraftPayload(item)) as T;
  }

  if (payload && typeof payload === 'object') {
    return Object.entries(payload as Record<string, unknown>).reduce<Record<string, unknown>>((clean, [key, value]) => {
      if (isSensitiveKey(key)) return clean;
      clean[key] = sanitizeDraftPayload(value);
      return clean;
    }, {}) as T;
  }

  return payload;
}

export function saveLocalDraft<T = CrudRecord>(key: string, payload: T, ttlMs = DEFAULT_TTL_MS): LocalDraft<T> {
  const now = new Date();
  const draft: LocalDraft<T> = {
    version: DRAFT_VERSION,
    key,
    savedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + ttlMs).toISOString(),
    payload: sanitizeDraftPayload(payload),
  };

  window.localStorage.setItem(storageKey(key), JSON.stringify(draft));
  return draft;
}

export function readLocalDraft<T = CrudRecord>(key: string): LocalDraft<T> | null {
  const raw = window.localStorage.getItem(storageKey(key));
  if (!raw) return null;

  try {
    const draft = JSON.parse(raw) as LocalDraft<T>;
    if (!draft?.expiresAt || new Date(draft.expiresAt).getTime() < Date.now()) {
      deleteLocalDraft(key);
      return null;
    }
    return draft;
  } catch {
    deleteLocalDraft(key);
    return null;
  }
}

export function deleteLocalDraft(key: string): void {
  window.localStorage.removeItem(storageKey(key));
}

export function hasLocalDraft(key: string): boolean {
  return readLocalDraft(key) !== null;
}

export function buildResourceDraftKey(resourceKey: string, recordId?: string | number | null): string {
  return `${resourceKey}:${recordId ? `edit:${recordId}` : 'create'}`;
}
