import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/shared/components/Button';
import { FormField } from '@/shared/components/FormField';
import type { CrudRecord, CrudResourceDefinition, SelectOption } from '../domain/CrudResource';
import { accountMovementRelation } from '../domain/resourceFieldCatalog';
import { useResourceFormViewModel } from '../hooks/useResourceFormViewModel';
import { listAllLookupOptions } from '../services/lookupApi';
import styles from './TransactionForm.module.css';

interface TransactionFormProps {
  resource: CrudResourceDefinition;
  record: CrudRecord | null;
  isSaving: boolean;
  onSubmit: (payload: CrudRecord) => void;
  onCancel: () => void;
}

interface MovementDraft {
  cuentaId: string;
  tipoMovimiento: 'DEBE' | 'HABER';
  monto: string;
  descripcion: string;
}

const emptyMovement: MovementDraft = {
  cuentaId: '',
  tipoMovimiento: 'DEBE',
  monto: '',
  descripcion: '',
};

const TRANSACTION_COMMON_FIELDS = ['fecha_transaccion', 'tipo_transaccion', 'sub_tipo_transaccion', 'glosa'];

const TRANSACTION_FIELD_VISIBILITY: Record<string, string[]> = {
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

const TRANSACTION_TYPE_HELP: Record<string, string> = {
  GENERAL: 'Se muestran referencias generales y societarias para ajustes, apertura, cierre o reclasificaciones.',
  COSTO: 'Se muestran centros de costo, empleados, tutores, cursos y referencias operativas asociadas al gasto o costo.',
  VENTA: 'Se muestran referencias comerciales: producto educativo, curso, cliente, sucursal, tienda o clase.',
  BIEN: 'Se muestran referencias de inventario: bien, movimiento, sucursal, tienda o proveedor.',
  DEUDA: 'Se muestran referencias financieras: deuda, pago de deuda y proveedor.',
};

function getTransactionVisibleFieldNames(type: string): string[] {
  return [...TRANSACTION_COMMON_FIELDS, ...(TRANSACTION_FIELD_VISIBILITY[type] ?? [])];
}

function getTransactionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    GENERAL: 'General',
    COSTO: 'Costo',
    VENTA: 'Venta',
    BIEN: 'Bien',
    DEUDA: 'Deuda',
  };
  return labels[type] ?? 'Sin tipo seleccionado';
}

function humanizeFieldName(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\b(id|url|uuid|nit)\b/gi, (value) => value.toUpperCase())
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getRecordMovements(record: CrudRecord | null): MovementDraft[] {
  const candidates = [
    record?.movimientos,
    record?.movimientosCuenta,
    record?.transaccionMovimientoCuenta,
    record?.transaccion_movimiento_cuenta,
    record?.detalles,
  ];

  const source = candidates.find(Array.isArray) as unknown[] | undefined;
  if (!source) return [];

  return source.map((item) => {
    const row = typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : {};
    const debe = Number(row.debe ?? 0);
    const haber = Number(row.haber ?? 0);
    const movementType = String(row.tipoMovimiento ?? row.tipo_movimiento ?? row.tipo ?? (haber > debe ? 'HABER' : 'DEBE')).toUpperCase();

    return {
      cuentaId: String(row.cuentaId ?? row.id_cuenta ?? row.idCuenta ?? row.cuenta ?? ''),
      tipoMovimiento: movementType === 'HABER' ? 'HABER' : 'DEBE',
      monto: String(row.monto ?? (movementType === 'HABER' ? haber : debe) ?? ''),
      descripcion: String(row.descripcion ?? row.observacion ?? ''),
    };
  });
}

function toMoney(value: string): number {
  const normalized = value.replace(',', '.');
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : 0;
}


