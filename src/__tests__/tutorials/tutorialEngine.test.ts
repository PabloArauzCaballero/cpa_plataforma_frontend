import { TutorialEngine, type TutorialFinishEvent } from '@/features/tutorials/engine/TutorialEngine';
import type {
  TutorialRenderer,
  TutorialRendererHandlers,
  TutorialRenderView,
} from '@/features/tutorials/engine/TutorialRenderer';
import type { TutorialDefinition } from '@/features/tutorials/domain/TutorialDefinition';
import { flush, makeStep, makeTutorial } from './testFactories';

interface Harness {
  engine: TutorialEngine;
  views: TutorialRenderView[];
  lastView(): TutorialRenderView;
  handlers(): TutorialRendererHandlers;
  destroyCalls(): number;
  navigations: string[];
  finished: TutorialFinishEvent[];
  steps: Array<{ stepId: string; stepIndex: number }>;
  setRoute(route: string): void;
  confirmExit: jest.Mock<boolean, unknown[]>;
}

function createHarness(options: { route?: string; confirm?: boolean } = {}): Harness {
  const views: TutorialRenderView[] = [];
  let capturedHandlers: TutorialRendererHandlers | null = null;
  let destroys = 0;
  let route = options.route ?? '/';

  const navigations: string[] = [];
  const finished: TutorialFinishEvent[] = [];
  const steps: Array<{ stepId: string; stepIndex: number }> = [];
  const confirmExit = jest.fn<boolean, unknown[]>(() => options.confirm ?? true);

  const renderer: TutorialRenderer = {
    render: (view, handlers) => {
      views.push(view);
      capturedHandlers = handlers;
    },
    refresh: () => {},
    destroy: () => {
      destroys += 1;
    },
  };

  const engine = new TutorialEngine({
    renderer,
    navigate: (target) => {
      navigations.push(target);
      route = target;
    },
    getCurrentRoute: () => route,
    onStepChange: (event) => steps.push({ stepId: event.stepId, stepIndex: event.stepIndex }),
    onFinish: (event) => finished.push(event),
    confirmExit: () => confirmExit(),
  });

  return {
    engine,
    views,
    lastView: () => views[views.length - 1],
    handlers: () => {
      if (!capturedHandlers) throw new Error('El renderizador todavía no recibió manejadores.');
      return capturedHandlers;
    },
    destroyCalls: () => destroys,
    navigations,
    finished,
    steps,
    setRoute: (next) => {
      route = next;
      engine.notifyRouteChange(next);
    },
    confirmExit,
  };
}

function threeStepTutorial(): TutorialDefinition {
  return makeTutorial({
    id: 'demo',
    steps: [
      makeStep({ id: 'uno', order: 1 }),
      makeStep({ id: 'dos', order: 2 }),
      makeStep({ id: 'tres', order: 3 }),
    ],
  });
}

