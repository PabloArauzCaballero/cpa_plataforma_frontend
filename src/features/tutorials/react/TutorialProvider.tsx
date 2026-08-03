import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FIRST_RUN_TUTORIAL_ID, createTutorialRegistry } from '../catalog';
import type { TutorialDefinition } from '../domain/TutorialDefinition';
import { createSessionViewer } from '../domain/tutorialAccess';
import type { TutorialProgressMap, TutorialProgressView } from '../domain/TutorialProgress';
import { resolveProgressView, summarizeProgress } from '../domain/TutorialProgress';
import { DriverTutorialRenderer } from '../engine/DriverTutorialRenderer';
import { TutorialEngine, type TutorialEngineState } from '../engine/TutorialEngine';
import { TutorialProgressService } from '../services/TutorialProgressService';
import { createTutorialAnalytics } from '../services/tutorialAnalytics';
import { isAutoStartDisabled, setAutoStartDisabled } from '../services/tutorialPreferences';
import { createTutorialProgressStorage } from '../services/tutorialProgressStorage';
import { TutorialContext, type TutorialContextValue } from './TutorialContext';

const IDLE_ENGINE_STATE: TutorialEngineState = {
  status: 'idle',
  tutorialId: null,
  tutorialTitle: null,
  stepId: null,
  stepIndex: 0,
  totalSteps: 0,
  stepStatus: 'ok',
  error: null,
};

interface TutorialProviderProps {
  children: ReactNode;
  /** Desactiva el arranque automático del recorrido de bienvenida (usado en pruebas). */
  disableAutoStart?: boolean;
}

/**
 * Cableado de la infraestructura de tutoriales con React y react-router.
 *
 * Este componente es sólo composición: crea el registro, la persistencia y el motor, y
 * los conecta con la navegación real. Ninguna regla de negocio vive aquí — si algo hay
 * que decidir sobre pasos, versiones o permisos, se decide en `domain/` o en `engine/`.
 */
