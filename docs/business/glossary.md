# Glosario

Términos tal como aparecen en la interfaz, el código y el modelo de datos. Sirve de vocabulario común entre frontend, backend y negocio.

## Producto y organización

| Término | Significado |
| --- | --- |
| **CPA** | Centro de Preparación Académica. La organización |
| **Plataforma** | Este sistema: frontend administrativo + backend REST |
| **Módulo** | Agrupación de recursos por dominio. Hay 9 |
| **Recurso** | Una tabla de negocio gestionable desde la interfaz. Hay 59 |
| **Tablero del módulo** | Pantalla que lista los recursos de un módulo (`/modulos/:module`) |

## Personas

| Término | Tabla | Nota |
| --- | --- | --- |
| **Persona base** | — | Datos comunes (nombres, apellidos, contacto). Estudiante, padre, tutor y usuario la crean en la misma transacción |
| **Estudiante** | `persona.persona_estudiante` | `UNIVERSITARIO` o `COLEGIAL` |
| **Padre** | `persona.persona_padre` | Puede ser **embajador** (refiere a otras familias) |
| **Tutor** | `persona.persona_tutor` | Docente, con pago por hora en BOB |
| **Usuario** | `persona.persona_usuario` | Cuenta de acceso al sistema |
| **Proveedor** | `persona.proveedor` | — |
| **Unidad educativa** | `persona.unidad_educativa` | Colegio de procedencia. Cientos de registros |
| **Código de estudiante** | `codigo_estudiante` | Formato `EST-AAAA-NNNNN`, generado por la base |

## Servicios educativos

| Término | Tabla | Nota |
| --- | --- | --- |
| **Producto educativo** | `producto_educativo` | El servicio que se vende |
| **Versión de curso** | `curso_version` | Instancia concreta de un producto, con fechas y precio |
| **Clase curso** | `clase_curso` | Sesión de un curso |
| **Clase por hora** | `clase_por_hora` | Clase individual facturada por hora |
| **Materia tree** | `materia_tree` | Jerarquía nombre → tema → subtema |
| **Paquete** | `paquetes_producto_educativo` | Bloque de horas con precio cerrado |
| **Matrícula / Inscripción** | `inscripcion_curso` | `ACTIVA`, `RETIRADA` o `FINALIZADA` |
| **Planilla de asistencia** | — | Pantalla que marca la asistencia de todo un curso |
| **Horario** | `horarios` | Horas de inicio y fin por día |

## Contabilidad

| Término | Tabla | Nota |
| --- | --- | --- |
| **Cuenta** | `contabilidad.cuenta` | Cuenta contable |
| **Grupo de cuenta** | `grupo_cuenta` | Jerarquía del plan de cuentas |
| **Transacción** | `transaccion` | Asiento contable. **Compuesto** con sus movimientos |
| **Movimiento de cuenta** | `transaccion_movimiento_cuenta` | Línea debe/haber. Oculto de navegación |
| **Centro de costo** | `centro_costo` | Unidad de imputación |
| **Mapa de centro de costo** | `centro_costo_mapa` | Relaciona el centro con entidades concretas |
| **Cuenta operativa** | `configuracion_cuenta_operativa` | Qué cuenta corresponde a cada concepto operativo |
| **Parte de clases pasadas** | `venta_clase_batch` | Registro en bloque de clases impartidas y su cobro |
| **CxC** | — | Cuentas por cobrar. Forma de cobro en el parte de clases |
| **Pago a tutor** | `pago_tutor` | `total = subtotal + ajustes` |

### Formas de cobro del parte de clases

`efectivo` · `qr` · `cxc` · `paquete`

### Motivos de clase

`CLASE` · `RECUPERACION` · `REFORZAMIENTO` · `NIVELACION` · `EXAMEN` · `OTRO`

### Situación base

`CLASE_PASADA` · `OBSERVADA`

## Otros dominios

| Término | Módulo | Nota |
| --- | --- | --- |
| **Espacio** | Infraestructura | `AULA` o `SALA`. **No existe un recurso llamado `aula`** |
| **Bien / lote / instancia** | Inventario | Producto, compra agrupada, unidad identificable |
| **Título / emisión / tenencia** | Societario | Estructura de capital |
| **Dividendo** | Societario | Reparto de beneficios |

## Términos técnicos del frontend

| Término | Significado |
| --- | --- |
| **Recurso compuesto** (`composite`) | Recurso que sustituye el CRUD genérico por una pantalla propia. Hay 3 |
| **Definición de recurso** | Objeto de `resourceDefinitions.ts` que describe tabla, endpoints, permisos y campos |
| **View model** | Hook que concentra estado y efectos de una pantalla |
| **Ancla de tutorial** | Atributo `data-*` que permite a un tutorial señalar un elemento del DOM |
| **Borrador** | Copia local o remota de un formulario a medio rellenar |
| **Inhabilitar** | Borrado lógico: cambia la columna de estado. **Nunca borra físicamente** |
| **Lookup** | Carga de opciones de un campo con `relation` |
| **Mapper** | Función que normaliza la respuesta del backend |
| **Permiso derivado** | Permiso de `UPDATE`/`DELETE` obtenido por sustitución textual sobre el de `CREATE` |

## Estados de registro

| Valor | Interpretación |
| --- | --- |
| `Activo`, `true`, `Sí`, `Vigente` | Activo |
| `Inactivo`, `Eliminado`, `Anulado`, `Baja`, `Cancelado`, `false` | Inactivo |

`DataTable` traduce booleanos a «Activo»/«Inactivo», no a «Sí»/«No».

## Ambigüedades detectadas

Registradas para que el glosario no las oculte:

| Término | Ambigüedad |
| --- | --- |
| **Aula** | El frontend consulta `/api/infraestructura/aula`, pero **no existe tal recurso**: en infraestructura hay `espacio` con `tipo: AULA`. Ver [D-02](../integrations/backend-api.md#drift-contractual-detectado) |
| **Archivo de transacción** | Coexisten el recurso `archivos-transaccion` (plural) y el endpoint `/archivo-transaccion/registrar` (singular) |
| **`link_achivo`** | El recurso `archivos-transaccion` declara `link_achivo` (con errata) **y** `link_archivo`. El primero es obligatorio |
| **Asistencia** | Dos recursos comparten tabla: `asistencia-clase-curso` (un registro) y `asistencia-masiva` (el curso entero) |
| **Venta de clase** | Etiquetado «Parte Clases Pasadas» en la interfaz, `venta-clase` como clave y `venta_clase_batch` como tabla |
