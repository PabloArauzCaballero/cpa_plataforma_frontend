import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { Button } from '@/shared/components/Button';
import { FormField } from '@/shared/components/FormField';
import type { CrudRecord, CrudResourceDefinition } from '../domain/CrudResource';
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

function stringifyValue(value: unknown): string | number | boolean {
  if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  return String(value);
}

function humanizeFieldName(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\b(id|url|uuid|nit)\b/gi, (value) => value.toUpperCase())
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function buildHeaderPayload(resource: CrudResourceDefinition, record: CrudRecord | null): CrudRecord {
  return resource.fields.reduce<CrudRecord>((payload, field) => {
    payload[field.name] = stringifyValue(record?.[field.name]);
    return payload;
  }, {});
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
    const movementType = String(row.tipoMovimiento ?? row.tipo_movimiento ?? row.tipo ?? 'DEBE').toUpperCase();

    return {
      cuentaId: String(row.cuentaId ?? row.id_cuenta ?? row.idCuenta ?? row.cuenta ?? ''),
      tipoMovimiento: movementType === 'HABER' ? 'HABER' : 'DEBE',
      monto: String(row.monto ?? ''),
      descripcion: String(row.descripcion ?? row.observacion ?? ''),
    };
  });
}

function toMoney(value: string): number {
  const normalized = value.replace(',', '.');
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : 0;
}

function getMovementPayload(movement: MovementDraft): CrudRecord {
  return {
    cuentaId: movement.cuentaId.trim(),
    id_cuenta: movement.cuentaId.trim(),
    tipoMovimiento: movement.tipoMovimiento,
    monto: toMoney(movement.monto),
    descripcion: movement.descripcion.trim(),
  };
}

export function TransactionForm({ resource, record, isSaving, onSubmit, onCancel }: TransactionFormProps) {
  const initialHeader = useMemo(() => buildHeaderPayload(resource, record), [resource, record]);
  const [headerPayload, setHeaderPayload] = useState<CrudRecord>(initialHeader);
  const [movements, setMovements] = useState<MovementDraft[]>(() => getRecordMovements(record));
  const [movementDraft, setMovementDraft] = useState<MovementDraft>(emptyMovement);
  const [error, setError] = useState<string | null>(null);

  const totals = useMemo(() => {
    const debe = movements.filter((movement) => movement.tipoMovimiento === 'DEBE').reduce((sum, movement) => sum + toMoney(movement.monto), 0);
    const haber = movements.filter((movement) => movement.tipoMovimiento === 'HABER').reduce((sum, movement) => sum + toMoney(movement.monto), 0);
    return { debe, haber, diferencia: Number((debe - haber).toFixed(2)) };
  }, [movements]);

  function setHeaderField(name: string, value: unknown) {
    setHeaderPayload((current) => ({ ...current, [name]: value }));
  }

  function setMovementField(name: keyof MovementDraft, value: string) {
    setMovementDraft((current) => ({ ...current, [name]: value }));
  }

  function addMovement() {
    if (!movementDraft.cuentaId.trim()) {
      setError('Debes indicar la cuenta del movimiento.');
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

    if (movements.length < 2) {
      setError('Una transacción contable debe tener al menos dos movimientos.');
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
        <strong>{resource.table}</strong>
        <span>Formulario fusionado: encabezado de transacción + movimientos de cuenta en un solo envío.</span>
      </div>

      <section className={styles.section}>
        <h3>Datos de la transacción</h3>
        <div className={styles.grid}>
          {resource.fields.map((field) => (
            <FormField
              key={field.name}
              id={field.name}
              label={humanizeFieldName(field.name)}
              type={field.type}
              value={headerPayload[field.name] as string | number | boolean}
              required={field.required}
              onChange={(value) => setHeaderField(field.name, value)}
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
            <span>Cuenta / ID cuenta</span>
            <input value={movementDraft.cuentaId} onChange={(event) => setMovementField('cuentaId', event.target.value)} placeholder="Ej. id_cuenta o código" />
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
            <input type="number" step="0.01" value={movementDraft.monto} onChange={(event) => setMovementField('monto', event.target.value)} placeholder="0.00" />
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
                  <td>{movement.cuentaId}</td>
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
