import { resourceDefinitions } from '@/features/resources/domain/resourceDefinitions';

function findField(resourceKey: string, fieldName: string) {
  const resource = resourceDefinitions.find((item) => item.key === resourceKey);
  expect(resource).toBeDefined();
  return resource!.fields.find((field) => field.name === fieldName);
}

describe('alta de unidad educativa desde el formulario de estudiante', () => {
  it('el campo llega con quickCreate despues de aplicar el catalogo', () => {
    // El catálogo se aplica al construir CRUD_RESOURCES; si el merge dejara
    // fuera la clave, la opción de crear no aparecería y no habría forma de
    // notarlo salvo probándolo a mano en el navegador.
    const field = findField('estudiante', 'id_unidad_educativa');
    expect(field?.quickCreate).toEqual({
      labelField: 'nombre',
      extraFields: [{ name: 'categoria', label: 'Categoría', options: ['fiscal', 'privada', 'convenio'] }],
    });
  });

  it('conserva la relacion al catalogo, que es de donde sale el id', () => {
    const field = findField('estudiante', 'id_unidad_educativa');
    expect(field?.relation?.endpoint).toBe('/api/personas/unidad-educativa');
    expect(field?.relation?.valueField).toBe('id_unidad_educativa');
  });

  it('las categorias ofrecidas son las que ya usa la base', () => {
    // fiscal / privada / convenio son las tres que existen hoy en produccion.
    // Ofrecer una cuarta metería en el catálogo un valor que nadie más usa.
    const field = findField('estudiante', 'id_unidad_educativa');
    const categorias = field?.quickCreate?.extraFields?.[0]?.options ?? [];
    expect([...categorias].sort()).toEqual(['convenio', 'fiscal', 'privada']);
  });

  it('id_persona ya no se pide en el alta de estudiante, tutor ni usuario', () => {
    for (const key of ['estudiante', 'tutor', 'usuario']) {
      expect(findField(key, 'id_persona')).toBeUndefined();
    }
  });

  it('id_persona sigue donde es una clave foranea de verdad', () => {
    // Aqui no es un "por si acaso": apunta a una persona que ya existe.
    for (const key of ['empleado', 'usuario-rol']) {
      expect(findField(key, 'id_persona')?.required).toBe(true);
    }
  });

  it('el codigo de estudiante no se pide: lo genera la base', () => {
    expect(findField('estudiante', 'codigo_estudiante')).toBeUndefined();
  });
});
