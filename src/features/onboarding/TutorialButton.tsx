import { runTour } from './tourEngine';
import { getAppOnboardingTour, getModuleTour } from './tours';

interface TutorialButtonProps {
  /** Módulo actual. Si tiene tutorial dedicado se lanza ese; si no, el de bienvenida. */
  moduleKey?: string;
  className?: string;
  label?: string;
}

/**
 * Botón que lanza el recorrido guiado del módulo actual (o el de bienvenida como respaldo).
 */
export function TutorialButton({ moduleKey, className, label = 'Tutorial' }: TutorialButtonProps) {
  function start() {
    const steps = (moduleKey ? getModuleTour(moduleKey) : null) ?? getAppOnboardingTour();
    runTour(steps);
  }

  return (
    <button type="button" data-tour="tutorial-button" className={className} onClick={start}>
      <i className="fa-solid fa-graduation-cap" aria-hidden="true" />
      {label}
    </button>
  );
}
