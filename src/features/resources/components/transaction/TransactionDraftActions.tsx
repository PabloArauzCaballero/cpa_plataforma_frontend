import { Button } from '@/shared/components/Button';
import styles from '../TransactionForm.module.css';

interface TransactionDraftActionsProps {
  hasDraft: boolean;
  isDraftBusy: boolean;
  draftMessage: string | null;
  draftError: string | null;
  onSaveDraft: () => void;
  onLoadDraft: () => void;
  onDiscardDraft: () => void;
}

export function TransactionDraftActions({
  hasDraft,
  isDraftBusy,
  draftMessage,
  draftError,
  onSaveDraft,
  onLoadDraft,
  onDiscardDraft,
}: TransactionDraftActionsProps) {
  return (
    <div className={styles.draftBar}>
      <div>
        <strong>Borrador en base de datos</strong>
        <span>Guarda avances sin crear la transacción final. El respaldo local solo se usa si el servidor no responde.</span>
        {draftMessage ? <small className={styles.draftSuccess}>{draftMessage}</small> : null}
        {draftError ? <small className={styles.draftError}>{draftError}</small> : null}
      </div>
      <div className={styles.draftActions}>
        <Button type="button" variant="ghost" onClick={onSaveDraft} disabled={isDraftBusy}>{isDraftBusy ? 'Procesando...' : 'Guardar borrador'}</Button>
        <Button type="button" variant="ghost" onClick={onLoadDraft} disabled={isDraftBusy || !hasDraft}>Cargar borrador</Button>
        <Button type="button" variant="ghost" onClick={onDiscardDraft} disabled={isDraftBusy || !hasDraft}>Eliminar borrador</Button>
      </div>
    </div>
  );
}
