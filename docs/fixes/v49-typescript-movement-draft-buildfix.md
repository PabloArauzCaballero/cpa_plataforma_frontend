# v49 - Corrección TypeScript en edición de movimientos contables

## Problema

El build de Cloudflare fallaba con:

```txt
Type '{ cuentaId: string; tipoMovimiento: string; monto: string; descripcion: string; }[]' is not assignable to type 'MovementDraft[]'.
Type 'string' is not assignable to type '"DEBE" | "HABER"'.
```

## Causa

TypeScript infería `tipoMovimiento` como `string` al normalizar movimientos recuperados del sistema para edición de transacción.

## Corrección

Se tipó explícitamente:

```ts
const movementType: MovementDraft['tipoMovimiento'] = condition ? 'HABER' : 'DEBE';
```

Esto mantiene el contrato estricto del ViewModel y permite compilar en CI/CD.

## Resultado

- El build ya no falla por TS2322.
- Se conserva la edición de movimientos en transacciones.
- Se conserva la compatibilidad con aliases del sistema para movimientos embebidos o recuperados por endpoint separado.
