# v21 - Corrección visual del modal de exportación

## Problema corregido
El modal de exportación ocupaba demasiado espacio visual y el contenido quedaba pegado a los bordes. En recursos con varios filtros, los campos se apretaban y generaban una experiencia incómoda.

## Cambios aplicados
- Se agregó padding interno real al formulario del modal.
- Se separó la grilla principal de formato/búsqueda de la grilla de filtros.
- Los filtros ahora tienen scroll interno para evitar que el modal crezca demasiado.
- Los inputs y selects ahora respetan `width: 100%` y `box-sizing: border-box`.
- Los labels largos se recortan con elipsis para evitar desbordes.
- Las acciones quedan visibles con footer sticky dentro del modal.
- Se agregaron reglas responsive para tablet y móvil.

## Archivos modificados
- `src/features/resources/components/ResourceExportModal.tsx`
- `src/features/resources/components/ResourceExportModal.module.css`
