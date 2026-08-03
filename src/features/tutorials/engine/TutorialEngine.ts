import type { TutorialDefinition, TutorialStep } from '../domain/TutorialDefinition';
import { stepAllowsInteraction } from '../domain/TutorialDefinition';
import { normalizeRoute } from '../domain/tutorialRoutes';
import type { TutorialAnalyticsAdapter } from '../services/tutorialAnalytics';
import type { TutorialRenderer, TutorialRendererHandlers, TutorialRenderView, TutorialStepStatus } from './TutorialRenderer';
import { describeExpectedAction, watchStepAction, type StepActionWatcher } from './stepActionWatcher';
import { focusTarget, revealTarget, scrollTargetIntoView, waitForTarget } from './targetResolver';

export type TutorialEngineStatus = 'idle' | 'preparing' | 'active' | 'finished';

/** Motivo por el que terminó una ejecución. */
export type TutorialFinishReason = 'completed' | 'closed' | 'skipped';

export interface TutorialEngineState {
  status: TutorialEngineStatus;
  tutorialId: string | null;
  tutorialTitle: string | null;
  stepId: string | null;
  stepIndex: number;
  totalSteps: number;
  stepStatus: TutorialStepStatus;
  /** Mensaje de error controlado cuando algo no pudo resolverse. */
  error: string | null;
}

export interface TutorialStepProgressEvent {
  tutorialId: string;
  version: string;
  stepId: string;
  stepIndex: number;
  totalSteps: number;
}

export interface TutorialFinishEvent {
  tutorialId: string;
  version: string;
  reason: TutorialFinishReason;
  stepId: string | null;
  stepIndex: number;
  totalSteps: number;
  nextTutorialId?: string;
}

export interface TutorialEngineDeps {
  renderer: TutorialRenderer;
  /** Navegación real de la aplicación (react-router). */
  navigate(route: string): void;
  getCurrentRoute(): string;
  /** Avance de paso; el consumidor decide dónde persistirlo. */
  onStepChange?(event: TutorialStepProgressEvent): void;
  onStart?(event: { tutorialId: string; version: string; totalSteps: number }): void;
  onFinish?(event: TutorialFinishEvent): void;
  onStateChange?(state: TutorialEngineState): void;
  /** Confirmación antes de abandonar un tutorial a medias. */
  confirmExit?(tutorial: TutorialDefinition, stepIndex: number): boolean;
  analytics?: TutorialAnalyticsAdapter;
  doc?: Document;
  win?: Window;
}

const IDLE_STATE: TutorialEngineState = {
  status: 'idle',
  tutorialId: null,
  tutorialTitle: null,
  stepId: null,
  stepIndex: 0,
  totalSteps: 0,
  stepStatus: 'ok',
  error: null,
};

const TARGET_MISSING_MESSAGE =
  'No encontramos este elemento en la pantalla actual. Puede que no esté disponible para tu rol o que la pantalla haya cambiado.';

/**
 * Núcleo del motor de tutoriales.
 *
 * Es una máquina de estados sin dependencias de framework: recibe una definición ya
 * filtrada por rol, resuelve objetivos (incluidos los asíncronos), navega entre rutas,
 * observa las acciones exigidas al usuario y delega el pintado en un `TutorialRenderer`.
 *
 * Todo error es controlado: si un objetivo no aparece, el recorrido no se bloquea —
 * ofrece reintentar, saltar el paso o cerrar.
 */
export class TutorialEngine {
  private state: TutorialEngineState = IDLE_STATE;
  private tutorial: TutorialDefinition | null = null;
  private steps: TutorialStep[] = [];
  private index = 0;
  private actionWatcher: StepActionWatcher | null = null;
  /** Elemento que tenía el foco antes de abrir el tutorial, para devolvérselo al salir. */
  private focusOrigin: HTMLElement | null = null;
  /** Invalida las resoluciones asíncronas en vuelo cuando el paso cambia. */
  private runToken = 0;
  private abortController: AbortController | null = null;
  private keyListenerAttached = false;
  private readonly doc: Document;
  private readonly win: Window | undefined;

