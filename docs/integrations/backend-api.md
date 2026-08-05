# API del backend

## Configuración de la conexión

| Aspecto | Valor | Origen |
|---|---|---|
| Base URL | `VITE_API_BASE_URL`, sin barra final | `config/env.ts:2` |
| Momento de resolución | **Tiempo de build** | Vite sustituye literalmente |
| Prefijo de rutas | `/api` incluido en cada ruta del código | `resourceDefinitions.ts`, `*Endpoints.ts` |
| Autenticación | Cabecera `X-Session-Token` | `httpClient.ts:75` |
| Formato | JSON. `Accept: application/json` siempre; `Content-Type: application/json` solo si hay cuerpo | `httpClient.ts:84-92` |
| Credenciales de navegador | ❌ **Sin `credentials: 'include'`**. No se envían cookies |
| Tiempo de espera | ❌ Ninguno |
| Reintentos | ❌ Ninguno |
| Cancelación | ❌ Ningún `AbortController` |

> ⚠️ **No hay especificación OpenAPI del backend accesible desde este repositorio.** Todo lo documentado aquí describe el contrato **tal como lo consume el frontend**, no como lo declara el servidor. La verificación de drift es, por tanto, parcial. Limitación L-01 de [reports/baseline.md](../reports/baseline.md).

## Superficie consumida

### 1. Autenticación

| Operación | Método | Ruta |
|---|---|---|
| Iniciar sesión | POST | `/api/auth/publicAuth/login` |
| Perfil de la sesión | GET | `/api/auth/privateAuth/me` |

**No hay endpoint de cierre de sesión.** `logout()` solo borra `localStorage`; la sesión sigue viva en el servidor. Ver [security/session-and-tokens.md](../security/session-and-tokens.md).

Detalle en [authentication.md](authentication.md).

### 2. Recursos CRUD (59 recursos, 9 módulos)

Patrón uniforme declarado en `resourceDefinitions.ts`:

| Operación | Método | Ruta |
|---|---|---|
| Listar | GET | `/api/{modulo}/{recurso}` |
| Detalle | GET | `/api/{modulo}/{recurso}/{id}` |
| Crear | POST | `/api/{modulo}/{recurso}` |
| Actualizar | **PATCH** | `/api/{modulo}/{recurso}/{id}` |

**Nunca se usa DELETE sobre recursos.** El borrado es lógico: un `PATCH` que pone la columna de estado en `false` o `'Inactivo'`.

#### Excepciones al patrón

| Recurso | Endpoint de alta | Motivo |
|---|---|---|
| `personas/estudiante` | `/api/personas/estudiante/registrar` | Crea la persona base en la misma transacción |
| `personas/padre` | `/api/personas/padre/registrar` | Ídem |
| `personas/tutor` | `/api/personas/tutor/registrar` | Ídem |
| `personas/usuario` | `/api/personas/usuario/registrar` | Ídem |
| `contabilidad/venta-clase` | `/api/contabilidad/venta-clase/registrar-batch` | Alta por lote; **también es su ruta de `list`** |

> El recurso `venta-clase` declara `list` y `create` **apuntando al mismo endpoint** `registrar-batch` (`resourceDefinitions.ts:300`). Como la pantalla se sustituye por `VentaClaseBatchPage`, el `list` genérico nunca se ejecuta. Es una definición inconsistente que no llega a producir efecto.

#### Claves compuestas

Los recursos de `seguridad` con `primaryKeys` construyen el id uniendo valores con `/`:

```
/api/seguridad/rol-permiso/{id_rol}/{id_permiso}
```

Cada parte se codifica con `encodeURIComponent` (`useResourceListViewModel.ts:141`).

### 3. Importación por lotes

| Operación | Ruta | Cuerpo |
|---|---|---|
| Validar | `{list}/batch/validate` | multipart |
| Procesar | `{list}/batch/process` | multipart |

