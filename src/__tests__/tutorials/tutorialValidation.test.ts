import {
  getBlockingIssues,
  validateTutorialCatalog,
  type TutorialIssueCode,
} from '@/features/tutorials/domain/tutorialValidation';
import { validateTutorialRoute } from '@/features/tutorials/domain/tutorialRoutes';
import { makeStep, makeTutorial } from './testFactories';

function codes(issues: ReturnType<typeof validateTutorialCatalog>): TutorialIssueCode[] {
  return issues.map((issue) => issue.code);
}

describe('validateTutorialCatalog', () => {
  it('acepta un catálogo correcto', () => {
    const issues = validateTutorialCatalog([
      makeTutorial({ id: 'uno' }),
      makeTutorial({ id: 'dos', prerequisites: ['uno'], nextTutorialId: 'uno' }),
    ]);
    expect(issues).toEqual([]);
  });

  it('detecta identificadores duplicados', () => {
    const issues = validateTutorialCatalog([makeTutorial({ id: 'uno' }), makeTutorial({ id: 'uno' })]);
    expect(codes(issues)).toContain('duplicate-tutorial-id');
  });

  it('detecta tutoriales vacíos', () => {
    expect(codes(validateTutorialCatalog([makeTutorial({ id: 'vacio', steps: [] })]))).toContain('empty-tutorial');
  });

  it('detecta versiones mal formadas', () => {
    expect(codes(validateTutorialCatalog([makeTutorial({ id: 'v', version: '1.0' })]))).toContain('invalid-version');
  });

  it('detecta pasos duplicados y órdenes repetidos o inválidos', () => {
    const issues = validateTutorialCatalog([
      makeTutorial({
        id: 'pasos',
        steps: [makeStep({ id: 'a', order: 1 }), makeStep({ id: 'a', order: 1 }), makeStep({ id: 'b', order: 0 })],
      }),
    ]);

    expect(codes(issues)).toContain('duplicate-step-id');
    expect(codes(issues)).toContain('invalid-step-order');
  });

  it('detecta rutas inexistentes en el tutorial y en sus pasos', () => {
    const issues = validateTutorialCatalog([
      makeTutorial({
        id: 'rutas',
        route: '/pantalla-que-no-existe',
        steps: [makeStep({ id: 'a', order: 1, route: '/modulos/modulo-inventado' })],
      }),
    ]);

    expect(issues.filter((issue) => issue.code === 'invalid-route')).toHaveLength(2);
  });

  it('detecta un recurso inexistente dentro de una ruta con parámetros', () => {
    const issues = validateTutorialCatalog([
      makeTutorial({ id: 'recurso', route: '/modulos/personas/tabla-inventada' }),
    ]);
    expect(codes(issues)).toContain('invalid-route');
  });

  it('detecta una acción esperada sin elemento objetivo', () => {
    const issues = validateTutorialCatalog([
      makeTutorial({
        id: 'accion',
        steps: [makeStep({ id: 'a', order: 1, expectedAction: { type: 'click' } })],
      }),
    ]);
    expect(codes(issues)).toContain('invalid-action');
  });

  it('detecta prerrequisitos y encadenados inexistentes', () => {
    const issues = validateTutorialCatalog([
      makeTutorial({ id: 'uno', prerequisites: ['fantasma'], nextTutorialId: 'tampoco-existe' }),
    ]);
    expect(codes(issues)).toContain('unknown-prerequisite');
    expect(codes(issues)).toContain('unknown-next-tutorial');
  });

  it('detecta dependencias circulares entre prerrequisitos', () => {
    const issues = validateTutorialCatalog([
      makeTutorial({ id: 'a', prerequisites: ['b'] }),
      makeTutorial({ id: 'b', prerequisites: ['c'] }),
      makeTutorial({ id: 'c', prerequisites: ['a'] }),
    ]);
    expect(codes(issues)).toContain('circular-prerequisite');
  });

  it('detecta configuraciones incompatibles con los roles declarados', () => {
    const issues = validateTutorialCatalog([
      makeTutorial({ id: 'base', access: { roles: ['CONTADOR'] } }),
      makeTutorial({ id: 'derivado', access: { roles: ['TUTOR'] }, prerequisites: ['base'] }),
    ]);
    expect(codes(issues)).toContain('unreachable-for-roles');
  });

  it('avisa (sin bloquear) de una posición declarada sin objetivo', () => {
    const issues = validateTutorialCatalog([
      makeTutorial({ id: 'aviso', steps: [makeStep({ id: 'a', order: 1, placement: 'right' })] }),
    ]);

    expect(issues).toHaveLength(1);
    expect(issues[0].severity).toBe('warning');
    expect(getBlockingIssues(issues)).toHaveLength(0);
  });
});

describe('validateTutorialRoute', () => {
  it.each([
    '/',
    '/perfil',
    '/tutoriales',
    '/modulos/personas',
    '/modulos/personas/estudiante',
    '/batch/personas/estudiante',
    '/contabilidad/archivos',
  ])('acepta la ruta real %s', (route) => {
    expect(validateTutorialRoute(route).valid).toBe(true);
  });

  it.each(['/no-existe', '/modulos/modulo-falso', '/modulos/personas/tabla-falsa'])(
    'rechaza la ruta %s',
    (route) => {
      expect(validateTutorialRoute(route).valid).toBe(false);
    },
  );
});
