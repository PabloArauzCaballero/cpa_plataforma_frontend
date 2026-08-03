import { DEFAULT_WAIT_FOR_TARGET_MS } from '../domain/TutorialDefinition';

export interface WaitForTargetOptions {
  /** Espera máxima antes de dar el objetivo por inexistente. */
  timeoutMs?: number;
  /** Documento sobre el que buscar (inyectable para pruebas). */
  doc?: Document;
  /** Permite cancelar la espera cuando el usuario avanza o cierra el tutorial. */
  signal?: AbortSignal;
}

/** Un objetivo sirve si está en el árbol y no está explícitamente oculto. */
export function isUsableTarget(element: Element | null): element is Element {
  if (!element || !element.isConnected) return false;
  if (element instanceof HTMLElement && element.hidden) return false;
  if (element.getAttribute('aria-hidden') === 'true') return false;
  return true;
}

export function queryTarget(selector: string, doc: Document = document): Element | null {
  let element: Element | null = null;
  try {
    element = doc.querySelector(selector);
  } catch {
    // Un selector mal escrito en una configuración no debe tumbar la aplicación:
    // se trata como "objetivo no encontrado" y el motor mostrará su error controlado.
    return null;
  }
  return isUsableTarget(element) ? element : null;
}

/**
 * Espera a que un elemento exista en el DOM.
 *
 * Cubre los casos difíciles del enunciado: elementos que llegan tras una petición al
 * backend, que viven dentro de un modal recién abierto o de un `<details>` desplegado.
 * Usa `MutationObserver` (no un sondeo por temporizador) y sólo emplea un temporizador
 * para el límite máximo de espera.
 */
export function waitForTarget(selector: string, options: WaitForTargetOptions = {}): Promise<Element | null> {
  const doc = options.doc ?? document;
  const timeoutMs = options.timeoutMs ?? DEFAULT_WAIT_FOR_TARGET_MS;

  const immediate = queryTarget(selector, doc);
  if (immediate) return Promise.resolve(immediate);
  if (options.signal?.aborted) return Promise.resolve(null);

  return new Promise<Element | null>((resolve) => {
    let settled = false;

    const finish = (element: Element | null) => {
      if (settled) return;
      settled = true;
      observer.disconnect();
      clearTimeout(timer);
      options.signal?.removeEventListener('abort', onAbort);
      resolve(element);
    };

    const onAbort = () => finish(null);

    const observer = new MutationObserver(() => {
      const element = queryTarget(selector, doc);
      if (element) finish(element);
    });

    const timer = setTimeout(() => finish(queryTarget(selector, doc)), timeoutMs);

    observer.observe(doc.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-tutorial-id', 'data-tutorial-key', 'hidden', 'aria-hidden', 'class', 'open'],
    });

    options.signal?.addEventListener('abort', onAbort, { once: true });
  });
}

/**
 * Automatismos seguros previos al resaltado. Nunca envían formularios ni disparan
 * operaciones de negocio: sólo hacen visible lo que el usuario debe ver.
 */
export function revealTarget(element: Element): void {
  let parent: Element | null = element.parentElement;
  while (parent) {
    if (parent instanceof HTMLDetailsElement && !parent.open) parent.open = true;
    parent = parent.parentElement;
  }
}

export function scrollTargetIntoView(element: Element, prefersReducedMotion: boolean): void {
  // jsdom no implementa scrollIntoView; en pruebas el paso simplemente no hace scroll.
  if (typeof element.scrollIntoView !== 'function') return;
  element.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'center',
    inline: 'nearest',
  });
}

export function focusTarget(element: Element): void {
  if (element instanceof HTMLElement) element.focus({ preventScroll: true });
}
