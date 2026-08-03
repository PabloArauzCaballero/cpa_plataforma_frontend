const AUTOSTART_KEY = 'cpa.tutorials.autostart.disabled.v1';

/**
 * Preferencias de presentación del usuario. Son ajustes de comodidad (no progreso),
 * así que viven siempre en el dispositivo: "no volver a mostrarme esto aquí".
 */
export function isAutoStartDisabled(): boolean {
  try {
    return window.localStorage.getItem(AUTOSTART_KEY) === 'true';
  } catch {
    // Sin acceso a almacenamiento no insistimos con el recorrido automático.
    return true;
  }
}

export function setAutoStartDisabled(disabled: boolean): void {
  try {
    if (disabled) window.localStorage.setItem(AUTOSTART_KEY, 'true');
    else window.localStorage.removeItem(AUTOSTART_KEY);
  } catch {
    // Preferencia no persistible: se ignora sin romper la interfaz.
  }
}
