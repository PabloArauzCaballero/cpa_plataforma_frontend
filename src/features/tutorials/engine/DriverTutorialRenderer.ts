import { driver, type Driver, type PopoverDOM, type Side } from 'driver.js';
import 'driver.js/dist/driver.css';
import '../styles/tutorialOverlay.css';
import type { TutorialRenderer, TutorialRendererHandlers, TutorialRenderView } from './TutorialRenderer';

const POPOVER_CLASS = 'cpa-tutorial-popover';

interface RendererOptions {
  win?: Window;
}

/**
 * Adaptador de presentación sobre driver.js (ya presente en el proyecto).
 *
 * driver.js aporta lo difícil de reimplementar bien: el recorte del overlay sobre el
 * elemento activo, el posicionamiento del globo con su flecha y el reposicionamiento
 * ante scroll/resize. Todo el control del recorrido lo conserva `TutorialEngine`: aquí
 * se resalta **un paso cada vez** con `highlight()` y los botones se cablean a los
 * manejadores del motor, nunca a la navegación interna de la librería.
 */
export class DriverTutorialRenderer implements TutorialRenderer {
  private instance: Driver | null = null;
  private view: TutorialRenderView | null = null;
  private handlers: TutorialRendererHandlers | null = null;
  private readonly win: Window;

  constructor(options: RendererOptions = {}) {
    this.win = options.win ?? window;
  }

  render(view: TutorialRenderView, handlers: TutorialRendererHandlers): void {
    this.view = view;
    this.handlers = handlers;

    const instance = this.ensureInstance();
    const isCentered = !view.element || view.placement === 'center';

    instance.highlight({
      element: view.element ?? undefined,
      // Cuando el paso pide una acción, el usuario debe poder tocar el elemento.
      disableActiveInteraction: !view.allowInteraction,
      popover: {
        title: view.title,
        description: view.description,
        side: isCentered ? undefined : (view.placement as Side),
        align: view.align,
        popoverClass: POPOVER_CLASS,
      },
    });
  }

  refresh(): void {
    this.instance?.refresh();
  }

  destroy(): void {
    this.instance?.destroy();
    this.instance = null;
    this.view = null;
    this.handlers = null;
  }

