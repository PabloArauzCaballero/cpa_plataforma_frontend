import { HttpError, httpClient } from '@/shared/api/httpClient';
import { normalizeListResponse } from './resourceMapper';

const RECURSO = '/api/servicios_educativos/asistencia-clase-curso';

export const ESTADOS_ASISTENCIA = ['Asistió', 'Tardanza', 'Falta', 'Justificado', 'En línea'] as const;

export type EstadoAsistencia = (typeof ESTADOS_ASISTENCIA)[number];

export interface AsistenciaRegistrada {
  id_asistencia: number | string;
  id_clase_curso: number | string;
  id_estudiante: number | string;
  estado_asistencia: string;
  hora_marcacion: string | null;
  observaciones: string | null;
}

export interface AsistenciaFilaPayload {
  id_clase_curso: number;
  id_estudiante: number;
  estado_asistencia: string;
  hora_marcacion?: string | null;
  observaciones?: string | null;
}

function texto(valor: unknown): string | null {
  if (valor === undefined || valor === null) return null;
  const limpio = String(valor).trim();
  return limpio === '' ? null : limpio;
}

/**
 * Clases del curso con una etiqueta legible.
 *
 * El armador genérico de opciones concatena los campos crudos y dejaba
 * "2026-08-03T00:00:00.000Z · 08:00:00 · Programada" en el selector. Quien pasa
 * asistencia elige por día y hora, así que se arma aquí con ese formato.
 */
export async function listarClasesDeCurso(): Promise<Array<{ value: string; label: string }>> {
  const response = await httpClient.get<unknown>(
    '/api/servicios_educativos/clase-curso?limit=100&orderBy=fecha&orderDir=DESC',
  );

  return normalizeListResponse(response)
    .map((clase) => {
      const id = clase.id_clase_curso;
      if (id === undefined || id === null) return null;
      const partes = [
        formatearFecha(clase.fecha),
        formatearRangoHorario(clase.hora_inicio_real, clase.hora_fin_real),
        texto(clase.estado),
        texto(clase.modalidad),
      ].filter((parte): parte is string => Boolean(parte));
      return { value: String(id), label: partes.length ? partes.join(' · ') : `Clase ${String(id)}` };
    })
    .filter((opcion): opcion is { value: string; label: string } => opcion !== null);
}

function formatearFecha(valor: unknown): string | null {
  const crudo = texto(valor);
  if (!crudo) return null;
  const fecha = new Date(crudo);
  if (Number.isNaN(fecha.getTime())) return crudo;
  // La fecha llega como día sin zona; se lee en UTC para no correrla un día.
  return new Intl.DateTimeFormat('es-BO', {
    weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC',
  }).format(fecha);
}

function formatearRangoHorario(inicio: unknown, fin: unknown): string | null {
  const recorta = (valor: unknown) => texto(valor)?.slice(0, 5) ?? null;
  const desde = recorta(inicio);
  const hasta = recorta(fin);
  if (desde && hasta) return `${desde} a ${hasta}`;
  return desde ?? hasta;
}

/** Asistencias ya registradas para una clase: se editan en vez de duplicarse. */
export async function listarAsistenciaDeClase(idClaseCurso: number | string): Promise<AsistenciaRegistrada[]> {
  const query = new URLSearchParams({ id_clase_curso: String(idClaseCurso), limit: '100', orderDir: 'ASC' });
  const response = await httpClient.get<unknown>(`${RECURSO}?${query.toString()}`);
  return normalizeListResponse(response)
    .filter((fila) => String(fila.id_clase_curso ?? '') === String(idClaseCurso))
    .map((fila) => ({
      id_asistencia: fila.id_asistencia as number | string,
      id_clase_curso: fila.id_clase_curso as number | string,
      id_estudiante: fila.id_estudiante as number | string,
      estado_asistencia: String(fila.estado_asistencia ?? ''),
      hora_marcacion: texto(fila.hora_marcacion),
      observaciones: texto(fila.observaciones),
    }));
}

/**
 * Alta de varias asistencias en una sola solicitud.
 *
 * La tabla tiene una llave única por (clase, estudiante), así que las filas que
 * ya existían se actualizan y sólo las nuevas se crean. Se resuelve con los
 * endpoints genéricos de lote que el sistema ya expone.
 */
export async function registrarAsistenciaMasiva(
  nuevas: AsistenciaFilaPayload[],
  existentes: Array<AsistenciaFilaPayload & { id_asistencia: number | string }>,
): Promise<{ creadas: number; actualizadas: number }> {
  if (nuevas.length) {
    await httpClient.post<unknown, { items: AsistenciaFilaPayload[] }>(`${RECURSO}/batch`, { items: nuevas });
  }
  if (existentes.length) {
    await httpClient.put<unknown, { items: unknown[] }>(`${RECURSO}/batch`, {
      items: existentes.map(({ id_asistencia, ...datos }) => ({ id_asistencia, ...datos })),
    });
  }
  return { creadas: nuevas.length, actualizadas: existentes.length };
}

export function explicarErrorAsistencia(error: unknown): string {
  if (error instanceof HttpError) {
    const mensaje = (error.message || '').toLowerCase();

    if (error.status === 401) return 'Tu sesión expiró o no es válida. Vuelve a iniciar sesión.';
    if (error.status === 403) return 'No tienes permisos para registrar asistencia.';
    if (mensaje.includes('uq_asistencia_unica') || mensaje.includes('duplicad')) {
      return 'Alguno de los estudiantes ya tenía asistencia en esta clase. Recarga la clase para editar la marca existente.';
    }
    if (mensaje.includes('estado_asistencia')) {
      return 'Hay un estado de asistencia no permitido. Usa uno de los valores de la lista.';
    }
    return error.message || 'No se pudo guardar la asistencia.';
  }

  return error instanceof Error ? error.message : 'No se pudo guardar la asistencia.';
}
