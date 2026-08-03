import { DuplicateTutorialError, TutorialRegistry, searchTutorials } from '@/features/tutorials/registry/TutorialRegistry';
import { makeStep, makeTutorial, makeViewer } from './testFactories';

describe('TutorialRegistry · registro', () => {
  it('registra y recupera tutoriales por identificador', () => {
    const registry = new TutorialRegistry([makeTutorial({ id: 'uno' }), makeTutorial({ id: 'dos' })]);

    expect(registry.size()).toBe(2);
    expect(registry.get('uno')?.title).toBe('Tutorial uno');
    expect(registry.has('tres')).toBe(false);
  });

  it('impide registrar dos veces el mismo identificador', () => {
    const registry = new TutorialRegistry([makeTutorial({ id: 'uno' })]);

    expect(() => registry.register(makeTutorial({ id: 'uno' }))).toThrow(DuplicateTutorialError);
    expect(registry.size()).toBe(1);
  });

  it('normaliza el orden de los pasos al registrar', () => {
    const registry = new TutorialRegistry([
      makeTutorial({
        id: 'desordenado',
        steps: [
          makeStep({ id: 'c', order: 3 }),
          makeStep({ id: 'a', order: 1 }),
          makeStep({ id: 'b', order: 2 }),
        ],
      }),
    ]);

    expect(registry.get('desordenado')?.steps.map((step) => step.id)).toEqual(['a', 'b', 'c']);
  });
});

describe('TutorialRegistry · filtrado por rol y permiso', () => {
  const registry = new TutorialRegistry([
    makeTutorial({ id: 'publico' }),
    makeTutorial({ id: 'solo-contador', access: { roles: ['CONTADOR'] } }),
    makeTutorial({ id: 'solo-super', access: { superUserOnly: true } }),
    makeTutorial({ id: 'con-permiso', access: { permissions: ['CONTABILIDAD.CUENTA.CREATE'] } }),
  ]);

  it('oculta los tutoriales cuyo rol no tiene el usuario', () => {
    const ids = registry.listFor(makeViewer({ hasPermission: () => false })).map((tutorial) => tutorial.id);
    expect(ids).toEqual(['publico']);
  });

  it('muestra el tutorial cuando el rol coincide, normalizando el token', () => {
    const ids = registry.listFor(makeViewer({ roles: ['CONTADOR'], hasPermission: () => false })).map((t) => t.id);
    expect(ids).toContain('solo-contador');
  });

  it('muestra el tutorial cuando el permiso está concedido', () => {
    const ids = registry
      .listFor(makeViewer({ hasPermission: (required) => required === 'CONTABILIDAD.CUENTA.CREATE' }))
      .map((tutorial) => tutorial.id);
    expect(ids).toContain('con-permiso');
    expect(ids).not.toContain('solo-contador');
  });

  it('el super usuario ve todo', () => {
    const ids = registry.listFor(makeViewer({ isSuperUser: true })).map((tutorial) => tutorial.id);
    expect(ids).toHaveLength(4);
  });

  it('filtra los pasos restringidos y renumera el progreso visible', () => {
    const scoped = new TutorialRegistry([
      makeTutorial({
        id: 'mixto',
        steps: [
          makeStep({ id: 'general', order: 1 }),
          makeStep({ id: 'solo-admin', order: 2, access: { roles: ['ADMIN'] } }),
          makeStep({ id: 'final', order: 3 }),
        ],
      }),
    ]);

    const resolved = scoped.resolve('mixto', makeViewer({ hasPermission: () => false }));
    expect(resolved?.steps.map((step) => step.id)).toEqual(['general', 'final']);
    expect(resolved?.steps.map((step) => step.order)).toEqual([1, 2]);

    const forAdmin = scoped.resolve('mixto', makeViewer({ roles: ['ADMIN'] }));
    expect(forAdmin?.steps).toHaveLength(3);
  });

  it('`resolve` devuelve undefined para un tutorial que el usuario no puede ver', () => {
    expect(registry.resolve('solo-super', makeViewer())).toBeUndefined();
  });

  it('oculta un tutorial cuyos pasos quedan todos filtrados', () => {
    const scoped = new TutorialRegistry([
      makeTutorial({
        id: 'inaccesible',
        steps: [makeStep({ id: 'unico', order: 1, access: { roles: ['ADMIN'] } })],
      }),
    ]);

    expect(scoped.listFor(makeViewer({ hasPermission: () => false }))).toHaveLength(0);
  });
});

describe('TutorialRegistry · tutorial contextual', () => {
  const registry = new TutorialRegistry([
    makeTutorial({ id: 'ruta-perfil', route: '/perfil' }),
    makeTutorial({ id: 'modulo-personas', category: 'modulo', moduleKey: 'personas', route: '/modulos/personas' }),
    makeTutorial({ id: 'operacion-personas', category: 'operacion', moduleKey: 'personas' }),
  ]);

  it('prioriza la coincidencia exacta de ruta', () => {
    expect(registry.findContextual(makeViewer(), { route: '/perfil' })?.id).toBe('ruta-perfil');
  });

  it('cae al tutorial del módulo cuando la ruta no tiene uno propio', () => {
    const found = registry.findContextual(makeViewer(), { route: '/modulos/personas/estudiante', moduleKey: 'personas' });
    expect(found?.id).toBe('modulo-personas');
  });

  it('devuelve undefined cuando no hay nada pertinente', () => {
    expect(registry.findContextual(makeViewer(), { route: '/ruta/desconocida' })).toBeUndefined();
  });
});

describe('searchTutorials', () => {
  const tutorials = [
    makeTutorial({ id: 'a', title: 'Importar registros desde Excel', tags: ['batch'] }),
    makeTutorial({ id: 'b', title: 'Configuración de catálogos', moduleKey: 'contabilidad' }),
  ];

  it('devuelve todo cuando el término está vacío', () => {
    expect(searchTutorials(tutorials, '   ')).toHaveLength(2);
  });

  it('busca sin distinguir acentos ni mayúsculas', () => {
    expect(searchTutorials(tutorials, 'CONFIGURACION').map((t) => t.id)).toEqual(['b']);
  });

  it('busca por módulo y por etiqueta', () => {
    expect(searchTutorials(tutorials, 'contabilidad').map((t) => t.id)).toEqual(['b']);
    expect(searchTutorials(tutorials, 'batch').map((t) => t.id)).toEqual(['a']);
  });
});
