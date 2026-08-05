import { useEffect, useRef, useState, type RefObject } from 'react';

export interface ScrollAffordance {
  /** El contenido no cabe a lo ancho. */
  overflowsX: boolean;
  /** El contenido no cabe a lo alto. */
  overflowsY: boolean;
  /** Queda contenido por descubrir hacia la izquierda. */
  moreLeft: boolean;
  /** Queda contenido por descubrir hacia la derecha. */
  moreRight: boolean;
  /** Queda contenido por descubrir hacia abajo. */
  moreDown: boolean;
}

const NONE: ScrollAffordance = { overflowsX: false, overflowsY: false, moreLeft: false, moreRight: false, moreDown: false };

/** Holgura en píxeles: el desplazamiento en subpíxeles no debe contar como "hay más". */
const EPSILON = 2;

/**
 * Informa de si un contenedor desplazable esconde contenido y en qué dirección.
 *
 * La señal visual básica —la sombra en el borde— es CSS puro y no necesita
 * esto (ver `scroll.css`). Este hook existe para el aviso con palabras, que sí
 * necesita saber si la tabla desborda de verdad para no anunciar un
 * desplazamiento que no existe.
 *
 * Se recalcula al desplazar, al cambiar el tamaño del contenedor y al cambiar
 * su contenido; las lecturas van dentro de un `requestAnimationFrame` para no
 * forzar un reflow por cada evento de scroll.
 */
export function useScrollAffordance(ref: RefObject<HTMLElement | null>): ScrollAffordance {
  const [state, setState] = useState<ScrollAffordance>(NONE);
  const frame = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    function measure() {
      frame.current = 0;
      const el = ref.current;
      if (!el) return;

      const overflowsX = el.scrollWidth - el.clientWidth > EPSILON;
      const overflowsY = el.scrollHeight - el.clientHeight > EPSILON;

      setState((previous) => {
        const next: ScrollAffordance = {
          overflowsX,
          overflowsY,
          moreLeft: overflowsX && el.scrollLeft > EPSILON,
          moreRight: overflowsX && el.scrollLeft + el.clientWidth < el.scrollWidth - EPSILON,
          moreDown: overflowsY && el.scrollTop + el.clientHeight < el.scrollHeight - EPSILON,
        };
        // Sin esta comparación, cada evento de scroll provocaría un render
        // aunque nada haya cambiado.
        const same =
          previous.overflowsX === next.overflowsX &&
          previous.overflowsY === next.overflowsY &&
          previous.moreLeft === next.moreLeft &&
          previous.moreRight === next.moreRight &&
          previous.moreDown === next.moreDown;
        return same ? previous : next;
      });
    }

    function schedule() {
      if (!frame.current) frame.current = window.requestAnimationFrame(measure);
    }

    measure();
    node.addEventListener('scroll', schedule, { passive: true });

    // El tamaño cambia al girar el móvil o al plegar el menú; el contenido
    // cambia al pasar de página o al filtrar. Hay que atender a ambos.
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(node);
    const mutationObserver = new MutationObserver(schedule);
    mutationObserver.observe(node, { childList: true, subtree: true });

    return () => {
      node.removeEventListener('scroll', schedule);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, [ref]);

  return state;
}
