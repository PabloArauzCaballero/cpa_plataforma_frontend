# v41 - Edición real en modal y borradores locales

## Cambios

- El botón Editar ahora intenta cargar el registro completo desde el endpoint de detalle antes de abrir/llenar el modal.
- Si el endpoint de detalle no responde, mantiene como respaldo la fila visible.
- El formulario de transacción reinicializa correctamente sus movimientos cuando cambia el registro editado.
- Los movimientos de transacción permiten editar cuenta, tipo, monto y descripción.
- Se añadió guardado de borrador local para formularios genéricos y transacciones.
- Los borradores se guardan por recurso y por modo crear/editar.
- Los borradores no se envían al sistema hasta que el usuario presiona Guardar.
- Se omiten claves sensibles como password, token, secret, hash y session al guardar borradores.

## Nota de arquitectura

El borrador local sirve para no perder avances en un navegador. Para colaboración multiusuario, auditoría o continuidad entre dispositivos, debe agregarse después un endpoint sistema de borradores.