  private prefersReducedMotion(): boolean {
    return Boolean(this.win.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  }

  private ensureInstance(): Driver {
    if (this.instance) return this.instance;

    this.instance = driver({
      // El cierre y el teclado los gobierna el motor (para poder pedir confirmación
      // antes de abandonar un recorrido a medias).
      allowClose: false,
      allowKeyboardControl: false,
      allowScroll: true,
      smoothScroll: !this.prefersReducedMotion(),
      animate: !this.prefersReducedMotion(),
      overlayColor: 'rgba(1, 43, 101, 0.62)',
      stagePadding: 8,
      stageRadius: 12,
      popoverClass: POPOVER_CLASS,
      showButtons: [],
      onPopoverRender: (popover) => this.decoratePopover(popover),
    });

    return this.instance;
  }

  /**
   * driver.js sólo renderiza título, descripción y su pie estándar. Aquí se sustituye el
   * pie por los controles del motor y se añaden barra de progreso, ayuda contextual y
   * los atributos ARIA que la librería no pone.
   */
  private decoratePopover(popover: PopoverDOM): void {
    const view = this.view;
    const handlers = this.handlers;
    if (!view || !handlers) return;

    const doc = popover.wrapper.ownerDocument;

    popover.wrapper.setAttribute('role', 'dialog');
    popover.wrapper.setAttribute('aria-modal', 'false');
    popover.wrapper.setAttribute('aria-live', 'polite');
    popover.wrapper.setAttribute('aria-label', `${view.tutorialTitle} · ${view.progressLabel}`);
    popover.wrapper.dataset.stepStatus = view.status;

    popover.title.id = 'cpa-tutorial-title';
    popover.description.id = 'cpa-tutorial-description';
    popover.wrapper.setAttribute('aria-labelledby', popover.title.id);
    popover.wrapper.setAttribute('aria-describedby', popover.description.id);

    this.renderHeader(doc, popover, view, handlers);
    this.renderHint(doc, popover, view);
    this.renderFooter(doc, popover, view, handlers);

    // El globo recibe el foco para que lectores de pantalla y teclado sigan el recorrido.
    popover.wrapper.tabIndex = -1;
    popover.wrapper.focus({ preventScroll: true });
  }

  private renderHeader(
    doc: Document,
    popover: PopoverDOM,
    view: TutorialRenderView,
    handlers: TutorialRendererHandlers,
  ): void {
    const header = doc.createElement('div');
    header.className = 'cpa-tutorial-header';

    const label = doc.createElement('span');
    label.className = 'cpa-tutorial-eyebrow';
    label.textContent = view.tutorialTitle;

    const close = doc.createElement('button');
    close.type = 'button';
    close.className = 'cpa-tutorial-close';
    close.setAttribute('aria-label', 'Cerrar tutorial');
    close.textContent = '✕';
    close.addEventListener('click', () => handlers.onClose());

    header.append(label, close);

    const progress = doc.createElement('div');
    progress.className = 'cpa-tutorial-progress';
    progress.setAttribute('role', 'progressbar');
    progress.setAttribute('aria-valuemin', '0');
    progress.setAttribute('aria-valuemax', String(view.totalSteps));
    progress.setAttribute('aria-valuenow', String(view.stepNumber));
    progress.setAttribute('aria-valuetext', view.progressLabel);

    const bar = doc.createElement('span');
    bar.className = 'cpa-tutorial-progress-bar';
    bar.style.width = `${view.percent}%`;
    progress.append(bar);

    popover.wrapper.prepend(header, progress);
  }

  private renderHint(doc: Document, popover: PopoverDOM, view: TutorialRenderView): void {
    if (!view.hint) return;

    const hint = doc.createElement('p');
    hint.className = 'cpa-tutorial-hint';
    hint.dataset.tone = view.status === 'target-missing' ? 'error' : 'info';
    // El estado no se comunica sólo por color: se antepone un icono y un texto.
    hint.textContent = `${view.status === 'target-missing' ? '⚠ ' : 'ⓘ '}${view.hint}`;
    popover.description.insertAdjacentElement('afterend', hint);
  }

  private renderFooter(
    doc: Document,
    popover: PopoverDOM,
    view: TutorialRenderView,
    handlers: TutorialRendererHandlers,
  ): void {
    const footer = popover.footer;
    footer.replaceChildren();
    footer.classList.add('cpa-tutorial-footer');

    const counter = doc.createElement('span');
    counter.className = 'cpa-tutorial-counter';
    counter.textContent = view.progressLabel;

    const actions = doc.createElement('div');
    actions.className = 'cpa-tutorial-actions';

    const skipTutorial = this.createButton(doc, 'Omitir', 'ghost', () => handlers.onSkipTutorial());
    skipTutorial.title = 'Omitir este tutorial y no continuarlo ahora';
    actions.append(skipTutorial);

    if (view.status === 'target-missing') {
      actions.append(this.createButton(doc, 'Reintentar', 'secondary', () => handlers.onRetry()));
      actions.append(this.createButton(doc, 'Saltar paso', 'primary', () => handlers.onSkipStep()));
    } else {
      if (view.canGoPrevious) {
        actions.append(this.createButton(doc, 'Anterior', 'secondary', () => handlers.onPrevious()));
      }

      const nextLabel = view.isLastStep ? 'Finalizar' : 'Siguiente';
      const next = this.createButton(doc, nextLabel, 'primary', () => handlers.onNext());
      if (!view.canGoNext) {
        next.disabled = true;
        next.setAttribute('aria-disabled', 'true');
        // Con una acción pendiente el usuario no queda atrapado: puede saltar el paso.
        actions.append(this.createButton(doc, 'Saltar paso', 'secondary', () => handlers.onSkipStep()));
      }
      actions.append(next);
    }

    footer.append(counter, actions);
  }

  private createButton(
    doc: Document,
    label: string,
    variant: 'primary' | 'secondary' | 'ghost',
    onClick: () => void,
  ): HTMLButtonElement {
    const button = doc.createElement('button');
    button.type = 'button';
    button.className = `cpa-tutorial-btn cpa-tutorial-btn--${variant}`;
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  }
}
