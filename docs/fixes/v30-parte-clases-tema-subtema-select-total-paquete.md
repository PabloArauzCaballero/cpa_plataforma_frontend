# v30 - Parte de clases pasadas: Tema/Subtema como select y total paquete

## Cambio aplicado

Se ajustó la pantalla especial **Parte de Clases Pasadas** para que el formulario respete mejor el parte físico y la carga relacionada desde backend.

## Reglas implementadas

- `Estudiante` se mantiene como select cargado desde `/api/personas/estudiante`.
- `Tutor` se mantiene como select cargado desde `/api/personas/tutor`.
- `Materia / Producto` se mantiene como select cargado desde:
  - `/api/servicios_educativos/materia-tree`
  - `/api/servicios_educativos/producto-educativo`
- `Tema` ahora es select, no input libre.
- `Subtema` ahora es select, no input libre.
- Al seleccionar una materia del árbol, se autocompletan `tema` y `subtema` si el backend los devuelve.
- Si el usuario cambia `tema`, se limpia `subtema` para evitar combinaciones inconsistentes.
- El select de `subtema` se filtra según el `tema` elegido cuando hay relación disponible.
- `Paq.` se mantiene como textfield porque el usuario indicó que no debe ser select ni monto numérico.
- Las tarjetas resumen ahora incluyen `Total paquete`, contando las filas activas con valor en `Paq.`.

## Importante

No se modificó el endpoint de envío. La pantalla sigue usando:

```http
POST /api/contabilidad/venta-clase/registrar-batch
```
