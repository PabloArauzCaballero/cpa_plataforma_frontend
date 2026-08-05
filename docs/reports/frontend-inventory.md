# Inventario del frontend

> Fase 2 del Plan Maestro. Fotografía verificable de lo que el usuario puede ver y hacer, en el commit `618e5c3`.

---

## 1. Resumen cuantitativo

| Elemento | Cantidad | Fuente |
|---|---:|---|
| Rutas registradas | 10 | `src/app/router.tsx` |
| Páginas con ruta propia | 9 | ídem (la décima es un `PageState` inline) |
| Páginas sin ruta (compuestas) | 2 | `ResourceListPage.tsx:107-113` |
| Páginas huérfanas | 1 | `QualityGatePage` |
| Módulos de negocio | 9 | `resourceDefinitions.ts` |
| Recursos CRUD | 59 | ídem |
| Recursos ocultos de navegación | 1 | `hideFromNavigation: true` |
| Recursos con formulario compuesto | 3 | `composite: …` |
| Layouts | 1 | `AppShell` |
| Componentes compartidos | 10 familias / 11 componentes | `src/shared/components` |
| Componentes de feature | 11 | `src/features/*/components` |
| Hooks (view models) | 6 | `src/features/*/hooks` |
| Providers / Contexts | 1 | `TutorialProvider` |
| Servicios HTTP | 16 | `src/features/*/services` |
| Utilidades compartidas | 4 | `src/shared/{utils,validation,services}` |
| Líneas TS/TSX | 23 475 | `wc -l` |
| Líneas CSS | 7 007 | `wc -l` |

---

## 2. Inventario de rutas

Ver el detalle completo en [routes/route-catalog.md](../routes/route-catalog.md). Resumen:

| Ruta | Componente | Acceso | Estados de UI implementados |
|---|---|---|---|
| `/login` | `LoginPage` | Pública | carga, error, envío en curso |
| `/` | `HomePage` | Protegida | contenido estático de módulos |
| `/modulos/:module` | `ModuleResourcePickerPage` | Protegida | vacío (módulo inexistente), contenido |
| `/modulos/:module/:resource` | `ResourceListPage` | Protegida | carga, recarga, vacío, error+reintento, éxito, sin permiso |
| `/batch/:module/:resource` | `ResourceBatchPage` | Protegida | carga, validación, error, resultado |
| `/contabilidad/catalogos-cuentas-operativas` | `CatalogosOperativosPage` | Protegida | carga, error, éxito |
| `/contabilidad/archivos` | `FileLibraryPage` | Protegida | carga, vacío, error, subida en curso |
| `/tutoriales` | `TutorialCenterPage` | Protegida | filtros, vacío, progreso |
| `/perfil` | `UserProfilePage` | Protegida | carga, error, contenido |
| `/*` | `PageState` | Protegida | no encontrado |

---

## 3. Inventario de módulos y recursos

Los 59 recursos, tal como los declara `resourceDefinitions.ts`. Todos comparten el mismo motor: `ResourceListPage` + `useResourceListViewModel` + `resourceApi`.

### `administracion` — Administración (7)

| Recurso | Tabla | Clave primaria | Permiso de alta |
|---|---|---|---|
| `departamento` | `administracion.departamento` | `id_departamento` | `ADMINISTRACION.DEPARTAMENTO.CREATE` |
| `empleado` | `administracion.empleado` | `id_empleado` | `ADMINISTRACION.EMPLEADO.CREATE` |
| `empleado-posicion-pago` | `administracion.empleado_posicion_pago` | `id_empleado_posicion` | `ADMINISTRACION.EMPLEADO_POSICION_PAGO.CREATE` |
| `empleado-registro-pago` | `administracion.empleado_registro_pago` | `id_pago` | `ADMINISTRACION.EMPLEADO_REGISTRO_PAGO.CREATE` |
| `kpi` | `administracion.kpi` | `id_kpi` | `ADMINISTRACION.KPI.CREATE` |
| `objetivo-kpi` | `administracion.objetivo_kpi` | `id_objetivo_kpi` | `ADMINISTRACION.OBJETIVO_KPI.CREATE` |
| `posicion` | `administracion.posicion` | `id_posicion` | `ADMINISTRACION.POSICION.CREATE` |

