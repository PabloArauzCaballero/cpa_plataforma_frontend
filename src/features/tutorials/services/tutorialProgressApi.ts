import { HttpError, httpClient } from '@/shared/api/httpClient';
import type { TutorialProgressEntry, TutorialStatus } from '../domain/TutorialProgress';

/**
 * Contrato de progreso de tutoriales contra el backend.
 *
 * IMPORTANTE — estado real: en el momento de escribir esto la API de CPA no expone
 * todavía estos servicios. El cliente está implementado y tipado, y detecta en caliente
 * si el backend los ofrece: mientras no existan (404/405/501 o red caída) el sistema
 * degrada a almacenamiento local sin romper nada y sin reintentar en bucle.
 * Cuando el backend publique las rutas descritas abajo, la persistencia pasa a ser
 * remota automáticamente, sin cambios en el frontend.
 *
 * Servicios esperados (todos autenticados con la cabecera `X-Session-Token`; el backend
 * deduce el usuario del token y NUNCA acepta un id de usuario por parámetro, para que
 * nadie pueda leer ni modificar el progreso de otro):
 *
 *   GET    /api/onboarding/tutoriales/progreso
 *          → { data: TutorialProgressDto[] }  · progreso del usuario autenticado
 *
 *   PUT    /api/onboarding/tutoriales/progreso/:tutorialId
 *          body: TutorialProgressDto (sin id_persona)
 *          → { data: TutorialProgressDto }    · upsert idempotente
 *
 *   DELETE /api/onboarding/tutoriales/progreso/:tutorialId
 *          → 204                              · reinicia un tutorial (idempotente)
 *
 *   DELETE /api/onboarding/tutoriales/progreso
 *          → 204                              · reinicia todo el progreso
 *
 * Validación esperada en el servidor: `tutorial_id` y `version` no vacíos, `estado` en
 * el enum de estados, `paso_actual_indice` entero ≥ 0, `repeticiones` entero ≥ 0 y
 * fechas ISO-8601. Un `estado` desconocido debe rechazarse con 400.
 */

export const tutorialProgressEndpoints = {
  list: '/api/onboarding/tutoriales/progreso',
  upsert: (tutorialId: string) => `/api/onboarding/tutoriales/progreso/${encodeURIComponent(tutorialId)}`,
  reset: (tutorialId: string) => `/api/onboarding/tutoriales/progreso/${encodeURIComponent(tutorialId)}`,
  resetAll: '/api/onboarding/tutoriales/progreso',
};

/** Representación de transporte (snake_case, como el resto de la API). */
export interface TutorialProgressDto {
  tutorial_id: string;
  version: string;
  estado: string;
  paso_actual_id?: string | null;
  paso_actual_indice?: number | null;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  fecha_ultima_interaccion?: string | null;
  repeticiones?: number | null;
}

export interface TutorialProgressListResponseDto {
  data?: TutorialProgressDto[];
}

const VALID_STATUSES: ReadonlySet<string> = new Set<TutorialStatus>([
  'pendiente',
  'en_progreso',
  'completado',
  'omitido',
]);

function toStatus(value: string): TutorialStatus {
  return VALID_STATUSES.has(value) ? (value as TutorialStatus) : 'pendiente';
}

export function mapProgressDto(dto: TutorialProgressDto): TutorialProgressEntry {
  return {
    tutorialId: dto.tutorial_id,
    version: dto.version,
    status: toStatus(dto.estado),
    currentStepId: dto.paso_actual_id ?? null,
    currentStepIndex: Number.isFinite(dto.paso_actual_indice) ? Number(dto.paso_actual_indice) : 0,
    startedAt: dto.fecha_inicio ?? null,
    completedAt: dto.fecha_fin ?? null,
    lastInteractionAt: dto.fecha_ultima_interaccion ?? new Date().toISOString(),
    repetitions: Number.isFinite(dto.repeticiones) ? Number(dto.repeticiones) : 0,
  };
}

export function toProgressDto(entry: TutorialProgressEntry): TutorialProgressDto {
  return {
    tutorial_id: entry.tutorialId,
    version: entry.version,
    estado: entry.status,
    paso_actual_id: entry.currentStepId,
    paso_actual_indice: entry.currentStepIndex,
    fecha_inicio: entry.startedAt,
    fecha_fin: entry.completedAt,
    fecha_ultima_interaccion: entry.lastInteractionAt,
    repeticiones: entry.repetitions,
  };
}

/** Códigos que significan "este backend no implementa todavía el servicio". */
const NOT_IMPLEMENTED_STATUSES = new Set([404, 405, 501]);

export function isBackendUnsupported(error: unknown): boolean {
  if (error instanceof HttpError) return NOT_IMPLEMENTED_STATUSES.has(error.status);
  // Fallo de red o de configuración (`VITE_API_BASE_URL` ausente): tampoco hay backend útil.
  return true;
}

export async function fetchTutorialProgress(): Promise<TutorialProgressEntry[]> {
  const response = await httpClient.get<TutorialProgressListResponseDto | TutorialProgressDto[]>(
    tutorialProgressEndpoints.list,
  );
  const rows = Array.isArray(response) ? response : (response?.data ?? []);
  return rows.filter((row) => Boolean(row?.tutorial_id)).map(mapProgressDto);
}

export async function putTutorialProgress(entry: TutorialProgressEntry): Promise<void> {
  await httpClient.put<unknown, TutorialProgressDto>(
    tutorialProgressEndpoints.upsert(entry.tutorialId),
    toProgressDto(entry),
  );
}

export async function deleteTutorialProgress(tutorialId: string): Promise<void> {
  await httpClient.delete<unknown>(tutorialProgressEndpoints.reset(tutorialId));
}

export async function deleteAllTutorialProgress(): Promise<void> {
  await httpClient.delete<unknown>(tutorialProgressEndpoints.resetAll);
}