function mountTarget(id: string, tag = 'button'): HTMLElement {
  const element = document.createElement(tag);
  element.setAttribute('data-tutorial-id', id);
  document.body.append(element);
  return element;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('TutorialEngine · inicio y finalización', () => {
  it('arranca en el primer paso y publica el progreso', async () => {
    const harness = createHarness();
    harness.engine.start(threeStepTutorial());
    await flush();

    expect(harness.lastView().stepId).toBe('uno');
    expect(harness.lastView().progressLabel).toBe('Paso 1 de 3');
    expect(harness.lastView().canGoPrevious).toBe(false);
    expect(harness.steps[0]).toEqual({ stepId: 'uno', stepIndex: 0 });
  });

  it('reanuda desde el paso indicado', async () => {
    const harness = createHarness();
    harness.engine.start(threeStepTutorial(), 1);
    await flush();

    expect(harness.lastView().stepId).toBe('dos');
    expect(harness.lastView().canGoPrevious).toBe(true);
  });

  it('avanza, retrocede y completa el recorrido', async () => {
    const harness = createHarness();
    harness.engine.start(threeStepTutorial());
    await flush();

    harness.engine.next();
    await flush();
    expect(harness.lastView().stepId).toBe('dos');

    harness.engine.previous();
    await flush();
    expect(harness.lastView().stepId).toBe('uno');

    harness.engine.next();
    await flush();
    harness.engine.next();
    await flush();
    expect(harness.lastView().isLastStep).toBe(true);

    harness.engine.next();
    await flush();
    expect(harness.finished).toHaveLength(1);
    expect(harness.finished[0].reason).toBe('completed');
    expect(harness.destroyCalls()).toBe(1);
    expect(harness.engine.isActive()).toBe(false);
  });

  it('no arranca un tutorial sin pasos visibles y lo reporta como error controlado', () => {
    const harness = createHarness();
    harness.engine.start(makeTutorial({ id: 'vacio', steps: [] }));

    expect(harness.views).toHaveLength(0);
    expect(harness.engine.getState().error).toContain('no tiene pasos');
  });
});

describe('TutorialEngine · cierre anticipado', () => {
  it('pide confirmación antes de abandonar a medias y respeta la negativa', async () => {
    const harness = createHarness({ confirm: false });
    harness.engine.start(threeStepTutorial());
    await flush();

    harness.engine.close();
    expect(harness.confirmExit).toHaveBeenCalledTimes(1);
    expect(harness.finished).toHaveLength(0);
    expect(harness.engine.isActive()).toBe(true);
  });

  it('cierra conservando el paso alcanzado cuando el usuario confirma', async () => {
    const harness = createHarness({ confirm: true });
    harness.engine.start(threeStepTutorial());
    await flush();
    harness.engine.next();
    await flush();

    harness.engine.close();
    expect(harness.finished[0]).toMatchObject({ reason: 'closed', stepId: 'dos', stepIndex: 1 });
  });

  it('marca el tutorial como omitido al usar "Omitir"', async () => {
    const harness = createHarness();
    harness.engine.start(threeStepTutorial());
    await flush();

    harness.handlers().onSkipTutorial();
    expect(harness.finished[0].reason).toBe('skipped');
  });

  // La confirmación se pide con un modal de la plataforma, no con `window.confirm`:
  // la respuesta llega por promesa y el cierre tiene que esperarla.
  it('espera la respuesta cuando la confirmación es asíncrona', async () => {
    let responder: ((confirmado: boolean) => void) | null = null;
    const engine = createHarness();
    const asyncEngine = new TutorialEngine({
      renderer: { render: () => {}, refresh: () => {}, destroy: () => {} },
      navigate: () => {},
      getCurrentRoute: () => '/',
      onFinish: (event) => engine.finished.push(event),
      confirmExit: () => new Promise<boolean>((resolve) => { responder = resolve; }),
    });

    asyncEngine.start(threeStepTutorial());
    await flush();

    asyncEngine.close();
    expect(engine.finished).toHaveLength(0);
    expect(asyncEngine.isActive()).toBe(true);

    // Un segundo cierre mientras el diálogo está abierto no apila confirmaciones.
    const primerResponder = responder;
    asyncEngine.close();
    expect(responder).toBe(primerResponder);

    responder!(true);
    await flush();
    expect(engine.finished[0]).toMatchObject({ reason: 'closed' });
  });

  it('mantiene el tutorial abierto si la confirmación asíncrona se rechaza', async () => {
    let responder: ((confirmado: boolean) => void) | null = null;
    const finished: TutorialFinishEvent[] = [];
    const asyncEngine = new TutorialEngine({
      renderer: { render: () => {}, refresh: () => {}, destroy: () => {} },
      navigate: () => {},
      getCurrentRoute: () => '/',
      onFinish: (event) => finished.push(event),
      confirmExit: () => new Promise<boolean>((resolve) => { responder = resolve; }),
    });

    asyncEngine.start(threeStepTutorial());
    await flush();
    asyncEngine.close();
    responder!(false);
    await flush();

    expect(finished).toHaveLength(0);
    expect(asyncEngine.isActive()).toBe(true);
  });

  it('no pide confirmación en el último paso', async () => {
    const harness = createHarness();
    harness.engine.start(threeStepTutorial(), 2);
    await flush();

    harness.engine.close();
    expect(harness.confirmExit).not.toHaveBeenCalled();
    expect(harness.finished[0].reason).toBe('closed');
  });
});

describe('TutorialEngine · resolución de objetivos', () => {
  it('resuelve un objetivo ya presente en el DOM', async () => {
    const target = mountTarget('resource-create');
    const harness = createHarness();

    harness.engine.start(
      makeTutorial({
        id: 'con-objetivo',
        steps: [makeStep({ id: 'uno', order: 1, target: '[data-tutorial-id="resource-create"]' })],
      }),
    );
    await flush();

    expect(harness.lastView().element).toBe(target);
    expect(harness.lastView().status).toBe('ok');
  });

  it('espera a un objetivo que aparece después (carga asíncrona)', async () => {
    const harness = createHarness();

    harness.engine.start(
      makeTutorial({
        id: 'asincrono',
        steps: [makeStep({ id: 'uno', order: 1, target: '[data-tutorial-id="resource-table"]', waitForTargetMs: 5000 })],
      }),
    );
    await flush();
    expect(harness.views).toHaveLength(0);

    const target = mountTarget('resource-table', 'div');
    await flush();

    expect(harness.lastView().element).toBe(target);
  });

  it('encuentra objetivos dentro de un modal abierto más tarde', async () => {
    const harness = createHarness();

    harness.engine.start(
      makeTutorial({
        id: 'modal',
        steps: [makeStep({ id: 'uno', order: 1, target: '[data-tutorial-id="modal"] [data-tutorial-id="resource-form-submit"]' })],
      }),
    );
    await flush();

    const modal = document.createElement('div');
    modal.setAttribute('data-tutorial-id', 'modal');
    const submit = document.createElement('button');
    submit.setAttribute('data-tutorial-id', 'resource-form-submit');
    modal.append(submit);
    document.body.append(modal);
    await flush();

    expect(harness.lastView().element).toBe(submit);
  });

  it('despliega el <details> contenedor cuando el paso pide "reveal"', async () => {
    const details = document.createElement('details');
    const target = document.createElement('a');
    target.setAttribute('data-tutorial-id', 'nav-module-board');
    details.append(target);
    document.body.append(details);

    const harness = createHarness();
    harness.engine.start(
      makeTutorial({
        id: 'reveal',
        steps: [
          makeStep({ id: 'uno', order: 1, target: '[data-tutorial-id="nav-module-board"]', autoAction: 'reveal' }),
        ],
      }),
    );
    await flush();

    expect(details.open).toBe(true);
  });

  describe('objetivo inexistente', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('no bloquea el recorrido: informa el error y ofrece reintentar o saltar', async () => {
      const harness = createHarness();
      harness.engine.start(
        makeTutorial({
          id: 'sin-objetivo',
          steps: [
            makeStep({ id: 'uno', order: 1, target: '[data-tutorial-id="no-existe"]', waitForTargetMs: 1000 }),
            makeStep({ id: 'dos', order: 2 }),
          ],
        }),
      );

      await jest.advanceTimersByTimeAsync(1100);

      expect(harness.lastView().status).toBe('target-missing');
      expect(harness.lastView().hint).toContain('No encontramos este elemento');
      expect(harness.engine.isActive()).toBe(true);

      harness.handlers().onSkipStep();
      await jest.advanceTimersByTimeAsync(10);
      expect(harness.lastView().stepId).toBe('dos');
    });

    it('salta en silencio los pasos opcionales cuyo objetivo no existe', async () => {
      const harness = createHarness();
      harness.engine.start(
        makeTutorial({
          id: 'opcional',
          steps: [
            makeStep({ id: 'uno', order: 1, target: '[data-tutorial-id="no-existe"]', optional: true, waitForTargetMs: 500 }),
            makeStep({ id: 'dos', order: 2 }),
          ],
        }),
      );

      await jest.advanceTimersByTimeAsync(600);

      expect(harness.views.every((view) => view.status !== 'target-missing')).toBe(true);
      expect(harness.lastView().stepId).toBe('dos');
    });
  });
});

