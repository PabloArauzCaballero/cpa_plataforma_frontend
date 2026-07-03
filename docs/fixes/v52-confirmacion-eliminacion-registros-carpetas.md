# v52 - Confirmación antes de eliminar o inhabilitar

## Objetivo
Evitar acciones accidentales al eliminar o inhabilitar registros y al quitar carpetas de la biblioteca de archivos.

## Cambios

- Se agregó `ConfirmDialog` como componente reutilizable.
- Todas las tablas genéricas abren un modal de confirmación antes de ejecutar la acción de inhabilitar/eliminar.
- El modal muestra el registro objetivo usando nombre, código, concepto o identificador según disponibilidad.
- La Biblioteca de archivos ahora permite quitar carpetas locales mediante un botón con icono de papelera.
- Antes de quitar una carpeta se muestra confirmación explícita.
- Quitar una carpeta no elimina archivos en Cloudinary ni registros de base de datos; solo la retira como acceso rápido local.

## Validación esperada

- Al presionar papelera en cualquier tabla, no debe ejecutarse la acción inmediatamente.
- Al confirmar, se ejecuta el flujo normal de inhabilitación del recurso.
- Al cancelar, no cambia nada.
- Al presionar papelera en una carpeta creada localmente, se pide confirmación antes de quitarla.
