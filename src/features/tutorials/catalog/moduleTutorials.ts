import type { TutorialDefinition, TutorialStep } from '../domain/TutorialDefinition';
import { TUTORIAL_ANCHORS, anchorTarget } from '../domain/tutorialAnchors';

/**
 * Tutoriales de orden de registro por módulo.
 *
 * Responden a la pregunta que más bloquea a un usuario nuevo: *¿en qué orden tengo que
 * crear las cosas para que no me diga que la referencia no existe?* Cada uno arranca en
 * el tablero real del módulo y luego enumera la secuencia de registro.
 */

interface ModuleTutorialInput {
  moduleKey: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  /** Explicación del criterio general del módulo (primer paso, sin elemento). */
  overview: string;
  /** Pasos del orden de registro, en secuencia. */
  sequence: Array<{ id: string; title: string; description: string }>;
  tags: string[];
  prerequisites?: string[];
}

function buildModuleTutorial(input: ModuleTutorialInput): TutorialDefinition {
  const route = `/modulos/${input.moduleKey}`;

  const introSteps: TutorialStep[] = [
    {
      id: 'tablero',
      order: 1,
      title: 'El tablero del módulo',
      description:
        'Estas son todas las tablas del módulo con sus campos principales. Este tutorial explica en qué orden conviene registrarlas.',
      target: anchorTarget(TUTORIAL_ANCHORS.moduleHero),
      placement: 'bottom',
      route,
      waitForTargetMs: 8000,
    },
    {
      id: 'criterio',
      order: 2,
      title: 'Criterio del módulo',
      description: input.overview,
      target: anchorTarget(TUTORIAL_ANCHORS.moduleGrid),
      placement: 'top',
      autoAction: 'scroll',
      optional: true,
    },
  ];

  const sequenceSteps: TutorialStep[] = input.sequence.map((step, index) => ({
    id: step.id,
    order: introSteps.length + index + 1,
    title: step.title,
    description: step.description,
  }));

  return {
    id: `modulo-${input.moduleKey}`,
    version: '1.0.0',
    title: input.title,
    description: input.description,
    category: 'modulo',
    difficulty: 'intermedio',
    route,
    moduleKey: input.moduleKey,
    estimatedMinutes: input.estimatedMinutes,
    prerequisites: input.prerequisites ?? ['navegacion-principal'],
    tags: input.tags,
    steps: [...introSteps, ...sequenceSteps],
  };
}

