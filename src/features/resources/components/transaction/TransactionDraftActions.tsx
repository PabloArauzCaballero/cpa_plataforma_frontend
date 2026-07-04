import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faDatabase, faFloppyDisk, faFolderOpen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/shared/components/Button';
import styles from '../TransactionForm.module.css';

interface TransactionDraftActionsProps {
  hasDraft: boolean;
  storedDraftCount: number;
  draftPositionLabel: string;
  selectedDraftLabel: string;
  canGoPreviousDraft: boolean;
  canGoNextDraft: boolean;
  isDraftBusy: boolean;
  draftMessage: string | null;
  draftError: string | null;
  onSaveDraft: () => void;
  onLoadDraft: () => void;
  onDiscardDraft: () => void;
  onPreviousDraft: () => void;
  onNextDraft: () => void;
}

export function TransactionDraftActions({
  hasDraft,
  storedDraftCount,
  draftPositionLabel,
  selectedDraftLabel,
  canGoPreviousDraft,
  canGoNextDraft,
  isDraftBusy,
  draftMessage,
  draftError,
  onSaveDraft,
  onLoadDraft,
  onDiscardDraft,
  onPreviousDraft,
  onNextDraft,
}: TransactionDraftActionsProps) {
  return (
    <div className={styles.draftBar}>
      <div className={styles.draftInfo}>
        <strong><FontAwesomeIcon icon={faDatabase} /> Borradores guardados</strong>
        <span>Guarda varios avances sin crear la transacción final. Puedes moverte entre borradores antes de cargar uno.</span>
        <small className={styles.draftMeta}>
          {storedDraftCount > 0 ? `Borrador ${draftPositionLabel} · ${selectedDraftLabel}` : draftPositionLabel}
        </small>
        {draftMessage ? <small className={styles.draftSuccess}>{draftMessage}</small> : null}
        {draftError ? <small className={styles.draftError}>{draftError}</small> : null}
      </div>

      <div className={styles.draftActions}>
        <div className={styles.draftPager} aria-label="Paginación de borradores">
          <button type="button" onClick={onPreviousDraft} disabled={isDraftBusy || !canGoPreviousDraft} aria-label="Borrador anterior">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <span>{draftPositionLabel}</span>
          <button type="button" onClick={onNextDraft} disabled={isDraftBusy || !canGoNextDraft} aria-label="Borrador siguiente">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        <Button type="button" variant="ghost" onClick={onSaveDraft} disabled={isDraftBusy}>
          <FontAwesomeIcon icon={faFloppyDisk} /> {isDraftBusy ? 'Procesando...' : 'Guardar nuevo borrador'}
        </Button>
        <Button type="button" variant="ghost" onClick={onLoadDraft} disabled={isDraftBusy || !hasDraft}>
          <FontAwesomeIcon icon={faFolderOpen} /> Cargar seleccionado
        </Button>
        <Button type="button" variant="ghost" onClick={onDiscardDraft} disabled={isDraftBusy || !hasDraft}>
          <FontAwesomeIcon icon={faTrash} /> Eliminar seleccionado
        </Button>
      </div>
    </div>
  );
}