function isFilled(value: unknown): boolean {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function validateTransactionHeaderBusinessRules(payload: CrudRecord): string | null {
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

function validateMovementBusinessRules(movements: MovementDraft[]): string | null {
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

function getMovementPayload(movement: MovementDraft): CrudRecord {
  const amount = toMoney(movement.monto);
  return {
    id_cuenta: Number(movement.cuentaId),
    debe: movement.tipoMovimiento === 'DEBE' ? amount : 0,
    haber: movement.tipoMovimiento === 'HABER' ? amount : 0,
  };
}

function getOptionLabel(options: SelectOption[], value: string): string {
  const option = options.find((item) => String(item.value) === value);
  return option?.label ?? value;
}

function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function filterAccountOptions(options: SelectOption[], query: string): SelectOption[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return options.slice(0, 80);

  return options
    .filter((option) => normalizeSearchText(`${option.label} ${String(option.value)}`).includes(normalizedQuery))
    .slice(0, 80);
}

function getSelectedAccountLabel(options: SelectOption[], value: string): string {
  if (!value) return '';
  return getOptionLabel(options, value);
}

export function TransactionForm({ resource, record, isSaving, onSubmit, onCancel }: TransactionFormProps) {
  const headerViewModel = useResourceFormViewModel(resource, record);
  const [movements, setMovements] = useState<MovementDraft[]>(() => getRecordMovements(record));
  const [movementDraft, setMovementDraft] = useState<MovementDraft>(emptyMovement);
  const [accountOptions, setAccountOptions] = useState<SelectOption[]>([]);
  const [accountSearch, setAccountSearch] = useState('');
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transactionType = String(headerViewModel.payload.tipo_transaccion ?? '').toUpperCase();
  const visibleFieldNames = useMemo(() => getTransactionVisibleFieldNames(transactionType), [transactionType]);
  const visibleFieldNameSet = useMemo(() => new Set(visibleFieldNames), [visibleFieldNames]);
  const commonFields = useMemo(
    () => resource.fields.filter((field) => TRANSACTION_COMMON_FIELDS.includes(field.name)),
    [resource.fields],
  );
  const contextualFields = useMemo(
    () => resource.fields.filter((field) => !TRANSACTION_COMMON_FIELDS.includes(field.name) && visibleFieldNameSet.has(field.name)),
    [resource.fields, visibleFieldNameSet],
  );

  useEffect(() => {
    let isMounted = true;
    if (!accountMovementRelation) return undefined;

    setIsLoadingAccounts(true);
    listAllLookupOptions(accountMovementRelation)
      .then((options) => {
        if (isMounted) setAccountOptions(options);
      })
      .catch(() => {
        if (isMounted) setAccountOptions([]);
      })
      .finally(() => {
        if (isMounted) setIsLoadingAccounts(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAccountOptions = useMemo(() => filterAccountOptions(accountOptions, accountSearch), [accountOptions, accountSearch]);
  const selectedAccountLabel = useMemo(
    () => getSelectedAccountLabel(accountOptions, movementDraft.cuentaId),
    [accountOptions, movementDraft.cuentaId],
  );

  const totals = useMemo(() => {
    const debe = movements.filter((movement) => movement.tipoMovimiento === 'DEBE').reduce((sum, movement) => sum + toMoney(movement.monto), 0);
    const haber = movements.filter((movement) => movement.tipoMovimiento === 'HABER').reduce((sum, movement) => sum + toMoney(movement.monto), 0);
    return { debe, haber, diferencia: Number((debe - haber).toFixed(2)) };
  }, [movements]);

  function handleHeaderFieldChange(fieldName: string, value: unknown) {
    headerViewModel.setField(fieldName, value);

    if (fieldName !== 'tipo_transaccion') return;

    const nextType = String(value ?? '').toUpperCase();
    const nextVisible = new Set(getTransactionVisibleFieldNames(nextType));
    resource.fields.forEach((field) => {
      if (!TRANSACTION_COMMON_FIELDS.includes(field.name) && !nextVisible.has(field.name)) {
        headerViewModel.setField(field.name, '');
      }
    });
  }

  function cleanPayloadForSelectedTransactionType(payload: CrudRecord): CrudRecord {
    return Object.entries(payload).reduce<CrudRecord>((clean, [key, value]) => {
      if (!visibleFieldNameSet.has(key)) return clean;
      clean[key] = value;
      return clean;
    }, {});
  }

  function setMovementField(name: keyof MovementDraft, value: string) {
    setMovementDraft((current) => ({ ...current, [name]: value }));
  }

  function selectAccount(accountId: string) {
    setMovementField('cuentaId', accountId);
    setAccountSearch('');
  }

  function addMovement() {
    if (!movementDraft.cuentaId.trim() || !Number.isFinite(Number(movementDraft.cuentaId)) || Number(movementDraft.cuentaId) <= 0) {
      setError('Debes seleccionar una cuenta válida.');
      return;
    }

    if (toMoney(movementDraft.monto) <= 0) {
      setError('El monto del movimiento debe ser mayor a cero.');
      return;
    }

    setMovements((current) => [...current, movementDraft]);
    setMovementDraft(emptyMovement);
    setAccountSearch('');
    setError(null);
  }

  function removeMovement(index: number) {
    setMovements((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const rawHeaderPayload = headerViewModel.getPayload();
    if (!rawHeaderPayload) {
      setError('Completa los campos obligatorios de la transacción.');
      return;
    }

    const headerPayload = cleanPayloadForSelectedTransactionType(rawHeaderPayload);
    const headerBusinessError = validateTransactionHeaderBusinessRules(headerPayload);
    if (headerBusinessError) {
      setError(headerBusinessError);
      return;
    }

    if (movements.length < 2) {
      setError('Una transacción contable debe tener al menos dos movimientos.');
      return;
    }

    const movementBusinessError = validateMovementBusinessRules(movements);
    if (movementBusinessError) {
      setError(movementBusinessError);
      return;
    }

    if (Math.abs(totals.diferencia) > 0.009) {
      setError('La transacción no está balanceada: el total Debe debe ser igual al total Haber.');
      return;
    }

    setError(null);
    onSubmit({
      ...headerPayload,
      movimientos: movements.map(getMovementPayload),
    });
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.notice}>
        <strong>Transacción contable</strong>
        <span>Encabezado de transacción + movimientos de cuenta en un solo envío.</span>
      </div>

      <section className={styles.section}>
        <h3>Datos de la transacción</h3>
        <div className={styles.grid}>
          {commonFields.map((field) => (
            <FormField
              key={field.name}
              id={field.name}
              label={field.label && field.label !== field.name ? field.label : humanizeFieldName(field.name)}
              type={field.type}
              value={headerViewModel.payload[field.name] as string | number | boolean}
              error={headerViewModel.errors[field.name]}
              required={field.required}
              options={headerViewModel.getFieldOptions(field)}
              helpText={field.helpText}
              isLoadingOptions={headerViewModel.isLoadingFieldOptions(field)}
              onChange={(value) => handleHeaderFieldChange(field.name, value)}
            />
          ))}
        </div>

        <div className={styles.contextBox}>
          <strong>{getTransactionTypeLabel(transactionType)}</strong>
          <span>{TRANSACTION_TYPE_HELP[transactionType] ?? 'Elige un tipo de transacción para mostrar solo los campos relacionados.'}</span>
        </div>

        {contextualFields.length ? (
          <div className={styles.grid}>
            {contextualFields.map((field) => (
              <FormField
                key={field.name}
                id={field.name}
                label={field.label && field.label !== field.name ? field.label : humanizeFieldName(field.name)}
                type={field.type}
                value={headerViewModel.payload[field.name] as string | number | boolean}
                error={headerViewModel.errors[field.name]}
                required={field.required}
                options={headerViewModel.getFieldOptions(field)}
                helpText={field.helpText}
                isLoadingOptions={headerViewModel.isLoadingFieldOptions(field)}
                onChange={(value) => handleHeaderFieldChange(field.name, value)}
              />
            ))}
          </div>
        ) : null}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <div>
            <h3>Movimientos de cuenta</h3>
            <p>Registra el Debe y el Haber dentro de la misma transacción.</p>
          </div>
          <div className={styles.balance} data-balanced={Math.abs(totals.diferencia) <= 0.009}>
            <span>Debe: {totals.debe.toFixed(2)}</span>
            <span>Haber: {totals.haber.toFixed(2)}</span>
            <strong>Diferencia: {totals.diferencia.toFixed(2)}</strong>
          </div>
        </div>

        <div className={styles.movementGrid}>
          <label className={styles.accountPicker}>
            <span>Cuenta</span>
            <input
              value={accountSearch}
              disabled={isLoadingAccounts}
              onChange={(event) => setAccountSearch(event.target.value)}
              placeholder={isLoadingAccounts ? 'Cargando cuentas...' : 'Buscar por código o nombre de cuenta'}
            />
            <select
              value={movementDraft.cuentaId}
              disabled={isLoadingAccounts}
              size={Math.min(Math.max(filteredAccountOptions.length, 2), 6)}
              onChange={(event) => selectAccount(event.target.value)}
            >
              <option value="">Seleccionar cuenta</option>
              {filteredAccountOptions.map((option) => (
                <option key={String(option.value)} value={String(option.value)}>{option.label}</option>
              ))}
            </select>
            <small>
              {selectedAccountLabel
                ? `Seleccionada: ${selectedAccountLabel}`
                : `${filteredAccountOptions.length} de ${accountOptions.length} cuentas disponibles`}
            </small>
          </label>
          <label>
            <span>Tipo</span>
            <select value={movementDraft.tipoMovimiento} onChange={(event) => setMovementField('tipoMovimiento', event.target.value as MovementDraft['tipoMovimiento'])}>
              <option value="DEBE">Debe</option>
              <option value="HABER">Haber</option>
            </select>
          </label>
          <label>
            <span>Monto</span>
            <input type="number" step="0.01" min="0" value={movementDraft.monto} onChange={(event) => setMovementField('monto', event.target.value)} placeholder="0.00" />
          </label>
          <label>
            <span>Descripción</span>
            <input value={movementDraft.descripcion} onChange={(event) => setMovementField('descripcion', event.target.value)} placeholder="Detalle opcional" />
          </label>
          <button type="button" onClick={addMovement}>Añadir movimiento</button>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cuenta</th>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Descripción</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {movements.length ? movements.map((movement, index) => (
                <tr key={`${movement.cuentaId}-${movement.tipoMovimiento}-${index}`}>
                  <td>{getOptionLabel(accountOptions, movement.cuentaId)}</td>
                  <td>{movement.tipoMovimiento === 'DEBE' ? 'Debe' : 'Haber'}</td>
                  <td>{toMoney(movement.monto).toFixed(2)}</td>
                  <td>{movement.descripcion || '—'}</td>
                  <td><button type="button" onClick={() => removeMovement(index)}>Quitar</button></td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5}>Todavía no agregaste movimientos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar transacción'}</Button>
      </div>
    </form>
  );
}
