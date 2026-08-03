import { getStoredSession, normalizeToken, userHasAnyPermission } from '@/shared/auth/session';
import type { TutorialAccess, TutorialDefinition, TutorialStep } from './TutorialDefinition';
import { getOrderedSteps } from './TutorialDefinition';

/**
 * Vista mínima de la sesión que necesita el motor. Se inyecta como puerto para que las
 * reglas de visibilidad sean comprobables sin depender de `localStorage`.
 */
export interface TutorialViewer {
  roles: string[];
  isSuperUser: boolean;
  /** Delegado en la política de permisos real de la aplicación. */
  hasPermission(required: string | string[] | undefined): boolean;
}

/** Viewer construido a partir de la sesión almacenada del usuario autenticado. */
export function createSessionViewer(): TutorialViewer {
  const session = getStoredSession();
  return {
    roles: (session?.roles ?? []).map(normalizeToken),
    isSuperUser: Boolean(session?.esSuperUsuario),
    hasPermission: (required) => userHasAnyPermission(required),
  };
}

/** Viewer sin sesión: sólo ve tutoriales sin restricciones. */
export function createAnonymousViewer(): TutorialViewer {
  return { roles: [], isSuperUser: false, hasPermission: (required) => !required };
}

export function viewerCanAccess(access: TutorialAccess | undefined, viewer: TutorialViewer): boolean {
  if (!access) return true;
  if (viewer.isSuperUser) return true;
  if (access.superUserOnly) return false;

  const checks: boolean[] = [];

  if (access.roles && access.roles.length > 0) {
    const required = access.roles.map(normalizeToken);
    const granted = new Set(viewer.roles);
    checks.push(required.some((role) => granted.has(role)));
  }

  if (access.permissions && access.permissions.length > 0) {
    checks.push(access.permissions.some((permission) => viewer.hasPermission(permission)));
  }

  // Sin condiciones declaradas (por ejemplo `{ superUserOnly: false }`) el acceso es libre.
  if (checks.length === 0) return true;

  return access.match === 'all' ? checks.every(Boolean) : checks.some(Boolean);
}

export function stepIsVisibleFor(step: TutorialStep, viewer: TutorialViewer): boolean {
  return viewerCanAccess(step.access, viewer);
}

export function tutorialIsVisibleFor(tutorial: TutorialDefinition, viewer: TutorialViewer): boolean {
  if (!viewerCanAccess(tutorial.access, viewer)) return false;
  // Un tutorial cuyos pasos quedan todos filtrados por rol no aporta nada: se oculta.
  return getOrderedSteps(tutorial).some((step) => stepIsVisibleFor(step, viewer));
}

/**
 * Devuelve el tutorial con sus pasos filtrados y renumerados para el usuario actual.
 * El indicador de progreso siempre refleja los pasos que el usuario verá de verdad.
 */
export function resolveTutorialForViewer(
  tutorial: TutorialDefinition,
  viewer: TutorialViewer,
): TutorialDefinition {
  const steps = getOrderedSteps(tutorial).filter((step) => stepIsVisibleFor(step, viewer));
  return { ...tutorial, steps: steps.map((step, index) => ({ ...step, order: index + 1 })) };
}
