import styles from './PageState.module.css';

export type StateArtName = 'loading' | 'empty' | 'error' | 'notFound' | 'blocked';

/**
 * Ilustraciones de estado.
 *
 * Van en SVG en línea y no como imágenes: pesan unos cientos de bytes, no
 * añaden peticiones de red, heredan el color semántico del contenedor con
 * `currentColor` y se ven nítidas en cualquier densidad de pantalla.
 *
 * Comparten un mismo lenguaje gráfico —trazo de 2, esquinas redondeadas,
 * lienzo de 120×120 y un halo de fondo— para que las cinco se lean como una
 * familia y no como iconos sueltos de bancos distintos.
 */

const SHARED = {
  viewBox: '0 0 120 120',
  fill: 'none',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Halo() {
  return <circle cx="60" cy="60" r="46" fill="currentColor" opacity="0.08" />;
}

export function StateArt({ name }: { name: StateArtName }) {
  if (name === 'loading') {
    return (
      <svg {...SHARED} xmlns="http://www.w3.org/2000/svg" role="presentation">
        <Halo />
        {/* Hoja con líneas de contenido que laten en secuencia: comunica
            "esto se está construyendo" sin recurrir a un giro.

            El latido se hace con animación CSS y no con `<animate>` de SMIL,
            porque SMIL no responde a `prefers-reduced-motion` ni se puede
            pausar desde la hoja de estilos. */}
        <rect x="34" y="30" width="52" height="62" rx="7" stroke="currentColor" opacity="0.55" />
        <g stroke="currentColor" strokeWidth="4">
          <line className={styles.pulse} x1="44" y1="46" x2="70" y2="46" />
          <line className={styles.pulse} style={{ animationDelay: '200ms' }} x1="44" y1="58" x2="76" y2="58" />
          <line className={styles.pulse} style={{ animationDelay: '400ms' }} x1="44" y1="70" x2="62" y2="70" />
        </g>
      </svg>
    );
  }

  if (name === 'empty') {
    return (
      <svg {...SHARED} xmlns="http://www.w3.org/2000/svg" role="presentation">
        <Halo />
        {/* Bandeja abierta y vacía. El trazo discontinuo dice "aquí falta
            contenido" mejor que un icono de prohibición. */}
        <path d="M30 62 L40 38 H80 L90 62" stroke="currentColor" opacity="0.5" strokeDasharray="5 5" />
        <path d="M30 62 H48 l4 8 h16 l4-8 h18 v20 a6 6 0 0 1-6 6 H36 a6 6 0 0 1-6-6 z" stroke="currentColor" />
        <circle cx="60" cy="30" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="44" cy="26" r="2" fill="currentColor" opacity="0.3" />
        <circle cx="76" cy="26" r="2" fill="currentColor" opacity="0.3" />
      </svg>
    );
  }

  if (name === 'error') {
    return (
      <svg {...SHARED} xmlns="http://www.w3.org/2000/svg" role="presentation">
        <Halo />
        {/* Conexión interrumpida: describe el fallo real (no se pudo hablar
            con el servicio) mejor que un aspa genérica. */}
        <rect x="26" y="50" width="26" height="20" rx="6" stroke="currentColor" />
        <rect x="68" y="50" width="26" height="20" rx="6" stroke="currentColor" />
        <path d="M52 60 h5" stroke="currentColor" />
        <path d="M63 60 h5" stroke="currentColor" />
        <path d="M64 44 l-8 12 8 4 -8 12" stroke="currentColor" opacity="0.55" />
      </svg>
    );
  }

  if (name === 'notFound') {
    return (
      <svg {...SHARED} xmlns="http://www.w3.org/2000/svg" role="presentation">
        <Halo />
        {/* Lupa sobre una hoja: se buscó algo y no estaba. */}
        <rect x="34" y="28" width="44" height="56" rx="7" stroke="currentColor" opacity="0.45" />
        <line x1="44" y1="44" x2="66" y2="44" stroke="currentColor" opacity="0.35" strokeWidth="4" />
        <line x1="44" y1="54" x2="60" y2="54" stroke="currentColor" opacity="0.35" strokeWidth="4" />
        <circle cx="68" cy="68" r="16" stroke="currentColor" fill="var(--state-art-bg, transparent)" />
        <line x1="80" y1="80" x2="92" y2="92" stroke="currentColor" strokeWidth="4" />
      </svg>
    );
  }

  return (
    <svg {...SHARED} xmlns="http://www.w3.org/2000/svg" role="presentation">
      <Halo />
      {/* Escudo con candado: restricción de acceso, no error del sistema. */}
      <path d="M60 26 l24 9 v20 c0 17-10 28-24 34 -14-6-24-17-24-34 V35 z" stroke="currentColor" />
      <rect x="50" y="58" width="20" height="16" rx="4" stroke="currentColor" />
      <path d="M54 58 v-5 a6 6 0 0 1 12 0 v5" stroke="currentColor" opacity="0.6" />
    </svg>
  );
}
