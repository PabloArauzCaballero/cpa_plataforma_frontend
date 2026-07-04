import { normalizeListResponse, normalizeListResult, normalizeRecordResponse } from '../../features/resources/services/resourceMapper';

describe('resourceMapper', () => {
  it('normaliza listados con data.rows y pagination', () => {
    const result = normalizeListResult({
      success: true,
      data: {
        rows: [{ id: 1 }, { id: 2 }],
        count: 7,
        limit: 2,
        offset: 4,
      },
      pagination: { count: 7, limit: 2, offset: 4 },
    });

    expect(result.records).toEqual([{ id: 1 }, { id: 2 }]);
    expect(result.count).toBe(7);
    expect(result.page).toBe(3);
  });

  it('normaliza aliases de listados del sistema', () => {
    expect(normalizeListResponse({ data: [{ id: 1 }] })).toEqual([{ id: 1 }]);
    expect(normalizeListResponse({ rows: [{ id: 2 }] })).toEqual([{ id: 2 }]);
    expect(normalizeListResponse({ data: { records: [{ id: 3 }] } })).toEqual([{ id: 3 }]);
  });

  it('normaliza respuesta de detalle', () => {
    expect(normalizeRecordResponse({ data: { id: 10, nombre: 'Demo' } })).toEqual({ id: 10, nombre: 'Demo' });
  });
});
