import type { TutorialDefinition, TutorialStep } from './TutorialDefinition';
import { resolveActionTarget } from './TutorialDefinition';
import { validateTutorialRoute } from './tutorialRoutes';

export type TutorialIssueSeverity = 'error' | 'warning';

export type TutorialIssueCode =
  | 'duplicate-tutorial-id'
  | 'empty-tutorial'
  | 'invalid-version'
  | 'duplicate-step-id'
  | 'invalid-step-order'
  | 'missing-step-target'
  | 'invalid-route'
  | 'unknown-prerequisite'
  | 'circular-prerequisite'
  | 'unknown-next-tutorial'
  | 'unreachable-for-roles'
  | 'invalid-action';

export interface TutorialIssue {
  severity: TutorialIssueSeverity;
  code: TutorialIssueCode;
  tutorialId: string;
  stepId?: string;
  message: string;
}

const VERSION_PATTERN = /^\d+\.\d+\.\d+$/;

function validateSteps(tutorial: TutorialDefinition): TutorialIssue[] {
  const issues: TutorialIssue[] = [];
  const seenStepIds = new Set<string>();
  const seenOrders = new Set<number>();

  for (const step of tutorial.steps) {
    if (seenStepIds.has(step.id)) {
      issues.push({
        severity: 'error',
        code: 'duplicate-step-id',
        tutorialId: tutorial.id,
        stepId: step.id,
        message: `El paso "${step.id}" está repetido dentro del tutorial "${tutorial.id}".`,
      });
    }
    seenStepIds.add(step.id);

    if (!Number.isInteger(step.order) || step.order < 1) {
      issues.push({
        severity: 'error',
        code: 'invalid-step-order',
        tutorialId: tutorial.id,
        stepId: step.id,
        message: `El paso "${step.id}" tiene un orden inválido (${step.order}). Debe ser un entero ≥ 1.`,
      });
    } else if (seenOrders.has(step.order)) {
      issues.push({
        severity: 'error',
        code: 'invalid-step-order',
        tutorialId: tutorial.id,
        stepId: step.id,
        message: `El orden ${step.order} está duplicado en el tutorial "${tutorial.id}".`,
      });
    }
    seenOrders.add(step.order);

    issues.push(...validateStepContent(tutorial, step));
  }

  return issues;
}

function validateStepContent(tutorial: TutorialDefinition, step: TutorialStep): TutorialIssue[] {
  const issues: TutorialIssue[] = [];

  if (!step.title.trim() || !step.description.trim()) {
    issues.push({
      severity: 'error',
      code: 'missing-step-target',
      tutorialId: tutorial.id,
      stepId: step.id,
      message: `El paso "${step.id}" necesita título y descripción.`,
    });
  }

  if (step.route) {
    const routeCheck = validateTutorialRoute(step.route);
    if (!routeCheck.valid) {
      issues.push({
        severity: 'error',
        code: 'invalid-route',
        tutorialId: tutorial.id,
        stepId: step.id,
        message: `Paso "${step.id}": ${routeCheck.reason}.`,
      });
    }
  }

  const action = step.expectedAction;
  if (action && action.type !== 'none') {
    if (action.type === 'navigate') {
      const routeCheck = validateTutorialRoute(action.route);
      if (!routeCheck.valid) {
        issues.push({
          severity: 'error',
          code: 'invalid-route',
          tutorialId: tutorial.id,
          stepId: step.id,
          message: `La acción esperada del paso "${step.id}" apunta a una ruta inválida: ${routeCheck.reason}.`,
        });
      }
    } else if (!resolveActionTarget(step)) {
      issues.push({
        severity: 'error',
        code: 'invalid-action',
        tutorialId: tutorial.id,
        stepId: step.id,
        message: `El paso "${step.id}" exige una acción "${action.type}" pero no define elemento objetivo.`,
      });
    }
  }

  // Un paso puramente explicativo sin objetivo es válido (tarjeta centrada), pero uno
  // que pretende resaltar algo y no lo declara es casi siempre un descuido.
  if (!step.target && step.placement && step.placement !== 'center') {
    issues.push({
      severity: 'warning',
      code: 'missing-step-target',
      tutorialId: tutorial.id,
      stepId: step.id,
      message: `El paso "${step.id}" define posición "${step.placement}" sin elemento objetivo; se mostrará centrado.`,
    });
  }

  return issues;
}

