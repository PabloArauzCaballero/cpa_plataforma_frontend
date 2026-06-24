# v22 - Corrección de filtro implícito de registros activos

## Problema

Al listar tablas, el frontend no enviaba ningún parámetro explícito para indicar si se debían incluir registros inactivos o eliminados. En el DDL del backend varias funciones de listado tienen el parámetro `p_only_activos` con valor por defecto `true`, por lo que el backend podía devolver solamente registros con `estado_registro = 'Activo'` aunque en la pantalla el filtro visual diga `Todos`.

## Corrección

La capa global de listados ahora envía parámetros explícitos de visibilidad:

- `onlyActivos=false`
- `only_activos=false`
- `includeInactive=true`
- `include_inactive=true`

Esto se aplica por defecto cuando el usuario no selecciona explícitamente `Activo`.

Si el usuario filtra por `estado_registro = Activo`, el frontend envía:

- `onlyActivos=true`
- `only_activos=true`
- `includeInactive=false`
- `include_inactive=false`

## Alcance

Se corrigió en:

- Listados principales de todas las tablas.
- Exportación, porque usa la misma capa `listAllResource`.
- Selects FK y buscadores de cuentas, porque usan `lookupApi`.
- Acción de inhabilitar: ahora envía `Inactivo` en vez de `INACTIVO`, respetando el formato usado por la base de datos.

## Resultado esperado

Al entrar a una tabla con filtro visual `Todos`, deben aparecer activos e inactivos si el backend los devuelve. Solo se listarán exclusivamente activos cuando el usuario elija el filtro `Activo`.
