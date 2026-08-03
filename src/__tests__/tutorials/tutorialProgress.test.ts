import {
  requiresRetakeAfterVersionChange,
  resolveProgressView,
  summarizeProgress,
} from '@/features/tutorials/domain/TutorialProgress';
import { TutorialProgressService } from '@/features/tutorials/services/TutorialProgressService';
import {
  LocalTutorialProgressStorage,
  buildLocalStorageKey,
} from '@/features/tutorials/services/LocalTutorialProgressStorage';
import { InMemoryProgressStorage, makeProgressEntry, makeStep, makeTutorial } from './testFactories';

const NOW = '2026-08-03T10:00:00.000Z';

function threeSteps() {
  return makeTutorial({
    id: 'demo',
    steps: [makeStep({ id: 'a', order: 1 }), makeStep({ id: 'b', order: 2 }), makeStep({ id: 'c', order: 3 })],
  });
}

describe('política de versiones', () => {
  it.each([
    ['1.0.0', '1.0.0', false],
    ['1.0.0', '1.0.1', false],
    ['1.0.0', '1.1.0', true],
    ['1.4.2', '2.0.0', true],
  ])('de %s a %s exige repetir: %s', (from, to, expected) => {
    expect(requiresRetakeAfterVersionChange(from, to)).toBe(expected);
  });

  it('devuelve a "pendiente" un tutorial completado cuya versión cambió de forma relevante', () => {
    const view = resolveProgressView(
      { ...threeSteps(), version: '2.0.0' },
      makeProgressEntry({ tutorialId: 'demo', version: '1.0.0', status: 'completado', completedAt: NOW }),
      {},
    );

    expect(view.status).toBe('pendiente');
    expect(view.outdated).toBe(true);
    expect(view.completedAt).toBeNull();
  });

  it('conserva el "completado" ante un cambio de parche', () => {
    const view = resolveProgressView(
      { ...threeSteps(), version: '1.0.3' },
      makeProgressEntry({ tutorialId: 'demo', version: '1.0.0', status: 'completado', completedAt: NOW }),
      {},
    );

    expect(view.status).toBe('completado');
    expect(view.outdated).toBe(false);
    expect(view.percent).toBe(100);
  });
});

describe('resolveProgressView', () => {
  it('devuelve un estado inicial coherente sin avance previo', () => {
    const view = resolveProgressView(threeSteps(), undefined, {});
    expect(view).toMatchObject({ status: 'pendiente', percent: 0, currentStepIndex: 0, totalSteps: 3 });
  });

  it('localiza el paso guardado por id aunque el tutorial se haya reordenado', () => {
    const reordered = makeTutorial({
      id: 'demo',
      steps: [makeStep({ id: 'nuevo', order: 1 }), makeStep({ id: 'a', order: 2 }), makeStep({ id: 'b', order: 3 })],
    });

    const view = resolveProgressView(
      reordered,
      makeProgressEntry({ tutorialId: 'demo', status: 'en_progreso', currentStepId: 'a', currentStepIndex: 0 }),
      {},
    );

    expect(view.currentStepIndex).toBe(1);
    expect(view.percent).toBe(33);
  });

  it('acota un índice guardado fuera de rango', () => {
    const view = resolveProgressView(
      threeSteps(),
      makeProgressEntry({ tutorialId: 'demo', status: 'en_progreso', currentStepIndex: 99 }),
      {},
    );
    expect(view.currentStepIndex).toBe(2);
  });

  it('informa de los prerrequisitos que faltan', () => {
    const tutorial = makeTutorial({ id: 'avanzado', prerequisites: ['basico', 'medio'] });
    const view = resolveProgressView(tutorial, undefined, {
      basico: makeProgressEntry({ tutorialId: 'basico', status: 'completado' }),
      medio: makeProgressEntry({ tutorialId: 'medio', status: 'en_progreso' }),
    });

    expect(view.missingPrerequisites).toEqual(['medio']);
  });
});

describe('summarizeProgress', () => {
  it('resume el avance general', () => {
    const summary = summarizeProgress([
      resolveProgressView(threeSteps(), makeProgressEntry({ tutorialId: 'a', status: 'completado' }), {}),
      resolveProgressView(threeSteps(), makeProgressEntry({ tutorialId: 'b', status: 'en_progreso' }), {}),
      resolveProgressView(threeSteps(), undefined, {}),
      resolveProgressView(threeSteps(), makeProgressEntry({ tutorialId: 'd', status: 'omitido' }), {}),
    ]);

    expect(summary).toEqual({ total: 4, completed: 1, inProgress: 1, pending: 1, skipped: 1, percent: 25 });
  });
});

