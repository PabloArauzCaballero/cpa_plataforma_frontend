# Análisis de endpoints y campos catalogables

Este documento resume los campos que no deben quedar como texto libre porque tienen valores finitos definidos por `CHECK`, `ENUM` o por catálogo de negocio útil para el sistema CPA.

## Prioridad de catálogo

1. `resourceFieldDefinitions` en `docs/validation/frontend-checks-catalog.json`.
2. `fieldDefinitions` globales cuando el campo no sea ambiguo.
3. Enums y checks reales desde `docs/db/ddl.sql`.
4. Campos de `docs/endpoints/endpoints.md` para confirmar payload, obligatoriedad y contexto funcional.

## Campos con CHECK real del DDL

Estos valores deben respetarse con el mismo texto, mayúsculas/minúsculas y acentos:

- `persona.persona_estudiante.tipo`: `UNIVERSITARIO`, `COLEGIAL`.
- `persona.persona_estudiante.nivel_actual`: `PRIMARIA`, `SECUNDARIA`.
- `persona.persona_estudiante.curso_actual`: `PRIMERO`, `SEGUNDO`, `TERCERO`, `CUARTO`, `QUINTO`, `SEXTO`.
- `persona.persona_estudiante.turno_actual`: `MAÑANA`, `TARDE`, `NOCHE`.
- `persona.unidad_educativa.categoria`: `privada`, `convenio`, `fiscal`.
- `persona.persona_tutor.nivel_experiencia`: `RECLUTA`, `EXPERIMENTADO`, `SENIOR`.
- `persona.persona_tutor.tipo_estudiante_especialidad`: `UNIVERSITARIO`, `COLEGIAL`.
- `servicios_educativos.asistencia_clase_curso.estado_asistencia`: `Asistió`, `Tardanza`, `Falta`, `Justificado`, `En línea`.
- `servicios_educativos.clase_curso.estado`: `Programada`, `En curso`, `Dictada`, `Reprogramada`, `Cancelada`.
- `servicios_educativos.clase_curso.modalidad`: `Presencial`, `Online`, `Híbrido`.
- `servicios_educativos.clase_por_hora.estado_operativo`: `ABIERTA`, `CERRADA`, `ANULADA`.
- `servicios_educativos.clase_por_hora.modalidad`: `PRESENCIAL`, `VIRTUAL`.
- `servicios_educativos.clase_por_hora.motivo`: `EXAMEN`, `NIVELACIÓN`, `PRÁCTICO`.
- `servicios_educativos.horarios.repeticion`: `CADA SEMANA`, `CADA QUINCENA`, `CADA MES`.
- `contabilidad.concepto_costo.tipo_concepto`: `BIEN`, `SERVICIO`, `OTRO`.
- `contabilidad.grupo_cuenta.tipo`: `BALANCE`, `RESULTADOS`.
- `contabilidad.grupo_cuenta.sub_tipo`: `ACTIVO`, `PASIVO`, `PATRIMONIO`, `INGRESO`, `GASTO`.
- `contabilidad.grupo_cuenta.sub_grupo`: `CORRIENTE`, `NO_CORRIENTE`, `ORDINARIO`, `EXTRAORDINARIO`.
- `contabilidad.pago_tutor.estado_pago`: `BORRADOR`, `APROBADO`, `PAGADO`, `ANULADO`.
- `deuda.deuda.tipo_tasa`: `SIMPLE`, `COMPUESTA`.
- `deuda.deuda.capitalizacion`: `ANUAL`, `SEMESTRAL`, `TRIMESTRAL`, `BIMESTRAL`, `MENSUAL`.
- `deuda.deuda.tipo_calculo_cuotas`: `FRANCES`, `ALEMAN`, `AMERICANO`.
- `deuda.deuda.frecuencia_cuotas`: `ANUAL`, `SEMESTRAL`, `TRIMESTRAL`, `BIMESTRAL`, `MENSUAL`.
- `deuda.deuda.tipo_pago`: `VENCIDAS`, `ANTICIPADAS`.
- `deuda.deuda.tipo_primer_pago`: `INMEDIATA`, `DIFERIDA`.

## Catálogos de negocio agregados

Estos campos no siempre tienen `CHECK` en la base, pero para el negocio no conviene dejarlos libres:

- `proveedor.categoria`: clasificación de proveedores.
- `producto-educativo.tipo_producto`: tipo comercial/académico del producto.
- `cuenta-asignacion.entidad_tipo`: entidad interna a la que se asigna una cuenta.
- `transaccion.sub_tipo_transaccion`: clasificación contable funcional.
- `bien.categoria`, `bien.subcategoria`, `bien.unidad_compra`, `bien.unidad_venta`: clasificación de inventario.
- `clase-titulo.sub_tipo`: clasificación societaria del título.
- `transferencia-titulo.motivo`: motivo societario.
- `permiso.modulo`: módulo funcional del permiso.
- `moneda` y `unidad_medida`: catálogos reutilizables para administración, costos e inventario.

## Nota sobre campos ambiguos

No se debe usar una definición global para campos como `tipo`, `categoria`, `estado`, `modalidad`, `motivo` o `sub_tipo`, porque cada módulo puede tener valores distintos. Para esos casos se usa `resourceFieldDefinitions[resourceKey][fieldName]`.
