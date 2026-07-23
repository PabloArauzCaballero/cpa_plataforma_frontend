import { useEffect } from 'react';
import { runTour } from './tourEngine';
import { getAppOnboardingTour } from './tours';

const STORAGE_KEY = 'cpa.onboarding.completed.v1';

function alreadyCompleted(): boolean {
  try {
    return Boolean(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return true; // sin acceso a storage, no insistimos con el tour automático.
  }
}

function markCompleted(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  } catch {
    /* almacenamiento no disponible: se ignora. */
  }
}

/**
 * Lanza automáticamente el recorrido de bienvenida la primera vez que un usuario
 * autenticado entra a la plataforma. Solo se muestra una vez (persistido en localStorage).
 */
export function useFirstRunOnboarding(ready: boolean): void {
  useEffect(() => {
    if (!ready || alreadyCompleted()) return;

    const timer = window.setTimeout(() => {
      runTour(getAppOnboardingTour(), { onDone: markCompleted });
    }, 700);

    return () => window.clearTimeout(timer);
  }, [ready]);
}
