import { useMemo, useState } from 'react';
import { PageState } from '@/shared/components/PageState';
import { getModuleVisualMeta } from '@/features/dashboard/moduleMeta';
import type { TutorialCategory, TutorialDefinition } from '../domain/TutorialDefinition';
import type { TutorialStatus } from '../domain/TutorialProgress';
import { TUTORIAL_ANCHORS, tutorialAnchor } from '../domain/tutorialAnchors';
import { searchTutorials } from '../registry/TutorialRegistry';
import { TutorialCard } from '../react/TutorialCard';
import { useTutorials } from '../react/TutorialContext';
import styles from './TutorialCenterPage.module.css';

type StatusFilter = 'todos' | TutorialStatus | 'obligatorios' | 'recomendados';
type CategoryFilter = 'todas' | TutorialCategory;

const STATUS_FILTERS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'en_progreso', label: 'En progreso' },
  { value: 'completado', label: 'Completados' },
  { value: 'omitido', label: 'Omitidos' },
  { value: 'obligatorios', label: 'Obligatorios' },
  { value: 'recomendados', label: 'Recomendados' },
];

const CATEGORY_FILTERS: Array<{ value: CategoryFilter; label: string }> = [
  { value: 'todas', label: 'Todas las categorías' },
  { value: 'introduccion', label: 'Introducción' },
  { value: 'navegacion', label: 'Navegación' },
  { value: 'operacion', label: 'Operación' },
  { value: 'modulo', label: 'Por módulo' },
  { value: 'rol', label: 'Por rol' },
  { value: 'cuenta', label: 'Cuenta' },
];

/**
 * Centro de Tutoriales: la pestaña de aprendizaje de la plataforma.
 *
 * Sólo compone y filtra; el avance, el acceso por rol y la ejecución vienen del
 * proveedor. Todo tutorial abierto desde aquí se ejecuta sobre la interfaz real.
 */
