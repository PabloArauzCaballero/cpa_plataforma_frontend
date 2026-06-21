# V12 - Validaciones pequeñas de contabilidad

Se agregaron validaciones de consistencia para el recurso `contabilidad.grupo_cuenta` y se ajustó `DataTable.tsx` con botones seguros `type="button"`.

## Grupo Cuenta

Reglas implementadas en frontend:

- Si `tipo = BALANCE`, entonces `sub_tipo` solo puede ser:
  - `ACTIVO`
  - `PASIVO`
  - `PATRIMONIO`
- Si `tipo = RESULTADOS`, usado para Estado de Resultado, entonces `sub_tipo` solo puede ser:
  - `INGRESO`
  - `GASTO`
- Si `sub_tipo = ACTIVO` o `PASIVO`, entonces `sub_grupo` solo puede ser:
  - `CORRIENTE`
  - `NO_CORRIENTE`
- Si `sub_tipo = PATRIMONIO`, entonces `sub_grupo` solo puede ser:
  - `CAPITAL`
  - `RESERVAS`
  - `RESULTADOS_ACUMULADOS`
- Si `sub_tipo = INGRESO`, entonces `sub_grupo` solo puede ser:
  - `OPERATIVO`
  - `NO_OPERATIVO`
- Si `sub_tipo = GASTO`, entonces `sub_grupo` solo puede ser:
  - `ADMINISTRATIVO`
  - `VENTAS`
  - `FINANCIERO`
  - `OPERATIVO`
  - `NO_OPERATIVO`
- `id_parent` no puede ser igual al `id_grupo_cuenta` del mismo registro.
- `orden_reporte`, si se informa, debe ser entero mayor a cero.

## Archivos modificados

- `src/shared/validation/formValidation.ts`
- `src/shared/components/DataTable/DataTable.tsx`
- `docs/validation/frontend-checks-catalog.json`
- `prompt/programacionFrontend.md`
