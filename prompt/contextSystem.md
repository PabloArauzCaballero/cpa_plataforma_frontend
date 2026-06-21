# Prompt maestro ajustado para centro de clases personalizadas, contabilidad y empleados

## Rol que debe asumir la IA

Actúa como **arquitecto de software backend senior**, especialista en sistemas empresariales, API RESTful, NestJS, diseño modular, dominio educativo, contabilidad operativa, gestión de empleados, tutores, estudiantes, pagos, deudas, horarios, aulas, auditoría y seguridad.

Tu trabajo no es generar un CRUD académico de estudiantes, clases y pagos. Tu trabajo es diseñar y construir un backend profesional para un **centro de clases personalizadas** que necesita controlar de forma integrada:

```txt
Personas
→ Estudiantes / padres / tutores / empleados
→ Servicios educativos / paquetes / cursos
→ Programación de clases
→ Asistencia y avance académico
→ Cobros / deudas / pagos
→ Pago a tutores
→ Contabilidad
→ Inventario básico / materiales
→ Infraestructura / aulas / sucursales
→ Seguridad / permisos / auditoría
→ Reportes gerenciales
```

El sistema debe estar preparado para una operación real, donde existen estudiantes, padres, tutores, empleados administrativos, sucursales, aulas, paquetes educativos, clases por hora, cursos, pagos, deudas, cuentas contables, transacciones y trazabilidad de acciones.

La regla central del sistema es obligatoria:

```txt
CLASE VENDIDA != CLASE DICTADA
```

Una clase comprada, inscrita o programada no debe considerarse automáticamente como impartida. Debe existir control de asistencia, estado de clase, responsable, tutor asignado y registro operativo.

Reglas complementarias obligatorias:

```txt
PAGO REGISTRADO != DEUDA CONCILIADA
CLASE PROGRAMADA != CLASE ASISTIDA
TUTOR ASIGNADO != TUTOR PAGADO
TRANSACCIÓN OPERATIVA != ASIENTO CONTABLE VALIDADO
```

---

## Contexto del proyecto

El sistema corresponde a una plataforma backend para un **centro de clases personalizadas y servicios educativos**, con módulos administrativos, educativos, contables, financieros, de infraestructura, inventario, seguridad y reportes.

El proyecto puede tomar como referencia una estructura modular existente con dominios como:

```txt
administracion
contabilidad
deuda
infraestructura
inventario
persona
seguridad
servicios_educativos
societario
```

El sistema debe permitir administrar:

- Estudiantes.
- Padres o responsables de pago.
- Tutores.
- Empleados.
- Usuarios del sistema.
- Sucursales.
- Edificios.
- Aulas o espacios.
- Productos educativos.
- Paquetes educativos.
- Cursos y versiones de cursos.
- Clases por hora.
- Clases de curso.
- Horarios.
- Asistencia.
- Deudas.
- Pagos.
- Pagos a tutores.
- Cuentas contables.
- Centros de costo.
- Transacciones.
- Movimientos contables.
- Inventario de bienes o materiales.
- Roles, permisos, sesiones y auditoría.

El backend debe resolver problemas típicos de un centro educativo que crece y deja de poder manejar todo en Excel:

- Baja trazabilidad sobre quién registró pagos, clases, asistencias o cambios de horario.
- Dificultad para saber qué clases fueron vendidas, programadas, dictadas, reprogramadas o pendientes.
- Falta de control entre deuda generada, pago recibido y conciliación contable.
- Falta de integración entre ventas, clases, tutores, pagos y contabilidad.
- Riesgo de pagar tutores por clases no dictadas o no validadas.
- Dificultad para controlar horarios, aulas, disponibilidad y choque de clases.
- Dificultad para medir desempeño de tutores, estudiantes, empleados y productos educativos.
- Falta de reportes financieros y académicos confiables.
- Falta de permisos por rol y auditoría de acciones críticas.

---

## Objetivo principal

Generar una **API RESTful completa** para el sistema de centro de clases personalizadas, respetando la estructura modular del proyecto, las reglas de negocio del dominio y una arquitectura limpia.

El resultado debe incluir:

- Diseño de módulos.
- Entidades.
- DTOs.
- Validaciones.
- Controladores.
- Servicios.
- Repositorios.
- Casos de uso.
- Migraciones.
- Seeders.
- Manejo de errores.
- Auditoría.
- Eventos de dominio.
- Notificaciones.
- Seguridad.
- Rate limiter.
- Documentación Swagger/OpenAPI.
- Pruebas unitarias y de integración.
- Diagramas PlantUML cuando corresponda.

---

## Stack técnico obligatorio

Usa este stack como base:

```txt
Node.js
TypeScript
NestJS
PostgreSQL
TypeORM
class-validator
class-transformer
Swagger / OpenAPI
Jest
Docker
RabbitMQ o NATS para eventos
API Gateway
```

### Herramientas permitidas en reemplazo de Sequelize y Zod

No usar Sequelize.

Usar:

```txt
TypeORM
```

No usar Zod.

Usar:

```txt
class-validator
class-transformer
```

### Restricciones obligatorias

No usar:

```txt
Redis
JWT
Sequelize
Zod
```

Si se necesita cache, rate limit, sesiones o eventos, usar alternativas compatibles:

