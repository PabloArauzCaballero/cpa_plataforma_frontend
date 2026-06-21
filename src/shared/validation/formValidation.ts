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

function validateAccountingCode(value: unknown): boolean {
  if (isBlank(value)) return true;
  return /^[A-Z0-9]+([._-]?[A-Z0-9]+)*$/i.test(String(value).trim());
}

function validateCostCenterCode(value: unknown): boolean {
  if (isBlank(value)) return true;
  return /^CC-[A-Z0-9_-]{2,30}$/i.test(String(value).trim()) || validateAccountingCode(value);
}


function getOptionValue(option: NonNullable<ResourceFieldDefinition['options']>[number]): string {
  return typeof option === 'string' ? option : String(option.value);
}

function validateStaticSelectOption(field: ResourceFieldDefinition, value: unknown): boolean {
  if (field.type !== 'select' || !field.options?.length) return true;
  const allowedValues = new Set(field.options.map(getOptionValue));
  return allowedValues.has(String(value));
}

function validateConditionalSelectOption(field: ResourceFieldDefinition, payload: CrudRecord, value: unknown): boolean {
  if (field.type !== 'select' || !field.conditionalOptions) return true;
  const controllerValue = String(payload[field.conditionalOptions.dependsOn] ?? '');
  const options = field.conditionalOptions.valuesByControllerValue[controllerValue];
  if (!options?.length) return true;
  const allowedValues = new Set(options.map((option) => typeof option === 'string' ? option : String(option.value)));
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

function conditionMatches(payload: CrudRecord, condition: Record<string, string | number | boolean>): boolean {
  return Object.entries(condition).every(([name, expected]) => String(payload[name] ?? '') === String(expected));
}

function countFilled(payload: CrudRecord, fieldNames: string[]): number {
  return fieldNames.filter((name) => !isBlank(payload[name])).length;
}

function addError(errors: Record<string, string>, fieldName: string, message: string): void {
  if (!errors[fieldName]) errors[fieldName] = message;
}

export function validateResourcePayload(
  fields: ResourceFieldDefinition[],
  payload: CrudRecord,
  resourceKey?: string,
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = payload[field.name];
    const label = field.label || humanize(field.name);

    const isConditionallyRequired = field.requiredWhen ? conditionMatches(payload, field.requiredWhen) : false;

    if ((field.required || isConditionallyRequired) && isBlank(value)) {
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

    if (field.type === 'select' && !validateConditionalSelectOption(field, payload, value)) {
      errors[field.name] = 'Seleccione una opción válida para la selección anterior.';
      continue;
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

    if (field.checks?.includes('accountingCode') && !validateAccountingCode(value)) {
      errors[field.name] = 'Ingrese un código contable válido, sin espacios ni caracteres especiales innecesarios.';
      continue;
    }

    if (field.checks?.includes('costCenterCode') && !validateCostCenterCode(value)) {
      errors[field.name] = 'Ingrese un código de centro de costo válido, por ejemplo CC-ADM.';
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

  const fieldsByExclusiveGroup = fields.reduce<Record<string, string[]>>((acc, field) => {
    if (!field.exclusiveGroup) return acc;
    acc[field.exclusiveGroup] = [...(acc[field.exclusiveGroup] ?? []), field.name];
    return acc;
  }, {});

  Object.values(fieldsByExclusiveGroup).forEach((fieldNames) => {
    if (countFilled(payload, fieldNames) > 1) {
      fieldNames.forEach((fieldName) => {
        if (!isBlank(payload[fieldName])) addError(errors, fieldName, 'Seleccione solo una entidad principal para esta asignación.');
      });
    }
  });

  if (resourceKey === 'centro-costo') {
    const ingreso = payload.id_cuenta_ingreso;
    const costo = payload.id_cuenta_costo;
    if (!isBlank(ingreso) && !isBlank(costo) && String(ingreso) === String(costo)) {
      addError(errors, 'id_cuenta_costo', 'La cuenta de costo debe ser diferente de la cuenta de ingreso.');
    }
  }

  if (resourceKey === 'centro-costo-mapa') {
    const relatedFields = ['id_deuda', 'id_bien', 'id_sucursal', 'id_tienda', 'id_empleado', 'id_posicion', 'id_departamento'];
    if (countFilled(payload, relatedFields) < 1) {
      addError(errors, 'id_centro_costo', 'Debe asociar al menos una entidad al mapa de centro de costo.');
    }
    if (countFilled(payload, relatedFields) > 3) {
      relatedFields.forEach((fieldName) => {
        if (!isBlank(payload[fieldName])) addError(errors, fieldName, 'Demasiadas entidades asociadas pueden volver ambiguo el mapa contable.');
      });
    }
  }

  if (resourceKey === 'cuenta-asignacion') {
    const entityFieldsByType: Record<string, string> = {
      EMPLEADO: 'id_empleado',
      ESTUDIANTE: 'id_persona_estudiante',
      TUTOR: 'id_persona_tutor',
      SUCURSAL: 'id_sucursal',
      EDIFICIO: 'id_edificio',
      TIENDA: 'id_tienda',
      BIEN: 'id_bien',
      DEUDA: 'id_deuda',
      PROVEEDOR: 'id_proveedor',
      DEPARTAMENTO: 'id_departamento',
    };
    const entityType = String(payload.entidad_tipo ?? '');
    const requiredField = entityFieldsByType[entityType];
    if (requiredField && isBlank(payload[requiredField])) {
      addError(errors, requiredField, `Debe seleccionar el registro relacionado para ${entityType}.`);
    }
  }

  if (resourceKey === 'pago-tutor') {
    const subtotal = asNumber(payload.subtotal) ?? 0;
    const ajustes = asNumber(payload.ajustes) ?? 0;
    const total = asNumber(payload.total);
    if (total !== null && Math.abs(total - (subtotal + ajustes)) > 0.009) {
      addError(errors, 'total', 'El total debe coincidir con subtotal más ajustes.');
    }
    const fechaAprobacion = asDateTime(payload.fecha_aprobacion);
    const fechaPago = asDateTime(payload.fecha_pago);
    if (fechaAprobacion !== null && fechaPago !== null && fechaPago < fechaAprobacion) {
      addError(errors, 'fecha_pago', 'La fecha de pago debe ser posterior o igual a la fecha de aprobación.');
    }
  }

  if (resourceKey === 'grupo-cuenta') {
    const tipo = String(payload.tipo ?? '').toUpperCase();
    const subTipo = String(payload.sub_tipo ?? '').toUpperCase();
    const subGrupo = String(payload.sub_grupo ?? '').toUpperCase();
    const idGrupo = payload.id_grupo_cuenta;
    const idParent = payload.id_parent;
    const ordenReporte = asNumber(payload.orden_reporte);

    const normalizedType = ['RESULTADOS', 'ESTADO_RESULTADO', 'ESTADO_DE_RESULTADO', 'ESTADO_DE_RESULTADOS'].includes(tipo)
      ? 'RESULTADOS'
      : tipo;

    const validSubTypes: Record<string, string[]> = {
      BALANCE: ['ACTIVO', 'PASIVO', 'PATRIMONIO'],
      RESULTADOS: ['INGRESO', 'GASTO'],
    };

    if (normalizedType && subTipo && validSubTypes[normalizedType] && !validSubTypes[normalizedType].includes(subTipo)) {
      addError(
        errors,
        'sub_tipo',
        normalizedType === 'BALANCE'
          ? 'Si el tipo es Balance, el subtipo debe ser Activo, Pasivo o Patrimonio.'
          : 'Si el tipo es Estado de Resultado, el subtipo debe ser Ingreso o Gasto.',
      );
    }

    const validSubGroupsBySubType: Record<string, string[]> = {
      ACTIVO: ['CORRIENTE', 'NO_CORRIENTE'],
      PASIVO: ['CORRIENTE', 'NO_CORRIENTE'],
      PATRIMONIO: ['CAPITAL', 'RESERVAS', 'RESULTADOS_ACUMULADOS'],
      INGRESO: ['OPERATIVO', 'NO_OPERATIVO'],
      GASTO: ['ADMINISTRATIVO', 'VENTAS', 'FINANCIERO', 'OPERATIVO', 'NO_OPERATIVO'],
    };

    if (subTipo && subGrupo && validSubGroupsBySubType[subTipo] && !validSubGroupsBySubType[subTipo].includes(subGrupo)) {
      addError(errors, 'sub_grupo', 'El subgrupo no corresponde al subtipo contable seleccionado.');
    }

    if (!isBlank(idGrupo) && !isBlank(idParent) && String(idGrupo) === String(idParent)) {
      addError(errors, 'id_parent', 'Un grupo de cuenta no puede ser padre de sí mismo.');
    }

    if (ordenReporte !== null && (!Number.isInteger(ordenReporte) || ordenReporte <= 0)) {
      addError(errors, 'orden_reporte', 'El orden de reporte debe ser un entero mayor a cero.');
    }
  }

  if (resourceKey === 'deuda') {
    const montoInicial = asNumber(payload.monto_inicial);
    const plazo = asNumber(payload.plazo_meses);
    if (montoInicial !== null && montoInicial <= 0) addError(errors, 'monto_inicial', 'El monto inicial debe ser mayor a cero.');
    if (plazo !== null && (!Number.isInteger(plazo) || plazo <= 0)) addError(errors, 'plazo_meses', 'El plazo debe ser un entero mayor a cero.');
  }

  if (resourceKey === 'pago') {
    const totalPago = ['capital_amortizado', 'interes_pagado', 'seguro_desgravamen_pagado', 'otros_recargos_pagados']
      .reduce((sum, fieldName) => sum + (asNumber(payload[fieldName]) ?? 0), 0);
    if (totalPago <= 0) {
      addError(errors, 'capital_amortizado', 'El pago debe tener al menos un componente mayor a cero.');
    }
  }

  return errors;
}
