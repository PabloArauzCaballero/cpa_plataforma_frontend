# Core Web Vitals

## Estado: sin medición

**No hay datos.** Ni de campo ni de laboratorio.

| Fuente de datos | Estado |
| --- | --- |
| Librería `web-vitals` | ❌ No instalada |
| Lighthouse en CI | ❌ No hay CI |
| Datos de campo (RUM) | ❌ Sin telemetría |
| `PerformanceObserver` propio | ❌ Sin uso |
| Chrome UX Report | ❌ No aplicable: es una aplicación interna tras autenticación, sin tráfico público suficiente |

> **Consecuencia que hay que asumir:** cualquier afirmación sobre el rendimiento percibido de esta aplicación es una **predicción razonada**, no una medición. Este documento las etiqueta como tales.

## Predicciones razonadas

Basadas en la arquitectura verificada, no en datos.

### LCP — probablemente mediocre

| Factor | Efecto |
| --- | --- |
| CSR puro: `index.html` entrega un `<div id="root">` vacío | ➖ Nada visible hasta ejecutar el JS |
| Chunk inicial de **148 KiB gzip** | ➖ |
| Sin fuentes web | ➕ No hay bloqueo por fuente |
| CSS del CDN de FontAwesome bloqueante | ➖ Una petición externa en el camino crítico |
| Assets con caché inmutable | ➕ En visitas repetidas |

**Predicción:** aceptable en visitas repetidas, mediocre en la primera carga.

### CLS — probablemente bueno

| Factor | Efecto |
| --- | --- |
| **Cero fuentes web** | ➕ Elimina la causa más común de CLS |
| Casi sin imágenes en la interfaz | ➕ |
| Tipografía fluida con `clamp()` | ➕ Sin saltos por media queries |
| Estados de carga que ocupan espacio (`PageState`) | ➕ |
| Rejilla de archivos con imágenes sin `width`/`height` | ➖ Riesgo localizado en `/contabilidad/archivos` |

**Predicción:** bueno en general; riesgo puntual en la biblioteca de archivos.

### INP — riesgo alto en listados

| Factor | Efecto |
| --- | --- |
| Filtrar descarga hasta **50 000 registros** y los procesa en el hilo principal | 🔴 Riesgo alto |
| Lookups de hasta **100 000 opciones** por campo, en paralelo | 🔴 Riesgo alto |
| Debounces de 900/800 ms | ➕ Amortiguan la frecuencia, no el coste |
| Sin virtualización, pero máximo 100 filas | ➕ Aceptable |
| Sin `React.memo` | ➖ Poco relevante con árboles pequeños |

**Predicción:** bueno en pantallas estáticas; **malo al filtrar sobre tablas grandes**. Ver [../performance/rendering.md](../performance/rendering.md).

## Qué haría falta para medir

### Opción A — Instrumentar `web-vitals`

```
1. Añadir la dependencia `web-vitals` (~2 KB)
2. Registrar onLCP, onINP, onCLS, onTTFB en main.tsx
3. Enviar los valores a un destino
```

**Las tres decisiones previas, antes de escribir código:**

| Decisión | Consideración específica de este proyecto |
| --- | --- |
| ¿A dónde se envían? | Un servicio externo cruzaría la frontera de confianza. Hoy **ningún dato sale del frontend** hacia terceros — ver [../security/privacy.md](../security/privacy.md) |
| ¿Qué contexto se adjunta? | La ruta es útil. **El identificador de usuario es dato personal**: no debe enviarse |
| ¿Cómo se distingue el entorno? | El frontend **no sabe en qué entorno se ejecuta**: no hay `VITE_APP_ENV` |

**Recomendación:** enviarlos a un endpoint del propio backend, con ruta y métrica, sin identificar al usuario.

### Opción B — Lighthouse en el pipeline

Requiere CI, que no existe. Daría datos de laboratorio, no de campo, pero permitiría detectar regresiones.

### Opción C — Medición manual puntual

Disponible **hoy, sin instalar nada**: DevTools del navegador → Lighthouse, sobre las rutas clave, autenticado.

Es lo que se recomienda hacer primero: convertir las predicciones de este documento en mediciones antes de invertir en instrumentación.

## Presupuestos declarados

| Métrica | Objetivo | Medición |
| --- | --- | --- |
| LCP | ≤ 2,5 s | ❓ |
| INP | ≤ 200 ms | ❓ |
| CLS | ≤ 0,05 | ❓ |
| TTFB | ≤ 800 ms | ❓ |

Son **objetivos, no estado**. Ver [../performance/budgets.md](../performance/budgets.md).

## Lo que sí se puede medir hoy

El tamaño del artefacto es medible y está bajo presupuesto controlado:

```bash
npx tsc -b && npx vite build --outDir /tmp/dist-check --emptyOutDir
node scripts/check-bundle-budget.mjs
```

Es un indicador indirecto pero real: el chunk inicial es el principal determinante del LCP en una aplicación CSR.

## Prioridad

Instrumentar Web Vitals **no es la primera acción de rendimiento**. Lo es corregir el fallback de filtrado local, cuyo impacto en INP está identificado y cuantificado sin necesidad de medir.

Medir después sirve para **confirmar la mejora**, que es exactamente para lo que debería usarse.
