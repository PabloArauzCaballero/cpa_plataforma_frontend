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
};