  constructor(private readonly deps: TutorialEngineDeps) {
    this.doc = deps.doc ?? document;
    this.win = deps.win ?? (typeof window === 'undefined' ? undefined : window);
  }

  getState(): TutorialEngineState {
    return this.state;
  }

  isActive(): boolean {
    return this.state.status === 'active' || this.state.status === 'preparing';
  }

  /** Arranca un tutorial. `startAtIndex` permite reanudar donde el usuario lo dejó. */
  start(tutorial: TutorialDefinition, startAtIndex = 0): void {
    if (tutorial.steps.length === 0) {
      this.setState({ ...IDLE_STATE, error: `El tutorial "${tutorial.id}" no tiene pasos disponibles para tu rol.` });
      return;
    }

    this.stopInternals();
    this.focusOrigin = this.doc.activeElement instanceof HTMLElement ? this.doc.activeElement : null;
    this.tutorial = tutorial;
    this.steps = tutorial.steps;
    this.index = Math.min(Math.max(startAtIndex, 0), tutorial.steps.length - 1);
    this.attachKeyboard();

    this.deps.onStart?.({ tutorialId: tutorial.id, version: tutorial.version, totalSteps: this.steps.length });
    this.deps.analytics?.track({
      type: 'tutorial-started',
      tutorialId: tutorial.id,
      version: tutorial.version,
      stepIndex: this.index,
    });

    void this.goToStep(this.index);
  }

  next(): void {
    if (!this.tutorial) return;
    if (this.index >= this.steps.length - 1) {
      this.finish('completed');
      return;
    }
    void this.goToStep(this.index + 1);
  }

  previous(): void {
    if (!this.tutorial || this.index === 0) return;
    void this.goToStep(this.index - 1);
  }

  goTo(index: number): void {
    if (!this.tutorial) return;
    if (index < 0 || index >= this.steps.length) return;
    void this.goToStep(index);
  }

  /** Salta el paso actual sin abandonar el tutorial (objetivo ausente u opcional). */
  skipStep(): void {
    if (!this.tutorial) return;
    this.deps.analytics?.track({
      type: 'step-skipped',
      tutorialId: this.tutorial.id,
      version: this.tutorial.version,
      stepIndex: this.index,
      stepId: this.steps[this.index]?.id,
    });
    this.next();
  }

  /** Reintenta resolver el objetivo del paso actual. */
  retry(): void {
    if (!this.tutorial) return;
    void this.goToStep(this.index);
  }

  /** Cierra conservando el avance (el usuario podrá continuar más tarde). */
  close(options: { confirm?: boolean } = {}): void {
    if (!this.tutorial) return;
    const isFinalStep = this.index >= this.steps.length - 1;
    if (options.confirm !== false && !isFinalStep && this.deps.confirmExit) {
      if (!this.deps.confirmExit(this.tutorial, this.index)) return;
    }
    this.finish('closed');
  }

  /** Abandona marcando el tutorial como omitido. */
  skipTutorial(): void {
    if (!this.tutorial) return;
    this.finish('skipped');
  }

  /** El consumidor avisa de cada cambio de ruta para resolver acciones `navigate`. */
  notifyRouteChange(route: string): void {
    this.actionWatcher?.notifyRouteChange(route);
    if (this.state.status === 'active') this.deps.renderer.refresh();
  }

  /** Recalcula la posición del globo (resize / scroll). */
  refresh(): void {
    if (this.isActive()) this.deps.renderer.refresh();
  }

  destroy(): void {
    this.stopInternals();
    this.deps.renderer.destroy();
    this.restoreFocus();
    this.tutorial = null;
    this.steps = [];
    this.setState(IDLE_STATE);
  }

  // ---------------------------------------------------------------- internals

