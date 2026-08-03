import { resolveProgressView } from '@/features/tutorials/domain/TutorialProgress';
import { TutorialEngine } from '@/features/tutorials/engine/TutorialEngine';
import type { TutorialRenderer, TutorialRenderView } from '@/features/tutorials/engine/TutorialRenderer';
import { TutorialRegistry } from '@/features/tutorials/registry/TutorialRegistry';
import { TutorialProgressService } from '@/features/tutorials/services/TutorialProgressService';
import { LocalTutorialProgressStorage } from '@/features/tutorials/services/LocalTutorialProgressStorage';
import { ResilientTutorialProgressStorage } from '@/features/tutorials/services/ResilientTutorialProgressStorage';
import type { TutorialProgressStorage } from '@/features/tutorials/services/LocalTutorialProgressStorage';
import type { TutorialProgressEntry } from '@/features/tutorials/domain/TutorialProgress';
import { InMemoryProgressStorage, flush, makeStep, makeTutorial, makeViewer } from './testFactories';

/**
 * Pruebas de integración: registro + motor + persistencia trabajando juntos, que es
 * donde aparecen los fallos que una prueba unitaria por pieza no ve.
 */

const NOW = '2026-08-03T12:00:00.000Z';

function buildStack(options: { storage?: TutorialProgressStorage; route?: string } = {}) {
  const registry = new TutorialRegistry([
    makeTutorial({
      id: 'recorrido',
      version: '1.0.0',
      steps: [
        makeStep({ id: 'uno', order: 1 }),
        makeStep({ id: 'dos', order: 2, access: { roles: ['ADMIN'] } }),
        makeStep({ id: 'tres', order: 3 }),
      ],
    }),
  ]);

  const storage = options.storage ?? new InMemoryProgressStorage();
  const progressService = new TutorialProgressService({ storage, now: () => NOW });

  const views: TutorialRenderView[] = [];
  const renderer: TutorialRenderer = {
    render: (view) => views.push(view),
    refresh: () => {},
    destroy: () => {},
  };

  let route = options.route ?? '/';
  const engine = new TutorialEngine({
    renderer,
    navigate: (target) => {
      route = target;
    },
    getCurrentRoute: () => route,
    onStepChange: (event) => void progressService.markStep(event),
    onFinish: (event) => void progressService.markFinished(event),
  });

  return { registry, progressService, engine, views, storage };
}

describe('recorrido completo · motor + progreso', () => {
  it('guarda el avance paso a paso y permite reanudar donde se dejó', async () => {
    const { registry, progressService, engine, views } = buildStack();
    const tutorial = registry.resolve('recorrido', makeViewer({ roles: ['ADMIN'] }))!;

    await progressService.markStarted(tutorial);
    engine.start(tutorial);
    await flush();

    engine.next();
    await flush();
    await flush();

    expect(progressService.getProgress().recorrido).toMatchObject({
      status: 'en_progreso',
      currentStepId: 'dos',
      currentStepIndex: 1,
    });

    engine.close({ confirm: false });
    await flush();

    // Reanudación: el usuario vuelve al paso guardado, no al principio.
    const view = resolveProgressView(tutorial, progressService.getProgress().recorrido, progressService.getProgress());
    expect(view.currentStepIndex).toBe(1);

    engine.start(tutorial, view.currentStepIndex);
    await flush();
    expect(views[views.length - 1].stepId).toBe('dos');
  });

  it('un usuario sin el rol recorre menos pasos y su progreso es coherente', async () => {
    const { registry, progressService, engine, views } = buildStack();
    const tutorial = registry.resolve('recorrido', makeViewer({ hasPermission: () => false }))!;

    expect(tutorial.steps.map((step) => step.id)).toEqual(['uno', 'tres']);

    await progressService.markStarted(tutorial);
    engine.start(tutorial);
    await flush();

    expect(views[0].progressLabel).toBe('Paso 1 de 2');

    engine.next();
    await flush();
    engine.next();
    await flush();

    expect(progressService.getProgress().recorrido).toMatchObject({ status: 'completado', repetitions: 1 });
  });

  it('completar, repetir y volver a completar acumula repeticiones sin duplicar entradas', async () => {
    const { registry, progressService, engine } = buildStack();
    const tutorial = registry.resolve('recorrido', makeViewer({ isSuperUser: true }))!;

    for (let round = 0; round < 2; round += 1) {
      await progressService.markStarted(tutorial);
      engine.start(tutorial);
      await flush();
      engine.next();
      await flush();
      engine.next();
      await flush();
      engine.next();
      await flush();
    }

    expect(Object.keys(progressService.getProgress())).toEqual(['recorrido']);
    expect(progressService.getProgress().recorrido.repetitions).toBe(2);
  });

  it('un cambio de versión relevante devuelve el tutorial a pendiente', async () => {
    const { registry, progressService, engine } = buildStack();
    const tutorial = registry.resolve('recorrido', makeViewer({ isSuperUser: true }))!;

    await progressService.markStarted(tutorial);
    engine.start(tutorial);
    await flush();
    engine.next();
    await flush();
    engine.next();
    await flush();
    engine.next();
    await flush();

    expect(progressService.getProgress().recorrido.status).toBe('completado');

    const upgraded = { ...tutorial, version: '2.0.0' };
    const view = resolveProgressView(upgraded, progressService.getProgress().recorrido, progressService.getProgress());

    expect(view.status).toBe('pendiente');
    expect(view.outdated).toBe(true);
  });
});

