import type { CrudRecord, CrudResourceDefinition, SelectOption } from '../CrudResource';

export interface MovementDraft {
  cuentaId: string;
  tipoMovimiento: 'DEBE' | 'HABER';
  monto: string;
  descripcion: string;
}

export const emptyMovement: MovementDraft = {
  cuentaId: '',
  tipoMovimiento: 'DEBE',
  monto: '',
  descripcion: '',
};

export const TRANSACTION_COMMON_FIELDS = ['fecha_transaccion', 'tipo_transaccion', 'sub_tipo_transaccion', 'glosa'];

export const TRANSACTION_FIELD_VISIBILITY: Record<string, string[]> = {
  GENERAL: ['id_sucursal', 'id_tienda', 'id_departamento', 'id_empleado', 'id_dividendo_pago', 'id_emision_titulo'],
  COSTO: [
    'id_centro_costo_mapa',
    'id_empleado',
    'id_empleado_pago',
    'id_departamento',
    'id_clase_por_hora',
    'id_producto_educativo',
    'id_curso_version',
    'id_sucursal',
    'id_tienda',
    'id_proveedor',
    'id_pago_tutor',
  ],
  VENTA: ['id_producto_educativo', 'id_curso_version', 'id_cliente', 'id_sucursal', 'id_tienda', 'id_clase_por_hora'],
  BIEN: ['id_bien', 'id_movimiento_detalle', 'id_sucursal', 'id_tienda', 'id_proveedor'],
  DEUDA: ['id_deuda', 'id_pago_deuda', 'id_proveedor'],
};

export const TRANSACTION_TYPE_HELP: Record<string, string> = {
  GENERAL: 'Se muestran referencias generales y societarias para ajustes, apertura, cierre o reclasificaciones.',
  COSTO: 'Se muestran centros de costo, empleados, tutores, cursos y referencias operativas asociadas al gasto o costo.',
  VENTA: 'Se muestran referencias comerciales: producto educativo, curso, cliente, sucursal, tienda o clase.',
  BIEN: 'Se muestran referencias de inventario: bien, movimiento, sucursal, tienda o proveedor.',
  DEUDA: 'Se muestran referencias financieras: deuda, pago de deuda y proveedor.',
};

export function getTransactionVisibleFieldNames(type: string): string[] {
  return [...TRANSACTION_COMMON_FIELDS, ...(TRANSACTION_FIELD_VISIBILITY[type] ?? [])];
}

export function getTransactionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    GENERAL: 'General',
    COSTO: 'Costo',
    VENTA: 'Venta',
    BIEN: 'Bien',
    DEUDA: 'Deuda',
  };
  return labels[type] ?? 'Sin tipo seleccionado';
}

export function humanizeFieldName(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\b(id|url|uuid|nit)\b/gi, (value) => value.toUpperCase())
    .replace(/\bkpi\b/gi, 'KPI')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function readArray(source: Record<string, unknown>, keys: string[]): unknown[] | undefined {
  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) return value;
  }
  return undefined;
}

function readNestedMovementArray(record: CrudRecord | null): unknown[] | undefined {
  const root = asRecord(record);
  const movementKeys = [
    'movimientos',
    'movimientos_cuenta',
    'movimientosCuenta',
    'movimientos_cuentas',
    'movimientosContables',
    'asiento',
    'asiento_contable',
    'transaccion_movimiento_cuenta',
    'transaccion_movimientos_cuenta',
    'transaccionMovimientoCuenta',
    'transaccionMovimientoCuentas',
    'movimiento_cuentas',
    'movimientoCuenta',
    'detalle_movimientos',
    'detalles_movimientos',
    'items_movimiento',
    'detalles',
    'items',
  ];

  const direct = readArray(root, movementKeys);
  if (direct) return direct;

  const nestedKeys = ['data', 'payload', 'registro', 'transaccion', 'result', 'resultado'];
  for (const key of nestedKeys) {
    const nested = asRecord(root[key]);
    const nestedArray = readArray(nested, movementKeys);
    if (nestedArray) return nestedArray;
  }

  return undefined;
}

function readNumberFrom(row: Record<string, unknown>, keys: string[]): number {
  for (const key of keys) {
    const value = row[key];
    if (value === undefined || value === null || String(value).trim() === '') continue;
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric;
  }
  return 0;
}

function readTextFrom(row: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') return String(value);
  }
  return '';
}