export function TutorialProvider({ children, disableAutoStart = false }: TutorialProviderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // La ruta se lee por referencia dentro del motor: así un paso resuelto de forma
  // asíncrona consulta siempre la ruta vigente y no la que había al montarse.
  const routeRef = useRef(location.pathname);
  routeRef.current = location.pathname;

  const registry = useMemo(() => createTutorialRegistry(undefined, { logIssues: import.meta.env.DEV }), []);
  const analytics = useMemo(() => createTutorialAnalytics({ debug: import.meta.env.DEV }), []);
  const viewer = useMemo(() => createSessionViewer(), []);

  const progressService = useMemo(
    () => new TutorialProgressService({ storage: createTutorialProgressStorage(analytics) }),
    [analytics],
  );

  const [progressMap, setProgressMap] = useState<TutorialProgressMap>({});
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [engineState, setEngineState] = useState<TutorialEngineState>(IDLE_ENGINE_STATE);
  const [autoStartDisabled, setAutoStartDisabledState] = useState(() => isAutoStartDisabled());

  const tutorials = useMemo(() => registry.listFor(viewer), [registry, viewer]);

  const engineRef = useRef<TutorialEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new TutorialEngine({
      renderer: new DriverTutorialRenderer(),
      navigate: (route) => navigate(route),
      getCurrentRoute: () => routeRef.current,
      analytics,
      onStateChange: setEngineState,
      onStepChange: (event) => void progressService.markStep(event),
      onFinish: (event) => void progressService.markFinished(event),
      confirmExit: (tutorial, stepIndex) =>
        window.confirm(
          `Vas a salir de "${tutorial.title}" en el paso ${stepIndex + 1}.\n\n` +
            'Tu avance se guarda y podrás continuar desde el Centro de tutoriales. ¿Quieres salir?',
        ),
    });
  }
  const engine = engineRef.current;

  // Carga inicial del progreso (backend con respaldo local).
  useEffect(() => {
    let active = true;
    const unsubscribe = progressService.subscribe((next) => {
      if (active) setProgressMap(next);
    });

    void progressService
      .load()
      .catch(() => {
        // `ResilientTutorialProgressStorage` ya degradó a local y lo registró;
        // aquí sólo cerramos el estado de carga.
      })
      .finally(() => {
        if (active) setIsLoadingProgress(false);
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [progressService]);

  // El motor se destruye al desmontar el proveedor (cierre de sesión, recarga).
  useEffect(() => () => engine.destroy(), [engine]);

  // Cambios de ruta: resuelven acciones `navigate` y reposicionan el globo.
  useEffect(() => {
    engine.notifyRouteChange(location.pathname);
  }, [engine, location.pathname]);

  // Reposicionamiento ante cambios de viewport (responsive, teclado móvil, zoom).
  useEffect(() => {
    const refresh = () => engine.refresh();
    window.addEventListener('resize', refresh);
    window.addEventListener('orientationchange', refresh);
    return () => {
      window.removeEventListener('resize', refresh);
      window.removeEventListener('orientationchange', refresh);
    };
  }, [engine]);

  const progress = useMemo(() => {
    return tutorials.reduce<Record<string, TutorialProgressView>>((acc, tutorial) => {
      acc[tutorial.id] = resolveProgressView(tutorial, progressMap[tutorial.id], progressMap);
      return acc;
    }, {});
  }, [tutorials, progressMap]);

  const overall = useMemo(() => summarizeProgress(Object.values(progress)), [progress]);

  const launch = useCallback(
    (tutorial: TutorialDefinition, startAtIndex: number) => {
      void progressService.markStarted(tutorial);
      engine.start(tutorial, startAtIndex);
    },
    [engine, progressService],
  );

  const start = useCallback(
    (tutorialId: string) => {
      const tutorial = registry.resolve(tutorialId, viewer);
      if (!tutorial) return;
      launch(tutorial, 0);
    },
    [launch, registry, viewer],
  );

  const resume = useCallback(
    (tutorialId: string) => {
      const tutorial = registry.resolve(tutorialId, viewer);
      if (!tutorial) return;
      launch(tutorial, progress[tutorialId]?.currentStepIndex ?? 0);
    },
    [launch, progress, registry, viewer],
  );

  const restart = useCallback(
    (tutorialId: string) => {
      const tutorial = registry.resolve(tutorialId, viewer);
      if (!tutorial) return;
      analytics.track({ type: 'tutorial-restarted', tutorialId, version: tutorial.version });
      void progressService.restart(tutorial).then(() => launch(tutorial, 0));
    },
    [analytics, launch, progressService, registry, viewer],
  );

  const skip = useCallback(
    (tutorialId: string) => {
      const tutorial = registry.resolve(tutorialId, viewer);
      if (!tutorial) return;
      void progressService.markFinished({
        tutorialId: tutorial.id,
        version: tutorial.version,
        reason: 'skipped',
        stepId: null,
        stepIndex: 0,
        totalSteps: tutorial.steps.length,
      });
    },
    [progressService, registry, viewer],
  );

  const reset = useCallback((tutorialId: string) => void progressService.reset(tutorialId), [progressService]);
  const resetAll = useCallback(() => void progressService.resetAll(), [progressService]);
  const stop = useCallback(() => engine.close({ confirm: false }), [engine]);

  const updateAutoStart = useCallback((disabled: boolean) => {
    setAutoStartDisabled(disabled);
    setAutoStartDisabledState(disabled);
  }, []);

  // Recorrido de bienvenida la primera vez, una vez conocido el progreso real.
  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (disableAutoStart || autoStartDisabled || isLoadingProgress || autoStartedRef.current) return;

    const intro = progress[FIRST_RUN_TUTORIAL_ID];
    if (!intro || intro.status !== 'pendiente' || intro.repetitions > 0) return;

    autoStartedRef.current = true;
    // Se deja respirar al primer render para que el menú y el encabezado ya existan
    // cuando el primer paso busque su elemento.
    const timer = window.setTimeout(() => start(FIRST_RUN_TUTORIAL_ID), 800);
    return () => window.clearTimeout(timer);
  }, [autoStartDisabled, disableAutoStart, isLoadingProgress, progress, start]);

  const value = useMemo<TutorialContextValue>(
    () => ({
      tutorials,
      progress,
      overall,
      engineState,
      isLoadingProgress,
      progressSource: progressService.describeSource(),
      autoStartDisabled,
      start,
      resume,
      restart,
      skip,
      reset,
      resetAll,
      stop,
      setAutoStartDisabled: updateAutoStart,
      findContextual: (context) => registry.findContextual(viewer, context),
      getTutorial: (tutorialId) => registry.resolve(tutorialId, viewer),
    }),
    [
      autoStartDisabled,
      engineState,
      isLoadingProgress,
      overall,
      progress,
      progressService,
      registry,
      reset,
      resetAll,
      restart,
      resume,
      skip,
      start,
      stop,
      tutorials,
      updateAutoStart,
      viewer,
    ],
  );

  return <TutorialContext.Provider value={value}>{children}</TutorialContext.Provider>;
}
