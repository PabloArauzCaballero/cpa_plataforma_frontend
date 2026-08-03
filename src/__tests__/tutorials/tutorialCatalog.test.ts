import { FIRST_RUN_TUTORIAL_ID, createTutorialRegistry, tutorialCatalog } from '@/features/tutorials/catalog';
import { TUTORIAL_ANCHORS, TUTORIAL_ANCHOR_ATTRIBUTE } from '@/features/tutorials/domain/tutorialAnchors';
import { formatIssues, getBlockingIssues } from '@/features/tutorials/domain/tutorialValidation';
import { resourceModules } from '@/features/resources/domain/resourceDefinitions';
import { makeViewer } from './testFactories';

const registry = createTutorialRegistry();
const KNOWN_ANCHORS = new Set<string>(Object.values(TUTORIAL_ANCHORS));

describe('catálogo real de tutoriales', () => {
  it('no tiene errores de configuración', () => {
    const blocking = getBlockingIssues(registry.validate());
    expect(formatIssues(blocking)).toBe('');
  });

  it('no tiene tampoco advertencias pendientes', () => {
    expect(formatIssues(registry.validate())).toBe('');
  });

  it('cubre los flujos mínimos exigidos', () => {
    const ids = tutorialCatalog.map((tutorial) => tutorial.id);

    expect(ids).toEqual(
      expect.arrayContaining([
        'intro-plataforma',
        'navegacion-principal',
        'centro-de-ayuda',
        'perfil-usuario',
        'flujo-principal-estudiante',
        'consultar-informacion',
        'filtros-y-tablas',
        'importacion-masiva',
        'configuracion-catalogos',
        'biblioteca-archivos',
      ]),
    );
  });

  it('todos los módulos con recursos tienen tutorial de orden de registro', () => {
    for (const module of resourceModules) {
      const tutorial = registry.get(`modulo-${module.key}`);
      expect(tutorial).toBeDefined();
      expect(tutorial?.moduleKey).toBe(module.key);
      expect(tutorial?.category).toBe('modulo');
    }
  });

  it('incluye al menos un tutorial por cada rol principal', () => {
    const roleTutorials = tutorialCatalog.filter((tutorial) => tutorial.category === 'rol');
    expect(roleTutorials.length).toBeGreaterThanOrEqual(3);
    roleTutorials.forEach((tutorial) => {
      expect(tutorial.access?.roles?.length ?? 0).toBeGreaterThan(0);
    });
  });

  it('el tutorial de primer arranque existe y es obligatorio', () => {
    const intro = registry.get(FIRST_RUN_TUTORIAL_ID);
    expect(intro?.mandatory).toBe(true);
  });

  it('todos los pasos tienen título y descripción con contenido útil', () => {
    for (const tutorial of tutorialCatalog) {
      for (const step of tutorial.steps) {
        expect(step.title.trim().length).toBeGreaterThan(3);
        expect(step.description.trim().length).toBeGreaterThan(20);
      }
    }
  });

  it('todos los objetivos usan anclas declaradas, nunca clases CSS', () => {
    const anchorPattern = new RegExp(`\\[${TUTORIAL_ANCHOR_ATTRIBUTE}="([^"]+)"\\]`, 'g');

    for (const tutorial of tutorialCatalog) {
      for (const step of tutorial.steps) {
        if (!step.target) continue;

        const matches = Array.from(step.target.matchAll(anchorPattern)).map((match) => match[1]);
        expect(matches.length).toBeGreaterThan(0);
        matches.forEach((anchor) => expect(KNOWN_ANCHORS.has(anchor)).toBe(true));

        // Un selector de clase CSS sería frágil ante cualquier cambio de diseño.
        expect(step.target).not.toMatch(/\.[a-zA-Z]/);
      }
    }
  });

  it('las duraciones estimadas son razonables', () => {
    for (const tutorial of tutorialCatalog) {
      expect(tutorial.estimatedMinutes).toBeGreaterThan(0);
      expect(tutorial.estimatedMinutes).toBeLessThanOrEqual(15);
    }
  });

  it('un usuario sin roles ni permisos sigue viendo los tutoriales generales', () => {
    const visible = registry.listFor(makeViewer({ hasPermission: () => false }));

    expect(visible.map((tutorial) => tutorial.id)).toEqual(expect.arrayContaining([FIRST_RUN_TUTORIAL_ID]));
    expect(visible.some((tutorial) => tutorial.category === 'rol')).toBe(false);
  });

  it('un contador ve además su tutorial de rol', () => {
    const visible = registry.listFor(makeViewer({ roles: ['CONTADOR'], hasPermission: () => false }));
    expect(visible.map((tutorial) => tutorial.id)).toContain('rol-contable');
  });

  it('ofrece el tutorial contextual correcto en las pantallas principales', () => {
    const viewer = makeViewer({ isSuperUser: true });

    expect(registry.findContextual(viewer, { route: '/perfil' })?.id).toBe('perfil-usuario');
    expect(registry.findContextual(viewer, { route: '/tutoriales' })?.id).toBe('centro-de-ayuda');
    expect(registry.findContextual(viewer, { route: '/modulos/inventario' })?.id).toBe('modulo-inventario');
    expect(
      registry.findContextual(viewer, { route: '/modulos/deuda/deuda', moduleKey: 'deuda' })?.id,
    ).toBe('modulo-deuda');
  });

  it('no permite registrar dos veces el mismo catálogo', () => {
    expect(() => registry.registerAll(tutorialCatalog)).toThrow();
  });
});
