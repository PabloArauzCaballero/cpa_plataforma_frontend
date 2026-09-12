# Contexto de negocio

## Qué es CPA

**Centro de Preparación Académica**: un centro educativo que imparte clases particulares y cursos, con estudiantes universitarios y colegiales, tutores contratados por hora e instalaciones propias.

Toda esta descripción se deriva del **modelo de datos que el frontend manipula** (`resourceDefinitions.ts`), no de un documento de producto: el repositorio no contiene uno.

## Qué resuelve este frontend

Es el **panel administrativo interno** con el que el personal opera el negocio: alta y consulta de personas, programación de clases, control de asistencia, contabilidad completa, inventario, infraestructura y estructura societaria.

No es un producto de cara al estudiante. **No hay portal de alumnos, padres ni tutores**, aunque esas entidades existan como datos.

## Los 9 dominios y qué significan

| Módulo | Recursos | Qué representa en el negocio |
| --- | ---: | --- |
| **Personas** | 7 | Estudiantes, padres, tutores, usuarios del sistema, proveedores, unidades educativas. Es la base sobre la que todo lo demás se apoya |
| **Servicios educativos** | 10 | El producto que se vende: cursos y sus versiones, clases (por curso y por hora), horarios, materias, paquetes, matrículas y asistencia |
| **Contabilidad** | 12 | Plan de cuentas, centros de costo, transacciones con movimientos debe/haber, pagos a tutores, archivos de soporte y el parte de clases pasadas |
| **Administración** | 7 | Estructura interna: departamentos, posiciones, empleados, esquemas de pago y KPI |
| **Infraestructura** | 5 | Sucursales, edificios, espacios (aulas y salas) y tiendas |
| **Inventario** | 4 | Bienes, lotes, instancias y movimientos |
| **Deuda** | 2 | Financiación externa y sus pagos |
| **Societario** | 7 | Capital de la empresa: clases de título, emisiones, tenencias, transferencias, dividendos |
| **Seguridad** | 5 | Roles, permisos y sus asignaciones |

**59 recursos en total.** Es un ERP a medida, no una aplicación educativa.

## El modelo de persona: la decisión de negocio más visible en el código

Cuatro recursos (`estudiante`, `padre`, `tutor`, `usuario`) **no se crean con el CRUD genérico**: usan un endpoint `/registrar` porque crean su *persona base* en la misma transacción.

El propio código lo explica:

> «El padre nace junto con su persona base: sin ella el registro no tendría nombre ni contacto. Por eso el alta va al endpoint transaccional.»

Y por eso `id_persona` se retiró del formulario de alta:

> «`id_persona` fuera del alta: es la clave primaria, la base la genera sola y al editar viaja en la URL. Pedirla confundía a quien registra.»

Son decisiones de negocio tomadas para que el formulario refleje cómo se trabaja de verdad, no cómo está normalizada la base de datos.

## Las dos operaciones diarias que tienen pantalla propia

De los 59 recursos, solo dos justificaron abandonar el CRUD genérico:

### Parte de clases pasadas (`venta-clase`)

Registra en bloque las clases impartidas con su cobro desglosado en **efectivo, QR, cuentas por cobrar y paquete**, además de motivo (`CLASE`, `RECUPERACION`, `REFORZAMIENTO`, `NIVELACION`, `EXAMEN`, `OTRO`) y situación (`CLASE_PASADA` u `OBSERVADA`).

Es donde el servicio educativo se convierte en asiento contable. Depende de la configuración de cuentas operativas.

### Planilla de asistencia (`asistencia-masiva`)

Marca la asistencia de todo un curso de una vez. Comparte tabla y endpoints con `asistencia-clase-curso`; el código explica la diferencia:

> «Pantalla aparte de la de arriba: la de arriba corrige un registro suelto, esta marca a todo el curso de una vez.»

Regla de negocio explícita: **solo las matrículas en estado `ACTIVA` aparecen en la planilla**.

## Dos tipos de estudiante, un formulario

`estudiante` tiene un campo `tipo` con dos valores, y los campos siguientes aparecen o desaparecen según él:

| `tipo` | Campos que se muestran y exigen |
| --- | --- |
| `COLEGIAL` | `nivel_actual`, `curso_actual`, `turno_actual` |
| `UNIVERSITARIO` | `carrera`, `anio_ingreso` |

Los tutores replican la distinción con `tipo_estudiante_especialidad`, y si es `COLEGIAL` deben indicar `nivel_estudiante_especialidad` (`PRIMARIA` o `SECUNDARIA`).

## Moneda y ámbito geográfico

El campo `pago_por_hora` del tutor está etiquetado **«Pago por hora (BOB)»**: bolivianos. Combinado con el comentario sobre husos horarios («en Bolivia dejaría la marcación cuatro horas adelantada», `FormField.tsx:37`), el ámbito es **Bolivia**.

## Naturaleza de los datos

| Categoría | Sensibilidad |
| --- | --- |
| **Datos de menores de edad** (estudiantes colegiales) | 🔴 Máxima |
| Contraseñas de usuario | 🔴 Máxima |
| Retribución de empleados y tutores | 🔴 Alta |
| Contabilidad completa | 🔴 Alta |
| Estructura societaria | 🟠 Alta |

**Que el sistema trate datos de menores eleva el estándar exigible a su protección.** Es el argumento de fondo por el que [SEC-01](../security/frontend-security.md#sec-01) se clasifica como bloqueante y no como una simple mala práctica.

## Lo que el frontend no decide

| Decisión | Autoridad |
| --- | --- |
| Quién puede hacer qué | **Backend** |
| Integridad contable | **Backend** (el frontend replica algunas reglas como ayuda) |
| Generación de códigos (`EST-AAAA-NNNNN`) | **Base de datos** |
| Cálculo de pagos y comisiones | **Backend** |
| Estado de matrícula y sus efectos | **Backend** |
