# Ruta `/batch/:module/:resource`

| | |
|---|---|
| **Patrón** | `/batch/:module/:resource` |
| **Componente** | `ResourceBatchPage` |
| **Archivo** | `src/features/resources/pages/ResourceBatchPage.tsx` (243 líneas) |
| **Layout** | `AppShell` |
| **Parámetros** | `module`, `resource` |

## Propósito de negocio

Importación masiva de registros desde un archivo Excel/CSV, en dos tiempos: **validar primero, procesar después**. Evita cargar datos erróneos sin revisión previa.

## Acceso y permisos

- Protegida por `ProtectedRoute`.
- **No evalúa permisos.** A diferencia de `ResourceListPage`, esta pantalla no llama a `userHasAnyPermission`. Cualquier usuario con sesión puede intentar una importación; la autorización recae por completo en el backend.

Registrado como inconsistencia MEDIUM en [reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md).

## Flujo de usuario

1. Se llega por URL directa o desde un enlace de la pantalla de listado.
2. Si el recurso no existe → `PageState` «Recurso no encontrado» (línea 57).
3. El usuario elige un archivo y un **modo** (`create` por defecto).
4. **Validar** → `POST` multipart al endpoint de validación. Devuelve el detalle fila por fila.
5. Se revisan las filas: válidas, con advertencia y con error, con su mensaje.
6. **Procesar** → `POST` multipart al endpoint de proceso, arrastrando el `importId` de la validación si el backend lo devolvió.
7. Se muestra el resultado: creados, actualizados, con error, y mensaje del servidor.

## Estados de interfaz

| Estado | Origen |
|---|---|
| Recurso inexistente | `PageState`, línea 57 |
| Sin archivo | Botones inactivos |
| Validando | `isValidating` |
| Resultado de validación | `validation` con recuento y filas |
| Procesando | `isProcessing` |
| Resultado del proceso | `processResult` |
| Error | `error` |

Siete estados sobre siete `useState` (líneas 64-70).

## Contratos de datos

Los endpoints se derivan del recurso, con valor por defecto si no se declaran (`resourceApi.ts:133-139`):

| Operación | Endpoint | Por defecto |
|---|---|---|
| Validar | `resource.endpoints.batchValidate` | `{list}/batch/validate` |
| Procesar | `resource.endpoints.batchProcess` | `{list}/batch/process` |

> **Ninguno de los 59 recursos declara `batchValidate` ni `batchProcess`.** Verificado con `grep -n "batchValidate\|batchProcess" src/features/resources/domain/resourceDefinitions.ts` → sin coincidencias. Es decir, **todas** las importaciones usan la ruta por defecto, por ejemplo `POST /api/personas/estudiante/batch/validate`.
>
> Si el backend no expone ese patrón, la pantalla falla con el error HTTP correspondiente. **No hay evidencia en este repositorio de que esos endpoints existan.** Es el drift contractual de mayor riesgo detectado. Ver [integrations/backend-api.md](../integrations/backend-api.md#drift-contractual-detectado).

### Cuerpo de la petición

`buildBatchFormData` (`resourceApi.ts:205-218`) envía un `FormData` con el archivo **duplicado bajo dos nombres**, otra vez por tolerancia:

| Campo | Valor |
|---|---|
| `file` | el archivo |
| `archivo` | el mismo archivo |
| `module` | `resource.module` |
| `resource` | `resource.key` |
| `mode` | `create` u otro |
| `importId` | solo al procesar, si existe |

Se envía con `httpClient.upload`, que **no** fija `Content-Type` (lo pone el navegador con el `boundary`) pero sí añade `X-Session-Token`.

### Normalización de la respuesta

`normalizeBatchValidationResponse` y `normalizeBatchProcessResponse` (`resourceApi.ts:173-203`) aceptan alias en español e inglés:

| Concepto | Claves aceptadas |
|---|---|
| Filas | `rows`, `detalle`, `data`, o la raíz si es array |
| Estado de fila | `status`, `estado`, `validacion`; se clasifica por subcadena: `error` → error, `warn`/`observ` → warning, resto → valid |
| Número de fila | `rowNumber`, `row`, `fila`, o el índice + 1 |
| Mensaje | `message`, `mensaje` |
| Identificador de lote | `importId`, `loteId` |
| Totales | `totalRows`/`total`/`registros`, `validRows`/`validos`, `warningRows`/`observados`, `errorRows`/`errores` |

**Consecuencia:** una fila cuyo estado no contenga «error» ni «warn»/«observ» se clasifica como **válida por defecto**. Un estado desconocido del backend se lee como correcto.

## Componentes

`PageState` y controles nativos (`<input type="file">`, `<select>`, `<button>`). No usa `Modal`, `DataTable` ni `FormField`: renderiza su propia tabla de resultados.

## Analítica

Ninguna.

## Accesibilidad

| Aspecto | Estado |
|---|---|
| Campo de archivo | ⚠️ `<input type="file">` nativo; conviene verificar que tenga etiqueta asociada |
| Tabla de resultados | ⚠️ Sin `<caption>` ni `scope` |
| Estado de fila | ⚠️ Comunicado por color y texto; el texto existe |
| Progreso de validación/proceso | ❌ Sin región activa que anuncie el fin de la operación |
| Encabezado | `<h2>` (línea 114), sin `<h1>` propio |

## Pruebas

**Ninguna.** Ni de la pantalla, ni de `normalizeBatchValidationResponse`, ni de `normalizeBatchProcessResponse`, ni de `buildBatchFormData` — pese a ser funciones puras exportadas y fácilmente comprobables.

## Notas operativas

- **No hay enlace a esta ruta en la interfaz.** No aparece en la barra lateral de `AppShell` ni en el tablero de módulo. Solo se llega escribiendo la URL. Verificado: `grep -rn "/batch/" src` solo devuelve la definición del router.
- Antes de anunciar esta función a usuarios, confirma con el equipo de backend que `{list}/batch/validate` y `{list}/batch/process` existen para los recursos afectados.
- No hay límite de tamaño de archivo en el cliente. Un archivo grande depende del límite del backend y del tiempo de espera del navegador.
- La operación **no es cancelable**: no se usa `AbortController` en ninguna parte del proyecto.
