# Endpoints CPA Plataforma - descripción y payloads de prueba

Documento generado para frontend, QA y pruebas manuales del backend NestJS privado.

> Nota importante: los payloads son ejemplos mínimos de prueba derivados del registry de recursos y del DDL. Los campos `id_*` que sean FK deben existir previamente en la base de datos. Para pruebas iniciales usa el seed demo y crea datos base antes de entidades dependientes.

## Convenciones generales

- Base URL local sugerida: `http://localhost:3000`.
- Prefijo API: `/api`.
- Todos los endpoints privados requieren `X-Session-Token`.
- Los campos de auditoría se gestionan desde backend cuando aplica: `id_usuario_creador`, `id_usuario_modificacion`, `fecha_registro`, `fecha_modificacion`, `version_registro`.
- `GET list` acepta filtros por columnas reales de la tabla y controles: `page`, `limit`, `offset`, `orderBy`, `orderDir`.
- En modo smoke con `SMOKE_DRY_RUN_CRUD_WRITES=true`, los writes devuelven `400` controlado para confirmar que el endpoint fue alcanzado sin contaminar la base.

### Headers comunes

```http
Content-Type: application/json
X-Session-Token: <sessionToken>
```

## Autenticación y salud

### Health check

**Qué hace:** verifica que la API esté levantada.

```http
GET /api/health
```

### Login privado

**Qué hace:** autentica al usuario interno y devuelve `data.sessionToken`.

```http
POST /api/auth/publicAuth/login
```

```json
{
  "email": "admin.demo@cpa.test",
  "password": "DemoAdmin123!"
}
```

### Signup público bloqueado

**Qué hace:** existe por compatibilidad, pero debe responder `403` cuando `ENABLE_PUBLIC_SIGNUP=false`. El sistema es privado; los usuarios se crean por seed o flujo interno autorizado.

```http
POST /api/auth/publicAuth/signup
```

```json
{
  "id_persona": 900001,
  "nombre_usuario": "admin.demo",
  "password": "DemoAdmin123!"
}
```

### Solicitar token de nueva contraseña

**Qué hace:** genera un token de acción para cambio de contraseña si el usuario existe.

```http
POST /api/auth/publicAuth/request-new-password-token
```

```json
{
  "email": "admin.demo@cpa.test"
}
```

### Cambiar contraseña

**Qué hace:** cambia contraseña usando token de confirmación.

```http
POST /api/auth/publicAuth/change-password
```

```json
{
  "email": "admin.demo@cpa.test",
  "token_confirm": "TOKEN_DE_PRUEBA",
  "new_password": "DemoAdmin123!"
}
```

### Activar usuario

**Qué hace:** activa un usuario usando token de confirmación.

```http
POST /api/auth/publicAuth/activate-user
```

```json
{
  "email": "admin.demo@cpa.test",
  "token_confirm": "TOKEN_DE_PRUEBA"
}
```

### Obtener sesión actual

**Qué hace:** devuelve el usuario asociado al `X-Session-Token`.

```http
GET /api/auth/privateAuth/me
POST /api/auth/privateAuth/me
```

### Refrescar sesión

**Qué hace:** valida/refresca la sesión actual y devuelve el usuario autenticado.

```http
POST /api/auth/privateAuth/refresh-session
POST /api/auth/privateAuth/refreshSession
```

### Logout

**Qué hace:** cierra la sesión opaca actual.

```http
POST /api/auth/privateAuth/logout
```

## Módulo `administracion`

Este módulo agrupa endpoints de administración interna, estructura organizacional, empleados, posiciones y métricas de gestión.

### Departamento

**Qué hace:** Gestiona departamentos internos y su jerarquía administrativa.

- Tabla: `administracion.departamento`
- Clave primaria: `id_departamento`
- Permisos: `create=ADMINISTRACION.DEPARTAMENTO.CREATE`, `read=ADMINISTRACION.DEPARTAMENTO.READ`, `update=ADMINISTRACION.DEPARTAMENTO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/administracion/departamento` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/administracion/departamento/:id_departamento` | Obtiene un registro por clave primaria. |
| POST | `/api/administracion/departamento` | Crea un nuevo registro. |
| PUT/PATCH | `/api/administracion/departamento/:id_departamento` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/administracion/departamento?page=1&limit=20&orderBy=id_departamento&orderDir=ASC
```

**Campos relevantes:**

- `id_departamento` (bigint; default)
- `codigo` (character varying(30); obligatorio)
- `nombre` (character varying(120); obligatorio)
- `descripcion_funciones` (character varying(240); opcional)
- `id_departamento_padre` (bigint; opcional, FK `administracion.departamento.id_departamento`)
- `id_sucursal` (bigint; opcional, FK `infraestructura.sucursal.id_sucursal`)
- `id_jefe_empleado` (bigint; opcional, FK `administracion.empleado.id_empleado`)
- `es_activo` (boolean; default)
- `fecha_inicio` (date; opcional)
- `fecha_fin` (date; opcional)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `codigo`, `nombre`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "codigo": "DEMO-001",
  "nombre": "Registro demo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/administracion/departamento/1
