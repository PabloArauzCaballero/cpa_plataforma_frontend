# v15 - Campos dinámicos por tipo de transacción

## Problema corregido

El formulario de `contabilidad.transaccion` mostraba todos los campos relacionados al mismo tiempo, aunque el DDL define que la tabla `contabilidad.transaccion` concentra referencias de distintos orígenes de negocio:

- `COSTO`
- `VENTA`
- `BIEN`
- `DEUDA`
- `GENERAL`

Esto generaba formularios demasiado largos y permitía que el usuario llenara campos que no correspondían al tipo elegido.

## Corrección aplicada

El formulario de transacción ahora muestra solo los campos relacionados con `tipo_transaccion`.

### Campos comunes

Siempre visibles:

- `fecha_transaccion`
- `tipo_transaccion`
- `sub_tipo_transaccion`
- `glosa`

### GENERAL

- `id_sucursal`
- `id_tienda`
- `id_departamento`
- `id_empleado`
- `id_dividendo_pago`
- `id_emision_titulo`

### COSTO

- `id_centro_costo_mapa`
- `id_empleado`
- `id_empleado_pago`
- `id_departamento`
- `id_clase_por_hora`
- `id_producto_educativo`
- `id_curso_version`
- `id_sucursal`
- `id_tienda`
- `id_proveedor`
- `id_pago_tutor`

### VENTA

- `id_producto_educativo`
- `id_curso_version`
- `id_cliente`
- `id_sucursal`
- `id_tienda`
- `id_clase_por_hora`

### BIEN

- `id_bien`
- `id_movimiento_detalle`
- `id_sucursal`
- `id_tienda`
- `id_proveedor`

### DEUDA

- `id_deuda`
- `id_pago_deuda`
- `id_proveedor`

## Reglas de payload

Los campos ocultos se limpian del payload antes de enviar, para evitar que una transacción de un tipo arrastre referencias de otro tipo.

## Subtipos dinámicos

`sub_tipo_transaccion` ahora cambia sus opciones según `tipo_transaccion`.

