# v19 - Búsqueda con espera y exportación por consulta

## Problema corregido

La búsqueda global disparaba consultas al sistema en cada tecla. Eso hacía que escribir fuera incómodo porque la tabla se actualizaba demasiado rápido.

## Solución implementada

- La búsqueda global ahora usa una espera de 500 ms antes de consultar al sistema.
- Mientras el usuario escribe, el input conserva el texto local y muestra un aviso de búsqueda pendiente.
- La tabla no se desmonta cuando ya hay registros cargados; solo muestra el estado `Actualizando resultados...`.

## Exportación

Se agregó exportación por tabla en un modal de consulta.

El modal permite elegir:

- Formato: CSV, Excel o JSON.
- Búsqueda global.
- Filtros por campo según el recurso actual.

La exportación no usa solo la página visible. Hace consultas paginadas al sistema respetando los filtros elegidos y descarga el archivo en el navegador.

## Archivos principales

- `src/features/resources/components/ResourceExportModal.tsx`
- `src/features/resources/components/ResourceExportModal.module.css`
- `src/features/resources/hooks/useResourceListViewModel.ts`
- `src/features/resources/services/resourceApi.ts`
- `src/features/resources/utils/exportRecords.ts`
- `src/shared/components/SearchFilterBar/SearchFilterBar.tsx`
- `src/features/resources/pages/ResourceListPage.tsx`