  private async goToStep(index: number): Promise<void> {
    const tutorial = this.tutorial;
    if (!tutorial) return;

    this.clearStepWatchers();
    const token = ++this.runToken;
    this.index = index;
    const step = this.steps[index];

    this.setState({
      status: 'preparing',
      tutorialId: tutorial.id,
      tutorialTitle: tutorial.title,
      stepId: step.id,
      stepIndex: index,
      totalSteps: this.steps.length,
      stepStatus: 'ok',
      error: null,
    });

    this.deps.onStepChange?.({
      tutorialId: tutorial.id,
      version: tutorial.version,
      stepId: step.id,
      stepIndex: index,
      totalSteps: this.steps.length,
    });

    if (step.route && normalizeRoute(this.deps.getCurrentRoute()) !== normalizeRoute(step.route)) {
      this.deps.navigate(step.route);
    }
    if (token !== this.runToken) return;

    const element = await this.resolveElement(step, token);
    if (token !== this.runToken) return;

    if (step.target && !element) {
      if (step.optional) {
        // Paso opcional cuyo elemento no existe para este usuario: se salta en silencio.
        this.deps.analytics?.track({
          type: 'target-missing',
          tutorialId: tutorial.id,
          version: tutorial.version,
          stepIndex: index,
          stepId: step.id,
          detail: 'omitido por ser opcional',
        });
        if (index >= this.steps.length - 1) this.finish('completed');
        else void this.goToStep(index + 1);
        return;
      }

      this.deps.analytics?.track({
        type: 'target-missing',
        tutorialId: tutorial.id,
        version: tutorial.version,
        stepIndex: index,
        stepId: step.id,
        detail: step.target,
      });
      this.setState({ ...this.state, status: 'active', stepStatus: 'target-missing', error: TARGET_MISSING_MESSAGE });
      this.deps.renderer.render(this.buildView(step, null, 'target-missing'), this.buildHandlers());
      return;
    }

    if (element) this.applyAutoAction(step, element);

    const watcher = watchStepAction(step, {
      doc: this.doc,
      getRoute: () => this.deps.getCurrentRoute(),
      onSatisfied: () => {
        if (token !== this.runToken) return;
        this.onActionSatisfied();
      },
    });
    this.actionWatcher = watcher;

    const stepStatus: TutorialStepStatus = watcher.isSatisfied() ? 'ok' : 'action-pending';
    this.setState({ ...this.state, status: 'active', stepStatus, error: null });
    this.deps.renderer.render(this.buildView(step, element, stepStatus), this.buildHandlers());
  }

  private async resolveElement(step: TutorialStep, token: number): Promise<Element | null> {
    if (!step.target) return null;

    this.abortController = new AbortController();
    const element = await waitForTarget(step.target, {
      doc: this.doc,
      timeoutMs: step.waitForTargetMs,
      signal: this.abortController.signal,
    });
    return token === this.runToken ? element : null;
  }

  private applyAutoAction(step: TutorialStep, element: Element): void {
    switch (step.autoAction) {
      case 'reveal':
        revealTarget(element);
        break;
      case 'focus':
        focusTarget(element);
        break;
      case 'scroll':
        scrollTargetIntoView(element, this.prefersReducedMotion());
        break;
      default:
        break;
    }
  }

  private onActionSatisfied(): void {
    const step = this.steps[this.index];
    if (!step || !this.tutorial) return;

    this.deps.analytics?.track({
      type: 'action-completed',
      tutorialId: this.tutorial.id,
      version: this.tutorial.version,
      stepIndex: this.index,
      stepId: step.id,
    });

    // La acción esperada ya se cumplió: se avanza solo, que es lo que el usuario espera
    // después de hacer clic en el elemento que el tutorial le pidió pulsar.
    this.next();
  }

