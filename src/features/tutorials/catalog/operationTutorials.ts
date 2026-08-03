import type { TutorialDefinition } from '../domain/TutorialDefinition';
import { TUTORIAL_ANCHORS, anchorTarget } from '../domain/tutorialAnchors';

/**
 * Tutoriales de las operaciones reales del día a día. Todos se ejecutan sobre pantallas
 * que existen; los pasos que dependen de un permiso se marcan como opcionales para que
 * un usuario sin ese permiso no se quede atascado en un elemento que no verá nunca.
 */

/** Recurso elegido como ejemplo del flujo principal: es el registro central del negocio. */
const ESTUDIANTE_ROUTE = '/modulos/personas/estudiante';
const PERSONAS_BOARD_ROUTE = '/modulos/personas';

export const operationTutorials: TutorialDefinition[] = [
  {
    id: 'flujo-principal-estudiante',
    version: '1.0.0',
    title: 'Flujo principal: registrar un estudiante',
    description:
      'El recorrido completo del registro más importante del sistema, desde el módulo hasta guardar la ficha. Explica por qué no se registra una "persona" suelta.',
    category: 'operacion',
    difficulty: 'basico',
    route: ESTUDIANTE_ROUTE,
    moduleKey: 'personas',
    estimatedMinutes: 5,
    mandatory: true,
    recommended: true,
    prerequisites: ['navegacion-principal'],
    nextTutorialId: 'consultar-informacion',
    tags: ['estudiante', 'personas', 'crear', 'flujo principal'],
    steps: [
      {
        id: 'concepto',
        order: 1,
        title: 'Primero, la regla importante',
        description:
          'En CPA no se crea una "persona" por separado. Registras su rol —estudiante, tutor o usuario— y la plataforma crea la persona base junto con él, en una sola operación.',
        route: ESTUDIANTE_ROUTE,
      },
      {
        id: 'encabezado',
        order: 2,
        title: 'La tabla de Estudiante',
        description:
          'El encabezado te dice en qué módulo y tabla estás, y cuántos registros hay. Todas las tablas del sistema se ven y se manejan igual que ésta.',
        target: anchorTarget(TUTORIAL_ANCHORS.resourceHeader),
        placement: 'bottom',
      },
      {
        id: 'ayuda-tabla',
        order: 3,
        title: 'La guía de la tabla',
        description:
          '"Ayuda" abre una ficha con los campos obligatorios de esta tabla y el orden de registro recomendado. Consúltala cuando dudes de un campo.',
        target: anchorTarget(TUTORIAL_ANCHORS.resourceHelp),
        placement: 'bottom',
        optional: true,
      },
      {
        id: 'abrir-formulario',
        order: 4,
        title: 'Crea un registro',
        description:
          'Pulsa "Crear registro" para abrir el formulario. Todavía no se guarda nada: sólo se abre la ventana.',
        target: anchorTarget(TUTORIAL_ANCHORS.resourceCreate),
        placement: 'left',
        expectedAction: { type: 'click' },
        hint: 'Pulsa "Crear registro" para abrir el formulario. Si no ves el botón, tu usuario no tiene permiso de creación en esta tabla.',
        optional: true,
      },
      {
        id: 'formulario',
        order: 5,
        title: 'Los datos de la persona',
        description:
          'La primera parte del formulario son los datos de la persona: nombres, apellidos, documento y contacto. El ícono ⓘ de cada campo explica qué se espera.',
        target: anchorTarget(TUTORIAL_ANCHORS.resourceForm),
        placement: 'left',
        waitForTargetMs: 8000,
        optional: true,
      },
      {
        id: 'tipo-estudiante',
        order: 6,
        title: 'El formulario cambia según el tipo',
        description:
          'Al elegir "Tipo estudiante" el formulario se adapta: COLEGIAL pide nivel, curso y turno; UNIVERSITARIO pide carrera y año de ingreso. Completa sólo lo que aparezca.',
        target: anchorTarget(TUTORIAL_ANCHORS.resourceForm),
        placement: 'left',
        optional: true,
      },
      {
        id: 'guardar',
        order: 7,
        title: 'Guardar cuando esté listo',
        description:
          'El botón de guardar envía persona y rol en una sola operación. Este tutorial no lo pulsa por ti: revisa los datos y guarda cuando sea un registro real.',
        target: anchorTarget(TUTORIAL_ANCHORS.resourceFormSubmit),
        placement: 'top',
        optional: true,
      },
      {
        id: 'cerrar',
        order: 8,
        title: 'Salir sin guardar',
        description:
          'Si sólo estabas practicando, cierra la ventana con "Cerrar". No se creará ningún registro.',
        target: anchorTarget(TUTORIAL_ANCHORS.modalClose),
        placement: 'left',
        optional: true,
      },
      {
        id: 'siguiente',
        order: 9,
        title: 'Y después...',
        description:
          'Con las personas creadas puedes registrar sus relaciones (por ejemplo "Estudiante Padre") y, en Servicios educativos, inscribirlas en clases.',
      },
    ],
  },

  {
    id: 'consultar-informacion',
    version: '1.0.0',
    title: 'Consultar y buscar información',
    description:
      'Cómo encontrar la tabla correcta dentro de un módulo y buscar un registro concreto sin conocer los nombres técnicos.',
    category: 'operacion',
    difficulty: 'basico',
    route: PERSONAS_BOARD_ROUTE,
    moduleKey: 'personas',
    estimatedMinutes: 3,
    recommended: true,
    nextTutorialId: 'filtros-y-tablas',
    tags: ['buscar', 'consultar', 'tablero'],
    steps: [
      {
        id: 'tablero',
        order: 1,
        title: 'El tablero del módulo',
        description:
          'Cada tarjeta es una tabla del módulo y muestra sus campos principales. No se abre ninguna por defecto: eliges tú.',
        target: anchorTarget(TUTORIAL_ANCHORS.moduleHero),
        placement: 'bottom',
        route: PERSONAS_BOARD_ROUTE,
      },
      {
        id: 'buscar-tabla',
        order: 2,
        title: 'Busca la tabla por lo que necesitas',
        description:
          'La búsqueda mira también dentro de los campos de cada tabla. Escribe "estudiante" para ver qué tablas lo contienen.',
        target: anchorTarget(TUTORIAL_ANCHORS.moduleSearch),
        placement: 'bottom',
        align: 'end',
        expectedAction: { type: 'input', minLength: 3 },
        hint: 'Escribe al menos tres letras en el buscador de tablas para continuar.',
      },
      {
        id: 'abrir-tabla',
        order: 3,
        title: 'Abrir la tabla',
        description:
          '"Abrir tabla" te lleva al listado con sus registros. "Importar" abre la carga masiva desde Excel, que verás en otro tutorial.',
        target: anchorTarget(TUTORIAL_ANCHORS.moduleGrid),
        placement: 'top',
        autoAction: 'scroll',
      },
      {
        id: 'buscar-registro',
        order: 4,
        title: 'Buscar dentro de la tabla',
        description:
          'Ya en el listado, esta búsqueda recorre todos los campos del registro. La consulta se aplica sola tras un instante, sin pulsar ningún botón.',
        target: anchorTarget(TUTORIAL_ANCHORS.resourceSearch),
        placement: 'bottom',
        route: ESTUDIANTE_ROUTE,
        waitForTargetMs: 10000,
      },
      {
        id: 'recargar',
        order: 5,
        title: 'Traer los datos otra vez',
        description:
          '"Actualizar" vuelve a consultar el servidor. Úsalo si otra persona acaba de registrar algo y quieres verlo.',
        target: anchorTarget(TUTORIAL_ANCHORS.resourceReload),
        placement: 'bottom',
        optional: true,
      },
    ],
  },

  {
    id: 'filtros-y-tablas',
    version: '1.0.0',
    title: 'Filtros, tablas y exportación',
    description:
      'Cómo acotar un listado con filtros, leer los estados de la tabla, moverte entre páginas y exportar el resultado.',
    category: 'operacion',
    difficulty: 'intermedio',
    route: ESTUDIANTE_ROUTE,
    moduleKey: 'personas',
    estimatedMinutes: 4,
    prerequisites: ['consultar-informacion'],
    tags: ['filtros', 'tabla', 'paginación', 'exportar'],
    steps: [
      {
        id: 'panel-filtros',
        order: 1,
        title: 'Los filtros de consulta',
        description:
          'Cada tabla ofrece los filtros que tienen sentido para sus campos. Se combinan entre sí y con la búsqueda por texto.',
        target: anchorTarget(TUTORIAL_ANCHORS.resourceFilters),
        placement: 'bottom',
        route: ESTUDIANTE_ROUTE,
        autoAction: 'reveal',
        waitForTargetMs: 10000,
      },
      {
        id: 'limpiar',
        order: 2,
        title: 'Volver a empezar',
        description:
          '"Limpiar filtros" descarta todas las condiciones de golpe. Si un listado sale vacío, casi siempre es por un filtro olvidado.',
        target: anchorTarget(TUTORIAL_ANCHORS.resourceClearFilters),
        placement: 'bottom',
      },
      {
        id: 'tabla',
        order: 3,
        title: 'Leer la tabla',
        description:
          'Las columnas de estado se muestran como etiqueta ("Activo" / "Inactivo") y las filas inhabilitadas se ven atenuadas, además de indicarlo con texto.',
        target: anchorTarget(TUTORIAL_ANCHORS.resourceTable),
        placement: 'top',
        autoAction: 'scroll',
        optional: true,
      },
      {
        id: 'acciones-fila',
        order: 4,
        title: 'Acciones sobre un registro',
        description:
          'El lápiz abre el registro para editarlo. La papelera lo inhabilita —no lo borra— y siempre pide confirmación antes de aplicarse.',
        target: anchorTarget(TUTORIAL_ANCHORS.resourceRowEdit),
        placement: 'left',
        optional: true,
      },
      {
        id: 'paginacion',
        order: 5,
        title: 'Moverte entre páginas',
        description:
          'Aquí eliges cuántas filas ver por página y avanzas por el listado. El total de registros es el de la consulta completa, no el de la página.',
        target: anchorTarget(TUTORIAL_ANCHORS.resourcePagination),
        placement: 'top',
        optional: true,
      },
      {
        id: 'exportar',
        order: 6,
        title: 'Exportar lo que estás viendo',
        description:
          '"Exportar" descarga el resultado con los filtros aplicados. Es la forma correcta de sacar un listado a Excel sin copiar y pegar.',
        target: anchorTarget(TUTORIAL_ANCHORS.resourceExport),
        placement: 'bottom',
        optional: true,
      },
    ],
  },

  {
    id: 'importacion-masiva',
    version: '1.0.0',
    title: 'Importar registros desde Excel',
    description:
      'Cómo cargar muchos registros de una vez: validar el archivo antes de procesarlo y corregir los errores señalados.',
    category: 'operacion',
    difficulty: 'intermedio',
    route: '/batch/personas/estudiante',
    moduleKey: 'personas',
    estimatedMinutes: 3,
    prerequisites: ['flujo-principal-estudiante'],
    tags: ['importar', 'excel', 'carga masiva', 'batch'],
    steps: [
      {
        id: 'donde',
        order: 1,
        title: 'Dónde está la importación',
        description:
          'Toda tabla con carga masiva tiene el enlace "Importar Excel" en su encabezado, y también un botón "Importar" en el tablero del módulo.',
        target: anchorTarget(TUTORIAL_ANCHORS.resourceImport),
        placement: 'bottom',
        route: ESTUDIANTE_ROUTE,
        waitForTargetMs: 10000,
        optional: true,
      },
      {
        id: 'pantalla',
        order: 2,
        title: 'La pantalla de importación',
        description:
          'Aquí pegas o cargas las filas. El proceso tiene siempre dos tiempos: primero se validan los datos y sólo después se procesan.',
        target: anchorTarget(TUTORIAL_ANCHORS.batchHeader),
        placement: 'bottom',
        route: '/batch/personas/estudiante',
        waitForTargetMs: 10000,
      },
      {
        id: 'validar',
        order: 3,
        title: 'Valida antes de procesar',
        description:
          'La validación te devuelve fila por fila qué está correcto, qué tiene advertencias y qué está mal, sin escribir nada en la base de datos.',
        target: anchorTarget(TUTORIAL_ANCHORS.batchHeader),
        placement: 'bottom',
      },
      {
        id: 'corregir',
        order: 4,
        title: 'Corrige y vuelve a validar',
        description:
          'Los errores más frecuentes son referencias inexistentes (un id que aún no está creado) y campos obligatorios vacíos. Corrige el archivo y valida de nuevo antes de procesar.',
      },
    ],
  },

  {
    id: 'configuracion-catalogos',
    version: '1.0.0',
    title: 'Configuración básica: catálogos y cuentas operativas',
    description:
      'Dónde se configuran los catálogos que el resto de la operación reutiliza, y por qué conviene dejarlos listos antes de registrar movimientos.',
    category: 'operacion',
    difficulty: 'intermedio',
    route: '/contabilidad/catalogos-cuentas-operativas',
    moduleKey: 'contabilidad',
    estimatedMinutes: 3,
    tags: ['configuración', 'catálogos', 'cuentas', 'contabilidad'],
    steps: [
      {
        id: 'donde',
        order: 1,
        title: 'Catálogos y cuentas operativas',
        description:
          'Esta pantalla concentra la configuración que después usarán las transacciones: qué cuenta corresponde a cada tipo de operación.',
        target: anchorTarget(TUTORIAL_ANCHORS.catalogsHero),
        placement: 'bottom',
        route: '/contabilidad/catalogos-cuentas-operativas',
        waitForTargetMs: 10000,
      },
      {
        id: 'antes-de-operar',
        order: 2,
        title: 'Configura antes de operar',
        description:
          'Si un catálogo no está definido, al registrar una transacción no encontrarás la cuenta que necesitas. Es más rápido dejarlo listo aquí que corregir asientos después.',
      },
      {
        id: 'orden',
        order: 3,
        title: 'El orden en Contabilidad',
        description:
          'Grupo de cuenta → Cuenta → Asignación de cuenta → Conceptos y centros de costo. Con eso hecho, las transacciones y sus movimientos encajan sin errores de referencia.',
      },
    ],
  },

  {
    id: 'biblioteca-archivos',
    version: '1.0.0',
    title: 'Biblioteca de archivos y respaldos',
    description:
      'Cómo subir y localizar los comprobantes que respaldan una transacción contable.',
    category: 'operacion',
    difficulty: 'basico',
    route: '/contabilidad/archivos',
    moduleKey: 'contabilidad',
    estimatedMinutes: 2,
    tags: ['archivos', 'comprobantes', 'respaldos', 'contabilidad'],
    steps: [
      {
        id: 'biblioteca',
        order: 1,
        title: 'La biblioteca de archivos',
        description:
          'Aquí viven los documentos de respaldo. Súbelos una vez y podrás enlazarlos desde los registros que los necesiten.',
        target: anchorTarget(TUTORIAL_ANCHORS.filesHero),
        placement: 'bottom',
        route: '/contabilidad/archivos',
        waitForTargetMs: 10000,
      },
      {
        id: 'respaldo',
        order: 2,
        title: 'Respaldar una transacción',
        description:
          'En la tabla "Archivos Transacción" se enlaza cada comprobante con su asiento contable. Así cada movimiento queda documentado y auditable.',
      },
      {
        id: 'buen-uso',
        order: 3,
        title: 'Buenas prácticas',
        description:
          'Sube el documento definitivo, no borradores, y nombra los archivos de forma reconocible: la biblioteca es compartida por todo el equipo.',
      },
    ],
  },
];
