import { DriverTutorialRenderer } from '@/features/tutorials/engine/DriverTutorialRenderer';
import type {
  TutorialRendererHandlers,
  TutorialRenderView,
} from '@/features/tutorials/engine/TutorialRenderer';

/**
 * Comprobaciones sobre el renderizador real (driver.js + nuestra decoración).
 * Verifican el contrato accesible del globo, no su apariencia.
 */

function makeView(overrides: Partial<TutorialRenderView> = {}): TutorialRenderView {
  return {
    tutorialId: 'demo',
    tutorialTitle: 'Tutorial de prueba',
    stepId: 'paso-1',
    title: 'Crea un registro',
    description: 'Pulsa el botón para abrir el formulario.',
    element: null,
    placement: 'center',
    align: 'start',
    allowInteraction: false,
    stepNumber: 2,
    totalSteps: 4,
    percent: 50,
    progressLabel: 'Paso 2 de 4',
    hint: null,
    status: 'ok',
    canGoPrevious: true,
    canGoNext: true,
    isLastStep: false,
    ...overrides,
  };
}

function makeHandlers(): jest.Mocked<TutorialRendererHandlers> {
  return {
    onNext: jest.fn(),
    onPrevious: jest.fn(),
    onSkipStep: jest.fn(),
    onSkipTutorial: jest.fn(),
    onClose: jest.fn(),
    onRetry: jest.fn(),
  };
}

function popover(): HTMLElement {
  const element = document.querySelector<HTMLElement>('.driver-popover');
  if (!element) throw new Error('El globo del tutorial no se renderizó.');
  return element;
}

function buttonByText(label: string): HTMLButtonElement {
  const match = Array.from(popover().querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  );
  if (!match) throw new Error(`No se encontró el botón "${label}".`);
  return match;
}

let renderer: DriverTutorialRenderer;

beforeEach(() => {
  document.body.innerHTML = '';
  renderer = new DriverTutorialRenderer();
});

afterEach(() => {
  renderer.destroy();
});

describe('DriverTutorialRenderer · contrato accesible', () => {
  it('publica el globo como diálogo con etiqueta y descripción asociadas', () => {
    renderer.render(makeView(), makeHandlers());

    const wrapper = popover();
    expect(wrapper.getAttribute('role')).toBe('dialog');
    expect(wrapper.getAttribute('aria-live')).toBe('polite');
    expect(wrapper.getAttribute('aria-label')).toContain('Paso 2 de 4');

    const labelledBy = wrapper.getAttribute('aria-labelledby');
    const describedBy = wrapper.getAttribute('aria-describedby');
    expect(wrapper.querySelector(`#${labelledBy}`)?.textContent).toContain('Crea un registro');
    expect(wrapper.querySelector(`#${describedBy}`)?.textContent).toContain('Pulsa el botón');
  });

  it('expone el avance como barra de progreso accesible', () => {
    renderer.render(makeView(), makeHandlers());

    const progress = popover().querySelector('[role="progressbar"]');
    expect(progress?.getAttribute('aria-valuenow')).toBe('2');
    expect(progress?.getAttribute('aria-valuemax')).toBe('4');
    expect(progress?.getAttribute('aria-valuetext')).toBe('Paso 2 de 4');
  });

  it('lleva el foco al globo para que el recorrido sea navegable con teclado', () => {
    renderer.render(makeView(), makeHandlers());
    expect(document.activeElement).toBe(popover());
  });

  it('el botón de cierre tiene nombre accesible', () => {
    renderer.render(makeView(), makeHandlers());
    const close = popover().querySelector('.cpa-tutorial-close');
    expect(close?.getAttribute('aria-label')).toBe('Cerrar tutorial');
  });
});

describe('DriverTutorialRenderer · controles', () => {
  it('cablea los botones a los manejadores del motor', () => {
    const handlers = makeHandlers();
    renderer.render(makeView(), handlers);

    buttonByText('Siguiente').click();
    buttonByText('Anterior').click();
    buttonByText('Omitir').click();
    popover().querySelector<HTMLButtonElement>('.cpa-tutorial-close')!.click();

    expect(handlers.onNext).toHaveBeenCalledTimes(1);
    expect(handlers.onPrevious).toHaveBeenCalledTimes(1);
    expect(handlers.onSkipTutorial).toHaveBeenCalledTimes(1);
    expect(handlers.onClose).toHaveBeenCalledTimes(1);
  });

  it('oculta "Anterior" en el primer paso y rotula el último como "Finalizar"', () => {
    renderer.render(makeView({ canGoPrevious: false, isLastStep: true }), makeHandlers());

    expect(() => buttonByText('Anterior')).toThrow();
    expect(buttonByText('Finalizar')).toBeTruthy();
  });

  it('deshabilita el avance con una acción pendiente pero deja saltar el paso', () => {
    const handlers = makeHandlers();
    renderer.render(
      makeView({ status: 'action-pending', canGoNext: false, hint: 'Haz clic en el elemento resaltado.' }),
      handlers,
    );

    const next = buttonByText('Siguiente');
    expect(next.disabled).toBe(true);
    expect(next.getAttribute('aria-disabled')).toBe('true');

    buttonByText('Saltar paso').click();
    expect(handlers.onSkipStep).toHaveBeenCalledTimes(1);
  });

  it('ofrece reintentar y saltar cuando el objetivo no aparece', () => {
    const handlers = makeHandlers();
    renderer.render(
      makeView({ status: 'target-missing', hint: 'No encontramos este elemento en la pantalla actual.' }),
      handlers,
    );

    buttonByText('Reintentar').click();
    buttonByText('Saltar paso').click();

    expect(handlers.onRetry).toHaveBeenCalledTimes(1);
    expect(handlers.onSkipStep).toHaveBeenCalledTimes(1);
  });

  it('no comunica el estado sólo con color: la ayuda lleva icono y texto', () => {
    renderer.render(makeView({ status: 'target-missing', hint: 'No encontramos este elemento.' }), makeHandlers());

    const hint = popover().querySelector<HTMLElement>('.cpa-tutorial-hint');
    expect(hint?.dataset.tone).toBe('error');
    expect(hint?.textContent).toContain('⚠');
    expect(hint?.textContent).toContain('No encontramos este elemento.');
  });

  it('resalta el elemento indicado y limpia el overlay al destruirse', () => {
    const target = document.createElement('button');
    target.setAttribute('data-tutorial-id', 'resource-create');
    document.body.append(target);

    renderer.render(makeView({ element: target, placement: 'bottom', allowInteraction: true }), makeHandlers());
    expect(document.querySelector('.driver-popover')).not.toBeNull();

    renderer.destroy();
    expect(document.querySelector('.driver-popover')).toBeNull();
  });
});
