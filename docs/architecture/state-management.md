# Gestión de estado

## Cuatro tipos de estado y dónde vive cada uno

| Tipo | Mecanismo | Ubicación |
|---|---|---|
| **Estado de servidor** | `useState` + `useEffect` por pantalla | Hooks de cada feature |
| **Estado de cliente** | `useState` local; un único Context | Componentes y `TutorialProvider` |
| **Estado de URL** | ❌ **No existe** más allá de los parámetros de ruta | — |
| **Estado persistido** | `localStorage` | `shared/auth/session`, `localDraftStore`, almacenes de tutoriales |

## Lo que NO hay

Verificado en `package.json`:

| Librería | Estado |
|---|---|
| Redux / Redux Toolkit | ❌ |
| Zustand / Jotai / Valtio / Recoil / MobX | ❌ |
| React Query / TanStack Query / SWR / Apollo | ❌ |
| react-hook-form / Formik / Final Form | ❌ |
| Zod / Yup / Joi | ❌ |

**Ninguna librería de estado ni de formularios.** Todo está construido a mano.

## Estado de servidor

Patrón repetido en cada pantalla, sin abstracción común:

```ts
const [data, setData] = useState<T[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => { void load(); }, [load]);
```

### Consecuencias medibles

| Consecuencia | Detalle |
|---|---|
| **Sin caché** | Combinado con `key={location.pathname}` en `AppShell`, cada navegación descarta los datos y vuelve a pedirlos. Volver atrás recarga todo |
| **Sin deduplicación** | Dos componentes que necesiten el mismo dato hacen dos peticiones |
| **Sin reintentos** | Un fallo de red es definitivo hasta que el usuario pulse «Reintentar» |
| **Sin invalidación** | Tras crear o editar, el hook recarga la lista manualmente |
| **Sin actualizaciones optimistas** | La interfaz siempre espera la respuesta |
| **Sin cancelación** | No hay `AbortController` en todo el proyecto. Una petición lenta que ya no interesa sigue viva |
| **Protección de carreras** | Solo en un sitio: bandera `isMounted` en la carga de lookups (`useResourceListViewModel.ts:410,430`) |

### El caso extremo: `useResourceListViewModel`

**774 líneas, 22 `useState`.** Es el núcleo del producto y el mayor concentrador de complejidad.

Estados que gestiona:

| Grupo | Variables |
|---|---|
| Datos | `records`, `totalRecords` |
| Paginación | `page`, `pageSize`, `orderBy`, `orderDir` |
| Carga | `isLoading`, `isSaving`, `isLoadingEditRecord` |
| Mensajes | `error`, `message`, `disableResult` |
| Búsqueda | `searchInput`, `debouncedSearch` |
| Filtros | `filterInputs`, `filters` |
| Formulario | `editingRecord`, `isFormOpen` |
| Exportación | `isExportModalOpen`, `isExporting`, `exportError` |
| Lookups | `lookupOptionsByField` |

### Patrón entrada/aplicado con debounce

Búsqueda y filtros usan **dos estados** cada uno: el valor que escribe el usuario y el valor ya aplicado.

```ts
useEffect(() => {                              // búsqueda: 900 ms
  const id = window.setTimeout(() => { setDebouncedSearch(searchInput); setPage(1); }, 900);
  return () => window.clearTimeout(id);
}, [searchInput]);

useEffect(() => {                              // filtros: 800 ms
  const id = window.setTimeout(() => { setFilters(filterInputs); setPage(1); }, 800);
  return () => window.clearTimeout(id);
}, [filterInputs]);
```

Ambos vuelven a la página 1 al aplicarse. La diferencia entre `search` y `debouncedSearch` alimenta el indicador `isSearchPending` de `SearchFilterBar`.

Son los debounces más largos que se ven habitualmente (lo común es 300 ms). Está justificado: cada aplicación puede desencadenar la descarga completa del recurso.

## Estado de cliente

### El único Context

`TutorialContext` / `TutorialProvider`, montado en `AppShell` (no en `App`), es decir, **solo en el área autenticada**.

Expone: `start`, `stop`, `resume`, `restart`, `skip`, `reset`, `resetAll`, `getTutorial`, `findContextual`, `setAutostartDisabled`, además de catálogo y progreso.

No hay Context de tema, idioma, usuario ni notificaciones.

### Estado local por componente