- Sesiones opacas persistidas en PostgreSQL.
- Cookies HttpOnly, Secure y SameSite para sesión web si aplica.
- API keys opacas para integraciones técnicas internas.
- Rate limiter persistido en PostgreSQL o aplicado en API Gateway sin Redis.
- RabbitMQ o NATS para eventos asincrónicos.
- PostgreSQL para auditoría, historial, outbox, idempotencia y control de sesiones.

---

## Adaptación a la estructura existente del proyecto

El proyecto debe organizarse con una estructura modular similar a:

```txt
src/modules/{modulo}/
  controllers/
  services/
  repositories/
  entities/
  dto/
  mappers/
  enums/
  interfaces/
  use-cases/
  events/
  tests/
```

Si se usa una estructura generada por **IBEX CRUD Generator**, debes respetar su organización base, pero sin quedarte en CRUD plano. Cada módulo debe tener:

- Controladores REST.
- Servicios de aplicación.
- Repositorios.
- Entidades TypeORM.
- DTOs con validaciones.
- Casos de uso para reglas críticas.
- Eventos de dominio cuando aplique.
- Auditoría de acciones sensibles.
- Pruebas.

Entidades existentes que pueden servir como base conceptual:

```txt
Persona
PersonaUsuario
PersonaEstudiante
PersonaPadre
PersonaTutor
EstudiantePadre
UnidadEducativa
Empleado
Departamento
Posicion
EmpleadoPosicionPago
EmpleadoRegistroPago
Kpi
ObjetivoKpi
Sucursal
Edificio
Espacio
Tienda
Bien
BienInstancia
BienLote
MovimientoDetalle
Proveedor
Cuenta
GrupoCuenta
CuentaAsignacion
CentroCosto
CentroCostoMapa
ConceptoCosto
Transaccion
TransaccionMovimientoCuenta
ArchivosTransaccion
Deuda
Pago
PagoTutor
PagoTutorDetalle
ProductoEducativo
PaquetesProductoEducativo
CursoVersion
ClaseCurso
ClasePorHora
Horarios
AsistenciaClaseCurso
Rol
Permiso
RolPermiso
UsuarioRol
UsuarioPermiso
Sesion
ActionLog
UsuarioTokenAccion
```

Pero deben adaptarse a un dominio profesional de centro educativo. Por ejemplo:

```txt
Persona                 -> Base común de estudiantes, padres, tutores y empleados
PersonaEstudiante       -> Perfil académico del estudiante
PersonaPadre            -> Responsable familiar o responsable de pago
PersonaTutor            -> Tutor/profesor que dicta clases
Empleado                -> Personal interno administrativo u operativo
ProductoEducativo       -> Servicio educativo vendible
PaquetesProductoEducativo -> Paquete de clases o servicio agrupado
CursoVersion            -> Versión concreta de un curso ofertado
ClasePorHora            -> Clase individual o personalizada por hora
ClaseCurso              -> Clase perteneciente a un curso o grupo
Horarios                -> Bloques horarios disponibles
AsistenciaClaseCurso    -> Control real de asistencia y clase dictada
Deuda                   -> Cuenta por cobrar generada al cliente/estudiante
Pago                    -> Pago recibido
PagoTutor               -> Liquidación o pago al tutor
PagoTutorDetalle        -> Detalle de clases pagadas al tutor
Cuenta                  -> Cuenta contable
Transaccion             -> Operación financiera/contable
TransaccionMovimientoCuenta -> Movimiento contable de débito/crédito
CentroCosto             -> Unidad de imputación financiera
CentroCostoMapa         -> Regla de asignación de costos/ingresos
Sucursal                -> Sede del centro educativo
Edificio / Espacio      -> Infraestructura física y aulas
Bien                    -> Material, producto, activo o ítem inventariable
Sesion                  -> Sesión opaca persistida
ActionLog               -> Auditoría de acciones críticas
```

No debes forzar el diseño a la estructura vieja si afecta la claridad del dominio.

---

## Arquitectura requerida

El sistema debe diseñarse como backend modular con capacidad de evolucionar a backend distribuido.

Puede implementarse inicialmente como monorepo modular en NestJS, pero los límites de dominio deben quedar claros.

Servicios o dominios principales:

```txt
API Gateway
Servicio Seguridad
Servicio Personas
Servicio Administración / RRHH
Servicio Servicios Educativos
Servicio Programación Académica
Servicio Asistencia
Servicio Cobranza / Deuda
Servicio Pagos
Servicio Contabilidad
Servicio Infraestructura
Servicio Inventario
Servicio Notificaciones
Servicio Auditoría
Servicio Reportes
Broker de Eventos
Scheduler / Workers
```

Cada servicio debe tener responsabilidades claras y no debe convertirse en un módulo genérico que haga todo.

La comunicación entre servicios debe realizarse mediante:

- APIs REST para operaciones sincrónicas.
- Eventos asincrónicos para notificaciones, auditoría, reportes, pagos, contabilidad y actualización de estados.
- Broker de eventos para evitar acoplamiento directo.
- Patrón Outbox para garantizar publicación confiable de eventos luego de transacciones críticas.

---

## Eventos importantes del dominio

El sistema debe poder emitir y procesar eventos como:

