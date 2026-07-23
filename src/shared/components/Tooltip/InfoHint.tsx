import { useId, useState } from 'react';
import styles from './InfoHint.module.css';

interface InfoHintProps {
  /** Texto de ayuda / aclaración de negocio que se muestra al pasar el cursor o enfocar. */
  text: string;
  /** Etiqueta accesible del botón. Por defecto describe el campo asociado. */
  label?: string;
}

/**
 * Ícono de ayuda con tooltip accesible. Se muestra al hover y al foco por teclado,
 * y se puede fijar/cerrar con click para lectura prolongada en pantallas táctiles.
 */
export function InfoHint({ text, label }: InfoHintProps) {
  const [pinned, setPinned] = useState(false);
  const tooltipId = useId();

  if (!text) return null;

  return (
    <span className={styles.wrapper} data-pinned={pinned}>
      <button
        type="button"
        className={styles.trigger}
        aria-label={label ?? 'Más información'}
        aria-describedby={tooltipId}
        aria-expanded={pinned}
        onClick={() => setPinned((value) => !value)}
        onBlur={() => setPinned(false)}
      >
        <i className="fa-solid fa-circle-info" aria-hidden="true" />
      </button>
      <span role="tooltip" id={tooltipId} className={styles.bubble}>
        {text}
      </span>
    </span>
  );
}