### `personas` — Personas (7)

| Recurso | Tabla | Clave primaria | Nota |
|---|---|---|---|
| `estudiante` | `persona.persona_estudiante` | `id_persona` | Alta transaccional: `POST /api/personas/estudiante/registrar` |
| `estudiante-padre` | `persona.estudiante_padre` | `id_asociacion` | Tabla de asociación |
| `padre` | `persona.persona_padre` | `id_padre` | Alta transaccional: `/registrar` |
| `proveedor` | `persona.proveedor` | `id_proveedor` | — |
| `tutor` | `persona.persona_tutor` | `id_tutor` | Alta transaccional: `/registrar` |
| `unidad-educativa` | `persona.unidad_educativa` | `id_unidad_educativa` | Cientos de filas ⇒ dispara `SearchableSelect` |
| `usuario` | `persona.persona_usuario` | `id_persona` | Alta transaccional. Incluye campo `password` |

**Patrón «registrar»:** estudiante, padre, tutor y usuario crean su *persona base* en la misma operación. Por eso su endpoint de alta es `/registrar` y no el CRUD plano. Documentado en los comentarios de `resourceDefinitions.ts:87-89, 118-119, 144`.

### `servicios_educativos` — Servicios educativos (10)

| Recurso | Tabla | Clave primaria | Nota |
|---|---|---|---|
| `asistencia-clase-curso` | `servicios_educativos.asistencia_clase_curso` | `id_asistencia` | Corrige un registro suelto |
| `asistencia-masiva` | `servicios_educativos.asistencia_clase_curso` | `id_asistencia` | **Compuesto.** Misma tabla; marca el curso entero |
| `clase-curso` | `servicios_educativos.clase_curso` | `id_clase_curso` | Coloreado por hora |
| `clase-por-hora` | `servicios_educativos.clase_por_hora` | `id_clase` | Coloreado por hora |
| `curso-version` | `servicios_educativos.curso_version` | `id_curso_version` | — |
| `horarios` | `servicios_educativos.horarios` | `id_horario` | 12 campos de hora |
| `inscripcion-curso` | `servicios_educativos.inscripcion_curso` | `id_inscripcion` | Origen de la planilla de asistencia |
| `materia-tree` | `servicios_educativos.materia_tree` | `id_tree` | Nombre / tema / subtema |
| `paquetes-producto-educativo` | `servicios_educativos.paquetes_producto_educativo` | `id_paquete` | — |
| `producto-educativo` | `servicios_educativos.producto_educativo` | `id_producto_educativo` | — |

### `contabilidad` — Contabilidad (12)

| Recurso | Tabla | Clave primaria | Nota |
|---|---|---|---|
| `archivos-transaccion` | `contabilidad.archivos_transaccion` | `id_archivo` | Contiene `link_achivo` **y** `link_archivo` (errata del esquema, replicada) |
| `centro-costo` | `contabilidad.centro_costo` | `id_centro_costo` | Validación: cuenta ingreso ≠ cuenta costo |
| `centro-costo-mapa` | `contabilidad.centro_costo_mapa` | `id_cc_mapa` | Validación: entre 1 y 3 entidades asociadas |
| `concepto-costo` | `contabilidad.concepto_costo` | `id_concepto` | — |
| `cuenta` | `contabilidad.cuenta` | `id_cuenta` | — |
| `cuenta-asignacion` | `contabilidad.cuenta_asignacion` | `id_cuenta_asignacion` | Validación por `entidad_tipo` |
| `grupo-cuenta` | `contabilidad.grupo_cuenta` | `id_grupo_cuenta` | Validación de tipo/subtipo/subgrupo contable |
| `pago-tutor` | `contabilidad.pago_tutor` | `id_pago_tutor` | Validación: `total = subtotal + ajustes` |
| `pago-tutor-detalle` | `contabilidad.pago_tutor_detalle` | `id_pago_tutor_detalle` | — |
| `transaccion` | `contabilidad.transaccion` | `id_transaccion` | **Compuesto** con movimientos de cuenta |
| `transaccion-movimiento-cuenta` | `contabilidad.transaccion_movimiento_cuenta` | `id_movimiento` | **Oculto** de navegación |
| `venta-clase` | `contabilidad.venta_clase_batch` | `id_venta_clase` | **Compuesto.** Etiquetado «Parte Clases Pasadas» |