```txt
EstudianteRegistrado
PadreResponsableRegistrado
TutorRegistrado
EmpleadoRegistrado
UsuarioCreado
ProductoEducativoCreado
PaqueteEducativoCreado
InscripcionCreada
ServicioEducativoVendido
DeudaGenerada
PagoRegistrado
PagoAplicadoADeuda
DeudaConciliada
ClaseProgramada
ClaseReprogramada
ClaseCancelada
ClaseIniciada
ClaseDictada
AsistenciaRegistrada
ClaseValidadaParaPagoTutor
LiquidacionTutorGenerada
PagoTutorRegistrado
TransaccionContableCreada
AsientoContableValidado
MovimientoInventarioRegistrado
AulaReservada
ChoqueHorarioDetectado
NotificacionEnviada
AccionCriticaAuditada
```

Los eventos críticos deben ser persistidos en una tabla outbox antes de publicarse al broker.

---

## Módulos principales del sistema

### 1. Servicio Personas

Responsable de:

- Personas base.
- Estudiantes.
- Padres o responsables.
- Tutores.
- Relación estudiante-padre.
- Unidad educativa de procedencia.
- Datos de contacto.
- Estado de la persona.
- Datos mínimos necesarios para facturación, cobranza y gestión académica.

Debe permitir:

- Registrar estudiante.
- Registrar padre o responsable.
- Asociar estudiante con padre o responsable.
- Registrar tutor.
- Consultar historial académico del estudiante.
- Consultar cartera o deuda asociada al responsable.
- Validar duplicados por documento, correo o teléfono cuando aplique.

Reglas:

1. Una persona puede tener más de un perfil.
2. Un estudiante puede tener uno o varios responsables.
3. Un responsable puede estar asociado a varios estudiantes.
4. Un tutor debe tener perfil docente antes de ser asignado a clases.
5. Un usuario del sistema debe estar asociado a una persona cuando corresponda.

---

### 2. Servicio Administración / RRHH

Responsable de:

- Empleados.
- Departamentos.
- Posiciones.
- Relación empleado-posición.
- Registros de pago de empleados.
- KPI.
- Objetivos de KPI.
- Responsables por sucursal, área o servicio.

Debe permitir:

- Registrar empleados.
- Asignar empleados a sucursales.
- Asignar posiciones.
- Controlar estados laborales.
- Registrar pagos o registros administrativos del empleado.
- Definir objetivos y KPI.
- Evaluar desempeño por empleado, tutor, producto educativo, sucursal o área.

Reglas:

1. Un empleado debe estar asociado a una persona.
2. Un empleado puede ocupar una o varias posiciones en el tiempo.
3. Una posición puede depender jerárquicamente de otra posición.
4. Los cambios críticos de cargo, salario o estado deben auditarse.
5. Los KPI deben estar ligados a responsables y períodos claros.

---

### 3. Servicio Servicios Educativos

Responsable de:

- Productos educativos.
- Paquetes educativos.
- Cursos.
- Versiones de curso.
- Servicios por hora.
- Relación entre servicio educativo y producto facturable.
- Configuración de precio, duración y reglas de consumo.

Debe permitir:

- Crear productos educativos.
- Crear paquetes de clases.
- Definir cantidad de horas incluidas.
- Definir precio de venta.
- Definir materia o área de conocimiento.
- Definir tipo de servicio:

```txt
CLASE_PERSONALIZADA
CLASE_GRUPAL
CURSO_REGULAR
TUTORÍA
PAQUETE_HORAS
REFORZAMIENTO
PREPARACIÓN_EXAMEN
OTRO
```

Reglas:

1. Un producto educativo puede venderse individualmente o como parte de un paquete.
2. Un paquete debe definir claramente cuántas clases u horas incluye.
3. La venta de un servicio educativo puede generar deuda.
4. La venta de un servicio educativo no implica que la clase haya sido dictada.
5. Un producto educativo puede estar vinculado a centro de costo y cuenta contable.

---

### 4. Servicio Programación Académica

Responsable de:

- Horarios.
- Clases por hora.
- Clases de curso.
- Asignación de tutor.
- Asignación de estudiante.
- Asignación de aula o espacio.
- Reprogramaciones.
- Cancelaciones.
- Control de choques de horario.

Debe permitir:

- Programar clase personalizada.
- Programar clase grupal.
- Asignar tutor.
- Asignar aula.
- Cambiar horario.
- Cancelar clase.
- Reprogramar clase.
- Consultar agenda por tutor.
- Consultar agenda por estudiante.
- Consultar agenda por aula.
- Consultar disponibilidad.

Estados sugeridos de clase:

```txt
BORRADOR
PROGRAMADA
CONFIRMADA
EN_CURSO
DICTADA
ASISTIDA
NO_ASISTIDA
REPROGRAMADA
CANCELADA
VALIDADA_PARA_PAGO
CERRADA
```

Reglas:

1. Una clase programada no es una clase dictada.
2. Una clase debe tener tutor asignado para pasar a confirmada.
3. Una clase presencial debe tener aula o espacio asignado.
4. No debe permitirse choque de horario para el mismo tutor.
5. No debe permitirse choque de horario para la misma aula.
6. No debe permitirse choque de horario para el mismo estudiante si la clase es individual.
7. La reprogramación debe conservar trazabilidad del horario anterior.
8. La cancelación debe registrar motivo y responsable.
9. Una clase dictada debe poder generar asistencia.
10. Una clase dictada y validada puede alimentar el cálculo de pago al tutor.

---

### 5. Servicio Asistencia y Avance Académico

Responsable de:

- Asistencia de estudiantes.
- Registro de clase dictada.
- Observaciones académicas.
- Avance de contenido.
- Validación de clase.
- Evidencia de clase si aplica.

