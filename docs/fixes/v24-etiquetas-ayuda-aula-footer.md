# v24 - Etiquetas naturales, ayuda operativa, aula visual y footer

## Cambios visuales

- Las columnas, filtros y campos ya no se muestran en `snake_case`.
- Los nombres técnicos como `id_aula`, `estado_registro` o `hora_llegada` se presentan como `ID Aula`, `Estado Registro` y `Hora Llegada`.
- El footer ahora muestra: `CPA Plataforma · Versión 1.1.23` y `Todos los derechos reservados 2026`.

## Aula y clases por hora

- La vista de `Clase Por Hora`, `Clase Curso` y `Aula` ordena visualmente los registros por hora cuando existe un campo horario disponible.
- Cada bloque horario recibe un color para que la lectura sea más rápida.

## Ayuda interactiva

- Se agregó un botón `Ayuda` en la cabecera de cada tabla.
- El modal explica flujos operativos:
  - Registro básico.
  - Activo / bien.
  - Venta y detalle.
  - Aula por hora.
  - Contabilidad.

## Venta detalle

La ayuda documenta que la venta con muchos productos o servicios debe manejarse con cabecera y detalle separados. En la documentación disponible del backend no aparece un endpoint específico de `venta_detalle`, por lo que no se creó una tabla ficticia ni se inventó payload.
