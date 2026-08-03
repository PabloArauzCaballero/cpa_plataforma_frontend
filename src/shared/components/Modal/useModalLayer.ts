import { useEffect } from 'react';

/**
 * Comportamiento común a todas las capas modales de la plataforma.
 *
 * - Cierra con Escape.
 * - Bloquea el scroll del documento mientras la capa está abierta, para que la
 *   rueda del mouse mueva el contenido del modal y no la página de atrás.
 *
 * El bloqueo se lleva con un contador en `data-modal-count` porque puede haber
 * dos capas abiertas a la vez (por ejemplo el diálogo de confirmación sobre un
 * modal de formulario): la última en cerrarse es la que debe restaurar el scroll.
 */
export function useModalLayer(isOpen: boolean, onClose?: () => void): void {
  useEffect(() => {
    if (!isOpen) return undefined;

    const body = document.body;
    const openLayers = Number(body.dataset.modalCount || '0');
    if (openLayers === 0) {
      body.dataset.modalPreviousOverflow = body.style.overflow;
      body.style.overflow = 'hidden';
    }
    body.dataset.modalCount = String(openLayers + 1);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose?.();
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const remaining = Number(body.dataset.modalCount || '1') - 1;
      if (remaining > 0) {
        body.dataset.modalCount = String(remaining);
        return;
      }
      delete body.dataset.modalCount;
      body.style.overflow = body.dataset.modalPreviousOverflow || '';
      delete body.dataset.modalPreviousOverflow;
    };
  }, [isOpen, onClose]);
}
