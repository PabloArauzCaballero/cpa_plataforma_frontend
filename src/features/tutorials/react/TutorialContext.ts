import { createContext, useContext } from 'react';
import type { TutorialDefinition } from '../domain/TutorialDefinition';
import type { TutorialOverallProgress, TutorialProgressView } from '../domain/TutorialProgress';
import type { TutorialEngineState } from '../engine/TutorialEngine';

export interface TutorialContextValue {
  /** Tutoriales visibles para el usuario actual, con pasos ya filtrados por rol. */
  tutorials: TutorialDefinition[];
  /** Avance resuelto por tutorial (incluye política de versiones y prerrequisitos). */
  progress: Record<string, TutorialProgressView>;
  overall: TutorialOverallProgress;
  engineState: TutorialEngineState;
  isLoadingProgress: boolean;
  /** De dónde viene el progreso, para poder advertirlo en la interfaz. */
  progressSource: 'backend' | 'local';
  autoStartDisabled: boolean;

  /** Comienza desde el primer paso. */
  start(tutorialId: string): void;
  /** Continúa donde el usuario lo dejó (o desde el principio si no había avance). */
  resume(tutorialId: string): void;
  /** Reinicia el avance y arranca desde el primer paso. */
  restart(tutorialId: string): void;
  /** Marca como omitido sin ejecutarlo. */
  skip(tutorialId: string): void;
  /** Borra el avance de un tutorial. */
  reset(tutorialId: string): void;
  resetAll(): void;
  stop(): void;
  setAutoStartDisabled(disabled: boolean): void;

  /** Tutorial pertinente para una pantalla concreta. */
  findContextual(context: { route?: string; moduleKey?: string }): TutorialDefinition | undefined;
  getTutorial(tutorialId: string): TutorialDefinition | undefined;
}

export const TutorialContext = createContext<TutorialContextValue | null>(null);

export function useTutorials(): TutorialContextValue {
  const value = useContext(TutorialContext);
  if (!value) {
    throw new Error('useTutorials debe usarse dentro de <TutorialProvider>.');
  }
  return value;
}

/**
 * Variante tolerante: devuelve `null` fuera del proveedor en lugar de lanzar.
 * La usan componentes compartidos que también se renderizan en pantallas sin sesión.
 */
export function useOptionalTutorials(): TutorialContextValue | null {
  return useContext(TutorialContext);
}
