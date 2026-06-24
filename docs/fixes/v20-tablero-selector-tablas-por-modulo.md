# v20 - Tablero selector de tablas por módulo

## Problema corregido

Al abrir un módulo desde el inicio, el frontend mandaba directamente a la primera tabla disponible del módulo. Esto generaba una navegación confusa porque el usuario no podía elegir primero qué tabla quería consultar.

## Solución aplicada

Se agregó una pantalla intermedia por módulo:

```txt
/modulos/:module
```

Esta pantalla funciona como tablero del módulo y permite seleccionar la tabla correspondiente antes de cargar registros.

## Cambios principales

- `ModuleSummary` ya no enlaza al primer recurso del módulo.
- Cada tarjeta de módulo apunta a `/modulos/:module`.
- Se creó `ModuleResourcePickerPage`.
- El nuevo tablero muestra todas las tablas del módulo.
- Se agregó búsqueda local para encontrar tablas por:
  - nombre de tabla,
  - nombre visible,
  - nombre técnico,
  - campos del recurso.
- Cada tarjeta permite:
  - abrir la tabla,
  - ir a importación masiva de esa tabla.
- En el sidebar se agregó acceso explícito a `Tablero del módulo` antes de los enlaces de tablas.

## Flujo nuevo

```txt
Inicio
  → elegir módulo
  → tablero del módulo
  → elegir tabla
  → listado CRUD con paginación, búsqueda, filtros y exportación
```

## Archivos modificados

- `src/app/router.tsx`
- `src/features/dashboard/components/ModuleSummary.tsx`
- `src/features/dashboard/pages/ModuleResourcePickerPage.tsx`
- `src/features/dashboard/pages/ModuleResourcePickerPage.module.css`
- `src/features/resources/domain/resourceDefinitions.ts`
- `src/shared/layouts/AppShell/AppShell.tsx`
- `src/shared/layouts/AppShell/AppShell.module.css`
