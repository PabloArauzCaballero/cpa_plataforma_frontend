import { humanizeFieldLabel } from '@/shared/utils/humanize';
import type { CrudRecord, CrudResourceDefinition, ResourceFieldDefinition, SelectOption } from './CrudResource';

export interface ChangeEntry {
  /** Etiqueta legible del campo. */
  label: string;
  /** Valor que quedará guardado. */
  value: string;
  /** Valor anterior. Sólo en edición y sólo si cambió. */
  previous?: string;
}

/** Cuántos campos se listan antes de resumir el resto en una línea. */
export const MAX_DETAIL_ROWS = 8;

const EMPTY = '—';

/**
 * Opciones ya resueltas por campo.
 *
 * Hace falta porque las listas que apuntan a un catálogo —la unidad educativa,
 * por ejemplo— NO tienen sus opciones en la definición del recurso: se cargan
 * por red al abrir el formulario. Sin esto la confirmación mostraba el id en
 * crudo ("48") en lugar de "Colegio Alemán Santa Cruz".
 */
export type ResolvedOptions = Record<string, Array<string | SelectOption>>;

function optionLabel(
  field: ResourceFieldDefinition,
  value: unknown,
  resolved?: ResolvedOptions,
): string | null {
  const options = resolved?.[field.name] ?? field.options;
  if (!options) return null;
  const match = options.find((option) =>
    typeof option === 'string' ? option === value : String((option as SelectOption).value) === String(value),
  );
  if (!match) return null;
  return typeof match === 'string' ? match : match.label;
}

/**
 * Convierte un valor a algo que una persona pueda verificar de un vistazo.
 *
 * Importa mucho en las listas desplegables: el payload guarda el id numérico de
 * la unidad educativa, y confirmar "48" no le dice nada a nadie. Si el campo
 * tiene opciones, se muestra su etiqueta.
 */
export function formatValue(
  field: ResourceFieldDefinition | undefined,
  value: unknown,
  resolved?: ResolvedOptions,
): string {
  if (value === null || value === undefined || value === '') return EMPTY;
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (field) {
    const label = optionLabel(field, value, resolved);
    if (label) return label;
    if (field.type === 'password') return '••••••••';
  }
  const text = String(value).trim();
  return text === '' ? EMPTY : text;
}

/** Igualdad laxa: el formulario devuelve `"3"` donde el registro traía `3`. */
function sameValue(a: unknown, b: unknown): boolean {
  const normalize = (value: unknown) =>
    value === null || value === undefined || value === '' ? '' : String(value).trim();
  return normalize(a) === normalize(b);
}

function visibleFields(resource: CrudResourceDefinition): ResourceFieldDefinition[] {
  // Los de sólo lectura los calcula el sistema y nunca se envían: confirmarlos
  // sugeriría que se están guardando.
  return resource.fields.filter((field) => !field.readOnly);
}

function labelOf(field: ResourceFieldDefinition): string {
  return humanizeFieldLabel(field.label, field.name);
}

/**
 * Qué se va a crear: los campos con valor, para poder repasarlos antes de
 * confirmar.
 */
export function summarizeCreate(
  resource: CrudResourceDefinition,
  payload: CrudRecord,
  resolved?: ResolvedOptions,
): ChangeEntry[] {
  return visibleFields(resource)
    .filter((field) => {
      const value = payload[field.name];
      return value !== undefined && value !== null && String(value).trim() !== '';
    })
    .map((field) => ({ label: labelOf(field), value: formatValue(field, payload[field.name], resolved) }));
}

/**
 * Qué cambia al editar: sólo los campos MODIFICADOS, con su valor anterior.
 *
 * Es la diferencia entre una confirmación útil y un "¿estás seguro?" que se
 * acepta sin leer: enseña exactamente qué se va a tocar y qué había antes.
 */
export function summarizeUpdate(
  resource: CrudResourceDefinition,
  previous: CrudRecord,
  next: CrudRecord,
  resolved?: ResolvedOptions,
): ChangeEntry[] {
  return visibleFields(resource)
    .filter((field) => field.name in next && !sameValue(previous[field.name], next[field.name]))
    .map((field) => ({
      label: labelOf(field),
      value: formatValue(field, next[field.name], resolved),
      previous: formatValue(field, previous[field.name], resolved),
    }));
}
