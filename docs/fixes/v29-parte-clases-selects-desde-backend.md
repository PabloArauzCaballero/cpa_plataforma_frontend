# v29 - Parte de clases pasadas con selects desde backend

## Problema corregido

La pantalla `Parte de Clases Pasadas` todavía permitía escribir manualmente estudiante, tutor, materia/producto y tema. Eso podía generar nombres duplicados o distintos a los registros reales del sistema.

Además, se mostraba una tarjeta visual con el endpoint. La llamada al endpoint debe mantenerse en código, pero no debe mostrarse como tarjeta operativa en la interfaz.

## Cambios aplicados

- Se quitó la tarjeta visual del endpoint en el hero.
- Se mantiene la llamada real a:

```http
POST /api/contabilidad/venta-clase/registrar-batch
```

- Se agregó carga real de catálogos desde backend:
  - Estudiantes: `GET /api/personas/estudiante`
  - Tutores: `GET /api/personas/tutor`
  - Materias: `GET /api/servicios_educativos/materia-tree`
  - Productos educativos: `GET /api/servicios_educativos/producto-educativo`

## Comportamiento del formulario

- `Nombre completo estudiante` ahora se selecciona desde estudiantes.
- `Tutor` ahora se selecciona desde tutores.
- `Materia / Producto` ahora se selecciona desde materias o productos educativos.
- Cuando se selecciona una materia del árbol, el formulario autocompleta `tema` y `subtema` cuando el backend los devuelve.
- `Tema` y `Subtema` conservan edición manual porque el parte físico puede requerir detalle operativo más específico.
- El payload sigue enviando los campos esperados por el contrato del backend, sin inventar campos adicionales.

## Validación

Validado con:

```bash
npm run build
```
