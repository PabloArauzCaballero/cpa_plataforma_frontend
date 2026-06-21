import type { ReactNode } from 'react';
import { Button } from '@/shared/components/Button';
import styles from './Modal.module.css';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2 id="modal-title">{title}</h2>
          <Button type="button" variant="ghost" onClick={onClose}>Cerrar</Button>
        </header>
        {children}
      </div>
    </div>
  );
}