export function getRecordMovements(record: CrudRecord | null): MovementDraft[] {
  const source = readNestedMovementArray(record);
  if (!source) return [];

  return source.map((item) => {
    const row = asRecord(item);
    const debe = readNumberFrom(row, ['debe', 'monto_debe', 'importe_debe', 'valor_debe']);
    const haber = readNumberFrom(row, ['haber', 'monto_haber', 'importe_haber', 'valor_haber']);
    const explicitType = readTextFrom(row, ['tipoMovimiento', 'tipo_movimiento', 'tipo', 'lado', 'naturaleza']).toUpperCase();
    const movementType = explicitType === 'HABER' || explicitType === 'CREDITO' || explicitType === 'CRÉDITO' || haber > debe ? 'HABER' : 'DEBE';
    const amount = readNumberFrom(row, ['monto', 'importe', 'valor', 'amount']) || (movementType === 'HABER' ? haber : debe);

    return {
      cuentaId: readTextFrom(row, ['cuentaId', 'id_cuenta', 'idCuenta', 'cuenta', 'id_plan_cuenta']),
      tipoMovimiento: movementType,
      monto: amount > 0 ? String(amount) : '',
      descripcion: readTextFrom(row, ['descripcion', 'detalle', 'observacion', 'glosa', 'nota']),
    };
  }).filter((movement) => movement.cuentaId || movement.monto);
}

export function toMoney(value: string): number {
  const normalized = value.replace(',', '.');
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : 0;
}

export function isFilled(value: unknown): boolean {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

export function validateTransactionHeaderBusinessRules(payload: CrudRecord): string | null {
  const type = String(payload.tipo_transaccion ?? '');

  if (type === 'COSTO' && !isFilled(payload.id_centro_costo_mapa)) {
    return 'Una transacción de costo debe estar asociada a un mapa de centro de costo.';
  }

  if (
    type === 'VENTA'
    && !isFilled(payload.id_producto_educativo)
    && !isFilled(payload.id_curso_version)
    && !isFilled(payload.id_cliente)
    && !isFilled(payload.id_tienda)
    && !isFilled(payload.id_clase_por_hora)
  ) {
    return 'Una transacción de venta debe tener al menos una referencia comercial: producto, curso, cliente, tienda o clase.';
  }

  if (type === 'BIEN' && !isFilled(payload.id_bien) && !isFilled(payload.id_movimiento_detalle)) {
    return 'Una transacción de bien debe estar asociada a un bien o a un movimiento de inventario.';
  }

  if (type === 'DEUDA' && !isFilled(payload.id_deuda) && !isFilled(payload.id_pago_deuda)) {
    return 'Una transacción de deuda debe estar asociada a una deuda o a un pago de deuda.';
  }

  return null;
}

export function validateMovementBusinessRules(movements: MovementDraft[]): string | null {
  const seen = new Set<string>();

  for (const movement of movements) {
    const amount = toMoney(movement.monto);
    if (!movement.cuentaId || Number(movement.cuentaId) <= 0) {
      return 'Todos los movimientos deben tener una cuenta válida.';
    }
    if (amount <= 0) {
      return 'Todos los movimientos deben tener un monto mayor a cero.';
    }

    const key = `${movement.cuentaId}:${movement.tipoMovimiento}`;
    if (seen.has(key)) {
      return 'No repitas la misma cuenta en el mismo lado del asiento. Agrupa el monto en una sola línea.';
    }
    seen.add(key);
  }

  return null;
}

export function getMovementPayload(movement: MovementDraft): CrudRecord {
  const amount = toMoney(movement.monto);
  const payload: CrudRecord = {
    id_cuenta: Number(movement.cuentaId),
    debe: movement.tipoMovimiento === 'DEBE' ? amount : 0,
    haber: movement.tipoMovimiento === 'HABER' ? amount : 0,
  };
  if (movement.descripcion.trim()) payload.descripcion = movement.descripcion.trim();
  return payload;
}

export function getOptionLabel(options: SelectOption[], value: string): string {
  const option = options.find((item) => String(item.value) === value);
  return option?.label ?? value;
}

export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function filterAccountOptions(options: SelectOption[], query: string, maxVisible = 80): SelectOption[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return options.slice(0, maxVisible);

  return options
    .filter((option) => normalizeSearchText(`${option.label} ${String(option.value)}`).includes(normalizedQuery))
    .slice(0, maxVisible);
}

export function getSelectedAccountLabel(options: SelectOption[], value: string): string {
  if (!value) return '';
  return getOptionLabel(options, value);
}

export function resolveTransactionDraftRecordId(resource: CrudResourceDefinition, record: CrudRecord | null): string | number | null {
  if (!record) return null;
  const value = record[resource.primaryKey] ?? record.id;
  return typeof value === 'string' || typeof value === 'number' ? value : null;
}

export function getMovementTotals(movements: MovementDraft[]): { debe: number; haber: number; diferencia: number } {
  const debe = movements.filter((movement) => movement.tipoMovimiento === 'DEBE').reduce((sum, movement) => sum + toMoney(movement.monto), 0);
  const haber = movements.filter((movement) => movement.tipoMovimiento === 'HABER').reduce((sum, movement) => sum + toMoney(movement.monto), 0);
  return { debe, haber, diferencia: Number((debe - haber).toFixed(2)) };
}

export function cleanPayloadForSelectedTransactionType(payload: CrudRecord, visibleFieldNames: string[]): CrudRecord {
  const visibleFieldNameSet = new Set(visibleFieldNames);
  return Object.entries(payload).reduce<CrudRecord>((clean, [key, value]) => {
    if (!visibleFieldNameSet.has(key)) return clean;
    clean[key] = value;
    return clean;
  }, {});
}
