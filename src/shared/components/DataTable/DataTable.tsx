import styles from './DataTable.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

export type TableRecord = Record<string, unknown>;

interface DataTableProps {
  records: TableRecord[];
  columns: string[];
  primaryKey: string;
  onEdit?: (record: TableRecord) => void;
  onDisable?: (record: TableRecord) => void;
  canDisable?: (record: TableRecord) => boolean;
}

function renderValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function DataTable({ records, columns, primaryKey, onEdit, onDisable, canDisable }: DataTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => {
            const key = String(record[primaryKey] ?? record.id ?? index);
            return (
              <tr key={key}>
                {columns.map((column) => (
                  <td key={`${key}-${column}`}>{renderValue(record[column])}</td>
                ))}
                <td>
                  <div className={styles.actions}>
                    {onEdit ? (
                      <button type="button" onClick={() => onEdit(record)}>
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                    ) : null}
                    {onDisable && (!canDisable || canDisable(record)) ? (
                      <button type="button" onClick={() => onDisable(record)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
