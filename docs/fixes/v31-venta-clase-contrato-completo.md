# v31 - Venta Clase contrato completo

Se ajustó la pantalla especial **Parte de clases pasadas** según el contrato `FRONTEND_CONTRATO_CPA_VENTA_CLASE_CATALOGOS_CUENTAS.md`.

## Cambios

- El payload ahora se envía como `{ fecha, items }` hacia `POST /api/contabilidad/venta-clase/registrar-batch`.
- El frontend no arma transacciones ni movimientos contables manuales para este flujo.
- Se agregaron selects reales para estudiante, tutor, aula, materia, tema, subtema y producto educativo.
- La materia, tema y subtema salen desde `/api/servicios_educativos/materia-tree`.
- El producto educativo sale desde `/api/servicios_educativos/producto-educativo`.
- Aula sale desde `/api/infraestructura/aula`.
- Paquete se maneja como monto numérico y se envía como `paquete`.
- Se validan montos, CxC/paquete con estudiante, fechas y horas.
- No se envían cuentas para efectivo, QR, CxC ni paquete. Eso lo resuelve sistema desde configuración y cuentas asociadas.

## Endpoints usados

- `POST /api/contabilidad/venta-clase/registrar-batch`
- `GET /api/personas/estudiante`
- `GET /api/personas/tutor`
- `GET /api/infraestructura/aula`
- `GET /api/servicios_educativos/materia-tree`
- `GET /api/servicios_educativos/producto-educativo`
