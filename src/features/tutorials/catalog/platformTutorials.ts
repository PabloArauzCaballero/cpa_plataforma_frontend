import type { TutorialDefinition } from '../domain/TutorialDefinition';
import { TUTORIAL_ANCHORS, anchorTarget, anchorTargetFor } from '../domain/tutorialAnchors';
import { TUTORIAL_CENTER_ROUTE } from '../domain/tutorialRoutes';

/**
 * Tutoriales transversales: los que cualquier usuario necesita el primer día,
 * independientemente de su rol o del módulo en el que trabaje.
 */
export const platformTutorials: TutorialDefinition[] = [
  {
    id: 'intro-plataforma',
    version: '1.0.0',
    title: 'Introducción a CPA Plataforma',
    description:
      'Qué es la plataforma, cómo está organizada y cuál es la idea clave para registrar información sin errores: los registros encadenados.',
    category: 'introduccion',
    difficulty: 'basico',
    route: '/',
    estimatedMinutes: 2,
    mandatory: true,
    recommended: true,
    nextTutorialId: 'navegacion-principal',
    tags: ['bienvenida', 'primeros pasos', 'general'],
    steps: [
      {
        id: 'bienvenida',
        order: 1,
        title: '👋 Bienvenido a CPA Plataforma',
        description:
          'Este recorrido dura unos dos minutos y explica cómo está organizada la plataforma. Puedes cerrarlo cuando quieras: tu avance se guarda y podrás continuar desde el Centro de tutoriales.',
      },
      {
        id: 'panel-principal',
        order: 2,
        title: 'El panel principal',
        description:
          'Esta es la pantalla de inicio. Desde aquí ves de un vistazo todas las áreas de trabajo disponibles para tu usuario.',
        target: anchorTarget(TUTORIAL_ANCHORS.homeHero),
        placement: 'bottom',
        route: '/',
      },
      {
        id: 'modulos',
        order: 3,
        title: 'Las áreas de trabajo',
        description:
          'Cada tarjeta es un módulo del negocio: Personas, Servicios educativos, Contabilidad, Inventario y los demás. Dentro de cada uno están las tablas que puedes consultar y registrar.',
        target: anchorTarget(TUTORIAL_ANCHORS.homeModules),
        placement: 'top',
        autoAction: 'scroll',
      },
      {
        id: 'registros-encadenados',
        order: 4,
        title: '🔗 La idea clave: registros encadenados',
        description:
          'Muchos registros dependen de otros que deben existir antes. Para crear una clase necesitas antes su horario y su curso. Cada módulo tiene un tutorial propio que te dice el orden correcto.',
      },
      {
        id: 'ayuda-siempre',
        order: 5,
        title: 'La ayuda siempre está a mano',
        description:
          'Este botón abre el tutorial de la pantalla en la que estés. Y en los formularios, el ícono ⓘ junto a cada campo explica qué significa y cómo llenarlo.',
        target: anchorTarget(TUTORIAL_ANCHORS.headerLauncher),
        placement: 'bottom',
        align: 'end',
      },
    ],
  },

  {
    id: 'navegacion-principal',
    version: '1.0.0',
    title: 'Moverte por la plataforma',
    description:
      'Cómo usar el menú lateral, entrar a un módulo, abrir el tablero de un módulo y llegar a la tabla que necesitas.',
    category: 'navegacion',
    difficulty: 'basico',
    route: '/',
    estimatedMinutes: 3,
    recommended: true,
    prerequisites: ['intro-plataforma'],
    nextTutorialId: 'consultar-informacion',
    tags: ['menú', 'navegación', 'módulos'],
    steps: [
      {
        id: 'menu-lateral',
        order: 1,
        title: 'El menú lateral',
        description:
          'Todo el sistema se recorre desde aquí. Sólo verás los módulos y las tablas para las que tu usuario tiene permiso.',
        target: anchorTarget(TUTORIAL_ANCHORS.sidebar),
        placement: 'right',
        route: '/',
      },
      {
        id: 'inicio',
        order: 2,
        title: 'Volver al inicio',
        description: 'Este enlace te devuelve siempre al panel principal, estés donde estés.',
        target: anchorTarget(TUTORIAL_ANCHORS.sidebarHome),
        placement: 'right',
      },
      {
        id: 'abrir-modulo',
        order: 3,
        title: 'Abre un módulo',
        description:
          'Haz clic en "Personas" para desplegar sus tablas. Personas es el mejor sitio para empezar: casi todo el sistema depende de ella.',
        target: anchorTargetFor(TUTORIAL_ANCHORS.sidebarModule, 'personas'),
        placement: 'right',
        expectedAction: { type: 'click' },
        hint: 'Haz clic sobre "Personas" en el menú lateral para continuar.',
      },
      {
        id: 'tablero-modulo',
        order: 4,
        title: 'El tablero del módulo',
        description:
          '"Tablero del módulo" abre una vista con todas las tablas del área y sus campos principales. Es la forma cómoda de encontrar la tabla correcta cuando aún no conoces sus nombres.',
        target: anchorTargetFor(TUTORIAL_ANCHORS.sidebarModuleBoard, 'personas'),
        placement: 'right',
        autoAction: 'reveal',
        optional: true,
      },
      {
        id: 'centro-tutoriales',
        order: 5,
        title: 'El Centro de tutoriales',
        description:
          'Aquí tienes todos los tutoriales disponibles, tu avance y los que te faltan. Puedes volver cuando quieras.',
        target: anchorTarget(TUTORIAL_ANCHORS.sidebarTutorials),
        placement: 'right',
      },
      {
        id: 'perfil-y-sesion',
        order: 6,
        title: 'Tu cuenta',
        description:
          'Arriba a la derecha están tu perfil y el cierre de sesión. Desde el perfil puedes revisar tus roles y permisos activos.',
        target: anchorTarget(TUTORIAL_ANCHORS.headerProfile),
        placement: 'bottom',
        align: 'end',
      },
    ],
  },

  {
    id: 'centro-de-ayuda',
    version: '1.0.0',
    title: 'Usar el Centro de tutoriales',
    description:
      'Cómo encontrar, iniciar, continuar y repetir un tutorial, y cómo leer tu porcentaje de avance.',
    category: 'introduccion',
    difficulty: 'basico',
    route: TUTORIAL_CENTER_ROUTE,
    estimatedMinutes: 2,
    recommended: true,
    tags: ['ayuda', 'tutoriales', 'avance'],
    steps: [
      {
        id: 'avance-general',
        order: 1,
        title: 'Tu avance general',
        description:
          'Esta barra resume cuántos tutoriales has completado. Sólo cuenta los tutoriales disponibles para tu rol.',
        target: anchorTarget(TUTORIAL_ANCHORS.centerProgress),
        placement: 'bottom',
        route: TUTORIAL_CENTER_ROUTE,
      },
      {
        id: 'buscador',
        order: 2,
        title: 'Buscar un tutorial',
        description:
          'Escribe aquí para filtrar por título, descripción o módulo. Por ejemplo: "contabilidad", "importar" o "estudiante".',
        target: anchorTarget(TUTORIAL_ANCHORS.centerSearch),
        placement: 'bottom',
        expectedAction: { type: 'input', minLength: 2 },
        hint: 'Escribe al menos dos letras en el buscador para continuar.',
      },
      {
        id: 'filtros',
        order: 3,
        title: 'Filtrar por estado o categoría',
        description:
          'Estos filtros te dejan ver sólo lo pendiente, lo obligatorio o los tutoriales de un módulo concreto.',
        target: anchorTarget(TUTORIAL_ANCHORS.centerFilters),
        placement: 'bottom',
      },
      {
        id: 'tarjeta',
        order: 4,
        title: 'Cada tarjeta es un tutorial',
        description:
          'Muestra la duración estimada, la dificultad, tu estado y los requisitos previos, si los tiene. Desde ella puedes comenzar, continuar donde lo dejaste o repetirlo entero.',
        target: anchorTarget(TUTORIAL_ANCHORS.centerList),
        placement: 'top',
        autoAction: 'scroll',
      },
      {
        id: 'cierre',
        order: 5,
        title: 'Listo',
        description:
          'Ya sabes moverte por el Centro de tutoriales. Cuando abras uno, el recorrido se ejecuta sobre la pantalla real de la aplicación, no sobre una simulación.',
      },
    ],
  },

  {
    id: 'perfil-usuario',
    version: '1.0.0',
    title: 'Revisar tu perfil, roles y permisos',
    description:
      'Dónde consultar tus datos de cuenta, qué rol tienes asignado y qué permisos determinan lo que puedes ver y hacer.',
    category: 'cuenta',
    difficulty: 'basico',
    route: '/perfil',
    estimatedMinutes: 2,
    tags: ['perfil', 'cuenta', 'permisos', 'roles'],
    steps: [
      {
        id: 'abrir-perfil',
        order: 1,
        title: 'Abre tu perfil',
        description: 'Tu perfil está siempre accesible desde el encabezado, con tu nombre de usuario.',
        target: anchorTarget(TUTORIAL_ANCHORS.headerProfile),
        placement: 'bottom',
        align: 'end',
        expectedAction: { type: 'navigate', route: '/perfil' },
        hint: 'Haz clic en tu nombre de usuario para abrir el perfil.',
      },
      {
        id: 'resumen',
        order: 2,
        title: 'Tu ficha',
        description:
          'Aquí ves tu nombre, correo, estado de la cuenta y tu rol principal. Estos datos vienen de la sesión: si algo no es correcto, debe corregirse en el módulo Seguridad.',
        target: anchorTarget(TUTORIAL_ANCHORS.profileSummary),
        placement: 'right',
        route: '/perfil',
      },
      {
        id: 'permisos',
        order: 3,
        title: 'Roles y permisos activos',
        description:
          'Esta sección explica por qué ves unas opciones y otras no. Si te falta acceso a una tabla, es aquí donde se comprueba.',
        target: anchorTarget(TUTORIAL_ANCHORS.profilePermissions),
        placement: 'top',
        autoAction: 'scroll',
        optional: true,
      },
      {
        id: 'actualizar',
        order: 4,
        title: 'Actualizar los datos',
        description:
          'Si un administrador acaba de cambiar tus permisos, este botón vuelve a consultar la sesión sin necesidad de cerrar y abrir de nuevo.',
        target: anchorTarget(TUTORIAL_ANCHORS.profileRefresh),
        placement: 'bottom',
        align: 'end',
      },
    ],
  },
];
