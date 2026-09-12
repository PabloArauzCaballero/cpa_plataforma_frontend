# Diseño adaptable

## Estrategia

**Escritorio primero**, con adaptaciones hacia abajo: todas las consultas son `@media (max-width: …)`. No hay ninguna `min-width`.

Es coherente con el producto: es un panel administrativo que se usa mayoritariamente en escritorio, pero que necesita funcionar en móvil — el historial del proyecto registra correcciones específicas para ello (`v14`, `f91a861 «arregla el envio en celular»`).

## El problema: nueve puntos de ruptura

Recuento real sobre `src/**/*.css`:

| Punto de ruptura | Apariciones |
| --- | ---: |
| 900 px | 5 |
| 720 px | 5 |
| 780 px | 4 |
| 760 px | 4 |
| 560 px | 4 |
| 640 px | 3 |
| 1040 px | 2 |
| 980 px | 2 |
| 960 px | 2 |

**Nueve valores distintos, con pares separados por solo 20 px** (760/780, 960/980). No hay tokens de breakpoint en `theme.css`: cada archivo escribe el suyo.

Consecuencia: al redimensionar la ventana, distintas partes de la interfaz se reorganizan en momentos ligeramente distintos.

### Propuesta

Definir tres o cuatro tokens y unificar:

```css
/* Propuesta, no aplicada */
--bp-lg: 1040px;   /* barra lateral colapsable */
--bp-md: 900px;    /* tablet */
--bp-sm: 720px;    /* móvil grande */
--bp-xs: 560px;    /* móvil */
```

**Limitación técnica:** las variables CSS **no funcionan dentro de `@media`**. Habría que usar `@custom-media` (requiere PostCSS, dependencia nueva) o simplemente **normalizar los valores literales a cuatro**, sin herramienta. La segunda opción no añade dependencias y resuelve el 90 % del problema.

Es un **cambio de producto** (altera puntos de reorganización visual) y requiere revisión de diseño.

## Lo que sí está bien resuelto

### Tipografía fluida sin media queries

```css
--font-display:  clamp(1.6rem, 2.6vw, 2.2rem);
--font-title:    clamp(1.35rem, 2.1vw, 1.75rem);
--font-heading:  clamp(1.15rem, 1.7vw, 1.4rem);
```

Escala continua entre el mínimo y el máximo, sin saltos. Es la técnica correcta.

### Barra lateral adaptable

`AppShell` gestiona un cajón lateral con:

| Comportamiento | Implementación |
| --- | --- |
| Ancho fijo en escritorio | `--sidebar-width: 18.5rem` |
| Cajón superpuesto en pantallas pequeñas | `data-open={navOpen}` |
| Cierre al cambiar de ruta | `useEffect` sobre `location.pathname` |
| Bloqueo del scroll de fondo | `document.body.style.overflow = 'hidden'`, restaurando el valor previo |
| Superposición accionable | Un `<button>` real con `aria-label` |

Es una implementación cuidada y accesible.

### Ajustes táctiles

Dos usos de `@media (pointer: coarse)` para adaptar el objetivo táctil.

Además, `InfoHint` se puede **fijar con clic**, no solo mostrar con hover — la solución correcta para pantallas táctiles, donde el hover no existe.

### Selector buscable en móvil

El umbral de 12 opciones que activa `SearchableSelect` está justificado precisamente por el caso móvil, según el comentario del código:

> «en móvil es una rueda interminable»

### Otras reglas de base

| Regla | Efecto |
| --- | --- |
| `img { max-width: 100% }` | Imágenes contenidas |
| `text-size-adjust: 100%` | Evita el reescalado automático de iOS |
| `-webkit-tap-highlight-color: transparent` | Sin destello azul al tocar |
| `<meta name="viewport" content="width=device-width, initial-scale=1.0">` | Correcto |

## Puntos débiles en pantallas pequeñas

| Elemento | Problema |
| --- | --- |
| `DataTable` | Hasta **14 columnas** en una tabla. En móvil se requiere desplazamiento horizontal. **No hay vista de tarjetas alternativa** |
| `Modal` | Ancho por defecto de **1180 px**, pensado para formularios de varias columnas. En móvil depende del CSS del propio modal |
| Paginación | Selector de filas y botones en una fila; puede apretarse |
| Barra de filtros | Con muchos filtros dinámicos (hasta 12 + estado), puede desbordarse |

**No verificado en dispositivo real**: la auditoría fue por lectura de código.

## Zoom y reflujo

WCAG 1.4.10 exige que el contenido se pueda usar con zoom al 400 % sin desplazamiento en dos ejes.

Indicios positivos: tipografía fluida, unidades relativas, `max-width` en imágenes.
Riesgo: la tabla de 14 columnas.

**Pendiente de verificar** con zoom al 200 % y 400 %.

## Verificación manual sugerida

| Ancho | Qué comprobar |
| --- | --- |
| 1440 px | Barra lateral fija, tabla completa |
| 1040 px | Primer punto de reorganización |
| 900 px | Segundo |
| 720 px | Cajón lateral, contenido en una columna |
| 560 px | Modal usable, formulario en una columna, paginación legible |
| 360 px | Caso extremo: ¿es usable la tabla? |

Repetir con `prefers-reduced-motion` activo y con zoom al 200 %.