function detectCircularPrerequisites(tutorials: TutorialDefinition[]): TutorialIssue[] {
  const byId = new Map(tutorials.map((tutorial) => [tutorial.id, tutorial]));
  const issues: TutorialIssue[] = [];
  const state = new Map<string, 'visiting' | 'done'>();

  function visit(id: string, trail: string[]): void {
    const current = state.get(id);
    if (current === 'done') return;
    if (current === 'visiting') {
      issues.push({
        severity: 'error',
        code: 'circular-prerequisite',
        tutorialId: id,
        message: `Dependencia circular de prerrequisitos: ${[...trail, id].join(' → ')}.`,
      });
      return;
    }

    state.set(id, 'visiting');
    for (const prerequisite of byId.get(id)?.prerequisites ?? []) {
      if (byId.has(prerequisite)) visit(prerequisite, [...trail, id]);
    }
    state.set(id, 'done');
  }

  tutorials.forEach((tutorial) => visit(tutorial.id, []));
  return issues;
}

/**
 * Valida el catálogo completo. Se ejecuta en las pruebas (falla la build si hay errores)
 * y en desarrollo al registrar, para que una configuración rota se detecte al escribirla
 * y no cuando un usuario abre el tutorial.
 */
export function validateTutorialCatalog(tutorials: TutorialDefinition[]): TutorialIssue[] {
  const issues: TutorialIssue[] = [];
  const ids = new Set<string>();

  for (const tutorial of tutorials) {
    if (ids.has(tutorial.id)) {
      issues.push({
        severity: 'error',
        code: 'duplicate-tutorial-id',
        tutorialId: tutorial.id,
        message: `El identificador de tutorial "${tutorial.id}" está duplicado.`,
      });
    }
    ids.add(tutorial.id);

    if (tutorial.steps.length === 0) {
      issues.push({
        severity: 'error',
        code: 'empty-tutorial',
        tutorialId: tutorial.id,
        message: `El tutorial "${tutorial.id}" no tiene pasos.`,
      });
    }

    if (!VERSION_PATTERN.test(tutorial.version)) {
      issues.push({
        severity: 'error',
        code: 'invalid-version',
        tutorialId: tutorial.id,
        message: `La versión "${tutorial.version}" del tutorial "${tutorial.id}" no sigue el formato mayor.menor.parche.`,
      });
    }

    if (tutorial.route) {
      const routeCheck = validateTutorialRoute(tutorial.route);
      if (!routeCheck.valid) {
        issues.push({
          severity: 'error',
          code: 'invalid-route',
          tutorialId: tutorial.id,
          message: `Tutorial "${tutorial.id}": ${routeCheck.reason}.`,
        });
      }
    }

    issues.push(...validateSteps(tutorial));
  }

  for (const tutorial of tutorials) {
    for (const prerequisite of tutorial.prerequisites ?? []) {
      if (!ids.has(prerequisite)) {
        issues.push({
          severity: 'error',
          code: 'unknown-prerequisite',
          tutorialId: tutorial.id,
          message: `El prerrequisito "${prerequisite}" del tutorial "${tutorial.id}" no existe.`,
        });
      }
    }

    if (tutorial.nextTutorialId && !ids.has(tutorial.nextTutorialId)) {
      issues.push({
        severity: 'error',
        code: 'unknown-next-tutorial',
        tutorialId: tutorial.id,
        message: `El tutorial encadenado "${tutorial.nextTutorialId}" del tutorial "${tutorial.id}" no existe.`,
      });
    }

    issues.push(...validateAccessCompatibility(tutorial, tutorials));
  }

  issues.push(...detectCircularPrerequisites(tutorials));

  return issues;
}

/**
 * Detecta configuraciones incompatibles con determinados roles: un tutorial visible para
 * un rol cuyo prerrequisito está restringido a otro rol es inalcanzable para siempre.
 */
function validateAccessCompatibility(
  tutorial: TutorialDefinition,
  tutorials: TutorialDefinition[],
): TutorialIssue[] {
  const roles = tutorial.access?.roles;
  if (!roles || roles.length === 0) return [];

  const byId = new Map(tutorials.map((item) => [item.id, item]));
  const issues: TutorialIssue[] = [];

  for (const prerequisiteId of tutorial.prerequisites ?? []) {
    const prerequisiteRoles = byId.get(prerequisiteId)?.access?.roles;
    if (!prerequisiteRoles || prerequisiteRoles.length === 0) continue;
    const shared = roles.some((role) => prerequisiteRoles.includes(role));
    if (!shared) {
      issues.push({
        severity: 'error',
        code: 'unreachable-for-roles',
        tutorialId: tutorial.id,
        message: `El tutorial "${tutorial.id}" exige "${prerequisiteId}", que ningún rol suyo puede ver.`,
      });
    }
  }

  return issues;
}

export function getBlockingIssues(issues: TutorialIssue[]): TutorialIssue[] {
  return issues.filter((issue) => issue.severity === 'error');
}

export function formatIssues(issues: TutorialIssue[]): string {
  return issues.map((issue) => `[${issue.severity}] ${issue.code}: ${issue.message}`).join('\n');
}
