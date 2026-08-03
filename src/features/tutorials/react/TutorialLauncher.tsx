import { useLocation, useNavigate } from 'react-router-dom';
import { TUTORIAL_ANCHORS, tutorialAnchor } from '../domain/tutorialAnchors';
import { TUTORIAL_CENTER_ROUTE } from '../domain/tutorialRoutes';
import { useOptionalTutorials } from './TutorialContext';
import styles from './TutorialLauncher.module.css';

interface TutorialLauncherProps {
  /** Módulo actual, para ofrecer su tutorial cuando no hay uno específico de la ruta. */
  moduleKey?: string;
  className?: string;
  label?: string;
  /** Ancla del elemento; permite distinguir el botón del encabezado del de una pantalla. */
  anchor?: (typeof TUTORIAL_ANCHORS)[keyof typeof TUTORIAL_ANCHORS];
}

/**
 * Botón de ayuda contextual.
 *
 * Lanza el tutorial más pertinente para la pantalla actual (ruta exacta primero, módulo
 * después). Si no hay ninguno, lleva al Centro de tutoriales en lugar de no hacer nada.
 */
export function TutorialLauncher({
  moduleKey,
  className,
  label = 'Tutorial',
  anchor = TUTORIAL_ANCHORS.headerLauncher,
}: TutorialLauncherProps) {
  const tutorials = useOptionalTutorials();
  const location = useLocation();
  const navigate = useNavigate();

  const contextual = tutorials?.findContextual({ route: location.pathname, moduleKey });
  const view = contextual ? tutorials?.progress[contextual.id] : undefined;
  const inProgress = view?.status === 'en_progreso' && view.currentStepIndex > 0;

  const title = contextual
    ? inProgress
      ? `Continuar "${contextual.title}" (paso ${view!.currentStepIndex + 1} de ${view!.totalSteps})`
      : `Iniciar "${contextual.title}"`
    : 'Abrir el Centro de tutoriales';

  function launch() {
    if (!tutorials || !contextual) {
      navigate(TUTORIAL_CENTER_ROUTE);
      return;
    }
    if (inProgress) tutorials.resume(contextual.id);
    else tutorials.start(contextual.id);
  }

  return (
    <button
      type="button"
      {...tutorialAnchor(anchor)}
      className={[styles.launcher, className].filter(Boolean).join(' ')}
      onClick={launch}
      title={title}
      aria-label={title}
    >
      <i className="fa-solid fa-graduation-cap" aria-hidden="true" />
      <span>{inProgress ? 'Continuar tutorial' : label}</span>
      {inProgress ? <span className={styles.badge}>{view!.percent}%</span> : null}
    </button>
  );
}
