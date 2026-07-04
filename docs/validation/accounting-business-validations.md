# Validaciones contables de negocio implementadas en frontend

Este documento resume las validaciones contables añadidas al proyecto React para reducir texto libre y prevenir registros ambiguos antes de enviar payloads al sistema.

## Transacciones contables

- La transacción debe tener al menos dos movimientos.
- Cada movimiento debe tener una cuenta válida.
- Cada movimiento debe tener un monto mayor a cero.
- Cada movimiento se registra en un solo lado: Debe o Haber.
- La suma del Debe debe ser igual a la suma del Haber.
- No se permite repetir la misma cuenta en el mismo lado del asiento; se debe agrupar el monto.
- Si `tipo_transaccion = COSTO`, debe seleccionarse `id_centro_costo_mapa`.
- Si `tipo_transaccion = BIEN`, debe seleccionarse `id_bien` o `id_movimiento_detalle`.
- Si `tipo_transaccion = DEUDA`, debe seleccionarse `id_deuda` o `id_pago_deuda`.

## Grupo de cuenta

- `tipo` se controla por catálogo: `BALANCE`, `RESULTADOS`.
- `sub_tipo` depende de `tipo`:
  - `BALANCE`: `ACTIVO`, `PASIVO`, `PATRIMONIO`.
  - `RESULTADOS`: `INGRESO`, `GASTO`.
- `sub_grupo` se controla por catálogo.
- `codigo` se valida como código contable sin espacios innecesarios.

## Cuenta

- `codigo` debe tener formato limpio.
- `nombre_cuenta` no debe ir vacío.
- `id_grupo_cuenta` debe seleccionarse desde lookup.

## Centro de costo

- `codigo` debe tener formato claro; se recomienda `CC-...`.
- `id_cuenta_ingreso` y `id_cuenta_costo` no pueden ser iguales cuando ambos existen.

## Centro costo mapa

- Debe estar asociado al menos a una entidad operativa: deuda, bien, sucursal, tienda, empleado, posición o departamento.
- Se bloquea/advierte cuando se mezclan demasiadas entidades a la vez, porque vuelve ambiguo el mapa contable.

## Cuenta asignación

- `entidad_tipo` es catálogo cerrado.
- Según `entidad_tipo`, se exige la FK correspondiente:
  - `EMPLEADO` → `id_empleado`
  - `ESTUDIANTE` → `id_persona_estudiante`
  - `TUTOR` → `id_persona_tutor`
  - `SUCURSAL` → `id_sucursal`
  - `EDIFICIO` → `id_edificio`
  - `TIENDA` → `id_tienda`
  - `BIEN` → `id_bien`
  - `DEUDA` → `id_deuda`
  - `PROVEEDOR` → `id_proveedor`
  - `DEPARTAMENTO` → `id_departamento`
- Solo debe existir una entidad principal seleccionada.

## Pago tutor

- `estado_pago` es catálogo cerrado.
- `subtotal` y `total` no pueden ser negativos.
- `ajustes` puede ser positivo o negativo.
- Si existen subtotal, ajustes y total, entonces `total = subtotal + ajustes`.
- `fecha_pago` debe ser posterior o igual a `fecha_aprobacion` cuando ambas existen.

## Deuda y pago de deuda

- `tipo_tasa`, `capitalizacion`, `tipo_calculo_cuotas`, `frecuencia_cuotas`, `tipo_pago` y `tipo_primer_pago` son catálogos cerrados.
- `monto_inicial` debe ser mayor a cero.
- `plazo_meses` debe ser entero positivo.
- Los componentes monetarios no pueden ser negativos.
- En pago de deuda, la suma de capital, interés, seguro y recargos debe ser mayor a cero.
