# v40 - Edición de movimientos de transacción y estudiante unificado

## Transacción

Se agregó edición directa de movimientos contables dentro del formulario de transacción:

- cada fila agregada ahora tiene acciones **Editar** y **Quitar**;
- al editar, los campos cuenta, tipo, monto y descripción vuelven al editor superior;
- el botón cambia a **Guardar cambios**;
- se puede cancelar la edición sin perder los movimientos ya registrados;
- la fila en edición queda resaltada visualmente;
- el payload final mantiene `movimientos` con `id_cuenta`, `debe` y `haber`.

## Estudiante

El recurso `personas/estudiante` ya no depende de crear `persona` por separado desde el frontend.

El formulario de estudiante ahora permite registrar en el mismo payload:

- datos base de persona: nombres, apellidos, documento, teléfono, email, dirección y fecha de nacimiento;
- datos propios de estudiante: código, unidad educativa, tipo, nivel, curso, turno, carrera y año de ingreso.

`id_persona` queda como campo opcional para edición/vinculación de un registro existente.

## Contrato backend

El ajuste mantiene el flujo esperado por el backend: al crear estudiante desde `/api/personas/estudiante`, el backend crea/asocia las cuentas automáticas de estudiante como `ESTUDIANTE_CXC` y `ESTUDIANTE_PAQUETE_DIFERIDO`.
