import type { TourStep } from './tourEngine';

/**
 * Recorrido de bienvenida (primera vez o desde el botón "Tutorial" del encabezado).
 * Explica el modelo mental de la plataforma y el concepto de registro encadenado.
 */
export function getAppOnboardingTour(): TourStep[] {
  return [
    {
      title: '👋 Bienvenido a CPA Plataforma',
      description:
        'Este recorrido de 1 minuto te muestra cómo está organizada la plataforma y cómo registrar la información en el orden correcto. Puedes cerrarlo cuando quieras y volver a abrirlo desde el botón "Tutorial".',
    },
    {
      element: '#app-sidebar',
      title: 'Módulos de trabajo',
      description:
        'Cada módulo agrupa un área del negocio: Personas, Servicios educativos, Contabilidad, Inventario, etc. Dentro de cada uno están los recursos que puedes registrar y consultar.',
    },
    {
      element: '[data-tour="module-personas"]',
      title: 'Empieza por Personas',
      description:
        'Personas es la base de casi todo. Un estudiante, un tutor o un usuario son "roles" de una persona. Al registrar el rol, la plataforma crea automáticamente la persona base: no necesitas registrarla por separado.',
    },
    {
      title: '🔗 Registros encadenados',
      description:
        'Muchos registros dependen de otros que deben existir antes. Por ejemplo, para una clase necesitas primero su horario y su curso. Cuando entres a un módulo, usa el botón "Tutorial" para ver el orden recomendado de ese módulo.',
    },
    {
      element: '[data-tour="tutorial-button"]',
      title: 'Ayuda siempre a mano',
      description:
        'Desde aquí abres el tutorial del módulo actual. Y en cada formulario, el ícono ⓘ junto a cada campo explica qué significa y cómo llenarlo.',
    },
  ];
}

/**
 * Tours por módulo: explican el orden de registro de las entidades encadenadas.
 * Devuelve null si el módulo aún no tiene un tutorial dedicado.
 */
export function getModuleTour(moduleKey: string): TourStep[] | null {
  return MODULE_TOURS[moduleKey] ?? null;
}

export function hasModuleTour(moduleKey: string): boolean {
  return moduleKey in MODULE_TOURS;
}

