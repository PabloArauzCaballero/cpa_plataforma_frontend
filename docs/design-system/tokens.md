# Sistema de diseño · Tokens

> Fuente única: `src/shared/styles/theme.css` (63 líneas, 45 tokens) importado por `src/shared/styles/global.css`, a su vez importado por `src/main.tsx`.
>
> ⚠️ **Nota de concurrencia:** los valores de esta página corresponden al commit `618e5c3`. Durante la redacción, otro agente estaba modificando `theme.css` y `global.css` (rediseño visual en curso). Verifica los valores actuales antes de apoyarte en un hex concreto.

## Modelo

**Variables CSS nativas en `:root` + CSS Modules.** Sin Tailwind, sin Sass, sin CSS-in-JS, sin tokens en JavaScript.

Consecuencia: los tokens **no son accesibles desde TypeScript**. Un componente que necesite un color en JS —por ejemplo para un gráfico— tendría que repetirlo. No ocurre hoy porque no hay gráficos.

## Color

### Paleta de marca

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-primary` | `#012B65` | Azul CPA principal; también fondo de página |
| `--color-primary-dark` | `#00255F` | Variante oscura; `theme-color` del navegador |
| `--color-primary-soft` | `#0E3E74` | Superficies elevadas |
| `--color-secondary` | `#20A0C5` | Cian de acento; botones y enlaces |
| `--color-secondary-dark` | `#1A7BA6` | Hover de botón |
| `--color-accent` | `#195687` | Bordes |
| `--color-neutral-light` | `#DEDFE1` | Texto secundario |
| `--color-neutral-muted` | `#9AA9BB` | Texto atenuado |
| `--color-white` | `#FFFFFF` | — |

### Tokens semánticos

| Token | Valor | Apunta a |
| --- | --- | --- |
| `--color-background` | `#012B65` | primary |
| `--color-surface` | `#0E3E74` | primary-soft |
| `--color-surface-soft` | `#F5F8FA` | superficie clara (único valor claro) |
| `--color-text-primary` | `#FFFFFF` | — |
| `--color-text-secondary` | `#DEDFE1` | neutral-light |
| `--color-text-muted` | `#9AA9BB` | neutral-muted |
| `--color-button-primary` | `#20A0C5` | secondary |
| `--color-button-primary-hover` | `#1A7BA6` | secondary-dark |
| `--color-border` | `#195687` | accent |
| `--color-link` | `#20A0C5` | secondary |

**El tema es oscuro por defecto**: fondo azul profundo, texto blanco.

### Lo que falta en la paleta

| Concepto | Estado |
| --- | --- |
| Éxito / advertencia / error / información | ❌ **No hay tokens semánticos de estado.** Cada componente define sus colores. `DataTable` colorea el badge con `data-active`; `ConfirmDialog` con `data-variant="danger"`; `ResourceListPage` con `data-status`. Cuatro implementaciones sin token común |
| Escala de grises | ❌ Solo tres neutros |
| Superficies por nivel de elevación | Parcial: `surface` y `surface-soft` |

Es la carencia más significativa del sistema de diseño. Registrada como MEDIUM en [reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md).

### Contraste

| Combinación | Ratio aprox. | WCAG AA (4,5:1) |
| --- | ---: | --- |
| `#FFFFFF` sobre `#012B65` | ~13,9:1 | ✅ Amplio margen |
| `#DEDFE1` sobre `#012B65` | ~11,2:1 | ✅ |
| `#9AA9BB` sobre `#012B65` | ~5,5:1 | ✅ Texto normal |
| `#9AA9BB` sobre `#0E3E74` | ~4,3:1 | ⚠️ **Por debajo de 4,5:1** para texto normal |
| `#20A0C5` sobre `#012B65` | ~5,1:1 | ✅ |

Cálculos analíticos, **no verificados con herramienta automatizada** (no hay ninguna en el proyecto). El caso de `text-muted` sobre `surface` requiere comprobación. Ver [accessibility/color-and-contrast.md](../accessibility/color-and-contrast.md).

### Gradientes

| Token | Valor |
| --- | --- |
| `--gradient-hero` | `linear-gradient(135deg, #00255F 0%, #012B65 45%, #20A0C5 100%)` |
| `--gradient-card-dark` | `linear-gradient(180deg, #0E3E74 0%, #012B65 100%)` |
| `--gradient-accent-glow` | `radial-gradient(circle, rgba(32,160,197,0.35) 0%, rgba(1,43,101,0) 70%)` |

## Tipografía

| Token | Valor |
| --- | --- |
| `--font-family-base` | `Inter, system-ui, sans-serif` |
| `--font-heading-weight` | `700` |
| `--font-body-weight` | `400` |
| `--letter-spacing-brand` | `0.04em` |

> **No se descarga ninguna fuente web.** No hay `@font-face` ni enlace a Google Fonts. Si Inter no está instalada en el sistema, se usa `system-ui`.
>
> Es una decisión eficiente: **cero peticiones de fuente, cero FOIT/FOUT, cero CLS por fuente**. El coste es que el aspecto varía entre sistemas. Ver [performance/images-and-fonts.md](../performance/images-and-fonts.md).

### Escala de tamaños

| Token | Valor |
| --- | --- |
| `--font-display` | `clamp(1.6rem, 2.6vw, 2.2rem)` |
| `--font-title` | `clamp(1.35rem, 2.1vw, 1.75rem)` |
| `--font-heading` | `clamp(1.15rem, 1.7vw, 1.4rem)` |
| `--font-subheading` | `1.05rem` |

Cuatro niveles con `clamp()`, es decir **tipografía fluida sin media queries**. El comentario del propio archivo declara la intención: *«Restrained, consistent heading scale — reads as an admin tool, not a landing page»*.

