# v33 - Parte de clases: catálogos materia/tema/subtema y producto por defecto

## Problema corregido

En la pantalla de Parte de Clases Pasadas los selects de materia, tema y subtema podían quedar vacíos aunque el backend tuviera registros. La causa era que el frontend asumía pocos nombres de campos para `materia-tree` y descartaba registros cuando el backend usaba aliases o estructuras anidadas.

## Cambios

- El lector de `materia-tree` ahora reconoce más aliases de campos:
  - materia: `nombre`, `materia`, `nombre_materia`, `materia_nombre`, `asignatura`, entre otros.
  - tema: `tema`, `nombre_tema`, `tema_nombre`, `unidad`, entre otros.
  - subtema: `subtema`, `nombre_subtema`, `subtema_nombre`, `contenido`, entre otros.
- Soporta estructuras planas y anidadas con `children`, `hijos`, `items`, `temas`, `subtemas` y `materias`.
- El estado de carga ahora muestra cuántos estudiantes, tutores, aulas, materia/tema/subtema y productos educativos fueron cargados.
- Los selects muestran mensajes claros si no hay materias, temas o subtemas disponibles.

## Producto educativo por defecto

Se agregó una sección superior en Parte de Clases Pasadas para seleccionar un producto educativo por defecto.

Comportamiento:

- Al elegir un producto por defecto, se aplica automáticamente a todas las filas.
- Cada fila puede cambiar manualmente su producto educativo después.
- Las nuevas filas heredan el producto por defecto.
- Al limpiar la tabla, las filas nuevas conservan el producto por defecto seleccionado.

## Regla mantenida

El endpoint de guardado no cambió. La pantalla sigue enviando el batch a:

```txt
POST /api/contabilidad/venta-clase/registrar-batch
```

El frontend no arma contabilidad manualmente.
