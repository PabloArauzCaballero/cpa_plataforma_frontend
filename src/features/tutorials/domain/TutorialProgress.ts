import type { TutorialDefinition } from './TutorialDefinition';

export type TutorialStatus = 'pendiente' | 'en_progreso' | 'completado' | 'omitido';

/** Registro persistido del avance de un usuario en un tutorial concreto. */
export interface TutorialProgressEntry {
  tutorialId: string;
  /** Versión del tutorial con la que se generó este avance. */
  version: string;
  status: TutorialStatus;
  /** Paso en el que quedó el usuario (id estable, no índice). */
  currentStepId: string | null;
  currentStepIndex: number;
  startedAt: string | null;
  completedAt: string | null;
  lastInteractionAt: string;
  /** Cuántas veces se completó el tutorial (repeticiones). */
  repetitions: number;
}

export type TutorialProgressMap = Record<string, TutorialProgressEntry>;

/** Estado ya resuelto contra la definición vigente (aplica la política de versiones). */
export interface TutorialProgressView {
  tutorialId: string;
  status: TutorialStatus;
  currentStepIndex: number;
  currentStepId: string | null;
  completedSteps: number;
  totalSteps: number;
  percent: number;
  repetitions: number;
  startedAt: string | null;
  completedAt: string | null;
  /** El tutorial cambió de versión de forma relevante y conviene repetirlo. */
  outdated: boolean;
  /** Prerrequisitos aún sin completar. */
  missingPrerequisites: string[];
}

interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
}

function parseVersion(value: string): ParsedVersion {
  const [major = '0', minor = '0', patch = '0'] = value.split('.');
  return {
    major: Number.parseInt(major, 10) || 0,
    minor: Number.parseInt(minor, 10) || 0,
    patch: Number.parseInt(patch, 10) || 0,
  };
}

/**
 * Política de versionado: un cambio de `major` o `minor` significa que el contenido
 * cambió de forma sustantiva y el usuario debe repetirlo. Un cambio de `patch`
 * (corrección de redacción) conserva el "completado".
 */
export function requiresRetakeAfterVersionChange(completedVersion: string, currentVersion: string): boolean {
  if (completedVersion === currentVersion) return false;
  const previous = parseVersion(completedVersion);
  const next = parseVersion(currentVersion);
  return previous.major !== next.major || previous.minor !== next.minor;
}

export function createProgressEntry(tutorial: TutorialDefinition, now: string): TutorialProgressEntry {
  return {
    tutorialId: tutorial.id,
    version: tutorial.version,
    status: 'pendiente',
    currentStepId: null,
    currentStepIndex: 0,
    startedAt: null,
    completedAt: null,
    lastInteractionAt: now,
    repetitions: 0,
  };
}

function clampIndex(index: number, total: number): number {
  if (!Number.isFinite(index) || index < 0) return 0;
  return total === 0 ? 0 : Math.min(index, total - 1);
}

/**
 * Combina la definición vigente con el avance persistido.
 *
 * Es aquí donde se resuelven los casos incómodos: versión obsoleta, paso que ya no
 * existe, prerrequisitos pendientes. La UI sólo consume el resultado.
 */
export function resolveProgressView(
  tutorial: TutorialDefinition,
  entry: TutorialProgressEntry | undefined,
  allProgress: TutorialProgressMap,
): TutorialProgressView {
  const totalSteps = tutorial.steps.length;
  const missingPrerequisites = (tutorial.prerequisites ?? []).filter((id) => allProgress[id]?.status !== 'completado');

  if (!entry) {
    return {
      tutorialId: tutorial.id,
      status: 'pendiente',
      currentStepIndex: 0,
      currentStepId: tutorial.steps[0]?.id ?? null,
      completedSteps: 0,
      totalSteps,
      percent: 0,
      repetitions: 0,
      startedAt: null,
      completedAt: null,
      outdated: false,
      missingPrerequisites,
    };
  }

  const outdated = entry.status === 'completado' && requiresRetakeAfterVersionChange(entry.version, tutorial.version);
  const status: TutorialStatus = outdated ? 'pendiente' : entry.status;

  // El paso guardado se localiza por id: si se reordenó el tutorial, el usuario
  // vuelve al paso correcto y no a un índice desplazado.
  const indexById = entry.currentStepId ? tutorial.steps.findIndex((step) => step.id === entry.currentStepId) : -1;
  const currentStepIndex =
    status === 'completado' ? totalSteps : clampIndex(indexById >= 0 ? indexById : entry.currentStepIndex, totalSteps);

  const completedSteps = status === 'completado' ? totalSteps : Math.min(currentStepIndex, totalSteps);
  const percent = totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);

  return {
    tutorialId: tutorial.id,
    status,
    currentStepIndex: status === 'completado' ? 0 : currentStepIndex,
    currentStepId: tutorial.steps[Math.min(currentStepIndex, Math.max(totalSteps - 1, 0))]?.id ?? null,
    completedSteps,
    totalSteps,
    percent,
    repetitions: entry.repetitions,
    startedAt: entry.startedAt,
    completedAt: outdated ? null : entry.completedAt,
    outdated,
    missingPrerequisites,
  };
}

export interface TutorialOverallProgress {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  skipped: number;
  percent: number;
}

export function summarizeProgress(views: TutorialProgressView[]): TutorialOverallProgress {
  const completed = views.filter((view) => view.status === 'completado').length;
  const inProgress = views.filter((view) => view.status === 'en_progreso').length;
  const skipped = views.filter((view) => view.status === 'omitido').length;
  const total = views.length;
  return {
    total,
    completed,
    inProgress,
    skipped,
    pending: total - completed - inProgress - skipped,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}
