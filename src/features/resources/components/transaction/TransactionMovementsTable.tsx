import type { SelectOption } from '../../domain/CrudResource';
import { getOptionLabel, toMoney, type MovementDraft } from '../../domain/transaction/transactionFormModel';
import styles from '../TransactionForm.module.css';

interface TransactionMovementsTableProps {
  movements: MovementDraft[];
  accountOptions: SelectOption[];
  editingMovementIndex: number | null;
  onEditMovement: (index: number) => void;
  onRemoveMovement: (index: number) => void;
}

export function TransactionMovementsTable({
  movements,
  accountOptions,
  editingMovementIndex,
  onEditMovement,
  onRemoveMovement,
}: TransactionMovementsTableProps) {
  return (
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
            <tr key={`${movement.cuentaId}-${movement.tipoMovimiento}-${index}`} data-editing={editingMovementIndex === index}>
              <td>{getOptionLabel(accountOptions, movement.cuentaId)}</td>
              <td>{movement.tipoMovimiento === 'DEBE' ? 'Debe' : 'Haber'}</td>
              <td>{toMoney(movement.monto).toFixed(2)}</td>
              <td>{movement.descripcion || '—'}</td>
              <td>
                <div className={styles.rowActions}>
                  <button type="button" className={styles.editButton} onClick={() => onEditMovement(index)}>Editar</button>
                  <button type="button" className={styles.removeButton} onClick={() => onRemoveMovement(index)}>Quitar</button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5}>Todavía no agregaste movimientos.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
