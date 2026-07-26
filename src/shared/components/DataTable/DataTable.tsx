import styles from './DataTable.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

export type TableRecord = Record<string, unknown>;

interface DataTableProps {
  records: TableRecord[];
  columns: string[];
  primaryKey: string;
  columnLabels?: Record<string, string>;
  onEdit?: (record: TableRecord) => void;
  onDisable?: (record: TableRecord) => void;
  canDisable?: (record: TableRecord) => boolean;
  getRowHourTone?: (record: TableRecord) => number | null;
}

function renderValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function resolveColumnLabel(column: string, columnLabels?: Record<string, string>): string {
  return columnLabels?.[column] ?? column;
}

const INACTIVE_STATES = new Set(['inactivo', 'eliminado', 'anulado', 'baja', 'cancelado']);

/** Un registro está "inhabilitado" (soft-delete) según su columna de estado o su flag activo. */
function isInactiveRecord(record: TableRecord): boolean {
  const estado = record.estado_registro ?? record.estado;
  if (typeof estado === 'string' && INACTIVE_STATES.has(estado.trim().toLowerCase())) return true;
  const activo = record.es_activo ?? record.activo;
  if (activo === false || String(activo).trim().toLowerCase() === 'false') return true;
  return false;
}

function isStatusColumn(column: string): boolean {
  const lower = column.toLowerCase();
  return lower.includes('estado') || lower === 'es_activo' || lower === 'activo';
}

/** Determina si un valor de estado representa "activo" para colorear el badge. */
function isActiveStatusValue(value: unknown): boolean {
  if (value === true) return true;
  if (value === false) return false;
  const text = String(value ?? '').trim().toLowerCase();
  if (INACTIVE_STATES.has(text)) return false;
  return text === 'activo' || text === 'true' || text === 'sí' || text === 'si' || text === 'vigente';
}

export function DataTable({
  records,
  columns,
  primaryKey,
  columnLabels,
  onEdit,
  onDisable,
  canDisable,
  getRowHourTone,
}: DataTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{resolveColumnLabel(column, columnLabels)}</th>
            ))}
            {(onEdit || onDisable) ? <th>Acciones</th> : null}
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => {
            const key = String(record[primaryKey] ?? record.id ?? index);
            const hourTone = getRowHourTone?.(record);
            const inactive = isInactiveRecord(record);
            return (
              <tr key={key} data-hour-tone={hourTone ?? undefined} data-inactive={inactive || undefined}>
                {columns.map((column) => (
                  <td key={`${key}-${column}`}>
                    {isStatusColumn(column) && record[column] !== null && record[column] !== undefined && record[column] !== '' ? (
                      <span
                        className={styles.statusBadge}
                        data-active={isActiveStatusValue(record[column])}
                      >
                        {renderValue(record[column])}
                      </span>
                    ) : (
                      renderValue(record[column])
                    )}
                  </td>
                ))}
                {(onEdit || onDisable) ? (
                <td>
                  <div className={styles.actions}>
                    {onEdit ? (
                      <button type="button" onClick={() => onEdit(record)} aria-label="Editar registro">
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                    ) : null}
                    {onDisable && (!canDisable || canDisable(record)) ? (
                      <button type="button" onClick={() => onDisable(record)} aria-label="Inhabilitar registro">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    ) : null}
                  </div>
                </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
