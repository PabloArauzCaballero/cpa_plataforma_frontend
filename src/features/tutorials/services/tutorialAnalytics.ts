export type TutorialAnalyticsEventType =
  | 'tutorial-started'
  | 'tutorial-completed'
  | 'tutorial-closed'
  | 'tutorial-skipped'
  | 'tutorial-restarted'
  | 'step-skipped'
  | 'action-completed'
  | 'target-missing'
  | 'progress-sync-failed';

export interface TutorialAnalyticsEvent {
  type: TutorialAnalyticsEventType;
  tutorialId: string;
  version: string;
  stepIndex?: number;
  stepId?: string;
  detail?: string;
}

/**
 * Puerto de telemetría. La plataforma todavía no tiene un servicio de analítica, así que
 * la implementación por defecto sólo deja rastro en desarrollo y guarda los últimos
 * eventos en memoria para poder diagnosticar un recorrido roto desde la consola.
 */
export interface TutorialAnalyticsAdapter {
  track(event: TutorialAnalyticsEvent): void;
  /** Eventos recientes, del más antiguo al más nuevo. */
  history(): TutorialAnalyticsEvent[];
}

const MAX_HISTORY = 50;

const PROBLEM_EVENTS: ReadonlySet<TutorialAnalyticsEventType> = new Set([
  'target-missing',
  'progress-sync-failed',
]);

export function createTutorialAnalytics(options: { debug?: boolean } = {}): TutorialAnalyticsAdapter {
  const events: TutorialAnalyticsEvent[] = [];

  return {
    track(event) {
      events.push(event);
      if (events.length > MAX_HISTORY) events.shift();

      // Los fallos se registran siempre (también en producción): un tutorial que apunta
      // a un elemento inexistente es un defecto que hay que poder ver, no silenciar.
      if (PROBLEM_EVENTS.has(event.type)) {
        console.warn(
          `[tutoriales] ${event.type} · ${event.tutorialId}@${event.version}` +
            `${event.stepId ? ` · paso "${event.stepId}"` : ''}${event.detail ? ` · ${event.detail}` : ''}`,
        );
        return;
      }

      if (options.debug) {
        console.info(`[tutoriales] ${event.type} · ${event.tutorialId}@${event.version}`);
      }
    },
    history: () => [...events],
  };
}

export const NOOP_TUTORIAL_ANALYTICS: TutorialAnalyticsAdapter = {
  track: () => {},
  history: () => [],
};