describe('TutorialEngine · navegación entre rutas', () => {
  it('navega automáticamente cuando el paso vive en otra ruta', async () => {
    const harness = createHarness({ route: '/' });
    harness.engine.start(
      makeTutorial({
        id: 'multiruta',
        steps: [
          makeStep({ id: 'uno', order: 1, route: '/' }),
          makeStep({ id: 'dos', order: 2, route: '/perfil' }),
        ],
      }),
    );
    await flush();

    expect(harness.navigations).toHaveLength(0);

    harness.engine.next();
    await flush();

    expect(harness.navigations).toEqual(['/perfil']);
  });

  it('no navega si el usuario ya está en la ruta del paso', async () => {
    const harness = createHarness({ route: '/perfil' });
    harness.engine.start(
      makeTutorial({ id: 'ya-esta', steps: [makeStep({ id: 'uno', order: 1, route: '/perfil' })] }),
    );
    await flush();

    expect(harness.navigations).toHaveLength(0);
  });
});

describe('TutorialEngine · acciones exigidas al usuario', () => {
  it('bloquea el botón de avance hasta que el usuario hace clic en el objetivo', async () => {
    const target = mountTarget('resource-create');
    const harness = createHarness();

    harness.engine.start(
      makeTutorial({
        id: 'accion-clic',
        steps: [
          makeStep({
            id: 'uno',
            order: 1,
            target: '[data-tutorial-id="resource-create"]',
            expectedAction: { type: 'click' },
          }),
          makeStep({ id: 'dos', order: 2 }),
        ],
      }),
    );
    await flush();

    expect(harness.lastView().status).toBe('action-pending');
    expect(harness.lastView().canGoNext).toBe(false);
    expect(harness.lastView().hint).toContain('Haz clic');

    target.click();
    await flush();

    expect(harness.lastView().stepId).toBe('dos');
  });

  it('permite interactuar con el elemento cuando el paso exige una acción', async () => {
    mountTarget('resource-create');
    const harness = createHarness();
    harness.engine.start(
      makeTutorial({
        id: 'interaccion',
        steps: [
          makeStep({
            id: 'uno',
            order: 1,
            target: '[data-tutorial-id="resource-create"]',
            expectedAction: { type: 'click' },
          }),
        ],
      }),
    );
    await flush();

    expect(harness.lastView().allowInteraction).toBe(true);
  });

  it('exige una longitud mínima al escribir en un campo', async () => {
    const input = document.createElement('input');
    input.setAttribute('data-tutorial-id', 'center-search');
    document.body.append(input);

    const harness = createHarness();
    harness.engine.start(
      makeTutorial({
        id: 'accion-input',
        steps: [
          makeStep({
            id: 'uno',
            order: 1,
            target: '[data-tutorial-id="center-search"]',
            expectedAction: { type: 'input', minLength: 3 },
          }),
          makeStep({ id: 'dos', order: 2 }),
        ],
      }),
    );
    await flush();

    input.value = 'ab';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();
    expect(harness.lastView().stepId).toBe('uno');

    input.value = 'abc';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();
    expect(harness.lastView().stepId).toBe('dos');
  });

  it('da por cumplida la acción de navegación al llegar a la ruta esperada', async () => {
    const harness = createHarness({ route: '/' });
    harness.engine.start(
      makeTutorial({
        id: 'accion-navegar',
        steps: [
          makeStep({ id: 'uno', order: 1, expectedAction: { type: 'navigate', route: '/perfil' } }),
          makeStep({ id: 'dos', order: 2 }),
        ],
      }),
    );
    await flush();
    expect(harness.lastView().status).toBe('action-pending');

    harness.setRoute('/perfil');
    await flush();

    expect(harness.lastView().stepId).toBe('dos');
  });

  it('deja saltar el paso aunque la acción siga pendiente: el usuario nunca queda atrapado', async () => {
    mountTarget('resource-create');
    const harness = createHarness();
    harness.engine.start(
      makeTutorial({
        id: 'escape',
        steps: [
          makeStep({
            id: 'uno',
            order: 1,
            target: '[data-tutorial-id="resource-create"]',
            expectedAction: { type: 'click' },
          }),
          makeStep({ id: 'dos', order: 2 }),
        ],
      }),
    );
    await flush();

    harness.handlers().onSkipStep();
    await flush();
    expect(harness.lastView().stepId).toBe('dos');
  });
});