describe('ResilientTutorialProgressStorage', () => {
  const LOCAL_KEY = 'cpa.tutorials.progress.test';

  function entry(id: string): TutorialProgressEntry {
    return {
      tutorialId: id,
      version: '1.0.0',
      status: 'en_progreso',
      currentStepId: 'uno',
      currentStepIndex: 0,
      startedAt: NOW,
      completedAt: null,
      lastInteractionAt: NOW,
      repetitions: 0,
    };
  }

  function failingBackend(): TutorialProgressStorage {
    const boom = () => Promise.reject(new Error('servicio no disponible'));
    return {
      load: boom,
      save: boom,
      reset: boom,
      resetAll: boom,
      describeSource: () => 'backend',
    };
  }

  beforeEach(() => window.localStorage.clear());

  it('el backend manda cuando responde, y se espeja en local', async () => {
    const local = new LocalTutorialProgressStorage(() => LOCAL_KEY);
    const backend = new InMemoryProgressStorage([entry('remoto')]);
    const storage = new ResilientTutorialProgressStorage({ backend, local });

    expect(await storage.load()).toHaveLength(1);
    expect(storage.describeSource()).toBe('backend');
    // El espejo local permite arrancar sin red la próxima vez.
    expect(await local.load()).toHaveLength(1);
  });

  it('degrada a local cuando el backend no está disponible, sin perder el avance', async () => {
    const local = new LocalTutorialProgressStorage(() => LOCAL_KEY);
    await local.save(entry('previo'));

    const storage = new ResilientTutorialProgressStorage({ backend: failingBackend(), local });

    expect((await storage.load()).map((item) => item.tutorialId)).toEqual(['previo']);
    expect(storage.describeSource()).toBe('local');

    // Tras degradar, guardar sigue funcionando contra el almacenamiento local.
    await storage.save(entry('nuevo'));
    expect((await local.load()).map((item) => item.tutorialId).sort()).toEqual(['nuevo', 'previo']);
  });

  it('guardar nunca lanza aunque el backend falle: el avance local ya está escrito', async () => {
    const local = new LocalTutorialProgressStorage(() => LOCAL_KEY);
    const storage = new ResilientTutorialProgressStorage({ backend: failingBackend(), local });

    await expect(storage.save(entry('demo'))).resolves.toBeUndefined();
    expect(await local.load()).toHaveLength(1);
  });

  it('registra el motivo de la degradación en la telemetría', async () => {
    const events: string[] = [];
    const storage = new ResilientTutorialProgressStorage({
      backend: failingBackend(),
      local: new LocalTutorialProgressStorage(() => LOCAL_KEY),
      isUnsupported: () => true,
      analytics: {
        track: (event) => events.push(`${event.type}:${event.detail ?? ''}`),
        history: () => [],
      },
    });

    await storage.load();

    expect(events[0]).toContain('progress-sync-failed');
    expect(events[0]).toContain('almacenamiento local');
  });

  it('deja de intentar el backend tras el primer fallo', async () => {
    const backend = failingBackend();
    const loadSpy = jest.spyOn(backend, 'load');
    const storage = new ResilientTutorialProgressStorage({
      backend,
      local: new LocalTutorialProgressStorage(() => LOCAL_KEY),
    });

    await storage.load();
    await storage.load();
    await storage.load();

    expect(loadSpy).toHaveBeenCalledTimes(1);
  });
});
