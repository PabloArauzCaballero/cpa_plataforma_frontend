# Estado de cliente

## Inventario

| Tipo | Mecanismo | Alcance |
| --- | --- | --- |
| Estado local de componente | `useState` | Por componente |
| Estado de feature | Un único Context (`TutorialContext`) | Área autenticada |
| Estado global | ❌ **No existe** | — |
| Estado de URL | ❌ Solo parámetros de ruta | — |

## El único Context

`TutorialProvider` (`src/features/tutorials/react/TutorialProvider.tsx`, 298 líneas), montado en `AppShell`, **no en `App`**: por tanto **no existe en `/login`**.

`TutorialContextValue` expone:

| Categoría | Miembros |
| --- | --- |
| Control del recorrido | `start`, `stop`, `resume`, `restart`, `skip` |
| Progreso | `reset`, `resetAll` |
| Consulta | `getTutorial`, `findContextual` |
| Preferencias | `setAutostartDisabled` |
| Datos | catálogo y progreso |

Hay dos hooks de acceso: `useTutorials()` (obligatorio) y `useOptionalTutorials()` (tolera la ausencia del provider), lo que permite que componentes compartidos funcionen fuera del área autenticada.

**No hay Context de tema, idioma, usuario, permisos ni notificaciones.**

## Estado local por componente

| Componente | `useState` | Observación |
| --- | ---: | --- |
| `useResourceListViewModel` | **22** | El mayor concentrador de complejidad del proyecto |
| `FileLibraryPage` | **19** | En la propia página, **sin hook extractor**: incumple la convención view-model |
| `CatalogosOperativosPage` | 12 | Patrón `LoadState` divergente |
| `SearchableSelect` | 6 | Combobox: apertura, consulta, resaltado, alta rápida |
| `ResourceBatchPage` | 7 | — |
| `TutorialCenterPage` | 4 | Filtros de la vista |
| `useLoginViewModel` | 4 | — |
| `ResourceListPage` | 2 | Ayuda y confirmación pendiente |
| `LoginForm` | 1 | Visibilidad de la contraseña |
| `AppShell` | 1 | `navOpen` |
| `InfoHint` | 1 | `pinned` |

## Patrón entrada/aplicado

Búsqueda y filtros mantienen **dos estados** cada uno: lo que el usuario escribe y lo que ya se aplicó.

| Par | Debounce | Efecto adicional |
| --- | ---: | --- |
| `searchInput` → `debouncedSearch` | 900 ms | `setPage(1)` |
| `filterInputs` → `filters` | 800 ms | `setPage(1)` |

La diferencia entre ambos alimenta el indicador `isSearchPending` de `SearchFilterBar`, que informa al usuario de que su escritura aún no se ha aplicado. Es un detalle de calidad de interfaz bien resuelto.

Los debounces son largos (lo habitual son 300 ms) y está justificado: cada aplicación puede desencadenar la descarga completa del recurso.

## Estado que se pierde en cada navegación

`AppShell.tsx:167` renderiza `<div key={location.pathname}>`. Al cambiar de ruta, **el subárbol se desmonta y se monta de nuevo**, descartando todo el estado local.

| Se pierde | Consecuencia |
| --- | --- |
| Filtros y búsqueda | Volver a un listado lo muestra sin filtrar |
| Página actual | Se vuelve a la 1 |
| Tamaño de página | Vuelve a 20 |
| Orden | Vuelve al de la clave primaria, ascendente |
| Datos cargados | Se vuelven a pedir |

Es intencionado (habilita la transición CSS por ruta) pero tiene un efecto colateral no declarado: **neutraliza un defecto de orden de hooks en `ResourceListPage`**. Ver [../routes/resource-list.md](../routes/resource-list.md#riesgo-orden-de-hooks).

## Lo que no vive en la URL

Búsqueda, filtros, página, tamaño de página y orden son estado local, no parámetros de consulta.

| Situación | Resultado |
| --- | --- |
| Compartir un listado filtrado | ❌ El enlace abre la lista sin filtrar |
| Recargar la página | ❌ Se pierde todo |
| Botón «atrás» | ❌ No deshace un filtro; sale de la pantalla |
| Marcar como favorito | ❌ Solo guarda el recurso |

Corrección natural: `useSearchParams`. Es un **cambio de producto** (altera navegación e historial). Registrado como G-10.

## Permisos: estado no reactivo

`userHasAnyPermission` lee `localStorage` **en cada llamada**, no un estado de React. Consecuencia: un cambio de permisos no repinta nada hasta que el componente se vuelva a renderizar por otro motivo.

En la práctica no genera problemas porque los permisos no cambian durante una sesión, pero conviene conocerlo.
