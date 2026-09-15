import { humanizeFieldLabel } from '@/shared/utils/humanize';
import type { CrudResourceDefinition, ResourceFieldDefinition, SelectOption } from './CrudResource';

/**
 * Traducción de la definición de un recurso a un formulario de papel.
 *
 * Hay personas que no quieren o no pueden llenar el formulario en pantalla.
 * Para ellas se imprime una versión en blanco que luego alguien de la oficina
 * transcribe al sistema. Este módulo decide QUÉ va en esa hoja —qué campos, con
 * qué forma de respuesta y en qué grupos—; cómo se dibuja es cosa de
 * `printableFormPdf`.
 */

export type PrintableFieldKind =
  | 'text'
  | 'longText'
  | 'number'
  | 'date'
  | 'time'
  | 'datetime'
  | 'yesNo'
  | 'choice'
  | 'attachment';

export interface PrintableField {
  name: string;
  label: string;
  required: boolean;
  kind: PrintableFieldKind;
  /** Casillas a marcar, solo en `choice`. */
  options?: string[];
  /** Guía corta dentro del recuadro, p. ej. el formato de fecha. */
  hint?: string;
}

export interface PrintableSection {
  /** `undefined` en la sección principal, que no lleva cabecera propia. */
  title?: string;
  fields: PrintableField[];
}

export interface PrintableFormPlan {
  title: string;
  moduleLabel: string;
  resourceKey: string;
  sections: PrintableSection[];
}

export interface PrintableFormInput {
  resource: CrudResourceDefinition;
  /** Campos a imprimir; por defecto, los del recurso. */
  fields?: ResourceFieldDefinition[];
  /**
   * Opciones ya cargadas para un campo. Las listas que apuntan a un catálogo
   * solo tienen opciones después de consultarlo; si son pocas se imprimen como
   * casillas, y si no llegaron se deja espacio para escribir.
   */
  resolveOptions?: (field: ResourceFieldDefinition) => Array<string | SelectOption> | undefined;
  /** Etiqueta para los campos que en pantalla suben un archivo o una imagen. */
  attachmentLabel?: (field: ResourceFieldDefinition) => string | undefined;
}

/**
 * Más casillas que esto ya no se leen de un vistazo ni caben en la hoja: se
 * pide escribir la respuesta. Pasa con catálogos grandes como las unidades
 * educativas, que son cientos.
 */
export const MAX_PRINTABLE_CHOICES = 12;
const MAX_CHOICE_LABEL_LENGTH = 40;

function optionLabel(option: string | SelectOption): string {
  return typeof option === 'string' ? option : String(option.label);
}

function uniqueLabels(options: Array<string | SelectOption>): string[] {
  return Array.from(new Set(options.map(optionLabel).map((label) => label.trim()).filter(Boolean)));
}

function collectOptions(field: ResourceFieldDefinition, input: PrintableFormInput): string[] {
  // Con opciones condicionadas a otro campo no se sabe de antemano cuál va a
  // valer, así que se ofrecen todas las posibles.
  if (field.conditionalOptions) {
    return uniqueLabels(Object.values(field.conditionalOptions.valuesByControllerValue).flat());
  }
  const resolved = input.resolveOptions?.(field);
  return uniqueLabels(resolved?.length ? resolved : field.options ?? []);
}

function isPrintableChoice(options: string[]): boolean {
  return options.length > 0
    && options.length <= MAX_PRINTABLE_CHOICES
    && options.every((label) => label.length <= MAX_CHOICE_LABEL_LENGTH);
}

function toPrintableField(field: ResourceFieldDefinition, input: PrintableFormInput): PrintableField {
  const base = {
    name: field.name,
    label: humanizeFieldLabel(field.label, field.name),
    required: Boolean(field.required || field.requiredWhen),
  };

  const attachment = input.attachmentLabel?.(field);
  if (attachment) {
    return { ...base, label: attachment, kind: 'attachment', options: ['Se adjunta en papel'] };
  }

  switch (field.type) {
    case 'checkbox':
      return { ...base, kind: 'yesNo', options: ['Sí', 'No'] };
    case 'textarea':
      return { ...base, kind: 'longText' };
    case 'date':
      return { ...base, kind: 'date', hint: 'DD / MM / AAAA' };
    case 'time':
      return { ...base, kind: 'time', hint: 'HH : MM' };
    case 'datetime-local':
      return { ...base, kind: 'datetime', hint: 'DD / MM / AAAA   HH : MM' };
    case 'number':
      if (!field.relation) return { ...base, kind: 'number' };
      break;
    case 'select':
      break;
    default:
      if (!field.relation) return { ...base, kind: 'text' };
  }

  const options = collectOptions(field, input);
  if (isPrintableChoice(options)) return { ...base, kind: 'choice', options };

  // Lista demasiado larga (o sin cargar): se escribe el nombre a mano y quien
  // transcribe lo busca en el desplegable del sistema.
  return { ...base, kind: 'text', hint: 'Escriba el nombre completo' };
}

function describeCondition(
  condition: Record<string, string | number | boolean>,
  fields: ResourceFieldDefinition[],
): string {
  return Object.entries(condition)
    .map(([name, value]) => {
      const controller = fields.find((field) => field.name === name);
      const label = humanizeFieldLabel(controller?.label ?? name, name);
      return `${label} es ${String(value)}`;
    })
    .join(' y ');
}

export function buildPrintableFormPlan(input: PrintableFormInput): PrintableFormPlan {
  const { resource } = input;
  // Lo que calcula el sistema (código correlativo, etc.) no se pide en papel, y
  // una contraseña escrita en una hoja que pasa de mano en mano deja de serlo.
  const fields = (input.fields ?? resource.fields).filter((field) => !field.readOnly && field.type !== 'password');

  const main: PrintableSection = { fields: [] };
  const conditional = new Map<string, PrintableSection>();

  for (const field of fields) {
    const printable = toPrintableField(field, input);
    if (!field.visibleWhen) {
      main.fields.push(printable);
      continue;
    }
    const title = `Completar solo si ${describeCondition(field.visibleWhen, fields)}`;
    const section = conditional.get(title) ?? { title, fields: [] };
    section.fields.push(printable);
    conditional.set(title, section);
  }

  return {
    title: humanizeFieldLabel(resource.label, resource.key),
    moduleLabel: resource.moduleLabel,
    resourceKey: resource.key,
    sections: [main, ...conditional.values()].filter((section) => section.fields.length > 0),
  };
}
