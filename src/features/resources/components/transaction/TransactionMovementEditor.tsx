import type { SelectOption } from '../../domain/CrudResource';
import type { MovementDraft } from '../../domain/transaction/transactionFormModel';
import styles from '../TransactionForm.module.css';

interface TransactionMovementEditorProps {
  movementDraft: MovementDraft;
  editingMovementIndex: number | null;
  accountSearchInput: string;
  filteredAccountOptions: SelectOption[];
  selectedAccountLabel: string;
  totalAccountCount: number;
  isLoadingAccounts: boolean;
  onAccountSearchChange: (value: string) => void;
  onSelectAccount: (accountId: string) => void;
  onMovementFieldChange: (name: keyof MovementDraft, value: string) => void;
  onSaveMovement: () => void;
  onCancelEdition: () => void;
}

export function TransactionMovementEditor({
  movementDraft,
  editingMovementIndex,
  accountSearchInput,
  filteredAccountOptions,
  selectedAccountLabel,
  totalAccountCount,
  isLoadingAccounts,
  onAccountSearchChange,
  onSelectAccount,
  onMovementFieldChange,
  onSaveMovement,
  onCancelEdition,
}: TransactionMovementEditorProps) {
  return (
    <div className={styles.movementGrid}>
      <label className={styles.accountPicker}>
        <span>Cuenta</span>
        <input
          value={accountSearchInput}
          disabled={isLoadingAccounts}
          onChange={(event) => onAccountSearchChange(event.target.value)}
          placeholder={isLoadingAccounts ? 'Cargando cuentas...' : 'Buscar por código o nombre de cuenta'}
        />
        <select
          value={movementDraft.cuentaId}
          disabled={isLoadingAccounts}
          size={Math.min(Math.max(filteredAccountOptions.length, 2), 6)}
          onChange={(event) => onSelectAccount(event.target.value)}
        >
          <option value="">Seleccionar cuenta</option>
          {filteredAccountOptions.map((option) => (
            <option key={String(option.value)} value={String(option.value)}>{option.label}</option>
          ))}
        </select>
        <small>
          {selectedAccountLabel
            ? `Seleccionada: ${selectedAccountLabel}`
            : `${filteredAccountOptions.length} resultado(s) visibles · ${totalAccountCount} cuenta(s) cargadas`}
        </small>
      </label>
      <label>
        <span>Tipo</span>
        <select value={movementDraft.tipoMovimiento} onChange={(event) => onMovementFieldChange('tipoMovimiento', event.target.value as MovementDraft['tipoMovimiento'])}>
          <option value="DEBE">Debe</option>
          <option value="HABER">Haber</option>
        </select>
      </label>
      <label>
        <span>Monto</span>
        <input type="number" step="0.01" min="0" value={movementDraft.monto} onChange={(event) => onMovementFieldChange('monto', event.target.value)} placeholder="0.00" />
      </label>
      <label>
        <span>Descripción</span>
        <input value={movementDraft.descripcion} onChange={(event) => onMovementFieldChange('descripcion', event.target.value)} placeholder="Detalle opcional" />
      </label>
      <div className={styles.movementActions}>
        <button type="button" onClick={onSaveMovement}>{editingMovementIndex === null ? 'Añadir movimiento' : 'Guardar cambios'}</button>
        {editingMovementIndex !== null ? <button type="button" className={styles.secondaryButton} onClick={onCancelEdition}>Cancelar edición</button> : null}
      </div>
    </div>
  );
}
