# v43 - Segunda revisión MVVM, separación de responsabilidades y Jest

## Objetivo

Reducir componentes con demasiada responsabilidad, acercar el frontend al patrón MVVM y añadir pruebas unitarias automatizadas.

## Cambios aplicados

### Transacción

`TransactionForm.tsx` dejó de concentrar toda la lógica de presentación, movimientos y borradores.

Se separó en:

- `domain/transaction/transactionFormModel.ts`
  - reglas de negocio puras,
  - cálculo Debe/Haber,
  - normalización de movimientos,
  - limpieza del payload por tipo de transacción,
  - validación de movimientos y encabezado.
- `hooks/transaction/useTransactionMovementsViewModel.ts`
  - estado de movimientos,
  - edición de movimiento,
  - búsqueda/carga de cuentas,
  - totales contables.
- `hooks/transaction/useTransactionDraftViewModel.ts`
  - guardado/carga/descarte de borradores backend,
  - respaldo local cuando el backend no responde.
- `components/transaction/TransactionHeaderFields.tsx`
  - renderizado de encabezado de transacción.
- `components/transaction/TransactionMovementEditor.tsx`
  - editor de movimiento.
- `components/transaction/TransactionMovementsTable.tsx`
  - tabla de movimientos agregados.
- `components/transaction/TransactionDraftActions.tsx`
  - barra de acciones de borrador.

### Pruebas Jest

Se agregó Jest con `ts-jest` y scripts:

```bash
npm run test
npm run quality
npm run ci:frontend
```

Pruebas incluidas:

- `transactionFormModel.test.ts`
  - normalización de movimientos,
  - cálculo Debe/Haber,
  - validación de duplicados,
  - payload Debe/Haber,
  - reglas por tipo de transacción,
  - limpieza de campos no visibles,
  - búsqueda de cuentas sin acentos,
  - etiquetas humanas para campos técnicos.
- `resourceMapper.test.ts`
  - normalización de listados con `data.rows`, `rows`, `records`, etc.
  - cálculo de paginación.
  - normalización de respuesta de detalle.

## Validación ejecutada

```bash
npm run quality
```

Resultado:

- TypeScript OK.
- Jest OK: 2 suites, 11 tests.
- Build de producción OK.

## Criterio de calidad

La versión reduce acoplamiento y deja reglas críticas como funciones puras testeables. La UI queda como capa de vista, los hooks como ViewModels y las reglas de negocio como modelo reutilizable.
