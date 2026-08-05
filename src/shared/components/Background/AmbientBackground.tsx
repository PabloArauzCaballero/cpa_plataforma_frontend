import { useEffect, useRef } from 'react';

export type AmbientVariant = 'auth' | 'app';

interface AmbientBackgroundProps {
  /** Intensidad y disposición de las luces. `auth` es expresiva, `app` es ambiental. */
  variant?: AmbientVariant;
  /** Luz difusa que sigue al cursor. Se ignora en táctil y con movimiento reducido. */
  reactive?: boolean;
}

interface OrbSpec {
  color: string;
  size: string;
  top: string;
  left: string;
  dx: string;
  dy: string;
  delay: string;
}

/**
 * Las luces se declaran como datos, no como CSS suelto: así una variante se
 * define en un sitio y no hay reglas duplicadas por pantalla.
 */
const ORBS: Record<AmbientVariant, OrbSpec[]> = {
  auth: [
    { color: 'rgba(32, 160, 197, 0.55)', size: '46rem', top: '-14rem', left: '-10rem', dx: '4%', dy: '3%', delay: '0s' },
    { color: 'rgba(14, 62, 116, 0.75)', size: '40rem', top: '38%', left: '58%', dx: '-5%', dy: '-3%', delay: '-6s' },
    { color: 'rgba(32, 160, 197, 0.28)', size: '34rem', top: '62%', left: '-8rem', dx: '6%', dy: '-5%', delay: '-12s' },
  ],
  app: [
    { color: 'rgba(32, 160, 197, 0.20)', size: '38rem', top: '-16rem', left: '62%', dx: '-3%', dy: '2%', delay: '0s' },
    { color: 'rgba(1, 43, 101, 0.12)', size: '32rem', top: '54%', left: '-12rem', dx: '4%', dy: '-3%', delay: '-9s' },
  ],
};

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function hasFinePointer(): boolean {
  return window.matchMedia('(pointer: fine)').matches;
}

/**
 * Capas 4 y 5 del sistema de fondos: luces ambientales y luz reactiva.
 *
 * Se monta dentro de un contenedor con la clase `bgSurface`, siempre como
 * primer hijo, y queda por detrás del contenido sin capturar eventos.
 *
 * Rendimiento: sólo se animan `transform` y `opacity`; el seguimiento del
 * cursor pasa por un `requestAnimationFrame` (como mucho una escritura por
 * frame) y todo el conjunto se pausa cuando la pestaña deja de estar visible.
 */
export function AmbientBackground({ variant = 'app', reactive = false }: AmbientBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  // ── Luz reactiva al cursor ──────────────────────────────────────────────
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !reactive) return;
    // Sin cursor no hay nada que seguir, y con movimiento reducido el usuario
    // ya pidió que las cosas no se muevan solas.
    if (!hasFinePointer() || prefersReducedMotion()) return;

    let frame = 0;
    let pending: { x: number; y: number } | null = null;

    function flush() {
      frame = 0;
      if (!pending || !root) return;
      root.style.setProperty('--mx', `${pending.x}px`);
      root.style.setProperty('--my', `${pending.y}px`);
      pending = null;
    }

    function onPointerMove(event: PointerEvent) {
      const bounds = root!.getBoundingClientRect();
      pending = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      // Un solo write por frame: mover el ratón deprisa no multiplica el trabajo.
      if (!frame) frame = window.requestAnimationFrame(flush);
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reactive]);

  // ── Pausa fuera de foco ─────────────────────────────────────────────────
  // Una animación infinita en una pestaña de fondo sigue consumiendo GPU.
  useEffect(() => {
    function sync() {
      rootRef.current?.setAttribute('data-paused', String(document.hidden));
    }
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  return (
    <div ref={rootRef} className="bgAmbient" aria-hidden="true">
      {ORBS[variant].map((orb, index) => (
        <span
          key={index}
          className="bgOrb"
          style={
            {
              '--orb-color': orb.color,
              '--orb-dx': orb.dx,
              '--orb-dy': orb.dy,
              '--orb-delay': orb.delay,
              width: orb.size,
              height: orb.size,
              top: orb.top,
              left: orb.left,
            } as React.CSSProperties
          }
        />
      ))}
      {reactive ? <span className="bgPointer" /> : null}
    </div>
  );
}
