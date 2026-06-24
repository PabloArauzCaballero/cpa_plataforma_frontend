# v18 - Paginación, buscador y filtros por campo en tablas

## Problema corregido
Las tablas cargaban registros sin paginación funcional, el buscador dependía de filtrado local limitado y no existían filtros específicos por los campos de cada recurso.

## Cambios implementados

- `listResource` ahora envía al backend:
  - `page`
  - `limit`
  - `offset`
  - `orderBy`
  - `orderDir`
  - `q` para búsqueda global cuando hay texto de búsqueda
  - filtros por columna real de la tabla
- El normalizador ahora recupera metadatos desde:
  - `data.count`
  - `data.limit`
  - `data.offset`
  - `pagination.count`
  - `pagination.limit`
  - `pagination.offset`
- `useResourceListViewModel` ahora controla:
  - página actual
  - tamaño de página
  - total de registros
  - total de páginas
  - búsqueda
  - filtros por campo
  - ordenamiento base
- `SearchFilterBar` ahora renderiza filtros dinámicos según los campos propios de cada recurso.
- `ResourceListPage` ahora muestra controles de paginación debajo de cada tabla.

## Regla funcional
Toda tabla debe consultar el backend con paginación real y filtros por columna. No se debe simular paginación únicamente en el cliente.

## Nota sobre búsqueda global
El frontend envía `q=<texto>` para búsqueda global. Si un endpoint específico no implementa `q`, el frontend aplica un filtro local de respaldo sobre la página actual, pero el comportamiento correcto debe estar soportado por el backend para búsqueda global completa.
