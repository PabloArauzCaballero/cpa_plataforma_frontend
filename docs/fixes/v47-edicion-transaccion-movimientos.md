# v47 - Edición real de movimientos en transacción

## Problema

Al editar una transacción, el encabezado se cargaba pero la tabla de movimientos quedaba vacía cuando el endpoint de detalle no devolvía los movimientos embebidos.

## Corrección

- El modal de edición muestra un estado de carga mientras obtiene el detalle completo.
- Si el detalle de transacción no trae movimientos, el frontend consulta `transaccion-movimiento-cuenta` filtrando por `id_transaccion`.
- Se normalizan más aliases de backend: `movimientos`, `transaccion_movimiento_cuenta`, `transaccion_movimientos_cuenta`, `movimientos_cuenta`, `detalles_movimientos`, entre otros.
- Los movimientos recuperados cargan en la tabla y pueden editarse con el botón Editar.

## Resultado

La edición de transacción carga encabezado y movimientos antes de permitir guardar cambios.