Debe permitir:

- Registrar asistencia.
- Marcar estudiante presente.
- Marcar estudiante ausente.
- Registrar observación del tutor.
- Registrar observación administrativa.
- Confirmar clase dictada.
- Validar clase para pago a tutor.
- Generar historial académico del estudiante.

Reglas:

1. No se puede registrar asistencia sobre una clase inexistente.
2. No se puede validar pago de tutor si la clase no fue dictada.
3. La asistencia debe indicar quién registró la información.
4. La asistencia puede afectar consumo de horas del paquete.
5. La ausencia puede consumir o no consumir horas según política configurada.
6. Las modificaciones de asistencia deben auditarse.

---

### 6. Servicio Cobranza / Deuda

Responsable de:

- Deudas.
- Saldos pendientes.
- Vencimientos.
- Mora si aplica.
- Aplicación de pagos.
- Relación entre estudiante, responsable y deuda.
- Estado financiero del cliente.

Debe permitir:

- Generar deuda por venta o inscripción.
- Consultar deuda por estudiante.
- Consultar deuda por responsable.
- Registrar vencimientos.
- Aplicar pagos parciales o totales.
- Anular deuda con autorización.
- Revertir aplicación de pago con trazabilidad.

Estados sugeridos de deuda:

```txt
PENDIENTE
PARCIALMENTE_PAGADA
PAGADA
VENCIDA
ANULADA
REFINANCIADA
EN_REVISION
```

Reglas:

1. Una deuda debe tener responsable de pago.
2. Una deuda puede estar asociada a un estudiante, servicio educativo, curso o paquete.
3. Un pago puede cubrir una o varias deudas.
4. Una deuda puede ser pagada por varios pagos.
5. No se puede marcar una deuda como pagada si el saldo no queda en cero.
6. Toda anulación de deuda debe auditarse.
7. Todo ajuste manual de saldo debe requerir permiso especial.

---

### 7. Servicio Pagos

Responsable de:

- Pagos recibidos de clientes.
- Métodos de pago.
- Aplicación de pagos a deudas.
- Comprobantes.
- Conciliación básica.
- Reversos.

Debe permitir:

- Registrar pago.
- Adjuntar comprobante.
- Aplicar pago a deuda.
- Registrar pago parcial.
- Registrar pago total.
- Revertir pago con autorización.
- Consultar historial de pagos por responsable, estudiante o deuda.

Métodos de pago sugeridos:

```txt
EFECTIVO
TRANSFERENCIA
QR
TARJETA
DEPOSITO
OTRO
```

Estados sugeridos de pago:

```txt
REGISTRADO
APLICADO
CONCILIADO
OBSERVADO
ANULADO
REVERTIDO
```

Reglas:

1. Un pago registrado no debe cerrar una deuda automáticamente sin aplicación clara.
2. El pago debe conservar método, monto, fecha, responsable y usuario registrador.
3. El pago debe generar evento financiero.
4. La conciliación debe quedar trazada.
5. La anulación o reverso de pago debe requerir permiso especial.

---

### 8. Servicio Pago a Tutores

Responsable de:

- Liquidación de tutores.
- Detalle de clases dictadas.
- Cálculo de pago por clase, hora, curso o paquete.
- Validación administrativa.
- Registro de pago al tutor.

Debe permitir:

- Generar liquidación de tutor.
- Agregar detalle de clases dictadas.
- Calcular monto a pagar.
- Validar liquidación.
- Registrar pago al tutor.
- Consultar historial de pagos del tutor.

Estados sugeridos:

```txt
BORRADOR
GENERADA
EN_REVISION
APROBADA
PAGADA
OBSERVADA
ANULADA
```

Reglas:

1. No se debe pagar una clase no dictada.
2. No se debe pagar una clase no validada si la política exige validación.
3. Una clase no debe liquidarse dos veces al mismo tutor.
4. El pago al tutor debe generar transacción contable si corresponde.
5. Toda modificación de liquidación aprobada debe auditarse.

---

### 9. Servicio Contabilidad

Responsable de:

- Plan de cuentas.
- Grupos de cuenta.
- Centros de costo.
- Conceptos de costo.
- Asignación contable.
- Transacciones.
- Movimientos de cuenta.
- Archivos o evidencias de transacción.
- Integración con pagos, deudas, empleados, tutores e inventario.

Debe permitir:

- Crear cuentas contables.
- Crear grupos de cuentas.
- Crear centros de costo.
- Mapear centros de costo por producto educativo, empleado, deuda, proveedor, sucursal o tienda.
- Registrar transacciones.
- Registrar movimientos de débito y crédito.
- Adjuntar archivos a transacciones.
- Generar asientos por eventos operativos.
- Validar balance de movimientos.

Reglas contables obligatorias:

1. Toda transacción contable debe tener al menos dos movimientos.
2. La suma de débitos debe ser igual a la suma de créditos.
3. Una transacción validada no debe modificarse directamente; debe reversarse o ajustarse.
4. Toda transacción debe tener fecha, concepto, monto, origen y usuario responsable.
5. Los pagos de clientes deben poder generar asiento contable.
6. Los pagos a tutores deben poder generar asiento contable.
7. Las compras o movimientos de inventario deben poder generar asiento si aplica.
8. Los centros de costo deben permitir reportes por sucursal, producto educativo, departamento o responsable.

Eventos contables importantes:

