# Mapa de endpoints usados por el frontend
El frontend genera navegación y servicios desde la matriz de endpoints de `docs/endpoints/endpoints.md`.

## Administración
- **Departamento**: `GET /api/administracion/departamento`, `POST /api/administracion/departamento`, `PATCH /api/administracion/departamento/:id_departamento`
- **Empleado**: `GET /api/administracion/empleado`, `POST /api/administracion/empleado`, `PATCH /api/administracion/empleado/:id_empleado`
- **Empleado Posicion Pago**: `GET /api/administracion/empleado-posicion-pago`, `POST /api/administracion/empleado-posicion-pago`, `PATCH /api/administracion/empleado-posicion-pago/:id_empleado_posicion`
- **Empleado Registro Pago**: `GET /api/administracion/empleado-registro-pago`, `POST /api/administracion/empleado-registro-pago`, `PATCH /api/administracion/empleado-registro-pago/:id_pago`
- **Kpi**: `GET /api/administracion/kpi`, `POST /api/administracion/kpi`, `PATCH /api/administracion/kpi/:id_kpi`
- **Objetivo Kpi**: `GET /api/administracion/objetivo-kpi`, `POST /api/administracion/objetivo-kpi`, `PATCH /api/administracion/objetivo-kpi/:id_objetivo_kpi`
- **Posicion**: `GET /api/administracion/posicion`, `POST /api/administracion/posicion`, `PATCH /api/administracion/posicion/:id_posicion`

## Contabilidad
- **Archivos Transaccion**: `GET /api/contabilidad/archivos-transaccion`, `POST /api/contabilidad/archivos-transaccion`, `PATCH /api/contabilidad/archivos-transaccion/:id_archivo`
- **Centro Costo**: `GET /api/contabilidad/centro-costo`, `POST /api/contabilidad/centro-costo`, `PATCH /api/contabilidad/centro-costo/:id_centro_costo`
- **Centro Costo Mapa**: `GET /api/contabilidad/centro-costo-mapa`, `POST /api/contabilidad/centro-costo-mapa`, `PATCH /api/contabilidad/centro-costo-mapa/:id_cc_mapa`
- **Concepto Costo**: `GET /api/contabilidad/concepto-costo`, `POST /api/contabilidad/concepto-costo`, `PATCH /api/contabilidad/concepto-costo/:id_concepto`
- **Cuenta**: `GET /api/contabilidad/cuenta`, `POST /api/contabilidad/cuenta`, `PATCH /api/contabilidad/cuenta/:id_cuenta`
- **Cuenta Asignacion**: `GET /api/contabilidad/cuenta-asignacion`, `POST /api/contabilidad/cuenta-asignacion`, `PATCH /api/contabilidad/cuenta-asignacion/:id_cuenta_asignacion`
- **Grupo Cuenta**: `GET /api/contabilidad/grupo-cuenta`, `POST /api/contabilidad/grupo-cuenta`, `PATCH /api/contabilidad/grupo-cuenta/:id_grupo_cuenta`
- **Pago Tutor**: `GET /api/contabilidad/pago-tutor`, `POST /api/contabilidad/pago-tutor`, `PATCH /api/contabilidad/pago-tutor/:id_pago_tutor`
- **Pago Tutor Detalle**: `GET /api/contabilidad/pago-tutor-detalle`, `POST /api/contabilidad/pago-tutor-detalle`, `PATCH /api/contabilidad/pago-tutor-detalle/:id_pago_tutor_detalle`
- **Transaccion**: `GET /api/contabilidad/transaccion`, `POST /api/contabilidad/transaccion`, `PATCH /api/contabilidad/transaccion/:id_transaccion`
- **Transaccion Movimiento Cuenta**: `GET /api/contabilidad/transaccion-movimiento-cuenta`, `POST /api/contabilidad/transaccion-movimiento-cuenta`, `PATCH /api/contabilidad/transaccion-movimiento-cuenta/:id_movimiento`

## Deuda
- **Deuda**: `GET /api/deuda/deuda`, `POST /api/deuda/deuda`, `PATCH /api/deuda/deuda/:id_deuda`
- **Pago**: `GET /api/deuda/pago`, `POST /api/deuda/pago`, `PATCH /api/deuda/pago/:id_pago`

## Infraestructura
- **Edificio**: `GET /api/infraestructura/edificio`, `POST /api/infraestructura/edificio`, `PATCH /api/infraestructura/edificio/:id_edificio`
- **Encargado**: `GET /api/infraestructura/encargado`, `POST /api/infraestructura/encargado`, `PATCH /api/infraestructura/encargado/:id_asignacion`
- **Espacio**: `GET /api/infraestructura/espacio`, `POST /api/infraestructura/espacio`, `PATCH /api/infraestructura/espacio/:id_espacio`
- **Sucursal**: `GET /api/infraestructura/sucursal`, `POST /api/infraestructura/sucursal`, `PATCH /api/infraestructura/sucursal/:id_sucursal`
- **Tienda**: `GET /api/infraestructura/tienda`, `POST /api/infraestructura/tienda`, `PATCH /api/infraestructura/tienda/:id_tienda`

