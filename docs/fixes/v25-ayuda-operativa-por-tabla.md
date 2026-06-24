# v25 - Corrección de ayuda operativa por tabla

## Problema

El modal de ayuda era demasiado genérico y no explicaba claramente cómo registrar la tabla actual ni cómo usar ese registro en transacciones. Además, visualmente el modal podía verse apretado y con problemas de scroll.

## Solución aplicada

Se reemplazó la ayuda genérica por una ayuda contextual por tabla.

Ahora el modal muestra:

- resumen de la tabla actual,
- módulo al que pertenece,
- uso esperado en transacciones,
- pasos para registrar esa tabla,
- orden recomendado antes/después,
- relación con transacciones,
- campos clave que se deben revisar.

## Casos contemplados

- `transaccion`: cabecera y movimientos contables.
- `archivos-transaccion`: comprobante posterior con Cloudinary.
- `bien`: venta, costo o activo según tipo de bien.
- `bien-lote`, `bien-instancia`, `movimiento-detalle`: trazabilidad física del bien.
- `deuda`, `pago-deuda`: transacción tipo DEUDA.
- `pago-tutor`, `pago-tutor-detalle`: transacción tipo COSTO.
- `producto-educativo`: transacción tipo VENTA.
- `clase`, `clase-por-hora`, `clase-curso`, `aula`: soporte operativo para venta/costo.
- `cuenta`, `grupo-cuenta`, `cuenta-asignacion`, `centro-costo`, `centro-costo-mapa`, `concepto-costo`: estructura contable previa.
- módulo `personas`: base para estudiantes, tutores, clientes, proveedores y operaciones.

## Corrección visual

El modal ahora tiene:

- padding interno,
- scroll interno controlado,
- pestañas estables,
- tarjetas de campos clave,
- cortes de texto seguros,
- diseño responsive.

## Validación

Se validó con:

```bash
npm run build
```
