# ADR-0006: Sin librería de estado ni de estado de servidor

## Estado

**Aceptado**, con reservas documentadas.

## Contexto

La aplicación gestiona estado de servidor (listados, catálogos, perfil), estado de cliente (formularios, modales, filtros) y estado persistido (sesión, borradores, progreso).

El ecosistema ofrece soluciones consolidadas para cada caso: Redux/Zustand para estado global, React Query/SWR para estado de servidor.

## Fuerzas y restricciones

- **No hay estado global real que compartir entre pantallas.** Cada pantalla trabaja con su propio recurso.
- La sesión es lo único verdaderamente transversal, y vive en `localStorage`, no en memoria.
- El equipo es pequeño: cada dependencia añade superficie que mantener.
- `AppShell` remonta el contenido en cada navegación (`key={location.pathname}`), lo que **haría inútil buena parte de una caché en memoria** salvo que se conservara fuera del árbol.

## Opciones consideradas

| Opción | Ventaja | Inconveniente |
| --- | --- | --- |
| **A. React Query / SWR** | Caché, deduplicación, reintentos, invalidación, estados de carga | Dependencia nueva; obliga a repensar el remontaje por ruta |
| **B. Redux / Zustand** | Estado global explícito | **No hay estado global que justificarlo** |
| **C. Solo React** | Cero dependencias; todo explícito | Hay que implementar a mano carga, error, deduplicación y cancelación |
| **D. Context para el estado de servidor** | Sin dependencias | Reinventa React Query, peor |

## Decisión

**Opción C.** Estado de servidor con `useState` + `useEffect` en hooks de view model; un único Context (`TutorialContext`); estado persistido en `localStorage`.

## Consecuencias positivas

- Solo **7 dependencias de producción**: superficie de mantenimiento y de seguridad mínima.
- El flujo de datos es explícito y rastreable: no hay magia de caché.
- Cero coste de aprendizaje de una librería adicional.
- Sin riesgo de datos obsoletos servidos desde una caché.
- Coherente con el remontaje por ruta: los datos siempre están frescos.

## Consecuencias negativas

Todas verificadas en el código:

| Carencia | Efecto real |
| --- | --- |
| **Sin caché** | Volver atrás recarga todo. Cada navegación repite las peticiones |
| **Sin deduplicación** | Dos componentes que necesiten el mismo dato hacen dos peticiones |
| **Sin reintentos** | Un fallo de red transitorio es definitivo hasta que el usuario pulse «Reintentar» |
| **Sin cancelación** | **No hay un solo `AbortController` en el proyecto**. Una petición que ya no interesa sigue viva |
| **Sin invalidación** | Tras crear o editar, el hook recarga la lista a mano |
| **Sin actualizaciones optimistas** | La interfaz siempre espera la respuesta |
| **Protección de carreras mínima** | Una sola bandera `isMounted`, en la carga de lookups |
| **Patrón repetido sin abstracción** | `isLoading`/`error`/`data` se reescribe en cada pantalla, y `CatalogosOperativosPage` usa `LoadState`, un patrón distinto |
| **`useResourceListViewModel` acumula 22 `useState`** | Complejidad concentrada, sin pruebas |

## Riesgos

| Riesgo | Severidad |
| --- | --- |
| Condiciones de carrera en pantallas con varias cargas concurrentes | 🟡 Medio; sin cancelación no hay defensa sistemática |
| La complejidad del view model crece hasta ser inmanejable | 🟠 Alto: ya son 774 líneas |
| Divergencia de patrones entre features | 🟡 Ya ocurre |

## Evidencia

- `package.json` — sin Redux, Zustand, Jotai, React Query ni SWR
- `src/features/resources/hooks/useResourceListViewModel.ts` — 22 `useState`
- `src/features/catalogs/pages/CatalogosOperativosPage.tsx` — patrón `LoadState` divergente
- `src/shared/layouts/AppShell/AppShell.tsx:167` — `key={location.pathname}`
- `grep -rn "AbortController" src` → sin resultados

## Plan de revisión

Reconsiderar si:

1. Un `AbortController` deja de ser suficiente y aparecen condiciones de carrera reportadas.
2. La ausencia de caché se convierte en un problema medido de rendimiento percibido.
3. Se elimina el remontaje por ruta (lo que haría rentable una caché).
4. Un tercer view model supera las 500 líneas.

**Nota:** adoptar React Query hoy exigiría revisar `key={location.pathname}` en `AppShell`, del que además depende de forma no declarada la corrección de `ResourceListPage`. Ver [../routes/resource-list.md](../routes/resource-list.md#riesgo-orden-de-hooks).
