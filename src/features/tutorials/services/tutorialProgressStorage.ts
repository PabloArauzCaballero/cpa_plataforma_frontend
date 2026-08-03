import { getStoredSession } from '@/shared/auth/session';
import type { TutorialProgressEntry } from '../domain/TutorialProgress';
import {
  LocalTutorialProgressStorage,
  buildLocalStorageKey,
  type TutorialProgressStorage,
} from './LocalTutorialProgressStorage';
import { ResilientTutorialProgressStorage } from './ResilientTutorialProgressStorage';
import type { TutorialAnalyticsAdapter } from './tutorialAnalytics';
import {
  deleteAllTutorialProgress,
  deleteTutorialProgress,
  fetchTutorialProgress,
  isBackendUnsupported,
  putTutorialProgress,
} from './tutorialProgressApi';

export { LocalTutorialProgressStorage, ResilientTutorialProgressStorage, buildLocalStorageKey };
export type { TutorialProgressStorage };

/** Adaptador remoto: traduce el puerto de persistencia al contrato HTTP. */
export class BackendTutorialProgressStorage implements TutorialProgressStorage {
  load(): Promise<TutorialProgressEntry[]> {
    return fetchTutorialProgress();
  }

  save(entry: TutorialProgressEntry): Promise<void> {
    return putTutorialProgress(entry);
  }

  reset(tutorialId: string): Promise<void> {
    return deleteTutorialProgress(tutorialId);
  }

  resetAll(): Promise<void> {
    return deleteAllTutorialProgress();
  }

  describeSource(): 'backend' {
    return 'backend';
  }
}

/** Adaptador local ligado a la identidad de la sesión actual. */
export function createSessionLocalStorage(): LocalTutorialProgressStorage {
  return new LocalTutorialProgressStorage(() => buildLocalStorageKey(getStoredSession()?.email));
}

/**
 * Raíz de composición de la persistencia: es el único punto donde se decide que la
 * fuente remota es la API HTTP y la local es `localStorage`.
 */
export function createTutorialProgressStorage(
  analytics?: TutorialAnalyticsAdapter,
): ResilientTutorialProgressStorage {
  return new ResilientTutorialProgressStorage({
    backend: new BackendTutorialProgressStorage(),
    local: createSessionLocalStorage(),
    isUnsupported: isBackendUnsupported,
    analytics,
  });
}
