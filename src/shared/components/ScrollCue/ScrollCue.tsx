import { useEffect, useRef, useState } from 'react';
import styles from './ScrollCue.module.css';

/** Margen desde el final a partir del cual ya no hace falta avisar. */
const NEAR_BOTTOM = 120;
/** Contenido oculto mínimo para que valga la pena mostrar el aviso. */
const MIN_HIDDEN = 240;

/**
 * Aviso de "hay más contenido abajo" para la página completa.
 *
 * En macOS —y en cualquier sistema con barras de desplazamiento que se ocultan
 * solas— una página larga no da ninguna pista de que continúa: se lee como si
 * terminara justo donde acaba la ventana. Este botón aparece sólo cuando queda
 * contenido por ver y desaparece al acercarse al final.
 *
 * Es un botón de verdad, no un adorno: al pulsarlo avanza una pantalla, así que
 * también sirve a quien navega con teclado o tiene poca movilidad.
 */
export function ScrollCue() {
  const [visible, setVisible] = useState(false);
  const frame = useRef(0);

  useEffect(() => {
    function measure() {
      frame.current = 0;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const hidden = scrollHeight - clientHeight;
      setVisible(hidden > MIN_HIDDEN && scrollTop + clientHeight < scrollHeight - NEAR_BOTTOM);
    }
    function schedule() {
      if (!frame.current) frame.current = window.requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // El alto cambia al cargar datos, filtrar o desplegar un panel.
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      observer.disconnect();
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  function scrollDown() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: reduced ? 'auto' : 'smooth' });
  }

  return (
    <button
      type="button"
      className={styles.cue}
      data-visible={visible}
      // Fuera de la vista tampoco debe recibir foco por teclado.
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={scrollDown}
    >
      <i className="fa-solid fa-arrow-down" aria-hidden="true" />
      <span>Hay más abajo</span>
    </button>
  );
}
