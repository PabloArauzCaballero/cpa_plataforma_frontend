import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useModalLayer } from '@/shared/components/Modal/useModalLayer';
import styles from './ConfirmDialog.module.css';

export interface ConfirmDetail {
  label: string;
  value: string;
  /** Valor anterior. Si viene, se muestra tachado antes del nuevo. */
  previous?: string;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  targetLabel?: string;
  /**
   * Resumen de lo que se va a guardar. Convierte un "¿estás seguro?" —que se
   * acepta sin leer— en una revisión real de lo que está a punto de pasar.
   */
  details?: ConfirmDetail[];
  /** Cuántos detalles se listan antes de resumir el resto. */
  maxDetails?: number;
  warning?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  /**
   * `top` dibuja el diálogo por encima del recorrido guiado, que se monta en un
   * z-index altísimo. Sin esto, la confirmación de salir del tutorial quedaba
   * tapada por el propio overlay del tutorial.
   */
  layer?: 'default' | 'top';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  targetLabel,
  details,
  maxDetails = 8,
  warning,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  layer = 'default',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useModalLayer(isOpen, isLoading ? undefined : onCancel);

  if (!isOpen) return null;

  // Mismo motivo que en Modal: montado en el body para que `position: fixed`
  // se resuelva contra la ventana y no contra un ancestro con transform.
  return createPortal(
    <div className={styles.backdrop} data-layer={layer} role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-message">
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

        {(targetLabel || warning || details?.length) ? (
          <div className={styles.body}>
            {targetLabel ? <div className={styles.target}>{targetLabel}</div> : null}

            {details?.length ? (
              <>
                <dl className={styles.details}>
                  {details.slice(0, maxDetails).map((detail) => (
                    <div key={detail.label} className={styles.detailRow}>
                      <dt>{detail.label}</dt>
                      <dd>
                        {detail.previous !== undefined ? (
                          <>
                            <s className={styles.previous}>{detail.previous}</s>
                            <i className="fa-solid fa-arrow-right-long" aria-label="cambia a" />
                          </>
                        ) : null}
                        <strong>{detail.value}</strong>
                      </dd>
                    </div>
                  ))}
                </dl>
                {details.length > maxDetails ? (
                  <p className={styles.moreDetails}>
                    y {details.length - maxDetails} campo{details.length - maxDetails === 1 ? '' : 's'} más.
                  </p>
                ) : null}
              </>
            ) : null}

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
    </div>,
    document.body,
  );
}
