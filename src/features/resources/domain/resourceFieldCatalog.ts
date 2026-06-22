import frontendCheckCatalogRaw from '../../../../docs/validation/frontend-checks-catalog.json';
import type { CrudResourceDefinition, ResourceFieldDefinition, ConditionalSelectOptions } from './CrudResource';

type FieldCatalogPatch = Partial<ResourceFieldDefinition>;

type CatalogFieldDefinition = {
  type?: string;
  ui?: string;
  values?: string[];
  enumRef?: string;
  check?: string;
  checks?: string[];
  message?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  conditionalOptions?: ConditionalSelectOptions;
  requiredWhen?: Record<string, string | number | boolean>;
  exclusiveGroup?: string;
};

type CatalogPatternRule = {
  pattern: string;
  check: string;
  message?: string;
};

type FrontendChecksCatalog = {
  fieldDefinitions?: Record<string, CatalogFieldDefinition>;
  resourceFieldDefinitions?: Record<string, Record<string, CatalogFieldDefinition>>;
  fieldPatternRules?: CatalogPatternRule[];
  enums?: Record<string, string[]>;
};

const frontendChecksCatalog = frontendCheckCatalogRaw as FrontendChecksCatalog;

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function getCatalogEnumValues(enumRef?: string): string[] | undefined {
  if (!enumRef) return undefined;
  const values = frontendChecksCatalog.enums?.[enumRef];
  return values?.length ? values : undefined;
}

function getEnumRefFromPatternCheck(check: string): string | undefined {
  const enumRefsByCheck: Record<string, string> = {
    cursoEscolar: 'academico.curso',
    nivelAcademico: 'academico.nivel',
    tipoEstudiante: 'persona.tipo_estudiante',
    nivelExperienciaTutor: 'persona.nivel_experiencia_tutor',
  };
  return enumRefsByCheck[check];
}

function getResourceSpecificCatalogDefinition(resourceKey: string, fieldName: string): CatalogFieldDefinition | undefined {
  // 1) Highest priority: resource-specific catalog from docs/validation/frontend-checks-catalog.json.
  // This prevents generic field names such as "tipo", "categoria", "estado" or "modalidad"
  // from being treated as free text or from accidentally sharing the wrong catalog across modules.
  const directResourceDefinition = frontendChecksCatalog.resourceFieldDefinitions?.[resourceKey]?.[fieldName];
  if (directResourceDefinition) return directResourceDefinition;

  // 2) Alternative compact notation: fieldDefinitions["resourceKey.fieldName"].
  const qualifiedDefinition = frontendChecksCatalog.fieldDefinitions?.[`${resourceKey}.${fieldName}`];
  if (qualifiedDefinition) return qualifiedDefinition;

  // 3) Legacy safe fallbacks kept for old catalogs. New catalogs should use resourceFieldDefinitions.
  const specific: Record<string, Record<string, CatalogFieldDefinition>> = {
    estudiante: {
      tipo: { type: 'enum', ui: 'select', enumRef: 'persona.tipo_estudiante' },
      nivel_actual: { type: 'enum', ui: 'select', enumRef: 'academico.nivel_escolar' },
      curso_actual: { type: 'enum', ui: 'select', enumRef: 'academico.curso' },
    },
    tutor: {
      nivel_experiencia: { type: 'enum', ui: 'select', enumRef: 'persona.nivel_experiencia_tutor' },
      tipo_estudiante_especialidad: { type: 'enum', ui: 'select', enumRef: 'persona.tipo_estudiante' },
      nivel_estudiante_especialidad: { type: 'enum', ui: 'select', enumRef: 'academico.nivel_escolar' },
      curso: { type: 'enum', ui: 'select', enumRef: 'academico.curso' },
    },
    kpi: {
      frecuencia: { type: 'enum', ui: 'select', enumRef: 'administracion.frecuencia_kpi' },
    },
  };

  return specific[resourceKey]?.[fieldName];
}

function getCatalogDefinitionFromFieldName(fieldName: string): CatalogFieldDefinition | undefined {
  const direct = frontendChecksCatalog.fieldDefinitions?.[fieldName];
  if (direct) return direct;

  const patternRule = frontendChecksCatalog.fieldPatternRules?.find((rule) => {
    try {
      return new RegExp(rule.pattern, 'i').test(fieldName);
    } catch {
      return false;
    }
  });

  if (!patternRule) return undefined;

  const enumRef = getEnumRefFromPatternCheck(patternRule.check);
  return {
    type: enumRef ? 'enum' : undefined,
    ui: enumRef ? 'select' : undefined,
    enumRef,
    check: patternRule.check,
    message: patternRule.message,
  };
}

function catalogDefinitionToPatch(definition: CatalogFieldDefinition | undefined): FieldCatalogPatch | undefined {
  if (!definition) return undefined;

  const values = definition.values?.length ? definition.values : getCatalogEnumValues(definition.enumRef);
  const checks = unique([...(definition.checks ?? []), definition.check ?? '']);
  const patch: FieldCatalogPatch = {};

  if (values?.length || definition.type === 'enum' || definition.ui === 'select') {
    patch.type = 'select';
    patch.options = values ?? [];
    patch.selectSource = 'catalog';
    patch.valueKind = 'string';
  }

  if (definition.type === 'money' || definition.check === 'nonNegativeDecimal') {
    patch.type = 'number';
    patch.valueKind = 'number';
    patch.min = definition.min ?? 0;
  }

  if (definition.type === 'date') {
    patch.type = 'date';
    patch.valueKind = 'string';
  }

  if (definition.type === 'time') {
    patch.type = 'time';
    patch.valueKind = 'string';
  }

  if (definition.maxLength !== undefined) patch.maxLength = definition.maxLength;
  if (definition.min !== undefined) patch.min = definition.min;
  if (definition.max !== undefined) patch.max = definition.max;
  if (checks.length) patch.checks = checks;
  if (definition.message) patch.helpText = definition.message;
  if (definition.conditionalOptions) patch.conditionalOptions = definition.conditionalOptions;
  if (definition.requiredWhen) patch.requiredWhen = definition.requiredWhen;
  if (definition.exclusiveGroup) patch.exclusiveGroup = definition.exclusiveGroup;

  return Object.keys(patch).length ? patch : undefined;
}

function getCatalogPatch(resourceKey: string, fieldName: string): FieldCatalogPatch | undefined {
  const definition = getResourceSpecificCatalogDefinition(resourceKey, fieldName) ?? getCatalogDefinitionFromFieldName(fieldName);
  return catalogDefinitionToPatch(definition);
}