```

```json
{
  "codigo": "DEMO-UPDATE",
  "nombre": "Registro demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "departamento procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Empleado

**Qué hace:** Gestiona empleados vinculados a personas registradas en el sistema.

- Tabla: `administracion.empleado`
- Clave primaria: `id_empleado`
- Permisos: `create=ADMINISTRACION.EMPLEADO.CREATE`, `read=ADMINISTRACION.EMPLEADO.READ`, `update=ADMINISTRACION.EMPLEADO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/administracion/empleado` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/administracion/empleado/:id_empleado` | Obtiene un registro por clave primaria. |
| POST | `/api/administracion/empleado` | Crea un nuevo registro. |
| PUT/PATCH | `/api/administracion/empleado/:id_empleado` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/administracion/empleado?page=1&limit=20&orderBy=id_empleado&orderDir=ASC
```

**Campos relevantes:**

- `id_empleado` (bigint; default)
- `id_persona` (bigint; obligatorio, FK `persona.persona.id_persona`)
- `fecha_ingreso` (date; obligatorio)
- `fecha_salida` (date; opcional)
- `tipo_contrato` (administracion.tipo_contrato; default, enum: `INDEFINIDO`, `PLAZO_FIJO`, `HONORARIOS`)
- `jornada` (administracion.jornada_laboral; default, enum: `FULL_TIME`, `PART_TIME`)
- `email_corporativo` (character varying(200); opcional)
- `telefono_corporativo` (character varying(100); opcional)
- `id_sucursal` (bigint; opcional, FK `infraestructura.sucursal.id_sucursal`)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `id_persona`, `fecha_ingreso`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_persona": 900001,
  "fecha_ingreso": "2026-06-20"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/administracion/empleado/1
```

```json
{
  "email_corporativo": "demo@cpa.test",
  "telefono_corporativo": "+59170000000"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "empleado procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Empleado Posicion Pago

**Qué hace:** Gestiona la posición laboral y esquema de pago vigente de empleados.

- Tabla: `administracion.empleado_posicion_pago`
- Clave primaria: `id_empleado_posicion`
- Permisos: `create=ADMINISTRACION.EMPLEADO_POSICION_PAGO.CREATE`, `read=ADMINISTRACION.EMPLEADO_POSICION_PAGO.READ`, `update=ADMINISTRACION.EMPLEADO_POSICION_PAGO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/administracion/empleado-posicion-pago` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/administracion/empleado-posicion-pago/:id_empleado_posicion` | Obtiene un registro por clave primaria. |
| POST | `/api/administracion/empleado-posicion-pago` | Crea un nuevo registro. |
| PUT/PATCH | `/api/administracion/empleado-posicion-pago/:id_empleado_posicion` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/administracion/empleado-posicion-pago?page=1&limit=20&orderBy=id_empleado_posicion&orderDir=ASC
```

**Campos relevantes:**

- `id_empleado_posicion` (bigint; default)
- `id_empleado` (bigint; obligatorio, FK `administracion.empleado.id_empleado`)
- `id_posicion` (bigint; obligatorio, FK `administracion.posicion.id_posicion`)
- `vigente_desde` (date; default)
- `vigente_hasta` (date; opcional)
- `tipo_esquema_pago` (administracion.tipo_esquema_pago; obligatorio, enum: `SUELDO`, `POR_HORA`, `COMISION`, `MIXTO`)
- `frecuencia_pago` (administracion.frecuencia_pago; default, enum: `MENSUAL`, `QUINCENAL`, `SEMANAL`)
- `moneda` (character varying(3); default)
- `pago_por_hora` (numeric(18,2); opcional)
- `sueldo_mensual` (numeric(18,2); opcional)
- `porcentaje_comision` (numeric(5,2); opcional)
- `comision_fija` (numeric(18,2); opcional)
- `tipo_comisionable` (text; opcional)
- `tipo_calculo_comisionable` (text; opcional)
- ... 1 campos adicionales en la tabla.

**Campos obligatorios sin default detectados:** `id_empleado`, `id_posicion`, `tipo_esquema_pago`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_empleado": 1,
  "id_posicion": 1,
  "tipo_esquema_pago": "SUELDO"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/administracion/empleado-posicion-pago/1
```

```json
{
  "moneda": "BOB",
  "tipo_comisionable": "Valor demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "empleado_posicion_pago procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Empleado Registro Pago

**Qué hace:** Registra pagos realizados a empleados.

- Tabla: `administracion.empleado_registro_pago`
- Clave primaria: `id_pago`
- Permisos: `create=ADMINISTRACION.EMPLEADO_REGISTRO_PAGO.CREATE`, `read=ADMINISTRACION.EMPLEADO_REGISTRO_PAGO.READ`, `update=ADMINISTRACION.EMPLEADO_REGISTRO_PAGO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/administracion/empleado-registro-pago` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/administracion/empleado-registro-pago/:id_pago` | Obtiene un registro por clave primaria. |
| POST | `/api/administracion/empleado-registro-pago` | Crea un nuevo registro. |
| PUT/PATCH | `/api/administracion/empleado-registro-pago/:id_pago` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/administracion/empleado-registro-pago?page=1&limit=20&orderBy=id_pago&orderDir=ASC
```

**Campos relevantes:**

- `id_pago` (bigint; default)
- `fecha_pago` (date; obligatorio)
- `haber_basico_pagado` (double precision; default)
- `comisiones_totales_pagadas` (double precision; default)
- `aguinaldos_totales_pagados` (double precision; default)
- `indemnizacion_total_pagada` (double precision; default)
- `otros_cargos_pagados` (double precision; default)
- `descripcion_otros_cargos_pagados` (text; opcional)
- `notas_pago` (text; opcional)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `fecha_pago`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "fecha_pago": "2026-06-20"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/administracion/empleado-registro-pago/1
```

```json
{
  "descripcion_otros_cargos_pagados": "Descripción de prueba actualizada.",
  "notas_pago": "Descripción de prueba actualizada."
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "empleado_registro_pago procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Kpi

**Qué hace:** Gestiona indicadores clave de desempeño.

- Tabla: `administracion.kpi`
- Clave primaria: `id_kpi`
- Permisos: `create=ADMINISTRACION.KPI.CREATE`, `read=ADMINISTRACION.KPI.READ`, `update=ADMINISTRACION.KPI.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/administracion/kpi` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/administracion/kpi/:id_kpi` | Obtiene un registro por clave primaria. |
| POST | `/api/administracion/kpi` | Crea un nuevo registro. |
| PUT/PATCH | `/api/administracion/kpi/:id_kpi` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/administracion/kpi?page=1&limit=20&orderBy=id_kpi&orderDir=ASC
```

**Campos relevantes:**

- `id_kpi` (bigint; default)
- `nombre` (character varying(150); obligatorio)
- `descripcion` (text; opcional)
- `unidad_medida` (character varying(50); obligatorio)
- `frecuencia` (character varying(30); opcional)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `nombre`, `unidad_medida`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "nombre": "Registro demo",
  "unidad_medida": "Valor demo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/administracion/kpi/1
```

```json
{
  "nombre": "Registro demo actualizado",
  "descripcion": "Descripción de prueba actualizada."
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "kpi procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Objetivo Kpi

**Qué hace:** Gestiona objetivos asociados a indicadores KPI.

- Tabla: `administracion.objetivo_kpi`
- Clave primaria: `id_objetivo_kpi`
- Permisos: `create=ADMINISTRACION.OBJETIVO_KPI.CREATE`, `read=ADMINISTRACION.OBJETIVO_KPI.READ`, `update=ADMINISTRACION.OBJETIVO_KPI.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/administracion/objetivo-kpi` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/administracion/objetivo-kpi/:id_objetivo_kpi` | Obtiene un registro por clave primaria. |
| POST | `/api/administracion/objetivo-kpi` | Crea un nuevo registro. |
| PUT/PATCH | `/api/administracion/objetivo-kpi/:id_objetivo_kpi` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/administracion/objetivo-kpi?page=1&limit=20&orderBy=id_objetivo_kpi&orderDir=ASC
```

**Campos relevantes:**

- `id_objetivo_kpi` (bigint; default)
- `id_kpi` (bigint; obligatorio, FK `administracion.kpi.id_kpi`)
- `periodo` (character varying(30); obligatorio)
- `valor_meta` (numeric(18,4); obligatorio)
- `valor_minimo` (numeric(18,4); opcional)
- `valor_maximo` (numeric(18,4); opcional)
- `responsable` (integer; opcional, FK `administracion.empleado.id_empleado`)
- `id_sucursal` (integer; opcional, FK `infraestructura.sucursal.id_sucursal`)
- `id_tienda` (integer; opcional, FK `infraestructura.tienda.id_tienda`)
- `id_producto` (integer; opcional, FK `servicios_educativos.producto_educativo.id_producto_educativo`)
- `id_producto_tienda` (integer; opcional, FK `inventario.bien.id_bien`)
- `cumplido` (boolean; default)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `id_kpi`, `periodo`, `valor_meta`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_kpi": 1,
  "periodo": "Valor demo",
  "valor_meta": 100.0
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/administracion/objetivo-kpi/1
```

```json
{
  "periodo": "Valor demo actualizado",
  "estado_registro": "Activo"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "objetivo_kpi procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Posicion

**Qué hace:** Gestiona cargos o posiciones laborales.

- Tabla: `administracion.posicion`
- Clave primaria: `id_posicion`
- Permisos: `create=ADMINISTRACION.POSICION.CREATE`, `read=ADMINISTRACION.POSICION.READ`, `update=ADMINISTRACION.POSICION.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/administracion/posicion` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/administracion/posicion/:id_posicion` | Obtiene un registro por clave primaria. |
| POST | `/api/administracion/posicion` | Crea un nuevo registro. |
| PUT/PATCH | `/api/administracion/posicion/:id_posicion` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/administracion/posicion?page=1&limit=20&orderBy=id_posicion&orderDir=ASC
```

**Campos relevantes:**

- `id_posicion` (bigint; default)
- `codigo` (character varying(40); obligatorio)
- `nombre` (character varying(150); obligatorio)
- `id_posicion_parent` (bigint; opcional, FK `administracion.posicion.id_posicion`)
- `descripcion` (text; opcional)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `codigo`, `nombre`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "codigo": "DEMO-001",
  "nombre": "Registro demo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/administracion/posicion/1
```

```json
{
  "codigo": "DEMO-UPDATE",
  "nombre": "Registro demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "posicion procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

## Módulo `personas`

Este módulo agrupa endpoints de personas, estudiantes, padres, tutores, proveedores y usuarios.

### Estudiante

**Qué hace:** Gestiona datos académicos de estudiantes.

- Tabla: `persona.persona_estudiante`
- Clave primaria: `id_persona`
- Permisos: `create=PERSONAS.PERSONA_ESTUDIANTE.CREATE`, `read=PERSONAS.PERSONA_ESTUDIANTE.READ`, `update=PERSONAS.PERSONA_ESTUDIANTE.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/personas/estudiante` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/personas/estudiante/:id_persona` | Obtiene un registro por clave primaria. |
| POST | `/api/personas/estudiante` | Crea un nuevo registro. |
| PUT/PATCH | `/api/personas/estudiante/:id_persona` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/personas/estudiante?page=1&limit=20&orderBy=id_persona&orderDir=ASC
```

**Campos relevantes:**

- `id_persona` (bigint; obligatorio, FK `persona.persona.id_persona`)
- `codigo_estudiante` (character varying(50); opcional)
- `id_unidad_educativa` (bigint; opcional, FK `persona.unidad_educativa.id_unidad_educativa`)
- `tipo` (character varying(50); opcional)
- `nivel_actual` (character varying(50); opcional)
- `curso_actual` (character varying(50); opcional)
- `turno_actual` (character varying(50); opcional)
- `carrera` (character varying(100); opcional)
- `anio_ingreso` (smallint; opcional)
- `id_usuario` (bigint; opcional)
- `estado_registro` (boolean; default)

**Campos obligatorios sin default detectados:** `id_persona`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_persona": 900001
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/personas/estudiante/900001
```

```json
{
  "codigo_estudiante": "DEMO-UPDATE",
  "tipo": "Valor demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "persona_estudiante procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Estudiante Padre

**Qué hace:** Gestiona relación entre estudiantes y padres.

- Tabla: `persona.estudiante_padre`
- Clave primaria: `id_asociacion`
- Permisos: `create=PERSONAS.ESTUDIANTE_PADRE.CREATE`, `read=PERSONAS.ESTUDIANTE_PADRE.READ`, `update=PERSONAS.ESTUDIANTE_PADRE.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/personas/estudiante-padre` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/personas/estudiante-padre/:id_asociacion` | Obtiene un registro por clave primaria. |
| POST | `/api/personas/estudiante-padre` | Crea un nuevo registro. |
| PUT/PATCH | `/api/personas/estudiante-padre/:id_asociacion` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/personas/estudiante-padre?page=1&limit=20&orderBy=id_asociacion&orderDir=ASC
```

**Campos relevantes:**

- `id_asociacion` (bigint; default)
- `id_padre` (bigint; obligatorio, FK `persona.persona_padre.id_padre`)
- `id_estudiante` (bigint; obligatorio, FK `persona.persona_estudiante.id_persona`)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `id_padre`, `id_estudiante`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_padre": 1,
  "id_estudiante": 1
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/personas/estudiante-padre/1
```

```json
{
  "estado_registro": "Activo",
  "id_padre": 1
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "estudiante_padre procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Padre

**Qué hace:** Gestiona datos de padres o apoderados.

- Tabla: `persona.persona_padre`
- Clave primaria: `id_padre`
- Permisos: `create=PERSONAS.PERSONA_PADRE.CREATE`, `read=PERSONAS.PERSONA_PADRE.READ`, `update=PERSONAS.PERSONA_PADRE.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/personas/padre` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/personas/padre/:id_padre` | Obtiene un registro por clave primaria. |
| POST | `/api/personas/padre` | Crea un nuevo registro. |
| PUT/PATCH | `/api/personas/padre/:id_padre` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/personas/padre?page=1&limit=20&orderBy=id_padre&orderDir=ASC
```

**Campos relevantes:**

- `id_padre` (bigint; default)
- `es_embajador` (boolean; default)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** ninguno evidente; el payload de prueba usa campos editables recomendados.

**Payload mínimo de prueba para `POST`:**

```json
{
  "es_embajador": true,
  "estado_registro": "Activo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/personas/padre/1
```

```json
{
  "estado_registro": "Activo",
  "es_embajador": true
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "persona_padre procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Proveedor

**Qué hace:** Gestiona proveedores.

- Tabla: `persona.proveedor`
- Clave primaria: `id_proveedor`
- Permisos: `create=PERSONAS.PROVEEDOR.CREATE`, `read=PERSONAS.PROVEEDOR.READ`, `update=PERSONAS.PROVEEDOR.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/personas/proveedor` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/personas/proveedor/:id_proveedor` | Obtiene un registro por clave primaria. |
| POST | `/api/personas/proveedor` | Crea un nuevo registro. |
| PUT/PATCH | `/api/personas/proveedor/:id_proveedor` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/personas/proveedor?page=1&limit=20&orderBy=id_proveedor&orderDir=ASC
```

**Campos relevantes:**

- `id_proveedor` (bigint; default)
- `nombre_proveedor` (character varying(180); obligatorio)
- `categoria` (character varying(100); opcional)
- `telefono` (character varying(100); opcional)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `nombre_proveedor`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "nombre_proveedor": "Registro demo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/personas/proveedor/1
```

```json
{
  "nombre_proveedor": "Registro demo actualizado",
  "categoria": "Valor demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "proveedor procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Tutor

**Qué hace:** Gestiona tutores académicos.

- Tabla: `persona.persona_tutor`
- Clave primaria: `id_tutor`
- Permisos: `create=PERSONAS.PERSONA_TUTOR.CREATE`, `read=PERSONAS.PERSONA_TUTOR.READ`, `update=PERSONAS.PERSONA_TUTOR.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/personas/tutor` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/personas/tutor/:id_tutor` | Obtiene un registro por clave primaria. |
| POST | `/api/personas/tutor` | Crea un nuevo registro. |
| PUT/PATCH | `/api/personas/tutor/:id_tutor` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/personas/tutor?page=1&limit=20&orderBy=id_tutor&orderDir=ASC
```

**Campos relevantes:**

- `id_tutor` (bigint; default)
- `id_persona` (bigint; obligatorio, FK `persona.persona.id_persona`)
- `pago_por_hora` (numeric(12,2); obligatorio)
- `nivel_experiencia` (character varying(20); obligatorio)
- `tipo_estudiante_especialidad` (character varying(20); obligatorio)
- `nivel_estudiante_especialidad` (character varying(20); opcional)
- `id_usuario` (bigint; opcional)
- `estado_registro` (boolean; default)

**Campos obligatorios sin default detectados:** `id_persona`, `pago_por_hora`, `nivel_experiencia`, `tipo_estudiante_especialidad`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_persona": 900001,
  "pago_por_hora": "08:00:00",
  "nivel_experiencia": "Valor demo",
  "tipo_estudiante_especialidad": "Valor demo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/personas/tutor/1
```

```json
{
  "nivel_experiencia": "Valor demo actualizado",
  "tipo_estudiante_especialidad": "Valor demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "persona_tutor procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Unidad Educativa

**Qué hace:** Gestiona unidades educativas de procedencia.

- Tabla: `persona.unidad_educativa`
- Clave primaria: `id_unidad_educativa`
- Permisos: `create=PERSONAS.UNIDAD_EDUCATIVA.CREATE`, `read=PERSONAS.UNIDAD_EDUCATIVA.READ`, `update=PERSONAS.UNIDAD_EDUCATIVA.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/personas/unidad-educativa` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/personas/unidad-educativa/:id_unidad_educativa` | Obtiene un registro por clave primaria. |
| POST | `/api/personas/unidad-educativa` | Crea un nuevo registro. |
| PUT/PATCH | `/api/personas/unidad-educativa/:id_unidad_educativa` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/personas/unidad-educativa?page=1&limit=20&orderBy=id_unidad_educativa&orderDir=ASC
```

**Campos relevantes:**

- `id_unidad_educativa` (bigint; default)
- `nombre` (character varying(150); obligatorio)
- `latitud` (numeric(9,6); opcional)
- `longitud` (numeric(9,6); opcional)
- `categoria` (character varying(20); obligatorio)
- `id_usuario` (bigint; opcional)
- `estado_registro` (boolean; default)

**Campos obligatorios sin default detectados:** `nombre`, `categoria`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "nombre": "Registro demo",
  "categoria": "Valor demo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/personas/unidad-educativa/1
```

```json
{
  "nombre": "Registro demo actualizado",
  "categoria": "Valor demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "unidad_educativa procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Usuario

**Qué hace:** Gestiona usuarios vinculados a personas.

- Tabla: `persona.persona_usuario`
- Clave primaria: `id_persona`
- Permisos: `create=PERSONAS.PERSONA_USUARIO.CREATE`, `read=PERSONAS.PERSONA_USUARIO.READ`, `update=PERSONAS.PERSONA_USUARIO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/personas/usuario` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/personas/usuario/:id_persona` | Obtiene un registro por clave primaria. |
| POST | `/api/personas/usuario` | Crea un nuevo registro. |
| PUT/PATCH | `/api/personas/usuario/:id_persona` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/personas/usuario?page=1&limit=20&orderBy=id_persona&orderDir=ASC
```

**Campos relevantes:**

- `id_persona` (bigint; obligatorio, FK `persona.persona.id_persona`)
- `nombre_usuario` (character varying(80); obligatorio)
- `contrasena_hash` (character varying(255); obligatorio)
- `tipo_usuario` (character varying(200); opcional)
- `estado_registro` (character varying(20); default)
- `es_super_usuario` (boolean; default)

**Campos obligatorios sin default detectados:** `id_persona`, `nombre_usuario`, `contrasena_hash`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_persona": 900001,
  "nombre_usuario": "Registro demo",
  "contrasena_hash": "DemoAdmin123!"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/personas/usuario/900001
```

```json
{
  "nombre_usuario": "Registro demo actualizado",
  "contrasena_hash": "DemoAdmin123!"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "persona_usuario procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

## Módulo `servicios_educativos`

Este módulo agrupa endpoints de productos educativos, cursos, clases, horarios, materias y asistencia.

### Asistencia Clase Curso

**Qué hace:** Registra asistencia en clases de cursos.

- Tabla: `servicios_educativos.asistencia_clase_curso`
- Clave primaria: `id_asistencia`
- Permisos: `create=SERVICIOS_EDUCATIVOS.ASISTENCIA_CLASE_CURSO.CREATE`, `read=SERVICIOS_EDUCATIVOS.ASISTENCIA_CLASE_CURSO.READ`, `update=SERVICIOS_EDUCATIVOS.ASISTENCIA_CLASE_CURSO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/servicios_educativos/asistencia-clase-curso` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/servicios_educativos/asistencia-clase-curso/:id_asistencia` | Obtiene un registro por clave primaria. |
| POST | `/api/servicios_educativos/asistencia-clase-curso` | Crea un nuevo registro. |
| PUT/PATCH | `/api/servicios_educativos/asistencia-clase-curso/:id_asistencia` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/servicios_educativos/asistencia-clase-curso?page=1&limit=20&orderBy=id_asistencia&orderDir=ASC
```

**Campos relevantes:**

- `id_asistencia` (bigint; default)
- `id_clase_curso` (bigint; obligatorio, FK `servicios_educativos.clase_curso.id_clase_curso`)
- `id_estudiante` (bigint; obligatorio, FK `persona.persona_estudiante.id_persona`)
- `estado_asistencia` (character varying(15); obligatorio)
- `hora_marcacion` (timestamp without time zone; opcional)
- `observaciones` (character varying(240); opcional)
- `estado_registro` (boolean; default)
- `id_usuario` (bigint; opcional)

**Campos obligatorios sin default detectados:** `id_clase_curso`, `id_estudiante`, `estado_asistencia`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_clase_curso": 1,
  "id_estudiante": 1,
  "estado_asistencia": "Valor demo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/servicios_educativos/asistencia-clase-curso/1
```

```json
{
  "estado_asistencia": "Valor demo actualizado",
  "observaciones": "Descripción de prueba actualizada."
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "asistencia_clase_curso procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Clase Curso

**Qué hace:** Gestiona clases asociadas a cursos.

- Tabla: `servicios_educativos.clase_curso`
- Clave primaria: `id_clase_curso`
- Permisos: `create=SERVICIOS_EDUCATIVOS.CLASE_CURSO.CREATE`, `read=SERVICIOS_EDUCATIVOS.CLASE_CURSO.READ`, `update=SERVICIOS_EDUCATIVOS.CLASE_CURSO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/servicios_educativos/clase-curso` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/servicios_educativos/clase-curso/:id_clase_curso` | Obtiene un registro por clave primaria. |
| POST | `/api/servicios_educativos/clase-curso` | Crea un nuevo registro. |
| PUT/PATCH | `/api/servicios_educativos/clase-curso/:id_clase_curso` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/servicios_educativos/clase-curso?page=1&limit=20&orderBy=id_clase_curso&orderDir=ASC
```

**Campos relevantes:**

- `id_clase_curso` (bigint; default)
- `id_curso_version` (bigint; obligatorio, FK `servicios_educativos.curso_version.id_curso_version`)
- `id_aula` (bigint; opcional, FK `infraestructura.espacio.id_espacio`)
- `id_tutor` (bigint; opcional, FK `persona.persona_tutor.id_tutor`)
- `fecha` (date; obligatorio)
- `hora_inicio_real` (time without time zone; obligatorio)
- `hora_fin_real` (time without time zone; obligatorio)
- `estado` (character varying(20); default)
- `modalidad` (character varying(30); default)
- `detalle_temas_revisados` (character varying(200); opcional)
- `observaciones` (character varying(300); opcional)
- `motivo_cancelacion` (character varying(200); opcional)
- `estado_registro` (boolean; default)
- `id_usuario` (bigint; opcional)

**Campos obligatorios sin default detectados:** `id_curso_version`, `fecha`, `hora_inicio_real`, `hora_fin_real`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_curso_version": 1,
  "fecha": "2026-06-20",
  "hora_inicio_real": "08:00:00",
  "hora_fin_real": "08:00:00"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/servicios_educativos/clase-curso/1
```

```json
{
  "estado": "Valor demo actualizado",
  "modalidad": "Valor demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "clase_curso procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Clase Por Hora

**Qué hace:** Gestiona clases contratadas o registradas por hora.

- Tabla: `servicios_educativos.clase_por_hora`
- Clave primaria: `id_clase`
- Permisos: `create=SERVICIOS_EDUCATIVOS.CLASE_POR_HORA.CREATE`, `read=SERVICIOS_EDUCATIVOS.CLASE_POR_HORA.READ`, `update=SERVICIOS_EDUCATIVOS.CLASE_POR_HORA.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/servicios_educativos/clase-por-hora` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/servicios_educativos/clase-por-hora/:id_clase` | Obtiene un registro por clave primaria. |
| POST | `/api/servicios_educativos/clase-por-hora` | Crea un nuevo registro. |
| PUT/PATCH | `/api/servicios_educativos/clase-por-hora/:id_clase` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/servicios_educativos/clase-por-hora?page=1&limit=20&orderBy=id_clase&orderDir=ASC
```

**Campos relevantes:**

- `id_clase` (bigint; default)
- `id_aula` (integer; obligatorio, FK `infraestructura.espacio.id_espacio`)
- `id_estudiante` (integer; obligatorio, FK `persona.persona_estudiante.id_persona`)
- `id_tutor` (integer; obligatorio, FK `persona.persona_tutor.id_tutor`)
- `id_materia_tree` (integer; obligatorio, FK `servicios_educativos.materia_tree.id_tree`)
- `hora_llegada` (timestamp without time zone; obligatorio)
- `motivo` (text; obligatorio)
- `modalidad` (text; default)
- `estado_registro` (character varying(20); default)
- `hora_salida` (timestamp with time zone; opcional)
- `estado_operativo` (text; default)

**Campos obligatorios sin default detectados:** `id_aula`, `id_estudiante`, `id_tutor`, `id_materia_tree`, `hora_llegada`, `motivo`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_aula": 1,
  "id_estudiante": 1,
  "id_tutor": 1,
  "id_materia_tree": 1,
  "hora_llegada": "08:00:00",
  "motivo": "Descripción de prueba."
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/servicios_educativos/clase-por-hora/1
```

```json
{
  "motivo": "Descripción de prueba actualizada.",
  "modalidad": "Valor demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "clase_por_hora procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Curso Version

**Qué hace:** Gestiona versiones de cursos.

- Tabla: `servicios_educativos.curso_version`
- Clave primaria: `id_curso_version`
- Permisos: `create=SERVICIOS_EDUCATIVOS.CURSO_VERSION.CREATE`, `read=SERVICIOS_EDUCATIVOS.CURSO_VERSION.READ`, `update=SERVICIOS_EDUCATIVOS.CURSO_VERSION.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/servicios_educativos/curso-version` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/servicios_educativos/curso-version/:id_curso_version` | Obtiene un registro por clave primaria. |
| POST | `/api/servicios_educativos/curso-version` | Crea un nuevo registro. |
| PUT/PATCH | `/api/servicios_educativos/curso-version/:id_curso_version` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/servicios_educativos/curso-version?page=1&limit=20&orderBy=id_curso_version&orderDir=ASC
```

**Campos relevantes:**

- `id_curso_version` (bigint; default)
- `id_producto_educativo` (bigint; obligatorio, FK `servicios_educativos.producto_educativo.id_producto_educativo`)
- `nombre_version` (character varying(150); obligatorio)
- `descripcion_version` (text; opcional)
- `fecha_inicio` (date; opcional)
- `fecha_fin` (date; opcional)
- `precio_version` (numeric(12,2); opcional)
- `id_horario` (integer; opcional, FK `servicios_educativos.horarios.id_horario`)
- `estado_registro` (boolean; default)
- `id_usuario` (bigint; opcional)

**Campos obligatorios sin default detectados:** `id_producto_educativo`, `nombre_version`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_producto_educativo": 1,
  "nombre_version": "Registro demo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/servicios_educativos/curso-version/1
```

```json
{
  "nombre_version": "Registro demo actualizado",
  "descripcion_version": "Descripción de prueba actualizada."
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "curso_version procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Horarios

**Qué hace:** Gestiona horarios académicos.

- Tabla: `servicios_educativos.horarios`
- Clave primaria: `id_horario`
- Permisos: `create=SERVICIOS_EDUCATIVOS.HORARIOS.CREATE`, `read=SERVICIOS_EDUCATIVOS.HORARIOS.READ`, `update=SERVICIOS_EDUCATIVOS.HORARIOS.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/servicios_educativos/horarios` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/servicios_educativos/horarios/:id_horario` | Obtiene un registro por clave primaria. |
| POST | `/api/servicios_educativos/horarios` | Crea un nuevo registro. |
| PUT/PATCH | `/api/servicios_educativos/horarios/:id_horario` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/servicios_educativos/horarios?page=1&limit=20&orderBy=id_horario&orderDir=ASC
```

**Campos relevantes:**

- `id_horario` (bigint; default)
- `repeticion` (text; opcional)
- `hora_inicio_lunes` (time without time zone; opcional)
- `hora_inicio_martes` (time without time zone; opcional)
- `hora_inicio_miercoles` (time without time zone; opcional)
- `hora_inicio_jueves` (time without time zone; opcional)
- `hora_inicio_viernes` (time without time zone; opcional)
- `hora_inicio_sabado` (time without time zone; opcional)
- `hora_fin_lunes` (time without time zone; opcional)
- `hora_fin_martes` (time without time zone; opcional)
- `hora_fin_miercoles` (time without time zone; opcional)
- `hora_fin_jueves` (time without time zone; opcional)
- `hora_fin_viernes` (time without time zone; opcional)
- `hora_fin_sabado` (time without time zone; opcional)
- ... 2 campos adicionales en la tabla.

**Campos obligatorios sin default detectados:** ninguno evidente; el payload de prueba usa campos editables recomendados.

**Payload mínimo de prueba para `POST`:**

```json
{
  "repeticion": "Valor demo",
  "hora_inicio_lunes": "08:00:00"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/servicios_educativos/horarios/1
```

```json
{
  "repeticion": "Valor demo actualizado",
  "hora_inicio_lunes": "08:00:00"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "horarios procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Materia Tree

**Qué hace:** Gestiona jerarquía o árbol de materias.

- Tabla: `servicios_educativos.materia_tree`
- Clave primaria: `id_tree`
- Permisos: `create=SERVICIOS_EDUCATIVOS.MATERIA_TREE.CREATE`, `read=SERVICIOS_EDUCATIVOS.MATERIA_TREE.READ`, `update=SERVICIOS_EDUCATIVOS.MATERIA_TREE.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/servicios_educativos/materia-tree` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/servicios_educativos/materia-tree/:id_tree` | Obtiene un registro por clave primaria. |
| POST | `/api/servicios_educativos/materia-tree` | Crea un nuevo registro. |
| PUT/PATCH | `/api/servicios_educativos/materia-tree/:id_tree` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/servicios_educativos/materia-tree?page=1&limit=20&orderBy=id_tree&orderDir=ASC
```

**Campos relevantes:**

- `id_tree` (bigint; default)
- `nombre` (character varying(100); obligatorio)
- `tema` (character varying(100); obligatorio)
- `subtema` (character varying(100); obligatorio)
- `id_usuario` (bigint; opcional)
- `estado_registro` (boolean; default)

**Campos obligatorios sin default detectados:** `nombre`, `tema`, `subtema`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "nombre": "Registro demo",
  "tema": "Valor demo",
  "subtema": "Valor demo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/servicios_educativos/materia-tree/1
```

```json
{
  "nombre": "Registro demo actualizado",
  "tema": "Valor demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "materia_tree procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Paquetes Producto Educativo

**Qué hace:** Gestiona paquetes de productos educativos.

- Tabla: `servicios_educativos.paquetes_producto_educativo`
- Clave primaria: `id_paquete`
- Permisos: `create=SERVICIOS_EDUCATIVOS.PAQUETES_PRODUCTO_EDUCATIVO.CREATE`, `read=SERVICIOS_EDUCATIVOS.PAQUETES_PRODUCTO_EDUCATIVO.READ`, `update=SERVICIOS_EDUCATIVOS.PAQUETES_PRODUCTO_EDUCATIVO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/servicios_educativos/paquetes-producto-educativo` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/servicios_educativos/paquetes-producto-educativo/:id_paquete` | Obtiene un registro por clave primaria. |
| POST | `/api/servicios_educativos/paquetes-producto-educativo` | Crea un nuevo registro. |
| PUT/PATCH | `/api/servicios_educativos/paquetes-producto-educativo/:id_paquete` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/servicios_educativos/paquetes-producto-educativo?page=1&limit=20&orderBy=id_paquete&orderDir=ASC
```

**Campos relevantes:**

- `id_paquete` (bigint; default)
- `nombre_paquete` (character varying(150); obligatorio)
- `cantidad_horas_paquete` (integer; default)
- `precio_paquete` (numeric(12,2); obligatorio)
- `estado_registro` (boolean; default)
- `id_usuario` (bigint; opcional)

**Campos obligatorios sin default detectados:** `nombre_paquete`, `precio_paquete`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "nombre_paquete": "Registro demo",
  "precio_paquete": 100.0
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/servicios_educativos/paquetes-producto-educativo/1
```

```json
{
  "nombre_paquete": "Registro demo actualizado",
  "cantidad_horas_paquete": "08:00:00"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "paquetes_producto_educativo procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Producto Educativo

**Qué hace:** Gestiona productos educativos.

- Tabla: `servicios_educativos.producto_educativo`
- Clave primaria: `id_producto_educativo`
- Permisos: `create=SERVICIOS_EDUCATIVOS.PRODUCTO_EDUCATIVO.CREATE`, `read=SERVICIOS_EDUCATIVOS.PRODUCTO_EDUCATIVO.READ`, `update=SERVICIOS_EDUCATIVOS.PRODUCTO_EDUCATIVO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/servicios_educativos/producto-educativo` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/servicios_educativos/producto-educativo/:id_producto_educativo` | Obtiene un registro por clave primaria. |
| POST | `/api/servicios_educativos/producto-educativo` | Crea un nuevo registro. |
| PUT/PATCH | `/api/servicios_educativos/producto-educativo/:id_producto_educativo` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/servicios_educativos/producto-educativo?page=1&limit=20&orderBy=id_producto_educativo&orderDir=ASC
```

**Campos relevantes:**

- `id_producto_educativo` (bigint; default)
- `nombre` (character varying(150); obligatorio)
- `descripcion` (text; opcional)
- `tipo_producto` (character varying(50); obligatorio)
- `precio_base` (numeric(12,2); opcional)
- `lim_sup_estudiantes` (integer; default)
- `lim_inf_estudiantes` (integer; default)
- `id_producto_tienda` (integer; opcional, FK `inventario.bien.id_bien`)
- `link_bibliografia` (text; opcional)
- `link_publicidad` (text; opcional)
- `estado_registro` (boolean; default)
- `id_usuario` (bigint; opcional)

**Campos obligatorios sin default detectados:** `nombre`, `tipo_producto`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "nombre": "Registro demo",
  "tipo_producto": "Valor demo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/servicios_educativos/producto-educativo/1
```

```json
{
  "nombre": "Registro demo actualizado",
  "descripcion": "Descripción de prueba actualizada."
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "producto_educativo procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

## Módulo `contabilidad`

Este módulo agrupa endpoints de operación contable, cuentas, centros de costo, pagos, transacciones y movimientos.

### Archivos Transaccion

**Qué hace:** Gestiona archivos asociados a transacciones contables.

- Tabla: `contabilidad.archivos_transaccion`
- Clave primaria: `id_archivo`
- Permisos: `create=CONTABILIDAD.ARCHIVOS_TRANSACCION.CREATE`, `read=CONTABILIDAD.ARCHIVOS_TRANSACCION.READ`, `update=CONTABILIDAD.ARCHIVOS_TRANSACCION.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/contabilidad/archivos-transaccion` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/contabilidad/archivos-transaccion/:id_archivo` | Obtiene un registro por clave primaria. |
| POST | `/api/contabilidad/archivos-transaccion` | Crea un nuevo registro. |
| PUT/PATCH | `/api/contabilidad/archivos-transaccion/:id_archivo` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/contabilidad/archivos-transaccion?page=1&limit=20&orderBy=id_archivo&orderDir=ASC
```

**Campos relevantes:**

- `id_archivo` (bigint; default)
- `id_transaccion` (bigint; obligatorio, FK `contabilidad.transaccion.id_transaccion`)
- `link_achivo` (text; obligatorio)
- `estado_registro` (character varying(20); default)
- `link_archivo` (text; opcional)

**Campos obligatorios sin default detectados:** `id_transaccion`, `link_achivo`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_transaccion": 1,
  "link_achivo": "Valor demo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/contabilidad/archivos-transaccion/1
```

```json
{
  "link_achivo": "Valor demo actualizado",
  "estado_registro": "Activo"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "archivos_transaccion procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Centro Costo

**Qué hace:** Gestiona centros de costo.

- Tabla: `contabilidad.centro_costo`
- Clave primaria: `id_centro_costo`
- Permisos: `create=CONTABILIDAD.CENTRO_COSTO.CREATE`, `read=CONTABILIDAD.CENTRO_COSTO.READ`, `update=CONTABILIDAD.CENTRO_COSTO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/contabilidad/centro-costo` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/contabilidad/centro-costo/:id_centro_costo` | Obtiene un registro por clave primaria. |
| POST | `/api/contabilidad/centro-costo` | Crea un nuevo registro. |
| PUT/PATCH | `/api/contabilidad/centro-costo/:id_centro_costo` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/contabilidad/centro-costo?page=1&limit=20&orderBy=id_centro_costo&orderDir=ASC
```

**Campos relevantes:**

- `id_centro_costo` (bigint; default)
- `codigo` (character varying(40); obligatorio)
- `nombre` (character varying(150); obligatorio)
- `id_cuenta_ingreso` (bigint; opcional, FK `contabilidad.cuenta.id_cuenta`)
- `id_cuenta_costo` (bigint; opcional, FK `contabilidad.cuenta.id_cuenta`)
- `observaciones` (text; opcional)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `codigo`, `nombre`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "codigo": "DEMO-001",
  "nombre": "Registro demo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/contabilidad/centro-costo/1
```

```json
{
  "codigo": "DEMO-UPDATE",
  "nombre": "Registro demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "centro_costo procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Centro Costo Mapa

**Qué hace:** Gestiona mapeos de centros de costo.

- Tabla: `contabilidad.centro_costo_mapa`
- Clave primaria: `id_cc_mapa`
- Permisos: `create=CONTABILIDAD.CENTRO_COSTO_MAPA.CREATE`, `read=CONTABILIDAD.CENTRO_COSTO_MAPA.READ`, `update=CONTABILIDAD.CENTRO_COSTO_MAPA.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/contabilidad/centro-costo-mapa` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/contabilidad/centro-costo-mapa/:id_cc_mapa` | Obtiene un registro por clave primaria. |
| POST | `/api/contabilidad/centro-costo-mapa` | Crea un nuevo registro. |
| PUT/PATCH | `/api/contabilidad/centro-costo-mapa/:id_cc_mapa` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/contabilidad/centro-costo-mapa?page=1&limit=20&orderBy=id_cc_mapa&orderDir=ASC
```

**Campos relevantes:**

- `id_cc_mapa` (bigint; default)
- `id_centro_costo` (bigint; obligatorio, FK `contabilidad.centro_costo.id_centro_costo`)
- `tipo` (contabilidad.tipo_costo; obligatorio, enum: `DIRECTO`, `INDIRECTO`)
- `naturaleza` (contabilidad.naturaleza_costo; obligatorio, enum: `FIJO`, `VARIABLE`)
- `vigente_desde` (date; default)
- `vigente_hasta` (date; opcional)
- `id_deuda` (bigint; opcional, FK `deuda.deuda.id_deuda`)
- `id_bien` (bigint; opcional, FK `inventario.bien.id_bien`)
- `id_sucursal` (bigint; opcional, FK `infraestructura.sucursal.id_sucursal`)
- `id_tienda` (bigint; opcional, FK `infraestructura.tienda.id_tienda`)
- `id_empleado` (bigint; opcional, FK `administracion.empleado.id_empleado`)
- `id_posicion` (bigint; opcional, FK `administracion.posicion.id_posicion`)
- `estado_registro` (character varying(20); default)
- `id_departamento` (bigint; opcional, FK `administracion.departamento.id_departamento`)

**Campos obligatorios sin default detectados:** `id_centro_costo`, `tipo`, `naturaleza`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_centro_costo": 1,
  "tipo": "DIRECTO",
  "naturaleza": "FIJO"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/contabilidad/centro-costo-mapa/1
```

```json
{
  "estado_registro": "Activo",
  "tipo": "DIRECTO"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "centro_costo_mapa procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Concepto Costo

**Qué hace:** Gestiona conceptos de costo.

- Tabla: `contabilidad.concepto_costo`
- Clave primaria: `id_concepto`
- Permisos: `create=CONTABILIDAD.CONCEPTO_COSTO.CREATE`, `read=CONTABILIDAD.CONCEPTO_COSTO.READ`, `update=CONTABILIDAD.CONCEPTO_COSTO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/contabilidad/concepto-costo` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/contabilidad/concepto-costo/:id_concepto` | Obtiene un registro por clave primaria. |
| POST | `/api/contabilidad/concepto-costo` | Crea un nuevo registro. |
| PUT/PATCH | `/api/contabilidad/concepto-costo/:id_concepto` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/contabilidad/concepto-costo?page=1&limit=20&orderBy=id_concepto&orderDir=ASC
```

**Campos relevantes:**

- `id_concepto` (bigint; default)
- `codigo` (character varying(50); obligatorio)
- `nombre` (character varying(160); obligatorio)
- `tipo_concepto` (character varying(15); obligatorio)
- `unidad_medida` (character varying(20); opcional)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `codigo`, `nombre`, `tipo_concepto`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "codigo": "DEMO-001",
  "nombre": "Registro demo",
  "tipo_concepto": "Valor demo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/contabilidad/concepto-costo/1
```

```json
{
  "codigo": "DEMO-UPDATE",
  "nombre": "Registro demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "concepto_costo procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Cuenta

**Qué hace:** Gestiona el catálogo de cuentas contables.

- Tabla: `contabilidad.cuenta`
- Clave primaria: `id_cuenta`
- Permisos: `create=CONTABILIDAD.CUENTA.CREATE`, `read=CONTABILIDAD.CUENTA.READ`, `update=CONTABILIDAD.CUENTA.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/contabilidad/cuenta` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/contabilidad/cuenta/:id_cuenta` | Obtiene un registro por clave primaria. |
| POST | `/api/contabilidad/cuenta` | Crea un nuevo registro. |
| PUT/PATCH | `/api/contabilidad/cuenta/:id_cuenta` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/contabilidad/cuenta?page=1&limit=20&orderBy=id_cuenta&orderDir=ASC
```

**Campos relevantes:**

- `id_cuenta` (bigint; default)
- `codigo` (character varying(40); obligatorio)
- `nombre_cuenta` (character varying(180); obligatorio)
- `id_grupo_cuenta` (bigint; obligatorio, FK `contabilidad.grupo_cuenta.id_grupo_cuenta`)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `codigo`, `nombre_cuenta`, `id_grupo_cuenta`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "codigo": "DEMO-001",
  "nombre_cuenta": "Registro demo",
  "id_grupo_cuenta": 1
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/contabilidad/cuenta/1
```

```json
{
  "codigo": "DEMO-UPDATE",
  "nombre_cuenta": "Registro demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "cuenta procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Cuenta Asignacion

**Qué hace:** Gestiona asignaciones de cuentas contables a entidades internas.

- Tabla: `contabilidad.cuenta_asignacion`
- Clave primaria: `id_cuenta_asignacion`
- Permisos: `create=CONTABILIDAD.CUENTA_ASIGNACION.CREATE`, `read=CONTABILIDAD.CUENTA_ASIGNACION.READ`, `update=CONTABILIDAD.CUENTA_ASIGNACION.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/contabilidad/cuenta-asignacion` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/contabilidad/cuenta-asignacion/:id_cuenta_asignacion` | Obtiene un registro por clave primaria. |
| POST | `/api/contabilidad/cuenta-asignacion` | Crea un nuevo registro. |
| PUT/PATCH | `/api/contabilidad/cuenta-asignacion/:id_cuenta_asignacion` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/contabilidad/cuenta-asignacion?page=1&limit=20&orderBy=id_cuenta_asignacion&orderDir=ASC
```

**Campos relevantes:**

- `id_cuenta_asignacion` (bigint; default)
- `entidad_tipo` (text; obligatorio)
- `id_empleado` (bigint; opcional, FK `administracion.empleado.id_empleado`)
- `id_persona_estudiante` (bigint; opcional, FK `persona.persona_estudiante.id_persona`)
- `id_persona_tutor` (bigint; opcional, FK `persona.persona_tutor.id_tutor`)
- `id_sucursal` (bigint; opcional, FK `infraestructura.sucursal.id_sucursal`)
- `id_edificio` (bigint; opcional, FK `infraestructura.edificio.id_edificio`)
- `id_tienda` (bigint; opcional, FK `infraestructura.tienda.id_tienda`)
- `id_bien` (bigint; opcional, FK `inventario.bien.id_bien`)
- `id_deuda` (bigint; opcional, FK `deuda.deuda.id_deuda`)
- `id_proveedor` (bigint; opcional, FK `persona.proveedor.id_proveedor`)
- `id_departamento` (bigint; opcional, FK `administracion.departamento.id_departamento`)
- `id_cuenta` (bigint; obligatorio, FK `contabilidad.cuenta.id_cuenta`)
- `prioridad` (smallint; default)
- ... 3 campos adicionales en la tabla.

**Campos obligatorios sin default detectados:** `entidad_tipo`, `id_cuenta`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "entidad_tipo": "Valor demo",
  "id_cuenta": 1
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/contabilidad/cuenta-asignacion/1
```

```json
{
  "entidad_tipo": "Valor demo actualizado",
  "estado_registro": "Activo"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "cuenta_asignacion procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Grupo Cuenta

**Qué hace:** Gestiona grupos de cuentas contables.

- Tabla: `contabilidad.grupo_cuenta`
- Clave primaria: `id_grupo_cuenta`
- Permisos: `create=CONTABILIDAD.GRUPO_CUENTA.CREATE`, `read=CONTABILIDAD.GRUPO_CUENTA.READ`, `update=CONTABILIDAD.GRUPO_CUENTA.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/contabilidad/grupo-cuenta` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/contabilidad/grupo-cuenta/:id_grupo_cuenta` | Obtiene un registro por clave primaria. |
| POST | `/api/contabilidad/grupo-cuenta` | Crea un nuevo registro. |
| PUT/PATCH | `/api/contabilidad/grupo-cuenta/:id_grupo_cuenta` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/contabilidad/grupo-cuenta?page=1&limit=20&orderBy=id_grupo_cuenta&orderDir=ASC
```

**Campos relevantes:**

- `id_grupo_cuenta` (bigint; default)
- `codigo` (character varying(30); obligatorio)
- `nombre` (character varying(150); obligatorio)
- `id_parent` (bigint; opcional, FK `contabilidad.grupo_cuenta.id_grupo_cuenta`)
- `tipo` (character varying(15); obligatorio)
- `sub_tipo` (character varying(15); obligatorio)
- `sub_grupo` (character varying(20); opcional)
- `orden_reporte` (smallint; opcional)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `codigo`, `nombre`, `tipo`, `sub_tipo`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "codigo": "DEMO-001",
  "nombre": "Registro demo",
  "tipo": "Valor demo",
  "sub_tipo": "Valor demo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/contabilidad/grupo-cuenta/1
```

```json
{
  "codigo": "DEMO-UPDATE",
  "nombre": "Registro demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "grupo_cuenta procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Pago Tutor

**Qué hace:** Registra pagos generales a tutores.

- Tabla: `contabilidad.pago_tutor`
- Clave primaria: `id_pago_tutor`
- Permisos: `create=CONTABILIDAD.PAGO_TUTOR.CREATE`, `read=CONTABILIDAD.PAGO_TUTOR.READ`, `update=CONTABILIDAD.PAGO_TUTOR.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/contabilidad/pago-tutor` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/contabilidad/pago-tutor/:id_pago_tutor` | Obtiene un registro por clave primaria. |
| POST | `/api/contabilidad/pago-tutor` | Crea un nuevo registro. |
| PUT/PATCH | `/api/contabilidad/pago-tutor/:id_pago_tutor` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/contabilidad/pago-tutor?page=1&limit=20&orderBy=id_pago_tutor&orderDir=ASC
```

**Campos relevantes:**

- `id_pago_tutor` (bigint; default)
- `id_tutor` (bigint; obligatorio, FK `persona.persona_tutor.id_tutor`)
- `periodo_inicio` (timestamp with time zone; obligatorio)
- `periodo_fin` (timestamp with time zone; opcional)
- `estado_pago` (text; default)
- `subtotal` (numeric(12,2); default)
- `ajustes` (numeric(12,2); default)
- `total` (numeric(12,2); default)
- `fecha_aprobacion` (timestamp without time zone; opcional)
- `fecha_pago` (timestamp without time zone; opcional)
- `referencia_pago` (text; opcional)
- `observacion` (text; opcional)
- `estado_registro` (text; default)

**Campos obligatorios sin default detectados:** `id_tutor`, `periodo_inicio`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_tutor": 1,
  "periodo_inicio": "08:00:00"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/contabilidad/pago-tutor/1
```

```json
{
  "estado_pago": "Valor demo actualizado",
  "referencia_pago": "Valor demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "pago_tutor procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Pago Tutor Detalle

**Qué hace:** Registra el detalle de pagos a tutores.

- Tabla: `contabilidad.pago_tutor_detalle`
- Clave primaria: `id_pago_tutor_detalle`
- Permisos: `create=CONTABILIDAD.PAGO_TUTOR_DETALLE.CREATE`, `read=CONTABILIDAD.PAGO_TUTOR_DETALLE.READ`, `update=CONTABILIDAD.PAGO_TUTOR_DETALLE.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/contabilidad/pago-tutor-detalle` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/contabilidad/pago-tutor-detalle/:id_pago_tutor_detalle` | Obtiene un registro por clave primaria. |
| POST | `/api/contabilidad/pago-tutor-detalle` | Crea un nuevo registro. |
| PUT/PATCH | `/api/contabilidad/pago-tutor-detalle/:id_pago_tutor_detalle` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/contabilidad/pago-tutor-detalle?page=1&limit=20&orderBy=id_pago_tutor_detalle&orderDir=ASC
```

**Campos relevantes:**

- `id_pago_tutor_detalle` (bigint; default)
- `id_pago_tutor` (bigint; obligatorio, FK `contabilidad.pago_tutor.id_pago_tutor`)
- `id_clase` (bigint; obligatorio, FK `servicios_educativos.clase_por_hora.id_clase`)
- `horas_pasadas` (integer; obligatorio)
- `tarifa_hora_aplicada` (numeric(12,2); obligatorio)

**Campos obligatorios sin default detectados:** `id_pago_tutor`, `id_clase`, `horas_pasadas`, `tarifa_hora_aplicada`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_pago_tutor": 1,
  "id_clase": 1,
  "horas_pasadas": "08:00:00",
  "tarifa_hora_aplicada": "08:00:00"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/contabilidad/pago-tutor-detalle/1
```

```json
{
  "horas_pasadas": "08:00:00",
  "tarifa_hora_aplicada": "08:00:00"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "pago_tutor_detalle procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Transaccion

**Qué hace:** Gestiona transacciones contables.

- Tabla: `contabilidad.transaccion`
- Clave primaria: `id_transaccion`
- Permisos: `create=CONTABILIDAD.TRANSACCION.CREATE`, `read=CONTABILIDAD.TRANSACCION.READ`, `update=CONTABILIDAD.TRANSACCION.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/contabilidad/transaccion` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/contabilidad/transaccion/:id_transaccion` | Obtiene un registro por clave primaria. |
| POST | `/api/contabilidad/transaccion` | Crea un nuevo registro. |
| PUT/PATCH | `/api/contabilidad/transaccion/:id_transaccion` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/contabilidad/transaccion?page=1&limit=20&orderBy=id_transaccion&orderDir=ASC
```

**Campos relevantes:**

- `id_transaccion` (bigint; default)
- `fecha_transaccion` (date; default)
- `tipo_transaccion` (contabilidad.tipo_transaccion; obligatorio, enum: `GENERAL`, `COSTO`, `VENTA`, `BIEN`, `DEUDA`)
- `sub_tipo_transaccion` (text; opcional)
- `glosa` (character varying(300); opcional)
- `id_centro_costo_mapa` (bigint; opcional, FK `contabilidad.centro_costo_mapa.id_cc_mapa`)
- `id_bien` (bigint; opcional, FK `inventario.bien.id_bien`)
- `id_movimiento_detalle` (bigint; opcional, FK `inventario.movimiento_detalle.id_movimiento`)
- `id_deuda` (bigint; opcional, FK `deuda.deuda.id_deuda`)
- `id_pago_deuda` (bigint; opcional, FK `deuda.pago.id_pago`)
- `id_empleado` (bigint; opcional, FK `administracion.empleado.id_empleado`)
- `id_empleado_pago` (bigint; opcional, FK `administracion.empleado_registro_pago.id_pago`)
- `id_departamento` (bigint; opcional, FK `administracion.departamento.id_departamento`)
- `id_clase_por_hora` (bigint; opcional, FK `servicios_educativos.clase_por_hora.id_clase`)
- ... 10 campos adicionales en la tabla.

**Campos obligatorios sin default detectados:** `tipo_transaccion`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "tipo_transaccion": "GENERAL"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/contabilidad/transaccion/1
```

```json
{
  "sub_tipo_transaccion": "Valor demo actualizado",
  "glosa": "Valor demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "transaccion procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Transaccion Movimiento Cuenta

**Qué hace:** Gestiona movimientos de cuenta asociados a transacciones.

- Tabla: `contabilidad.transaccion_movimiento_cuenta`
- Clave primaria: `id_movimiento`
- Permisos: `create=CONTABILIDAD.TRANSACCION_MOVIMIENTO_CUENTA.CREATE`, `read=CONTABILIDAD.TRANSACCION_MOVIMIENTO_CUENTA.READ`, `update=CONTABILIDAD.TRANSACCION_MOVIMIENTO_CUENTA.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/contabilidad/transaccion-movimiento-cuenta` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/contabilidad/transaccion-movimiento-cuenta/:id_movimiento` | Obtiene un registro por clave primaria. |
| POST | `/api/contabilidad/transaccion-movimiento-cuenta` | Crea un nuevo registro. |
| PUT/PATCH | `/api/contabilidad/transaccion-movimiento-cuenta/:id_movimiento` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/contabilidad/transaccion-movimiento-cuenta?page=1&limit=20&orderBy=id_movimiento&orderDir=ASC
```

**Campos relevantes:**

- `id_movimiento` (bigint; default)
- `id_transaccion` (bigint; obligatorio, FK `contabilidad.transaccion.id_transaccion`)
- `id_cuenta` (bigint; obligatorio, FK `contabilidad.cuenta.id_cuenta`)
- `debe` (double precision; default)
- `haber` (double precision; default)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `id_transaccion`, `id_cuenta`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_transaccion": 1,
  "id_cuenta": 1
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/contabilidad/transaccion-movimiento-cuenta/1
```

```json
{
  "estado_registro": "Activo",
  "debe": 100.0
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "transaccion_movimiento_cuenta procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

## Módulo `deuda`

Este módulo agrupa endpoints de deudas, pagos y seguimiento de obligaciones económicas.

### Deuda

**Qué hace:** Gestiona deudas del sistema.

- Tabla: `deuda.deuda`
- Clave primaria: `id_deuda`
- Permisos: `create=DEUDA.DEUDA.CREATE`, `read=DEUDA.DEUDA.READ`, `update=DEUDA.DEUDA.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/deuda/deuda` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/deuda/deuda/:id_deuda` | Obtiene un registro por clave primaria. |
| POST | `/api/deuda/deuda` | Crea un nuevo registro. |
| PUT/PATCH | `/api/deuda/deuda/:id_deuda` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/deuda/deuda?page=1&limit=20&orderBy=id_deuda&orderDir=ASC
```

**Campos relevantes:**

- `id_deuda` (bigint; default)
- `id_proveedor` (bigint; obligatorio, FK `persona.proveedor.id_proveedor`)
- `monto_inicial` (numeric(18,2); obligatorio)
- `tasa_anual` (numeric(6,4); obligatorio)
- `tipo_tasa` (character varying(20); obligatorio)
- `capitalizacion` (character varying(20); opcional)
- `plazo_meses` (integer; obligatorio)
- `seguro_desgravamen_fijo` (numeric(18,2); opcional)
- `seguro_desgravamen_variable` (numeric(18,2); opcional)
- `tipo_calculo_cuotas` (character varying(10); default)
- `frecuencia_cuotas` (character varying; default)
- `tipo_pago` (character varying(20); default)
- `tipo_primer_pago` (character varying(20); default)
- `anualidad_acordada` (numeric(18,2); opcional)
- ... 2 campos adicionales en la tabla.

**Campos obligatorios sin default detectados:** `id_proveedor`, `monto_inicial`, `tasa_anual`, `tipo_tasa`, `plazo_meses`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_proveedor": 1,
  "monto_inicial": 100.0,
  "tasa_anual": 100.0,
  "tipo_tasa": "Valor demo",
  "plazo_meses": 1
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/deuda/deuda/1
```

```json
{
  "tipo_tasa": "Valor demo actualizado",
  "capitalizacion": "Valor demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "deuda procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Pago

**Qué hace:** Registra pagos asociados a deudas.

- Tabla: `deuda.pago`
- Clave primaria: `id_pago`
- Permisos: `create=DEUDA.PAGO.CREATE`, `read=DEUDA.PAGO.READ`, `update=DEUDA.PAGO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/deuda/pago` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/deuda/pago/:id_pago` | Obtiene un registro por clave primaria. |
| POST | `/api/deuda/pago` | Crea un nuevo registro. |
| PUT/PATCH | `/api/deuda/pago/:id_pago` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/deuda/pago?page=1&limit=20&orderBy=id_pago&orderDir=ASC
```

**Campos relevantes:**

- `id_pago` (bigint; default)
- `id_deuda` (bigint; obligatorio, FK `deuda.deuda.id_deuda`)
- `fecha_pago` (date; default)
- `interes_pagado` (numeric(18,2); default)
- `capital_amortizado` (numeric(18,2); default)
- `seguro_desgravamen_pagado` (numeric(18,2); default)
- `otros_recargos_pagados` (numeric(18,2); default)
- `observaciones` (text; opcional)

**Campos obligatorios sin default detectados:** `id_deuda`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_deuda": 1
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/deuda/pago/1
```

```json
{
  "observaciones": "Descripción de prueba actualizada.",
  "fecha_pago": "2026-06-20"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "pago procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

## Módulo `infraestructura`

Este módulo agrupa endpoints de edificios, espacios físicos, sucursales, tiendas y encargados.

### Edificio

**Qué hace:** Gestiona edificios de la institución.

- Tabla: `infraestructura.edificio`
- Clave primaria: `id_edificio`
- Permisos: `create=INFRAESTRUCTURA.EDIFICIO.CREATE`, `read=INFRAESTRUCTURA.EDIFICIO.READ`, `update=INFRAESTRUCTURA.EDIFICIO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/infraestructura/edificio` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/infraestructura/edificio/:id_edificio` | Obtiene un registro por clave primaria. |
| POST | `/api/infraestructura/edificio` | Crea un nuevo registro. |
| PUT/PATCH | `/api/infraestructura/edificio/:id_edificio` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/infraestructura/edificio?page=1&limit=20&orderBy=id_edificio&orderDir=ASC
```

**Campos relevantes:**

- `id_edificio` (bigint; default)
- `id_sucursal` (bigint; obligatorio, FK `infraestructura.sucursal.id_sucursal`)
- `codigo` (character varying(40); obligatorio)
- `nombre` (character varying(150); obligatorio)
- `direccion_linea1` (character varying(180); opcional)
- `ciudad` (character varying(80); opcional)
- `departamento` (character varying(80); opcional)
- `pais` (character varying(80); opcional)
- `latitud` (numeric(9,6); opcional)
- `longitud` (numeric(9,6); opcional)
- `pisos` (smallint; opcional)
- `largo_m` (double precision; opcional)
- `ancho_m` (double precision; opcional)
- `id_administrador` (bigint; opcional, FK `administracion.empleado.id_empleado`)
- ... 1 campos adicionales en la tabla.

**Campos obligatorios sin default detectados:** `id_sucursal`, `codigo`, `nombre`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_sucursal": 1,
  "codigo": "DEMO-001",
  "nombre": "Registro demo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/infraestructura/edificio/1
```

```json
{
  "codigo": "DEMO-UPDATE",
  "nombre": "Registro demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "edificio procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Encargado

**Qué hace:** Gestiona asignaciones de encargados a infraestructura.

- Tabla: `infraestructura.encargado`
- Clave primaria: `id_asignacion`
- Permisos: `create=INFRAESTRUCTURA.ENCARGADO.CREATE`, `read=INFRAESTRUCTURA.ENCARGADO.READ`, `update=INFRAESTRUCTURA.ENCARGADO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/infraestructura/encargado` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/infraestructura/encargado/:id_asignacion` | Obtiene un registro por clave primaria. |
| POST | `/api/infraestructura/encargado` | Crea un nuevo registro. |
| PUT/PATCH | `/api/infraestructura/encargado/:id_asignacion` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/infraestructura/encargado?page=1&limit=20&orderBy=id_asignacion&orderDir=ASC
```

**Campos relevantes:**

- `id_asignacion` (bigint; default)
- `id_sucursal` (integer; obligatorio, FK `infraestructura.sucursal.id_sucursal`)
- `id_empleado` (integer; obligatorio, FK `administracion.empleado.id_empleado`)
- `fecha_inicio` (date; obligatorio)
- `fecha_fin` (date; opcional)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `id_sucursal`, `id_empleado`, `fecha_inicio`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_sucursal": 1,
  "id_empleado": 1,
  "fecha_inicio": "2026-06-20"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/infraestructura/encargado/1
```

```json
{
  "estado_registro": "Activo",
  "fecha_inicio": "2026-06-20"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "encargado procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Espacio

**Qué hace:** Gestiona aulas, oficinas u otros espacios físicos.

- Tabla: `infraestructura.espacio`
- Clave primaria: `id_espacio`
- Permisos: `create=INFRAESTRUCTURA.ESPACIO.CREATE`, `read=INFRAESTRUCTURA.ESPACIO.READ`, `update=INFRAESTRUCTURA.ESPACIO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/infraestructura/espacio` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/infraestructura/espacio/:id_espacio` | Obtiene un registro por clave primaria. |
| POST | `/api/infraestructura/espacio` | Crea un nuevo registro. |
| PUT/PATCH | `/api/infraestructura/espacio/:id_espacio` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/infraestructura/espacio?page=1&limit=20&orderBy=id_espacio&orderDir=ASC
```

**Campos relevantes:**

- `id_espacio` (bigint; default)
- `id_edificio` (bigint; obligatorio, FK `infraestructura.edificio.id_edificio`)
- `tipo` (infraestructura.tipo_espacio; obligatorio, enum: `AULA`, `SALA`)
- `categoria_sala` (infraestructura.categoria_sala; opcional, enum: `OFICINA`, `CONFERENCIA`, `REUNION`, `ESPERA`, `TIENDA`, `OTRA`)
- `tipo_aula` (infraestructura.tipo_aula; opcional, enum: `TEORIA`, `LABORATORIO`, `COMPUTACION`, `MULTIUSO`)
- `es_privada` (boolean; default)
- `nombre` (character varying(150); opcional)
- `piso` (smallint; opcional)
- `capacidad` (smallint; opcional)
- `largo_m` (double precision; opcional)
- `ancho_m` (double precision; opcional)
- `observaciones` (character varying(240); opcional)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `id_edificio`, `tipo`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_edificio": 1,
  "tipo": "AULA"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/infraestructura/espacio/1
```

```json
{
  "nombre": "Registro demo actualizado",
  "observaciones": "Descripción de prueba actualizada."
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "espacio procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Sucursal

**Qué hace:** Gestiona sucursales.

- Tabla: `infraestructura.sucursal`
- Clave primaria: `id_sucursal`
- Permisos: `create=INFRAESTRUCTURA.SUCURSAL.CREATE`, `read=INFRAESTRUCTURA.SUCURSAL.READ`, `update=INFRAESTRUCTURA.SUCURSAL.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/infraestructura/sucursal` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/infraestructura/sucursal/:id_sucursal` | Obtiene un registro por clave primaria. |
| POST | `/api/infraestructura/sucursal` | Crea un nuevo registro. |
| PUT/PATCH | `/api/infraestructura/sucursal/:id_sucursal` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/infraestructura/sucursal?page=1&limit=20&orderBy=id_sucursal&orderDir=ASC
```

**Campos relevantes:**

- `id_sucursal` (bigint; default)
- `codigo` (character varying(40); obligatorio)
- `nombre` (character varying(150); obligatorio)
- `telefono` (character varying(100); opcional)
- `email` (character varying(200); opcional)
- `direccion_linea1` (character varying(180); opcional)
- `ciudad` (character varying(80); opcional)
- `departamento` (character varying(80); opcional)
- `pais` (character varying(80); opcional)
- `horario_texto` (character varying(240); opcional)
- `largo_m` (double precision; opcional)
- `ancho_m` (double precision; opcional)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `codigo`, `nombre`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "codigo": "DEMO-001",
  "nombre": "Registro demo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/infraestructura/sucursal/1
```

```json
{
  "codigo": "DEMO-UPDATE",
  "nombre": "Registro demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "sucursal procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Tienda

**Qué hace:** Gestiona tiendas o puntos físicos asociados.

- Tabla: `infraestructura.tienda`
- Clave primaria: `id_tienda`
- Permisos: `create=INFRAESTRUCTURA.TIENDA.CREATE`, `read=INFRAESTRUCTURA.TIENDA.READ`, `update=INFRAESTRUCTURA.TIENDA.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/infraestructura/tienda` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/infraestructura/tienda/:id_tienda` | Obtiene un registro por clave primaria. |
| POST | `/api/infraestructura/tienda` | Crea un nuevo registro. |
| PUT/PATCH | `/api/infraestructura/tienda/:id_tienda` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/infraestructura/tienda?page=1&limit=20&orderBy=id_tienda&orderDir=ASC
```

**Campos relevantes:**

- `id_tienda` (bigint; default)
- `id_espacio` (bigint; opcional, FK `infraestructura.espacio.id_espacio`)
- `codigo` (character varying(40); obligatorio)
- `nombre` (character varying(150); obligatorio)
- `horario_texto` (character varying(240); opcional)
- `id_responsable` (bigint; opcional, FK `persona.persona.id_persona`)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `codigo`, `nombre`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "codigo": "DEMO-001",
  "nombre": "Registro demo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/infraestructura/tienda/1
```

```json
{
  "codigo": "DEMO-UPDATE",
  "nombre": "Registro demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "tienda procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

## Módulo `inventario`

Este módulo agrupa endpoints de bienes, lotes, instancias y movimientos de inventario.

### Bien

**Qué hace:** Gestiona bienes de inventario.

- Tabla: `inventario.bien`
- Clave primaria: `id_bien`
- Permisos: `create=INVENTARIO.BIEN.CREATE`, `read=INVENTARIO.BIEN.READ`, `update=INVENTARIO.BIEN.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/inventario/bien` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/inventario/bien/:id_bien` | Obtiene un registro por clave primaria. |
| POST | `/api/inventario/bien` | Crea un nuevo registro. |
| PUT/PATCH | `/api/inventario/bien/:id_bien` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/inventario/bien?page=1&limit=20&orderBy=id_bien&orderDir=ASC
```

**Campos relevantes:**

- `id_bien` (bigint; default)
- `sku` (character varying(60); obligatorio)
- `nombre` (character varying(180); obligatorio)
- `descripcion` (text; opcional)
- `tipo` (inventario.tipo_bien; obligatorio, enum: `MERCADERIA`, `MATERIA_PRIMA`, `SUMINISTRO`, `SERVICIO`, `ACTIVO_FIJO`)
- `categoria` (character varying(100); opcional)
- `subcategoria` (character varying(100); opcional)
- `unidad_compra` (character varying(20); default)
- `unidad_venta` (character varying(20); default)
- `factor_conversion` (numeric(18,6); default)
- `controla_inventario_loteable` (boolean; default)
- `controla_inventario_no_loteable` (boolean; default)
- `metodo_valuacion` (inventario.metodo_valuacion; default, enum: `PEPS`, `UEPS`, `PROM`)
- `costo_referencia` (numeric(18,4); opcional)
- ... 21 campos adicionales en la tabla.

**Campos obligatorios sin default detectados:** `sku`, `nombre`, `tipo`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "sku": "Valor demo",
  "nombre": "Registro demo",
  "tipo": "MERCADERIA"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/inventario/bien/1
```

```json
{
  "nombre": "Registro demo actualizado",
  "descripcion": "Descripción de prueba actualizada."
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "bien procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Bien Instancia

**Qué hace:** Gestiona instancias individuales de bienes.

- Tabla: `inventario.bien_instancia`
- Clave primaria: `id_bien_instancia`
- Permisos: `create=INVENTARIO.BIEN_INSTANCIA.CREATE`, `read=INVENTARIO.BIEN_INSTANCIA.READ`, `update=INVENTARIO.BIEN_INSTANCIA.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/inventario/bien-instancia` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/inventario/bien-instancia/:id_bien_instancia` | Obtiene un registro por clave primaria. |
| POST | `/api/inventario/bien-instancia` | Crea un nuevo registro. |
| PUT/PATCH | `/api/inventario/bien-instancia/:id_bien_instancia` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/inventario/bien-instancia?page=1&limit=20&orderBy=id_bien_instancia&orderDir=ASC
```

**Campos relevantes:**

- `id_bien_instancia` (bigint; default)
- `id_bien` (bigint; obligatorio, FK `inventario.bien.id_bien`)
- `descripcion_especificaciones` (text; obligatorio)
- `fecha_compra` (date; obligatorio)
- `id_proveedor_compra` (integer; opcional, FK `persona.proveedor.id_proveedor`)
- `costo_compra` (numeric(18,4); opcional)
- `precio_compra` (numeric(18,2); opcional)
- `serial_unico` (character varying(120); opcional)
- `fecha_fabricacion` (date; opcional)
- `fecha_vencimiento` (date; opcional)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `id_bien`, `descripcion_especificaciones`, `fecha_compra`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_bien": 1,
  "descripcion_especificaciones": "Descripción de prueba.",
  "fecha_compra": "2026-06-20"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/inventario/bien-instancia/1
```

```json
{
  "descripcion_especificaciones": "Descripción de prueba actualizada.",
  "serial_unico": "Valor demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "bien_instancia procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Bien Lote

**Qué hace:** Gestiona lotes de bienes.

- Tabla: `inventario.bien_lote`
- Clave primaria: `id_lote`
- Permisos: `create=INVENTARIO.BIEN_LOTE.CREATE`, `read=INVENTARIO.BIEN_LOTE.READ`, `update=INVENTARIO.BIEN_LOTE.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/inventario/bien-lote` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/inventario/bien-lote/:id_lote` | Obtiene un registro por clave primaria. |
| POST | `/api/inventario/bien-lote` | Crea un nuevo registro. |
| PUT/PATCH | `/api/inventario/bien-lote/:id_lote` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/inventario/bien-lote?page=1&limit=20&orderBy=id_lote&orderDir=ASC
```

**Campos relevantes:**

- `id_lote` (bigint; default)
- `id_bien` (bigint; obligatorio, FK `inventario.bien.id_bien`)
- `lote_codigo` (character varying(80); obligatorio)
- `fecha_compra` (date; obligatorio)
- `id_proveedor_compra` (integer; opcional, FK `persona.proveedor.id_proveedor`)
- `cantidad_compra` (integer; obligatorio)
- `costo_compra_unitario` (numeric(18,4); opcional)
- `precio_compra_unitario` (numeric(18,2); opcional)
- `fecha_fabricacion` (date; opcional)
- `fecha_vencimiento` (date; opcional)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `id_bien`, `lote_codigo`, `fecha_compra`, `cantidad_compra`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_bien": 1,
  "lote_codigo": "DEMO-001",
  "fecha_compra": "2026-06-20",
  "cantidad_compra": 1
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/inventario/bien-lote/1
```

```json
{
  "lote_codigo": "DEMO-UPDATE",
  "estado_registro": "Activo"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "bien_lote procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Movimiento Detalle

**Qué hace:** Gestiona detalles de movimientos de inventario.

- Tabla: `inventario.movimiento_detalle`
- Clave primaria: `id_movimiento`
- Permisos: `create=INVENTARIO.MOVIMIENTO_DETALLE.CREATE`, `read=INVENTARIO.MOVIMIENTO_DETALLE.READ`, `update=INVENTARIO.MOVIMIENTO_DETALLE.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/inventario/movimiento-detalle` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/inventario/movimiento-detalle/:id_movimiento` | Obtiene un registro por clave primaria. |
| POST | `/api/inventario/movimiento-detalle` | Crea un nuevo registro. |
| PUT/PATCH | `/api/inventario/movimiento-detalle/:id_movimiento` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/inventario/movimiento-detalle?page=1&limit=20&orderBy=id_movimiento&orderDir=ASC
```

**Campos relevantes:**

- `id_movimiento` (bigint; default)
- `id_bien` (bigint; obligatorio, FK `inventario.bien.id_bien`)
- `id_lote` (bigint; opcional, FK `inventario.bien_lote.id_lote`)
- `id_bien_instancia` (bigint; opcional, FK `inventario.bien_instancia.id_bien_instancia`)
- `cantidad` (numeric(18,6); default)
- `id_espacio_entrada` (bigint; opcional)
- `id_espacio_salida` (bigint; opcional)

**Campos obligatorios sin default detectados:** `id_bien`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_bien": 1
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/inventario/movimiento-detalle/1
```

```json
{
  "cantidad": 100.0,
  "id_bien": 1
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "movimiento_detalle procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

## Módulo `societario`

Este módulo agrupa endpoints de títulos, emisiones, tenencias, titulares, dividendos y transferencias.

### Clase Titulo

**Qué hace:** Gestiona clases de títulos societarios.

- Tabla: `societario.clase_titulo`
- Clave primaria: `id_clase_titulo`
- Permisos: `create=SOCIETARIO.CLASE_TITULO.CREATE`, `read=SOCIETARIO.CLASE_TITULO.READ`, `update=SOCIETARIO.CLASE_TITULO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/societario/clase-titulo` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/societario/clase-titulo/:id_clase_titulo` | Obtiene un registro por clave primaria. |
| POST | `/api/societario/clase-titulo` | Crea un nuevo registro. |
| PUT/PATCH | `/api/societario/clase-titulo/:id_clase_titulo` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/societario/clase-titulo?page=1&limit=20&orderBy=id_clase_titulo&orderDir=ASC
```

**Campos relevantes:**

- `id_clase_titulo` (bigint; default)
- `tipo` (societario.tipo_titulo_societario; default, enum: `ACCION`, `CUOTA`, `PARTICIPACION`, `BONO_CONVERTIBLE`, `SAFE`, `WARRANT`, `OPCION`)
- `sub_tipo` (character varying(60); obligatorio)
- `descripcion` (text; opcional)
- `valor_nominal` (numeric(18,6); opcional)
- `derechos_voto_por_titulo` (numeric(18,6); default)
- `prioridad_dividendo_bp` (integer; opcional)
- `pref_liquidacion_x` (numeric(18,6); opcional)
- `es_convertible` (boolean; default)
- `es_participante` (boolean; default)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `sub_tipo`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "sub_tipo": "Valor demo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/societario/clase-titulo/1
```

```json
{
  "descripcion": "Descripción de prueba actualizada.",
  "sub_tipo": "Valor demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "clase_titulo procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Dividendo

**Qué hace:** Gestiona dividendos.

- Tabla: `societario.dividendo`
- Clave primaria: `id_dividendo`
- Permisos: `create=SOCIETARIO.DIVIDENDO.CREATE`, `read=SOCIETARIO.DIVIDENDO.READ`, `update=SOCIETARIO.DIVIDENDO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/societario/dividendo` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/societario/dividendo/:id_dividendo` | Obtiene un registro por clave primaria. |
| POST | `/api/societario/dividendo` | Crea un nuevo registro. |
| PUT/PATCH | `/api/societario/dividendo/:id_dividendo` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/societario/dividendo?page=1&limit=20&orderBy=id_dividendo&orderDir=ASC
```

**Campos relevantes:**

- `id_dividendo` (bigint; default)
- `id_clase_titulo` (bigint; obligatorio, FK `societario.clase_titulo.id_clase_titulo`)
- `fecha_declaracion` (date; obligatorio)
- `fecha_pago` (date; opcional)
- `monto_total` (numeric(18,6); obligatorio)
- `observaciones` (text; opcional)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `id_clase_titulo`, `fecha_declaracion`, `monto_total`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_clase_titulo": 1,
  "fecha_declaracion": "2026-06-20",
  "monto_total": 100.0
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/societario/dividendo/1
```

```json
{
  "observaciones": "Descripción de prueba actualizada.",
  "estado_registro": "Activo"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "dividendo procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Dividendo Pago

**Qué hace:** Gestiona pagos de dividendos.

- Tabla: `societario.dividendo_pago`
- Clave primaria: `id_dividendo_pago`
- Permisos: `create=SOCIETARIO.DIVIDENDO_PAGO.CREATE`, `read=SOCIETARIO.DIVIDENDO_PAGO.READ`, `update=SOCIETARIO.DIVIDENDO_PAGO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/societario/dividendo-pago` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/societario/dividendo-pago/:id_dividendo_pago` | Obtiene un registro por clave primaria. |
| POST | `/api/societario/dividendo-pago` | Crea un nuevo registro. |
| PUT/PATCH | `/api/societario/dividendo-pago/:id_dividendo_pago` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/societario/dividendo-pago?page=1&limit=20&orderBy=id_dividendo_pago&orderDir=ASC
```

**Campos relevantes:**

- `id_dividendo_pago` (bigint; default)
- `id_dividendo` (bigint; obligatorio, FK `societario.dividendo.id_dividendo`)
- `id_titular` (bigint; obligatorio, FK `societario.titular.id_titular`)
- `monto_pagado` (numeric(18,6); obligatorio)
- `fecha_pago_real` (date; opcional)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `id_dividendo`, `id_titular`, `monto_pagado`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_dividendo": 1,
  "id_titular": 1,
  "monto_pagado": 100.0
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/societario/dividendo-pago/1
```

```json
{
  "estado_registro": "Activo",
  "monto_pagado": 100.0
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "dividendo_pago procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Emision Titulo

**Qué hace:** Gestiona emisiones de títulos.

- Tabla: `societario.emision_titulo`
- Clave primaria: `id_emision`
- Permisos: `create=SOCIETARIO.EMISION_TITULO.CREATE`, `read=SOCIETARIO.EMISION_TITULO.READ`, `update=SOCIETARIO.EMISION_TITULO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/societario/emision-titulo` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/societario/emision-titulo/:id_emision` | Obtiene un registro por clave primaria. |
| POST | `/api/societario/emision-titulo` | Crea un nuevo registro. |
| PUT/PATCH | `/api/societario/emision-titulo/:id_emision` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/societario/emision-titulo?page=1&limit=20&orderBy=id_emision&orderDir=ASC
```

**Campos relevantes:**

- `id_emision` (bigint; default)
- `id_clase_titulo` (bigint; obligatorio, FK `societario.clase_titulo.id_clase_titulo`)
- `ronda` (societario.tipo_ronda; default, enum: `FOUNDERS`, `ANGEL`, `SEED`, `A`, `B`, `C`, `D`, `PUENTE`, `OTRA`)
- `instrumento` (societario.instrumento_emision; default, enum: `AUMENTO_CAPITAL`, `CONVERSION`, `PLAN_OPCIONES`, `EMISION_SECUNDARIA`, `OTRO`)
- `serie` (character varying(30); opcional)
- `fecha_emision` (date; obligatorio)
- `cantidad_autorizada` (numeric(28,6); obligatorio)
- `cantidad_emitida` (numeric(28,6); obligatorio)
- `precio_emision` (numeric(18,6); opcional)
- `observaciones` (text; opcional)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `id_clase_titulo`, `fecha_emision`, `cantidad_autorizada`, `cantidad_emitida`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_clase_titulo": 1,
  "fecha_emision": "2026-06-20",
  "cantidad_autorizada": 100.0,
  "cantidad_emitida": 100.0
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/societario/emision-titulo/1
```

```json
{
  "serie": "Valor demo actualizado",
  "observaciones": "Descripción de prueba actualizada."
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "emision_titulo procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Tenencia

**Qué hace:** Gestiona tenencias de títulos.

- Tabla: `societario.tenencia`
- Clave primaria: `id_tenencia`
- Permisos: `create=SOCIETARIO.TENENCIA.CREATE`, `read=SOCIETARIO.TENENCIA.READ`, `update=SOCIETARIO.TENENCIA.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/societario/tenencia` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/societario/tenencia/:id_tenencia` | Obtiene un registro por clave primaria. |
| POST | `/api/societario/tenencia` | Crea un nuevo registro. |
| PUT/PATCH | `/api/societario/tenencia/:id_tenencia` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/societario/tenencia?page=1&limit=20&orderBy=id_tenencia&orderDir=ASC
```

**Campos relevantes:**

- `id_tenencia` (bigint; default)
- `id_emision` (bigint; obligatorio, FK `societario.emision_titulo.id_emision`)
- `id_titular` (bigint; obligatorio, FK `societario.titular.id_titular`)
- `cantidad` (numeric(28,6); obligatorio)
- `fecha_adquisicion` (date; obligatorio)
- `origen` (societario.tipo_origen_tenencia; default, enum: `EMISION`, `TRANSFERENCIA`, `CONVERSION`, `EJERCICIO_OPCION`, `AJUSTE`)
- `es_nominativa` (boolean; default)
- `observaciones` (text; opcional)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `id_emision`, `id_titular`, `cantidad`, `fecha_adquisicion`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_emision": 1,
  "id_titular": 1,
  "cantidad": 100.0,
  "fecha_adquisicion": "2026-06-20"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/societario/tenencia/1
```

```json
{
  "observaciones": "Descripción de prueba actualizada.",
  "estado_registro": "Activo"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "tenencia procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Titular

**Qué hace:** Gestiona titulares societarios.

- Tabla: `societario.titular`
- Clave primaria: `id_titular`
- Permisos: `create=SOCIETARIO.TITULAR.CREATE`, `read=SOCIETARIO.TITULAR.READ`, `update=SOCIETARIO.TITULAR.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/societario/titular` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/societario/titular/:id_titular` | Obtiene un registro por clave primaria. |
| POST | `/api/societario/titular` | Crea un nuevo registro. |
| PUT/PATCH | `/api/societario/titular/:id_titular` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/societario/titular?page=1&limit=20&orderBy=id_titular&orderDir=ASC
```

**Campos relevantes:**

- `id_titular` (bigint; default)
- `id_persona` (bigint; obligatorio, FK `persona.persona.id_persona`)
- `es_beneficial_owner` (boolean; default)
- `observaciones` (text; opcional)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `id_persona`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_persona": 900001
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/societario/titular/1
```

```json
{
  "observaciones": "Descripción de prueba actualizada.",
  "estado_registro": "Activo"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "titular procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Transferencia Titulo

**Qué hace:** Gestiona transferencias de títulos.

- Tabla: `societario.transferencia_titulo`
- Clave primaria: `id_transferencia`
- Permisos: `create=SOCIETARIO.TRANSFERENCIA_TITULO.CREATE`, `read=SOCIETARIO.TRANSFERENCIA_TITULO.READ`, `update=SOCIETARIO.TRANSFERENCIA_TITULO.UPDATE`

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/societario/transferencia-titulo` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/societario/transferencia-titulo/:id_transferencia` | Obtiene un registro por clave primaria. |
| POST | `/api/societario/transferencia-titulo` | Crea un nuevo registro. |
| PUT/PATCH | `/api/societario/transferencia-titulo/:id_transferencia` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/societario/transferencia-titulo?page=1&limit=20&orderBy=id_transferencia&orderDir=ASC
```

**Campos relevantes:**

- `id_transferencia` (bigint; default)
- `id_emision` (bigint; obligatorio, FK `societario.emision_titulo.id_emision`)
- `id_titular_origen` (bigint; obligatorio, FK `societario.titular.id_titular`)
- `id_titular_destino` (bigint; obligatorio, FK `societario.titular.id_titular`)
- `cantidad` (numeric(28,6); obligatorio)
- `precio_unitario` (numeric(18,6); opcional)
- `fecha_transferencia` (date; obligatorio)
- `motivo` (text; opcional)
- `estado_registro` (character varying(20); default)

**Campos obligatorios sin default detectados:** `id_emision`, `id_titular_origen`, `id_titular_destino`, `cantidad`, `fecha_transferencia`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_emision": 1,
  "id_titular_origen": 1,
  "id_titular_destino": 1,
  "cantidad": 100.0,
  "fecha_transferencia": "2026-06-20"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/societario/transferencia-titulo/1
```

```json
{
  "motivo": "Descripción de prueba actualizada.",
  "estado_registro": "Activo"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "transferencia_titulo procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

## Módulo `seguridad`

Este módulo agrupa endpoints de roles, permisos y asignaciones de seguridad del sistema.

### Permiso

**Qué hace:** Gestiona permisos del sistema.

- Tabla: `seguridad.permiso`
- Clave primaria: `id_permiso`
- Permisos: sin permiso explícito heredado en registry.

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/seguridad/permiso` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/seguridad/permiso/:id_permiso` | Obtiene un registro por clave primaria. |
| POST | `/api/seguridad/permiso` | Crea un nuevo registro. |
| PUT/PATCH | `/api/seguridad/permiso/:id_permiso` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/seguridad/permiso?page=1&limit=20&orderBy=id_permiso&orderDir=ASC
```

**Campos relevantes:**

- `id_permiso` (bigint; default)
- `codigo` (text; obligatorio)
- `descripcion` (text; opcional)
- `modulo` (text; opcional)
- `estado_registro` (text; default)

**Campos obligatorios sin default detectados:** `codigo`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "codigo": "DEMO-001"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/seguridad/permiso/1
```

```json
{
  "codigo": "DEMO-UPDATE",
  "descripcion": "Descripción de prueba actualizada."
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "permiso procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Rol

**Qué hace:** Gestiona roles del sistema.

- Tabla: `seguridad.rol`
- Clave primaria: `id_rol`
- Permisos: sin permiso explícito heredado en registry.

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/seguridad/rol` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/seguridad/rol/:id_rol` | Obtiene un registro por clave primaria. |
| POST | `/api/seguridad/rol` | Crea un nuevo registro. |
| PUT/PATCH | `/api/seguridad/rol/:id_rol` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/seguridad/rol?page=1&limit=20&orderBy=id_rol&orderDir=ASC
```

**Campos relevantes:**

- `id_rol` (bigint; default)
- `codigo` (text; obligatorio)
- `nombre` (text; obligatorio)
- `descripcion` (text; opcional)
- `estado_registro` (text; default)

**Campos obligatorios sin default detectados:** `codigo`, `nombre`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "codigo": "DEMO-001",
  "nombre": "Registro demo"
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/seguridad/rol/1
```

```json
{
  "codigo": "DEMO-UPDATE",
  "nombre": "Registro demo actualizado"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "rol procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Rol Permiso

**Qué hace:** Gestiona asignaciones de permisos a roles.

- Tabla: `seguridad.rol_permiso`
- Clave primaria: `id_rol, id_permiso`
- Permisos: sin permiso explícito heredado en registry.

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/seguridad/rol-permiso` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/seguridad/rol-permiso/:id_rol/:id_permiso` | Obtiene un registro por clave primaria. |
| POST | `/api/seguridad/rol-permiso` | Crea un nuevo registro. |
| PUT/PATCH | `/api/seguridad/rol-permiso/:id_rol/:id_permiso` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/seguridad/rol-permiso?page=1&limit=20&orderBy=id_rol&orderDir=ASC
```

**Campos relevantes:**

- `id_rol` (bigint; obligatorio, FK `seguridad.rol.id_rol`)
- `id_permiso` (bigint; obligatorio, FK `seguridad.permiso.id_permiso`)

**Campos obligatorios sin default detectados:** `id_rol`, `id_permiso`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_rol": 1,
  "id_permiso": 1
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/seguridad/rol-permiso/1/1
```

```json
{
  "observacion": "Este recurso no tiene campos editables evidentes aparte de sus claves."
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "rol_permiso procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Usuario Permiso

**Qué hace:** Gestiona permisos asignados directamente a usuarios.

- Tabla: `seguridad.usuario_permiso`
- Clave primaria: `id_persona, id_permiso`
- Permisos: sin permiso explícito heredado en registry.

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/seguridad/usuario-permiso` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/seguridad/usuario-permiso/:id_persona/:id_permiso` | Obtiene un registro por clave primaria. |
| POST | `/api/seguridad/usuario-permiso` | Crea un nuevo registro. |
| PUT/PATCH | `/api/seguridad/usuario-permiso/:id_persona/:id_permiso` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/seguridad/usuario-permiso?page=1&limit=20&orderBy=id_persona&orderDir=ASC
```

**Campos relevantes:**

- `id_persona` (bigint; obligatorio, FK `persona.persona_usuario.id_persona`)
- `id_permiso` (bigint; obligatorio, FK `seguridad.permiso.id_permiso`)
- `permitido` (boolean; default)

**Campos obligatorios sin default detectados:** `id_persona`, `id_permiso`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_persona": 900001,
  "id_permiso": 1
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/seguridad/usuario-permiso/900001/1
```

```json
{
  "permitido": true
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "usuario_permiso procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

### Usuario Rol

**Qué hace:** Gestiona roles asignados a usuarios.

- Tabla: `seguridad.usuario_rol`
- Clave primaria: `id_persona, id_rol`
- Permisos: sin permiso explícito heredado en registry.

**Operaciones:**

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/seguridad/usuario-rol` | Lista registros con paginación, orden y filtros por columnas. |
| GET | `/api/seguridad/usuario-rol/:id_persona/:id_rol` | Obtiene un registro por clave primaria. |
| POST | `/api/seguridad/usuario-rol` | Crea un nuevo registro. |
| PUT/PATCH | `/api/seguridad/usuario-rol/:id_persona/:id_rol` | Actualiza un registro existente. |

**Query params útiles para listar:**

```http
GET /api/seguridad/usuario-rol?page=1&limit=20&orderBy=id_persona&orderDir=ASC
```

**Campos relevantes:**

- `id_persona` (bigint; obligatorio, FK `persona.persona.id_persona`)
- `id_rol` (bigint; obligatorio, FK `seguridad.rol.id_rol`)
- `estado_registro` (text; default)

**Campos obligatorios sin default detectados:** `id_persona`, `id_rol`.

**Payload mínimo de prueba para `POST`:**

```json
{
  "id_persona": 900001,
  "id_rol": 1
}
```

**Ejemplo de `PATCH` / `PUT`:**

```http
PATCH /api/seguridad/usuario-rol/900001/1
```

```json
{
  "estado_registro": "Activo"
}
```

**Respuesta esperada general:**

```json
{
  "success": true,
  "message": "usuario_rol procesado correctamente.",
  "data": {
    "...": "registro devuelto por la base"
  }
}
```

---

## Recomendación para frontend

- No muestres las rutas de API en pantalla al usuario final.
- Usa este documento para construir `crudResources.ts` o `crud-resources.contract.json`.
- Si un payload contiene `id_*`, valida que el registro relacionado exista antes de enviar el formulario.
- Si el backend responde `400` por FK o `NOT NULL`, el formulario debe mostrar un mensaje amigable y no exponer SQL.