| Componente | Estados |
|---|---|
| `FileLibraryPage` | 19 |
| `CatalogosOperativosPage` | 12 |
| `ResourceBatchPage` | 7 |
| `TutorialCenterPage` | 4 |
| `useLoginViewModel` | 4 |
| `AppShell` | 1 (`navOpen`) |

`FileLibraryPage` con 19 estados en la propia página, sin hook extractor, es el mayor incumplimiento de la convención view-model del proyecto.

### Inconsistencia de patrón de carga

| Pantalla | Patrón |
|---|---|
| Mayoría | `isLoading: boolean` + `error: string \| null` |
| `CatalogosOperativosPage` | `LoadState` (máquina de estados con `idle`, …) |

Dos formas de representar lo mismo. Registrado como MEDIUM en [reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md).

## El estado de URL que no existe {#el-estado-de-url-que-no-existe}

Solo los parámetros de ruta (`:module`, `:resource`) viven en la URL. **Búsqueda, filtros, página, tamaño de página y orden son estado local.**

Consecuencias para el usuario:

| Situación | Resultado |
|---|---|
| Compartir un listado filtrado | ❌ Imposible: el enlace abre la lista sin filtrar |
| Recargar la página | ❌ Se pierden filtros, búsqueda y página |
| Botón «atrás» del navegador | ❌ No deshace un filtro; sale de la pantalla |
| Marcar como favorito | ❌ Solo guarda el recurso, no la consulta |

La corrección natural es `useSearchParams`. **Es un cambio de producto** (altera el comportamiento de navegación y el historial) y requiere autorización. Registrado como HIGH en [reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md).

## Estado persistido

Ver el inventario completo de claves en [data-and-state/persistence.md](../data-and-state/persistence.md) y el análisis de riesgo en [security/browser-storage.md](../security/browser-storage.md).

Resumen:

| Dato | Clave | Sensibilidad |
|---|---|---|
| Token de sesión | `cpa.sessionToken`, `cpa_session_token` | **Alta** |
| Sesión completa (roles, permisos, `rawUser`) | `cpa.session` | **Alta** |
| Correo | `cpa.userEmail`, `cpa_user_email` | Media |
| Borradores de formulario | claves de `localDraftStore` | **Puede contener datos personales** |
| Carpetas de la biblioteca | `cpa.fileLibrary.folders.v1` | Baja |
| Progreso de tutoriales | clave de `LocalTutorialProgressStorage` | Baja |
| Autoarranque de tutoriales | `AUTOSTART_KEY` | Nula |

Nada está cifrado ni tiene caducidad. `clearStoredSession()` borra **solo** las claves de sesión: borradores, carpetas y progreso **sobreviven al cierre de sesión** y quedan visibles para el siguiente usuario del mismo navegador.

Es un hallazgo de privacidad relevante en equipos compartidos. Ver [security/privacy.md](../security/privacy.md).

## Evaluación de permisos

`userHasAnyPermission` (`shared/auth/session.ts:154-173`) lee `localStorage` **en cada llamada**, no un estado de React.

```ts
if (session.esSuperUsuario) return true;
if (requiredPermissions.length === 0) return true;
// Modo seguro práctico: si el sistema todavía no envía matriz de permisos,
// el frontend no inventa bloqueos. Cuando sí llegan permisos, se respetan.
if (session.permisos.length === 0) return true;
```

Tres caminos devuelven `true` sin comprobar nada. Es una decisión consciente y comentada, pero significa que **la interfaz no es una barrera de seguridad**. Ver [security/threat-model.md](../security/threat-model.md#t-04).

Además, al no ser estado reactivo, un cambio de permisos no repinta nada hasta que el componente se vuelva a renderizar por otro motivo.

## Recomendaciones (propuestas, no ejecutadas)

| # | Propuesta | Beneficio | Tipo |
|---|---|---|---|
| 1 | Llevar filtros y paginación a `useSearchParams` | Enlaces compartibles, recarga estable, botón atrás coherente | Cambio de producto |
| 2 | Extraer el estado de `FileLibraryPage` a un hook | Coherencia con el resto | Refactor |
| 3 | Unificar `LoadState` e `isLoading` | Un solo patrón | Refactor |
| 4 | Añadir `AbortController` a las cargas | Evita carreras y trabajo inútil | Cambio de producto |
| 5 | Limpiar borradores y carpetas al cerrar sesión | Privacidad en equipos compartidos | Cambio de producto |

Ninguna se ha aplicado: todas modifican `src/`.