describe('TutorialProgressService', () => {
  function createService(initial = new InMemoryProgressStorage()) {
    return { storage: initial, service: new TutorialProgressService({ storage: initial, now: () => NOW }) };
  }

  it('carga el progreso y notifica a los suscriptores', async () => {
    const storage = new InMemoryProgressStorage([makeProgressEntry({ tutorialId: 'demo', status: 'completado' })]);
    const { service } = createService(storage);

    const seen: string[] = [];
    service.subscribe((progress) => seen.push(...Object.keys(progress)));

    await service.load();

    expect(service.isLoaded()).toBe(true);
    expect(service.getProgress().demo.status).toBe('completado');
    expect(seen).toContain('demo');
  });

  it('registra el inicio y el avance paso a paso', async () => {
    const { service, storage } = createService();
    const tutorial = threeSteps();

    await service.markStarted(tutorial);
    expect(service.getProgress().demo).toMatchObject({ status: 'en_progreso', startedAt: NOW });

    await service.markStep({ tutorialId: 'demo', version: '1.0.0', stepId: 'b', stepIndex: 1, totalSteps: 3 });
    expect(service.getProgress().demo).toMatchObject({ currentStepId: 'b', currentStepIndex: 1 });
    expect(storage.saved).toHaveLength(2);
  });

  it('al completar guarda la fecha, suma una repetición y vuelve al primer paso', async () => {
    const { service } = createService();
    await service.markStarted(threeSteps());
    await service.markFinished({
      tutorialId: 'demo',
      version: '1.0.0',
      reason: 'completed',
      stepId: 'c',
      stepIndex: 2,
      totalSteps: 3,
    });

    expect(service.getProgress().demo).toMatchObject({
      status: 'completado',
      completedAt: NOW,
      repetitions: 1,
      currentStepIndex: 0,
      currentStepId: null,
    });
  });

  it('al cerrar a medias conserva el paso para poder reanudar', async () => {
    const { service } = createService();
    await service.markFinished({
      tutorialId: 'demo',
      version: '1.0.0',
      reason: 'closed',
      stepId: 'b',
      stepIndex: 1,
      totalSteps: 3,
    });

    expect(service.getProgress().demo).toMatchObject({ status: 'en_progreso', currentStepId: 'b', currentStepIndex: 1 });
  });

  it('marca como omitido sin contar repetición', async () => {
    const { service } = createService();
    await service.markFinished({
      tutorialId: 'demo',
      version: '1.0.0',
      reason: 'skipped',
      stepId: 'a',
      stepIndex: 0,
      totalSteps: 3,
    });

    expect(service.getProgress().demo).toMatchObject({ status: 'omitido', repetitions: 0 });
  });

  it('reinicia conservando el histórico de repeticiones', async () => {
    const { service } = createService();
    const tutorial = threeSteps();
    await service.markFinished({
      tutorialId: 'demo',
      version: '1.0.0',
      reason: 'completed',
      stepId: 'c',
      stepIndex: 2,
      totalSteps: 3,
    });

    await service.restart(tutorial);

    expect(service.getProgress().demo).toMatchObject({ status: 'pendiente', currentStepIndex: 0, repetitions: 1 });
  });

  it('borra el avance de un tutorial y de todos', async () => {
    const { service } = createService();
    await service.markStarted(threeSteps());

    await service.reset('demo');
    expect(service.getProgress().demo).toBeUndefined();

    await service.markStarted(threeSteps());
    await service.resetAll();
    expect(Object.keys(service.getProgress())).toHaveLength(0);
  });
});

describe('LocalTutorialProgressStorage', () => {
  const key = buildLocalStorageKey('persona@cpa.bo');

  beforeEach(() => window.localStorage.clear());

  it('separa el progreso por usuario', () => {
    expect(buildLocalStorageKey('a@cpa.bo')).not.toBe(buildLocalStorageKey('b@cpa.bo'));
    expect(buildLocalStorageKey(undefined)).toBe('cpa.tutorials.progress.v1');
  });

  it('guarda, actualiza y borra entradas', async () => {
    const storage = new LocalTutorialProgressStorage(() => key);

    await storage.save(makeProgressEntry({ tutorialId: 'a', status: 'en_progreso' }));
    await storage.save(makeProgressEntry({ tutorialId: 'b' }));
    await storage.save(makeProgressEntry({ tutorialId: 'a', status: 'completado' }));

    const entries = await storage.load();
    expect(entries).toHaveLength(2);
    expect(entries.find((entry) => entry.tutorialId === 'a')?.status).toBe('completado');

    await storage.reset('a');
    expect(await storage.load()).toHaveLength(1);

    await storage.resetAll();
    expect(await storage.load()).toHaveLength(0);
  });

  it('degrada a vacío si el contenido almacenado está corrupto', async () => {
    window.localStorage.setItem(key, '{no es json');
    const storage = new LocalTutorialProgressStorage(() => key);
    expect(await storage.load()).toEqual([]);
  });

  it('descarta entradas con forma inválida', async () => {
    window.localStorage.setItem(key, JSON.stringify([{ nada: true }, makeProgressEntry({ tutorialId: 'ok' })]));
    const storage = new LocalTutorialProgressStorage(() => key);
    expect((await storage.load()).map((entry) => entry.tutorialId)).toEqual(['ok']);
  });
});
