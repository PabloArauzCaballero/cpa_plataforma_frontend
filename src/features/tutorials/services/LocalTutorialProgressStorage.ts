import type { TutorialProgressEntry } from '../domain/TutorialProgress';

/**
 * Puerto de persistencia del progreso.
 *
 * Vive junto al adaptador local a propósito: así el servicio de progreso puede depender
 * del contrato sin arrastrar el cliente HTTP (y su configuración de entorno) al grafo
 * de importación de las pruebas.
 */
export interface TutorialProgressStorage {
  load(): Promise<TutorialProgressEntry[]>;
  save(entry: TutorialProgressEntry): Promise<void>;
  reset(tutorialId: string): Promise<void>;
  resetAll(): Promise<void>;
  /** Origen efectivo de los datos, para poder informarlo en la interfaz. */
  describeSource(): 'backend' | 'local';
}

export const TUTORIAL_PROGRESS_STORAGE_PREFIX = 'cpa.tutorials.progress.v1';

/**
 * La clave incluye la identidad del usuario: en un equipo compartido, el avance de una
 * persona no debe aparecerle a la siguiente que inicie sesión.
 */
export function buildLocalStorageKey(identity: string | undefined): string {
  return identity ? `${TUTORIAL_PROGRESS_STORAGE_PREFIX}::${identity}` : TUTORIAL_PROGRESS_STORAGE_PREFIX;
}

function isEntry(value: unknown): value is TutorialProgressEntry {
  return typeof value === 'object' && value !== null && typeof (value as TutorialProgressEntry).tutorialId === 'string';
}

/** Respaldo local del progreso. Nunca lanza: si el almacenamiento falla, degrada a vacío. */
export class LocalTutorialProgressStorage implements TutorialProgressStorage {
  constructor(private readonly getKey: () => string) {}

  async load(): Promise<TutorialProgressEntry[]> {
    return this.readSync();
  }

  readSync(): TutorialProgressEntry[] {
    try {
      const raw = window.localStorage.getItem(this.getKey());
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(isEntry) : [];
    } catch {
      // Almacenamiento no disponible o contenido corrupto: se parte de cero
      // en lugar de romper la interfaz.
      return [];
    }
  }

  async save(entry: TutorialProgressEntry): Promise<void> {
    const entries = this.readSync().filter((item) => item.tutorialId !== entry.tutorialId);
    entries.push(entry);
    this.write(entries);
  }

  async reset(tutorialId: string): Promise<void> {
    this.write(this.readSync().filter((item) => item.tutorialId !== tutorialId));
  }

  async resetAll(): Promise<void> {
    this.write([]);
  }

  /** Sustituye el contenido completo (se usa al espejar lo que devuelve el backend). */
  replaceAll(entries: TutorialProgressEntry[]): void {
    this.write(entries);
  }

  describeSource(): 'local' {
    return 'local';
  }

  private write(entries: TutorialProgressEntry[]): void {
    try {
      window.localStorage.setItem(this.getKey(), JSON.stringify(entries));
    } catch (error) {
      // Cuota llena o navegación privada: el progreso no sobrevive a la sesión,
      // pero la aplicación sigue funcionando.
      console.warn('[tutoriales] no se pudo guardar el progreso localmente.', error);
    }
  }
}
