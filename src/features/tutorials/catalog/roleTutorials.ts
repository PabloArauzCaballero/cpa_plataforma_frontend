import type { TutorialDefinition } from '../domain/TutorialDefinition';
import { TUTORIAL_ANCHORS, anchorTarget } from '../domain/tutorialAnchors';

/**
 * Recorridos por rol principal.
 *
 * El acceso se declara con los permisos **reales** del catálogo CRUD (los mismos tokens
 * que usa `resource.permissions`) y, además, con nombres de rol habituales. Así el filtro
 * funciona tanto si el backend envía matriz de permisos como si sólo envía roles.
 *
 * Ojo: esto sólo decide qué se *ofrece*. Las validaciones de permiso de cada pantalla
 * siguen intactas; un tutorial nunca abre una puerta que el sistema tiene cerrada.
 */
export const roleTutorials: TutorialDefinition[] = [
  {
    id: 'rol-administrativo',
    version: '1.0.0',
    title: 'Rol Administrativo · tu día a día',
    description:
      'Recorrido pensado para quien gestiona personas, empleados y estructura interna: qué revisar cada día y en qué orden trabajar.',
    category: 'rol',
    difficulty: 'intermedio',
    route: '/',
    estimatedMinutes: 4,
    recommended: true,
    prerequisites: ['navegacion-principal'],
    access: {
      roles: ['ADMINISTRATIVO', 'ADMINISTRADOR', 'ADMIN'],
      permissions: ['ADMINISTRACION.EMPLEADO.CREATE', 'PERSONAS.PERSONA_ESTUDIANTE.CREATE'],
    },
    tags: ['rol', 'administración', 'personas', 'empleados'],
    steps: [
      {
        id: 'alcance',
        order: 1,
        title: 'Qué cubre tu rol',
        description:
          'Como perfil administrativo trabajas sobre dos módulos: Personas (altas de estudiantes, tutores y usuarios) y Administración (empleados, cargos, departamentos y pagos).',
        route: '/',
      },
      {
        id: 'menu',
        order: 2,
        title: 'Tus módulos en el menú',
        description:
          'El menú lateral sólo muestra lo que tu usuario puede abrir. Si echas en falta un módulo, es una cuestión de permisos, no un fallo de la pantalla.',
        target: anchorTarget(TUTORIAL_ANCHORS.sidebar),
        placement: 'right',
      },
      {
        id: 'orden-personas',
        order: 3,
        title: 'Altas de personas',
        description:
          'Unidad Educativa (si aplica) → Estudiante / Tutor / Usuario → Asociaciones. Recuerda: la persona base se crea junto con el rol, nunca por separado.',
      },
      {
        id: 'orden-administracion',
        order: 4,
        title: 'Estructura interna',
        description:
          'Sucursal → Posiciones → Departamentos → Empleado → Esquema de pago → Registro de pago. Cada paso necesita el anterior.',
      },
      {
        id: 'importacion',
        order: 5,
        title: 'Altas masivas',
        description:
          'Para cargas grandes usa "Importar Excel" desde el encabezado de la tabla: valida primero y procesa después. Es mucho más rápido que crear uno a uno.',
      },
    ],
  },

  {
    id: 'rol-contable',
    version: '1.0.0',
    title: 'Rol Contable · cierre y respaldos',
    description:
      'Recorrido para quien registra asientos: plan de cuentas, transacciones cuadradas, centros de costo y comprobantes.',
    category: 'rol',
    difficulty: 'avanzado',
    route: '/',
    estimatedMinutes: 5,
    recommended: true,
    prerequisites: ['navegacion-principal'],
    access: {
      roles: ['CONTADOR', 'CONTABILIDAD', 'FINANZAS'],
      permissions: ['CONTABILIDAD.TRANSACCION.CREATE', 'CONTABILIDAD.CUENTA.CREATE'],
    },
    tags: ['rol', 'contabilidad', 'transacciones', 'cierre'],
    steps: [
      {
        id: 'alcance',
        order: 1,
        title: 'Qué cubre tu rol',
        description:
          'Tu trabajo se apoya en tres piezas: el plan de cuentas, las transacciones con sus movimientos, y los respaldos documentales de cada asiento.',
        route: '/',
      },
      {
        id: 'configuracion',
        order: 2,
        title: 'Deja la configuración lista',
        description:
          '"Catálogos y cuentas operativas" define qué cuenta usa cada tipo de operación. Configurarlo antes evita corregir asientos después.',
        target: anchorTarget(TUTORIAL_ANCHORS.sidebar),
        placement: 'right',
      },
      {
        id: 'transaccion',
        order: 3,
        title: 'La transacción y sus movimientos',
        description:
          'La transacción es la cabecera Debe/Haber; los movimientos por cuenta son el detalle. La suma del Debe debe cuadrar con la del Haber antes de guardar.',
      },
      {
        id: 'centros-costo',
        order: 4,
        title: 'Clasifica por centro de costo',
        description:
          'Asignar concepto y centro de costo a cada movimiento es lo que permite después sacar el gasto por área responsable.',
      },
      {
        id: 'respaldos',
        order: 5,
        title: 'Adjunta el comprobante',
        description:
          'Sube el documento a la Biblioteca de archivos y enlázalo en "Archivos Transacción". Un asiento sin respaldo es un problema en la próxima auditoría.',
      },
      {
        id: 'pagos-tutores',
        order: 6,
        title: 'Pagos a tutores',
        description:
          'Se liquidan desde el "Parte de clases pasadas": primero se consolidan las clases dictadas y después se genera el pago con su detalle.',
      },
    ],
  },

  {
    id: 'rol-seguridad',
    version: '1.0.0',
    title: 'Rol Seguridad · accesos y permisos',
    description:
      'Cómo dar de alta un usuario y decidir exactamente qué puede ver y hacer, sin romper el acceso de nadie más.',
    category: 'rol',
    difficulty: 'avanzado',
    route: '/',
    estimatedMinutes: 4,
    prerequisites: ['navegacion-principal'],
    access: {
      roles: ['SEGURIDAD', 'ADMINISTRADOR', 'SUPER_ADMIN'],
    },
    tags: ['rol', 'seguridad', 'permisos', 'usuarios'],
    steps: [
      {
        id: 'alcance',
        order: 1,
        title: 'Qué cubre tu rol',
        description:
          'Administras el control de acceso: permisos (qué se puede hacer), roles (cómo se agrupan) y su asignación a usuarios.',
        route: '/',
      },
      {
        id: 'usuario-primero',
        order: 2,
        title: 'Primero existe la persona',
        description:
          'El usuario se crea en el módulo Personas ("Usuario"), igual que un estudiante o un tutor. Sólo después se le asignan roles en Seguridad.',
      },
      {
        id: 'roles',
        order: 3,
        title: 'Trabaja con roles, no con excepciones',
        description:
          'Agrupa permisos en roles y asigna roles a las personas. Los permisos individuales ("Usuario Permiso") son para excepciones puntuales, no para el uso diario.',
      },
      {
        id: 'verificar',
        order: 4,
        title: 'Comprueba el resultado',
        description:
          'La pantalla de perfil muestra los roles y permisos activos de una sesión. Es la forma rápida de confirmar que un cambio surtió efecto.',
        target: anchorTarget(TUTORIAL_ANCHORS.headerProfile),
        placement: 'bottom',
        align: 'end',
      },
      {
        id: 'cuidado',
        order: 5,
        title: 'Cuidado con quitar accesos',
        description:
          'Retirar un rol deja al usuario sin las tablas asociadas de inmediato. Avisa antes de hacerlo y comprueba que nadie quede sin poder trabajar.',
      },
    ],
  },
];
