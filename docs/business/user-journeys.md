# Journeys de usuario

> Verificados por lectura de código y de pruebas. **No verificados por ejecución en navegador** (limitación L-02 de [../reports/baseline.md](../reports/baseline.md)): no había backend ni entorno de navegador durante la auditoría.

## Actor único

Todo el frontend sirve a un solo tipo de usuario: **personal administrativo del CPA**, autenticado. No hay portal de estudiantes, padres ni tutores, aunque esas entidades existan como **datos**.

Dentro de ese actor hay perfiles funcionales que el sistema distingue **solo por permisos del backend**: operación general, contabilidad y servicios educativos. Ver [actors-and-roles.md](actors-and-roles.md).

---

## J-01 · Iniciar sesión

| | |
| --- | --- |
| **Problema de negocio** | Nadie debe ver datos de menores ni contabilidad sin identificarse |
| **Actor** | Cualquier miembro del personal |
| **Entrada** | `/login` |
| **Precondiciones** | Credenciales asignadas por administración; backend accesible |

1. Se abre `/login` (directamente o por redirección de `ProtectedRoute`).
2. Se introducen usuario/correo y contraseña; se puede alternar la visibilidad.
3. `POST /api/auth/publicAuth/login`.
4. La respuesta se mapea con tolerancia a 9 posiciones distintas del token.
5. La sesión se persiste en 5 claves de `localStorage`.
6. Redirección a `/` con `replace: true`.

| Estado | Representación |
| --- | --- |
| Validación local | «Ingresa usuario o correo y contraseña.» |
| Enviando | Botón deshabilitado, spinner, «Validando…» |
| Error | `<p role="alert">` con el mensaje saneado |
| Éxito | Navegación inmediata, sin pantalla de confirmación |

**Sin redirección de retorno:** aunque se intentara abrir `/perfil`, se acaba en `/`.

