# Reglas de negocio implementadas en el frontend

> **Advertencia fundamental:** estas reglas son **ayuda al usuario**, no garantía de integridad. La autoridad es el backend. Si una regla del frontend difiere de la del backend, gana el backend — y el usuario verá un error del servidor tras pasar la validación local.

Fuente: `src/shared/validation/formValidation.ts` (341 líneas) y `resourceDefinitions.ts`.

## Reglas genéricas

| Regla | Condición | Mensaje |
| --- | --- | --- |
| Obligatoriedad | `required`, o `requiredWhen` cumplido | «Campo obligatorio.» |
| Número válido | Campo numérico no parseable | «Debe ser un número válido.» |
| Entero positivo | `checks: positiveInteger` | «Debe seleccionar un registro válido.» |
| Mayor que cero | `checks: positiveNumber` | «{campo} debe ser mayor a cero.» |
| No negativo | `checks: nonNegativeDecimal` | «{campo} no puede ser negativo.» |
| Mínimo / máximo | `min` / `max` | «El valor mínimo/máximo permitido es N.» |
| Longitud | `maxLength` | «Máximo N caracteres.» |
| Correo | `type: email` o `checks: email` | «Ingrese un correo válido.» |
| Enlace | `checks: url` (solo http/https) | «Ingrese un enlace válido con http o https.» |
| Teléfono | `checks: phoneLoose` | «Ingrese un teléfono válido.» |
| Opción de catálogo | `type: select` con opciones | «Seleccione una opción válida del catálogo.» |
| Opción dependiente | `conditionalOptions` | «Seleccione una opción válida para la selección anterior.» |
| Exclusividad | `exclusiveGroup` con más de uno relleno | «Seleccione solo una entidad principal para esta asignación.» |

## Reglas temporales

Se comprueban siempre que ambos campos existan:

| Inicio | Fin |
| --- | --- |
| `fecha_inicio` | `fecha_fin` |
| `fecha_ingreso` | `fecha_salida` |
| `vigente_desde` | `vigente_hasta` |
| `periodo_inicio` | `periodo_fin` |
| `hora_inicio_real` | `hora_fin_real` |

## Reglas contables específicas

### `centro-costo`
La cuenta de costo debe ser **distinta** de la cuenta de ingreso.

### `centro-costo-mapa`
- Al menos **1** entidad asociada entre `id_deuda`, `id_bien`, `id_sucursal`, `id_tienda`, `id_empleado`, `id_posicion`, `id_departamento`.
- Más de **3** se considera ambiguo: «Demasiadas entidades asociadas pueden volver ambiguo el mapa contable.»

### `cuenta-asignacion`
Según `entidad_tipo`, exige el identificador correspondiente:

| `entidad_tipo` | Campo requerido |
| --- | --- |
| `EMPLEADO` | `id_empleado` |
| `ESTUDIANTE` | `id_persona_estudiante` |
| `TUTOR` | `id_persona_tutor` |
| `SUCURSAL` | `id_sucursal` |
| `EDIFICIO` | `id_edificio` |
| `TIENDA` | `id_tienda` |
| `BIEN` | `id_bien` |
| `DEUDA` | `id_deuda` |
| `PROVEEDOR` | `id_proveedor` |
| `DEPARTAMENTO` | `id_departamento` |

### `pago-tutor`
- `total = subtotal + ajustes`, con tolerancia de **0,009**.
- `fecha_pago >= fecha_aprobacion`.

### `grupo-cuenta`
Estructura del plan de cuentas:

| Tipo | Subtipos válidos |
| --- | --- |
| `BALANCE` | `ACTIVO`, `PASIVO`, `PATRIMONIO` |
| `RESULTADOS` | `INGRESO`, `GASTO` |

| Subtipo | Subgrupos válidos |
| --- | --- |
| `ACTIVO`, `PASIVO` | `CORRIENTE`, `NO_CORRIENTE` |
| `PATRIMONIO` | `CAPITAL`, `RESERVAS`, `RESULTADOS_ACUMULADOS` |
| `INGRESO` | `OPERATIVO`, `NO_OPERATIVO` |
| `GASTO` | `ADMINISTRATIVO`, `VENTAS`, `FINANCIERO`, `OPERATIVO`, `NO_OPERATIVO` |