const MODULE_TOURS: Record<string, TourStep[]> = {
  personas: [
    {
      title: 'Módulo Personas · orden recomendado',
      description:
        'Aquí registras a las personas y sus roles. La regla clave: no creas una "persona" suelta; registras su rol (estudiante, tutor o usuario) y la persona base se crea junto con él.',
    },
    {
      title: 'Paso 1 (opcional) · Unidad Educativa',
      description:
        'Si vas a registrar estudiantes de un colegio o universidad, crea primero la Unidad Educativa. Así podrás seleccionarla al dar de alta al estudiante.',
    },
    {
      title: 'Paso 2 · Estudiante / Tutor / Usuario',
      description:
        'Registra el rol directamente. El formulario te pide primero los datos de la persona (nombres, apellidos, contacto) y luego los propios del rol. Todo se guarda en una sola operación: persona + rol.',
    },
    {
      title: 'Estudiante: COLEGIAL vs UNIVERSITARIO',
      description:
        'Al elegir el "Tipo estudiante" el formulario cambia: COLEGIAL pide nivel, curso y turno; UNIVERSITARIO pide carrera y año de ingreso. Completa solo lo que aparezca.',
    },
    {
      title: 'Tutor: especialidad y experiencia',
      description:
        'Indica el pago por hora, el nivel de experiencia (RECLUTA/EXPERIMENTADO/SENIOR) y a qué estudiantes enseña. Si la especialidad es COLEGIAL, se pedirá además el nivel (PRIMARIA/SECUNDARIA).',
    },
    {
      title: 'Paso 3 · Asociaciones',
      description:
        'Con las personas ya creadas, registra sus relaciones: por ejemplo "Estudiante Padre" vincula a un estudiante con su padre/madre usando los IDs existentes.',
    },
  ],
  servicios_educativos: [
    {
      title: 'Módulo Servicios educativos · orden recomendado',
      description:
        'Las clases dependen de varios registros previos. Este es el orden para que todo encaje sin errores de "referencia no encontrada".',
    },
    {
      title: 'Paso 1 · Horarios',
      description:
        'Crea primero el Horario: define las horas de inicio y fin por día de la semana. Deja vacíos los días sin clase. Este horario se reutiliza en las versiones de curso.',
    },
    {
      title: 'Paso 2 · Materia',
      description:
        'Registra o ubica la materia/tema en el árbol de materias. Se usará para clasificar cursos y clases por hora.',
    },
    {
      title: 'Paso 3 · Curso Version',
      description:
        'Crea la versión del curso y selecciona el Horario del paso 1. Si el horario no aparece en la lista, es porque aún no lo registraste.',
    },
    {
      title: 'Paso 4 · Clase Curso',
      description:
        'Registra la clase eligiendo la Curso Version (paso 3) y el Tutor que la dicta. El tutor debe existir en el módulo Personas.',
    },
    {
      title: 'Paso 5 · Clase por hora (opcional)',
      description:
        'Para clases individuales, usa "Clase por hora": selecciona tutor, estudiante y materia. Todos deben existir previamente.',
    },
  ],
  administracion: [
    {
      title: 'Módulo Administración · orden recomendado',
      description:
        'Aquí gestionas la estructura interna: sucursales, cargos, departamentos, empleados, su remuneración y los KPIs. Sigue este orden para que cada registro encuentre sus referencias.',
    },
    {
      title: 'Paso 1 · Sucursal (Infraestructura)',
      description:
        'La estructura organizativa cuelga de una sucursal. Si aún no existe, créala primero en el módulo Infraestructura y vuelve aquí.',
    },
    {
      title: 'Paso 2 · Posiciones',
      description:
        'Define el catálogo de cargos. Puedes anidarlos indicando una "posición padre" para armar el organigrama (por ejemplo, Coordinador depende de Dirección).',
    },
    {
      title: 'Paso 3 · Departamentos',
      description:
        'Crea las áreas de la organización. Asigna su sucursal y, de forma opcional, el departamento padre y el empleado que lo jefatura.',
    },
    {
      title: 'Paso 4 · Empleado',
      description:
        'Registra al empleado enlazando una persona existente (del módulo Personas) mediante su ID, más su fecha de ingreso, tipo de contrato, jornada y sucursal.',
    },
    {
      title: 'Paso 5 · Esquema de pago (Empleado Posición Pago)',
      description:
        'Define cómo se le paga: posición, esquema (sueldo/comisión), frecuencia, moneda y montos, con su fecha de vigencia. Es la base para calcular los pagos.',
    },
    {
      title: 'Paso 6 · Registro de pago',
      description:
        'Cada vez que se paga a un empleado, registra el detalle: haber básico, comisiones, aguinaldos, indemnizaciones y otros cargos, con sus notas.',
    },
    {
      title: 'Paso 7 · KPIs y objetivos',
      description:
        'Define los indicadores en "Kpi" y luego sus metas por periodo en "Objetivo Kpi" (meta, mínimo y máximo) para medir el desempeño por sucursal, tienda o producto.',
    },
  ],
  contabilidad: [
    {
      title: 'Módulo Contabilidad · orden recomendado',
      description:
        'Primero se construye el plan de cuentas y los centros de costo; después se registran las transacciones con sus movimientos y respaldos.',
    },
    {
      title: 'Paso 1 · Grupo de cuenta',
      description:
        'Crea los grupos que organizan el plan contable (activos, pasivos, ingresos, egresos, etc.). Son el nivel superior del árbol de cuentas.',
    },
    {
      title: 'Paso 2 · Cuenta',
      description:
        'Registra las cuentas dentro de cada grupo. Cada movimiento contable apuntará a una de estas cuentas.',
    },
    {
      title: 'Paso 3 · Asignación de cuenta',
      description:
        'Vincula las cuentas a su uso operativo mediante "Cuenta Asignación", para que la plataforma sepa qué cuenta usar en cada tipo de operación.',
    },
    {
      title: 'Paso 4 · Conceptos y centros de costo',
      description:
        'Define los conceptos de costo y los centros de costo (y su mapa) para poder clasificar cada ingreso o gasto por área responsable.',
    },
    {
      title: 'Paso 5 · Transacción',
      description:
        'Registra la transacción como cabecera Debe/Haber. Es el documento contable al que colgarán los movimientos por cuenta.',
    },
    {
      title: 'Paso 6 · Movimientos por cuenta',
      description:
        'Detalla en "Transacción Movimiento Cuenta" el importe por cada cuenta afectada. La suma del Debe debe cuadrar con la del Haber.',
    },
    {
      title: 'Paso 7 · Respaldos',
      description:
        'Adjunta el comprobante desde la Biblioteca de archivos (Archivos Transacción). Así cada asiento queda documentado.',
    },
    {
      title: 'Pagos a tutores',
      description:
        'Los pagos a tutores ("Pago Tutor" y su detalle) se generan a partir del "Parte de clases pasadas": primero se consolidan las clases dictadas y luego se liquida el pago.',
    },
  ],
  deuda: [
    {
      title: 'Módulo Deuda · orden recomendado',
      description:
        'Controla los compromisos de pago de los clientes y su cobranza. Son solo dos pasos, en este orden.',
    },
    {
      title: 'Paso 1 · Deuda',
      description:
        'Registra el compromiso: cliente/estudiante, monto total, moneda, plazos y cuotas. Queda con saldo pendiente por cobrar.',
    },
    {
      title: 'Paso 2 · Pago',
      description:
        'Registra cada abono contra una deuda existente. El saldo pendiente se reduce automáticamente con cada pago aplicado.',
    },
  ],
  infraestructura: [
    {
      title: 'Módulo Infraestructura · orden recomendado',
      description:
        'Es la base física de la que dependen otros módulos (aulas para clases, sucursales para empleados). Construye de lo general a lo específico.',
    },
    {
      title: 'Paso 1 · Sucursal',
      description:
        'Crea la sucursal: es el nodo raíz de la ubicación. Muchos registros (empleados, tiendas, edificios) la necesitan.',
    },
    {
      title: 'Paso 2 · Edificio',
      description:
        'Registra los edificios que pertenecen a una sucursal.',
    },
    {
      title: 'Paso 3 · Espacio',
      description:
        'Define los espacios/aulas dentro de un edificio. Estos espacios se seleccionan luego al registrar clases en Servicios educativos.',
    },
    {
      title: 'Paso 4 · Tienda',
      description:
        'Si la sucursal realiza ventas, registra la tienda asociada.',
    },
    {
      title: 'Paso 5 · Encargado',
      description:
        'Asigna los responsables de cada sucursal o espacio para completar la estructura física.',
    },
  ],
  inventario: [
    {
      title: 'Módulo Inventario · orden recomendado',
      description:
        'Primero defines el catálogo de bienes y luego registras sus existencias y movimientos.',
    },
    {
      title: 'Paso 1 · Bien',
      description:
        'Define el tipo de bien en el catálogo (nombre, categoría y unidad). Es la plantilla de la que dependen lotes e instancias.',
    },
    {
      title: 'Paso 2 · Lote (Bien Lote)',
      description:
        'Registra los lotes de un bien, normalmente al ingresar una compra o donación con su cantidad y origen.',
    },
    {
      title: 'Paso 3 · Instancia (Bien Instancia)',
      description:
        'Para bienes que se controlan uno por uno (equipos, activos), registra cada instancia con su código o número de serie.',
    },
    {
      title: 'Paso 4 · Movimientos',
      description:
        'Registra en "Movimiento Detalle" las entradas, salidas y traslados. Así el stock disponible se mantiene actualizado.',
    },
  ],
  societario: [
    {
      title: 'Módulo Societario · orden recomendado',
      description:
        'Administra titulares, títulos/acciones, su tenencia, transferencias y los dividendos. Este es el orden para que cada emisión tenga a quién asignarse.',
    },
    {
      title: 'Paso 1 · Titular',
      description:
        'Registra a los titulares (socios o accionistas). Son quienes poseerán los títulos.',
    },
    {
      title: 'Paso 2 · Clase de título',
      description:
        'Define las clases de títulos o acciones (por ejemplo, ordinarias o preferentes) con sus características.',
    },
    {
      title: 'Paso 3 · Emisión',
      description:
        'Emite títulos de una clase determinada en "Emisión Título", indicando cantidad y condiciones.',
    },
    {
      title: 'Paso 4 · Tenencia',
      description:
        'Asigna la tenencia de los títulos emitidos a cada titular. Aquí se registra quién posee qué.',
    },
    {
      title: 'Paso 5 · Transferencias',
      description:
        'Cuando un título cambia de manos, regístralo en "Transferencia Título" entre el titular origen y el destino.',
    },
    {
      title: 'Paso 6 · Dividendos',
      description:
        'Declara los dividendos y luego registra sus pagos ("Dividendo Pago") a los titulares según su tenencia.',
    },
  ],
  seguridad: [
    {
      title: 'Módulo Seguridad · orden recomendado',
      description:
        'Define el control de acceso: qué se puede hacer (permisos), cómo se agrupa (roles) y quién lo recibe (usuarios). Sigue el orden de menor a mayor.',
    },
    {
      title: 'Paso 1 · Permisos',
      description:
        'Registra los permisos atómicos del sistema: cada acción controlable (ver, crear, editar, eliminar por recurso).',
    },
    {
      title: 'Paso 2 · Roles',
      description:
        'Crea los roles que agruparán permisos (por ejemplo, Administrativo, Contador, Tutor).',
    },
    {
      title: 'Paso 3 · Rol · Permiso',
      description:
        'Asigna en "Rol Permiso" qué permisos incluye cada rol. Así defines de una vez lo que puede hacer todo el rol.',
    },
    {
      title: 'Paso 4 · Usuario · Rol',
      description:
        'Asigna roles a los usuarios (creados en el módulo Personas). El usuario hereda todos los permisos de sus roles.',
    },
    {
      title: 'Paso 5 · Usuario · Permiso (opcional)',
      description:
        'Para excepciones puntuales, otorga o restringe un permiso a un usuario específico en "Usuario Permiso", sin cambiar su rol.',
    },
  ],
};
