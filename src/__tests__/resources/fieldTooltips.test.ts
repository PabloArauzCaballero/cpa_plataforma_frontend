import { getFieldTooltip } from '../../features/resources/domain/fieldTooltips';

describe('getFieldTooltip', () => {
  it('prioriza el tooltip específico del recurso sobre el genérico', () => {
    const specific = getFieldTooltip('estudiante', 'tipo');
    expect(specific).toContain('COLEGIAL');
  });

  it('usa el tooltip genérico por nombre de campo cuando no hay específico', () => {
    expect(getFieldTooltip('cualquier_recurso', 'estado_registro')).toContain('Activo');
    expect(getFieldTooltip('cualquier_recurso', 'fecha_registro')).toContain('sistema');
  });

  it('genera un tooltip para claves foráneas no mapeadas', () => {
    const fk = getFieldTooltip('recurso_x', 'id_sucursal');
    expect(fk).toBeDefined();
    expect(fk).toContain('sucursal');
    expect(fk).toContain('previamente');
  });

  it('devuelve undefined para campos sin cobertura', () => {
    expect(getFieldTooltip('recurso_x', 'campo_inexistente_zzz')).toBeUndefined();
  });

  it('cubre campos de dominio de módulos no-persona', () => {
    expect(getFieldTooltip('transaccion-movimiento-cuenta', 'debe')).toContain('Debe');
    expect(getFieldTooltip('deuda', 'tasa_anual')).toContain('interés');
    expect(getFieldTooltip('bien', 'sku')).toContain('SKU');
    expect(getFieldTooltip('emision-titulo', 'cantidad_autorizada')).toContain('autorizada');
    expect(getFieldTooltip('usuario-permiso', 'permitido')).toContain('permitido');
  });
});
