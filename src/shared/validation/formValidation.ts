import type { CrudRecord, ResourceFieldDefinition } from '@/features/resources/domain/CrudResource';

function isBlank(value: unknown): boolean {
  return value === undefined || value === null || String(value).trim() === '';
}

function asNumber(value: unknown): number | null {
  if (isBlank(value)) return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function asDateTime(value: unknown): number | null {
  if (isBlank(value)) return null;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : null;
}

function validateEmail(value: unknown): boolean {
  if (isBlank(value)) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

function validateUrl(value: unknown): boolean {
  if (isBlank(value)) return true;
  try {
    const parsed = new URL(String(value).trim());
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function validatePhone(value: unknown): boolean {
  if (isBlank(value)) return true;
  return /^[+()\d\s-]{6,30}$/.test(String(value).trim());
}


function getOptionValue(option: NonNullable<ResourceFieldDefinition['options']>[number]): string {
  return typeof option === 'string' ? option : String(option.value);
}

function validateStaticSelectOption(field: ResourceFieldDefinition, value: unknown): boolean {
  if (field.type !== 'select' || !field.options?.length) return true;
  const allowedValues = new Set(field.options.map(getOptionValue));
  return allowedValues.has(String(value));
}

function humanize(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\b(id|url|uuid|nit)\b/gi, (value) => value.toUpperCase())
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function pairError(payload: CrudRecord, startName: string, endName: string, message: string): string | null {
  const start = asDateTime(payload[startName]);
  const end = asDateTime(payload[endName]);
  if (start !== null && end !== null && end < start) return message;
  return null;
}

export function validateResourcePayload(
  fields: ResourceFieldDefinition[],
  payload: CrudRecord,
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = payload[field.name];
    const label = field.label || humanize(field.name);

    if (field.required && isBlank(value)) {
      errors[field.name] = 'Campo obligatorio.';
      continue;
    }

    if (isBlank(value)) continue;

    if (field.valueKind === 'number' || field.type === 'number') {
      const numeric = asNumber(value);
      if (numeric === null) {
        errors[field.name] = 'Debe ser un número válido.';
        continue;
      }

      if (field.checks?.includes('positiveInteger') && (!Number.isInteger(numeric) || numeric <= 0)) {
        errors[field.name] = 'Debe seleccionar un registro válido.';
        continue;
      }

      if (field.checks?.includes('positiveNumber') && numeric <= 0) {
        errors[field.name] = `${label} debe ser mayor a cero.`;
        continue;
      }

      if (field.checks?.includes('nonNegativeDecimal') && numeric < 0) {
        errors[field.name] = `${label} no puede ser negativo.`;
        continue;
      }

      if (field.min !== undefined && numeric < field.min) {
        errors[field.name] = `El valor mínimo permitido es ${field.min}.`;
        continue;
      }

      if (field.max !== undefined && numeric > field.max) {
        errors[field.name] = `El valor máximo permitido es ${field.max}.`;
        continue;
      }
    }

    if (field.type === 'select' && !validateStaticSelectOption(field, value)) {
      errors[field.name] = 'Seleccione una opción válida del catálogo.';
      continue;
    }

    if (field.maxLength !== undefined && String(value).trim().length > field.maxLength) {
      errors[field.name] = `Máximo ${field.maxLength} caracteres.`;
      continue;
    }

    if (field.checks?.includes('email') && !validateEmail(value)) {
      errors[field.name] = 'Ingrese un correo válido.';
      continue;
    }

    if (field.checks?.includes('url') && !validateUrl(value)) {
      errors[field.name] = 'Ingrese un enlace válido con http o https.';
      continue;
    }

    if (field.checks?.includes('phoneLoose') && !validatePhone(value)) {
      errors[field.name] = 'Ingrese un teléfono válido.';
      continue;
    }
  }

  const temporalPairs: Array<[string, string, string]> = [
    ['fecha_inicio', 'fecha_fin', 'La fecha fin debe ser mayor o igual a la fecha inicio.'],
    ['fecha_ingreso', 'fecha_salida', 'La fecha salida debe ser mayor o igual a la fecha ingreso.'],
    ['vigente_desde', 'vigente_hasta', 'La vigencia hasta debe ser mayor o igual a la vigencia desde.'],
    ['periodo_inicio', 'periodo_fin', 'El periodo fin debe ser mayor o igual al periodo inicio.'],
    ['hora_inicio_real', 'hora_fin_real', 'La hora fin debe ser mayor o igual a la hora inicio.'],
  ];

  for (const [start, end, message] of temporalPairs) {
    if (start in payload && end in payload) {
      const error = pairError(payload, start, end, message);
      if (error) errors[end] = error;
    }
  }

  return errors;
}