export function TutorialCenterPage() {
  const { tutorials, progress, overall, isLoadingProgress, progressSource, autoStartDisabled, start, resume, restart, skip, resetAll, setAutoStartDisabled } =
    useTutorials();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('todos');
  const [category, setCategory] = useState<CategoryFilter>('todas');
  const [moduleKey, setModuleKey] = useState<string>('todos');

  const availableModules = useMemo(() => {
    const keys = new Set(tutorials.map((tutorial) => tutorial.moduleKey).filter((key): key is string => Boolean(key)));
    return Array.from(keys).sort();
  }, [tutorials]);

  const titlesById = useMemo(
    () => Object.fromEntries(tutorials.map((tutorial) => [tutorial.id, tutorial.title])),
    [tutorials],
  );

  const filtered = useMemo(() => {
    let result: TutorialDefinition[] = searchTutorials(tutorials, search);

    if (category !== 'todas') result = result.filter((tutorial) => tutorial.category === category);
    if (moduleKey !== 'todos') result = result.filter((tutorial) => tutorial.moduleKey === moduleKey);

    if (status === 'obligatorios') result = result.filter((tutorial) => tutorial.mandatory);
    else if (status === 'recomendados') result = result.filter((tutorial) => tutorial.recommended);
    else if (status !== 'todos') result = result.filter((tutorial) => progress[tutorial.id]?.status === status);

    return result;
  }, [category, moduleKey, progress, search, status, tutorials]);

  // "Continúa donde lo dejaste" y "Empieza por aquí" resuelven la pregunta más común
  // al abrir esta pantalla: ¿qué hago ahora?
  const inProgress = useMemo(
    () => tutorials.filter((tutorial) => progress[tutorial.id]?.status === 'en_progreso'),
    [progress, tutorials],
  );

  const suggested = useMemo(
    () =>
      tutorials.filter(
        (tutorial) =>
          (tutorial.mandatory || tutorial.recommended) &&
          progress[tutorial.id]?.status === 'pendiente' &&
          (progress[tutorial.id]?.missingPrerequisites.length ?? 0) === 0,
      ),
    [progress, tutorials],
  );

  if (isLoadingProgress) {
    return <PageState title="Cargando tutoriales" message="Consultando tu avance de aprendizaje." />;
  }

  if (tutorials.length === 0) {
    return (
      <PageState
        title="Sin tutoriales disponibles"
        message="Tu usuario no tiene acceso a ningún tutorial en este momento. Consulta con un administrador si crees que es un error."
      />
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.hero} {...tutorialAnchor(TUTORIAL_ANCHORS.centerHero)}>
        <div className={styles.heroCopy}>
          <span>Centro de tutoriales</span>
          <h2>Aprende la plataforma paso a paso</h2>
          <p>
            Cada tutorial se ejecuta sobre las pantallas reales de CPA. Puedes salir cuando quieras: tu avance se
            guarda y podrás continuar desde donde lo dejaste.
          </p>
        </div>

        <div className={styles.heroProgress} {...tutorialAnchor(TUTORIAL_ANCHORS.centerProgress)}>
          <strong>{overall.percent}%</strong>
          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={overall.percent}
            aria-label="Avance general de tutoriales"
          >
            <span className={styles.progressBar} style={{ width: `${overall.percent}%` }} />
          </div>
          <span>
            {overall.completed} de {overall.total} completados · {overall.inProgress} en progreso · {overall.pending} pendientes
          </span>
        </div>
      </div>

      {inProgress.length > 0 ? (
        <section className={styles.shortcuts} aria-label="Continuar donde lo dejaste">
          <h3>Continúa donde lo dejaste</h3>
          <div className={styles.shortcutList}>
            {inProgress.map((tutorial) => (
              <button key={tutorial.id} type="button" className={styles.shortcut} onClick={() => resume(tutorial.id)}>
                <i className="fa-solid fa-play" aria-hidden="true" />
                <span>
                  {tutorial.title}
                  <small>
                    Paso {(progress[tutorial.id]?.currentStepIndex ?? 0) + 1} de {progress[tutorial.id]?.totalSteps ?? 0}
                  </small>
                </span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {suggested.length > 0 ? (
        <section className={styles.shortcuts} aria-label="Tutoriales recomendados">
          <h3>Empieza por aquí</h3>
          <div className={styles.shortcutList}>
            {suggested.map((tutorial) => (
              <button key={tutorial.id} type="button" className={styles.shortcut} onClick={() => start(tutorial.id)}>
                <i className={tutorial.mandatory ? 'fa-solid fa-star' : 'fa-solid fa-lightbulb'} aria-hidden="true" />
                <span>
                  {tutorial.title}
                  <small>
                    {tutorial.mandatory ? 'Obligatorio' : 'Recomendado'} · {tutorial.estimatedMinutes} min
                  </small>
                </span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <div className={styles.toolbar} {...tutorialAnchor(TUTORIAL_ANCHORS.centerFilters)}>
        <label className={styles.searchBox}>
          <span>Buscar tutorial</span>
          <input
            type="search"
            value={search}
            placeholder="Ej. contabilidad, importar, estudiante..."
            onChange={(event) => setSearch(event.target.value)}
            {...tutorialAnchor(TUTORIAL_ANCHORS.centerSearch)}
          />
        </label>

        <label className={styles.field}>
          <span>Estado</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}>
            {STATUS_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Categoría</span>
          <select value={category} onChange={(event) => setCategory(event.target.value as CategoryFilter)}>
            {CATEGORY_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {availableModules.length > 0 ? (
          <label className={styles.field}>
            <span>Módulo</span>
            <select value={moduleKey} onChange={(event) => setModuleKey(event.target.value)}>
              <option value="todos">Todos los módulos</option>
              {availableModules.map((key) => (
                <option key={key} value={key}>
                  {getModuleVisualMeta(key).accent}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <PageState
          title="Sin coincidencias"
          message="No hay tutoriales que coincidan con la búsqueda y los filtros aplicados."
          actionLabel="Limpiar filtros"
          onAction={() => {
            setSearch('');
            setStatus('todos');
            setCategory('todas');
            setModuleKey('todos');
          }}
        />
      ) : (
        <div className={styles.grid} {...tutorialAnchor(TUTORIAL_ANCHORS.centerList)}>
          {filtered.map((tutorial) => (
            <TutorialCard
              key={tutorial.id}
              tutorial={tutorial}
              progress={progress[tutorial.id]}
              prerequisiteTitles={titlesById}
              onStart={() => start(tutorial.id)}
              onResume={() => resume(tutorial.id)}
              onRestart={() => restart(tutorial.id)}
              onSkip={() => skip(tutorial.id)}
            />
          ))}
        </div>
      )}

      <footer className={styles.settings}>
        <div>
          <h3>Preferencias de aprendizaje</h3>
          <p>
            El progreso se guarda {progressSource === 'backend' ? 'en tu cuenta, así puedes continuar desde otro dispositivo' : 'en este dispositivo mientras el servicio de progreso no esté disponible'}.
          </p>
        </div>

        <div className={styles.settingsActions}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={autoStartDisabled}
              onChange={(event) => setAutoStartDisabled(event.target.checked)}
            />
            <span>No mostrar el recorrido de bienvenida automáticamente</span>
          </label>

          <button type="button" className={styles.dangerAction} onClick={() => resetAll()}>
            Reiniciar todo mi avance
          </button>
        </div>
      </footer>
    </section>
  );
}
