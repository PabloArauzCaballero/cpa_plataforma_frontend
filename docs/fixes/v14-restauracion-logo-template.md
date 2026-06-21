# v14 - Restauración de logo CPA y referencia visual del HTML

## Problema
En la evolución del frontend, el archivo `public/logo.png` seguía existiendo, pero la UI principal dejó de renderizarlo en el sidebar, header y login.

## Corrección
- Se restauró el uso de `/logo.png` en `AppShell`.
- Se añadió logo en el header superior.
- Se añadió logo en la pantalla de login.
- Se mantuvieron los templates HTML originales en `docs/template`.
- No se removieron los cambios anteriores de Cloudinary ni validaciones contables.

## Archivos afectados
- `src/shared/layouts/AppShell/AppShell.tsx`
- `src/shared/layouts/AppShell/AppShell.module.css`
- `src/features/auth/pages/LoginPage.tsx`
- `src/features/auth/pages/LoginPage.module.css`
