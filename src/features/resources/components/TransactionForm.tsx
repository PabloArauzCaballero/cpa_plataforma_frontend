import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/shared/components/Button';
import { FormField } from '@/shared/components/FormField';
import type { CrudRecord, CrudResourceDefinition, SelectOption } from '../domain/CrudResource';
import { accountMovementRelation } from '../domain/resourceFieldCatalog';
import { useResourceFormViewModel } from '../hooks/useResourceFormViewModel';
import { listLookupOptions } from '../services/lookupApi';
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

export function TransactionForm({ resource, record, isSaving, onSubmit, onCancel }: TransactionFormProps) {
  const headerViewModel = useResourceFormViewModel(resource, record);
  const [movements, setMovements] = useState<MovementDraft[]>(() => getRecordMovements(record));
  const [movementDraft, setMovementDraft] = useState<MovementDraft>(emptyMovement);
  const [accountOptions, setAccountOptions] = useState<SelectOption[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!accountMovementRelation) return undefined;

    setIsLoadingAccounts(true);
    listLookupOptions(accountMovementRelation)
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

  const totals = useMemo(() => {
    const debe = movements.filter((movement) => movement.tipoMovimiento === 'DEBE').reduce((sum, movement) => sum + toMoney(movement.monto), 0);
    const haber = movements.filter((movement) => movement.tipoMovimiento === 'HABER').reduce((sum, movement) => sum + toMoney(movement.monto), 0);
    return { debe, haber, diferencia: Number((debe - haber).toFixed(2)) };
  }, [movements]);

  function setMovementField(name: keyof MovementDraft, value: string) {
    setMovementDraft((current) => ({ ...current, [name]: value }));
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
    setError(null);
  }

  function removeMovement(index: number) {
    setMovements((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const headerPayload = headerViewModel.getPayload();
    if (!headerPayload) {
      setError('Completa los campos obligatorios de la transacción.');
      return;
    }

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
          {resource.fields.map((field) => (
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
              onChange={(value) => headerViewModel.setField(field.name, value)}
            />
          ))}
        </div>
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
          <label>
            <span>Cuenta</span>
            <select
              value={movementDraft.cuentaId}
              disabled={isLoadingAccounts}
              onChange={(event) => setMovementField('cuentaId', event.target.value)}
            >
              <option value="">{isLoadingAccounts ? 'Cargando cuentas...' : 'Seleccionar cuenta'}</option>
              {accountOptions.map((option) => (
                <option key={String(option.value)} value={String(option.value)}>{option.label}</option>
              ))}
            </select>
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
