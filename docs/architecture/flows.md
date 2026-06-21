# Flujos frontend

## Login

1. Usuario ingresa correo y contraseña.
2. Frontend llama `POST /api/auth/publicAuth/login`.
3. Si la respuesta incluye `data.sessionToken`, se guarda en `localStorage`.
4. El usuario entra al layout administrativo.
5. Cada request posterior envía `X-Session-Token`.

## Consulta de recurso

1. Usuario selecciona módulo y recurso desde el sidebar.
2. La página busca el recurso en `resourceDefinitions`.
3. El ViewModel llama al servicio `listResource`.
4. El servicio usa `httpClient`.
5. La UI renderiza loading, error, vacío o tabla.

## Crear / editar registro

1. Usuario abre formulario.
2. La UI usa campos sugeridos o editor JSON.
3. El ViewModel valida formato mínimo.
4. Se ejecuta `POST` para crear o `PATCH` para editar.
5. Se recarga la lista.

## Batch por Excel/CSV

1. Usuario abre la pantalla de importación del recurso.
2. Selecciona un archivo `.xlsx`, `.xls` o `.csv` con muchos registros.
3. Frontend envía `multipart/form-data` a `POST {endpoint}/batch/validate`.
4. La UI muestra resumen de filas válidas, observadas y con error.
5. Si no hay errores, el usuario procesa el lote.
6. Frontend envía `multipart/form-data` a `POST {endpoint}/batch/process`.
7. La UI muestra el resultado: total, creados, actualizados y errores.

## Transacción con movimientos de cuenta

1. Usuario abre `contabilidad/transaccion`.
2. El formulario muestra datos principales de la transacción.
3. En el mismo modal se agregan movimientos contables Debe/Haber.
4. La UI valida mínimo dos movimientos.
5. La UI valida que total Debe sea igual a total Haber.
6. Frontend envía un solo payload a `POST /api/contabilidad/transaccion` o `PATCH /api/contabilidad/transaccion/:id_transaccion` con el arreglo `movimientos`.