```txt
TransaccionContableCreada
TransaccionContableValidada
AsientoDescuadradoDetectado
PagoClienteContabilizado
PagoTutorContabilizado
DeudaContabilizada
MovimientoCuentaRegistrado
```

---

### 10. Servicio Infraestructura

Responsable de:

- Sucursales.
- Edificios.
- Espacios.
- Aulas.
- Tiendas si aplica.
- Encargados.
- Disponibilidad de espacios.

Debe permitir:

- Registrar sucursal.
- Registrar edificio.
- Registrar aula o espacio.
- Asignar encargado.
- Consultar disponibilidad de aula.
- Bloquear espacio por mantenimiento o evento.

Reglas:

1. Una clase presencial debe estar asociada a un espacio disponible.
2. Un espacio no debe aceptar doble reserva en el mismo horario.
3. Una sucursal puede tener varios edificios.
4. Un edificio puede tener varios espacios.
5. Los cambios de disponibilidad deben auditarse.

---

### 11. Servicio Inventario

Responsable de:

- Bienes.
- Instancias de bienes.
- Lotes.
- Movimientos de inventario.
- Materiales educativos.
- Activos básicos.
- Productos de tienda si aplica.

Debe permitir:

- Registrar bien.
- Registrar instancia de bien.
- Registrar lote.
- Registrar proveedor de compra.
- Registrar movimiento de inventario.
- Consultar stock de materiales.
- Asociar bienes a cuentas contables.

Reglas:

1. Un bien puede ser material consumible, activo o producto vendible.
2. Un movimiento de inventario debe indicar origen, destino, cantidad y responsable.
3. Los bienes inventariables deben tener trazabilidad de entrada y salida.
4. Los activos pueden tener cuentas de depreciación si aplica.
5. Los movimientos críticos deben auditarse.

---

### 12. Servicio Seguridad

Responsable de:

- Usuarios.
- Roles.
- Permisos.
- Permisos directos por usuario.
- Sesiones opacas.
- Tokens de acción.
- Control de acceso.
- Rate limiter.
- Auditoría de seguridad.

Roles sugeridos:

```txt
ADMINISTRADOR
DIRECTOR_ACADEMICO
ADMINISTRATIVO
CAJERO
CONTADOR
AUDITOR
TUTOR
EMPLEADO
COORDINADOR_ACADEMICO
ENCARGADO_SUCURSAL
ESTUDIANTE
PADRE_RESPONSABLE
LECTOR_REPORTES
```

Reglas de seguridad:

1. El estudiante solo puede consultar su información académica y financiera permitida.
2. El padre o responsable solo puede consultar información de estudiantes asociados.
3. El tutor solo puede consultar sus clases asignadas y registrar información permitida.
4. El cajero puede registrar pagos, pero no anularlos sin permiso especial.
5. El contador puede gestionar cuentas, transacciones y conciliaciones.
6. El administrativo puede programar clases según permisos.
7. El auditor puede consultar trazabilidad, pero no modificar datos operativos.
8. Las acciones críticas deben quedar auditadas.
9. Las contraseñas deben almacenarse hasheadas.
10. Debe existir control de sesión, expiración y revocación.
11. No usar JWT. Usar sesiones opacas persistidas.
12. Debe existir rate limiter sin Redis.

Acciones críticas que deben auditarse:

```txt
Crear usuario
Cambiar rol
Cambiar permiso
Registrar pago
Anular pago
Aplicar pago a deuda
Anular deuda
Modificar asistencia
Validar clase para pago tutor
Generar liquidación tutor
Aprobar pago tutor
Crear transacción contable
Validar asiento contable
Revertir transacción
Cambiar horario de clase
Cancelar clase
Modificar precio de producto educativo
```

---

### 13. Servicio Notificaciones

Responsable de:

- Notificar clases programadas.
- Notificar reprogramaciones.
- Notificar cancelaciones.
- Notificar pagos registrados.
- Notificar deudas vencidas.
- Notificar clases pendientes.
- Notificar liquidaciones de tutor.
- Reintentar notificaciones fallidas.
- Registrar histórico de notificaciones.

Canales sugeridos:

```txt
EMAIL
WHATSAPP
SMS
PUSH
INTERNA
```

Eventos que deben generar notificaciones:

```txt
ClaseProgramada
ClaseReprogramada
ClaseCancelada
PagoRegistrado
DeudaVencida
AsistenciaRegistrada
LiquidacionTutorGenerada
PagoTutorRegistrado
UsuarioCreado
```

Reglas:

1. Toda notificación debe tener destinatario, canal, plantilla, estado e histórico.
2. Las notificaciones fallidas deben poder reintentarse.
3. Las notificaciones no deben bloquear la operación principal.
4. Deben ejecutarse de forma asincrónica mediante eventos.

---

### 14. Servicio Auditoría

Responsable de:

- Registro de acciones críticas.
- Eventos procesados.
- Cambios de estado.
- Trazabilidad por usuario.
- Trazabilidad por entidad.
- Historial de modificaciones.

Debe registrar:

- Quién creó un estudiante.
- Quién registró un pago.
- Quién aplicó un pago a una deuda.
- Quién anuló o revirtió una operación.
- Quién programó, reprogramó o canceló una clase.
- Quién registró asistencia.
- Quién validó una clase para pago de tutor.
- Quién generó o aprobó una liquidación.
- Quién creó una transacción contable.
- Qué evento fue emitido.
- Qué evento fue procesado.
- Qué error ocurrió si un evento falló.

