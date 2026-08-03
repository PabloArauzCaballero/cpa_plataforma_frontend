/**
 * Contratos del motor de tutoriales.
 *
 * Estos tipos son la única fuente de verdad de "qué es un tutorial". Son puramente
 * declarativos: no conocen React, ni driver.js, ni el backend. Agregar un tutorial
 * nuevo consiste en escribir un objeto que cumpla `TutorialDefinition` y registrarlo
 * en el catálogo — el núcleo no se toca.
 */

/** Lado por el que se muestra el globo respecto del elemento resaltado. */
export type TutorialPlacement = 'top' | 'right' | 'bottom' | 'left' | 'center';

/** Alineación del globo sobre el eje libre del `placement`. */
export type TutorialAlign = 'start' | 'center' | 'end';

export type TutorialCategory =
  | 'introduccion'
  | 'navegacion'
  | 'cuenta'
  | 'modulo'
  | 'operacion'
  | 'rol';

export type TutorialDifficulty = 'basico' | 'intermedio' | 'avanzado';

/**
 * Restricción de visibilidad. Se evalúa contra la sesión real del usuario; el motor
 * nunca la usa para saltarse una validación de permisos, sólo para ocultar contenido
 * que el usuario no podría ejecutar.
 */
export interface TutorialAccess {
  /** Basta con tener uno de estos roles. */
  roles?: string[];
  /** Basta con tener uno de estos permisos (misma sintaxis que `resource.permissions`). */
  permissions?: string[];
  /** Sólo visible para super usuarios. Se evalúa siempre, al margen de `match`. */
  superUserOnly?: boolean;
  /**
   * Cómo se combinan `roles` y `permissions` cuando se declaran ambos:
   *
   * · `'any'` (por defecto) — basta con cumplir una de las dos. Es lo habitual: son dos
   *   formas de identificar al mismo perfil, y el backend puede enviar sólo roles o sólo
   *   matriz de permisos según la instalación.
   * · `'all'` — hay que cumplir las dos. Úsalo cuando el tutorial muestre algo que exige
   *   simultáneamente pertenecer a un área y tener un permiso concreto.
   */
  match?: 'any' | 'all';
}

/**
 * Acción que el usuario debe realizar antes de que el paso se dé por cumplido.
 * Mientras no se cumpla, el botón "Siguiente" queda deshabilitado y se muestra la ayuda.
 */
export type TutorialExpectedAction =
  /** No hay que hacer nada: es un paso explicativo. */
  | { type: 'none' }
  /** Hacer clic sobre `target` (por defecto, el propio objetivo del paso). */
  | { type: 'click'; target?: string }
  /** Escribir en `target` al menos `minLength` caracteres. */
  | { type: 'input'; target?: string; minLength?: number }
  /** Elegir un valor en un `select` / `checkbox` / `radio`. */
  | { type: 'change'; target?: string }
  /** Llegar a una ruta concreta (por navegación del usuario). */
  | { type: 'navigate'; route: string }
  /** Esperar a que aparezca un elemento (típico tras una petición al backend). */
  | { type: 'appear'; target: string };

/**
 * Automatismos seguros que el motor puede ejecutar por el usuario antes de mostrar el paso.
 * Deliberadamente NO existe una acción que envíe formularios, borre o pague:
 * el motor jamás dispara operaciones destructivas ni sensibles.
 */
export type TutorialAutoAction =
  /** Abre el `<details>`/`<summary>` contenedor para que el objetivo sea visible. */
  | 'reveal'
  /** Lleva el foco al objetivo (útil en formularios). */
  | 'focus'
  /** Hace scroll hasta el objetivo. */
  | 'scroll';

export interface TutorialStep {
  /** Identificador único dentro del tutorial. */
  id: string;
  /** Orden explícito (1..n). El motor ordena por este campo, no por la posición del array. */
  order: number;
  title: string;
  description: string;
  /**
   * Selector CSS del elemento a resaltar. Se recomienda `[data-tutorial-id="..."]`
   * mediante los helpers de `tutorialAnchors`, nunca clases CSS (son frágiles).
   * Si se omite, el paso se muestra como tarjeta centrada.
   */
  target?: string;
  placement?: TutorialPlacement;
  align?: TutorialAlign;
  /** Ruta en la que debe ejecutarse. Si no coincide con la actual, el motor navega. */
  route?: string;
  /** Acción exigida antes de avanzar. Por defecto, ninguna. */
  expectedAction?: TutorialExpectedAction;
  /** Texto de ayuda mostrado mientras la acción está pendiente o el objetivo no aparece. */
  hint?: string;
  /** Automatismo seguro previo al resaltado. */
  autoAction?: TutorialAutoAction;
  /** Espera máxima para elementos que se cargan de forma asíncrona (ms). */
  waitForTargetMs?: number;
  /** Si el objetivo no existe, el paso se omite en silencio en lugar de mostrar el error. */
  optional?: boolean;
  /**
   * Permite interactuar con el elemento resaltado. Por defecto es `true` cuando el paso
   * exige una acción y `false` cuando es puramente explicativo.
   */
  allowInteraction?: boolean;
  /** Oculta el paso a usuarios sin el rol/permiso indicado. */
  access?: TutorialAccess;
}

export interface TutorialDefinition {
  id: string;
  /** Versión semántica del contenido. Cambiar mayor/menor obliga a repetir el tutorial. */
  version: string;
  title: string;
  description: string;
  category: TutorialCategory;
  difficulty: TutorialDifficulty;
  /** Ruta donde arranca el recorrido. */
  route?: string;
  /** Módulo de negocio al que pertenece (clave de `resourceModules`). */
  moduleKey?: string;
  access?: TutorialAccess;
  estimatedMinutes: number;
  /** Se marca como obligatorio en el Centro de Tutoriales. */
  mandatory?: boolean;
  /** Aparece en "Recomendados para ti". */
  recommended?: boolean;
  /** Ids de tutoriales que conviene completar antes. */
  prerequisites?: string[];
  /** Tutorial encadenado que se ofrece al terminar éste. */
  nextTutorialId?: string;
  tags?: string[];
  steps: TutorialStep[];
}

export const DEFAULT_WAIT_FOR_TARGET_MS = 6000;

/** Un paso exige interacción salvo que se declare lo contrario de forma explícita. */
export function stepAllowsInteraction(step: TutorialStep): boolean {
  if (step.allowInteraction !== undefined) return step.allowInteraction;
  return Boolean(step.expectedAction && step.expectedAction.type !== 'none');
}

/** Selector efectivo sobre el que se observa la acción esperada del paso. */
export function resolveActionTarget(step: TutorialStep): string | undefined {
  const action = step.expectedAction;
  if (!action) return undefined;
  if (action.type === 'click' || action.type === 'input' || action.type === 'change') {
    return action.target ?? step.target;
  }
  if (action.type === 'appear') return action.target;
  return undefined;
}

/** Pasos ordenados por `order`, con desempate estable por id. */
export function getOrderedSteps(tutorial: TutorialDefinition): TutorialStep[] {
  return [...tutorial.steps].sort((a, b) => (a.order === b.order ? a.id.localeCompare(b.id) : a.order - b.order));
}
