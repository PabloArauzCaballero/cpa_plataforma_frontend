export type ThemeName = 'light' | 'dark';
export type ThemePreference = ThemeName | 'system';

export const THEME_STORAGE_KEY = 'cpa.theme.v1';

/** Atributo que leen los bloques `:root[data-theme='dark']` de `theme.css`. */
export const THEME_ATTRIBUTE = 'data-theme';

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

/**
 * Preferencia guardada por la persona usuaria. `system` (o nada guardado)
 * significa "sigue lo que diga el sistema operativo".
 */
export function readStoredPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : 'system';
  } catch {
    // Almacenamiento bloqueado (modo privado, políticas de empresa): no es
    // motivo para romper la aplicación, sólo para no recordar la elección.
    return 'system';
  }
}

export function storePreference(preference: ThemePreference): void {
  try {
    if (preference === 'system') window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Igual que arriba: la preferencia se aplica igual, sólo no persiste.
  }
}

export function systemPrefersDark(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/** Traduce la preferencia al tema concreto que hay que pintar. */
export function resolveTheme(preference: ThemePreference): ThemeName {
  if (preference === 'system') return systemPrefersDark() ? 'dark' : 'light';
  return preference;
}

/**
 * Aplica el tema al documento.
 *
 * Además del atributo, se fija `color-scheme`: es lo que hace que los
 * controles nativos —barras de desplazamiento, selectores de fecha, el fondo
 * por defecto de los `select`— se pinten en su versión oscura. Sin esto queda
 * una interfaz oscura salpicada de widgets blancos del navegador.
 */
export function applyTheme(theme: ThemeName): void {
  const root = document.documentElement;
  root.setAttribute(THEME_ATTRIBUTE, theme);
  root.style.colorScheme = theme;
}
