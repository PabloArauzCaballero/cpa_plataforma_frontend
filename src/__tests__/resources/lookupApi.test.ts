import { createLookupOption, listAllLookupOptions } from '@/features/resources/services/lookupApi';
import type { ResourceLookupRelation } from '@/features/resources/domain/CrudResource';

const RELATION: ResourceLookupRelation = {
  endpoint: '/api/personas/unidad-educativa',
  valueField: 'id_unidad_educativa',
  labelFields: ['nombre'],
  resourceKey: 'unidad-educativa',
};

const post = jest.fn();
const get = jest.fn();

jest.mock('@/shared/api/httpClient', () => ({
  httpClient: {
    post: (path: string, body: unknown) => post(path, body),
    get: (path: string) => get(path),
  },
}));

beforeEach(() => {
  post.mockReset();
  get.mockReset();
});

describe('createLookupOption', () => {
  /**
   * El alta rápida de colegio informaba de un error aunque el registro sí se
   * hubiera creado, porque la respuesta se leía como si fuese una lista. Quien
   * lo usaba volvía a intentarlo y acababa con colegios duplicados.
   */
  it('lee el registro creado cuando el POST responde un objeto en data', async () => {
    post.mockResolvedValue({
      success: true,
      data: { id_unidad_educativa: 144, nombre: 'Colegio Alemán Santa Cruz', categoria: 'privada' },
    });

    const option = await createLookupOption(RELATION, { nombre: 'Colegio Alemán Santa Cruz', categoria: 'privada' });

    expect(option).toEqual({ value: 144, label: 'Colegio Alemán Santa Cruz' });
  });

  it('lee el registro creado cuando el POST responde el objeto sin envolver', async () => {
    post.mockResolvedValue({ id_unidad_educativa: 7, nombre: 'Colegio Marista' });

    await expect(createLookupOption(RELATION, { nombre: 'Colegio Marista' })).resolves.toEqual({
      value: 7,
      label: 'Colegio Marista',
    });
  });

  it('sigue aceptando la forma de lista por si el servicio devuelve [creado]', async () => {
    post.mockResolvedValue({ data: [{ id_unidad_educativa: 9, nombre: 'Colegio La Salle' }] });

    await expect(createLookupOption(RELATION, { nombre: 'Colegio La Salle' })).resolves.toEqual({
      value: 9,
      label: 'Colegio La Salle',
    });
  });

  it('avisa cuando la respuesta no trae identificador', async () => {
    post.mockResolvedValue({ success: true, data: { nombre: 'Sin id' } });

    await expect(createLookupOption(RELATION, { nombre: 'Sin id' })).rejects.toThrow(/identificador/i);
  });
});

describe('listAllLookupOptions', () => {
  /**
   * El desplegable del formulario se quedaba en los 100 primeros registros. Con
   * 143 colegios sembrados se perdían más de cuarenta, y el recorte pasaba
   * inadvertido porque el orden alfabético se aplica DESPUÉS de recortar.
   */
  it('recorre todas las páginas hasta completar el total', async () => {
    const page = (from: number, size: number) => ({
      data: {
        rows: Array.from({ length: size }, (_, i) => ({
          id_unidad_educativa: from + i,
          nombre: `Colegio ${String(from + i).padStart(3, '0')}`,
        })),
        count: 143,
      },
    });

    get.mockImplementation((path: string) => {
      const offset = Number(new URL(`http://x${path}`).searchParams.get('offset'));
      const remaining = 143 - offset;
      return Promise.resolve(page(offset, Math.min(100, Math.max(remaining, 0))));
    });

    const options = await listAllLookupOptions(RELATION, 100);

    expect(options).toHaveLength(143);
    expect(get).toHaveBeenCalledTimes(2);
  });
});
