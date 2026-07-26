/**
 * Diccionario central de tooltips de negocio para los campos de los recursos.
 *
 * Objetivo: dar al usuario aclaraciones en lenguaje de negocio sobre QUÉ significa cada
 * campo y CÓMO llenarlo, sin ensuciar los formularios. El texto se muestra como tooltip
 * (ícono de ayuda) junto a la etiqueta del campo.
 *
 * Precedencia (ver applyResourceFieldCatalog): un `helpText` declarado explícitamente en
 * la definición del recurso gana; si no hay, se usa el tooltip específico
 * `resourceKey.fieldName`; y como último recurso, un tooltip genérico por nombre de campo.
 *
 * Cobertura inicial (módulos insignia): Personas y Servicios educativos, más los campos
 * de auditoría/comunes que aparecen en todo el sistema. El resto de módulos se irá
 * poblando de forma incremental sin cambiar esta mecánica.
 */

/** Tooltips genéricos por nombre de campo, aplicables a cualquier recurso. */
const genericFieldTooltips: Record<string, string> = {
  estado_registro:
    'Estado lógico del registro. "Activo" participa en las operaciones; "Inactivo" lo conserva como historial sin eliminarlo.',
  fecha_registro: 'Fecha en que se creó el registro. La asigna el sistema automáticamente.',
  fecha_modificacion: 'Última fecha en que se editó el registro. La asigna el sistema.',
  version_registro: 'Contador interno de versiones para control de concurrencia. Lo gestiona el sistema.',
  id_usuario_creador: 'Usuario que creó el registro. Lo asigna el sistema según tu sesión.',
  observaciones: 'Notas libres para dar contexto. No afecta cálculos ni validaciones.',
  descripcion: 'Texto descriptivo para identificar y entender el registro con facilidad.',
  telefono: 'Número de contacto. Incluye el prefijo si aplica; se usa para comunicación operativa.',
  email: 'Correo electrónico de contacto. Debe tener un formato válido (nombre@dominio).',
  nombres: 'Nombre(s) de pila de la persona.',
  apellidos: 'Apellidos de la persona.',
  fecha_nacimiento: 'Fecha de nacimiento. Se usa para clasificaciones académicas y de edad.',

  // Campos comunes que aparecen en muchos recursos de todos los módulos.
  codigo: 'Código único para identificar el registro. Debe ser irrepetible dentro de su catálogo.',
  nombre: 'Nombre con el que se identifica el registro en listas y reportes.',
  direccion: 'Domicilio o ubicación de referencia.',
  categoria: 'Clasificación del registro. Agrupa elementos similares para filtrar y reportar.',
  moneda: 'Moneda en la que se expresa el monto (por ejemplo, BOB o USD).',
  monto: 'Importe en dinero. Usa punto decimal y no incluyas separadores de miles.',
  fecha_inicio: 'Fecha desde la que aplica o entra en vigencia el registro.',
  fecha_fin: 'Fecha hasta la que aplica. Déjala vacía si sigue vigente.',
  cantidad: 'Número de unidades. Debe ser un valor mayor o igual a cero.',
  estado: 'Estado operativo actual del registro dentro de su flujo.',
  prioridad: 'Orden de preferencia cuando hay varias opciones válidas. Menor número = mayor prioridad.',
};

/**
 * Tooltips específicos por recurso y campo (`resourceKey.fieldName`).
 * Los campos ya cubiertos con `helpText` inline en resourceDefinitions.ts no necesitan
 * repetirse aquí; este mapa complementa el resto.
 */
