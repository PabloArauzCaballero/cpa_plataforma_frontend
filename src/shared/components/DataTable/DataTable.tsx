import { useRef } from 'react';
import { useScrollAffordance } from '@/shared/hooks/useScrollAffordance';
import styles from './DataTable.module.css';
import { TUTORIAL_ANCHORS, tutorialAnchor } from '@/features/tutorials/domain/tutorialAnchors';
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
  if (estado === false) return true; // estado_registro booleano en algunas tablas
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

/**
 * Etiqueta legible para el badge de estado. Un booleano de "activo" debe leerse como
 * "Activo"/"Inactivo" (no "Sí"/"No"); los estados en texto se muestran tal cual.
 */
function renderStatusLabel(value: unknown): string {
  if (value === true) return 'Activo';
  if (value === false) return 'Inactivo';
  const text = String(value ?? '').trim();
  const lower = text.toLowerCase();
  if (lower === 'true' || lower === 'sí' || lower === 'si') return 'Activo';
  if (lower === 'false' || lower === 'no') return 'Inactivo';
  return renderValue(value);
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const affordance = useScrollAffordance(scrollRef);

  return (
    <div className={styles.tableWrapper}>
      <div
        ref={scrollRef}
        className={styles.tableWrap}
        {...tutorialAnchor(TUTORIAL_ANCHORS.resourceTable)}
      >
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
                  /* Las celdas se recortan con puntos suspensivos para que
                     todas las filas midan lo mismo. El `title` conserva el
                     valor completo, así que recortar nunca esconde el dato. */
                  <td key={`${key}-${column}`} title={renderValue(record[column])}>
                    {isStatusColumn(column) && record[column] !== null && record[column] !== undefined && record[column] !== '' ? (
                      <span
                        className={styles.statusBadge}
                        data-active={isActiveStatusValue(record[column])}
                      >
                        {renderStatusLabel(record[column])}
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
                      <button type="button" onClick={() => onEdit(record)} aria-label="Editar registro" {...tutorialAnchor(TUTORIAL_ANCHORS.resourceRowEdit)}>
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

      {/* Las sombras van ENCIMA del contenido, no detrás: las celdas tienen
          fondo propio y opaco, así que un degradado pintado en el fondo del
          contenedor quedaría tapado por las filas y no se vería. */}
      <span className={styles.edge} data-side="left" data-on={affordance.moreLeft} aria-hidden="true" />
      <span className={styles.edge} data-side="right" data-on={affordance.moreRight} aria-hidden="true" />

      {/* La sombra del borde ya dice "hay más"; esto dice qué hacer. Muchas
          personas no intentan desplazar una tabla en horizontal si nadie se lo
          sugiere. Desaparece al llegar al final. */}
      {affordance.overflowsX ? (
        <p className={`${styles.hint} scrollHint`} data-visible={affordance.moreRight} aria-hidden="true">
          Desliza para ver más columnas
          <i className="fa-solid fa-arrow-right-long" />
        </p>
      ) : null}
    </div>
  );
}
