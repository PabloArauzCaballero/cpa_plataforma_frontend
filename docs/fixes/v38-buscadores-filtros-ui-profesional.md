# v38 - Buscadores, filtros y limpieza visual profesional

## Objetivo
Corregir problemas de uso real en listados, buscadores y selectores contables, eliminando elementos de control interno que no deben mostrarse al cliente.

## Cambios aplicados

- Se eliminó la opción visible **Calidad 10/10** del menú y de las rutas.
- Se retiró el bloque visual **Contrato de datos** de los formularios.
- Se mantuvo una UI más limpia y orientada al cliente final.
- La búsqueda global ahora usa un debounce más pausado para permitir escribir sin interrupciones.
- Los filtros por campo también usan debounce antes de consultar al sistema.
- Se eliminaron filtros locales que podían esconder registros devueltos correctamente por el sistema.
- El frontend envía aliases de búsqueda compatibles (`q`, `search`, `term`) para mejorar compatibilidad con endpoints.
- Si se usa un único filtro textual, también se envía como búsqueda global de respaldo.
- Los filtros de tabla ahora se enriquecen con campos reales devueltos por el sistema, además de los campos declarados del recurso.
- Los selectores de cuentas de transacciones ahora cargan todas las páginas disponibles y no se quedan solo con los primeros 100 registros.
- El buscador de cuentas dentro de transacciones aplica debounce local para que la escritura sea estable.
- Se actualizó la versión visible a `1.1.25`.

## Validación

Ejecutado correctamente:

```bash
npm run build
```