## Inventario
- **Bien**: `GET /api/inventario/bien`, `POST /api/inventario/bien`, `PATCH /api/inventario/bien/:id_bien`
- **Bien Instancia**: `GET /api/inventario/bien-instancia`, `POST /api/inventario/bien-instancia`, `PATCH /api/inventario/bien-instancia/:id_bien_instancia`
- **Bien Lote**: `GET /api/inventario/bien-lote`, `POST /api/inventario/bien-lote`, `PATCH /api/inventario/bien-lote/:id_lote`
- **Movimiento Detalle**: `GET /api/inventario/movimiento-detalle`, `POST /api/inventario/movimiento-detalle`, `PATCH /api/inventario/movimiento-detalle/:id_movimiento`

## Personas
- **Estudiante**: `GET /api/personas/estudiante`, `POST /api/personas/estudiante`, `PATCH /api/personas/estudiante/:id_persona`
- **Estudiante Padre**: `GET /api/personas/estudiante-padre`, `POST /api/personas/estudiante-padre`, `PATCH /api/personas/estudiante-padre/:id_asociacion`
- **Padre**: `GET /api/personas/padre`, `POST /api/personas/padre`, `PATCH /api/personas/padre/:id_padre`
- **Proveedor**: `GET /api/personas/proveedor`, `POST /api/personas/proveedor`, `PATCH /api/personas/proveedor/:id_proveedor`
- **Tutor**: `GET /api/personas/tutor`, `POST /api/personas/tutor`, `PATCH /api/personas/tutor/:id_tutor`
- **Unidad Educativa**: `GET /api/personas/unidad-educativa`, `POST /api/personas/unidad-educativa`, `PATCH /api/personas/unidad-educativa/:id_unidad_educativa`
- **Usuario**: `GET /api/personas/usuario`, `POST /api/personas/usuario`, `PATCH /api/personas/usuario/:id_persona`

## Seguridad
- **Permiso**: `GET /api/seguridad/permiso`, `POST /api/seguridad/permiso`, `PATCH /api/seguridad/permiso/:id_permiso`
- **Rol**: `GET /api/seguridad/rol`, `POST /api/seguridad/rol`, `PATCH /api/seguridad/rol/:id_rol`
- **Rol Permiso**: `GET /api/seguridad/rol-permiso`, `POST /api/seguridad/rol-permiso`, `PATCH /api/seguridad/rol-permiso/:id_rol/:id_permiso`
- **Usuario Permiso**: `GET /api/seguridad/usuario-permiso`, `POST /api/seguridad/usuario-permiso`, `PATCH /api/seguridad/usuario-permiso/:id_persona/:id_permiso`
- **Usuario Rol**: `GET /api/seguridad/usuario-rol`, `POST /api/seguridad/usuario-rol`, `PATCH /api/seguridad/usuario-rol/:id_persona/:id_rol`

## Servicios educativos
- **Asistencia Clase Curso**: `GET /api/servicios_educativos/asistencia-clase-curso`, `POST /api/servicios_educativos/asistencia-clase-curso`, `PATCH /api/servicios_educativos/asistencia-clase-curso/:id_asistencia`
- **Clase Curso**: `GET /api/servicios_educativos/clase-curso`, `POST /api/servicios_educativos/clase-curso`, `PATCH /api/servicios_educativos/clase-curso/:id_clase_curso`
- **Clase Por Hora**: `GET /api/servicios_educativos/clase-por-hora`, `POST /api/servicios_educativos/clase-por-hora`, `PATCH /api/servicios_educativos/clase-por-hora/:id_clase`
- **Curso Version**: `GET /api/servicios_educativos/curso-version`, `POST /api/servicios_educativos/curso-version`, `PATCH /api/servicios_educativos/curso-version/:id_curso_version`
- **Horarios**: `GET /api/servicios_educativos/horarios`, `POST /api/servicios_educativos/horarios`, `PATCH /api/servicios_educativos/horarios/:id_horario`
- **Materia Tree**: `GET /api/servicios_educativos/materia-tree`, `POST /api/servicios_educativos/materia-tree`, `PATCH /api/servicios_educativos/materia-tree/:id_tree`
- **Paquetes Producto Educativo**: `GET /api/servicios_educativos/paquetes-producto-educativo`, `POST /api/servicios_educativos/paquetes-producto-educativo`, `PATCH /api/servicios_educativos/paquetes-producto-educativo/:id_paquete`
- **Producto Educativo**: `GET /api/servicios_educativos/producto-educativo`, `POST /api/servicios_educativos/producto-educativo`, `PATCH /api/servicios_educativos/producto-educativo/:id_producto_educativo`

## Societario
- **Clase Titulo**: `GET /api/societario/clase-titulo`, `POST /api/societario/clase-titulo`, `PATCH /api/societario/clase-titulo/:id_clase_titulo`
- **Dividendo**: `GET /api/societario/dividendo`, `POST /api/societario/dividendo`, `PATCH /api/societario/dividendo/:id_dividendo`
- **Dividendo Pago**: `GET /api/societario/dividendo-pago`, `POST /api/societario/dividendo-pago`, `PATCH /api/societario/dividendo-pago/:id_dividendo_pago`
- **Emision Titulo**: `GET /api/societario/emision-titulo`, `POST /api/societario/emision-titulo`, `PATCH /api/societario/emision-titulo/:id_emision`
- **Tenencia**: `GET /api/societario/tenencia`, `POST /api/societario/tenencia`, `PATCH /api/societario/tenencia/:id_tenencia`
- **Titular**: `GET /api/societario/titular`, `POST /api/societario/titular`, `PATCH /api/societario/titular/:id_titular`
- **Transferencia Titulo**: `GET /api/societario/transferencia-titulo`, `POST /api/societario/transferencia-titulo`, `PATCH /api/societario/transferencia-titulo/:id_transferencia`
