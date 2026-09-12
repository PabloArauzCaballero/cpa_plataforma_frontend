# Estado de servidor

## Modelo

**Sin librería.** Cada pantalla implementa a mano el patrón `data` / `isLoading` / `error` con `useState` + `useEffect`.

```ts
const [records, setRecords] = useState<CrudRecord[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
useEffect(() => { void load(); }, [load]);
```

Decisión razonada en [ADR-0006](../adr/ADR-0006-sin-libreria-de-estado.md).

## Consecuencias operativas

| Característica | Estado | Efecto observable |
| --- | --- | --- |
| Caché | ❌ | Volver atrás recarga todo. Agravado por `key={location.pathname}` en `AppShell`, que desmonta el subárbol en cada navegación |
| Deduplicación | ❌ | Dos consumidores del mismo dato hacen dos peticiones |
| Reintentos | ❌ | Un fallo de red transitorio es definitivo hasta que el usuario pulse «Reintentar» |
| Invalidación | Manual | Tras crear o editar, el hook llama a `load()` |
| Actualizaciones optimistas | ❌ | La interfaz siempre espera la respuesta. Coherente con datos contables |
| Rollback de mutación | ❌ No aplica | Al no haber optimismo, no hay nada que revertir |
| Cancelación | ❌ | **Ni un solo `AbortController` en el proyecto** |
| Tiempo de espera | ❌ | `fetch` sin `timeout` |
| Protección de carreras | Mínima | Una bandera `isMounted`, solo en la carga de lookups |
| Refresco en segundo plano | ❌ | Los datos solo se actualizan al montar o al pulsar recargar |
| Estado sin conexión | ❌ | Sin Service Worker |

## Claves de consulta

No existe el concepto. La «clave» efectiva es el objeto `query` memoizado:

```ts
const query = useMemo<ResourceListQuery>(() => ({
  page, limit: pageSize, offset: (page - 1) * pageSize,
  orderBy, orderDir, search: debouncedSearch, filters,
}), [page, pageSize, orderBy, orderDir, debouncedSearch, filters]);
```

`load` es un `useCallback` que depende de `query`, y el efecto depende de `load`. Cambiar cualquier parámetro dispara una recarga. Es una invalidación **implícita por identidad de objeto**, que funciona pero no es explícita.

## El fallback de filtrado local

Cuando hay búsqueda o filtro activo, el estado de servidor **deja de serlo**: se descarga el universo del recurso y se procesa en el navegador.

Coste cuantificado en [../performance/rendering.md](../performance/rendering.md). Resumen: hasta 250 peticiones secuenciales y 50 000 filas en memoria.

## Tolerancia de la respuesta

Todo el estado de servidor entra por mappers deliberadamente tolerantes. La contrapartida es grave y hay que conocerla:

> **Una respuesta con forma no reconocida se convierte en lista vacía, no en error.** La pantalla muestra «Sin registros», indistinguible de una tabla realmente vacía.

Ver [ADR-0007](../adr/ADR-0007-tolerancia-de-contrato.md).

## Inconsistencia de patrón

| Pantalla | Patrón |
| --- | --- |
| Mayoría | `isLoading: boolean` + `error: string \| null` |
| `CatalogosOperativosPage` | `LoadState` (máquina de estados) |

Dos formas de representar lo mismo. Registrado como G-33 en [../reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md).

## Fallos silenciosos del estado de servidor

| Ubicación | Comportamiento |
| --- | --- |
| Carga de lookups | `catch { return [field.name, []] }` → select vacío sin explicación |
| Enriquecer transacción | `catch { return record }` → se edita sin movimientos |
| Catálogos operativos | `Promise.all` → **si una de cinco cargas falla, la pantalla entera muestra error**, sin degradación parcial |

Ver [../observability/error-reporting.md](../observability/error-reporting.md).

## El contraejemplo positivo

`ResilientTutorialProgressStorage` es el único caso con estrategia de degradación diseñada: intenta el almacén remoto, cae a `localStorage` si falla y **emite un aviso visible**. Es el patrón que convendría generalizar.
