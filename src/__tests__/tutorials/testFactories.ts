import type { TutorialDefinition, TutorialStep } from '@/features/tutorials/domain/TutorialDefinition';
import type { TutorialViewer } from '@/features/tutorials/domain/tutorialAccess';
import type { TutorialProgressEntry } from '@/features/tutorials/domain/TutorialProgress';
import type { TutorialProgressStorage } from '@/features/tutorials/services/LocalTutorialProgressStorage';

/** Espera a que se drenen las microtareas pendientes (resoluciones del motor). */
export function flush(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export function makeStep(overrides: Partial<TutorialStep> & Pick<TutorialStep, 'id' | 'order'>): TutorialStep {
  return {
    title: `Título ${overrides.id}`,
    description: `Descripción del paso ${overrides.id}`,
    ...overrides,
  };
}

export function makeTutorial(overrides: Partial<TutorialDefinition> & Pick<TutorialDefinition, 'id'>): TutorialDefinition {
  return {
    version: '1.0.0',
    title: `Tutorial ${overrides.id}`,
    description: 'Tutorial de prueba',
    category: 'operacion',
    difficulty: 'basico',
    estimatedMinutes: 1,
    steps: [makeStep({ id: 'paso-1', order: 1 })],
    ...overrides,
  };
}

export function makeViewer(overrides: Partial<TutorialViewer> = {}): TutorialViewer {
  return {
    roles: [],
    isSuperUser: false,
    hasPermission: () => true,
    ...overrides,
  };
}

/** Almacenamiento en memoria: sustituye a `localStorage` y al backend en las pruebas. */
export class InMemoryProgressStorage implements TutorialProgressStorage {
  readonly saved: TutorialProgressEntry[] = [];
  private entries = new Map<string, TutorialProgressEntry>();

  constructor(initial: TutorialProgressEntry[] = []) {
    initial.forEach((entry) => this.entries.set(entry.tutorialId, entry));
  }

  async load(): Promise<TutorialProgressEntry[]> {
    return Array.from(this.entries.values());
  }

  async save(entry: TutorialProgressEntry): Promise<void> {
    this.saved.push(entry);
    this.entries.set(entry.tutorialId, entry);
  }

  async reset(tutorialId: string): Promise<void> {
    this.entries.delete(tutorialId);
  }

  async resetAll(): Promise<void> {
    this.entries.clear();
  }

  describeSource(): 'local' {
    return 'local';
  }
}

export function makeProgressEntry(
  overrides: Partial<TutorialProgressEntry> & Pick<TutorialProgressEntry, 'tutorialId'>,
): TutorialProgressEntry {
  return {
    version: '1.0.0',
    status: 'pendiente',
    currentStepId: null,
    currentStepIndex: 0,
    startedAt: null,
    completedAt: null,
    lastInteractionAt: '2026-01-01T00:00:00.000Z',
    repetitions: 0,
    ...overrides,
  };
}