**Analítica:** ninguna. No se registra ni intento, ni éxito, ni fallo.
**Pruebas:** ninguna.
**🔴 Riesgo abierto:** el formulario precarga credenciales de administrador. Ver [../security/frontend-security.md](../security/frontend-security.md#sec-01).

---

## J-02 · Consultar y filtrar un recurso

| | |
| --- | --- |
| **Problema de negocio** | Encontrar un registro concreto entre 59 tablas de negocio |
| **Actor** | Operador con permiso de lectura |
| **Entrada** | Barra lateral, tablero de módulo, o URL directa |
| **Precondiciones** | Sesión activa |

1. `/modulos/:module/:resource` → `findResourceDefinition`.
2. Carga inicial paginada del servidor (20 filas por defecto).
3. La tabla muestra hasta **14 columnas**, ordenadas por prioridad de identificación (nombre → código → estado → operativo).
4. Al buscar o filtrar: debounce de 900 ms / 800 ms, y **descarga completa del recurso** para filtrar en el navegador.
5. Paginación con selector de 10/20/50/100 filas.

**Datos leídos:** `{resource.endpoints.list}` y, para cada campo con `relation`, sus opciones.

| Estado | Cubierto |
| --- | --- |
| Cargando (primera vez) | ✅ `PageState` |
| Recargando | ✅ «Actualizando resultados...» |
| Vacío | ✅ `PageState` + acción de crear si hay permiso |
| Error | ✅ `PageState` + «Reintentar» |
| Sin permiso | ⚠️ Ausencia del botón, sin mensaje |
| Búsqueda pendiente | ✅ `isSearchPending` |

**⚠️ Comportamiento a conocer:** el filtrado descarga hasta 50 000 registros (250 peticiones). Ver [../performance/rendering.md](../performance/rendering.md).
**Persistencia local:** ninguna. Filtros y página se pierden al navegar o recargar.
**Analítica:** ninguna.
**Pruebas:** solo `resourceMapper` (3 casos).

---

## J-03 · Alta de un registro

| | |
| --- | --- |
| **Problema de negocio** | Incorporar un estudiante, un tutor, una cuenta contable… |
| **Actor** | Operador con permiso `CREATE` |
| **Entrada** | Botón «Crear» en la barra de búsqueda, o acción del estado vacío |

1. Se abre un `Modal` con `ResourceForm` (o `TransactionForm` si el recurso es compuesto).
2. Los campos se generan desde `resourceDefinitions` + `resourceFieldCatalog`.
3. Los campos con `relation` cargan opciones; con más de 12 opciones se usa `SearchableSelect`.
4. Los campos `visibleWhen` aparecen o desaparecen según otro campo.
5. Al enviar: `validateResourcePayload` → si hay errores, se muestran junto a cada campo.
6. Si es válido: `POST {resource.endpoints.create}`.
7. Se cierra el modal, se recarga la lista y se muestra confirmación.

**Reglas de negocio aplicadas:** 15 genéricas + reglas específicas de 7 recursos contables. Ver [../data-and-state/forms-and-validation.md](../data-and-state/forms-and-validation.md).

**Casos especiales:** estudiante, padre, tutor y usuario usan endpoint `/registrar` porque crean la *persona base* en la misma transacción.

**Borradores:** se puede guardar un borrador local (saneado, TTL 7 días) o remoto.
**Prevención de envío duplicado:** `isSaving` deshabilita el botón. Sin clave de idempotencia.
**Analítica:** ninguna.
**Pruebas:** ninguna del flujo; 9 casos del modelo de transacción.

---

## J-04 · Editar un registro

Igual que J-03, con dos diferencias:

1. Si el recurso es `transaccion`, primero se **enriquece** el registro con sus movimientos de cuenta mediante una consulta adicional. Si esa consulta falla, **se abre el formulario sin los movimientos, en silencio** (ver [../architecture/error-boundaries.md](../architecture/error-boundaries.md)).
2. Se envía `PATCH {resource.endpoints.update(id)}`.

Para recursos con `primaryKeys` (los 5 de seguridad), el id se compone uniendo las claves con `/`.

---

## J-05 · Inhabilitar un registro (borrado lógico)

| | |
| --- | --- |
| **Problema de negocio** | Retirar un registro de la operación diaria sin perder su histórico contable |
| **Actor** | Operador con permiso `DELETE` |

1. Icono de papelera en la fila (solo si el registro tiene columna de estado).
2. `ConfirmDialog` con `role="alertdialog"`, que **identifica el registro concreto** («Nombre: Juan Pérez») en lugar de un id.
3. Al confirmar, se envía un `PATCH` que respeta el tipo de la columna: `false` si es booleana, `'Inactivo'` si es texto.
4. Modal compacto de resultado, con icono de éxito o de advertencia.

**No existe borrado físico en ninguna parte del frontend.**

**Estado:** `isSaving` deshabilita el diálogo durante la operación, y `Escape` queda inhabilitado para no cancelar a medias.
**Pruebas:** ninguna.

---

## J-06 · Registrar el parte de clases pasadas

| | |
| --- | --- |
| **Problema de negocio** | Registrar en bloque las clases impartidas, con su cobro, para contabilizarlas |
| **Actor** | Contabilidad |
| **Entrada** | `/modulos/contabilidad/venta-clase` |
| **Precondiciones** | Cuentas operativas configuradas en [J-08](#j-08--configurar-cuentas-operativas) |

La ruta se resuelve a `ResourceListPage`, que detecta `composite: 'venta-clase-batch'` y renderiza `VentaClaseBatchPage` en su lugar.

Campos por línea: fecha, hora de ingreso y salida, estudiante, tutor, motivo (`CLASE`, `RECUPERACION`, `REFORZAMIENTO`, `NIVELACION`, `EXAMEN`, `OTRO`), materia/producto, tema, subtema, y el desglose de cobro en `efectivo`, `qr`, `cxc` y `paquete`, más `situacion_base` (`CLASE_PASADA` u `OBSERVADA`).

**API:** `POST /api/contabilidad/venta-clase/registrar-batch`.
**Lookups:** estudiante, tutor, aula, materia-tree, producto-educativo.
**⚠️ `/api/infraestructura/aula` no corresponde a ningún recurso declarado.** Ver [../integrations/backend-api.md](../integrations/backend-api.md#drift-contractual-detectado).
**Pruebas:** ninguna.

---

## J-07 · Pasar lista de un curso

| | |
| --- | --- |
| **Problema de negocio** | Marcar la asistencia de todo un curso de una vez, en lugar de registro a registro |
| **Actor** | Servicios educativos |
| **Entrada** | `/modulos/servicios_educativos/asistencia-masiva` |
| **Precondiciones** | Existen matrículas en estado `ACTIVA` |

Igual que J-06: `ResourceListPage` detecta `composite: 'asistencia-masiva'` y renderiza `AsistenciaMasivaPage`.

1. Se elige una clase reciente (`GET /clase-curso?limit=100&orderBy=fecha&orderDir=DESC`).
2. Se cargan las matrículas del curso (`GET /inscripcion-curso?...`).
3. Se marca el estado de cada estudiante.
4. Se envían las asistencias (`POST`/`PUT /asistencia-clase-curso`).

> **Regla de negocio explícita:** solo las matrículas en estado `ACTIVA` aparecen en la planilla. Está documentada en el `helpText` del campo `estado` del recurso `inscripcion-curso`.

`asistencia-masiva` y `asistencia-clase-curso` **comparten tabla y endpoints**: la primera marca el curso entero, la segunda corrige un registro suelto.

**Pruebas:** ninguna.

---

## J-08 · Configurar cuentas operativas {#j-08--configurar-cuentas-operativas}

| | |
| --- | --- |
| **Problema de negocio** | Decidir a qué cuenta contable se imputa cada concepto operativo (efectivo, QR, cuentas por cobrar) |
| **Actor** | Contabilidad |
| **Entrada** | `/contabilidad/catalogos-cuentas-operativas` |

Cinco cargas en paralelo, interfaz de pestañas, guardado fila a fila (`POST` o `PATCH` según exista la configuración).

**Dependencia:** J-06 no puede contabilizarse correctamente sin esta configuración.
**⚠️ Si una de las cinco cargas falla, `Promise.all` rechaza y la pantalla entera muestra error.**
**Pruebas:** ninguna.

---

## J-09 · Subir y organizar archivos

| | |
| --- | --- |
| **Problema de negocio** | Adjuntar comprobantes a transacciones y mantener una biblioteca consultable |
| **Actor** | Contabilidad |
| **Entrada** | `/contabilidad/archivos` |

1. El archivo se sube **directamente a Cloudinary desde el navegador**, sin pasar por el backend.
2. Con la URL devuelta, se registra en el backend.
3. Si se indica una transacción, se asocia con tipo `SOPORTE` por defecto.

**⚠️ Sin atomicidad:** si el registro falla tras la subida, el binario queda huérfano en Cloudinary.
**Persistencia local:** las carpetas viven **solo en `localStorage`**, por navegador y usuario.
**Pruebas:** ninguna.

---

## J-10 · Importación masiva por archivo

| | |
| --- | --- |
| **Actor** | Operador |
| **Entrada** | `/batch/:module/:resource` — **solo escribiendo la URL** |

Validar primero (revisión fila a fila), procesar después.

**🔴 Riesgo:** los endpoints `{list}/batch/validate` y `/process` **no están declarados por ningún recurso** y no hay evidencia de que existan en el backend. Ver [../routes/resource-batch.md](../routes/resource-batch.md).
**Pruebas:** ninguna.

---

## J-11 · Seguir un tutorial guiado

| | |
| --- | --- |
| **Problema de negocio** | Reducir la curva de entrada sobre 59 pantallas de trabajo |
| **Actor** | Cualquiera |
| **Entrada** | `/tutoriales`, o el lanzador contextual de la cabecera y de las pantallas de recurso |

El motor resalta elementos reales de la interfaz mediante anclajes `data-*` y sigue el progreso por usuario, con almacenamiento resiliente: si la API falla, sigue funcionando en local.

**Analítica:** 9 tipos de evento, **sin destino remoto**.
**Pruebas:** ✅ **118 casos** — el único journey realmente cubierto.

---

## J-12 · Consultar el propio perfil

| | |
| --- | --- |
| **Problema de negocio** | Responder «¿por qué no veo tal opción?» |
| **Actor** | Cualquiera |
| **Entrada** | Nombre del usuario en la cabecera |

Solo lectura: no permite editar el perfil ni cambiar la contraseña.

**Nota:** los permisos que muestra vienen de `/me`; los que usa `userHasAnyPermission` vienen de `localStorage`. **Pueden diferir.**
**Pruebas:** ninguna.

---

## Cobertura de journeys

| Journey | Documentado | Prueba automatizada |
| --- | :---: | :---: |
| J-01 a J-10, J-12 | ✅ | ❌ |
| J-11 | ✅ | ✅ 118 casos |

**1 de 12 journeys tiene cobertura automatizada.** Matriz completa en [../testing/strategy.md](../testing/strategy.md).
