# Rendimiento de renderizado y de datos

## El problema dominante: el fallback de filtrado local

Es, con diferencia, el mayor riesgo de rendimiento del producto.

### Qué hace

```ts
// useResourceListViewModel.ts:464-479
if (hasActiveQuery(query.search, query.filters)) {
  // Fallback profesional: algunos endpoints genéricos no aplican todos los filtros FK en servidor.
  // Para que la tabla nunca mienta, cuando hay búsqueda/filtros cargamos el universo paginado
  // y aplicamos la consulta en frontend antes de paginar visualmente.
  const allData = await listAllResource(resource, { ...query, page: 1, offset: 0, search: '', filters: {} });
  const localResult = applyLocalQuery(allData.records, query);
  …
}
```

En cuanto hay **cualquier** búsqueda o filtro activo, se abandona la paginación del servidor y se descarga el recurso completo.

### Coste cuantificado

`listAllResource` pagina de **200 en 200**, con tope de **50 000** filas.

| Filas del recurso | Peticiones secuenciales | Filas en memoria |
| ---: | ---: | ---: |
| 500 | 3 | 500 |
| 5 000 | 25 | 5 000 |
| 20 000 | 100 | 20 000 |
| 50 000 | 250 | 50 000 |
| 200 000 | 250 (truncado) | 50 000 ⚠️ **datos incompletos, sin aviso** |

Son **secuenciales**, no paralelas: el bucle avanza el offset con la cantidad realmente recibida.

Después, `applyLocalQuery` filtra, ordena (`localeCompare` con configuración regional española) y pagina **en el hilo principal**.

### Riesgo adicional: truncado silencioso

Si el recurso supera las 50 000 filas, el resultado se corta y **la interfaz no lo indica**. El usuario ve un total y unos resultados que pueden no reflejar toda la tabla — precisamente lo contrario de lo que el comentario del código pretende («para que la tabla nunca mienta»).

### Mitigaciones ya presentes

| Mitigación | Efecto |
| --- | --- |
| Debounce de 900 ms en la búsqueda | Evita disparar en cada tecla |
| Debounce de 800 ms en los filtros | Ídem |
| `seenOffsets` evita bucles infinitos | Protección de corrección, no de rendimiento |
| Tope de 50 000 filas | Acota el peor caso |

Son amortiguadores; **no eliminan el coste**.

### Corrección de fondo

Que el backend aplique todos los filtros, incluidos los de clave foránea, y eliminar el fallback. Es un **cambio conjunto frontend/backend** y requiere verificar qué parámetros respeta realmente el servidor — lo cual hoy es difícil porque `appendQuery` envía cada concepto con varios nombres.

## Segundo problema: carga de opciones de lookup

```ts
// useResourceListViewModel.ts:422
const options = await listAllLookupOptions(field.relation!, 300, 100000);
```

- Páginas de **300**, tope de **100 000 opciones por campo**.
- Se lanzan **en paralelo** para todos los campos con `relation`, al montar la pantalla.
- Un recurso con 5 campos relacionados puede disparar cientos de peticiones simultáneas.
- Si una falla, se silencia: `catch { return [field.name, []] }` — el select queda vacío sin explicación.

`SearchableSelect` filtra esas opciones **en cliente**. Con listas muy grandes, el filtrado se ejecuta en cada pulsación dentro de un `useMemo`.

**Corrección propuesta:** búsqueda contra el servidor en el selector, en lugar de descargar el catálogo completo.

## Renderizado

| Aspecto | Estado |
| --- | --- |
| Virtualización de listas | ❌ `DataTable` renderiza todas las filas de la página |
| Tamaño máximo de página | 100 filas — aceptable sin virtualización |
| `React.memo` | ❌ Ningún componente lo usa |
| `useMemo` / `useCallback` | ✅ En los view models, donde importa |
| `useTransition` / `useDeferredValue` | ❌ Sin uso |
| Remontaje por ruta | `key={location.pathname}` fuerza desmontar y montar en cada navegación |

**El renderizado no es el cuello de botella**: con 100 filas máximo y remontaje por ruta, el DOM se mantiene pequeño. El coste está en los **datos**.

## Interacciones con riesgo de INP alto

| Interacción | Trabajo que dispara |
| --- | --- |
| Escribir en el buscador | Tras 900 ms: descarga completa + filtrado + ordenación |
| Aplicar un filtro | Tras 800 ms: lo mismo |
| Cambiar de página con filtros activos | Recalcula sobre el conjunto ya descargado (más barato) |
| Abrir un formulario con muchos lookups | Peticiones paralelas por cada campo relacionado |
| Editar una transacción | Petición adicional para traer sus movimientos |

Ninguna medida: no hay instrumentación. Ver [budgets.md](budgets.md).

## Peticiones sin límite de tiempo

`httpClient` no fija `timeout` ni usa `AbortController`. Una petición colgada lo está indefinidamente, y el usuario ve el estado de carga sin fin.

Corrección de bajo coste: `AbortSignal.timeout(ms)` en el `fetch`.

## Lo que está bien

| Aspecto | Detalle |
| --- | --- |
| Cero fuentes web | No hay descarga de fuentes: sin FOIT/FOUT y sin CLS por fuente |
| Casi sin imágenes | Solo `public/logo.png` |
| División por ruta | 9 chunks de página |
| Caché inmutable de assets | `expires 1y` en `nginx.conf`, seguro por los hashes |
| `index.html` sin caché | El despliegue nuevo se ve de inmediato |
| Build muy rápido | 186 ms |
| Debounces generosos | 900/800 ms, coherentes con el coste real de cada consulta |
| Sin scripts de terceros | Ningún `<script>` externo |

## Prioridades de mejora

| # | Acción | Impacto | Requiere backend |
| --- | --- | --- | --- |
| 1 | Filtrado en servidor; eliminar el fallback local | 🔴 Muy alto | Sí |
| 2 | Búsqueda de lookups contra el servidor | 🟠 Alto | Sí |
| 3 | Cargar `TutorialProvider` y `driver.js` bajo demanda | 🟠 Alto (bundle inicial) | No |
| 4 | `AbortController` con timeout en `httpClient` | 🟡 Medio | No |
| 5 | Avisar cuando el resultado se trunca a 50 000 | 🟡 Medio (corrección) | No |
| 6 | Instrumentar `web-vitals` para medir en vez de suponer | 🟡 Medio | No |

Ninguna ejecutada: todas modifican `src/`.