  private finish(reason: TutorialFinishReason): void {
    const tutorial = this.tutorial;
    if (!tutorial) return;

    const event: TutorialFinishEvent = {
      tutorialId: tutorial.id,
      version: tutorial.version,
      reason,
      stepId: this.steps[this.index]?.id ?? null,
      stepIndex: this.index,
      totalSteps: this.steps.length,
      nextTutorialId: tutorial.nextTutorialId,
    };

    this.stopInternals();
    this.deps.renderer.destroy();
    this.restoreFocus();
    this.tutorial = null;
    this.steps = [];
    this.setState({ ...IDLE_STATE, status: 'finished' });

    this.deps.analytics?.track({
      type: reason === 'completed' ? 'tutorial-completed' : reason === 'skipped' ? 'tutorial-skipped' : 'tutorial-closed',
      tutorialId: event.tutorialId,
      version: event.version,
      stepIndex: event.stepIndex,
      stepId: event.stepId ?? undefined,
    });
    this.deps.onFinish?.(event);
    this.setState(IDLE_STATE);
  }

  private buildView(step: TutorialStep, element: Element | null, status: TutorialStepStatus): TutorialRenderView {
    const tutorial = this.tutorial;
    const total = this.steps.length;
    const stepNumber = this.index + 1;
    const actionPending = status === 'action-pending';

    return {
      tutorialId: tutorial?.id ?? '',
      tutorialTitle: tutorial?.title ?? '',
      stepId: step.id,
      title: step.title,
      description: step.description,
      element,
      placement: element ? (step.placement ?? 'bottom') : 'center',
      align: step.align ?? 'start',
      allowInteraction: stepAllowsInteraction(step),
      stepNumber,
      totalSteps: total,
      percent: total === 0 ? 0 : Math.round((stepNumber / total) * 100),
      progressLabel: `Paso ${stepNumber} de ${total}`,
      hint: this.resolveHint(step, status),
      status,
      canGoPrevious: this.index > 0,
      // Con una acción pendiente el botón queda deshabilitado, pero el paso puede
      // saltarse: nunca se deja al usuario encerrado.
      canGoNext: !actionPending,
      isLastStep: this.index === total - 1,
    };
  }

  private resolveHint(step: TutorialStep, status: TutorialStepStatus): string | null {
    if (status === 'target-missing') return step.hint ?? TARGET_MISSING_MESSAGE;
    if (status === 'action-pending') return step.hint ?? describeExpectedAction(step.expectedAction);
    return null;
  }

  private buildHandlers(): TutorialRendererHandlers {
    return {
      onNext: () => this.next(),
      onPrevious: () => this.previous(),
      onSkipStep: () => this.skipStep(),
      onSkipTutorial: () => this.skipTutorial(),
      onClose: () => this.close(),
      onRetry: () => this.retry(),
    };
  }

  private prefersReducedMotion(): boolean {
    return Boolean(this.win?.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (!this.isActive()) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    // Enter y flechas sólo navegan si el foco no está dentro de un control editable:
    // en un paso que pide escribir, la tecla debe llegar al campo.
    const target = event.target;
    const editing =
      target instanceof HTMLElement &&
      (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
    if (editing) return;

    if (event.key === 'ArrowRight' || event.key === 'Enter') {
      if (this.state.stepStatus === 'action-pending') return;
      event.preventDefault();
      this.next();
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previous();
    }
  };

  private attachKeyboard(): void {
    if (this.keyListenerAttached) return;
    this.doc.addEventListener('keydown', this.onKeyDown, true);
    this.keyListenerAttached = true;
  }

  private detachKeyboard(): void {
    if (!this.keyListenerAttached) return;
    this.doc.removeEventListener('keydown', this.onKeyDown, true);
    this.keyListenerAttached = false;
  }

  private clearStepWatchers(): void {
    this.actionWatcher?.dispose();
    this.actionWatcher = null;
    this.abortController?.abort();
    this.abortController = null;
  }

  private stopInternals(): void {
    this.runToken += 1;
    this.clearStepWatchers();
    this.detachKeyboard();
  }

  /** Accesibilidad: al terminar, el foco vuelve donde estaba antes del recorrido. */
  private restoreFocus(): void {
    const origin = this.focusOrigin;
    this.focusOrigin = null;
    if (origin?.isConnected) origin.focus({ preventScroll: true });
  }

  private setState(next: TutorialEngineState): void {
    this.state = next;
    this.deps.onStateChange?.(next);
  }
}