function mergeFieldPatches(
  field: ResourceFieldDefinition,
  generatedPatch?: FieldCatalogPatch,
  catalogPatch?: FieldCatalogPatch,
): ResourceFieldDefinition {
  const merged = {
    ...field,
    ...(generatedPatch ?? {}),
    ...(catalogPatch ?? {}),
  };

  const checks = unique([...(field.checks ?? []), ...(generatedPatch?.checks ?? []), ...(catalogPatch?.checks ?? [])]);
  if (checks.length) merged.checks = checks;

  if (catalogPatch?.conditionalOptions) merged.conditionalOptions = catalogPatch.conditionalOptions;
  if (catalogPatch?.requiredWhen) merged.requiredWhen = catalogPatch.requiredWhen;
  if (catalogPatch?.exclusiveGroup) merged.exclusiveGroup = catalogPatch.exclusiveGroup;

  if (catalogPatch?.options) merged.options = catalogPatch.options;
  else if (generatedPatch?.options) merged.options = generatedPatch.options;
  else merged.options = field.options;

  if (catalogPatch?.type === 'select' && catalogPatch.options?.length) {
    delete merged.relation;
  }

  return merged;
}

export const resourceFieldCatalog: Record<string, FieldCatalogPatch> = {
  "__movement__.id_cuenta": {
    "type": "select",
    "relation": {
      "endpoint": "/api/contabilidad/cuenta",
      "valueField": "id_cuenta",
      "labelFields": [
        "nombre_cuenta",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "cuenta"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "archivos-transaccion.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "archivos-transaccion.id_archivo": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "archivos-transaccion.id_transaccion": {
    "type": "select",
    "relation": {
      "endpoint": "/api/contabilidad/transaccion",
      "valueField": "id_transaccion",
      "labelFields": [
        "glosa",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "transaccion"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "archivos-transaccion.link_achivo": {
    "checks": [
      "url"
    ]
  },
  "archivos-transaccion.link_archivo": {
    "checks": [
      "url"
    ]
  },
  "asistencia-clase-curso.estado_asistencia": {
    "maxLength": 15
  },
  "asistencia-clase-curso.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "checks": [
      "boolean"
    ]
  },
  "asistencia-clase-curso.id_asistencia": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "asistencia-clase-curso.id_clase_curso": {
    "type": "select",
    "relation": {
      "endpoint": "/api/servicios_educativos/clase-curso",
      "valueField": "id_clase_curso",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "clase-curso"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "asistencia-clase-curso.id_estudiante": {
    "type": "select",
    "relation": {
      "endpoint": "/api/personas/estudiante",
      "valueField": "id_persona",
      "labelFields": [
        "codigo_estudiante",
        "tipo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "estudiante"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "asistencia-clase-curso.id_usuario": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "asistencia-clase-curso.observaciones": {
    "maxLength": 240
  },
  "bien-instancia.costo_compra": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "bien-instancia.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "bien-instancia.id_bien": {
    "type": "select",
    "relation": {
      "endpoint": "/api/inventario/bien",
      "valueField": "id_bien",
      "labelFields": [
        "nombre",
        "sku",
        "tipo",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "bien"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "bien-instancia.id_bien_instancia": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "bien-instancia.id_proveedor_compra": {
    "type": "select",
    "relation": {
      "endpoint": "/api/personas/proveedor",
      "valueField": "id_proveedor",
      "labelFields": [
        "nombre_proveedor",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_cuenta",
        "nombre_version"
      ],
      "resourceKey": "proveedor"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "bien-instancia.precio_compra": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "bien-instancia.serial_unico": {
    "maxLength": 120
  },
  "bien-lote.cantidad_compra": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveNumber"
    ]
  },
  "bien-lote.costo_compra_unitario": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "bien-lote.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "bien-lote.id_bien": {
    "type": "select",
    "relation": {
      "endpoint": "/api/inventario/bien",
      "valueField": "id_bien",
      "labelFields": [
        "nombre",
        "sku",
        "tipo",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "bien"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "bien-lote.id_lote": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "bien-lote.id_proveedor_compra": {
    "type": "select",
    "relation": {
      "endpoint": "/api/personas/proveedor",
      "valueField": "id_proveedor",
      "labelFields": [
        "nombre_proveedor",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_cuenta",
        "nombre_version"
      ],
      "resourceKey": "proveedor"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "bien-lote.lote_codigo": {
    "maxLength": 80
  },
  "bien-lote.precio_compra_unitario": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "bien.categoria": {
    "maxLength": 100
  },
  "bien.controla_inventario_loteable": {
    "valueKind": "boolean",
    "checks": [
      "boolean"
    ]
  },
  "bien.controla_inventario_no_loteable": {
    "valueKind": "boolean",
    "checks": [
      "boolean"
    ]
  },
  "bien.costo_referencia": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "bien.factor_conversion": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveNumber"
    ]
  },
  "bien.id_bien": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "bien.metodo_valuacion": {
    "type": "select",
    "options": [
      "PEPS",
      "UEPS",
      "PROM"
    ],
    "selectSource": "enum",
    "valueKind": "string"
  },
  "bien.nombre": {
    "maxLength": 180
  },
  "bien.sku": {
    "maxLength": 60
  },
  "bien.subcategoria": {
    "maxLength": 100
  },
  "bien.tipo": {
    "type": "select",
    "options": [
      "MERCADERIA",
      "MATERIA_PRIMA",
      "SUMINISTRO",
      "SERVICIO",
      "ACTIVO_FIJO"
    ],
    "selectSource": "enum",
    "valueKind": "string"
  },
  "bien.unidad_compra": {
    "maxLength": 20
  },
  "bien.unidad_venta": {
    "maxLength": 20
  },
  "centro-costo-mapa.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "centro-costo-mapa.id_bien": {
    "type": "select",
    "relation": {
      "endpoint": "/api/inventario/bien",
      "valueField": "id_bien",
      "labelFields": [
        "nombre",
        "sku",
        "tipo",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "bien"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "centro-costo-mapa.id_cc_mapa": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "centro-costo-mapa.id_centro_costo": {
    "type": "select",
    "relation": {
      "endpoint": "/api/contabilidad/centro-costo",
      "valueField": "id_centro_costo",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "centro-costo"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveInteger",
      "nonNegativeDecimal"
    ]
  },
  "centro-costo-mapa.id_departamento": {
    "type": "select",
    "relation": {
      "endpoint": "/api/administracion/departamento",
      "valueField": "id_departamento",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "departamento"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "centro-costo-mapa.id_deuda": {
    "type": "select",
    "relation": {
      "endpoint": "/api/deuda/deuda",
      "valueField": "id_deuda",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "deuda"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "centro-costo-mapa.id_empleado": {
    "type": "select",
    "relation": {
      "endpoint": "/api/administracion/empleado",
      "valueField": "id_empleado",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "empleado"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "centro-costo-mapa.id_posicion": {
    "type": "select",
    "relation": {
      "endpoint": "/api/administracion/posicion",
      "valueField": "id_posicion",
      "labelFields": [
        "nombre",
        "codigo",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "posicion"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "centro-costo-mapa.id_sucursal": {
    "type": "select",
    "relation": {
      "endpoint": "/api/infraestructura/sucursal",
      "valueField": "id_sucursal",
      "labelFields": [
        "nombre",
        "codigo",
        "email",
        "direccion_linea1",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "sucursal"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "centro-costo-mapa.id_tienda": {
    "type": "select",
    "relation": {
      "endpoint": "/api/infraestructura/tienda",
      "valueField": "id_tienda",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "tienda"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "centro-costo-mapa.naturaleza": {
    "type": "select",
    "options": [
      "FIJO",
      "VARIABLE"
    ],
    "selectSource": "enum",
    "valueKind": "string"
  },
  "centro-costo-mapa.tipo": {
    "type": "select",
    "options": [
      "DIRECTO",
      "INDIRECTO"
    ],
    "selectSource": "enum",
    "valueKind": "string"
  },
  "centro-costo.codigo": {
    "maxLength": 40
  },
  "centro-costo.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "centro-costo.id_centro_costo": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveInteger",
      "nonNegativeDecimal"
    ]
  },
  "centro-costo.id_cuenta_costo": {
    "type": "select",
    "relation": {
      "endpoint": "/api/contabilidad/cuenta",
      "valueField": "id_cuenta",
      "labelFields": [
        "nombre_cuenta",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "cuenta"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveInteger",
      "nonNegativeDecimal"
    ]
  },
  "centro-costo.id_cuenta_ingreso": {
    "type": "select",
    "relation": {
      "endpoint": "/api/contabilidad/cuenta",
      "valueField": "id_cuenta",
      "labelFields": [
        "nombre_cuenta",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "cuenta"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "centro-costo.nombre": {
    "maxLength": 150
  },
  "clase-curso.detalle_temas_revisados": {
    "maxLength": 200
  },
  "clase-curso.estado": {
    "maxLength": 20
  },
  "clase-curso.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "checks": [
      "boolean"
    ]
  },
  "clase-curso.id_aula": {
    "type": "select",
    "relation": {
      "endpoint": "/api/infraestructura/espacio",
      "valueField": "id_espacio",
      "labelFields": [
        "nombre",
        "tipo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "espacio"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "clase-curso.id_clase_curso": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "clase-curso.id_curso_version": {
    "type": "select",
    "relation": {
      "endpoint": "/api/servicios_educativos/curso-version",
      "valueField": "id_curso_version",
      "labelFields": [
        "nombre_version",
        "descripcion_version",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_cuenta",
        "nombre_proveedor"
      ],
      "resourceKey": "curso-version"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "clase-curso.id_tutor": {
    "type": "select",
    "relation": {
      "endpoint": "/api/personas/tutor",
      "valueField": "id_tutor",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "tutor"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "clase-curso.id_usuario": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "clase-curso.modalidad": {
    "maxLength": 30
  },
  "clase-curso.motivo_cancelacion": {
    "maxLength": 200
  },
  "clase-curso.observaciones": {
    "maxLength": 300
  },
  "clase-por-hora.estado_operativo": {
    "type": "select",
    "options": [
      "ABIERTA",
      "CERRADA",
      "ANULADA"
    ],
    "selectSource": "catalog",
    "valueKind": "string"
  },
  "clase-por-hora.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "clase-por-hora.id_aula": {
    "type": "select",
    "relation": {
      "endpoint": "/api/infraestructura/espacio",
      "valueField": "id_espacio",
      "labelFields": [
        "nombre",
        "tipo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "espacio"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "clase-por-hora.id_clase": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "clase-por-hora.id_estudiante": {
    "type": "select",
    "relation": {
      "endpoint": "/api/personas/estudiante",
      "valueField": "id_persona",
      "labelFields": [
        "codigo_estudiante",
        "tipo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "estudiante"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "clase-por-hora.id_materia_tree": {
    "type": "select",
    "relation": {
      "endpoint": "/api/servicios_educativos/materia-tree",
      "valueField": "id_tree",
      "labelFields": [
        "nombre",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "materia-tree"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "clase-por-hora.id_tutor": {
    "type": "select",
    "relation": {
      "endpoint": "/api/personas/tutor",
      "valueField": "id_tutor",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "tutor"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "clase-por-hora.modalidad": {
    "type": "select",
    "options": [
      "PRESENCIAL",
      "VIRTUAL"
    ],
    "selectSource": "catalog",
    "valueKind": "string"
  },
  "clase-por-hora.motivo": {
    "type": "select",
    "options": [
      "EXAMEN",
      "NIVELACIÓN",
      "PRÁCTICO"
    ],
    "selectSource": "catalog",
    "valueKind": "string"
  },
  "clase-titulo.es_convertible": {
    "valueKind": "boolean",
    "checks": [
      "boolean"
    ]
  },
  "clase-titulo.es_participante": {
    "valueKind": "boolean",
    "checks": [
      "boolean"
    ]
  },
  "clase-titulo.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "clase-titulo.id_clase_titulo": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "clase-titulo.sub_tipo": {
    "maxLength": 60
  },
  "clase-titulo.tipo": {
    "type": "select",
    "options": [
      "ACCION",
      "CUOTA",
      "PARTICIPACION",
      "BONO_CONVERTIBLE",
      "SAFE",
      "WARRANT",
      "OPCION"
    ],
    "selectSource": "enum",
    "valueKind": "string"
  },
  "clase-titulo.valor_nominal": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "concepto-costo.codigo": {
    "maxLength": 50
  },
  "concepto-costo.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "concepto-costo.id_concepto": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "concepto-costo.nombre": {
    "maxLength": 160
  },
  "concepto-costo.tipo_concepto": {
    "type": "select",
    "options": [
      "BIEN",
      "SERVICIO",
      "OTRO"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 15
  },
  "concepto-costo.unidad_medida": {
    "maxLength": 20
  },
  "cuenta-asignacion.id_bien": {
    "type": "select",
    "relation": {
      "endpoint": "/api/inventario/bien",
      "valueField": "id_bien",
      "labelFields": [
        "nombre",
        "sku",
        "tipo",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "bien"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "cuenta-asignacion.id_cuenta": {
    "type": "select",
    "relation": {
      "endpoint": "/api/contabilidad/cuenta",
      "valueField": "id_cuenta",
      "labelFields": [
        "nombre_cuenta",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "cuenta"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "cuenta-asignacion.id_cuenta_asignacion": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "cuenta-asignacion.id_departamento": {
    "type": "select",
    "relation": {
      "endpoint": "/api/administracion/departamento",
      "valueField": "id_departamento",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "departamento"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "cuenta-asignacion.id_deuda": {
    "type": "select",
    "relation": {
      "endpoint": "/api/deuda/deuda",
      "valueField": "id_deuda",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "deuda"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "cuenta-asignacion.id_edificio": {
    "type": "select",
    "relation": {
      "endpoint": "/api/infraestructura/edificio",
      "valueField": "id_edificio",
      "labelFields": [
        "nombre",
        "codigo",
        "direccion_linea1",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "edificio"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "cuenta-asignacion.id_empleado": {
    "type": "select",
    "relation": {
      "endpoint": "/api/administracion/empleado",
      "valueField": "id_empleado",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "empleado"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "cuenta-asignacion.id_persona_estudiante": {
    "type": "select",
    "relation": {
      "endpoint": "/api/personas/estudiante",
      "valueField": "id_persona",
      "labelFields": [
        "codigo_estudiante",
        "tipo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "estudiante"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "cuenta-asignacion.id_persona_tutor": {
    "type": "select",
    "relation": {
      "endpoint": "/api/personas/tutor",
      "valueField": "id_tutor",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "tutor"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "cuenta-asignacion.id_proveedor": {
    "type": "select",
    "relation": {
      "endpoint": "/api/personas/proveedor",
      "valueField": "id_proveedor",
      "labelFields": [
        "nombre_proveedor",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_cuenta",
        "nombre_version"
      ],
      "resourceKey": "proveedor"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "cuenta-asignacion.id_sucursal": {
    "type": "select",
    "relation": {
      "endpoint": "/api/infraestructura/sucursal",
      "valueField": "id_sucursal",
      "labelFields": [
        "nombre",
        "codigo",
        "email",
        "direccion_linea1",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "sucursal"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "cuenta-asignacion.id_tienda": {
    "type": "select",
    "relation": {
      "endpoint": "/api/infraestructura/tienda",
      "valueField": "id_tienda",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "tienda"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "cuenta.codigo": {
    "maxLength": 40
  },
  "cuenta.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "cuenta.id_cuenta": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "cuenta.id_grupo_cuenta": {
    "type": "select",
    "relation": {
      "endpoint": "/api/contabilidad/grupo-cuenta",
      "valueField": "id_grupo_cuenta",
      "labelFields": [
        "nombre",
        "codigo",
        "sub_tipo",
        "tipo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "grupo-cuenta"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "cuenta.nombre_cuenta": {
    "maxLength": 180
  },
  "curso-version.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "checks": [
      "boolean"
    ]
  },
  "curso-version.id_curso_version": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "curso-version.id_horario": {
    "type": "select",
    "relation": {
      "endpoint": "/api/servicios_educativos/horarios",
      "valueField": "id_horario",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "horarios"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "curso-version.id_producto_educativo": {
    "type": "select",
    "relation": {
      "endpoint": "/api/servicios_educativos/producto-educativo",
      "valueField": "id_producto_educativo",
      "labelFields": [
        "nombre",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "producto-educativo"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "curso-version.id_usuario": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "curso-version.nombre_version": {
    "maxLength": 150
  },
  "curso-version.precio_version": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "departamento.codigo": {
    "maxLength": 30
  },
  "departamento.descripcion_funciones": {
    "maxLength": 240
  },
  "departamento.es_activo": {
    "valueKind": "boolean",
    "checks": [
      "boolean"
    ]
  },
  "departamento.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "departamento.id_departamento": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "departamento.id_departamento_padre": {
    "type": "select",
    "relation": {
      "endpoint": "/api/administracion/departamento",
      "valueField": "id_departamento",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "departamento"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "departamento.id_jefe_empleado": {
    "type": "select",
    "relation": {
      "endpoint": "/api/administracion/empleado",
      "valueField": "id_empleado",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "empleado"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "departamento.id_sucursal": {
    "type": "select",
    "relation": {
      "endpoint": "/api/infraestructura/sucursal",
      "valueField": "id_sucursal",
      "labelFields": [
        "nombre",
        "codigo",
        "email",
        "direccion_linea1",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "sucursal"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "departamento.nombre": {
    "maxLength": 120
  },
  "deuda.capitalizacion": {
    "type": "select",
    "options": [
      "ANUAL",
      "SEMESTRAL",
      "TRIMESTRAL",
      "BIMESTRAL",
      "MENSUAL"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20,
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "deuda.frecuencia_cuotas": {
    "type": "select",
    "options": [
      "ANUAL",
      "SEMESTRAL",
      "TRIMESTRAL",
      "BIMESTRAL",
      "MENSUAL"
    ],
    "selectSource": "catalog",
    "valueKind": "string"
  },
  "deuda.id_deuda": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "deuda.id_proveedor": {
    "type": "select",
    "relation": {
      "endpoint": "/api/personas/proveedor",
      "valueField": "id_proveedor",
      "labelFields": [
        "nombre_proveedor",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_cuenta",
        "nombre_version"
      ],
      "resourceKey": "proveedor"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "deuda.monto_inicial": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "deuda.plazo_meses": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveNumber"
    ]
  },
  "deuda.seguro_desgravamen_fijo": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "deuda.seguro_desgravamen_variable": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "deuda.tasa_anual": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "percentOrRate"
    ]
  },
  "deuda.tipo_calculo_cuotas": {
    "type": "select",
    "options": [
      "FRANCES",
      "ALEMAN",
      "AMERICANO"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 10
  },
  "deuda.tipo_pago": {
    "type": "select",
    "options": [
      "VENCIDAS",
      "ANTICIPADAS"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20,
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "deuda.tipo_primer_pago": {
    "type": "select",
    "options": [
      "INMEDIATA",
      "DIFERIDA"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20,
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "deuda.tipo_tasa": {
    "type": "select",
    "options": [
      "SIMPLE",
      "COMPUESTA"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20,
    "min": 0,
    "checks": [
      "percentOrRate"
    ]
  },
  "dividendo-pago.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "dividendo-pago.fecha_pago_real": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "dividendo-pago.id_dividendo": {
    "type": "select",
    "relation": {
      "endpoint": "/api/societario/dividendo",
      "valueField": "id_dividendo",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "dividendo"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "dividendo-pago.id_dividendo_pago": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveInteger",
      "nonNegativeDecimal"
    ]
  },
  "dividendo-pago.id_titular": {
    "type": "select",
    "relation": {
      "endpoint": "/api/societario/titular",
      "valueField": "id_titular",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "titular"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "dividendo-pago.monto_pagado": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "dividendo.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "dividendo.fecha_pago": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "dividendo.id_clase_titulo": {
    "type": "select",
    "relation": {
      "endpoint": "/api/societario/clase-titulo",
      "valueField": "id_clase_titulo",
      "labelFields": [
        "sub_tipo",
        "tipo",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "clase-titulo"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "dividendo.id_dividendo": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "dividendo.monto_total": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "edificio.ciudad": {
    "maxLength": 80
  },
  "edificio.codigo": {
    "maxLength": 40
  },
  "edificio.departamento": {
    "maxLength": 80
  },
  "edificio.direccion_linea1": {
    "maxLength": 180
  },
  "edificio.id_administrador": {
    "type": "select",
    "relation": {
      "endpoint": "/api/administracion/empleado",
      "valueField": "id_empleado",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "empleado"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "edificio.id_edificio": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "edificio.id_sucursal": {
    "type": "select",
    "relation": {
      "endpoint": "/api/infraestructura/sucursal",
      "valueField": "id_sucursal",
      "labelFields": [
        "nombre",
        "codigo",
        "email",
        "direccion_linea1",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "sucursal"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "edificio.latitud": {
    "min": -90,
    "max": 90,
    "valueKind": "number",
    "checks": [
      "latitude"
    ]
  },
  "edificio.longitud": {
    "min": -180,
    "max": 180,
    "valueKind": "number",
    "checks": [
      "longitude"
    ]
  },
  "edificio.nombre": {
    "maxLength": 150
  },
  "edificio.pais": {
    "maxLength": 80
  },
  "edificio.pisos": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveNumber"
    ]
  },
  "emision-titulo.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "emision-titulo.id_clase_titulo": {
    "type": "select",
    "relation": {
      "endpoint": "/api/societario/clase-titulo",
      "valueField": "id_clase_titulo",
      "labelFields": [
        "sub_tipo",
        "tipo",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "clase-titulo"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "emision-titulo.id_emision": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "emision-titulo.instrumento": {
    "type": "select",
    "options": [
      "AUMENTO_CAPITAL",
      "CONVERSION",
      "PLAN_OPCIONES",
      "EMISION_SECUNDARIA",
      "OTRO"
    ],
    "selectSource": "enum",
    "valueKind": "string"
  },
  "emision-titulo.precio_emision": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "emision-titulo.ronda": {
    "type": "select",
    "options": [
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
    "selectSource": "enum",
    "valueKind": "string"
  },
  "emision-titulo.serie": {
    "maxLength": 30
  },
  "empleado-posicion-pago.comision_fija": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "empleado-posicion-pago.frecuencia_pago": {
    "type": "select",
    "options": [
      "MENSUAL",
      "QUINCENAL",
      "SEMANAL"
    ],
    "selectSource": "enum",
    "valueKind": "string",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "empleado-posicion-pago.id_empleado": {
    "type": "select",
    "relation": {
      "endpoint": "/api/administracion/empleado",
      "valueField": "id_empleado",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "empleado"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "empleado-posicion-pago.id_empleado_posicion": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "empleado-posicion-pago.id_posicion": {
    "type": "select",
    "relation": {
      "endpoint": "/api/administracion/posicion",
      "valueField": "id_posicion",
      "labelFields": [
        "nombre",
        "codigo",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "posicion"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "empleado-posicion-pago.moneda": {
    "maxLength": 3
  },
  "empleado-posicion-pago.pago_por_hora": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "empleado-posicion-pago.porcentaje_comision": {
    "valueKind": "number",
    "min": 0,
    "max": 100,
    "checks": [
      "nonNegativeDecimal",
      "percentOrRate"
    ]
  },
  "empleado-posicion-pago.sueldo_mensual": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "empleado-posicion-pago.tipo_calculo_comisionable": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "empleado-posicion-pago.tipo_comisionable": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "empleado-posicion-pago.tipo_esquema_pago": {
    "type": "select",
    "options": [
      "SUELDO",
      "POR_HORA",
      "COMISION",
      "MIXTO"
    ],
    "selectSource": "enum",
    "valueKind": "string",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "empleado-registro-pago.aguinaldos_totales_pagados": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "empleado-registro-pago.comisiones_totales_pagadas": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "empleado-registro-pago.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "empleado-registro-pago.fecha_pago": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "empleado-registro-pago.id_pago": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveInteger",
      "nonNegativeDecimal"
    ]
  },
  "empleado-registro-pago.indemnizacion_total_pagada": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "empleado-registro-pago.notas_pago": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "empleado.email_corporativo": {
    "maxLength": 200,
    "checks": [
      "email"
    ]
  },
  "empleado.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "empleado.id_empleado": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "empleado.id_persona": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "empleado.id_sucursal": {
    "type": "select",
    "relation": {
      "endpoint": "/api/infraestructura/sucursal",
      "valueField": "id_sucursal",
      "labelFields": [
        "nombre",
        "codigo",
        "email",
        "direccion_linea1",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "sucursal"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "empleado.jornada": {
    "type": "select",
    "options": [
      "FULL_TIME",
      "PART_TIME"
    ],
    "selectSource": "enum",
    "valueKind": "string"
  },
  "empleado.telefono_corporativo": {
    "maxLength": 100
  },
  "empleado.tipo_contrato": {
    "type": "select",
    "options": [
      "INDEFINIDO",
      "PLAZO_FIJO",
      "HONORARIOS"
    ],
    "selectSource": "enum",
    "valueKind": "string"
  },
  "encargado.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "encargado.id_asignacion": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "encargado.id_empleado": {
    "type": "select",
    "relation": {
      "endpoint": "/api/administracion/empleado",
      "valueField": "id_empleado",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "empleado"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "encargado.id_sucursal": {
    "type": "select",
    "relation": {
      "endpoint": "/api/infraestructura/sucursal",
      "valueField": "id_sucursal",
      "labelFields": [
        "nombre",
        "codigo",
        "email",
        "direccion_linea1",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "sucursal"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "espacio.capacidad": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveNumber"
    ]
  },
  "espacio.categoria_sala": {
    "type": "select",
    "options": [
      "OFICINA",
      "CONFERENCIA",
      "REUNION",
      "ESPERA",
      "TIENDA",
      "OTRA"
    ],
    "selectSource": "enum",
    "valueKind": "string"
  },
  "espacio.es_privada": {
    "valueKind": "boolean",
    "checks": [
      "boolean"
    ]
  },
  "espacio.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "espacio.id_edificio": {
    "type": "select",
    "relation": {
      "endpoint": "/api/infraestructura/edificio",
      "valueField": "id_edificio",
      "labelFields": [
        "nombre",
        "codigo",
        "direccion_linea1",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "edificio"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "espacio.id_espacio": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "espacio.nombre": {
    "maxLength": 150
  },
  "espacio.observaciones": {
    "maxLength": 240
  },
  "espacio.tipo": {
    "type": "select",
    "options": [
      "AULA",
      "SALA"
    ],
    "selectSource": "enum",
    "valueKind": "string"
  },
  "espacio.tipo_aula": {
    "type": "select",
    "options": [
      "TEORIA",
      "LABORATORIO",
      "COMPUTACION",
      "MULTIUSO"
    ],
    "selectSource": "enum",
    "valueKind": "string"
  },
  "estudiante-padre.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "estudiante-padre.id_asociacion": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "estudiante-padre.id_estudiante": {
    "type": "select",
    "relation": {
      "endpoint": "/api/personas/estudiante",
      "valueField": "id_persona",
      "labelFields": [
        "codigo_estudiante",
        "tipo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "estudiante"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "estudiante-padre.id_padre": {
    "type": "select",
    "relation": {
      "endpoint": "/api/personas/padre",
      "valueField": "id_padre",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "padre"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "estudiante.carrera": {
    "maxLength": 100
  },
  "estudiante.codigo_estudiante": {
    "maxLength": 50
  },
  "estudiante.curso_actual": {
    "maxLength": 50
  },
  "estudiante.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "checks": [
      "boolean"
    ]
  },
  "estudiante.id_persona": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "estudiante.id_unidad_educativa": {
    "type": "select",
    "relation": {
      "endpoint": "/api/personas/unidad-educativa",
      "valueField": "id_unidad_educativa",
      "labelFields": [
        "nombre",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "unidad-educativa"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "estudiante.id_usuario": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "estudiante.nivel_actual": {
    "maxLength": 50
  },
  "estudiante.tipo": {
    "maxLength": 50
  },
  "estudiante.turno_actual": {
    "maxLength": 50
  },
  "grupo-cuenta.codigo": {
    "maxLength": 30
  },
  "grupo-cuenta.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "grupo-cuenta.id_grupo_cuenta": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "grupo-cuenta.id_parent": {
    "type": "select",
    "relation": {
      "endpoint": "/api/contabilidad/grupo-cuenta",
      "valueField": "id_grupo_cuenta",
      "labelFields": [
        "nombre",
        "codigo",
        "sub_tipo",
        "tipo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "grupo-cuenta"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "grupo-cuenta.nombre": {
    "maxLength": 150
  },
  "grupo-cuenta.sub_grupo": {
    "type": "select",
    "options": [
      "CORRIENTE",
      "NO_CORRIENTE",
      "ORDINARIO",
      "EXTRAORDINARIO"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "grupo-cuenta.sub_tipo": {
    "type": "select",
    "options": [
      "ACTIVO",
      "PASIVO",
      "PATRIMONIO",
      "INGRESO",
      "GASTO"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 15
  },
  "grupo-cuenta.tipo": {
    "type": "select",
    "options": [
      "BALANCE",
      "RESULTADOS"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 15
  },
  "horarios.id_horario": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "kpi.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "kpi.frecuencia": {
    "maxLength": 30
  },
  "kpi.id_kpi": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "kpi.nombre": {
    "maxLength": 150
  },
  "kpi.unidad_medida": {
    "maxLength": 50
  },
  "materia-tree.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "checks": [
      "boolean"
    ]
  },
  "materia-tree.id_tree": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "materia-tree.id_usuario": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "materia-tree.nombre": {
    "maxLength": 100
  },
  "materia-tree.subtema": {
    "maxLength": 100
  },
  "materia-tree.tema": {
    "maxLength": 100
  },
  "movimiento-detalle.cantidad": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveNumber"
    ]
  },
  "movimiento-detalle.id_bien": {
    "type": "select",
    "relation": {
      "endpoint": "/api/inventario/bien",
      "valueField": "id_bien",
      "labelFields": [
        "nombre",
        "sku",
        "tipo",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "bien"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "movimiento-detalle.id_bien_instancia": {
    "type": "select",
    "relation": {
      "endpoint": "/api/inventario/bien-instancia",
      "valueField": "id_bien_instancia",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "bien-instancia"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "movimiento-detalle.id_espacio_entrada": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "movimiento-detalle.id_espacio_salida": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "movimiento-detalle.id_lote": {
    "type": "select",
    "relation": {
      "endpoint": "/api/inventario/bien-lote",
      "valueField": "id_lote",
      "labelFields": [
        "lote_codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "bien-lote"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "movimiento-detalle.id_movimiento": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "objetivo-kpi.cumplido": {
    "valueKind": "boolean",
    "checks": [
      "boolean"
    ]
  },
  "objetivo-kpi.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "objetivo-kpi.id_kpi": {
    "type": "select",
    "relation": {
      "endpoint": "/api/administracion/kpi",
      "valueField": "id_kpi",
      "labelFields": [
        "nombre",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "kpi"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "objetivo-kpi.id_objetivo_kpi": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "objetivo-kpi.id_producto": {
    "type": "select",
    "relation": {
      "endpoint": "/api/servicios_educativos/producto-educativo",
      "valueField": "id_producto_educativo",
      "labelFields": [
        "nombre",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "producto-educativo"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "objetivo-kpi.id_producto_tienda": {
    "type": "select",
    "relation": {
      "endpoint": "/api/inventario/bien",
      "valueField": "id_bien",
      "labelFields": [
        "nombre",
        "sku",
        "tipo",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "bien"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "objetivo-kpi.id_sucursal": {
    "type": "select",
    "relation": {
      "endpoint": "/api/infraestructura/sucursal",
      "valueField": "id_sucursal",
      "labelFields": [
        "nombre",
        "codigo",
        "email",
        "direccion_linea1",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "sucursal"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "objetivo-kpi.id_tienda": {
    "type": "select",
    "relation": {
      "endpoint": "/api/infraestructura/tienda",
      "valueField": "id_tienda",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "tienda"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "objetivo-kpi.periodo": {
    "maxLength": 30
  },
  "objetivo-kpi.responsable": {
    "type": "select",
    "relation": {
      "endpoint": "/api/administracion/empleado",
      "valueField": "id_empleado",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "empleado"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "objetivo-kpi.valor_maximo": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "objetivo-kpi.valor_meta": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "objetivo-kpi.valor_minimo": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "padre.es_embajador": {
    "valueKind": "boolean",
    "checks": [
      "boolean"
    ]
  },
  "padre.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "padre.id_padre": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "pago-tutor-detalle.horas_pasadas": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveNumber"
    ]
  },
  "pago-tutor-detalle.id_clase": {
    "type": "select",
    "relation": {
      "endpoint": "/api/servicios_educativos/clase-por-hora",
      "valueField": "id_clase",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "clase-por-hora"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "pago-tutor-detalle.id_pago_tutor": {
    "type": "select",
    "relation": {
      "endpoint": "/api/contabilidad/pago-tutor",
      "valueField": "id_pago_tutor",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "pago-tutor"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveInteger",
      "nonNegativeDecimal"
    ]
  },
  "pago-tutor-detalle.id_pago_tutor_detalle": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveInteger",
      "nonNegativeDecimal"
    ]
  },
  "pago-tutor-detalle.tarifa_hora_aplicada": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "pago-tutor.ajustes": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "pago-tutor.estado_pago": {
    "type": "select",
    "options": [
      "BORRADOR",
      "APROBADO",
      "PAGADO",
      "ANULADO"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "pago-tutor.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string"
  },
  "pago-tutor.fecha_pago": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "pago-tutor.id_pago_tutor": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveInteger",
      "nonNegativeDecimal"
    ]
  },
  "pago-tutor.id_tutor": {
    "type": "select",
    "relation": {
      "endpoint": "/api/personas/tutor",
      "valueField": "id_tutor",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "tutor"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "pago-tutor.referencia_pago": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "pago-tutor.subtotal": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "pago-tutor.total": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "pago.capital_amortizado": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "pago.fecha_pago": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "pago.id_deuda": {
    "type": "select",
    "relation": {
      "endpoint": "/api/deuda/deuda",
      "valueField": "id_deuda",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "deuda"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "pago.id_pago": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveInteger",
      "nonNegativeDecimal"
    ]
  },
  "pago.interes_pagado": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "pago.otros_recargos_pagados": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "pago.seguro_desgravamen_pagado": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "paquetes-producto-educativo.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "checks": [
      "boolean"
    ]
  },
  "paquetes-producto-educativo.id_paquete": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "paquetes-producto-educativo.id_usuario": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "paquetes-producto-educativo.nombre_paquete": {
    "maxLength": 150
  },
  "paquetes-producto-educativo.precio_paquete": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "permiso.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string"
  },
  "permiso.id_permiso": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "posicion.codigo": {
    "maxLength": 40
  },
  "posicion.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "posicion.id_posicion": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "posicion.id_posicion_parent": {
    "type": "select",
    "relation": {
      "endpoint": "/api/administracion/posicion",
      "valueField": "id_posicion",
      "labelFields": [
        "nombre",
        "codigo",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "posicion"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "posicion.nombre": {
    "maxLength": 150
  },
  "producto-educativo.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "checks": [
      "boolean"
    ]
  },
  "producto-educativo.id_producto_educativo": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "producto-educativo.id_producto_tienda": {
    "type": "select",
    "relation": {
      "endpoint": "/api/inventario/bien",
      "valueField": "id_bien",
      "labelFields": [
        "nombre",
        "sku",
        "tipo",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "bien"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "producto-educativo.id_usuario": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "producto-educativo.lim_inf_estudiantes": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveNumber"
    ]
  },
  "producto-educativo.lim_sup_estudiantes": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveNumber"
    ]
  },
  "producto-educativo.link_bibliografia": {
    "checks": [
      "url"
    ]
  },
  "producto-educativo.link_publicidad": {
    "checks": [
      "url"
    ]
  },
  "producto-educativo.nombre": {
    "maxLength": 150
  },
  "producto-educativo.precio_base": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "producto-educativo.tipo_producto": {
    "maxLength": 50
  },
  "proveedor.categoria": {
    "maxLength": 100
  },
  "proveedor.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "proveedor.id_proveedor": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "proveedor.nombre_proveedor": {
    "maxLength": 180
  },
  "proveedor.telefono": {
    "maxLength": 100
  },
  "rol-permiso.id_permiso": {
    "type": "select",
    "relation": {
      "endpoint": "/api/seguridad/permiso",
      "valueField": "id_permiso",
      "labelFields": [
        "codigo",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "permiso"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "rol-permiso.id_rol": {
    "type": "select",
    "relation": {
      "endpoint": "/api/seguridad/rol",
      "valueField": "id_rol",
      "labelFields": [
        "nombre",
        "codigo",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "rol"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "rol.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string"
  },
  "rol.id_rol": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "sucursal.ciudad": {
    "maxLength": 80
  },
  "sucursal.codigo": {
    "maxLength": 40
  },
  "sucursal.departamento": {
    "maxLength": 80
  },
  "sucursal.direccion_linea1": {
    "maxLength": 180
  },
  "sucursal.email": {
    "maxLength": 200,
    "checks": [
      "email"
    ]
  },
  "sucursal.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "sucursal.horario_texto": {
    "maxLength": 240
  },
  "sucursal.id_sucursal": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "sucursal.nombre": {
    "maxLength": 150
  },
  "sucursal.pais": {
    "maxLength": 80
  },
  "sucursal.telefono": {
    "maxLength": 100
  },
  "tenencia.cantidad": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveNumber"
    ]
  },
  "tenencia.es_nominativa": {
    "valueKind": "boolean",
    "checks": [
      "boolean"
    ]
  },
  "tenencia.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "tenencia.id_emision": {
    "type": "select",
    "relation": {
      "endpoint": "/api/societario/emision-titulo",
      "valueField": "id_emision",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "emision-titulo"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "tenencia.id_tenencia": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "tenencia.id_titular": {
    "type": "select",
    "relation": {
      "endpoint": "/api/societario/titular",
      "valueField": "id_titular",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "titular"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "tenencia.origen": {
    "type": "select",
    "options": [
      "EMISION",
      "TRANSFERENCIA",
      "CONVERSION",
      "EJERCICIO_OPCION",
      "AJUSTE"
    ],
    "selectSource": "enum",
    "valueKind": "string"
  },
  "tienda.codigo": {
    "maxLength": 40
  },
  "tienda.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "tienda.horario_texto": {
    "maxLength": 240
  },
  "tienda.id_espacio": {
    "type": "select",
    "relation": {
      "endpoint": "/api/infraestructura/espacio",
      "valueField": "id_espacio",
      "labelFields": [
        "nombre",
        "tipo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "espacio"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "tienda.id_responsable": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "tienda.id_tienda": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "tienda.nombre": {
    "maxLength": 150
  },
  "titular.es_beneficial_owner": {
    "valueKind": "boolean",
    "checks": [
      "boolean"
    ]
  },
  "titular.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "titular.id_persona": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "titular.id_titular": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "transaccion-movimiento-cuenta.debe": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "transaccion-movimiento-cuenta.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "transaccion-movimiento-cuenta.haber": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "transaccion-movimiento-cuenta.id_cuenta": {
    "type": "select",
    "relation": {
      "endpoint": "/api/contabilidad/cuenta",
      "valueField": "id_cuenta",
      "labelFields": [
        "nombre_cuenta",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "cuenta"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "transaccion-movimiento-cuenta.id_movimiento": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "transaccion-movimiento-cuenta.id_transaccion": {
    "type": "select",
    "relation": {
      "endpoint": "/api/contabilidad/transaccion",
      "valueField": "id_transaccion",
      "labelFields": [
        "glosa",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "transaccion"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "transaccion.glosa": {
    "maxLength": 300
  },
  "transaccion.id_bien": {
    "type": "select",
    "relation": {
      "endpoint": "/api/inventario/bien",
      "valueField": "id_bien",
      "labelFields": [
        "nombre",
        "sku",
        "tipo",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "bien"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "transaccion.id_centro_costo_mapa": {
    "type": "select",
    "relation": {
      "endpoint": "/api/contabilidad/centro-costo-mapa",
      "valueField": "id_cc_mapa",
      "labelFields": [
        "tipo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "centro-costo-mapa"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveInteger",
      "nonNegativeDecimal"
    ]
  },
  "transaccion.id_clase_por_hora": {
    "type": "select",
    "relation": {
      "endpoint": "/api/servicios_educativos/clase-por-hora",
      "valueField": "id_clase",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "clase-por-hora"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "transaccion.id_departamento": {
    "type": "select",
    "relation": {
      "endpoint": "/api/administracion/departamento",
      "valueField": "id_departamento",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "departamento"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "transaccion.id_deuda": {
    "type": "select",
    "relation": {
      "endpoint": "/api/deuda/deuda",
      "valueField": "id_deuda",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "deuda"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "transaccion.id_empleado": {
    "type": "select",
    "relation": {
      "endpoint": "/api/administracion/empleado",
      "valueField": "id_empleado",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "empleado"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "transaccion.id_empleado_pago": {
    "type": "select",
    "relation": {
      "endpoint": "/api/administracion/empleado-registro-pago",
      "valueField": "id_pago",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "empleado-registro-pago"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveInteger",
      "nonNegativeDecimal"
    ]
  },
  "transaccion.id_movimiento_detalle": {
    "type": "select",
    "relation": {
      "endpoint": "/api/inventario/movimiento-detalle",
      "valueField": "id_movimiento",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "movimiento-detalle"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "transaccion.id_pago_deuda": {
    "type": "select",
    "relation": {
      "endpoint": "/api/deuda/pago",
      "valueField": "id_pago",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "pago"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveInteger",
      "nonNegativeDecimal"
    ]
  },
  "transaccion.id_producto_educativo": {
    "type": "select",
    "relation": {
      "endpoint": "/api/servicios_educativos/producto-educativo",
      "valueField": "id_producto_educativo",
      "labelFields": ["nombre", "tipo_producto", "descripcion", "codigo", "nombre_version"],
      "resourceKey": "producto-educativo"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": ["positiveInteger"]
  },
  "transaccion.id_curso_version": {
    "type": "select",
    "relation": {
      "endpoint": "/api/servicios_educativos/curso-version",
      "valueField": "id_curso_version",
      "labelFields": ["nombre_version", "descripcion_version", "nombre", "codigo"],
      "resourceKey": "curso-version"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": ["positiveInteger"]
  },
  "transaccion.id_sucursal": {
    "type": "select",
    "relation": {
      "endpoint": "/api/infraestructura/sucursal",
      "valueField": "id_sucursal",
      "labelFields": ["nombre", "codigo", "ciudad", "direccion_linea1"],
      "resourceKey": "sucursal"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": ["positiveInteger"]
  },
  "transaccion.id_tienda": {
    "type": "select",
    "relation": {
      "endpoint": "/api/infraestructura/tienda",
      "valueField": "id_tienda",
      "labelFields": ["nombre", "codigo", "horario_texto"],
      "resourceKey": "tienda"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": ["positiveInteger"]
  },
  "transaccion.id_proveedor": {
    "type": "select",
    "relation": {
      "endpoint": "/api/personas/proveedor",
      "valueField": "id_proveedor",
      "labelFields": ["nombre_proveedor", "categoria", "telefono", "nombre"],
      "resourceKey": "proveedor"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": ["positiveInteger"]
  },
  "transaccion.id_dividendo_pago": {
    "type": "select",
    "relation": {
      "endpoint": "/api/societario/dividendo-pago",
      "valueField": "id_dividendo_pago",
      "labelFields": ["monto_pagado", "fecha_pago_real", "estado_registro"],
      "resourceKey": "dividendo-pago"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": ["positiveInteger"]
  },
  "transaccion.id_emision_titulo": {
    "type": "select",
    "relation": {
      "endpoint": "/api/societario/emision-titulo",
      "valueField": "id_emision",
      "labelFields": ["serie", "ronda", "instrumento", "fecha_emision"],
      "resourceKey": "emision-titulo"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": ["positiveInteger"]
  },
  "transaccion.id_pago_tutor": {
    "type": "select",
    "relation": {
      "endpoint": "/api/contabilidad/pago-tutor",
      "valueField": "id_pago_tutor",
      "labelFields": ["id_tutor", "periodo_inicio", "estado_pago", "total"],
      "resourceKey": "pago-tutor"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": ["positiveInteger"]
  },
  "transaccion.id_cliente": {
    "type": "number",
    "valueKind": "number",
    "checks": ["positiveInteger"]
  },
  "transaccion.id_transaccion": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "transaccion.tipo_transaccion": {
    "type": "select",
    "options": [
      "GENERAL",
      "COSTO",
      "VENTA",
      "BIEN",
      "DEUDA"
    ],
    "selectSource": "enum",
    "valueKind": "string"
  },
  "transferencia-titulo.cantidad": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "positiveNumber"
    ]
  },
  "transferencia-titulo.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "transferencia-titulo.id_emision": {
    "type": "select",
    "relation": {
      "endpoint": "/api/societario/emision-titulo",
      "valueField": "id_emision",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "emision-titulo"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "transferencia-titulo.id_titular_destino": {
    "type": "select",
    "relation": {
      "endpoint": "/api/societario/titular",
      "valueField": "id_titular",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "titular"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "transferencia-titulo.id_titular_origen": {
    "type": "select",
    "relation": {
      "endpoint": "/api/societario/titular",
      "valueField": "id_titular",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "titular"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "transferencia-titulo.id_transferencia": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "transferencia-titulo.precio_unitario": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "tutor.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "checks": [
      "boolean"
    ]
  },
  "tutor.id_persona": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "tutor.id_tutor": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "tutor.id_usuario": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "tutor.nivel_estudiante_especialidad": {
    "type": "select",
    "options": [
      "PRIMARIA",
      "SECUNDARIA"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "tutor.nivel_experiencia": {
    "type": "select",
    "options": [
      "RECLUTA",
      "EXPERIMENTADO",
      "SENIOR"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "tutor.pago_por_hora": {
    "valueKind": "number",
    "min": 0,
    "checks": [
      "nonNegativeDecimal"
    ]
  },
  "tutor.tipo_estudiante_especialidad": {
    "type": "select",
    "options": [
      "UNIVERSITARIO",
      "COLEGIAL"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "unidad-educativa.categoria": {
    "maxLength": 20
  },
  "unidad-educativa.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "checks": [
      "boolean"
    ]
  },
  "unidad-educativa.id_unidad_educativa": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "unidad-educativa.id_usuario": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "unidad-educativa.latitud": {
    "min": -90,
    "max": 90,
    "valueKind": "number",
    "checks": [
      "latitude"
    ]
  },
  "unidad-educativa.longitud": {
    "min": -180,
    "max": 180,
    "valueKind": "number",
    "checks": [
      "longitude"
    ]
  },
  "unidad-educativa.nombre": {
    "maxLength": 150
  },
  "usuario-permiso.id_permiso": {
    "type": "select",
    "relation": {
      "endpoint": "/api/seguridad/permiso",
      "valueField": "id_permiso",
      "labelFields": [
        "codigo",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "permiso"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "usuario-permiso.id_persona": {
    "type": "select",
    "relation": {
      "endpoint": "/api/personas/usuario",
      "valueField": "id_persona",
      "labelFields": [
        "nombre",
        "codigo",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "usuario"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "usuario-permiso.permitido": {
    "valueKind": "boolean",
    "checks": [
      "boolean"
    ]
  },
  "usuario-rol.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string"
  },
  "usuario-rol.id_persona": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "usuario-rol.id_rol": {
    "type": "select",
    "relation": {
      "endpoint": "/api/seguridad/rol",
      "valueField": "id_rol",
      "labelFields": [
        "nombre",
        "codigo",
        "descripcion",
        "nombre_completo",
        "jefe_nombre_completo",
        "empleado_nombre_completo",
        "tutor_nombre_completo",
        "nombre_cuenta",
        "nombre_proveedor",
        "nombre_version"
      ],
      "resourceKey": "rol"
    },
    "selectSource": "foreignKey",
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "usuario.contrasena_hash": {
    "maxLength": 255
  },
  "usuario.es_super_usuario": {
    "valueKind": "boolean",
    "checks": [
      "boolean"
    ]
  },
  "usuario.estado_registro": {
    "type": "select",
    "options": [
      "Activo",
      "Inactivo",
      "Eliminado"
    ],
    "selectSource": "catalog",
    "valueKind": "string",
    "maxLength": 20
  },
  "usuario.id_persona": {
    "valueKind": "number",
    "checks": [
      "positiveInteger"
    ]
  },
  "usuario.nombre_usuario": {
    "maxLength": 80
  },
  "usuario.tipo_usuario": {
    "maxLength": 200
  }
};

export const accountMovementRelation = resourceFieldCatalog['__movement__.id_cuenta']?.relation;

export function applyResourceFieldCatalog(resources: CrudResourceDefinition[]): CrudResourceDefinition[] {
  return resources.map((resource) => ({
    ...resource,
    fields: resource.fields.map((field) => {
      const generatedPatch = resourceFieldCatalog[`${resource.key}.${field.name}`];
      const catalogPatch = getCatalogPatch(resource.key, field.name);
      return mergeFieldPatches(field, generatedPatch, catalogPatch);
    }),
  }));
}
