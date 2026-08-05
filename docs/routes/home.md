# Ruta `/` (inicio)

| | |
|---|---|
| **Patrón** | `/` con `index: true` |
| **Componente** | `HomePage` → `ModuleSummary` |
| **Archivos** | `src/features/dashboard/pages/HomePage.tsx`, `src/features/dashboard/components/ModuleSummary.tsx`, `src/features/dashboard/moduleMeta.ts` |
| **Layout** | `AppShell` |
| **Carga** | `lazy()` + `Suspense` |

## Propósito de negocio

Página de aterrizaje tras iniciar sesión. Presenta los módulos disponibles como puerta de entrada al trabajo diario. Es **puramente presentacional**: no consulta datos.

## Acceso y permisos

- Protegida por `ProtectedRoute`: requiere token en `localStorage`.
- No exige ningún permiso concreto.
- El listado de módulos que muestra `ModuleSummary` procede de `resourceModules` (derivado de `resourceDefinitions`), la misma fuente que alimenta la barra lateral.

## Flujo de usuario

1. Tras el login se llega aquí por `navigate('/', { replace: true })`.
2. Se lee la cabecera («Centro de clases personalizadas CPA») y el resumen de módulos.
3. Se elige un módulo → navega a `/modulos/:module`.
4. Alternativamente, se usa la barra lateral de `AppShell`, que permite saltar directamente a un recurso.

## Estados de interfaz

| Estado | Representación |
|---|---|
| Carga de la ruta | `PageState` «Cargando pantalla» (`Suspense`) |
| Contenido | Siempre. No hay estado vacío, de error ni de carga de datos |

**No existe estado de error en esta pantalla** porque no hace ninguna petición. Si la sesión es inválida, el error aparecerá en la primera pantalla que sí consulte datos.

## Contratos de datos

**Ninguno.** `HomePage` no importa ningún servicio. `ModuleSummary` lee la constante `resourceModules` del bundle.

Implicación: el inicio carga instantáneamente incluso con el backend caído. Es un comportamiento deseable que conviene preservar.

## Componentes

| Componente | Origen | Función |
|---|---|---|
| `ModuleSummary` | feature `dashboard` | Rejilla de tarjetas, una por módulo |
| `getModuleVisualMeta` | `dashboard/moduleMeta.ts` | Icono y descripción corta de cada módulo |

Iconos: clases FontAwesome (`fa-solid fa-compass-drafting`) servidas por el CDN de `index.html`, no por los paquetes npm.

## Analítica

Ninguna.

## Accesibilidad

| Aspecto | Estado |
|---|---|
| Jerarquía de encabezados | ⚠️ `HomePage` empieza en `<h2>` (`HomePage.tsx:11`). El `<h1>` de la página lo aporta `AppShell` («Gestión CPA», `AppShell.tsx:151`), que es el mismo en todas las rutas. **Ninguna pantalla tiene un `<h1>` propio que la identifique** |
| Iconos decorativos | ✅ `aria-hidden="true"` |
| Insignia del héroe | ✅ `aria-label="Plataforma operativa CPA"` |
| Landmark principal | ✅ `<main>` en `AppShell.tsx:166`; `HomePage` usa `<section>` |

Ver [accessibility/audit-report.md](../accessibility/audit-report.md#a11y-03).

## Pruebas

Ninguna.

## Notas operativas

- Al ser estática, es la pantalla de referencia para comprobar que la aplicación **carga** cuando se sospecha de un fallo del backend: si `/` se ve pero `/modulos/...` no, el problema está en la API, no en el frontend. Ver [operations/runbooks/backend-caido.md](../operations/runbooks/backend-caido.md).
- Ancla de tutorial: `TUTORIAL_ANCHORS.homeHero`.
- El pie de `AppShell` muestra «Versión 1.1.37» **codificada literalmente** en `AppShell.tsx:172`, no leída de `package.json`. Al subir de versión hay que actualizar ambos sitios. Registrado en [reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md).
