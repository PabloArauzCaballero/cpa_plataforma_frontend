import type { TutorialExpectedAction, TutorialStep } from '../domain/TutorialDefinition';
import { resolveActionTarget } from '../domain/TutorialDefinition';
import { normalizeRoute } from '../domain/tutorialRoutes';
import { waitForTarget } from './targetResolver';

export interface StepActionContext {
  doc: Document;
  /** Ruta actual, consultada en el momento de evaluar la acción. */
  getRoute(): string;
  /** Se invoca (una sola vez) cuando el usuario cumple la acción esperada. */
  onSatisfied(): void;
}

export interface StepActionWatcher {
  /** Notifica un cambio de ruta; sólo relevante para acciones de tipo `navigate`. */
  notifyRouteChange(route: string): void;
  /** ¿La acción ya está cumplida? */
  isSatisfied(): boolean;
  dispose(): void;
}

const NOOP_WATCHER: StepActionWatcher = {
  notifyRouteChange: () => {},
  isSatisfied: () => true,
  dispose: () => {},
};

function matchesSelector(node: EventTarget | null, selector: string): Element | null {
  if (!(node instanceof Element)) return null;
  try {
    return node.closest(selector);
  } catch {
    return null;
  }
}

function readValueLength(element: Element): number {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) return element.value.trim().length;
  if (element instanceof HTMLSelectElement) return element.value.trim().length;
  return 0;
}

/**
 * Observa la acción que el paso exige del usuario.
 *
 * La observación es pasiva: escucha en fase de captura sobre el documento y nunca
 * intercepta ni cancela el evento, de modo que la aplicación se comporta exactamente
 * igual con el tutorial abierto que sin él.
 */
export function watchStepAction(step: TutorialStep, context: StepActionContext): StepActionWatcher {
  const action: TutorialExpectedAction = step.expectedAction ?? { type: 'none' };
  if (action.type === 'none') return NOOP_WATCHER;

  let satisfied = false;
  const controller = new AbortController();

  const satisfy = () => {
    if (satisfied) return;
    satisfied = true;
    controller.abort();
    context.onSatisfied();
  };

  const selector = resolveActionTarget(step);

  if (action.type === 'navigate') {
    const expected = normalizeRoute(action.route);
    if (normalizeRoute(context.getRoute()) === expected) {
      // Ya estamos donde había que llegar: el paso arranca cumplido.
      satisfied = true;
      return { notifyRouteChange: () => {}, isSatisfied: () => true, dispose: () => controller.abort() };
    }
    return {
      notifyRouteChange: (route) => {
        if (normalizeRoute(route) === expected) satisfy();
      },
      isSatisfied: () => satisfied,
      dispose: () => controller.abort(),
    };
  }

  if (!selector) return NOOP_WATCHER;

  if (action.type === 'appear') {
    void waitForTarget(selector, {
      doc: context.doc,
      signal: controller.signal,
      timeoutMs: step.waitForTargetMs,
    }).then((element) => {
      if (element) satisfy();
    });
    return {
      notifyRouteChange: () => {},
      isSatisfied: () => satisfied,
      dispose: () => controller.abort(),
    };
  }

  const eventName = action.type === 'click' ? 'click' : action.type === 'input' ? 'input' : 'change';
  const minLength = action.type === 'input' ? (action.minLength ?? 1) : 0;

  const handler = (event: Event) => {
    const element = matchesSelector(event.target, selector);
    if (!element) return;
    if (action.type === 'input' && readValueLength(element) < minLength) return;
    satisfy();
  };

  context.doc.addEventListener(eventName, handler, { capture: true, signal: controller.signal });

  return {
    notifyRouteChange: () => {},
    isSatisfied: () => satisfied,
    dispose: () => controller.abort(),
  };
}

/** Texto de ayuda por defecto según el tipo de acción, si el paso no aporta el suyo. */
export function describeExpectedAction(action: TutorialExpectedAction | undefined): string | null {
  if (!action) return null;
  switch (action.type) {
    case 'click':
      return 'Haz clic en el elemento resaltado para continuar.';
    case 'input':
      return 'Escribe en el campo resaltado para continuar.';
    case 'change':
      return 'Elige una opción en el campo resaltado para continuar.';
    case 'navigate':
      return 'Abre la pantalla indicada para continuar.';
    case 'appear':
      return 'Esperando a que la información termine de cargarse...';
    default:
      return null;
  }
}
