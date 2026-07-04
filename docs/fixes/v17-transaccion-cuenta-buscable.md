# v17 - Selector buscable de cuentas en transacción

## Problema
El formulario de transacción cargaba las cuentas en un `<select>` simple con paginación limitada. Cuando existían más cuentas en el sistema, el usuario no podía encontrarlas fácilmente.

## Corrección
- Se agregó carga paginada completa para catálogos de lookup mediante `listAllLookupOptions`.
- El campo `Cuenta` en movimientos contables ahora tiene un cuadro de búsqueda por código/nombre.
- El usuario escribe para filtrar y luego selecciona la cuenta exacta.
- El payload sigue enviando únicamente `id_cuenta` numérico junto a `debe` y `haber`.
- La tabla de movimientos mantiene el label visible de la cuenta seleccionada.

## Archivos modificados
- `src/features/resources/services/lookupApi.ts`
- `src/features/resources/components/TransactionForm.tsx`
- `src/features/resources/components/TransactionForm.module.css`