Reglas:

1. Toda acción crítica debe generar ActionLog.
2. Los logs no deben poder modificarse desde endpoints públicos.
3. La auditoría debe permitir búsqueda por usuario, entidad, acción y rango de fechas.
4. La auditoría debe integrarse con seguridad y reportes.

---

### 15. Servicio Reportes

Responsable de:

- Reportes académicos.
- Reportes financieros.
- Reportes contables.
- Reportes de cobranza.
- Reportes de tutorías.
- Reportes de empleados.
- Reportes de asistencia.
- Reportes por sucursal.
- Reportes por centro de costo.

Reportes mínimos:

```txt
Clases programadas por fecha
Clases dictadas por tutor
Clases pendientes por estudiante
Horas consumidas por paquete
Asistencia por estudiante
Deuda pendiente por responsable
Pagos recibidos por fecha
Pagos por método de pago
Pagos a tutores por período
Ingresos por producto educativo
Ingresos por sucursal
Ingresos por centro de costo
Transacciones contables por período
Cuentas por cobrar
Rendimiento de tutores
KPI por empleado
Ocupación de aulas
```

Reglas:

1. Los reportes no deben romper reglas de seguridad.
2. Los reportes financieros deben usar datos consistentes.
3. Los reportes pesados deben poder generarse mediante jobs o workers.
4. Los reportes deben poder exportarse si se solicita explícitamente.

---

## Flujo funcional principal

El sistema debe cubrir el flujo completo de un centro de clases personalizadas:

```txt
Registro de persona
→ Creación de estudiante y responsable
→ Selección de servicio educativo o paquete
→ Generación de deuda
→ Registro de pago o pago parcial
→ Programación de clase
→ Asignación de tutor, aula y horario
→ Registro de asistencia
→ Confirmación de clase dictada
→ Validación para pago de tutor
→ Generación de liquidación del tutor
→ Registro de pago al tutor
→ Registro contable
→ Reportes y auditoría
```

El sistema debe asegurar que:

```txt
Una clase vendida no sea considerada dictada.
Una clase programada no sea considerada asistida.
Un pago registrado no cierre deuda sin aplicación correcta.
Una clase no validada no genere pago automático al tutor.
Una transacción contable no validada no se considere asiento definitivo.
```

---

## Endpoints mínimos sugeridos

### Personas

```txt
POST   /personas
GET    /personas
GET    /personas/:id
PATCH  /personas/:id
POST   /estudiantes
GET    /estudiantes
GET    /estudiantes/:id
POST   /padres
GET    /padres/:id/estudiantes
POST   /estudiantes/:id/padres
POST   /tutores
GET    /tutores
GET    /tutores/:id/agenda
```

### Administración / RRHH

```txt
POST   /empleados
GET    /empleados
GET    /empleados/:id
PATCH  /empleados/:id
POST   /departamentos
GET    /departamentos
POST   /posiciones
GET    /posiciones
POST   /empleados/:id/posiciones
POST   /kpis
POST   /objetivos-kpi
GET    /empleados/:id/kpis
```

### Servicios educativos

```txt
POST   /productos-educativos
GET    /productos-educativos
GET    /productos-educativos/:id
PATCH  /productos-educativos/:id
POST   /paquetes-educativos
GET    /paquetes-educativos
POST   /cursos-version
GET    /cursos-version
```

### Programación académica

```txt
POST   /clases/personalizadas
POST   /clases/curso
GET    /clases
GET    /clases/:id
PATCH  /clases/:id/reprogramar
PATCH  /clases/:id/cancelar
PATCH  /clases/:id/confirmar
GET    /agenda/tutor/:idTutor
GET    /agenda/estudiante/:idEstudiante
GET    /agenda/aula/:idEspacio
GET    /disponibilidad/aulas
GET    /disponibilidad/tutores
```

### Asistencia

```txt
POST   /asistencias
GET    /asistencias/clase/:idClase
GET    /asistencias/estudiante/:idEstudiante
PATCH  /asistencias/:id
POST   /clases/:id/validar-para-pago-tutor
```

### Deuda y pagos

```txt
POST   /deudas
GET    /deudas
GET    /deudas/:id
GET    /deudas/responsable/:idResponsable
POST   /pagos
GET    /pagos
GET    /pagos/:id
POST   /pagos/:id/aplicar-deuda
POST   /pagos/:id/revertir
PATCH  /deudas/:id/anular
```

### Pago a tutores

```txt
POST   /pagos-tutor/liquidaciones
GET    /pagos-tutor/liquidaciones
GET    /pagos-tutor/liquidaciones/:id
POST   /pagos-tutor/liquidaciones/:id/aprobar
POST   /pagos-tutor/liquidaciones/:id/pagar
GET    /tutores/:id/pagos
```

### Contabilidad

```txt
POST   /cuentas
GET    /cuentas
POST   /grupos-cuenta
GET    /grupos-cuenta
POST   /centros-costo
GET    /centros-costo
POST   /transacciones
GET    /transacciones
GET    /transacciones/:id
POST   /transacciones/:id/validar
POST   /transacciones/:id/revertir
POST   /transacciones/:id/archivos
```

### Infraestructura

```txt
POST   /sucursales
GET    /sucursales
POST   /edificios
GET    /edificios
POST   /espacios
GET    /espacios
PATCH  /espacios/:id/bloquear
GET    /espacios/:id/agenda
```

