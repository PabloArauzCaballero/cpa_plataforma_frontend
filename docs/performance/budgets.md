# Presupuestos de rendimiento

## Base de los presupuestos

Los valores se derivan de la **medición real** del build del commit `618e5c3` (ver [../reports/baseline.md](../reports/baseline.md) §4), no de cifras genéricas de la industria. El principio es: *el presupuesto congela lo que hay hoy e impide empeorar*, salvo donde la línea base ya está mal, donde fija además un objetivo.

> **Método de medición del gzip.** `scripts/check-bundle-budget.mjs` usa `zlib.gzipSync` de Node y mide **148 693 B** para el chunk inicial; el comando `gzip -c` da **148 469 B**. La diferencia (0,15 %) viene del nivel de compresión por defecto de cada implementación. **La cifra del script es la canónica** para el presupuesto, porque es la que se ejecuta de forma reproducible.

## Presupuestos de artefacto

| Métrica | Línea base (`618e5c3`) | Presupuesto (fallo del build) | Objetivo | Justificación |
| --- | ---: | ---: | ---: | --- |
| JS inicial (gzip) | **148 469 B** | ≤ 155 000 B | ≤ 100 000 B | Ya está alto para una SPA administrativa; el objetivo es alcanzable retirando tutoriales del arranque |
| JS inicial (sin comprimir) | 478 676 B | ≤ 500 000 B | ≤ 320 000 B | — |
| CSS inicial (gzip) | 5 670 B | ≤ 7 000 B | ≤ 5 670 B | Cómodo |
| JS total (todos los chunks) | 865 255 B | ≤ 920 000 B | — | Margen para crecimiento |
| CSS total | 123 638 B | ≤ 135 000 B | — | — |
| Chunk de ruta más pesado (gzip) | 33 430 B (`ResourceListPage`) | ≤ 40 000 B | — | — |
| `resourceDefinitions` (gzip) | 30 920 B | ≤ 35 000 B | — | Crece con cada recurso nuevo |
| Número de chunks JS | 17 | ≤ 20 | — | Evita fragmentación excesiva |
| Tiempo de build (Vite) | 186 ms | ≤ 3 000 ms | — | Amplio margen |
| Tiempo de `yarn quality` | ~11 s | ≤ 60 s | — | — |

Verificación automatizada: `node scripts/check-bundle-budget.mjs`. Es **no destructivo**: mide y devuelve código de salida.

## Core Web Vitals

> ⚠️ **No hay medición.** El proyecto no instrumenta `web-vitals`, no tiene Lighthouse en CI y no recoge datos de campo. Los valores siguientes son **objetivos declarados, no mediciones**, y no deben presentarse como estado actual.

| Métrica | Umbral «bueno» | Objetivo del proyecto | Medición actual |
| --- | --- | --- | --- |
| LCP | ≤ 2,5 s | ≤ 2,5 s en red 4G | ❓ Sin medir |
| INP | ≤ 200 ms | ≤ 200 ms | ❓ Sin medir |
| CLS | ≤ 0,1 | ≤ 0,05 | ❓ Sin medir |
| TTFB | ≤ 800 ms | Depende de Cloudflare | ❓ Sin medir |

### Predicciones razonadas

Basadas en la arquitectura, no en medición:

| Métrica | Predicción | Razonamiento |
| --- | --- | --- |
| **CLS** | Probablemente bueno | **No se descarga ninguna fuente web** (`Inter, system-ui, sans-serif` sin `@font-face`), lo que elimina la causa más común de desplazamiento. Casi no hay imágenes: solo `public/logo.png` |
| **LCP** | Probablemente mediocre | CSR puro: hasta que no se descargan y ejecutan 148 KiB gzip no hay contenido. El `index.html` está vacío |
| **INP** | **Riesgo alto en listados** | El filtrado descarga hasta 50 000 registros y los procesa en el hilo principal (`applyLocalQuery`). Ver [rendering.md](rendering.md) |

## Presupuestos de red

| Métrica | Presupuesto | Estado actual |
| --- | --- | --- |
| Peticiones críticas para la primera pintura | ≤ 5 | ✅ `index.html` + 1 JS + 1 CSS + CSS del CDN = 4 |
| Peticiones por carga de un listado | ≤ 3 | ⚠️ **Violado**: 1 lista + N lookups (uno por campo con `relation`) |
| Peticiones al aplicar un filtro | ≤ 3 | 🔴 **Violado gravemente**: hasta 250 (50 000 / 200) |
| Opciones cargadas por campo de lookup | ≤ 1 000 | 🔴 **Violado**: `listAllLookupOptions(relation, 300, 100000)` permite 100 000 |
| Tamaño de imagen individual | ≤ 200 KB | ⚠️ Sin control: Cloudinary acepta hasta 10 MB |

Los tres presupuestos de red violados no son regresiones nuevas: son **consecuencia del diseño actual**. Se documentan como objetivo de mejora, no como fallo introducido.

## Presupuestos de terceros

| Métrica | Presupuesto | Estado |
| --- | --- | --- |
| Scripts de terceros | 0 | ✅ Cumplido: no hay ningún `<script>` externo |
| Hojas de estilo de terceros | 0 | ❌ **1**: FontAwesome desde cdnjs |
| Fuentes web descargadas | 0 | ✅ Cumplido |
| Dominios externos en la carga inicial | ≤ 1 | ⚠️ 1 (cdnjs) — eliminable, ya que los paquetes npm están instalados |

## Política de cambio de presupuesto

1. Un cambio que supere un presupuesto **no se acepta en silencio**.
2. Si el aumento está justificado, se actualiza la tabla **en el mismo pull request**, con la medición antes/después y el motivo.
3. Los objetivos (columna «Objetivo») no bloquean el build: son la dirección de mejora.
4. Solo el JS inicial y el CSS inicial son bloqueantes. Los demás son informativos hasta que el equipo acuerde lo contrario.

## Cómo medir

```bash
# Build a un directorio temporal, sin tocar dist/ (que está versionado)
npx tsc -b && npx vite build --outDir /tmp/dist-check --emptyOutDir

# Tamaños
find /tmp/dist-check/assets -name "*.js" -o -name "*.css" | xargs ls -l | awk '{print $5, $9}' | sort -rn

# gzip del chunk inicial
gzip -c /tmp/dist-check/assets/index-*.js | wc -c

# Verificación contra el presupuesto
node scripts/check-bundle-budget.mjs
```

## Lo que no se puede medir hoy

| Métrica | Motivo |
| --- | --- |
| Core Web Vitals de campo | Sin telemetría |
| Core Web Vitals de laboratorio | Sin Lighthouse |
| Tiempo hasta interactivo | Ídem |
| Cobertura de código no usado | Sin analizador de bundle |
| Tiempo de respuesta del backend | Sin instrumentación |
| Duración de una carga de listado real | Sin telemetría |

Instrumentar `web-vitals` sería el paso de mayor valor: es una dependencia pequeña y aportaría datos reales en lugar de predicciones. **Es un cambio de producto** (añade dependencia y envío de datos) y requiere autorización y decisión sobre el destino de los datos. Ver [../observability/web-vitals.md](../observability/web-vitals.md).
