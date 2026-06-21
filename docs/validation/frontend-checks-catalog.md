# Catálogo de checks para frontend CPA

Este catálogo define las validaciones que el frontend debe aplicar antes de construir formularios, validar datos y enviar payloads al backend.

## Regla principal

El frontend **no debe inventar validaciones por intuición ni por mockup**. Para cada campo debe resolver sus checks en este orden:

1. `docs/validation/frontend-checks-catalog.json` o este documento.
2. `docs/endpoints/endpoints.md`, para campos relevantes, payload mínimo y obligatoriedad.
3. DDL / dump SQL, para `NOT NULL`, `DEFAULT`, `ENUM`, `CHECK`, longitudes y reglas condicionales.
4. Postman Collection solo para confirmar existencia de rutas y flujo de pruebas; no debe usarse como contrato de payload si el body dice `{campo}` o `"campo": "valor"`.

## Checks globales por tipo de campo

| Tipo / patrón de campo | Check obligatorio | Componente UI recomendado |
|---|---|---|
| `id_*` | Entero positivo. Si hay lookup, usar selector. | Select / AsyncSelect |
| `codigo`, `sku` | Texto no vacío si es obligatorio. Trim. Respetar longitud. | Input text |
| `nombre`, `nombre_*`, `*_nombre` | Texto no vacío si es obligatorio. Trim. | Input text |
| `descripcion`, `observaciones`, `glosa`, `notas_*` | Texto largo opcional. Trim. | Textarea |
| `email`, `email_*` | Formato email si viene con valor. | Input email |
| `telefono`, `phone` | Formato flexible de teléfono. | Input tel |
| `link_*`, `url` | URL válida si viene con valor. | Input url |
| `fecha_*`, `vigente_*`, `periodo_*` | Fecha/datetime válida. Validar pares inicio/fin. | Input date/datetime |
| `hora_*` | Hora válida. | Input time/datetime |
| `es_*`, `cumplido`, `controla_*` | Boolean real. No string. | Switch/Checkbox |
| `monto_*`, `precio_*`, `costo_*`, `valor_*`, `pago_*`, `subtotal`, `total` | Decimal. Normalmente `>= 0`; usar `> 0` si el catálogo lo indica. | Input number |
| `porcentaje_*` | Decimal entre 0 y 100. | Input number |
| `tasa_*` | Decimal `>= 0`; si es porcentaje visible, aclarar escala. | Input number |
| `cantidad`, `plazo_meses`, `pisos`, `capacidad`, `horas_*`, `vida_util_meses` | Entero o decimal positivo según campo. | Input number |
| `latitud` | `-90 <= valor <= 90`. | Input number |
| `longitud` | `-180 <= valor <= 180`. | Input number |
| `estado_registro` | Usar estados permitidos. No asumir boolean si el campo es texto. | Select / Badge |

## Checks por relación temporal

| Campos | Regla |
|---|---|
| `fecha_inicio`, `fecha_fin` | Si `fecha_fin` existe, debe ser mayor o igual a `fecha_inicio`. |
| `fecha_ingreso`, `fecha_salida` | Si `fecha_salida` existe, debe ser mayor o igual a `fecha_ingreso`. |
| `vigente_desde`, `vigente_hasta` | Si `vigente_hasta` existe, debe ser mayor o igual a `vigente_desde`. |
| `hora_inicio_*`, `hora_fin_*` | La hora de fin debe ser mayor a la hora de inicio cuando ambas existan. |
| `periodo_inicio`, `periodo_fin` | El fin debe ser mayor o igual al inicio cuando ambas existan. |

## Checks de enums

Los campos con tipo `ENUM` deben renderizarse como `select` con valores exactos. Nunca traducir el valor enviado al backend.

