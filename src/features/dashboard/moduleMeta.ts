export interface ModuleVisualMeta {
  icon: string;
  description: string;
  shortDescription: string;
  accent: string;
}

export const moduleVisualMeta: Record<string, ModuleVisualMeta> = {
  administracion: {
    icon: 'fa-solid fa-sitemap',
    description: 'Gestiona áreas internas, empleados, posiciones, pagos administrativos, objetivos y KPIs operativos.',
    shortDescription: 'Estructura interna, empleados y objetivos.',
    accent: 'Administración operativa',
  },
  contabilidad: {
    icon: 'fa-solid fa-file-invoice-dollar',
    description: 'Administra cuentas, centros de costo, transacciones contables y movimientos Debe/Haber fusionados.',
    shortDescription: 'Cuentas, costos y transacciones contables.',
    accent: 'Control financiero',
  },
  deuda: {
    icon: 'fa-solid fa-hand-holding-dollar',
    description: 'Controla compromisos de pago, cuotas, estados de deuda y seguimiento financiero de clientes.',
    shortDescription: 'Deudas, cuotas y seguimiento de pagos.',
    accent: 'Cartera y cobranza',
  },
  infraestructura: {
    icon: 'fa-solid fa-building-columns',
    description: 'Organiza sedes, aulas, espacios disponibles y recursos físicos usados por el centro académico.',
    shortDescription: 'Sedes, aulas y espacios físicos.',
    accent: 'Operación física',
  },
  inventario: {
    icon: 'fa-solid fa-boxes-stacked',
    description: 'Registra productos, stock, movimientos de inventario, entradas, salidas y disponibilidad operacional.',
    shortDescription: 'Stock, productos y movimientos.',
    accent: 'Control de existencias',
  },
  personas: {
    icon: 'fa-solid fa-users',
    description: 'Centraliza estudiantes, tutores, responsables, contactos y datos personales usados por los módulos.',
    shortDescription: 'Estudiantes, tutores y contactos.',
    accent: 'Base de personas',
  },
  seguridad: {
    icon: 'fa-solid fa-shield-halved',
    description: 'Configura usuarios, clases, permisos, accesos, acciones y reglas de navegación autorizada.',
    shortDescription: 'Usuarios, permisos y accesos.',
    accent: 'Acceso y permisos',
  },
  servicios_educativos: {
    icon: 'fa-solid fa-graduation-cap',
    description: 'Gestiona cursos, materias, horarios, paquetes educativos, versiones y productos académicos.',
    shortDescription: 'Cursos, horarios y productos educativos.',
    accent: 'Gestión académica',
  },
  societario: {
    icon: 'fa-solid fa-scale-balanced',
    description: 'Administra titulares, dividendos, emisiones, transferencias y estructura societaria del sistema.',
    shortDescription: 'Títulos, titulares y dividendos.',
    accent: 'Gobierno societario',
  },
};

export function getModuleVisualMeta(moduleKey: string): ModuleVisualMeta {
  return moduleVisualMeta[moduleKey] ?? {
    icon: 'fa-solid fa-layer-group',
    description: 'Módulo operativo del sistema CPA con registros, consulta, creación, edición e importación.',
    shortDescription: 'Módulo operativo del sistema CPA.',
    accent: 'Módulo CPA',
  };
}
