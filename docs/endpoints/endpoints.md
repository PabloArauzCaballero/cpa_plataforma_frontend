# Endpoints migrados a NestJS
## Autenticación privada
El sistema es privado. El usuario inicial de prueba se crea por seed interno, no por endpoint público.
```bash
npm run db:seed:demo
```
El seed toma las credenciales desde `.env`:
```env
TEST_USER_EMAIL=admin.demo@cpa.test
TEST_USER_USERNAME=admin.demo
TEST_USER_PASSWORD=DemoAdmin123!
# También acepta los alias del prompt:
Email=admin.demo@cpa.test
Usuario=admin.demo
Password=DemoAdmin123!
```
Login:
```http
POST /api/auth/publicAuth/login
Content-Type: application/json

{
  "email": "admin.demo@cpa.test",
  "password": "DemoAdmin123!"
}
```
Usa `data.sessionToken` en el header:
```http
X-Session-Token: <sessionToken>
```
`POST /api/auth/publicAuth/signup` existe solo por compatibilidad y queda bloqueado por defecto con `ENABLE_PUBLIC_SIGNUP=false`.
## Smoke test E2E
El smoke test funcional ejecuta seed, hace login con el admin demo y recorre todos los recursos registrados con `GET list`, `GET by id`, `POST`, `PUT` y `PATCH`.
```bash
npm run test:smoke
```
## Matriz de endpoints CRUD
| Método | Ruta | Tabla | PK | Permisos heredados |
|---|---|---|---|---|
| GET | `/api/administracion/departamento` | `administracion.departamento` | `-` | create: ADMINISTRACION.DEPARTAMENTO.CREATE, read: ADMINISTRACION.DEPARTAMENTO.READ, update: ADMINISTRACION.DEPARTAMENTO.UPDATE |
| GET | `/api/administracion/departamento/:id_departamento` | `administracion.departamento` | `id_departamento` | create: ADMINISTRACION.DEPARTAMENTO.CREATE, read: ADMINISTRACION.DEPARTAMENTO.READ, update: ADMINISTRACION.DEPARTAMENTO.UPDATE |
| POST | `/api/administracion/departamento` | `administracion.departamento` | `-` | create: ADMINISTRACION.DEPARTAMENTO.CREATE, read: ADMINISTRACION.DEPARTAMENTO.READ, update: ADMINISTRACION.DEPARTAMENTO.UPDATE |
| PUT/PATCH | `/api/administracion/departamento/:id_departamento` | `administracion.departamento` | `id_departamento` | create: ADMINISTRACION.DEPARTAMENTO.CREATE, read: ADMINISTRACION.DEPARTAMENTO.READ, update: ADMINISTRACION.DEPARTAMENTO.UPDATE |
| GET | `/api/administracion/empleado` | `administracion.empleado` | `-` | create: ADMINISTRACION.EMPLEADO.CREATE, read: ADMINISTRACION.EMPLEADO.READ, update: ADMINISTRACION.EMPLEADO.UPDATE |
| GET | `/api/administracion/empleado/:id_empleado` | `administracion.empleado` | `id_empleado` | create: ADMINISTRACION.EMPLEADO.CREATE, read: ADMINISTRACION.EMPLEADO.READ, update: ADMINISTRACION.EMPLEADO.UPDATE |
| POST | `/api/administracion/empleado` | `administracion.empleado` | `-` | create: ADMINISTRACION.EMPLEADO.CREATE, read: ADMINISTRACION.EMPLEADO.READ, update: ADMINISTRACION.EMPLEADO.UPDATE |
| PUT/PATCH | `/api/administracion/empleado/:id_empleado` | `administracion.empleado` | `id_empleado` | create: ADMINISTRACION.EMPLEADO.CREATE, read: ADMINISTRACION.EMPLEADO.READ, update: ADMINISTRACION.EMPLEADO.UPDATE |
| GET | `/api/administracion/empleado-posicion-pago` | `administracion.empleado_posicion_pago` | `-` | create: ADMINISTRACION.EMPLEADO_POSICION_PAGO.CREATE, read: ADMINISTRACION.EMPLEADO_POSICION_PAGO.READ, update: ADMINISTRACION.EMPLEADO_POSICION_PAGO.UPDATE |
| GET | `/api/administracion/empleado-posicion-pago/:id_empleado_posicion` | `administracion.empleado_posicion_pago` | `id_empleado_posicion` | create: ADMINISTRACION.EMPLEADO_POSICION_PAGO.CREATE, read: ADMINISTRACION.EMPLEADO_POSICION_PAGO.READ, update: ADMINISTRACION.EMPLEADO_POSICION_PAGO.UPDATE |
| POST | `/api/administracion/empleado-posicion-pago` | `administracion.empleado_posicion_pago` | `-` | create: ADMINISTRACION.EMPLEADO_POSICION_PAGO.CREATE, read: ADMINISTRACION.EMPLEADO_POSICION_PAGO.READ, update: ADMINISTRACION.EMPLEADO_POSICION_PAGO.UPDATE |
| PUT/PATCH | `/api/administracion/empleado-posicion-pago/:id_empleado_posicion` | `administracion.empleado_posicion_pago` | `id_empleado_posicion` | create: ADMINISTRACION.EMPLEADO_POSICION_PAGO.CREATE, read: ADMINISTRACION.EMPLEADO_POSICION_PAGO.READ, update: ADMINISTRACION.EMPLEADO_POSICION_PAGO.UPDATE |
| GET | `/api/administracion/empleado-registro-pago` | `administracion.empleado_registro_pago` | `-` | create: ADMINISTRACION.EMPLEADO_REGISTRO_PAGO.CREATE, read: ADMINISTRACION.EMPLEADO_REGISTRO_PAGO.READ, update: ADMINISTRACION.EMPLEADO_REGISTRO_PAGO.UPDATE |
| GET | `/api/administracion/empleado-registro-pago/:id_pago` | `administracion.empleado_registro_pago` | `id_pago` | create: ADMINISTRACION.EMPLEADO_REGISTRO_PAGO.CREATE, read: ADMINISTRACION.EMPLEADO_REGISTRO_PAGO.READ, update: ADMINISTRACION.EMPLEADO_REGISTRO_PAGO.UPDATE |
| POST | `/api/administracion/empleado-registro-pago` | `administracion.empleado_registro_pago` | `-` | create: ADMINISTRACION.EMPLEADO_REGISTRO_PAGO.CREATE, read: ADMINISTRACION.EMPLEADO_REGISTRO_PAGO.READ, update: ADMINISTRACION.EMPLEADO_REGISTRO_PAGO.UPDATE |
| PUT/PATCH | `/api/administracion/empleado-registro-pago/:id_pago` | `administracion.empleado_registro_pago` | `id_pago` | create: ADMINISTRACION.EMPLEADO_REGISTRO_PAGO.CREATE, read: ADMINISTRACION.EMPLEADO_REGISTRO_PAGO.READ, update: ADMINISTRACION.EMPLEADO_REGISTRO_PAGO.UPDATE |
| GET | `/api/administracion/kpi` | `administracion.kpi` | `-` | create: ADMINISTRACION.KPI.CREATE, read: ADMINISTRACION.KPI.READ, update: ADMINISTRACION.KPI.UPDATE |
| GET | `/api/administracion/kpi/:id_kpi` | `administracion.kpi` | `id_kpi` | create: ADMINISTRACION.KPI.CREATE, read: ADMINISTRACION.KPI.READ, update: ADMINISTRACION.KPI.UPDATE |
| POST | `/api/administracion/kpi` | `administracion.kpi` | `-` | create: ADMINISTRACION.KPI.CREATE, read: ADMINISTRACION.KPI.READ, update: ADMINISTRACION.KPI.UPDATE |
| PUT/PATCH | `/api/administracion/kpi/:id_kpi` | `administracion.kpi` | `id_kpi` | create: ADMINISTRACION.KPI.CREATE, read: ADMINISTRACION.KPI.READ, update: ADMINISTRACION.KPI.UPDATE |
| GET | `/api/administracion/objetivo-kpi` | `administracion.objetivo_kpi` | `-` | create: ADMINISTRACION.OBJETIVO_KPI.CREATE, read: ADMINISTRACION.OBJETIVO_KPI.READ, update: ADMINISTRACION.OBJETIVO_KPI.UPDATE |
| GET | `/api/administracion/objetivo-kpi/:id_objetivo_kpi` | `administracion.objetivo_kpi` | `id_objetivo_kpi` | create: ADMINISTRACION.OBJETIVO_KPI.CREATE, read: ADMINISTRACION.OBJETIVO_KPI.READ, update: ADMINISTRACION.OBJETIVO_KPI.UPDATE |
| POST | `/api/administracion/objetivo-kpi` | `administracion.objetivo_kpi` | `-` | create: ADMINISTRACION.OBJETIVO_KPI.CREATE, read: ADMINISTRACION.OBJETIVO_KPI.READ, update: ADMINISTRACION.OBJETIVO_KPI.UPDATE |
| PUT/PATCH | `/api/administracion/objetivo-kpi/:id_objetivo_kpi` | `administracion.objetivo_kpi` | `id_objetivo_kpi` | create: ADMINISTRACION.OBJETIVO_KPI.CREATE, read: ADMINISTRACION.OBJETIVO_KPI.READ, update: ADMINISTRACION.OBJETIVO_KPI.UPDATE |
| GET | `/api/administracion/posicion` | `administracion.posicion` | `-` | create: ADMINISTRACION.POSICION.CREATE, read: ADMINISTRACION.POSICION.READ, update: ADMINISTRACION.POSICION.UPDATE |
| GET | `/api/administracion/posicion/:id_posicion` | `administracion.posicion` | `id_posicion` | create: ADMINISTRACION.POSICION.CREATE, read: ADMINISTRACION.POSICION.READ, update: ADMINISTRACION.POSICION.UPDATE |
| POST | `/api/administracion/posicion` | `administracion.posicion` | `-` | create: ADMINISTRACION.POSICION.CREATE, read: ADMINISTRACION.POSICION.READ, update: ADMINISTRACION.POSICION.UPDATE |
| PUT/PATCH | `/api/administracion/posicion/:id_posicion` | `administracion.posicion` | `id_posicion` | create: ADMINISTRACION.POSICION.CREATE, read: ADMINISTRACION.POSICION.READ, update: ADMINISTRACION.POSICION.UPDATE |
| GET | `/api/contabilidad/archivos-transaccion` | `contabilidad.archivos_transaccion` | `-` | create: CONTABILIDAD.ARCHIVOS_TRANSACCION.CREATE, read: CONTABILIDAD.ARCHIVOS_TRANSACCION.READ, update: CONTABILIDAD.ARCHIVOS_TRANSACCION.UPDATE |
| GET | `/api/contabilidad/archivos-transaccion/:id_archivo` | `contabilidad.archivos_transaccion` | `id_archivo` | create: CONTABILIDAD.ARCHIVOS_TRANSACCION.CREATE, read: CONTABILIDAD.ARCHIVOS_TRANSACCION.READ, update: CONTABILIDAD.ARCHIVOS_TRANSACCION.UPDATE |
| POST | `/api/contabilidad/archivos-transaccion` | `contabilidad.archivos_transaccion` | `-` | create: CONTABILIDAD.ARCHIVOS_TRANSACCION.CREATE, read: CONTABILIDAD.ARCHIVOS_TRANSACCION.READ, update: CONTABILIDAD.ARCHIVOS_TRANSACCION.UPDATE |
| PUT/PATCH | `/api/contabilidad/archivos-transaccion/:id_archivo` | `contabilidad.archivos_transaccion` | `id_archivo` | create: CONTABILIDAD.ARCHIVOS_TRANSACCION.CREATE, read: CONTABILIDAD.ARCHIVOS_TRANSACCION.READ, update: CONTABILIDAD.ARCHIVOS_TRANSACCION.UPDATE |
| GET | `/api/contabilidad/centro-costo` | `contabilidad.centro_costo` | `-` | create: CONTABILIDAD.CENTRO_COSTO.CREATE, read: CONTABILIDAD.CENTRO_COSTO.READ, update: CONTABILIDAD.CENTRO_COSTO.UPDATE |
| GET | `/api/contabilidad/centro-costo/:id_centro_costo` | `contabilidad.centro_costo` | `id_centro_costo` | create: CONTABILIDAD.CENTRO_COSTO.CREATE, read: CONTABILIDAD.CENTRO_COSTO.READ, update: CONTABILIDAD.CENTRO_COSTO.UPDATE |
| POST | `/api/contabilidad/centro-costo` | `contabilidad.centro_costo` | `-` | create: CONTABILIDAD.CENTRO_COSTO.CREATE, read: CONTABILIDAD.CENTRO_COSTO.READ, update: CONTABILIDAD.CENTRO_COSTO.UPDATE |
| PUT/PATCH | `/api/contabilidad/centro-costo/:id_centro_costo` | `contabilidad.centro_costo` | `id_centro_costo` | create: CONTABILIDAD.CENTRO_COSTO.CREATE, read: CONTABILIDAD.CENTRO_COSTO.READ, update: CONTABILIDAD.CENTRO_COSTO.UPDATE |
| GET | `/api/contabilidad/centro-costo-mapa` | `contabilidad.centro_costo_mapa` | `-` | create: CONTABILIDAD.CENTRO_COSTO_MAPA.CREATE, read: CONTABILIDAD.CENTRO_COSTO_MAPA.READ, update: CONTABILIDAD.CENTRO_COSTO_MAPA.UPDATE |
| GET | `/api/contabilidad/centro-costo-mapa/:id_cc_mapa` | `contabilidad.centro_costo_mapa` | `id_cc_mapa` | create: CONTABILIDAD.CENTRO_COSTO_MAPA.CREATE, read: CONTABILIDAD.CENTRO_COSTO_MAPA.READ, update: CONTABILIDAD.CENTRO_COSTO_MAPA.UPDATE |
| POST | `/api/contabilidad/centro-costo-mapa` | `contabilidad.centro_costo_mapa` | `-` | create: CONTABILIDAD.CENTRO_COSTO_MAPA.CREATE, read: CONTABILIDAD.CENTRO_COSTO_MAPA.READ, update: CONTABILIDAD.CENTRO_COSTO_MAPA.UPDATE |
| PUT/PATCH | `/api/contabilidad/centro-costo-mapa/:id_cc_mapa` | `contabilidad.centro_costo_mapa` | `id_cc_mapa` | create: CONTABILIDAD.CENTRO_COSTO_MAPA.CREATE, read: CONTABILIDAD.CENTRO_COSTO_MAPA.READ, update: CONTABILIDAD.CENTRO_COSTO_MAPA.UPDATE |
| GET | `/api/contabilidad/concepto-costo` | `contabilidad.concepto_costo` | `-` | create: CONTABILIDAD.CONCEPTO_COSTO.CREATE, read: CONTABILIDAD.CONCEPTO_COSTO.READ, update: CONTABILIDAD.CONCEPTO_COSTO.UPDATE |
| GET | `/api/contabilidad/concepto-costo/:id_concepto` | `contabilidad.concepto_costo` | `id_concepto` | create: CONTABILIDAD.CONCEPTO_COSTO.CREATE, read: CONTABILIDAD.CONCEPTO_COSTO.READ, update: CONTABILIDAD.CONCEPTO_COSTO.UPDATE |
| POST | `/api/contabilidad/concepto-costo` | `contabilidad.concepto_costo` | `-` | create: CONTABILIDAD.CONCEPTO_COSTO.CREATE, read: CONTABILIDAD.CONCEPTO_COSTO.READ, update: CONTABILIDAD.CONCEPTO_COSTO.UPDATE |
| PUT/PATCH | `/api/contabilidad/concepto-costo/:id_concepto` | `contabilidad.concepto_costo` | `id_concepto` | create: CONTABILIDAD.CONCEPTO_COSTO.CREATE, read: CONTABILIDAD.CONCEPTO_COSTO.READ, update: CONTABILIDAD.CONCEPTO_COSTO.UPDATE |
| GET | `/api/contabilidad/cuenta` | `contabilidad.cuenta` | `-` | create: CONTABILIDAD.CUENTA.CREATE, read: CONTABILIDAD.CUENTA.READ, update: CONTABILIDAD.CUENTA.UPDATE |
| GET | `/api/contabilidad/cuenta/:id_cuenta` | `contabilidad.cuenta` | `id_cuenta` | create: CONTABILIDAD.CUENTA.CREATE, read: CONTABILIDAD.CUENTA.READ, update: CONTABILIDAD.CUENTA.UPDATE |
| POST | `/api/contabilidad/cuenta` | `contabilidad.cuenta` | `-` | create: CONTABILIDAD.CUENTA.CREATE, read: CONTABILIDAD.CUENTA.READ, update: CONTABILIDAD.CUENTA.UPDATE |
| PUT/PATCH | `/api/contabilidad/cuenta/:id_cuenta` | `contabilidad.cuenta` | `id_cuenta` | create: CONTABILIDAD.CUENTA.CREATE, read: CONTABILIDAD.CUENTA.READ, update: CONTABILIDAD.CUENTA.UPDATE |
| GET | `/api/contabilidad/cuenta-asignacion` | `contabilidad.cuenta_asignacion` | `-` | create: CONTABILIDAD.CUENTA_ASIGNACION.CREATE, read: CONTABILIDAD.CUENTA_ASIGNACION.READ, update: CONTABILIDAD.CUENTA_ASIGNACION.UPDATE |
| GET | `/api/contabilidad/cuenta-asignacion/:id_cuenta_asignacion` | `contabilidad.cuenta_asignacion` | `id_cuenta_asignacion` | create: CONTABILIDAD.CUENTA_ASIGNACION.CREATE, read: CONTABILIDAD.CUENTA_ASIGNACION.READ, update: CONTABILIDAD.CUENTA_ASIGNACION.UPDATE |
| POST | `/api/contabilidad/cuenta-asignacion` | `contabilidad.cuenta_asignacion` | `-` | create: CONTABILIDAD.CUENTA_ASIGNACION.CREATE, read: CONTABILIDAD.CUENTA_ASIGNACION.READ, update: CONTABILIDAD.CUENTA_ASIGNACION.UPDATE |
| PUT/PATCH | `/api/contabilidad/cuenta-asignacion/:id_cuenta_asignacion` | `contabilidad.cuenta_asignacion` | `id_cuenta_asignacion` | create: CONTABILIDAD.CUENTA_ASIGNACION.CREATE, read: CONTABILIDAD.CUENTA_ASIGNACION.READ, update: CONTABILIDAD.CUENTA_ASIGNACION.UPDATE |
| GET | `/api/contabilidad/grupo-cuenta` | `contabilidad.grupo_cuenta` | `-` | create: CONTABILIDAD.GRUPO_CUENTA.CREATE, read: CONTABILIDAD.GRUPO_CUENTA.READ, update: CONTABILIDAD.GRUPO_CUENTA.UPDATE |
| GET | `/api/contabilidad/grupo-cuenta/:id_grupo_cuenta` | `contabilidad.grupo_cuenta` | `id_grupo_cuenta` | create: CONTABILIDAD.GRUPO_CUENTA.CREATE, read: CONTABILIDAD.GRUPO_CUENTA.READ, update: CONTABILIDAD.GRUPO_CUENTA.UPDATE |
| POST | `/api/contabilidad/grupo-cuenta` | `contabilidad.grupo_cuenta` | `-` | create: CONTABILIDAD.GRUPO_CUENTA.CREATE, read: CONTABILIDAD.GRUPO_CUENTA.READ, update: CONTABILIDAD.GRUPO_CUENTA.UPDATE |
| PUT/PATCH | `/api/contabilidad/grupo-cuenta/:id_grupo_cuenta` | `contabilidad.grupo_cuenta` | `id_grupo_cuenta` | create: CONTABILIDAD.GRUPO_CUENTA.CREATE, read: CONTABILIDAD.GRUPO_CUENTA.READ, update: CONTABILIDAD.GRUPO_CUENTA.UPDATE |
| GET | `/api/contabilidad/pago-tutor` | `contabilidad.pago_tutor` | `-` | create: CONTABILIDAD.PAGO_TUTOR.CREATE, read: CONTABILIDAD.PAGO_TUTOR.READ, update: CONTABILIDAD.PAGO_TUTOR.UPDATE |
| GET | `/api/contabilidad/pago-tutor/:id_pago_tutor` | `contabilidad.pago_tutor` | `id_pago_tutor` | create: CONTABILIDAD.PAGO_TUTOR.CREATE, read: CONTABILIDAD.PAGO_TUTOR.READ, update: CONTABILIDAD.PAGO_TUTOR.UPDATE |
| POST | `/api/contabilidad/pago-tutor` | `contabilidad.pago_tutor` | `-` | create: CONTABILIDAD.PAGO_TUTOR.CREATE, read: CONTABILIDAD.PAGO_TUTOR.READ, update: CONTABILIDAD.PAGO_TUTOR.UPDATE |
| PUT/PATCH | `/api/contabilidad/pago-tutor/:id_pago_tutor` | `contabilidad.pago_tutor` | `id_pago_tutor` | create: CONTABILIDAD.PAGO_TUTOR.CREATE, read: CONTABILIDAD.PAGO_TUTOR.READ, update: CONTABILIDAD.PAGO_TUTOR.UPDATE |
| GET | `/api/contabilidad/pago-tutor-detalle` | `contabilidad.pago_tutor_detalle` | `-` | create: CONTABILIDAD.PAGO_TUTOR_DETALLE.CREATE, read: CONTABILIDAD.PAGO_TUTOR_DETALLE.READ, update: CONTABILIDAD.PAGO_TUTOR_DETALLE.UPDATE |
| GET | `/api/contabilidad/pago-tutor-detalle/:id_pago_tutor_detalle` | `contabilidad.pago_tutor_detalle` | `id_pago_tutor_detalle` | create: CONTABILIDAD.PAGO_TUTOR_DETALLE.CREATE, read: CONTABILIDAD.PAGO_TUTOR_DETALLE.READ, update: CONTABILIDAD.PAGO_TUTOR_DETALLE.UPDATE |
| POST | `/api/contabilidad/pago-tutor-detalle` | `contabilidad.pago_tutor_detalle` | `-` | create: CONTABILIDAD.PAGO_TUTOR_DETALLE.CREATE, read: CONTABILIDAD.PAGO_TUTOR_DETALLE.READ, update: CONTABILIDAD.PAGO_TUTOR_DETALLE.UPDATE |
| PUT/PATCH | `/api/contabilidad/pago-tutor-detalle/:id_pago_tutor_detalle` | `contabilidad.pago_tutor_detalle` | `id_pago_tutor_detalle` | create: CONTABILIDAD.PAGO_TUTOR_DETALLE.CREATE, read: CONTABILIDAD.PAGO_TUTOR_DETALLE.READ, update: CONTABILIDAD.PAGO_TUTOR_DETALLE.UPDATE |
| GET | `/api/contabilidad/transaccion` | `contabilidad.transaccion` | `-` | create: CONTABILIDAD.TRANSACCION.CREATE, read: CONTABILIDAD.TRANSACCION.READ, update: CONTABILIDAD.TRANSACCION.UPDATE |
| GET | `/api/contabilidad/transaccion/:id_transaccion` | `contabilidad.transaccion` | `id_transaccion` | create: CONTABILIDAD.TRANSACCION.CREATE, read: CONTABILIDAD.TRANSACCION.READ, update: CONTABILIDAD.TRANSACCION.UPDATE |
| POST | `/api/contabilidad/transaccion` | `contabilidad.transaccion` | `-` | create: CONTABILIDAD.TRANSACCION.CREATE, read: CONTABILIDAD.TRANSACCION.READ, update: CONTABILIDAD.TRANSACCION.UPDATE |
| PUT/PATCH | `/api/contabilidad/transaccion/:id_transaccion` | `contabilidad.transaccion` | `id_transaccion` | create: CONTABILIDAD.TRANSACCION.CREATE, read: CONTABILIDAD.TRANSACCION.READ, update: CONTABILIDAD.TRANSACCION.UPDATE |
| GET | `/api/contabilidad/transaccion-movimiento-cuenta` | `contabilidad.transaccion_movimiento_cuenta` | `-` | create: CONTABILIDAD.TRANSACCION_MOVIMIENTO_CUENTA.CREATE, read: CONTABILIDAD.TRANSACCION_MOVIMIENTO_CUENTA.READ, update: CONTABILIDAD.TRANSACCION_MOVIMIENTO_CUENTA.UPDATE |
| GET | `/api/contabilidad/transaccion-movimiento-cuenta/:id_movimiento` | `contabilidad.transaccion_movimiento_cuenta` | `id_movimiento` | create: CONTABILIDAD.TRANSACCION_MOVIMIENTO_CUENTA.CREATE, read: CONTABILIDAD.TRANSACCION_MOVIMIENTO_CUENTA.READ, update: CONTABILIDAD.TRANSACCION_MOVIMIENTO_CUENTA.UPDATE |
| POST | `/api/contabilidad/transaccion-movimiento-cuenta` | `contabilidad.transaccion_movimiento_cuenta` | `-` | create: CONTABILIDAD.TRANSACCION_MOVIMIENTO_CUENTA.CREATE, read: CONTABILIDAD.TRANSACCION_MOVIMIENTO_CUENTA.READ, update: CONTABILIDAD.TRANSACCION_MOVIMIENTO_CUENTA.UPDATE |
| PUT/PATCH | `/api/contabilidad/transaccion-movimiento-cuenta/:id_movimiento` | `contabilidad.transaccion_movimiento_cuenta` | `id_movimiento` | create: CONTABILIDAD.TRANSACCION_MOVIMIENTO_CUENTA.CREATE, read: CONTABILIDAD.TRANSACCION_MOVIMIENTO_CUENTA.READ, update: CONTABILIDAD.TRANSACCION_MOVIMIENTO_CUENTA.UPDATE |
| GET | `/api/deuda/deuda` | `deuda.deuda` | `-` | create: DEUDA.DEUDA.CREATE, read: DEUDA.DEUDA.READ, update: DEUDA.DEUDA.UPDATE |
| GET | `/api/deuda/deuda/:id_deuda` | `deuda.deuda` | `id_deuda` | create: DEUDA.DEUDA.CREATE, read: DEUDA.DEUDA.READ, update: DEUDA.DEUDA.UPDATE |
| POST | `/api/deuda/deuda` | `deuda.deuda` | `-` | create: DEUDA.DEUDA.CREATE, read: DEUDA.DEUDA.READ, update: DEUDA.DEUDA.UPDATE |
| PUT/PATCH | `/api/deuda/deuda/:id_deuda` | `deuda.deuda` | `id_deuda` | create: DEUDA.DEUDA.CREATE, read: DEUDA.DEUDA.READ, update: DEUDA.DEUDA.UPDATE |
| GET | `/api/deuda/pago` | `deuda.pago` | `-` | create: DEUDA.PAGO.CREATE, read: DEUDA.PAGO.READ, update: DEUDA.PAGO.UPDATE |
| GET | `/api/deuda/pago/:id_pago` | `deuda.pago` | `id_pago` | create: DEUDA.PAGO.CREATE, read: DEUDA.PAGO.READ, update: DEUDA.PAGO.UPDATE |
| POST | `/api/deuda/pago` | `deuda.pago` | `-` | create: DEUDA.PAGO.CREATE, read: DEUDA.PAGO.READ, update: DEUDA.PAGO.UPDATE |
| PUT/PATCH | `/api/deuda/pago/:id_pago` | `deuda.pago` | `id_pago` | create: DEUDA.PAGO.CREATE, read: DEUDA.PAGO.READ, update: DEUDA.PAGO.UPDATE |
| GET | `/api/infraestructura/edificio` | `infraestructura.edificio` | `-` | create: INFRAESTRUCTURA.EDIFICIO.CREATE, read: INFRAESTRUCTURA.EDIFICIO.READ, update: INFRAESTRUCTURA.EDIFICIO.UPDATE |
| GET | `/api/infraestructura/edificio/:id_edificio` | `infraestructura.edificio` | `id_edificio` | create: INFRAESTRUCTURA.EDIFICIO.CREATE, read: INFRAESTRUCTURA.EDIFICIO.READ, update: INFRAESTRUCTURA.EDIFICIO.UPDATE |
| POST | `/api/infraestructura/edificio` | `infraestructura.edificio` | `-` | create: INFRAESTRUCTURA.EDIFICIO.CREATE, read: INFRAESTRUCTURA.EDIFICIO.READ, update: INFRAESTRUCTURA.EDIFICIO.UPDATE |
| PUT/PATCH | `/api/infraestructura/edificio/:id_edificio` | `infraestructura.edificio` | `id_edificio` | create: INFRAESTRUCTURA.EDIFICIO.CREATE, read: INFRAESTRUCTURA.EDIFICIO.READ, update: INFRAESTRUCTURA.EDIFICIO.UPDATE |
| GET | `/api/infraestructura/encargado` | `infraestructura.encargado` | `-` | create: INFRAESTRUCTURA.ENCARGADO.CREATE, read: INFRAESTRUCTURA.ENCARGADO.READ, update: INFRAESTRUCTURA.ENCARGADO.UPDATE |
| GET | `/api/infraestructura/encargado/:id_asignacion` | `infraestructura.encargado` | `id_asignacion` | create: INFRAESTRUCTURA.ENCARGADO.CREATE, read: INFRAESTRUCTURA.ENCARGADO.READ, update: INFRAESTRUCTURA.ENCARGADO.UPDATE |
| POST | `/api/infraestructura/encargado` | `infraestructura.encargado` | `-` | create: INFRAESTRUCTURA.ENCARGADO.CREATE, read: INFRAESTRUCTURA.ENCARGADO.READ, update: INFRAESTRUCTURA.ENCARGADO.UPDATE |
| PUT/PATCH | `/api/infraestructura/encargado/:id_asignacion` | `infraestructura.encargado` | `id_asignacion` | create: INFRAESTRUCTURA.ENCARGADO.CREATE, read: INFRAESTRUCTURA.ENCARGADO.READ, update: INFRAESTRUCTURA.ENCARGADO.UPDATE |
| GET | `/api/infraestructura/espacio` | `infraestructura.espacio` | `-` | create: INFRAESTRUCTURA.ESPACIO.CREATE, read: INFRAESTRUCTURA.ESPACIO.READ, update: INFRAESTRUCTURA.ESPACIO.UPDATE |
| GET | `/api/infraestructura/espacio/:id_espacio` | `infraestructura.espacio` | `id_espacio` | create: INFRAESTRUCTURA.ESPACIO.CREATE, read: INFRAESTRUCTURA.ESPACIO.READ, update: INFRAESTRUCTURA.ESPACIO.UPDATE |
| POST | `/api/infraestructura/espacio` | `infraestructura.espacio` | `-` | create: INFRAESTRUCTURA.ESPACIO.CREATE, read: INFRAESTRUCTURA.ESPACIO.READ, update: INFRAESTRUCTURA.ESPACIO.UPDATE |
| PUT/PATCH | `/api/infraestructura/espacio/:id_espacio` | `infraestructura.espacio` | `id_espacio` | create: INFRAESTRUCTURA.ESPACIO.CREATE, read: INFRAESTRUCTURA.ESPACIO.READ, update: INFRAESTRUCTURA.ESPACIO.UPDATE |
| GET | `/api/infraestructura/sucursal` | `infraestructura.sucursal` | `-` | create: INFRAESTRUCTURA.SUCURSAL.CREATE, read: INFRAESTRUCTURA.SUCURSAL.READ, update: INFRAESTRUCTURA.SUCURSAL.UPDATE |
| GET | `/api/infraestructura/sucursal/:id_sucursal` | `infraestructura.sucursal` | `id_sucursal` | create: INFRAESTRUCTURA.SUCURSAL.CREATE, read: INFRAESTRUCTURA.SUCURSAL.READ, update: INFRAESTRUCTURA.SUCURSAL.UPDATE |
| POST | `/api/infraestructura/sucursal` | `infraestructura.sucursal` | `-` | create: INFRAESTRUCTURA.SUCURSAL.CREATE, read: INFRAESTRUCTURA.SUCURSAL.READ, update: INFRAESTRUCTURA.SUCURSAL.UPDATE |
| PUT/PATCH | `/api/infraestructura/sucursal/:id_sucursal` | `infraestructura.sucursal` | `id_sucursal` | create: INFRAESTRUCTURA.SUCURSAL.CREATE, read: INFRAESTRUCTURA.SUCURSAL.READ, update: INFRAESTRUCTURA.SUCURSAL.UPDATE |
| GET | `/api/infraestructura/tienda` | `infraestructura.tienda` | `-` | create: INFRAESTRUCTURA.TIENDA.CREATE, read: INFRAESTRUCTURA.TIENDA.READ, update: INFRAESTRUCTURA.TIENDA.UPDATE |
| GET | `/api/infraestructura/tienda/:id_tienda` | `infraestructura.tienda` | `id_tienda` | create: INFRAESTRUCTURA.TIENDA.CREATE, read: INFRAESTRUCTURA.TIENDA.READ, update: INFRAESTRUCTURA.TIENDA.UPDATE |
| POST | `/api/infraestructura/tienda` | `infraestructura.tienda` | `-` | create: INFRAESTRUCTURA.TIENDA.CREATE, read: INFRAESTRUCTURA.TIENDA.READ, update: INFRAESTRUCTURA.TIENDA.UPDATE |
| PUT/PATCH | `/api/infraestructura/tienda/:id_tienda` | `infraestructura.tienda` | `id_tienda` | create: INFRAESTRUCTURA.TIENDA.CREATE, read: INFRAESTRUCTURA.TIENDA.READ, update: INFRAESTRUCTURA.TIENDA.UPDATE |
| GET | `/api/inventario/bien` | `inventario.bien` | `-` | create: INVENTARIO.BIEN.CREATE, read: INVENTARIO.BIEN.READ, update: INVENTARIO.BIEN.UPDATE |
| GET | `/api/inventario/bien/:id_bien` | `inventario.bien` | `id_bien` | create: INVENTARIO.BIEN.CREATE, read: INVENTARIO.BIEN.READ, update: INVENTARIO.BIEN.UPDATE |
| POST | `/api/inventario/bien` | `inventario.bien` | `-` | create: INVENTARIO.BIEN.CREATE, read: INVENTARIO.BIEN.READ, update: INVENTARIO.BIEN.UPDATE |
| PUT/PATCH | `/api/inventario/bien/:id_bien` | `inventario.bien` | `id_bien` | create: INVENTARIO.BIEN.CREATE, read: INVENTARIO.BIEN.READ, update: INVENTARIO.BIEN.UPDATE |
| GET | `/api/inventario/bien-instancia` | `inventario.bien_instancia` | `-` | create: INVENTARIO.BIEN_INSTANCIA.CREATE, read: INVENTARIO.BIEN_INSTANCIA.READ, update: INVENTARIO.BIEN_INSTANCIA.UPDATE |
| GET | `/api/inventario/bien-instancia/:id_bien_instancia` | `inventario.bien_instancia` | `id_bien_instancia` | create: INVENTARIO.BIEN_INSTANCIA.CREATE, read: INVENTARIO.BIEN_INSTANCIA.READ, update: INVENTARIO.BIEN_INSTANCIA.UPDATE |
| POST | `/api/inventario/bien-instancia` | `inventario.bien_instancia` | `-` | create: INVENTARIO.BIEN_INSTANCIA.CREATE, read: INVENTARIO.BIEN_INSTANCIA.READ, update: INVENTARIO.BIEN_INSTANCIA.UPDATE |
| PUT/PATCH | `/api/inventario/bien-instancia/:id_bien_instancia` | `inventario.bien_instancia` | `id_bien_instancia` | create: INVENTARIO.BIEN_INSTANCIA.CREATE, read: INVENTARIO.BIEN_INSTANCIA.READ, update: INVENTARIO.BIEN_INSTANCIA.UPDATE |
| GET | `/api/inventario/bien-lote` | `inventario.bien_lote` | `-` | create: INVENTARIO.BIEN_LOTE.CREATE, read: INVENTARIO.BIEN_LOTE.READ, update: INVENTARIO.BIEN_LOTE.UPDATE |
| GET | `/api/inventario/bien-lote/:id_lote` | `inventario.bien_lote` | `id_lote` | create: INVENTARIO.BIEN_LOTE.CREATE, read: INVENTARIO.BIEN_LOTE.READ, update: INVENTARIO.BIEN_LOTE.UPDATE |
| POST | `/api/inventario/bien-lote` | `inventario.bien_lote` | `-` | create: INVENTARIO.BIEN_LOTE.CREATE, read: INVENTARIO.BIEN_LOTE.READ, update: INVENTARIO.BIEN_LOTE.UPDATE |
| PUT/PATCH | `/api/inventario/bien-lote/:id_lote` | `inventario.bien_lote` | `id_lote` | create: INVENTARIO.BIEN_LOTE.CREATE, read: INVENTARIO.BIEN_LOTE.READ, update: INVENTARIO.BIEN_LOTE.UPDATE |
| GET | `/api/inventario/movimiento-detalle` | `inventario.movimiento_detalle` | `-` | create: INVENTARIO.MOVIMIENTO_DETALLE.CREATE, read: INVENTARIO.MOVIMIENTO_DETALLE.READ, update: INVENTARIO.MOVIMIENTO_DETALLE.UPDATE |
| GET | `/api/inventario/movimiento-detalle/:id_movimiento` | `inventario.movimiento_detalle` | `id_movimiento` | create: INVENTARIO.MOVIMIENTO_DETALLE.CREATE, read: INVENTARIO.MOVIMIENTO_DETALLE.READ, update: INVENTARIO.MOVIMIENTO_DETALLE.UPDATE |
| POST | `/api/inventario/movimiento-detalle` | `inventario.movimiento_detalle` | `-` | create: INVENTARIO.MOVIMIENTO_DETALLE.CREATE, read: INVENTARIO.MOVIMIENTO_DETALLE.READ, update: INVENTARIO.MOVIMIENTO_DETALLE.UPDATE |
| PUT/PATCH | `/api/inventario/movimiento-detalle/:id_movimiento` | `inventario.movimiento_detalle` | `id_movimiento` | create: INVENTARIO.MOVIMIENTO_DETALLE.CREATE, read: INVENTARIO.MOVIMIENTO_DETALLE.READ, update: INVENTARIO.MOVIMIENTO_DETALLE.UPDATE |
| GET | `/api/personas/estudiante` | `persona.persona_estudiante` | `-` | create: PERSONAS.PERSONA_ESTUDIANTE.CREATE, read: PERSONAS.PERSONA_ESTUDIANTE.READ, update: PERSONAS.PERSONA_ESTUDIANTE.UPDATE |
| GET | `/api/personas/estudiante/:id_persona` | `persona.persona_estudiante` | `id_persona` | create: PERSONAS.PERSONA_ESTUDIANTE.CREATE, read: PERSONAS.PERSONA_ESTUDIANTE.READ, update: PERSONAS.PERSONA_ESTUDIANTE.UPDATE |
| POST | `/api/personas/estudiante` | `persona.persona_estudiante` | `-` | create: PERSONAS.PERSONA_ESTUDIANTE.CREATE, read: PERSONAS.PERSONA_ESTUDIANTE.READ, update: PERSONAS.PERSONA_ESTUDIANTE.UPDATE |
| PUT/PATCH | `/api/personas/estudiante/:id_persona` | `persona.persona_estudiante` | `id_persona` | create: PERSONAS.PERSONA_ESTUDIANTE.CREATE, read: PERSONAS.PERSONA_ESTUDIANTE.READ, update: PERSONAS.PERSONA_ESTUDIANTE.UPDATE |
| GET | `/api/personas/estudiante-padre` | `persona.estudiante_padre` | `-` | create: PERSONAS.ESTUDIANTE_PADRE.CREATE, read: PERSONAS.ESTUDIANTE_PADRE.READ, update: PERSONAS.ESTUDIANTE_PADRE.UPDATE |
| GET | `/api/personas/estudiante-padre/:id_asociacion` | `persona.estudiante_padre` | `id_asociacion` | create: PERSONAS.ESTUDIANTE_PADRE.CREATE, read: PERSONAS.ESTUDIANTE_PADRE.READ, update: PERSONAS.ESTUDIANTE_PADRE.UPDATE |
| POST | `/api/personas/estudiante-padre` | `persona.estudiante_padre` | `-` | create: PERSONAS.ESTUDIANTE_PADRE.CREATE, read: PERSONAS.ESTUDIANTE_PADRE.READ, update: PERSONAS.ESTUDIANTE_PADRE.UPDATE |
| PUT/PATCH | `/api/personas/estudiante-padre/:id_asociacion` | `persona.estudiante_padre` | `id_asociacion` | create: PERSONAS.ESTUDIANTE_PADRE.CREATE, read: PERSONAS.ESTUDIANTE_PADRE.READ, update: PERSONAS.ESTUDIANTE_PADRE.UPDATE |
| GET | `/api/personas/padre` | `persona.persona_padre` | `-` | create: PERSONAS.PERSONA_PADRE.CREATE, read: PERSONAS.PERSONA_PADRE.READ, update: PERSONAS.PERSONA_PADRE.UPDATE |
| GET | `/api/personas/padre/:id_padre` | `persona.persona_padre` | `id_padre` | create: PERSONAS.PERSONA_PADRE.CREATE, read: PERSONAS.PERSONA_PADRE.READ, update: PERSONAS.PERSONA_PADRE.UPDATE |
| POST | `/api/personas/padre` | `persona.persona_padre` | `-` | create: PERSONAS.PERSONA_PADRE.CREATE, read: PERSONAS.PERSONA_PADRE.READ, update: PERSONAS.PERSONA_PADRE.UPDATE |
| PUT/PATCH | `/api/personas/padre/:id_padre` | `persona.persona_padre` | `id_padre` | create: PERSONAS.PERSONA_PADRE.CREATE, read: PERSONAS.PERSONA_PADRE.READ, update: PERSONAS.PERSONA_PADRE.UPDATE |
| GET | `/api/personas/proveedor` | `persona.proveedor` | `-` | create: PERSONAS.PROVEEDOR.CREATE, read: PERSONAS.PROVEEDOR.READ, update: PERSONAS.PROVEEDOR.UPDATE |
| GET | `/api/personas/proveedor/:id_proveedor` | `persona.proveedor` | `id_proveedor` | create: PERSONAS.PROVEEDOR.CREATE, read: PERSONAS.PROVEEDOR.READ, update: PERSONAS.PROVEEDOR.UPDATE |
| POST | `/api/personas/proveedor` | `persona.proveedor` | `-` | create: PERSONAS.PROVEEDOR.CREATE, read: PERSONAS.PROVEEDOR.READ, update: PERSONAS.PROVEEDOR.UPDATE |
| PUT/PATCH | `/api/personas/proveedor/:id_proveedor` | `persona.proveedor` | `id_proveedor` | create: PERSONAS.PROVEEDOR.CREATE, read: PERSONAS.PROVEEDOR.READ, update: PERSONAS.PROVEEDOR.UPDATE |
| GET | `/api/personas/tutor` | `persona.persona_tutor` | `-` | create: PERSONAS.PERSONA_TUTOR.CREATE, read: PERSONAS.PERSONA_TUTOR.READ, update: PERSONAS.PERSONA_TUTOR.UPDATE |
| GET | `/api/personas/tutor/:id_tutor` | `persona.persona_tutor` | `id_tutor` | create: PERSONAS.PERSONA_TUTOR.CREATE, read: PERSONAS.PERSONA_TUTOR.READ, update: PERSONAS.PERSONA_TUTOR.UPDATE |
| POST | `/api/personas/tutor` | `persona.persona_tutor` | `-` | create: PERSONAS.PERSONA_TUTOR.CREATE, read: PERSONAS.PERSONA_TUTOR.READ, update: PERSONAS.PERSONA_TUTOR.UPDATE |
| PUT/PATCH | `/api/personas/tutor/:id_tutor` | `persona.persona_tutor` | `id_tutor` | create: PERSONAS.PERSONA_TUTOR.CREATE, read: PERSONAS.PERSONA_TUTOR.READ, update: PERSONAS.PERSONA_TUTOR.UPDATE |
| GET | `/api/personas/unidad-educativa` | `persona.unidad_educativa` | `-` | create: PERSONAS.UNIDAD_EDUCATIVA.CREATE, read: PERSONAS.UNIDAD_EDUCATIVA.READ, update: PERSONAS.UNIDAD_EDUCATIVA.UPDATE |
| GET | `/api/personas/unidad-educativa/:id_unidad_educativa` | `persona.unidad_educativa` | `id_unidad_educativa` | create: PERSONAS.UNIDAD_EDUCATIVA.CREATE, read: PERSONAS.UNIDAD_EDUCATIVA.READ, update: PERSONAS.UNIDAD_EDUCATIVA.UPDATE |
| POST | `/api/personas/unidad-educativa` | `persona.unidad_educativa` | `-` | create: PERSONAS.UNIDAD_EDUCATIVA.CREATE, read: PERSONAS.UNIDAD_EDUCATIVA.READ, update: PERSONAS.UNIDAD_EDUCATIVA.UPDATE |
| PUT/PATCH | `/api/personas/unidad-educativa/:id_unidad_educativa` | `persona.unidad_educativa` | `id_unidad_educativa` | create: PERSONAS.UNIDAD_EDUCATIVA.CREATE, read: PERSONAS.UNIDAD_EDUCATIVA.READ, update: PERSONAS.UNIDAD_EDUCATIVA.UPDATE |
| GET | `/api/personas/usuario` | `persona.persona_usuario` | `-` | create: PERSONAS.PERSONA_USUARIO.CREATE, read: PERSONAS.PERSONA_USUARIO.READ, update: PERSONAS.PERSONA_USUARIO.UPDATE |
| GET | `/api/personas/usuario/:id_persona` | `persona.persona_usuario` | `id_persona` | create: PERSONAS.PERSONA_USUARIO.CREATE, read: PERSONAS.PERSONA_USUARIO.READ, update: PERSONAS.PERSONA_USUARIO.UPDATE |
| POST | `/api/personas/usuario` | `persona.persona_usuario` | `-` | create: PERSONAS.PERSONA_USUARIO.CREATE, read: PERSONAS.PERSONA_USUARIO.READ, update: PERSONAS.PERSONA_USUARIO.UPDATE |
| PUT/PATCH | `/api/personas/usuario/:id_persona` | `persona.persona_usuario` | `id_persona` | create: PERSONAS.PERSONA_USUARIO.CREATE, read: PERSONAS.PERSONA_USUARIO.READ, update: PERSONAS.PERSONA_USUARIO.UPDATE |
| GET | `/api/seguridad/permiso` | `seguridad.permiso` | `-` | Sin permiso explícito heredado |
| GET | `/api/seguridad/permiso/:id_permiso` | `seguridad.permiso` | `id_permiso` | Sin permiso explícito heredado |
| POST | `/api/seguridad/permiso` | `seguridad.permiso` | `-` | Sin permiso explícito heredado |
| PUT/PATCH | `/api/seguridad/permiso/:id_permiso` | `seguridad.permiso` | `id_permiso` | Sin permiso explícito heredado |
| GET | `/api/seguridad/rol` | `seguridad.rol` | `-` | Sin permiso explícito heredado |
| GET | `/api/seguridad/rol/:id_rol` | `seguridad.rol` | `id_rol` | Sin permiso explícito heredado |
| POST | `/api/seguridad/rol` | `seguridad.rol` | `-` | Sin permiso explícito heredado |
| PUT/PATCH | `/api/seguridad/rol/:id_rol` | `seguridad.rol` | `id_rol` | Sin permiso explícito heredado |
| GET | `/api/seguridad/rol-permiso` | `seguridad.rol_permiso` | `-` | Sin permiso explícito heredado |
| GET | `/api/seguridad/rol-permiso/:id_rol/:id_permiso` | `seguridad.rol_permiso` | `id_rol, id_permiso` | Sin permiso explícito heredado |
| POST | `/api/seguridad/rol-permiso` | `seguridad.rol_permiso` | `-` | Sin permiso explícito heredado |
| PUT/PATCH | `/api/seguridad/rol-permiso/:id_rol/:id_permiso` | `seguridad.rol_permiso` | `id_rol, id_permiso` | Sin permiso explícito heredado |
| GET | `/api/seguridad/usuario-permiso` | `seguridad.usuario_permiso` | `-` | Sin permiso explícito heredado |
| GET | `/api/seguridad/usuario-permiso/:id_persona/:id_permiso` | `seguridad.usuario_permiso` | `id_persona, id_permiso` | Sin permiso explícito heredado |
| POST | `/api/seguridad/usuario-permiso` | `seguridad.usuario_permiso` | `-` | Sin permiso explícito heredado |
| PUT/PATCH | `/api/seguridad/usuario-permiso/:id_persona/:id_permiso` | `seguridad.usuario_permiso` | `id_persona, id_permiso` | Sin permiso explícito heredado |
| GET | `/api/seguridad/usuario-rol` | `seguridad.usuario_rol` | `-` | Sin permiso explícito heredado |
| GET | `/api/seguridad/usuario-rol/:id_persona/:id_rol` | `seguridad.usuario_rol` | `id_persona, id_rol` | Sin permiso explícito heredado |
| POST | `/api/seguridad/usuario-rol` | `seguridad.usuario_rol` | `-` | Sin permiso explícito heredado |
| PUT/PATCH | `/api/seguridad/usuario-rol/:id_persona/:id_rol` | `seguridad.usuario_rol` | `id_persona, id_rol` | Sin permiso explícito heredado |
| GET | `/api/servicios_educativos/asistencia-clase-curso` | `servicios_educativos.asistencia_clase_curso` | `-` | create: SERVICIOS_EDUCATIVOS.ASISTENCIA_CLASE_CURSO.CREATE, read: SERVICIOS_EDUCATIVOS.ASISTENCIA_CLASE_CURSO.READ, update: SERVICIOS_EDUCATIVOS.ASISTENCIA_CLASE_CURSO.UPDATE |
| GET | `/api/servicios_educativos/asistencia-clase-curso/:id_asistencia` | `servicios_educativos.asistencia_clase_curso` | `id_asistencia` | create: SERVICIOS_EDUCATIVOS.ASISTENCIA_CLASE_CURSO.CREATE, read: SERVICIOS_EDUCATIVOS.ASISTENCIA_CLASE_CURSO.READ, update: SERVICIOS_EDUCATIVOS.ASISTENCIA_CLASE_CURSO.UPDATE |
| POST | `/api/servicios_educativos/asistencia-clase-curso` | `servicios_educativos.asistencia_clase_curso` | `-` | create: SERVICIOS_EDUCATIVOS.ASISTENCIA_CLASE_CURSO.CREATE, read: SERVICIOS_EDUCATIVOS.ASISTENCIA_CLASE_CURSO.READ, update: SERVICIOS_EDUCATIVOS.ASISTENCIA_CLASE_CURSO.UPDATE |
| PUT/PATCH | `/api/servicios_educativos/asistencia-clase-curso/:id_asistencia` | `servicios_educativos.asistencia_clase_curso` | `id_asistencia` | create: SERVICIOS_EDUCATIVOS.ASISTENCIA_CLASE_CURSO.CREATE, read: SERVICIOS_EDUCATIVOS.ASISTENCIA_CLASE_CURSO.READ, update: SERVICIOS_EDUCATIVOS.ASISTENCIA_CLASE_CURSO.UPDATE |
| GET | `/api/servicios_educativos/clase-curso` | `servicios_educativos.clase_curso` | `-` | create: SERVICIOS_EDUCATIVOS.CLASE_CURSO.CREATE, read: SERVICIOS_EDUCATIVOS.CLASE_CURSO.READ, update: SERVICIOS_EDUCATIVOS.CLASE_CURSO.UPDATE |
| GET | `/api/servicios_educativos/clase-curso/:id_clase_curso` | `servicios_educativos.clase_curso` | `id_clase_curso` | create: SERVICIOS_EDUCATIVOS.CLASE_CURSO.CREATE, read: SERVICIOS_EDUCATIVOS.CLASE_CURSO.READ, update: SERVICIOS_EDUCATIVOS.CLASE_CURSO.UPDATE |
| POST | `/api/servicios_educativos/clase-curso` | `servicios_educativos.clase_curso` | `-` | create: SERVICIOS_EDUCATIVOS.CLASE_CURSO.CREATE, read: SERVICIOS_EDUCATIVOS.CLASE_CURSO.READ, update: SERVICIOS_EDUCATIVOS.CLASE_CURSO.UPDATE |
| PUT/PATCH | `/api/servicios_educativos/clase-curso/:id_clase_curso` | `servicios_educativos.clase_curso` | `id_clase_curso` | create: SERVICIOS_EDUCATIVOS.CLASE_CURSO.CREATE, read: SERVICIOS_EDUCATIVOS.CLASE_CURSO.READ, update: SERVICIOS_EDUCATIVOS.CLASE_CURSO.UPDATE |
| GET | `/api/servicios_educativos/clase-por-hora` | `servicios_educativos.clase_por_hora` | `-` | create: SERVICIOS_EDUCATIVOS.CLASE_POR_HORA.CREATE, read: SERVICIOS_EDUCATIVOS.CLASE_POR_HORA.READ, update: SERVICIOS_EDUCATIVOS.CLASE_POR_HORA.UPDATE |
| GET | `/api/servicios_educativos/clase-por-hora/:id_clase` | `servicios_educativos.clase_por_hora` | `id_clase` | create: SERVICIOS_EDUCATIVOS.CLASE_POR_HORA.CREATE, read: SERVICIOS_EDUCATIVOS.CLASE_POR_HORA.READ, update: SERVICIOS_EDUCATIVOS.CLASE_POR_HORA.UPDATE |
| POST | `/api/servicios_educativos/clase-por-hora` | `servicios_educativos.clase_por_hora` | `-` | create: SERVICIOS_EDUCATIVOS.CLASE_POR_HORA.CREATE, read: SERVICIOS_EDUCATIVOS.CLASE_POR_HORA.READ, update: SERVICIOS_EDUCATIVOS.CLASE_POR_HORA.UPDATE |
| PUT/PATCH | `/api/servicios_educativos/clase-por-hora/:id_clase` | `servicios_educativos.clase_por_hora` | `id_clase` | create: SERVICIOS_EDUCATIVOS.CLASE_POR_HORA.CREATE, read: SERVICIOS_EDUCATIVOS.CLASE_POR_HORA.READ, update: SERVICIOS_EDUCATIVOS.CLASE_POR_HORA.UPDATE |
| GET | `/api/servicios_educativos/curso-version` | `servicios_educativos.curso_version` | `-` | create: SERVICIOS_EDUCATIVOS.CURSO_VERSION.CREATE, read: SERVICIOS_EDUCATIVOS.CURSO_VERSION.READ, update: SERVICIOS_EDUCATIVOS.CURSO_VERSION.UPDATE |
| GET | `/api/servicios_educativos/curso-version/:id_curso_version` | `servicios_educativos.curso_version` | `id_curso_version` | create: SERVICIOS_EDUCATIVOS.CURSO_VERSION.CREATE, read: SERVICIOS_EDUCATIVOS.CURSO_VERSION.READ, update: SERVICIOS_EDUCATIVOS.CURSO_VERSION.UPDATE |
| POST | `/api/servicios_educativos/curso-version` | `servicios_educativos.curso_version` | `-` | create: SERVICIOS_EDUCATIVOS.CURSO_VERSION.CREATE, read: SERVICIOS_EDUCATIVOS.CURSO_VERSION.READ, update: SERVICIOS_EDUCATIVOS.CURSO_VERSION.UPDATE |
| PUT/PATCH | `/api/servicios_educativos/curso-version/:id_curso_version` | `servicios_educativos.curso_version` | `id_curso_version` | create: SERVICIOS_EDUCATIVOS.CURSO_VERSION.CREATE, read: SERVICIOS_EDUCATIVOS.CURSO_VERSION.READ, update: SERVICIOS_EDUCATIVOS.CURSO_VERSION.UPDATE |
| GET | `/api/servicios_educativos/horarios` | `servicios_educativos.horarios` | `-` | create: SERVICIOS_EDUCATIVOS.HORARIOS.CREATE, read: SERVICIOS_EDUCATIVOS.HORARIOS.READ, update: SERVICIOS_EDUCATIVOS.HORARIOS.UPDATE |
| GET | `/api/servicios_educativos/horarios/:id_horario` | `servicios_educativos.horarios` | `id_horario` | create: SERVICIOS_EDUCATIVOS.HORARIOS.CREATE, read: SERVICIOS_EDUCATIVOS.HORARIOS.READ, update: SERVICIOS_EDUCATIVOS.HORARIOS.UPDATE |
| POST | `/api/servicios_educativos/horarios` | `servicios_educativos.horarios` | `-` | create: SERVICIOS_EDUCATIVOS.HORARIOS.CREATE, read: SERVICIOS_EDUCATIVOS.HORARIOS.READ, update: SERVICIOS_EDUCATIVOS.HORARIOS.UPDATE |
| PUT/PATCH | `/api/servicios_educativos/horarios/:id_horario` | `servicios_educativos.horarios` | `id_horario` | create: SERVICIOS_EDUCATIVOS.HORARIOS.CREATE, read: SERVICIOS_EDUCATIVOS.HORARIOS.READ, update: SERVICIOS_EDUCATIVOS.HORARIOS.UPDATE |
| GET | `/api/servicios_educativos/materia-tree` | `servicios_educativos.materia_tree` | `-` | create: SERVICIOS_EDUCATIVOS.MATERIA_TREE.CREATE, read: SERVICIOS_EDUCATIVOS.MATERIA_TREE.READ, update: SERVICIOS_EDUCATIVOS.MATERIA_TREE.UPDATE |
| GET | `/api/servicios_educativos/materia-tree/:id_tree` | `servicios_educativos.materia_tree` | `id_tree` | create: SERVICIOS_EDUCATIVOS.MATERIA_TREE.CREATE, read: SERVICIOS_EDUCATIVOS.MATERIA_TREE.READ, update: SERVICIOS_EDUCATIVOS.MATERIA_TREE.UPDATE |
| POST | `/api/servicios_educativos/materia-tree` | `servicios_educativos.materia_tree` | `-` | create: SERVICIOS_EDUCATIVOS.MATERIA_TREE.CREATE, read: SERVICIOS_EDUCATIVOS.MATERIA_TREE.READ, update: SERVICIOS_EDUCATIVOS.MATERIA_TREE.UPDATE |
| PUT/PATCH | `/api/servicios_educativos/materia-tree/:id_tree` | `servicios_educativos.materia_tree` | `id_tree` | create: SERVICIOS_EDUCATIVOS.MATERIA_TREE.CREATE, read: SERVICIOS_EDUCATIVOS.MATERIA_TREE.READ, update: SERVICIOS_EDUCATIVOS.MATERIA_TREE.UPDATE |
| GET | `/api/servicios_educativos/paquetes-producto-educativo` | `servicios_educativos.paquetes_producto_educativo` | `-` | create: SERVICIOS_EDUCATIVOS.PAQUETES_PRODUCTO_EDUCATIVO.CREATE, read: SERVICIOS_EDUCATIVOS.PAQUETES_PRODUCTO_EDUCATIVO.READ, update: SERVICIOS_EDUCATIVOS.PAQUETES_PRODUCTO_EDUCATIVO.UPDATE |
| GET | `/api/servicios_educativos/paquetes-producto-educativo/:id_paquete` | `servicios_educativos.paquetes_producto_educativo` | `id_paquete` | create: SERVICIOS_EDUCATIVOS.PAQUETES_PRODUCTO_EDUCATIVO.CREATE, read: SERVICIOS_EDUCATIVOS.PAQUETES_PRODUCTO_EDUCATIVO.READ, update: SERVICIOS_EDUCATIVOS.PAQUETES_PRODUCTO_EDUCATIVO.UPDATE |
| POST | `/api/servicios_educativos/paquetes-producto-educativo` | `servicios_educativos.paquetes_producto_educativo` | `-` | create: SERVICIOS_EDUCATIVOS.PAQUETES_PRODUCTO_EDUCATIVO.CREATE, read: SERVICIOS_EDUCATIVOS.PAQUETES_PRODUCTO_EDUCATIVO.READ, update: SERVICIOS_EDUCATIVOS.PAQUETES_PRODUCTO_EDUCATIVO.UPDATE |
| PUT/PATCH | `/api/servicios_educativos/paquetes-producto-educativo/:id_paquete` | `servicios_educativos.paquetes_producto_educativo` | `id_paquete` | create: SERVICIOS_EDUCATIVOS.PAQUETES_PRODUCTO_EDUCATIVO.CREATE, read: SERVICIOS_EDUCATIVOS.PAQUETES_PRODUCTO_EDUCATIVO.READ, update: SERVICIOS_EDUCATIVOS.PAQUETES_PRODUCTO_EDUCATIVO.UPDATE |
| GET | `/api/servicios_educativos/producto-educativo` | `servicios_educativos.producto_educativo` | `-` | create: SERVICIOS_EDUCATIVOS.PRODUCTO_EDUCATIVO.CREATE, read: SERVICIOS_EDUCATIVOS.PRODUCTO_EDUCATIVO.READ, update: SERVICIOS_EDUCATIVOS.PRODUCTO_EDUCATIVO.UPDATE |
| GET | `/api/servicios_educativos/producto-educativo/:id_producto_educativo` | `servicios_educativos.producto_educativo` | `id_producto_educativo` | create: SERVICIOS_EDUCATIVOS.PRODUCTO_EDUCATIVO.CREATE, read: SERVICIOS_EDUCATIVOS.PRODUCTO_EDUCATIVO.READ, update: SERVICIOS_EDUCATIVOS.PRODUCTO_EDUCATIVO.UPDATE |
| POST | `/api/servicios_educativos/producto-educativo` | `servicios_educativos.producto_educativo` | `-` | create: SERVICIOS_EDUCATIVOS.PRODUCTO_EDUCATIVO.CREATE, read: SERVICIOS_EDUCATIVOS.PRODUCTO_EDUCATIVO.READ, update: SERVICIOS_EDUCATIVOS.PRODUCTO_EDUCATIVO.UPDATE |
| PUT/PATCH | `/api/servicios_educativos/producto-educativo/:id_producto_educativo` | `servicios_educativos.producto_educativo` | `id_producto_educativo` | create: SERVICIOS_EDUCATIVOS.PRODUCTO_EDUCATIVO.CREATE, read: SERVICIOS_EDUCATIVOS.PRODUCTO_EDUCATIVO.READ, update: SERVICIOS_EDUCATIVOS.PRODUCTO_EDUCATIVO.UPDATE |
| GET | `/api/societario/clase-titulo` | `societario.clase_titulo` | `-` | create: SOCIETARIO.CLASE_TITULO.CREATE, read: SOCIETARIO.CLASE_TITULO.READ, update: SOCIETARIO.CLASE_TITULO.UPDATE |
| GET | `/api/societario/clase-titulo/:id_clase_titulo` | `societario.clase_titulo` | `id_clase_titulo` | create: SOCIETARIO.CLASE_TITULO.CREATE, read: SOCIETARIO.CLASE_TITULO.READ, update: SOCIETARIO.CLASE_TITULO.UPDATE |
| POST | `/api/societario/clase-titulo` | `societario.clase_titulo` | `-` | create: SOCIETARIO.CLASE_TITULO.CREATE, read: SOCIETARIO.CLASE_TITULO.READ, update: SOCIETARIO.CLASE_TITULO.UPDATE |
| PUT/PATCH | `/api/societario/clase-titulo/:id_clase_titulo` | `societario.clase_titulo` | `id_clase_titulo` | create: SOCIETARIO.CLASE_TITULO.CREATE, read: SOCIETARIO.CLASE_TITULO.READ, update: SOCIETARIO.CLASE_TITULO.UPDATE |
| GET | `/api/societario/dividendo` | `societario.dividendo` | `-` | create: SOCIETARIO.DIVIDENDO.CREATE, read: SOCIETARIO.DIVIDENDO.READ, update: SOCIETARIO.DIVIDENDO.UPDATE |
| GET | `/api/societario/dividendo/:id_dividendo` | `societario.dividendo` | `id_dividendo` | create: SOCIETARIO.DIVIDENDO.CREATE, read: SOCIETARIO.DIVIDENDO.READ, update: SOCIETARIO.DIVIDENDO.UPDATE |
| POST | `/api/societario/dividendo` | `societario.dividendo` | `-` | create: SOCIETARIO.DIVIDENDO.CREATE, read: SOCIETARIO.DIVIDENDO.READ, update: SOCIETARIO.DIVIDENDO.UPDATE |
| PUT/PATCH | `/api/societario/dividendo/:id_dividendo` | `societario.dividendo` | `id_dividendo` | create: SOCIETARIO.DIVIDENDO.CREATE, read: SOCIETARIO.DIVIDENDO.READ, update: SOCIETARIO.DIVIDENDO.UPDATE |
| GET | `/api/societario/dividendo-pago` | `societario.dividendo_pago` | `-` | create: SOCIETARIO.DIVIDENDO_PAGO.CREATE, read: SOCIETARIO.DIVIDENDO_PAGO.READ, update: SOCIETARIO.DIVIDENDO_PAGO.UPDATE |
| GET | `/api/societario/dividendo-pago/:id_dividendo_pago` | `societario.dividendo_pago` | `id_dividendo_pago` | create: SOCIETARIO.DIVIDENDO_PAGO.CREATE, read: SOCIETARIO.DIVIDENDO_PAGO.READ, update: SOCIETARIO.DIVIDENDO_PAGO.UPDATE |
| POST | `/api/societario/dividendo-pago` | `societario.dividendo_pago` | `-` | create: SOCIETARIO.DIVIDENDO_PAGO.CREATE, read: SOCIETARIO.DIVIDENDO_PAGO.READ, update: SOCIETARIO.DIVIDENDO_PAGO.UPDATE |
| PUT/PATCH | `/api/societario/dividendo-pago/:id_dividendo_pago` | `societario.dividendo_pago` | `id_dividendo_pago` | create: SOCIETARIO.DIVIDENDO_PAGO.CREATE, read: SOCIETARIO.DIVIDENDO_PAGO.READ, update: SOCIETARIO.DIVIDENDO_PAGO.UPDATE |
| GET | `/api/societario/emision-titulo` | `societario.emision_titulo` | `-` | create: SOCIETARIO.EMISION_TITULO.CREATE, read: SOCIETARIO.EMISION_TITULO.READ, update: SOCIETARIO.EMISION_TITULO.UPDATE |
| GET | `/api/societario/emision-titulo/:id_emision` | `societario.emision_titulo` | `id_emision` | create: SOCIETARIO.EMISION_TITULO.CREATE, read: SOCIETARIO.EMISION_TITULO.READ, update: SOCIETARIO.EMISION_TITULO.UPDATE |
| POST | `/api/societario/emision-titulo` | `societario.emision_titulo` | `-` | create: SOCIETARIO.EMISION_TITULO.CREATE, read: SOCIETARIO.EMISION_TITULO.READ, update: SOCIETARIO.EMISION_TITULO.UPDATE |
| PUT/PATCH | `/api/societario/emision-titulo/:id_emision` | `societario.emision_titulo` | `id_emision` | create: SOCIETARIO.EMISION_TITULO.CREATE, read: SOCIETARIO.EMISION_TITULO.READ, update: SOCIETARIO.EMISION_TITULO.UPDATE |
| GET | `/api/societario/tenencia` | `societario.tenencia` | `-` | create: SOCIETARIO.TENENCIA.CREATE, read: SOCIETARIO.TENENCIA.READ, update: SOCIETARIO.TENENCIA.UPDATE |
| GET | `/api/societario/tenencia/:id_tenencia` | `societario.tenencia` | `id_tenencia` | create: SOCIETARIO.TENENCIA.CREATE, read: SOCIETARIO.TENENCIA.READ, update: SOCIETARIO.TENENCIA.UPDATE |
| POST | `/api/societario/tenencia` | `societario.tenencia` | `-` | create: SOCIETARIO.TENENCIA.CREATE, read: SOCIETARIO.TENENCIA.READ, update: SOCIETARIO.TENENCIA.UPDATE |
| PUT/PATCH | `/api/societario/tenencia/:id_tenencia` | `societario.tenencia` | `id_tenencia` | create: SOCIETARIO.TENENCIA.CREATE, read: SOCIETARIO.TENENCIA.READ, update: SOCIETARIO.TENENCIA.UPDATE |
| GET | `/api/societario/titular` | `societario.titular` | `-` | create: SOCIETARIO.TITULAR.CREATE, read: SOCIETARIO.TITULAR.READ, update: SOCIETARIO.TITULAR.UPDATE |
| GET | `/api/societario/titular/:id_titular` | `societario.titular` | `id_titular` | create: SOCIETARIO.TITULAR.CREATE, read: SOCIETARIO.TITULAR.READ, update: SOCIETARIO.TITULAR.UPDATE |
| POST | `/api/societario/titular` | `societario.titular` | `-` | create: SOCIETARIO.TITULAR.CREATE, read: SOCIETARIO.TITULAR.READ, update: SOCIETARIO.TITULAR.UPDATE |
| PUT/PATCH | `/api/societario/titular/:id_titular` | `societario.titular` | `id_titular` | create: SOCIETARIO.TITULAR.CREATE, read: SOCIETARIO.TITULAR.READ, update: SOCIETARIO.TITULAR.UPDATE |
| GET | `/api/societario/transferencia-titulo` | `societario.transferencia_titulo` | `-` | create: SOCIETARIO.TRANSFERENCIA_TITULO.CREATE, read: SOCIETARIO.TRANSFERENCIA_TITULO.READ, update: SOCIETARIO.TRANSFERENCIA_TITULO.UPDATE |
| GET | `/api/societario/transferencia-titulo/:id_transferencia` | `societario.transferencia_titulo` | `id_transferencia` | create: SOCIETARIO.TRANSFERENCIA_TITULO.CREATE, read: SOCIETARIO.TRANSFERENCIA_TITULO.READ, update: SOCIETARIO.TRANSFERENCIA_TITULO.UPDATE |
| POST | `/api/societario/transferencia-titulo` | `societario.transferencia_titulo` | `-` | create: SOCIETARIO.TRANSFERENCIA_TITULO.CREATE, read: SOCIETARIO.TRANSFERENCIA_TITULO.READ, update: SOCIETARIO.TRANSFERENCIA_TITULO.UPDATE |
| PUT/PATCH | `/api/societario/transferencia-titulo/:id_transferencia` | `societario.transferencia_titulo` | `id_transferencia` | create: SOCIETARIO.TRANSFERENCIA_TITULO.CREATE, read: SOCIETARIO.TRANSFERENCIA_TITULO.READ, update: SOCIETARIO.TRANSFERENCIA_TITULO.UPDATE |
