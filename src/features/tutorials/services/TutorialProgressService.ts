import type { TutorialDefinition } from '../domain/TutorialDefinition';
import type { TutorialProgressEntry, TutorialProgressMap } from '../domain/TutorialProgress';
import { createProgressEntry } from '../domain/TutorialProgress';
import type { TutorialFinishEvent, TutorialStepProgressEvent } from '../engine/TutorialEngine';
import type { TutorialProgressStorage } from './LocalTutorialProgressStorage';

export type ProgressListener = (progress: TutorialProgressMap) => void;

export interface TutorialProgressServiceOptions {
  storage: TutorialProgressStorage;
  /** Reloj inyectable: las pruebas no dependen de la hora real. */
  now?: () => string;
}

function toMap(entries: TutorialProgressEntry[]): TutorialProgressMap {
  return entries.reduce<TutorialProgressMap>((acc, entry) => {
    acc[entry.tutorialId] = entry;
    return acc;
  }, {});
}

/**
 * Coordina los eventos del motor con la persistencia.
 *
 * Mantiene el mapa de avance en memoria (fuente para la UI), lo publica a los
 * suscriptores y lo escribe mediante el `TutorialProgressStorage` configurado.
 * No sabe nada de React ni de driver.js.
 */
export class TutorialProgressService {
  private progress: TutorialProgressMap = {};
  private readonly listeners = new Set<ProgressListener>();
  private readonly storage: TutorialProgressStorage;
  private readonly now: () => string;
  private loaded = false;

  constructor(options: TutorialProgressServiceOptions) {
    this.storage = options.storage;
    this.now = options.now ?? (() => new Date().toISOString());
  }

  getProgress(): TutorialProgressMap {
    return this.progress;
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  describeSource(): 'backend' | 'local' {
    return this.storage.describeSource();
  }

  subscribe(listener: ProgressListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async load(): Promise<TutorialProgressMap> {
    const entries = await this.storage.load();
    this.progress = toMap(entries);
    this.loaded = true;
    this.publish();
    return this.progress;
  }

  /** Marca el inicio (o reinicio) de un tutorial. Idempotente para un mismo estado. */
  async markStarted(tutorial: TutorialDefinition): Promise<void> {
    const now = this.now();
    const previous = this.progress[tutorial.id];
    const entry: TutorialProgressEntry = {
      ...(previous ?? createProgressEntry(tutorial, now)),
      version: tutorial.version,
      status: 'en_progreso',
      startedAt: previous?.startedAt ?? now,
      completedAt: null,
      lastInteractionAt: now,
    };
    await this.persist(entry);
  }

  async markStep(event: TutorialStepProgressEvent): Promise<void> {
    const now = this.now();
    const previous = this.progress[event.tutorialId];
    const entry: TutorialProgressEntry = {
      tutorialId: event.tutorialId,
      version: event.version,
      status: 'en_progreso',
      currentStepId: event.stepId,
      currentStepIndex: event.stepIndex,
      startedAt: previous?.startedAt ?? now,
      completedAt: null,
      lastInteractionAt: now,
      repetitions: previous?.repetitions ?? 0,
    };
    await this.persist(entry);
  }

  async markFinished(event: TutorialFinishEvent): Promise<void> {
    const now = this.now();
    const previous = this.progress[event.tutorialId];
    const completed = event.reason === 'completed';

    const entry: TutorialProgressEntry = {
      tutorialId: event.tutorialId,
      version: event.version,
      status: completed ? 'completado' : event.reason === 'skipped' ? 'omitido' : 'en_progreso',
      // Al completar se vuelve al principio: repetir empieza desde el paso 1.
      currentStepId: completed ? null : event.stepId,
      currentStepIndex: completed ? 0 : event.stepIndex,
      startedAt: previous?.startedAt ?? now,
      completedAt: completed ? now : null,
      lastInteractionAt: now,
      repetitions: (previous?.repetitions ?? 0) + (completed ? 1 : 0),
    };
    await this.persist(entry);
  }

  /** Devuelve el tutorial a "pendiente" sin borrar el histórico de repeticiones. */
  async restart(tutorial: TutorialDefinition): Promise<void> {
    const now = this.now();
    const previous = this.progress[tutorial.id];
    await this.persist({
      tutorialId: tutorial.id,
      version: tutorial.version,
      status: 'pendiente',
      currentStepId: null,
      currentStepIndex: 0,
      startedAt: null,
      completedAt: null,
      lastInteractionAt: now,
      repetitions: previous?.repetitions ?? 0,
    });
  }

  /** Borra por completo el avance de un tutorial. */
  async reset(tutorialId: string): Promise<void> {
    const { [tutorialId]: _removed, ...rest } = this.progress;
    this.progress = rest;
    this.publish();
    await this.storage.reset(tutorialId);
  }

  async resetAll(): Promise<void> {
    this.progress = {};
    this.publish();
    await this.storage.resetAll();
  }

  private async persist(entry: TutorialProgressEntry): Promise<void> {
    this.progress = { ...this.progress, [entry.tutorialId]: entry };
    this.publish();
    await this.storage.save(entry);
  }

  private publish(): void {
    this.listeners.forEach((listener) => listener(this.progress));
  }
}
