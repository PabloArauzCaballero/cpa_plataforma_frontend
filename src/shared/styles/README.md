# Sistema visual

Tres archivos, cargados en este orden desde `global.css`:

| Archivo | Qué contiene |
|---|---|
| `theme.css` | Tokens: color, superficie, borde, texto, motion, estado, fondo |
| `backgrounds.css` | Sistema de fondos por capas y sus variantes por contexto |
| `global.css` | Reset, tipografía base, foco, movimiento reducido |

## Tokens

### Superficies

La regla es elegir el token por **nivel de elevación**, no por color:

- `--surface-canvas` — el lienzo de la aplicación (lo pinta el fondo por capas)
- `--surface-1` — tarjetas, tablas, modales: lo que flota sobre el lienzo
- `--surface-2` — campos de formulario, filas alternas
- `--surface-3` — cabeceras de tabla, pastillas, zonas hundidas
- `--surface-glass` / `--surface-glass-strong` — cabecera y pie translúcidos

### Bordes

`--color-border` (#195687) es **azul oscuro**: sirve sobre fondos oscuros. Como
contorno de una tarjeta blanca se lee como un borde de depuración. Sobre
superficie clara usa:

- `--border-hairline` — separación por defecto de tarjetas y tablas
- `--border-subtle` — controles de formulario y botones
- `--border-strong` — estado hover de un control
- `--border-brand` — el elemento activo o seleccionado

Sobre superficie oscura: `--border-on-dark`, `--border-on-dark-strong`.

### Texto sobre claro

`--text-on-light` → `--text-on-light-secondary` → `--text-on-light-muted`.

`--text-on-light-muted` está calibrado al mínimo que cumple AA (4.5:1) sobre
`--surface-3`. **No lo aclares** sin volver a medir el contraste.

### Motion

`--motion-micro` (140 ms, hover y press) · `--motion-base` (220 ms, entradas) ·
`--motion-view` (380 ms, cambio de vista) · `--motion-ambient` (24 s, fondo).

Combínalos con `--ease-out`, `--ease-in-out` o `--ease-entrance`. No inventes
duraciones sueltas: si una no encaja, es señal de que falta un escalón.

### Estados

Cada estado es una tripleta `--state-<nombre>-fg` / `-bg` / `-border`:
`success`, `warning`, `danger`, `info`, `neutral`, `progress`.

El color nunca es el único portador del significado: acompaña siempre con
icono o texto.

## Sistema de fondos

Se activa con una clase y un atributo:

```html
<div class="bgSurface" data-bg="app">…</div>
```

Capas, de atrás hacia delante: color base → malla de gradientes → rejilla →
ruido → luces ambientales → luz reactiva → contenido.

Las cuatro primeras son CSS puro (`::before` y `::after`). Las dos siguientes
las aporta `<AmbientBackground />`, que se monta como primer hijo:

```tsx
<main className="bgSurface" data-bg="auth">
  <AmbientBackground variant="auth" reactive />
  …
</main>
```

### Variantes

| `data-bg` | Uso | Intensidad |
|---|---|---|
| `auth` | Login y recuperación | Máxima: es la portada del producto |
| `app` | Dashboard y pantallas generales | Ambiental |
| `form` | Formularios largos | Baja, sin rejilla |
| `data` | Tablas y administración | Mínima, sin rejilla ni ruido |

Para ajustar sin tocar las capas, redefine sus variables en tu contenedor:

```css
.miPantalla {
  --bg-decor-opacity: 0.4;
  --bg-grid-line: transparent;
}
```

### Garantías

- **Rendimiento**: sólo se animan `transform` y `opacity`. Sin `filter: blur()`
  a pantalla completa. El seguimiento del cursor está limitado a una escritura
  por frame vía `requestAnimationFrame`.
- **Pestaña en segundo plano**: las luces se pausan con `visibilitychange`.
- **Móvil (≤720 px)**: sin rejilla, sin luces, ruido reducido.
- **Táctil**: sin luz reactiva (no hay cursor que seguir).
- **`prefers-reduced-motion`**: el fondo no desaparece, se congela. Se conserva
  toda la profundidad estática y sólo se detiene el desplazamiento.

## Pendiente

El **modo oscuro** está preparado a nivel de fondo y tokens
(`@media (prefers-color-scheme: dark)` en `theme.css`), pero no es todavía una
experiencia completa: las pantallas de módulos siguen fijando colores claros en
sus propios módulos CSS. Completarlo consiste en sustituir en esos archivos
`--color-white` por `--surface-1` y `--color-primary` (usado como texto) por
`--text-on-light`, y añadir el bloque oscuro correspondiente.