**No hay tokens para texto de cuerpo, pequeño ni de leyenda**: se usan valores literales en cada módulo CSS.

## Espaciado

| Token | Valor | rem |
| --- | --- | --- |
| `--space-1` | `0.25rem` | 4 px |
| `--space-2` | `0.5rem` | 8 px |
| `--space-3` | `0.75rem` | 12 px |
| `--space-4` | `1rem` | 16 px |
| `--space-5` | `1.25rem` | 20 px |
| `--space-6` | `1.5rem` | 24 px |
| `--space-8` | `2rem` | 32 px |
| `--space-10` | `2.5rem` | 40 px |

Escala de base 4, con saltos en 7 y 9. Coherente.

## Radios

| Token | Valor |
| --- | --- |
| `--radius-sm` | `8px` |
| `--radius-md` | `12px` |
| `--radius-lg` | `18px` |
| `--radius-pill` | `999px` |

## Sombras

| Token | Valor |
| --- | --- |
| `--shadow-xs` | `0 1px 2px rgba(0,37,95,.06)` |
| `--shadow-sm` | `0 2px 8px rgba(0,37,95,.07)` |
| `--shadow-soft` | `0 10px 28px rgba(0,37,95,.10)` |
| `--shadow-md` | `0 14px 34px rgba(0,37,95,.12)` |
| `--shadow-strong` | `0 20px 48px rgba(0,37,95,.20)` |

Escala de cinco niveles, todas tintadas con el azul de marca en lugar de negro puro. El comentario declara: *«subtle by default for a calm, professional surface»*.

## Interacción

| Token | Valor | Uso |
| --- | --- | --- |
| `--ring-focus` | `0 0 0 3px color-mix(in srgb, var(--color-secondary) 32%, transparent)` | Anillo de foco |
| `--transition-base` | `160ms cubic-bezier(0.4, 0, 0.2, 1)` | Transición estándar |
| `--sidebar-width` | `18.5rem` | Ancho de la barra lateral |

`color-mix()` requiere Chrome 111+, Safari 16.2+ o Firefox 113+. En navegadores anteriores **el anillo de foco no se dibuja**, lo que degrada la accesibilidad por teclado. No hay fallback. Ver [getting-started/prerequisites.md](../getting-started/prerequisites.md#navegadores-soportados).

## Puntos de ruptura

**No hay tokens de breakpoint.** Los valores están escritos a mano en cada archivo CSS. Recuento real de `@media (max-width: …)` en `src/`:

| Valor | Apariciones |
| --- | ---: |
| 900 px | 5 |
| 720 px | 5 |
| 780 px | 4 |
| 760 px | 4 |
| 560 px | 4 |
| 640 px | 3 |
| 980 px | 2 |
| 960 px | 2 |
| 1040 px | 2 |

**Nueve puntos de ruptura distintos**, algunos separados por 20 px (760/780, 960/980). Es fragmentación real, no intencionada. Ver [design-system/responsive-design.md](responsive-design.md).

## Preferencias del usuario

| Consulta | Apariciones (en `618e5c3`) | Dónde |
| --- | ---: | --- |
| `prefers-reduced-motion: reduce` | 6 | `global.css` (×2), `AppShell.module.css`, `TutorialCenterPage.module.css`, `TutorialCard.module.css`, `tutorialOverlay.css` |
| `prefers-color-scheme: dark` | 1 | — |
| `pointer: coarse` | 2 | Ajustes táctiles |

`prefers-reduced-motion` **sí se respeta**, lo cual es un punto fuerte. No cubre, sin embargo, las animaciones internas de `driver.js`.

`prefers-color-scheme` aparece una sola vez: **no hay tema claro/oscuro conmutable**. La aplicación es oscura siempre. Ver [design-system/themes.md](themes.md).

## Estilos globales

`global.css` establece:

| Regla | Efecto |
| --- | --- |
| `* { box-sizing: border-box }` | Modelo de caja predecible |
| `text-size-adjust: 100%` | Evita el reescalado automático de iOS |
| `h1,h2,h3 { text-wrap: balance }` | Los títulos reparten mejor las líneas |
| `::selection` con `color-mix` | Selección tintada de marca |
| `button, input, select, textarea { font: inherit }` | Los controles heredan la tipografía |
| `-webkit-tap-highlight-color: transparent` | Sin destello azul al tocar en móvil |
| `a { color: inherit; text-decoration: none }` | ⚠️ **Los enlaces no se distinguen del texto por defecto** |
| `img { max-width: 100% }` | Imágenes responsivas |
| `font-smoothing` y `text-rendering` | Ajustes de nitidez |

> **Hallazgo de accesibilidad:** `a { text-decoration: none }` global elimina la única distinción no cromática de los enlaces. Cada enlace debe recuperar su indicación visual por su cuenta. Ver [accessibility/color-and-contrast.md](../accessibility/color-and-contrast.md).

## Cobertura de los tokens

**No todos los estilos usan tokens.** Hay 7 007 líneas de CSS en 30 archivos `.module.css` con muchos valores literales (colores `rgba(...)`, tamaños en `px`, espaciados sueltos).

No existe herramienta que verifique el uso de tokens frente a valores literales. Propuesta registrada en [reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md).

## Cómo añadir o cambiar un token

1. Edítalo en `src/shared/styles/theme.css` — **fuente única**.
2. Comprueba el contraste si es de color.
3. Busca valores literales equivalentes: `grep -rn "#20A0C5" src --include="*.css"`.
4. Ejecuta `yarn build` y compara el tamaño del CSS con [performance/budgets.md](../performance/budgets.md).
5. Revisa visualmente las pantallas afectadas: **no hay regresión visual automatizada**.