**Ningún recurso declara estos endpoints**: se usa siempre la ruta por defecto. Ver [drift](#drift-contractual-detectado).

### 4. Catálogos operativos

| Operación | Método | Ruta |
|---|---|---|
| Listar configuración | GET | `/api/contabilidad/configuracion-cuenta-operativa` |
| Crear configuración | POST | `/api/contabilidad/configuracion-cuenta-operativa` |
| Actualizar configuración | PATCH | `/api/contabilidad/configuracion-cuenta-operativa/{id_configuracion_cuenta}` |

### 5. Archivos

| Operación | Método | Ruta |
|---|---|---|
| Listar | GET | `/api/contabilidad/archivo?{query}` |
| Registrar | POST | `/api/contabilidad/archivo/registrar` |
| Asociar a transacción | POST | `/api/contabilidad/archivo-transaccion/registrar` |

### 6. Borradores

| Operación | Método | Ruta |
|---|---|---|
| Listar / crear / actualizar | GET / POST / PATCH | `/api/administracion/registro-borrador` |

Consumido por **dos** servicios equivalentes: `persistentDraftApi` y `backendDraftApi`.

### 7. Progreso de tutoriales

| Operación | Método | Ruta |
|---|---|---|
| Consultar todo | GET | `/api/onboarding/tutoriales/progreso` |
| Actualizar uno | PUT | `/api/onboarding/tutoriales/progreso/{tutorialId}` |
| Reiniciar uno | DELETE | `/api/onboarding/tutoriales/progreso/{tutorialId}` |
| Reiniciar todos | DELETE | `/api/onboarding/tutoriales/progreso` |

Única familia bajo el prefijo `onboarding`.

### 8. Asistencia masiva

| Operación | Método | Ruta |
|---|---|---|
| Clases recientes | GET | `/api/servicios_educativos/clase-curso?limit=100&orderBy=fecha&orderDir=DESC` |
| Matrículas del curso | GET | `/api/servicios_educativos/inscripcion-curso?{query}` |
| Asistencias | GET/POST/PUT | `/api/servicios_educativos/asistencia-clase-curso` |
| Estudiantes | GET | `/api/personas/estudiante` |

### 9. Lookups de venta de clase

`/api/personas/estudiante` · `/api/personas/tutor` · `/api/infraestructura/aula` · `/api/servicios_educativos/materia-tree` · `/api/servicios_educativos/producto-educativo`

## Tolerancia de parámetros {#tolerancia-de-parámetros}

`appendQuery` envía cada concepto con varios nombres:

| Concepto | Parámetros emitidos |
|---|---|
| Búsqueda | `q`, `search`, `term` |
| Solo activos | `onlyActivos`, `only_activos` |
| Incluir inactivos | `includeInactive`, `include_inactive` |
| Cada filtro | `<clave>` y `filter_<clave>` |

**Ventaja:** el frontend funciona con distintas convenciones del backend sin cambios.
**Coste:** las URLs son largas y **no se puede saber qué parámetro respeta realmente el servidor**. Si el backend ignora todos los de búsqueda, el frontend no lo detecta: simplemente recibe todo y filtra en cliente (lo que explica el fallback local).

## Tolerancia de respuestas

| Mapper | Formas aceptadas |
|---|---|
| `normalizeListResult` | array directo; `rows`/`items`/`results`/`records`/`data`; `data.rows`/`items`/`results`/`records`/`detalle` |
| Paginación | `meta`, `pagination`, `paging`; `limit`/`pageSize`, `offset`, `count`/`total`, `page` |
| `normalizeRecordResponse` | `response.data` o `response` |
| `normalizeBatchValidationResponse` | `rows`/`detalle`/`data`/raíz; estados y totales en español e inglés |
| `buildStoredSessionFromLoginResponse` | 9 posiciones para el token, alias para cada campo del usuario |

Documentado como decisión en [ADR-0007](../adr/ADR-0007-tolerancia-de-contrato.md).

### El riesgo de la tolerancia

```ts
// resourceMapper.ts:42
return { rows: [], meta: response };   // forma no reconocida
```

Una respuesta con estructura inesperada produce **lista vacía**, no error. La interfaz muestra «Sin registros». Un cambio de contrato del backend puede pasar inadvertido y presentarse como «no hay datos».

## Drift contractual detectado {#drift-contractual-detectado}

| # | Hallazgo | Severidad | Verificación |
|---|---|---|---|
| D-01 | `{list}/batch/validate` y `{list}/batch/process` se invocan para los 59 recursos, sin que ningún recurso los declare ni haya evidencia de que existan | **CRITICAL** | `grep -n "batchValidate\|batchProcess" resourceDefinitions.ts` → sin coincidencias |
| D-02 | `/api/infraestructura/aula` se consulta pero **no existe como recurso**; en infraestructura hay `espacio` con `tipo: AULA` | **HIGH** | `ventaClaseLookupApi.ts:190` vs. inventario de 59 recursos |
| D-03 | `/api/contabilidad/archivo-transaccion/registrar` (singular) frente al recurso `archivos-transaccion` (plural) | MEDIUM | `fileServerApi.ts:43` |
| D-04 | El recurso `archivos-transaccion` declara los campos `link_achivo` **y** `link_archivo` — el primero con errata y marcado `required` | MEDIUM | `resourceDefinitions.ts:239` |
| D-05 | `venta-clase` usa el mismo endpoint para `list` y `create` | LOW | `resourceDefinitions.ts:300` |
| D-06 | Los 5 recursos de `seguridad` tienen `permissions: ""` | MEDIUM | `resourceDefinitions.ts:487,494,501,508,515` |

**No se ha modificado nada** para ocultar estas divergencias. Cada una está registrada en [reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md) como propuesta pendiente de verificación con el equipo de backend.

## Modelo de error

Ver [architecture/error-boundaries.md](../architecture/error-boundaries.md#nivel-2--errores-de-red-y-http).

Resumen: `HttpError { message, status, details }`. El mensaje se sanea antes de mostrarse. `401` limpia la sesión. No hay reintentos, timeout ni cancelación.

## Pruebas de contrato

**Ninguna.** No hay pruebas que ejerciten `httpClient` ni ningún servicio. Recomendación en [testing/contract-tests.md](../testing/contract-tests.md).

## Seguridad de los ejemplos

Ningún ejemplo de este documento incluye tokens, contraseñas, datos personales ni hosts internos. La URL de producción vive en `.env.production` y no se reproduce aquí.
