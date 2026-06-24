# v23 - Exportación completa con confirmación y paginación real

## Problema detectado

Cuando una tabla tenía más registros que los visibles en pantalla, por ejemplo más de 700, la exportación podía quedarse solo con 200 registros.

La causa era que el backend podía devolver menos registros que el `limit` solicitado. El frontend avanzaba el `offset` usando el tamaño solicitado, no la cantidad real recibida. Eso podía saltar bloques de registros durante la exportación.

Además, si el usuario no seleccionaba filtros, la exportación podía descargar todos los registros sin una advertencia clara.

## Corrección aplicada

### 1. Exportación paginada sin saltos

`listAllResource` ahora avanza el `offset` con la cantidad real de registros recibidos en cada consulta.

Esto evita saltos cuando el backend limita internamente la respuesta a 200 registros.

### 2. Confirmación cuando no hay filtros

El modal de exportación ahora valida si el usuario no eligió:

- búsqueda global,
- filtros por campo.

Si no hay ninguna condición activa, muestra una confirmación antes de exportar todos los registros.

### 3. Mensaje claro al usuario

El usuario ve el total aproximado a exportar y debe confirmar explícitamente con:

`Sí, exportar todo`

## Archivos modificados

- `src/features/resources/services/resourceApi.ts`
- `src/features/resources/components/ResourceExportModal.tsx`
- `src/features/resources/components/ResourceExportModal.module.css`
- `src/features/resources/pages/ResourceListPage.tsx`

## Validación

Ejecutado correctamente:

```bash
npm run build
```
