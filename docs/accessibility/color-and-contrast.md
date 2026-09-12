# Color y contraste

## Método y su limitación

Los ratios siguientes son **cálculos analíticos** sobre los valores de `theme.css`. **No se midieron sobre el render real**, porque el proyecto no incluye ninguna herramienta de contraste. Los casos marcados como dudosos requieren confirmación.

## Combinaciones principales

| Texto | Fondo | Ratio aprox. | AA texto normal (4,5:1) | AA texto grande (3:1) |
| --- | --- | ---: | --- | --- |
| `#FFFFFF` (text-primary) | `#012B65` (background) | ~13,9:1 | ✅ | ✅ |
| `#DEDFE1` (text-secondary) | `#012B65` | ~11,2:1 | ✅ | ✅ |
| `#9AA9BB` (text-muted) | `#012B65` | ~5,5:1 | ✅ | ✅ |
| `#9AA9BB` (text-muted) | `#0E3E74` (surface) | **~4,3:1** | ⚠️ **Por debajo** | ✅ |
| `#20A0C5` (link/secondary) | `#012B65` | ~5,1:1 | ✅ | ✅ |
| `#FFFFFF` | `#20A0C5` (botón primario) | ~2,6:1 | ⚠️ **Por debajo** | ⚠️ Justo por debajo |

### Los dos casos a confirmar

**1. Texto atenuado sobre superficie elevada.** `--color-text-muted` sobre `--color-surface` queda cerca del umbral. Aparece en descripciones cortas de módulo y textos secundarios dentro de tarjetas.

**2. Texto blanco sobre el cian del botón primario.** `--color-button-primary` (`#20A0C5`) con texto blanco da un ratio bajo. Es el caso más extendido de la interfaz: afecta al botón principal de cada pantalla.

> ⚠️ **Ambos requieren medición real antes de actuar.** Si se confirman, la corrección mínima es oscurecer el cian del botón hacia `--color-secondary-dark` (`#1A7BA6`, ratio ~3,6:1) o usar texto oscuro sobre el cian.
>
> Es un **cambio visual del producto**: requiere autorización, revisión de diseño y comprobación de que no rompe la identidad de marca.

## Información transmitida solo por color

### Fallo confirmado: bloque horario

`ResourceListPage` asigna `data-hour-tone` (0–7) a cada fila para `clase-por-hora`, `clase-curso` y `aula`, y `DataTable` lo emite como atributo que el CSS traduce en color de fondo.

La leyenda de la propia pantalla lo confirma:

> «Orden visual por hora — Cada color representa un bloque horario distinto para leer mejor aulas y clases.»

**No hay alternativa textual.** Incumple WCAG 1.4.1 (nivel A).

Corrección propuesta: mostrar la hora como columna, o añadir un indicador textual del bloque. La fila ya contiene la hora en los datos, así que el coste es bajo.

### Bien resuelto: estado de registro

`DataTable` colorea el badge de estado **y muestra el texto**:

```ts
function renderStatusLabel(value: unknown): string {
  if (value === true) return 'Activo';
  if (value === false) return 'Inactivo';
  …
}
```

Un booleano se lee «Activo»/«Inactivo», no «Sí»/«No». El color acompaña, no sustituye.

### Bien resuelto: resultado de operación

El modal de resultado usa `data-status` para el color **y** un icono distinto (`fa-circle-check` frente a `fa-triangle-exclamation`) **y** un texto explícito.

## Enlaces sin distinción no cromática

```css
/* global.css */
a { color: inherit; text-decoration: none; }
```

La regla es global: elimina el subrayado y hereda el color. Cada enlace debe recuperar por su cuenta una indicación visual; donde no lo haga, **no se distingue del texto que lo rodea salvo por color** — y aquí ni siquiera por color, porque hereda.

Incumple WCAG 1.4.1 en los casos donde no se compense.

## Modo oscuro y preferencias

| Preferencia | Usos | Comportamiento |
| --- | --- | --- |
| `prefers-color-scheme: dark` | 1 | **La aplicación es oscura siempre.** No hay tema claro conmutable |
| `prefers-reduced-motion: reduce` | 6 | ✅ Respetado en `global.css`, `AppShell`, y tres archivos de tutoriales |
| `pointer: coarse` | 2 | Ajustes para pantallas táctiles |

Que el tema sea oscuro por defecto **no es un problema de accesibilidad en sí**: los ratios sobre el fondo principal son amplios. El riesgo está en las superficies elevadas y en el botón primario.

## Zoom y reflujo

No auditado por ejecución. Indicios positivos en el código:

- Tipografía fluida con `clamp()` en cuatro niveles.
- `text-size-adjust: 100%` evita el reescalado automático de iOS.
- `img { max-width: 100% }`.
- Nueve puntos de ruptura, con adaptaciones específicas hasta 560 px.

Pendiente de verificar con zoom al 200 % y 400 % (WCAG 1.4.4 y 1.4.10).

## Cómo medir cuando existan herramientas

```bash
# No funcionan hoy: las herramientas no están instaladas.
npx @axe-core/cli http://localhost:5173/modulos/personas/estudiante
npx lighthouse http://localhost:5173 --only-categories=accessibility
```

Alternativa inmediata sin instalar nada: el panel de contraste de DevTools del navegador, sobre el render real.
