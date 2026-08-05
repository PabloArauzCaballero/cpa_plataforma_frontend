import { Button } from '@/shared/components/Button';
import { StateArt, type StateArtName } from './StateArt';
import styles from './PageState.module.css';

export type PageStateVariant = 'loading' | 'empty' | 'error' | 'notFound' | 'blocked' | 'info';

interface PageStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Fuerza el tono de la pantalla. Si se omite se deduce del título. */
  variant?: PageStateVariant;
}

/**
 * Reglas para deducir el tono cuando la pantalla no lo declara.
 *
 * Por qué existe esta inferencia: `PageState` se usa en una veintena de sitios
 * que hoy sólo pasan `title` y `message`. Deducirlo hace que todas esas
 * pantallas —cargas, vacíos, errores— pasen a tener ilustración y color
 * semántico sin editar cada llamada. Cualquier pantalla que necesite otro tono
 * lo indica con `variant` y la inferencia deja de aplicarse.
 *
 * El orden importa: gana la primera regla que coincide.
 */
const VARIANT_RULES: Array<{ variant: PageStateVariant; match: RegExp }> = [
  { variant: 'loading', match: /^(cargando|preparando|consultando|procesando|validando)/i },
  { variant: 'blocked', match: /(sin permiso|no tienes permiso|acceso denegado)/i },
  { variant: 'error', match: /(no se pudo|no se pudieron|error|fall[oó])/i },
  { variant: 'notFound', match: /(no encontrad|no existe|no disponible)/i },
  { variant: 'empty', match: /^(sin |no hay)/i },
];

function inferVariant(title: string, message?: string): PageStateVariant {
  const haystack = `${title} ${message ?? ''}`;
  const rule = VARIANT_RULES.find((candidate) => candidate.match.test(title) || candidate.match.test(haystack));
  return rule?.variant ?? 'info';
}

const ART_BY_VARIANT: Record<PageStateVariant, StateArtName> = {
  loading: 'loading',
  empty: 'empty',
  error: 'error',
  notFound: 'notFound',
  blocked: 'blocked',
  info: 'empty',
};

/**
 * Pantalla completa de estado: carga, vacío, error, no encontrado y bloqueo.
 *
 * Es además el `fallback` de Suspense de todas las rutas, así que es lo que se
 * ve en cada navegación mientras llega el chunk de la página. Por eso lleva
 * ilustración y ritmo propios en vez de ser una caja vacía.
 */
export function PageState({ title, message, actionLabel, onAction, variant }: PageStateProps) {
  const tone = variant ?? inferVariant(title, message);
  const isLoading = tone === 'loading';

  return (
    <div
      className={styles.state}
      data-tone={tone}
      /* Durante la carga el bloque se anuncia como región ocupada para que el
         lector de pantalla no lea contenido a medio construir. */
      role={isLoading ? 'status' : undefined}
      aria-busy={isLoading || undefined}
      aria-live={isLoading ? 'polite' : undefined}
    >
      <div className={styles.art} aria-hidden="true">
        <StateArt name={ART_BY_VARIANT[tone]} />
      </div>

      <div className={styles.copy}>
        <h2>{title}</h2>
        {message ? <p>{message}</p> : null}
      </div>

      {actionLabel && onAction ? (
        <Button onClick={onAction} className={styles.action}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
