import type { TutorialDefinition } from '../domain/TutorialDefinition';
import { TutorialRegistry } from '../registry/TutorialRegistry';
import { moduleTutorials } from './moduleTutorials';
import { operationTutorials } from './operationTutorials';
import { platformTutorials } from './platformTutorials';
import { roleTutorials } from './roleTutorials';

/**
 * Catálogo completo.
 *
 * Añadir un tutorial = añadir un objeto a uno de estos archivos (o crear uno nuevo y
 * sumarlo aquí). El motor, el registro, la persistencia y el Centro de Tutoriales no
 * necesitan ningún cambio.
 */
export const tutorialCatalog: TutorialDefinition[] = [
  ...platformTutorials,
  ...operationTutorials,
  ...moduleTutorials,
  ...roleTutorials,
];

/** Tutorial que se ofrece automáticamente la primera vez que alguien entra. */
export const FIRST_RUN_TUTORIAL_ID = 'intro-plataforma';

export interface CreateRegistryOptions {
  /**
   * Vuelca los problemas de configuración en consola. La capa React lo activa en
   * desarrollo para que un tutorial mal escrito se vea al recargar, no cuando un
   * usuario lo abra. Es un parámetro (y no una lectura de `import.meta`) para que este
   * módulo pueda importarse desde las pruebas.
   */
  logIssues?: boolean;
}

export function createTutorialRegistry(
  tutorials: TutorialDefinition[] = tutorialCatalog,
  options: CreateRegistryOptions = {},
): TutorialRegistry {
  const registry = new TutorialRegistry(tutorials);

  if (options.logIssues) {
    registry.validate().forEach((issue) => {
      const log = issue.severity === 'error' ? console.error : console.warn;
      log(`[tutoriales] ${issue.code}: ${issue.message}`);
    });
  }

  return registry;
}

export { moduleTutorials, operationTutorials, platformTutorials, roleTutorials };
