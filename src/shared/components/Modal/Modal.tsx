import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/shared/components/Button';
import { TUTORIAL_ANCHORS, tutorialAnchor } from '@/features/tutorials/domain/tutorialAnchors';
import { useModalLayer } from './useModalLayer';
import styles from './Modal.module.css';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  /**
   * `compact` para contenidos breves —un aviso, una confirmación de resultado—.
   * El ancho por defecto (1180px) está pensado para formularios de varias
   * columnas; con dos líneas de texto deja la frase estirada de lado a lado y el
   * botón perdido en medio de un vacío.
   */
  size?: 'default' | 'compact';
  children: ReactNode;
}

export function Modal({ title, isOpen, onClose, size = 'default', children }: ModalProps) {
  useModalLayer(isOpen, onClose);

  if (!isOpen) return null;

  // Portal a <body>. Dentro del árbol de la página, cualquier ancestro con
  // transform/filter/backdrop-filter convierte `position: fixed` en relativo a
  // ese ancestro: el modal se dibuja desplazado, recortado y sin cubrir la
  // pantalla. Montado en el body no depende del layout de la página que lo abre.
  return createPortal(
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.modal} data-size={size} {...tutorialAnchor(TUTORIAL_ANCHORS.modal)}>
        <header className={styles.header}>
          <h2 id="modal-title">{title}</h2>
          <Button type="button" variant="ghost" onClick={onClose} {...tutorialAnchor(TUTORIAL_ANCHORS.modalClose)}>Cerrar</Button>
        </header>
        {children}
      </div>
    </div>,
    document.body,
  );
}