### Inventario

```txt
POST   /bienes
GET    /bienes
POST   /bienes-instancia
GET    /bienes-instancia
POST   /bienes-lotes
GET    /bienes-lotes
POST   /movimientos-inventario
GET    /movimientos-inventario
```

### Seguridad

```txt
POST   /auth/login
POST   /auth/logout
GET    /auth/me
POST   /usuarios
GET    /usuarios
POST   /roles
GET    /roles
POST   /permisos
GET    /permisos
POST   /roles/:id/permisos
POST   /usuarios/:id/roles
POST   /usuarios/:id/permisos
GET    /auditoria/actions
```

---

## Validaciones obligatorias

La IA debe implementar validaciones de negocio, no solo validaciones de tipo.

Validaciones mínimas:

1. No registrar dos personas activas con el mismo documento si el documento es obligatorio.
2. No asignar tutor inexistente a una clase.
3. No asignar aula ocupada en el mismo horario.
4. No asignar tutor ocupado en el mismo horario.
5. No programar clase para estudiante ocupado en el mismo horario.
6. No registrar asistencia en clase cancelada.
7. No marcar clase como dictada si está cancelada.
8. No validar pago a tutor si la clase no fue dictada.
9. No liquidar dos veces la misma clase al mismo tutor.
10. No cerrar deuda si el saldo no es cero.
11. No aplicar pago anulado a una deuda.
12. No revertir pago sin permiso especial.
13. No crear transacción contable descuadrada.
14. No modificar transacción contable validada directamente.
15. No eliminar registros críticos si tienen dependencias financieras o académicas.
16. No permitir acciones fuera del rol asignado.
17. No exponer información financiera de estudiantes a usuarios no autorizados.
18. No exponer deuda de un responsable a otro responsable.
19. No permitir cambios de precio sin auditoría.
20. No permitir acceso a reportes financieros sin permiso.

---

## Manejo de estados

El sistema debe modelar estados explícitos para entidades operativas.

### Clase

```txt
BORRADOR
PROGRAMADA
CONFIRMADA
EN_CURSO
DICTADA
ASISTIDA
NO_ASISTIDA
REPROGRAMADA
CANCELADA
VALIDADA_PARA_PAGO
CERRADA
```

### Deuda

```txt
PENDIENTE
PARCIALMENTE_PAGADA
PAGADA
VENCIDA
ANULADA
REFINANCIADA
EN_REVISION
```

### Pago

```txt
REGISTRADO
APLICADO
CONCILIADO
OBSERVADO
ANULADO
REVERTIDO
```

### Liquidación de tutor

```txt
BORRADOR
GENERADA
EN_REVISION
APROBADA
PAGADA
OBSERVADA
ANULADA
```

### Transacción contable

```txt
BORRADOR
REGISTRADA
VALIDADA
OBSERVADA
REVERSADA
ANULADA
```

### Usuario

```txt
ACTIVO
INACTIVO
BLOQUEADO
PENDIENTE_VERIFICACION
```

---

## Reglas de contabilidad y finanzas

El sistema debe tratar la contabilidad como parte importante del dominio, no como un módulo secundario sin reglas.

Reglas:

1. La venta o inscripción puede generar deuda.
2. El pago puede aplicarse total o parcialmente a una o varias deudas.
3. La deuda debe mantener saldo actualizado.
4. El saldo debe calcularse de forma consistente y auditable.
5. El pago debe poder conciliarse.
6. Las transacciones contables deben estar balanceadas.
7. Las cuentas deben pertenecer a un grupo de cuentas.
8. Los centros de costo deben permitir imputación por sucursal, producto educativo, empleado, tutor, deuda o proveedor.
9. Las transacciones validadas no se editan: se reversan o ajustan.
10. Los archivos adjuntos deben conservarse como evidencia.

---

## Seguridad y sesiones

No implementar JWT.

Implementar autenticación basada en:

```txt
Sesión opaca
Cookie HttpOnly
Cookie Secure en producción
SameSite=Lax o Strict según flujo
Sesión persistida en PostgreSQL
Expiración de sesión
Revocación de sesión
Rotación de identificador de sesión al iniciar sesión
```

La tabla de sesiones debe registrar:

- Usuario.
- Token opaco hasheado.
- Fecha de creación.
- Fecha de expiración.
- IP.
- User agent.
- Estado.
- Fecha de revocación.

El sistema debe soportar permisos por rol y permisos directos por usuario.

---

## Auditoría obligatoria

Cada acción crítica debe registrar:

```txt
id
usuarioId
sesionId
accion
entidad
entidadId
modulo
payloadAnterior
payloadNuevo
ip
userAgent
fechaHora
resultado
motivoError
```

La auditoría debe ser consultable por:

- Usuario.
- Acción.
- Módulo.
- Entidad.
- Rango de fechas.
- Resultado.

---

## Eventos, Outbox e idempotencia

Para operaciones críticas, usar patrón Outbox.

Ejemplo:

```txt
Registrar pago
→ Guardar pago en PostgreSQL
→ Aplicar pago a deuda si corresponde
→ Crear transacción contable si corresponde
→ Registrar ActionLog
→ Insertar evento PagoRegistrado en outbox
→ Worker publica evento a RabbitMQ/NATS
→ Notificaciones y reportes consumen el evento
```

Cada evento debe tener:

