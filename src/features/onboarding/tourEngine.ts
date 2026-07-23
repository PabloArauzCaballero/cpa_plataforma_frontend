import { driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import './tour.css';

export interface TourStep {
  /** Selector CSS del elemento a resaltar. Si se omite, el paso es un modal centrado. */
  element?: string;
  title: string;
  description: string;
}

export interface RunTourOptions {
  /** Callback al finalizar o cerrar el recorrido. */
  onDone?: () => void;
}

/**
 * Ejecuta un recorrido guiado (driver.js) con textos en español.
 *
 * Los pasos sin `element`, o cuyo selector no exista en la página actual, se muestran
 * como tarjeta centrada — así un mismo tour puede explicar pasos que viven en otras
 * pantallas sin romperse.
 */
export function runTour(steps: TourStep[], options: RunTourOptions = {}): void {
  if (steps.length === 0) return;

  const driveSteps: DriveStep[] = steps.map((step) => ({
    element: step.element && document.querySelector(step.element) ? step.element : undefined,
    popover: {
      title: step.title,
      description: step.description,
    },
  }));

  const instance = driver({
    showProgress: true,
    allowClose: true,
    overlayColor: 'rgba(15, 23, 42, 0.55)',
    stagePadding: 6,
    stageRadius: 8,
    progressText: 'Paso {{current}} de {{total}}',
    nextBtnText: 'Siguiente',
    prevBtnText: 'Anterior',
    doneBtnText: 'Finalizar',
    onDestroyed: () => {
      options.onDone?.();
    },
    steps: driveSteps,
  });

  instance.drive();
}