Además: un grupo **no puede ser padre de sí mismo**, y `orden_reporte` debe ser entero mayor que cero.

El tipo se normaliza: `RESULTADOS`, `ESTADO_RESULTADO`, `ESTADO_DE_RESULTADO` y `ESTADO_DE_RESULTADOS` se tratan como el mismo valor.

### `deuda`
`monto_inicial > 0`; `plazo_meses` entero mayor que cero.

### `pago`
Al menos uno de `capital_amortizado`, `interes_pagado`, `seguro_desgravamen_pagado` u `otros_recargos_pagados` debe ser mayor que cero.

## Reglas declaradas en las definiciones de recurso

### Estudiante: dos tipos, campos distintos

| `tipo` | Campos visibles y obligatorios |
| --- | --- |
| `COLEGIAL` | `nivel_actual`, `curso_actual`, `turno_actual` |
| `UNIVERSITARIO` | `carrera`, `anio_ingreso` |

### Tutor: especialidad
`tipo_estudiante_especialidad` (`UNIVERSITARIO` / `COLEGIAL`); si es `COLEGIAL`, `nivel_estudiante_especialidad` (`PRIMARIA` / `SECUNDARIA`) pasa a ser visible y obligatorio.

`nivel_experiencia`: `RECLUTA` (recién incorporado), `EXPERIMENTADO` (con trayectoria), `SENIOR` (referente del área).

### Matrícula: la regla que gobierna la planilla

> «Sólo las matrículas ACTIVA aparecen en la planilla de asistencia.»

Estados: `ACTIVA`, `RETIRADA`, `FINALIZADA`. Si es `RETIRADA`, `fecha_baja` se vuelve obligatoria y `motivo_baja` visible.

### Personas base
`estudiante`, `padre`, `tutor` y `usuario` crean su persona base en la misma transacción, mediante endpoint `/registrar`. `id_persona` **no se pide en el alta**: es clave primaria generada por la base.

### Códigos generados por el sistema
`codigo_estudiante` tiene formato `EST-AAAA-NNNNN` y **lo genera la base de datos**. Es `readOnly`: se muestra pero nunca se envía.

### Superusuario
> «Otorga acceso total. Solo un superusuario puede crear otros superusuarios.»

**Esta regla la aplica el backend**, no el frontend.

## Reglas del borrado lógico

No hay borrado físico. `buildDisablePayload` respeta el tipo de la columna de estado:

| Tipo de columna | Valor enviado |
| --- | --- |
| Booleana, o `es_activo` / `activo` | `false` |
| Texto | `'Inactivo'` |

Un registro sin columna de estado **no se puede inhabilitar**: el botón no se ofrece.

Estados considerados inactivos por `DataTable`: `inactivo`, `eliminado`, `anulado`, `baja`, `cancelado`.

## Reglas de visibilidad de datos

`appendVisibilityParams` pide **todos los estados** salvo que el usuario haya filtrado explícitamente por «Activo». El comentario lo justifica:

> «Muchas funciones del sistema/DDL tienen `p_only_activos DEFAULT true`. Por eso, si el usuario no eligió explícitamente Activo, pedimos todos los estados.»

## Regla de seguridad de la interfaz

`shouldShowFilter` excluye de los filtros cualquier campo cuyo nombre contenga `contrasena`, `password`, `hash` o `token`: impide sondear por esos valores.

## Riesgo: ninguna de estas reglas está probada

`validateResourcePayload` es una función pura, exportada, con **22 ramas de decisión y reglas contables reales**, y **cero pruebas**.

Un error aquí produce datos contables incorrectos que el usuario cree validados. Registrado como G-04 en [../reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md), con la recomendación de escribir ~40 casos sin necesidad de tocar ninguna configuración.
