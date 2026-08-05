import { summarizeCreate, summarizeUpdate } from '@/features/resources/domain/changeSummary';
import type { CrudResourceDefinition } from '@/features/resources/domain/CrudResource';

const RESOURCE = {
  key: 'estudiante',
  label: 'Estudiante',
  fields: [
    { name: 'nombres', label: 'Nombres', type: 'text' },
    { name: 'apellidos', label: 'Apellidos', type: 'text' },
    { name: 'es_activo', label: 'Es Activo', type: 'checkbox' },
    {
      name: 'id_unidad_educativa',
      label: 'Unidad Educativa',
      type: 'select',
      options: [
        { value: 48, label: 'Colegio Alemán Santa Cruz' },
        { value: 49, label: 'Colegio La Salle Santa Cruz' },
      ],
    },
    // Lo calcula el sistema: nunca debe aparecer como algo que se guarda.
    { name: 'codigo_estudiante', label: 'Codigo Estudiante', type: 'text', readOnly: true },
  ],
} as unknown as CrudResourceDefinition;

describe('summarizeCreate', () => {
  it('lista solo los campos con valor', () => {
    const detalles = summarizeCreate(RESOURCE, { nombres: 'Ana', apellidos: '', es_activo: true });
    expect(detalles).toEqual([
      { label: 'Nombres', value: 'Ana' },
      { label: 'Es Activo', value: 'Sí' },
    ]);
  });

  it('omite los campos de solo lectura, que el usuario no captura', () => {
    const detalles = summarizeCreate(RESOURCE, { nombres: 'Ana', codigo_estudiante: 'EST-0001' });
    expect(detalles.map((d) => d.label)).not.toContain('Codigo Estudiante');
  });

  /**
   * El payload guarda el id de la unidad educativa. Confirmar "48" no le dice
   * nada a nadie: hay que enseñar el nombre del colegio.
   */
  it('traduce el id de una lista a su etiqueta', () => {
    const detalles = summarizeCreate(RESOURCE, { id_unidad_educativa: 48 });
    expect(detalles).toEqual([{ label: 'Unidad Educativa', value: 'Colegio Alemán Santa Cruz' }]);
  });
});

describe('summarizeUpdate', () => {
  it('lista solo lo que cambia, con el valor anterior', () => {
    const detalles = summarizeUpdate(
      RESOURCE,
      { nombres: 'Ana', apellidos: 'Rojas', id_unidad_educativa: 48 },
      { nombres: 'Ana', apellidos: 'Rojas Vargas', id_unidad_educativa: 49 },
    );
    expect(detalles).toEqual([
      { label: 'Apellidos', value: 'Rojas Vargas', previous: 'Rojas' },
      { label: 'Unidad Educativa', value: 'Colegio La Salle Santa Cruz', previous: 'Colegio Alemán Santa Cruz' },
    ]);
  });

  /** El formulario devuelve cadenas donde el registro traía números. */
  it('no marca cambio cuando solo difiere el tipo', () => {
    const detalles = summarizeUpdate(RESOURCE, { id_unidad_educativa: 48 }, { id_unidad_educativa: '48' });
    expect(detalles).toEqual([]);
  });

  it('devuelve vacio si no se toco nada', () => {
    expect(summarizeUpdate(RESOURCE, { nombres: 'Ana' }, { nombres: 'Ana' })).toEqual([]);
  });

  it('muestra un guion cuando se vacia un campo que tenia valor', () => {
    const detalles = summarizeUpdate(RESOURCE, { apellidos: 'Rojas' }, { apellidos: '' });
    expect(detalles).toEqual([{ label: 'Apellidos', value: '—', previous: 'Rojas' }]);
  });
});
