# v48 - Múltiples borradores con mini paginación e iconos

## Objetivo

Permitir que un usuario guarde más de un borrador por formulario/recurso, sin pisar automáticamente el último borrador guardado.

## Cambios

- `saveBackendDraft` ahora crea un borrador nuevo cuando se usa `createNew: true`.
- La clave cliente mantiene un prefijo estable por módulo/recurso/operación y agrega un sufijo único por borrador.
- Los formularios genéricos y el formulario de transacción listan varios borradores activos.
- Se agregó mini paginación de borradores:
  - anterior,
  - siguiente,
  - posición actual,
  - fecha del borrador seleccionado.
- Cargar y eliminar actúan sobre el borrador seleccionado.
- Se mantiene respaldo local solo como fallback si el backend no responde.
- Se agregaron iconos Font Awesome para:
  - guardar,
  - cargar,
  - eliminar,
  - base de datos,
  - navegación anterior/siguiente.

## Comportamiento esperado

Cada clic en **Guardar nuevo borrador** crea un nuevo registro en `administracion.registro_borrador`. El usuario puede navegar entre borradores y cargar o eliminar el seleccionado.
