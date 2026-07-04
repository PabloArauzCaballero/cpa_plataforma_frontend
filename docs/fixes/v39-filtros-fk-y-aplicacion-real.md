# v39 - Filtros FK y aplicación real de consulta

## Problema corregido

Algunos filtros por campos relacionados, por ejemplo `id_grupo_cuenta` en Cuenta, aparecían vacíos o no cargaban sus opciones reales desde la base de datos. Además, algunos endpoints genéricos podían ignorar filtros enviados por query params, haciendo que el frontend mostrara resultados sin aplicar correctamente la consulta.

## Cambios

- Los filtros FK ahora cargan opciones desde el endpoint relacionado definido en el catálogo de campos.
- Ejemplo: `cuenta.id_grupo_cuenta` carga desde `/api/contabilidad/grupo-cuenta` y usa `id_grupo_cuenta` como valor.
- La carga de opciones recorre la paginación del sistema para no quedarse solo con la primera página.
- Si un endpoint no aplica correctamente filtros o búsqueda en servidor, el frontend carga el universo paginado del recurso y aplica la consulta localmente antes de paginar la tabla visible.
- La exportación usa el mismo criterio para no exportar datos fuera de la consulta seleccionada.
- Los filtros FK comparan por valor exacto para evitar coincidencias accidentales.
- Los filtros de texto usan coincidencia flexible sin acentos ni mayúsculas.

## Archivos principales

- `src/features/resources/hooks/useResourceListViewModel.ts`
- `src/features/resources/domain/CrudResource.ts`
- `src/shared/components/SearchFilterBar/SearchFilterBar.tsx`