describe('TutorialEngine · teclado y accesibilidad', () => {
  function press(key: string, target: EventTarget = document.body): void {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  }

  it('avanza con ArrowRight y retrocede con ArrowLeft', async () => {
    const harness = createHarness();
    harness.engine.start(threeStepTutorial());
    await flush();

    press('ArrowRight');
    await flush();
    expect(harness.lastView().stepId).toBe('dos');

    press('ArrowLeft');
    await flush();
    expect(harness.lastView().stepId).toBe('uno');
  });

  it('cierra con Escape', async () => {
    const harness = createHarness();
    harness.engine.start(threeStepTutorial());
    await flush();

    press('Escape');
    expect(harness.finished[0].reason).toBe('closed');
  });

  it('no captura las flechas mientras el foco está en un campo de texto', async () => {
    const input = document.createElement('input');
    input.setAttribute('data-tutorial-id', 'center-search');
    document.body.append(input);

    const harness = createHarness();
    harness.engine.start(
      makeTutorial({
        id: 'teclado-formulario',
        steps: [
          makeStep({
            id: 'uno',
            order: 1,
            target: '[data-tutorial-id="center-search"]',
            expectedAction: { type: 'input', minLength: 2 },
          }),
          makeStep({ id: 'dos', order: 2 }),
        ],
      }),
    );
    await flush();

    press('ArrowRight', input);
    await flush();
    expect(harness.lastView().stepId).toBe('uno');
  });

  it('devuelve el foco al elemento que lo tenía antes del recorrido', async () => {
    const origin = document.createElement('button');
    document.body.append(origin);
    origin.focus();
    expect(document.activeElement).toBe(origin);

    const harness = createHarness();
    harness.engine.start(threeStepTutorial(), 2);
    await flush();

    harness.engine.close();
    expect(document.activeElement).toBe(origin);
  });

  it('deja de escuchar el teclado una vez terminado el recorrido', async () => {
    const harness = createHarness();
    harness.engine.start(threeStepTutorial(), 2);
    await flush();
    harness.engine.close();

    const before = harness.views.length;
    press('ArrowRight');
    await flush();
    expect(harness.views).toHaveLength(before);
  });
});