export const moduleTutorials: TutorialDefinition[] = [
  buildModuleTutorial({
    moduleKey: 'personas',
    title: 'Módulo Personas · orden de registro',
    description:
      'Cómo registrar estudiantes, tutores y usuarios, y por qué nunca se crea una persona por separado.',
    estimatedMinutes: 4,
    overview:
      'Aquí registras a las personas y sus roles. La regla clave: no creas una "persona" suelta; registras su rol (estudiante, tutor o usuario) y la persona base se crea junto con él.',
    tags: ['personas', 'estudiante', 'tutor', 'usuario'],
    sequence: [
      {
        id: 'unidad-educativa',
        title: 'Paso 1 (opcional) · Unidad Educativa',
        description:
          'Si vas a registrar estudiantes de un colegio o universidad, crea primero la Unidad Educativa. Así podrás seleccionarla al dar de alta al estudiante.',
      },
      {
        id: 'rol-persona',
        title: 'Paso 2 · Estudiante / Tutor / Usuario',
        description:
          'Registra el rol directamente. El formulario te pide primero los datos de la persona (nombres, apellidos, contacto) y luego los propios del rol. Todo se guarda en una sola operación: persona + rol.',
      },
      {
        id: 'tipo-estudiante',
        title: 'Estudiante: COLEGIAL vs UNIVERSITARIO',
        description:
          'Al elegir el "Tipo estudiante" el formulario cambia: COLEGIAL pide nivel, curso y turno; UNIVERSITARIO pide carrera y año de ingreso. Completa sólo lo que aparezca.',
      },
      {
        id: 'tutor',
        title: 'Tutor: especialidad y experiencia',
        description:
          'Indica el pago por hora, el nivel de experiencia (RECLUTA/EXPERIMENTADO/SENIOR) y a qué estudiantes enseña. Si la especialidad es COLEGIAL, se pedirá además el nivel (PRIMARIA/SECUNDARIA).',
      },
      {
        id: 'asociaciones',
        title: 'Paso 3 · Asociaciones',
        description:
          'Con las personas ya creadas, registra sus relaciones: por ejemplo "Estudiante Padre" vincula a un estudiante con su padre o madre usando los identificadores existentes.',
      },
    ],
  }),

  buildModuleTutorial({
    moduleKey: 'servicios_educativos',
    title: 'Módulo Servicios educativos · orden de registro',
    description: 'La secuencia para que una clase encaje: horario, materia, curso y tutor.',
    estimatedMinutes: 4,
    overview:
      'Las clases dependen de varios registros previos. Éste es el orden para que todo encaje sin errores de "referencia no encontrada".',
    tags: ['clases', 'cursos', 'horarios', 'materias'],
    sequence: [
      {
        id: 'horarios',
        title: 'Paso 1 · Horarios',
        description:
          'Crea primero el Horario: define las horas de inicio y fin por día de la semana. Deja vacíos los días sin clase. Este horario se reutiliza en las versiones de curso.',
      },
      {
        id: 'materia',
        title: 'Paso 2 · Materia',
        description:
          'Registra o ubica la materia en el árbol de materias. Se usará para clasificar cursos y clases por hora.',
      },
      {
        id: 'curso-version',
        title: 'Paso 3 · Curso Version',
        description:
          'Crea la versión del curso y selecciona el Horario del paso 1. Si el horario no aparece en la lista, es porque aún no lo registraste.',
      },
      {
        id: 'clase-curso',
        title: 'Paso 4 · Clase Curso',
        description:
          'Registra la clase eligiendo la Curso Version del paso 3 y el Tutor que la dicta. El tutor debe existir en el módulo Personas.',
      },
      {
        id: 'clase-por-hora',
        title: 'Paso 5 · Clase por hora (opcional)',
        description:
          'Para clases individuales, usa "Clase por hora": selecciona tutor, estudiante y materia. Todos deben existir previamente.',
      },
    ],
  }),

  buildModuleTutorial({
    moduleKey: 'administracion',
    title: 'Módulo Administración · orden de registro',
    description: 'Estructura interna: sucursales, cargos, departamentos, empleados, pagos y KPIs.',
    estimatedMinutes: 5,
    overview:
      'Aquí gestionas la estructura interna. Sigue este orden para que cada registro encuentre sus referencias.',
    tags: ['empleados', 'departamentos', 'pagos', 'kpi'],
    sequence: [
      {
        id: 'sucursal',
        title: 'Paso 1 · Sucursal (Infraestructura)',
        description:
          'La estructura organizativa cuelga de una sucursal. Si aún no existe, créala primero en el módulo Infraestructura y vuelve aquí.',
      },
      {
        id: 'posiciones',
        title: 'Paso 2 · Posiciones',
        description:
          'Define el catálogo de cargos. Puedes anidarlos indicando una "posición padre" para armar el organigrama (por ejemplo, Coordinador depende de Dirección).',
      },
      {
        id: 'departamentos',
        title: 'Paso 3 · Departamentos',
        description:
          'Crea las áreas de la organización. Asigna su sucursal y, de forma opcional, el departamento padre y el empleado que lo jefatura.',
      },
      {
        id: 'empleado',
        title: 'Paso 4 · Empleado',
        description:
          'Registra al empleado enlazando una persona existente (del módulo Personas) mediante su identificador, más su fecha de ingreso, tipo de contrato, jornada y sucursal.',
      },
      {
        id: 'esquema-pago',
        title: 'Paso 5 · Esquema de pago',
        description:
          'Define cómo se le paga: posición, esquema (sueldo/comisión), frecuencia, moneda y montos, con su fecha de vigencia. Es la base para calcular los pagos.',
      },
      {
        id: 'registro-pago',
        title: 'Paso 6 · Registro de pago',
        description:
          'Cada vez que se paga a un empleado, registra el detalle: haber básico, comisiones, aguinaldos, indemnizaciones y otros cargos, con sus notas.',
      },
      {
        id: 'kpis',
        title: 'Paso 7 · KPIs y objetivos',
        description:
          'Define los indicadores en "Kpi" y luego sus metas por periodo en "Objetivo Kpi" (meta, mínimo y máximo) para medir el desempeño por sucursal, tienda o producto.',
      },
    ],
  }),

  buildModuleTutorial({
    moduleKey: 'contabilidad',
    title: 'Módulo Contabilidad · orden de registro',
    description: 'Del plan de cuentas a la transacción con sus movimientos y respaldos.',
    estimatedMinutes: 5,
    overview:
      'Primero se construye el plan de cuentas y los centros de costo; después se registran las transacciones con sus movimientos y respaldos.',
    tags: ['cuentas', 'transacciones', 'centros de costo', 'asientos'],
    sequence: [
      {
        id: 'grupo-cuenta',
        title: 'Paso 1 · Grupo de cuenta',
        description:
          'Crea los grupos que organizan el plan contable (activos, pasivos, ingresos, egresos). Son el nivel superior del árbol de cuentas.',
      },
      {
        id: 'cuenta',
        title: 'Paso 2 · Cuenta',
        description: 'Registra las cuentas dentro de cada grupo. Cada movimiento contable apuntará a una de ellas.',
      },
      {
        id: 'asignacion',
        title: 'Paso 3 · Asignación de cuenta',
        description:
          'Vincula las cuentas a su uso operativo mediante "Cuenta Asignación", para que la plataforma sepa qué cuenta usar en cada tipo de operación.',
      },
      {
        id: 'centros-costo',
        title: 'Paso 4 · Conceptos y centros de costo',
        description:
          'Define los conceptos de costo y los centros de costo (y su mapa) para clasificar cada ingreso o gasto por área responsable.',
      },
      {
        id: 'transaccion',
        title: 'Paso 5 · Transacción',
        description:
          'Registra la transacción como cabecera Debe/Haber. Es el documento contable al que colgarán los movimientos por cuenta.',
      },
      {
        id: 'movimientos',
        title: 'Paso 6 · Movimientos por cuenta',
        description:
          'Detalla en "Transacción Movimiento Cuenta" el importe por cada cuenta afectada. La suma del Debe debe cuadrar con la del Haber.',
      },
      {
        id: 'respaldos',
        title: 'Paso 7 · Respaldos',
        description:
          'Adjunta el comprobante desde la Biblioteca de archivos (Archivos Transacción). Así cada asiento queda documentado.',
      },
      {
        id: 'pagos-tutores',
        title: 'Pagos a tutores',
        description:
          'Los pagos a tutores ("Pago Tutor" y su detalle) se generan a partir del "Parte de clases pasadas": primero se consolidan las clases dictadas y luego se liquida el pago.',
      },
    ],
  }),

  buildModuleTutorial({
    moduleKey: 'deuda',
    title: 'Módulo Deuda · orden de registro',
    description: 'Compromisos de pago de los clientes y su cobranza, en dos pasos.',
    estimatedMinutes: 2,
    overview: 'Controla los compromisos de pago de los clientes y su cobranza. Son sólo dos pasos, en este orden.',
    tags: ['deuda', 'cobranza', 'pagos', 'cuotas'],
    sequence: [
      {
        id: 'deuda',
        title: 'Paso 1 · Deuda',
        description:
          'Registra el compromiso: cliente o estudiante, monto total, moneda, plazos y cuotas. Queda con saldo pendiente por cobrar.',
      },
      {
        id: 'pago',
        title: 'Paso 2 · Pago',
        description:
          'Registra cada abono contra una deuda existente. El saldo pendiente se reduce automáticamente con cada pago aplicado.',
      },
    ],
  }),

  buildModuleTutorial({
    moduleKey: 'infraestructura',
    title: 'Módulo Infraestructura · orden de registro',
    description: 'Sedes, edificios, espacios y tiendas: la base física de la que dependen otros módulos.',
    estimatedMinutes: 3,
    overview:
      'Es la base física de la que dependen otros módulos (aulas para clases, sucursales para empleados). Construye de lo general a lo específico.',
    tags: ['sucursales', 'aulas', 'espacios', 'tiendas'],
    sequence: [
      {
        id: 'sucursal',
        title: 'Paso 1 · Sucursal',
        description:
          'Crea la sucursal: es el nodo raíz de la ubicación. Muchos registros (empleados, tiendas, edificios) la necesitan.',
      },
      { id: 'edificio', title: 'Paso 2 · Edificio', description: 'Registra los edificios que pertenecen a una sucursal.' },
      {
        id: 'espacio',
        title: 'Paso 3 · Espacio',
        description:
          'Define los espacios y aulas dentro de un edificio. Se seleccionan después al registrar clases en Servicios educativos.',
      },
      { id: 'tienda', title: 'Paso 4 · Tienda', description: 'Si la sucursal realiza ventas, registra la tienda asociada.' },
      {
        id: 'encargado',
        title: 'Paso 5 · Encargado',
        description: 'Asigna los responsables de cada sucursal o espacio para completar la estructura física.',
      },
    ],
  }),

  buildModuleTutorial({
    moduleKey: 'inventario',
    title: 'Módulo Inventario · orden de registro',
    description: 'Del catálogo de bienes a los lotes, instancias y movimientos de stock.',
    estimatedMinutes: 3,
    overview: 'Primero defines el catálogo de bienes y luego registras sus existencias y movimientos.',
    tags: ['inventario', 'stock', 'bienes', 'movimientos'],
    sequence: [
      {
        id: 'bien',
        title: 'Paso 1 · Bien',
        description:
          'Define el tipo de bien en el catálogo (nombre, categoría y unidad). Es la plantilla de la que dependen lotes e instancias.',
      },
      {
        id: 'lote',
        title: 'Paso 2 · Lote (Bien Lote)',
        description:
          'Registra los lotes de un bien, normalmente al ingresar una compra o donación con su cantidad y origen.',
      },
      {
        id: 'instancia',
        title: 'Paso 3 · Instancia (Bien Instancia)',
        description:
          'Para bienes que se controlan uno por uno (equipos, activos), registra cada instancia con su código o número de serie.',
      },
      {
        id: 'movimientos',
        title: 'Paso 4 · Movimientos',
        description:
          'Registra en "Movimiento Detalle" las entradas, salidas y traslados. Así el stock disponible se mantiene actualizado.',
      },
    ],
  }),

  buildModuleTutorial({
    moduleKey: 'societario',
    title: 'Módulo Societario · orden de registro',
    description: 'Titulares, títulos, tenencia, transferencias y dividendos.',
    estimatedMinutes: 4,
    overview:
      'Administra titulares, títulos o acciones, su tenencia, transferencias y dividendos. Éste es el orden para que cada emisión tenga a quién asignarse.',
    tags: ['societario', 'títulos', 'accionistas', 'dividendos'],
    sequence: [
      {
        id: 'titular',
        title: 'Paso 1 · Titular',
        description: 'Registra a los titulares (socios o accionistas). Son quienes poseerán los títulos.',
      },
      {
        id: 'clase-titulo',
        title: 'Paso 2 · Clase de título',
        description: 'Define las clases de títulos o acciones (ordinarias, preferentes) con sus características.',
      },
      {
        id: 'emision',
        title: 'Paso 3 · Emisión',
        description: 'Emite títulos de una clase determinada en "Emisión Título", indicando cantidad y condiciones.',
      },
      {
        id: 'tenencia',
        title: 'Paso 4 · Tenencia',
        description: 'Asigna la tenencia de los títulos emitidos a cada titular. Aquí se registra quién posee qué.',
      },
      {
        id: 'transferencias',
        title: 'Paso 5 · Transferencias',
        description:
          'Cuando un título cambia de manos, regístralo en "Transferencia Título" entre el titular origen y el destino.',
      },
      {
        id: 'dividendos',
        title: 'Paso 6 · Dividendos',
        description:
          'Declara los dividendos y luego registra sus pagos ("Dividendo Pago") a los titulares según su tenencia.',
      },
    ],
  }),

  buildModuleTutorial({
    moduleKey: 'seguridad',
    title: 'Módulo Seguridad · orden de registro',
    description: 'Permisos, roles y asignación a usuarios: el control de acceso del sistema.',
    estimatedMinutes: 3,
    overview:
      'Define el control de acceso: qué se puede hacer (permisos), cómo se agrupa (roles) y quién lo recibe (usuarios). Sigue el orden de menor a mayor.',
    tags: ['seguridad', 'permisos', 'roles', 'accesos'],
    sequence: [
      {
        id: 'permisos',
        title: 'Paso 1 · Permisos',
        description:
          'Registra los permisos atómicos del sistema: cada acción controlable (ver, crear, editar, eliminar por recurso).',
      },
      {
        id: 'roles',
        title: 'Paso 2 · Roles',
        description: 'Crea los roles que agruparán permisos (por ejemplo, Administrativo, Contador, Tutor).',
      },
      {
        id: 'rol-permiso',
        title: 'Paso 3 · Rol · Permiso',
        description:
          'Asigna en "Rol Permiso" qué permisos incluye cada rol. Así defines de una vez lo que puede hacer todo el rol.',
      },
      {
        id: 'usuario-rol',
        title: 'Paso 4 · Usuario · Rol',
        description:
          'Asigna roles a los usuarios (creados en el módulo Personas). El usuario hereda todos los permisos de sus roles.',
      },
      {
        id: 'usuario-permiso',
        title: 'Paso 5 · Usuario · Permiso (opcional)',
        description:
          'Para excepciones puntuales, otorga o restringe un permiso a un usuario concreto en "Usuario Permiso", sin cambiar su rol.',
      },
    ],
  }),
];
