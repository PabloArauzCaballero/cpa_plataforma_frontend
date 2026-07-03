import {
  cleanPayloadForSelectedTransactionType,
  filterAccountOptions,
  getMovementPayload,
  getMovementTotals,
  getRecordMovements,
  getTransactionVisibleFieldNames,
  humanizeFieldName,
  toMoney,
  validateMovementBusinessRules,
  validateTransactionHeaderBusinessRules,
  type MovementDraft,
} from '../../features/resources/domain/transaction/transactionFormModel';

describe('transactionFormModel', () => {
  it('normaliza movimientos existentes desde distintos aliases del backend', () => {
    const movements = getRecordMovements({
      movimientos: [
        { id_cuenta: 10, debe: 120, haber: 0, descripcion: 'Caja' },
        { idCuenta: 11, debe: 0, haber: 120, observacion: 'Ingreso' },
      ],
    });

    expect(movements).toEqual([
      { cuentaId: '10', tipoMovimiento: 'DEBE', monto: '120', descripcion: 'Caja' },
      { cuentaId: '11', tipoMovimiento: 'HABER', monto: '120', descripcion: 'Ingreso' },
    ]);
  });

  it('calcula Debe, Haber y diferencia con precisión contable', () => {
    const movements: MovementDraft[] = [
      { cuentaId: '1', tipoMovimiento: 'DEBE', monto: '100,50', descripcion: '' },
      { cuentaId: '2', tipoMovimiento: 'HABER', monto: '40.25', descripcion: '' },
      { cuentaId: '3', tipoMovimiento: 'HABER', monto: '60.25', descripcion: '' },
    ];

    expect(getMovementTotals(movements)).toEqual({ debe: 100.5, haber: 100.5, diferencia: 0 });
    expect(toMoney('12,75')).toBe(12.75);
  });

  it('bloquea movimientos duplicados por cuenta y lado del asiento', () => {
    const movements: MovementDraft[] = [
      { cuentaId: '1', tipoMovimiento: 'DEBE', monto: '10', descripcion: '' },
      { cuentaId: '1', tipoMovimiento: 'DEBE', monto: '5', descripcion: '' },
    ];

    expect(validateMovementBusinessRules(movements)).toContain('No repitas');
  });

  it('genera payload Debe/Haber compatible con backend', () => {
    expect(getMovementPayload({ cuentaId: '9', tipoMovimiento: 'HABER', monto: '33.5', descripcion: 'Venta' })).toEqual({
      id_cuenta: 9,
      debe: 0,
      haber: 33.5,
      descripcion: 'Venta',
    });
  });

  it('aplica reglas de negocio del encabezado por tipo de transacción', () => {
    expect(validateTransactionHeaderBusinessRules({ tipo_transaccion: 'VENTA' })).toContain('referencia comercial');
    expect(validateTransactionHeaderBusinessRules({ tipo_transaccion: 'VENTA', id_producto_educativo: 2 })).toBeNull();
    expect(validateTransactionHeaderBusinessRules({ tipo_transaccion: 'DEUDA' })).toContain('deuda');
  });

  it('limpia campos no visibles según tipo de transacción', () => {
    const visible = getTransactionVisibleFieldNames('VENTA');
    const payload = cleanPayloadForSelectedTransactionType({
      tipo_transaccion: 'VENTA',
      id_producto_educativo: 5,
      id_deuda: 3,
      glosa: 'Venta clase',
    }, visible);

    expect(payload).toEqual({ tipo_transaccion: 'VENTA', id_producto_educativo: 5, glosa: 'Venta clase' });
  });

  it('filtra cuentas ignorando acentos y mayúsculas', () => {
    const result = filterAccountOptions([
      { value: 1, label: 'Banco Económico · 1.1.01.003' },
      { value: 2, label: 'Caja General · 1.1.01.001' },
    ], 'economico');

    expect(result).toHaveLength(1);
    expect(result[0].value).toBe(1);
  });

  it('humaniza nombres técnicos para UI profesional', () => {
    expect(humanizeFieldName('id_grupo_cuenta')).toBe('ID Grupo Cuenta');
    expect(humanizeFieldName('kpi_financiero')).toBe('KPI Financiero');
  });
});
