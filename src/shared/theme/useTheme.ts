import { useCallback, useEffect, useState } from 'react';
import {
  applyTheme,
  readStoredPreference,
  resolveTheme,
  storePreference,
  type ThemeName,
  type ThemePreference,
} from './theme';

interface UseThemeResult {
  /** Lo que eligió la persona: `light`, `dark` o `system`. */
  preference: ThemePreference;
  /** El tema que realmente se está pintando. */
  theme: ThemeName;
  setPreference: (preference: ThemePreference) => void;
  /** Alterna entre claro y oscuro partiendo de lo que se ve ahora. */
  toggle: () => void;
}

export function useTheme(): UseThemeResult {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => readStoredPreference());
  const [theme, setTheme] = useState<ThemeName>(() => resolveTheme(readStoredPreference()));

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    storePreference(next);
    const resolved = resolveTheme(next);
    setTheme(resolved);
    applyTheme(resolved);
  }, []);

  const toggle = useCallback(() => {
    setPreference(resolveTheme(readStoredPreference()) === 'dark' ? 'light' : 'dark');
  }, [setPreference]);

  // Mientras la preferencia sea `system`, seguir los cambios del sistema en
  // vivo: quien tenga el cambio automático al anochecer ve girar la interfaz
  // sin recargar. En cuanto se elige un tema concreto, deja de escucharse.
  useEffect(() => {
    if (preference !== 'system') return undefined;
    if (typeof window.matchMedia !== 'function') return undefined;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    function sync() {
      const resolved: ThemeName = media.matches ? 'dark' : 'light';
      setTheme(resolved);
      applyTheme(resolved);
    }
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [preference]);

  return { preference, theme, setPreference, toggle };
}
