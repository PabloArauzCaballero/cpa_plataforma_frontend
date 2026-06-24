# v26 - Corrección visual de ayuda y título textual

## Problema corregido

En el modal de ayuda operativa, los textos de los pasos podían quebrarse de forma vertical porque el contenido del paso se estaba ubicando en la primera columna del grid, junto al número circular.

Además, en la parte superior izquierda de la aplicación se estaba mostrando nuevamente la imagen del logo CPA dentro del título del shell, cuando se pidió volver al título textual.

## Cambios aplicados

- Se corrigió el layout de los pasos del modal de ayuda.
- El número del paso queda fijo en la primera columna.
- El título y la explicación del paso quedan en la segunda columna.
- Se evitó el quiebre vertical de palabras largas.
- En pantallas pequeñas, los pasos se apilan correctamente.
- Se reemplazó la imagen del logo en el sidebar por un título textual: `CPA Plataforma`.
- Se reemplazó la imagen del logo en el header por un distintivo textual `CPA`.
- El archivo `public/logo.png` se conserva para pantallas donde sí corresponda usarlo, como login u otros recursos visuales.

## Archivos modificados

- `src/features/resources/components/HelpGuideModal.module.css`
- `src/shared/layouts/AppShell/AppShell.tsx`
- `src/shared/layouts/AppShell/AppShell.module.css`
