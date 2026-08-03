import type { TutorialProgressEntry } from '../domain/TutorialProgress';
import type { LocalTutorialProgressStorage, TutorialProgressStorage } from './LocalTutorialProgressStorage';
import type { TutorialAnalyticsAdapter } from './tutorialAnalytics';

export interface ResilientStorageOptions {
  /** Fuente de verdad remota. Se inyecta: este módulo no conoce el cliente HTTP. */
  backend: TutorialProgressStorage;
  /** Espejo y respaldo en el dispositivo. */
  local: LocalTutorialProgressStorage;
  analytics?: TutorialAnalyticsAdapter;
  /** Clasifica el error para explicar por qué se degradó (servicio ausente vs. fallo). */
  isUnsupported?(error: unknown): boolean;
  /** Permite arrancar ya en modo local (por ejemplo, sin sesión iniciada). */
  backendEnabled?: boolean;
}

/**
 * Estrategia de persistencia efectiva.
 *
 * El backend es la fuente de verdad cuando existe — así el usuario continúa un tutorial
 * desde otro dispositivo — y el almacenamiento local actúa como espejo y respaldo:
 *
 *  · `load`  : intenta el backend; si responde, espeja en local y devuelve eso.
 *              Si falla, devuelve lo local y marca el backend como no disponible.
 *  · `save`  : escribe SIEMPRE en local (respuesta inmediata, tolerante a desconexión)
 *              y después sincroniza. Un fallo de red no pierde el avance del usuario.
 *
 * Una vez que el backend falla, se descarta para el resto de la sesión: ni un servicio
 * que aún no existe ni una caída puntual deben castigar la interfaz con reintentos en
 * cada interacción.
 */
export class ResilientTutorialProgressStorage implements TutorialProgressStorage {
  private readonly backend: TutorialProgressStorage;
  private readonly local: LocalTutorialProgressStorage;
  private readonly analytics?: TutorialAnalyticsAdapter;
  private readonly isUnsupported: (error: unknown) => boolean;
  private backendAvailable: boolean;

  constructor(options: ResilientStorageOptions) {
    this.backend = options.backend;
    this.local = options.local;
    this.analytics = options.analytics;
    this.isUnsupported = options.isUnsupported ?? (() => true);
    this.backendAvailable = options.backendEnabled ?? true;
  }

  describeSource(): 'backend' | 'local' {
    return this.backendAvailable ? 'backend' : 'local';
  }

  async load(): Promise<TutorialProgressEntry[]> {
    if (!this.backendAvailable) return this.local.load();

    try {
      const remote = await this.backend.load();
      this.local.replaceAll(remote);
      return remote;
    } catch (error) {
      this.disableBackend(error, 'load');
      return this.local.load();
    }
  }

  async save(entry: TutorialProgressEntry): Promise<void> {
    await this.local.save(entry);
    if (!this.backendAvailable) return;

    try {
      await this.backend.save(entry);
    } catch (error) {
      this.disableBackend(error, `save:${entry.tutorialId}`);
    }
  }

  async reset(tutorialId: string): Promise<void> {
    await this.local.reset(tutorialId);
    if (!this.backendAvailable) return;

    try {
      await this.backend.reset(tutorialId);
    } catch (error) {
      this.disableBackend(error, `reset:${tutorialId}`);
    }
  }

  async resetAll(): Promise<void> {
    await this.local.resetAll();
    if (!this.backendAvailable) return;

    try {
      await this.backend.resetAll();
    } catch (error) {
      this.disableBackend(error, 'resetAll');
    }
  }

  private disableBackend(error: unknown, operation: string): void {
    const unsupported = this.isUnsupported(error);
    this.backendAvailable = false;
    this.analytics?.track({
      type: 'progress-sync-failed',
      tutorialId: operation,
      version: '-',
      detail: unsupported
        ? 'el backend no expone el servicio de progreso; se usa almacenamiento local'
        : `error al sincronizar (${error instanceof Error ? error.message : 'desconocido'}); se usa almacenamiento local`,
    });
  }
}