```json
{
  "administracion.direccion_kpi": [
    "ASC",
    "DESC"
  ],
  "administracion.estado_okr": [
    "PLANIFICADO",
    "EN_PROGRESO",
    "COMPLETADO",
    "CANCELADO"
  ],
  "administracion.frecuencia_kpi": [
    "DIARIA",
    "SEMANAL",
    "MENSUAL",
    "TRIMESTRAL"
  ],
  "administracion.frecuencia_pago": [
    "MENSUAL",
    "QUINCENAL",
    "SEMANAL"
  ],
  "administracion.jornada_laboral": [
    "FULL_TIME",
    "PART_TIME"
  ],
  "administracion.tipo_contrato": [
    "INDEFINIDO",
    "PLAZO_FIJO",
    "HONORARIOS"
  ],
  "administracion.tipo_esquema_pago": [
    "SUELDO",
    "POR_HORA",
    "COMISION",
    "MIXTO"
  ],
  "administracion.tipo_kpi": [
    "INPUT",
    "OUTPUT",
    "OUTCOME"
  ],
  "contabilidad.naturaleza_costo": [
    "FIJO",
    "VARIABLE"
  ],
  "contabilidad.tipo_costo": [
    "DIRECTO",
    "INDIRECTO"
  ],
  "contabilidad.tipo_transaccion": [
    "GENERAL",
    "COSTO",
    "VENTA",
    "BIEN",
    "DEUDA"
  ],
  "infraestructura.categoria_sala": [
    "OFICINA",
    "CONFERENCIA",
    "REUNION",
    "ESPERA",
    "TIENDA",
    "OTRA"
  ],
  "infraestructura.tipo_aula": [
    "TEORIA",
    "LABORATORIO",
    "COMPUTACION",
    "MULTIUSO"
  ],
  "infraestructura.tipo_espacio": [
    "AULA",
    "SALA"
  ],
  "inventario.metodo_depreciacion": [
    "LINEA_RECTA",
    "SDD",
    "UNIDADES"
  ],
  "inventario.metodo_valuacion": [
    "PEPS",
    "UEPS",
    "PROM"
  ],
  "inventario.seguimiento_bien": [
    "NINGUNO",
    "LOTE",
    "SERIE"
  ],
  "inventario.tipo_bien": [
    "MERCADERIA",
    "MATERIA_PRIMA",
    "SUMINISTRO",
    "SERVICIO",
    "ACTIVO_FIJO"
  ],
  "societario.instrumento_emision": [
    "AUMENTO_CAPITAL",
    "CONVERSION",
    "PLAN_OPCIONES",
    "EMISION_SECUNDARIA",
    "OTRO"
  ],
  "societario.tipo_origen_tenencia": [
    "EMISION",
    "TRANSFERENCIA",
    "CONVERSION",
    "EJERCICIO_OPCION",
    "AJUSTE"
  ],
  "societario.tipo_ronda": [
    "FOUNDERS",
    "ANGEL",
    "SEED",
    "A",
    "B",
    "C",
    "D",
    "PUENTE",
    "OTRA"
  ],
  "societario.tipo_titulo_societario": [
    "ACCION",
    "CUOTA",
    "PARTICIPACION",
    "BONO_CONVERTIBLE",
    "SAFE",
    "WARRANT",
    "OPCION"
  ]
}
```

## Checks contables especiales

### Transacción + movimientos de cuenta

El formulario de transacción debe manejar encabezado y movimientos juntos.

**Encabezado mínimo:**

```json
{
  "tipo_transaccion": "GENERAL",
  "glosa": "Texto opcional"
}
```

**Movimiento mínimo por línea:**

```json
{
  "id_cuenta": 1,
  "debe": 100,
  "haber": 0
}
```

**Reglas:**

- `movimientos` debe ser un array no vacío.
- Cada línea debe tener `id_cuenta`.
- `debe` y `haber` no pueden ser negativos.
- Una línea no puede tener `debe > 0` y `haber > 0` al mismo tiempo.
- Una línea no puede tener ambos en cero.
- La suma total del Debe debe ser igual a la suma total del Haber.
- El frontend debe mostrar balance visual, pero el backend conserva la validación final.

