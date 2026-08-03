import type { TutorialCategory, TutorialDefinition } from '../domain/TutorialDefinition';
import { getOrderedSteps } from '../domain/TutorialDefinition';
import type { TutorialViewer } from '../domain/tutorialAccess';
import { resolveTutorialForViewer, tutorialIsVisibleFor } from '../domain/tutorialAccess';
import { normalizeRoute } from '../domain/tutorialRoutes';
import { getBlockingIssues, validateTutorialCatalog, type TutorialIssue } from '../domain/tutorialValidation';

export class DuplicateTutorialError extends Error {
  constructor(public readonly tutorialId: string) {
    super(`Ya existe un tutorial registrado con el identificador "${tutorialId}".`);
    this.name = 'DuplicateTutorialError';
  }
}

/**
 * Índice en memoria de las definiciones de tutorial.
 *
 * Es deliberadamente tonto: almacena, ordena, filtra por acceso y busca. Toda la
 * lógica de ejecución vive en `TutorialEngine` y toda la de contenido en el catálogo.
 */
export class TutorialRegistry {
  private readonly tutorials = new Map<string, TutorialDefinition>();

  constructor(tutorials: TutorialDefinition[] = []) {
    this.registerAll(tutorials);
  }

  register(tutorial: TutorialDefinition): void {
    if (this.tutorials.has(tutorial.id)) throw new DuplicateTutorialError(tutorial.id);
    // Se normaliza el orden una sola vez, al registrar, para que el resto del sistema
    // pueda tratar `steps` como una secuencia fiable.
    this.tutorials.set(tutorial.id, { ...tutorial, steps: getOrderedSteps(tutorial) });
  }

  registerAll(tutorials: TutorialDefinition[]): void {
    tutorials.forEach((tutorial) => this.register(tutorial));
  }

  has(id: string): boolean {
    return this.tutorials.has(id);
  }

  get(id: string): TutorialDefinition | undefined {
    return this.tutorials.get(id);
  }

  list(): TutorialDefinition[] {
    return Array.from(this.tutorials.values());
  }

  size(): number {
    return this.tutorials.size;
  }

  validate(): TutorialIssue[] {
    return validateTutorialCatalog(this.list());
  }

  /** Lanza si el catálogo tiene errores bloqueantes. Se usa en pruebas y en desarrollo. */
  assertValid(): void {
    const blocking = getBlockingIssues(this.validate());
    if (blocking.length > 0) {
      throw new Error(`Catálogo de tutoriales inválido:\n${blocking.map((issue) => `· ${issue.message}`).join('\n')}`);
    }
  }

  /** Tutoriales visibles para el usuario, con sus pasos ya filtrados por rol. */
  listFor(viewer: TutorialViewer): TutorialDefinition[] {
    return this.list()
      .filter((tutorial) => tutorialIsVisibleFor(tutorial, viewer))
      .map((tutorial) => resolveTutorialForViewer(tutorial, viewer));
  }

  /** Devuelve el tutorial resuelto para el usuario, o `undefined` si no puede verlo. */
  resolve(id: string, viewer: TutorialViewer): TutorialDefinition | undefined {
    const tutorial = this.tutorials.get(id);
    if (!tutorial || !tutorialIsVisibleFor(tutorial, viewer)) return undefined;
    return resolveTutorialForViewer(tutorial, viewer);
  }

  listByCategory(viewer: TutorialViewer, category: TutorialCategory): TutorialDefinition[] {
    return this.listFor(viewer).filter((tutorial) => tutorial.category === category);
  }

  listByModule(viewer: TutorialViewer, moduleKey: string): TutorialDefinition[] {
    return this.listFor(viewer).filter((tutorial) => tutorial.moduleKey === moduleKey);
  }

  /**
   * Tutorial contextual de una pantalla. Prioriza la coincidencia exacta de ruta y,
   * si no la hay, cae al tutorial del módulo — así el botón de ayuda del encabezado
   * siempre ofrece algo pertinente.
   */
  findContextual(
    viewer: TutorialViewer,
    context: { route?: string; moduleKey?: string },
  ): TutorialDefinition | undefined {
    const visible = this.listFor(viewer);

    if (context.route) {
      const route = normalizeRoute(context.route);
      const exact = visible.find((tutorial) => tutorial.route && normalizeRoute(tutorial.route) === route);
      if (exact) return exact;
    }

    if (context.moduleKey) {
      const byModule = visible.find(
        (tutorial) => tutorial.moduleKey === context.moduleKey && tutorial.category === 'modulo',
      );
      if (byModule) return byModule;
    }

    return undefined;
  }
}

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/** Búsqueda sin acentos sobre título, descripción, categoría y etiquetas. */
export function searchTutorials(tutorials: TutorialDefinition[], term: string): TutorialDefinition[] {
  const needle = normalizeSearchText(term.trim());
  if (!needle) return tutorials;

  return tutorials.filter((tutorial) => {
    const haystack = [
      tutorial.title,
      tutorial.description,
      tutorial.category,
      tutorial.difficulty,
      tutorial.moduleKey ?? '',
      ...(tutorial.tags ?? []),
    ].join(' ');
    return normalizeSearchText(haystack).includes(needle);
  });
}