### `deuda` — Deuda (2)

`deuda` (`deuda.deuda`, `id_deuda`) · `pago` (`deuda.pago`, `id_pago`)

### `infraestructura` — Infraestructura (5)

`edificio` · `encargado` · `espacio` · `sucursal` · `tienda`

### `inventario` — Inventario (4)

`bien` · `bien-instancia` · `bien-lote` · `movimiento-detalle`

### `societario` — Societario (7)

`clase-titulo` · `dividendo` · `dividendo-pago` · `emision-titulo` · `tenencia` · `titular` · `transferencia-titulo`

### `seguridad` — Seguridad (5)

| Recurso | Clave primaria | Claves compuestas | Permiso |
|---|---|---|---|
| `permiso` | `id_permiso` | — | *(vacío)* |
| `rol` | `id_rol` | — | *(vacío)* |
| `rol-permiso` | `id_rol` | `id_rol` + `id_permiso` | *(vacío)* |
| `usuario-permiso` | `id_persona` | `id_persona` + `id_permiso` | *(vacío)* |
| `usuario-rol` | `id_persona` | `id_persona` + `id_rol` | *(vacío)* |

> ⚠️ Los 5 recursos del módulo de seguridad tienen `permissions: ""`. Combinado con `userHasAnyPermission(undefined) === true` (`session.ts:155`), **la administración de roles y permisos no está restringida por el frontend en absoluto**. La única barrera es el backend. Registrado como riesgo en [security/threat-model.md](../security/threat-model.md).

---

## 4. Componentes compartidos

| Componente | Ruta | Reutilización real | Ancla de tutorial |
|---|---|---:|---|
| `Button` | `shared/components/Button` | 12 importaciones | no |
| `Card` | `shared/components/Card` | baja | no |
| `ConfirmDialog` | `shared/components/ConfirmDialog` | 3 | no |
| `DataTable` | `shared/components/DataTable` | 1 (`ResourceListPage`) | sí (`resourceTable`, `resourceRowEdit`) |
| `ErrorBoundary` | `shared/components/ErrorBoundary` | 1 (`App`) | no |
| `FormField` | `shared/components/FormField` | 4 | no |
| `SearchableSelect` | `shared/components/FormField` | 1 (dentro de `FormField`) | no |
| `Modal` | `shared/components/Modal` | 3 | sí (`modal`, `modalClose`) |
| `PageState` | `shared/components/PageState` | 9 | no |
| `SearchFilterBar` | `shared/components/SearchFilterBar` | 1 | no |
| `InfoHint` | `shared/components/Tooltip` | dentro de `FormField` | no |

Ficha completa con props, variantes y estados: [components/catalog.md](../components/catalog.md).

## 5. Componentes de feature

| Componente | Feature | Función |
|---|---|---|
| `LoginForm` | auth | Formulario de acceso |
| `ModuleSummary` | dashboard | Tarjeta de módulo en el inicio |
| `CloudinaryUploadField` | resources | Campo de subida de archivos |
| `HelpGuideModal` | resources | Guía operativa por tabla |
| `ResourceExportModal` | resources | Exportación con filtros |
| `ResourceForm` | resources | Formulario CRUD genérico |
| `ResourceHeader` | resources | Cabecera con contadores y lanzador de tutorial |
| `TransactionForm` | resources | Formulario compuesto de transacción |
| `TransactionDraftActions`, `TransactionHeaderFields`, `TransactionMovementEditor`, `TransactionMovementsTable` | resources | Subcomponentes de la transacción |
| `TutorialCard`, `TutorialLauncher` | tutorials | Tarjeta y botón de tutorial |