## Checks de deuda

| Campo | Regla |
|---|---|
| `monto_inicial` | Mayor a cero. |
| `tasa_anual` | Mayor o igual a cero. |
| `plazo_meses` | Mayor a cero. |
| `seguro_desgravamen_fijo` | Mayor o igual a cero. |
| `seguro_desgravamen_variable` | Mayor o igual a cero. |
| `interes_pagado`, `capital_amortizado`, `seguro_desgravamen_pagado`, `otros_recargos_pagados` | Mayor o igual a cero. |
| pago de deuda | La suma de componentes debe ser mayor a cero. |

## Checks de tutor

| Campo | Regla |
|---|---|
| `pago_por_hora` | Mayor o igual a cero. |
| `nivel_experiencia` | `RECLUTA`, `EXPERIMENTADO`, `SENIOR`. |
| `tipo_estudiante_especialidad` | `UNIVERSITARIO`, `COLEGIAL`. |
| `nivel_estudiante_especialidad` | Si tipo es `COLEGIAL`, requerido y debe ser `PRIMARIA` o `SECUNDARIA`. Si tipo es `UNIVERSITARIO`, debe quedar vacío. |

## Checks de inventario / bien

| Campo / condición | Regla |
|---|---|
| `factor_conversion` | Mayor a cero. |
| `peso_kg`, `largo_m`, `ancho_m`, `profundidad_m`, `volumen_m3` | Mayor o igual a cero cuando aplique, salvo reglas específicas de espacio físico donde puede ser `> 0`. |
| `costo_referencia`, `precio_referencia`, `valor_origen`, `valor_residual` | Mayor o igual a cero. |
| `vida_util_meses` | Mayor a cero cuando aplique. |
| `tipo = ACTIVO_FIJO` | Requiere `valor_origen`, `vida_util_meses` y `metodo_depreciacion`. |
| flags de inventario | Respetar regla XOR según `tipo`. |

## Checks de ubicación física

| Campo | Regla |
|---|---|
| `latitud` | Entre -90 y 90. |
| `longitud` | Entre -180 y 180. |
| `pisos` | Mayor a cero si viene informado. |
| `largo_m`, `ancho_m` | Mayor a cero en edificios/espacios cuando el DDL lo exige. |

## Reglas de serialización del payload

1. No enviar campos vacíos opcionales.
2. Convertir `number` antes de enviar.
3. Convertir `boolean` como boolean real.
4. Enviar enums exactamente como el backend los define.
5. No enviar campos de auditoría.
6. No mostrar ni enviar rutas técnicas desde UI.
7. No usar campos genéricos como `campo`, `valor`, `name`, `description` si el contrato real usa otro nombre.
8. El `FormSchema` de cada recurso debe resultar de: `payload documentado + catálogo de checks + DDL`.

## Corrección de prioridad para catálogos manuales

El frontend debe tratar `fieldDefinitions` de `frontend-checks-catalog.json` como fuente prioritaria para catálogos de negocio, incluso cuando esos campos estén definidos en PostgreSQL como `varchar`, `text` o no tengan un `CREATE TYPE ... AS ENUM`.

Ejemplos obligatorios:

- `nivel_experiencia` debe renderizarse como select con `RECLUTA`, `EXPERIMENTADO`, `SENIOR`.
- `tipo_estudiante_especialidad` debe renderizarse como select con `UNIVERSITARIO`, `INICIAL`, `COLEGIAL`.
- `nivel_estudiante_especialidad`, `nivel_actual` y equivalentes deben renderizarse como select académico.
- `curso`, `grado` y `curso_actual` deben renderizarse como select de curso cuando existan en el payload.

Orden de resolución de campos:

1. `fieldDefinitions` del catálogo de checks.
2. Payload documentado en `docs/endpoints/endpoints.md`.
3. Enums, FK y constraints de `docs/db/ddl.sql`.
4. Postman solo como apoyo de pruebas.