const resourceFieldTooltips: Record<string, Record<string, string>> = {
  // ---------------------------------------------------------------- Personas
  estudiante: {
    tipo_documento: 'Tipo de documento de identidad. En Bolivia lo habitual es CI (cédula de identidad).',
    numero_documento: 'Número del documento seleccionado. Debe ser único por persona.',
    direccion: 'Domicilio de referencia del estudiante.',
    codigo_estudiante: 'Código interno para identificar al estudiante en la institución. Opcional.',
    id_unidad_educativa:
      'Colegio o universidad de procedencia. Debe existir previamente en "Unidad Educativa".',
    tipo: 'Define qué campos se piden después: COLEGIAL (nivel/curso/turno) o UNIVERSITARIO (carrera/año).',
    nivel_actual: 'Nivel escolar actual (por ejemplo, PRIMARIA o SECUNDARIA). Solo para COLEGIAL.',
    curso_actual: 'Curso o grado actual. Solo para COLEGIAL.',
    turno_actual: 'Turno de asistencia (por ejemplo, MAÑANA o TARDE). Solo para COLEGIAL.',
    carrera: 'Carrera universitaria que cursa. Solo para UNIVERSITARIO.',
    anio_ingreso: 'Año en que ingresó a la carrera. Solo para UNIVERSITARIO.',
  },
  tutor: {
    // nombres/apellidos/pago/nivel/especialidad ya tienen helpText inline en la definición.
    telefono: 'Teléfono de contacto del tutor para coordinar clases.',
    email: 'Correo del tutor. Se usa para notificaciones y coordinación.',
  },
  usuario: {
    // los campos ya tienen helpText inline en la definición.
  },
  padre: {
    es_embajador:
      'Marca si el padre/madre participa como embajador (recomienda la institución y accede a beneficios).',
  },
  proveedor: {
    nombre_proveedor: 'Razón social o nombre comercial del proveedor.',
    categoria: 'Rubro del proveedor (por ejemplo, papelería, tecnología, servicios).',
  },
  'unidad-educativa': {
    nombre: 'Nombre del colegio o universidad.',
    categoria: 'Clasificación de la unidad educativa (por ejemplo, privada, fiscal, de convenio).',
    latitud: 'Coordenada de ubicación (opcional). Útil para mapas y logística.',
    longitud: 'Coordenada de ubicación (opcional). Útil para mapas y logística.',
  },

  // ------------------------------------------------- Servicios educativos
  horarios: {
    hora_inicio_lunes: 'Hora de inicio del bloque del lunes. Deja vacío si no hay clase ese día.',
    hora_fin_lunes: 'Hora de fin del bloque del lunes. Debe ser posterior a la hora de inicio.',
    hora_inicio_martes: 'Hora de inicio del bloque del martes. Deja vacío si no hay clase.',
    hora_fin_martes: 'Hora de fin del bloque del martes.',
    hora_inicio_miercoles: 'Hora de inicio del bloque del miércoles.',
    hora_fin_miercoles: 'Hora de fin del bloque del miércoles.',
    hora_inicio_jueves: 'Hora de inicio del bloque del jueves.',
    hora_fin_jueves: 'Hora de fin del bloque del jueves.',
    hora_inicio_viernes: 'Hora de inicio del bloque del viernes.',
    hora_fin_viernes: 'Hora de fin del bloque del viernes.',
    hora_inicio_sabado: 'Hora de inicio del bloque del sábado.',
    hora_fin_sabado: 'Hora de fin del bloque del sábado.',
    repeticion:
      'Patrón de repetición del horario (por ejemplo, semanal). Define cómo se replican los bloques en el tiempo.',
  },
  'curso-version': {
    id_horario:
      'Horario semanal en el que se dicta esta versión del curso. Regístralo primero en "Horarios".',
  },
  'clase-curso': {
    id_curso_version: 'Versión del curso a la que pertenece la clase. Créala primero en "Curso Version".',
    id_tutor: 'Tutor que dicta la clase. Debe existir en "Tutor".',
  },
  'clase-por-hora': {
    id_tutor: 'Tutor que dicta la clase por hora. Debe existir en "Tutor".',
    id_estudiante: 'Estudiante que recibe la clase. Debe existir en "Estudiante".',
    id_materia_tree: 'Materia/tema de la clase, tomada del árbol de materias.',
  },
};

/**
 * Genera un tooltip razonable para campos de clave foránea (`id_...`) que no tienen uno
 * explícito. Son los más confusos para el usuario, así que aclaramos que referencian a
 * otro registro que debe existir antes. Devuelve undefined para el resto de campos.
 */
function generateForeignKeyTooltip(fieldName: string): string | undefined {
  if (!/^id_/.test(fieldName)) return undefined;
  const entidad = fieldName
    .replace(/^id_/, '')
    .replace(/_/g, ' ')
    .trim();
  if (!entidad) return undefined;
  return `Referencia a "${entidad}". Debe existir previamente en su propio módulo; selecciónalo o ingresa su identificador.`;
}

/**
 * Devuelve el tooltip de negocio para un campo, o undefined si no hay uno definido.
 * Precedencia: específico del recurso → genérico por nombre → generado para claves foráneas.
 */
export function getFieldTooltip(resourceKey: string, fieldName: string): string | undefined {
  return (
    resourceFieldTooltips[resourceKey]?.[fieldName] ??
    genericFieldTooltips[fieldName] ??
    generateForeignKeyTooltip(fieldName)
  );
}
