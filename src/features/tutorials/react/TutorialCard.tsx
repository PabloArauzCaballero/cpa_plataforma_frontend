import type { TutorialDefinition } from '../domain/TutorialDefinition';
import type { TutorialProgressView, TutorialStatus } from '../domain/TutorialProgress';
import { TUTORIAL_ANCHORS, tutorialAnchor, tutorialAnchorFor } from '../domain/tutorialAnchors';
import styles from './TutorialCard.module.css';

interface TutorialCardProps {
  tutorial: TutorialDefinition;
  progress: TutorialProgressView;
  /** Títulos de los prerrequisitos, para mostrarlos en lenguaje humano. */
  prerequisiteTitles: Record<string, string>;
  onStart(): void;
  onResume(): void;
  onRestart(): void;
  onSkip(): void;
}

const STATUS_LABEL: Record<TutorialStatus, string> = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completado: 'Completado',
  omitido: 'Omitido',
};

const STATUS_ICON: Record<TutorialStatus, string> = {
  pendiente: 'fa-regular fa-circle',
  en_progreso: 'fa-solid fa-circle-half-stroke',
  completado: 'fa-solid fa-circle-check',
  omitido: 'fa-solid fa-circle-minus',
};

const DIFFICULTY_LABEL: Record<TutorialDefinition['difficulty'], string> = {
  basico: 'Básico',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};

const CATEGORY_LABEL: Record<TutorialDefinition['category'], string> = {
  introduccion: 'Introducción',
  navegacion: 'Navegación',
  cuenta: 'Cuenta',
  modulo: 'Módulo',
  operacion: 'Operación',
  rol: 'Por rol',
};

export function TutorialCard({
  tutorial,
  progress,
  prerequisiteTitles,
  onStart,
  onResume,
  onRestart,
  onSkip,
}: TutorialCardProps) {
  const blocked = progress.missingPrerequisites.length > 0;
  const canResume = progress.status === 'en_progreso' && progress.currentStepIndex > 0;
  const isCompleted = progress.status === 'completado';

  const blockingTitles = progress.missingPrerequisites.map((id) => prerequisiteTitles[id] ?? id);

  return (
    <article className={styles.card} data-status={progress.status} {...tutorialAnchorFor(TUTORIAL_ANCHORS.centerCard, tutorial.id)}>
      <header className={styles.header}>
        <div className={styles.tags}>
          <span className={styles.tag}>{CATEGORY_LABEL[tutorial.category]}</span>
          <span className={styles.tag} data-variant="difficulty">
            {DIFFICULTY_LABEL[tutorial.difficulty]}
          </span>
          {tutorial.mandatory ? (
            <span className={styles.tag} data-variant="mandatory">
              Obligatorio
            </span>
          ) : null}
          {tutorial.recommended && !isCompleted ? (
            <span className={styles.tag} data-variant="recommended">
              Recomendado
            </span>
          ) : null}
        </div>

        {/* El estado se comunica con icono + texto, nunca sólo con color. */}
        <span className={styles.status} data-status={progress.status}>
          <i className={STATUS_ICON[progress.status]} aria-hidden="true" />
          {STATUS_LABEL[progress.status]}
        </span>
      </header>

      <h3 className={styles.title}>{tutorial.title}</h3>
      <p className={styles.description}>{tutorial.description}</p>

      <dl className={styles.meta}>
        <div>
          <dt>Duración</dt>
          <dd>{tutorial.estimatedMinutes} min</dd>
        </div>
        <div>
          <dt>Pasos</dt>
          <dd>{progress.totalSteps}</dd>
        </div>
        {progress.repetitions > 0 ? (
          <div>
            <dt>Veces completado</dt>
            <dd>{progress.repetitions}</dd>
          </div>
        ) : null}
      </dl>

      {progress.percent > 0 && !isCompleted ? (
        <div className={styles.progress}>
          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress.percent}
            aria-label={`Avance de ${tutorial.title}`}
          >
            <span className={styles.progressBar} style={{ width: `${progress.percent}%` }} />
          </div>
          <span className={styles.progressLabel}>
            Paso {progress.currentStepIndex + 1} de {progress.totalSteps}
          </span>
        </div>
      ) : null}

      {progress.outdated ? (
        <p className={styles.notice} data-tone="info">
          <i className="fa-solid fa-rotate" aria-hidden="true" />
          Este tutorial se actualizó desde que lo completaste. Conviene repetirlo.
        </p>
      ) : null}

      {blocked ? (
        <p className={styles.notice} data-tone="warning">
          <i className="fa-solid fa-lock" aria-hidden="true" />
          Requiere completar antes: {blockingTitles.join(', ')}.
        </p>
      ) : null}

      <footer className={styles.actions}>
        {canResume ? (
          <button type="button" className={styles.primary} onClick={onResume} {...tutorialAnchor(TUTORIAL_ANCHORS.centerStart)}>
            <i className="fa-solid fa-play" aria-hidden="true" />
            Continuar
          </button>
        ) : (
          <button
            type="button"
            className={styles.primary}
            onClick={isCompleted ? onRestart : onStart}
            {...tutorialAnchor(TUTORIAL_ANCHORS.centerStart)}
          >
            <i className={isCompleted ? 'fa-solid fa-rotate-right' : 'fa-solid fa-play'} aria-hidden="true" />
            {isCompleted ? 'Repetir' : 'Comenzar'}
          </button>
        )}

        {progress.status !== 'pendiente' ? (
          <button type="button" className={styles.secondary} onClick={onRestart}>
            Reiniciar
          </button>
        ) : null}

        {!isCompleted && progress.status !== 'omitido' ? (
          <button type="button" className={styles.ghost} onClick={onSkip}>
            Omitir
          </button>
        ) : null}
      </footer>
    </article>
  );
}