## 6. Hooks (view models)

| Hook | Estados locales | Qué orquesta |
|---|---:|---|
| `useResourceListViewModel` | 22 `useState` | Listado, filtros, paginación, alta/edición, borrado lógico, exportación, lookups |
| `useResourceFormViewModel` | — | Valores, errores y opciones del formulario CRUD |
| `useTransactionDraftViewModel` | — | Borradores locales y remotos de transacción |
| `useTransactionMovementsViewModel` | — | Movimientos debe/haber |
| `useLoginViewModel` | 4 | Credenciales, envío, error |
| `useUserProfileViewModel` | — | Carga del perfil |

## 7. Servicios HTTP

| Servicio | Métodos | Destino |
|---|---|---|
| `shared/api/httpClient` | `get/post/put/patch/delete/upload` | Base de todos los demás |
| `auth/services/authApi` | POST | `/api/auth/publicAuth/login` |
| `profile/services/profileApi` | GET | `/api/auth/privateAuth/me` |
| `resources/services/resourceApi` | GET/POST/PATCH/upload | 59 recursos + batch |
| `resources/services/lookupApi` | GET | Opciones de campos con `relation` |
| `resources/services/ventaClaseApi` | POST | `/api/contabilidad/venta-clase/registrar-batch` |
| `resources/services/ventaClaseLookupApi` | GET | estudiante, tutor, aula, materia-tree, producto-educativo |
| `resources/services/asistenciaMasivaApi` | GET/POST/PUT | asistencia, clase-curso, inscripcion-curso |
| `resources/services/persistentDraftApi` | GET/POST/PATCH | `/api/administracion/registro-borrador` |
| `resources/services/backendDraftApi` | GET/POST/PATCH | `/api/administracion/registro-borrador` ⚠️ duplicado |
| `catalogs/services/catalogosOperativosApi` | GET/POST/PATCH | cuenta, configuración de cuenta operativa, materia-tree, producto-educativo, unidad-educativa |
| `files/services/fileServerApi` | GET/POST | `/api/contabilidad/archivo`, `/archivo/registrar`, `/archivo-transaccion/registrar` |
| `tutorials/services/tutorialProgressApi` | GET/PUT/DELETE | `/api/onboarding/tutoriales/progreso` |
| `shared/services/cloudinaryUpload` | POST directo | `api.cloudinary.com` (**no pasa por el backend**) |

Detalle contractual: [integrations/backend-api.md](../integrations/backend-api.md).

## 8. Clasificación del inventario

| Categoría | Elementos |
|---|---|
| **Implementado y alcanzable** | 10 rutas, 59 recursos, 2 pantallas compuestas, 11 componentes compartidos, 16 servicios |
| **Implementado pero inalcanzable** | `QualityGatePage` |
| **Implementado y oculto por diseño** | `transaccion-movimiento-cuenta` (accesible por URL, fuera de la navegación) |
| **Duplicado** | `persistentDraftApi` / `backendDraftApi`; `normalizeOption`/`renderFilterInput` en `SearchFilterBar` y `ResourceExportModal` |
| **Obsoleto** | Ninguno marcado como tal en el código |
| **Planificado y no implementado** | Ninguno documentado como tal |

## 9. Método de verificación

| Afirmación | Cómo se verificó |
|---|---|
| Rutas | Lectura íntegra de `src/app/router.tsx` |
| Recursos y módulos | `grep -oE 'key: "…", module: "…"' resourceDefinitions.ts` → 59 coincidencias |
| Páginas huérfanas | `grep -rn "<Nombre>Page" src` |
| Reutilización de componentes | `grep -rhoE "from '@/shared/components/[A-Za-z]+'" src \| sort \| uniq -c` |
| Endpoints | `grep -rnoE "'/api/[^']*'" src` |
| Estados de UI | Lectura de los `return` de cada página |

**No verificado por ejecución en navegador** (limitación L-02 de [baseline.md](baseline.md)): no había backend ni entorno de navegador disponible durante la auditoría.
