import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  targetLabel?: string;
  warning?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  targetLabel,
  warning,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-message">
      <div className={styles.dialog}>
        <header className={styles.header}>
          <span className={styles.icon} data-variant={variant} aria-hidden="true">
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </span>
          <div className={styles.titleBlock}>
            <h2 id="confirm-dialog-title">{title}</h2>
            <p id="confirm-dialog-message">{message}</p>
          </div>
        </header>

        {(targetLabel || warning) ? (
          <div className={styles.body}>
            {targetLabel ? <div className={styles.target}>{targetLabel}</div> : null}
            {warning ? <p className={styles.warning}>{warning}</p> : null}
          </div>
        ) : null}

        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onCancel} disabled={isLoading}>{cancelLabel}</button>
          <button type="button" className={styles.confirm} data-variant={variant} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
