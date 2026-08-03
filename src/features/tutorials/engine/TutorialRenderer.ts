import type { TutorialAlign, TutorialPlacement } from '../domain/TutorialDefinition';

export type TutorialStepStatus =
  /** Todo bien: paso listo para leerse. */
  | 'ok'
  /** El paso exige una acción que el usuario aún no ha realizado. */
  | 'action-pending'
  /** El elemento objetivo no apareció dentro del tiempo de espera. */
  | 'target-missing';

/** Todo lo que la capa visual necesita para pintar un paso. Sin lógica, sólo datos. */
export interface TutorialRenderView {
  tutorialId: string;
  tutorialTitle: string;
  stepId: string;
  title: string;
  description: string;
  element: Element | null;
  placement: TutorialPlacement;
  align: TutorialAlign;
  allowInteraction: boolean;
  stepNumber: number;
  totalSteps: number;
  percent: number;
  progressLabel: string;
  /** Mensaje de ayuda o de error asociado al estado actual. */
  hint: string | null;
  status: TutorialStepStatus;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLastStep: boolean;
}

export interface TutorialRendererHandlers {
  onNext(): void;
  onPrevious(): void;
  /** Salta sólo este paso (disponible cuando el objetivo no aparece). */
  onSkipStep(): void;
  /** Abandona el tutorial marcándolo como omitido. */
  onSkipTutorial(): void;
  /** Cierra el tutorial conservando el avance. */
  onClose(): void;
  /** Reintenta localizar el objetivo del paso actual. */
  onRetry(): void;
}

/**
 * Puerto de presentación del motor.
 *
 * El motor sólo conoce esta interfaz, de modo que la implementación real (driver.js)
 * puede sustituirse por un doble en las pruebas sin tocar una línea del núcleo.
 */
export interface TutorialRenderer {
  render(view: TutorialRenderView, handlers: TutorialRendererHandlers): void;
  /** Recalcula posiciones (resize, scroll, cambios de layout). */
  refresh(): void;
  destroy(): void;
}