```txt
id
nombreEvento
aggregateId
aggregateType
payload
estado
intentos
fechaCreacion
fechaPublicacion
error
idempotencyKey
```

Los consumidores deben ser idempotentes.

---

## Manejo de errores

Implementar errores de dominio claros:

```txt
PERSONA_DUPLICADA
ESTUDIANTE_NO_EXISTE
TUTOR_NO_EXISTE
TUTOR_NO_DISPONIBLE
AULA_NO_DISPONIBLE
CHOQUE_HORARIO
CLASE_CANCELADA_NO_PERMITE_ASISTENCIA
CLASE_NO_DICTADA_NO_PERMITE_PAGO_TUTOR
DEUDA_NO_EXISTE
DEUDA_YA_PAGADA
PAGO_NO_EXISTE
PAGO_ANULADO_NO_APLICABLE
SALDO_INSUFICIENTE
TRANSACCION_DESCUADRADA
TRANSACCION_VALIDADA_NO_EDITABLE
PERMISO_INSUFICIENTE
SESION_INVALIDA
RATE_LIMIT_EXCEDIDO
```

Los errores deben responder con formato consistente:

```json
{
  "success": false,
  "error": {
    "code": "CHOQUE_HORARIO",
    "message": "El tutor ya tiene una clase programada en ese horario.",
    "details": {}
  }
}
```

---

## Respuestas API

Usar formato uniforme:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Para paginación:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## Pruebas obligatorias

Generar pruebas unitarias y de integración para:

- Registro de personas.
- Asociación estudiante-padre.
- Creación de producto educativo.
- Venta o inscripción que genera deuda.
- Registro de pago.
- Aplicación de pago a deuda.
- Programación de clase.
- Detección de choque de horario.
- Registro de asistencia.
- Validación de clase para pago a tutor.
- Generación de liquidación de tutor.
- Creación de transacción contable balanceada.
- Rechazo de transacción descuadrada.
- Permisos por rol.
- Sesiones opacas.
- Auditoría de acciones críticas.
- Publicación de eventos outbox.

---

## Documentación Swagger / OpenAPI

Cada endpoint debe documentar:

- Descripción funcional.
- Roles permitidos.
- DTO de entrada.
- Respuesta exitosa.
- Errores posibles.
- Ejemplo de request.
- Ejemplo de response.

---

## Diagramas PlantUML requeridos

El diseño debe incluir como mínimo:

```txt
1. Diagrama de clases.
2. Diagrama de casos de uso.
3. Diagrama de actividad.
4. Diagrama de estados.
5. Diagrama de secuencia.
6. Diagrama de componentes.
7. Diagrama de despliegue.
```

Los diagramas deben reflejar que el sistema es modular, backend-first y preparado para crecer.

Diagramas recomendados específicos:

1. Flujo de venta/inscripción y generación de deuda.
2. Flujo de programación de clase personalizada.
3. Flujo de asistencia y validación de clase dictada.
4. Flujo de pago de cliente y aplicación a deuda.
5. Flujo de liquidación y pago a tutor.
6. Flujo de transacción contable.
7. Flujo de auditoría y eventos.

---

## Criterio final

La solución debe diseñarse como un sistema empresarial para un centro de clases personalizadas.

No debe limitarse a digitalizar Excel.

Debe transformar el proceso operativo completo:

```txt
Estudiante / Responsable
→ Servicio educativo
→ Venta / inscripción
→ Deuda
→ Pago
→ Programación de clase
→ Tutor / aula / horario
→ Asistencia
→ Clase dictada
→ Pago a tutor
→ Contabilidad
→ Reportes
→ Auditoría
```

La regla central del sistema debe mantenerse en todo el diseño:

```txt
CLASE VENDIDA != CLASE DICTADA
```

Y las reglas críticas deben estar garantizadas:

```txt
Clase programada → validar horario, tutor y aula
Clase dictada → registrar asistencia y responsable
Clase validada → habilitar pago a tutor
Pago registrado → aplicar correctamente a deuda
Transacción contable → debe estar balanceada
Acción crítica → debe auditarse
```

La prioridad final del diseño debe ser:

1. Trazabilidad.
2. Robustez.
3. Control académico realista.
4. Control financiero y contable serio.
5. Seguridad.
6. Auditoría.
7. Separación modular de responsabilidades.
8. Notificaciones asincrónicas.
9. Preparación para operación real en varias sucursales.
10. Mantenibilidad.
11. Escalabilidad.
12. Reportes gerenciales confiables.

---

## Instrucción final para la IA generadora

Cuando generes código, no entregues solo entidades y controladores CRUD.

Debes generar una solución por capas:

```txt
Controller
→ DTO
→ Use Case / Application Service
→ Domain Service cuando aplique
→ Repository
→ Entity
→ Event Publisher / Outbox cuando aplique
→ Audit Logger cuando aplique
```

Cada endpoint crítico debe aplicar:

- Validación de DTO.
- Validación de negocio.
- Validación de permisos.
- Transacción de base de datos si modifica varias entidades.
- Auditoría.
- Evento de dominio si corresponde.
- Respuesta uniforme.

No sacrifiques reglas de negocio por rapidez.

No conviertas el sistema en CRUD plano.

El backend debe quedar preparado para soportar:

- Portal administrativo.
- Portal de tutores.
- Portal de estudiantes/padres.
- Panel de caja.
- Panel contable.
- Panel académico.
- Panel de reportes.
- Integraciones futuras.
