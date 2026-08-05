# Ruta `/modulos/:module`

| | |
|---|---|
| **Patrón** | `/modulos/:module` |
| **Componente** | `ModuleResourcePickerPage` |
| **Archivo** | `src/features/dashboard/pages/ModuleResourcePickerPage.tsx` |
| **Layout** | `AppShell` |
| **Parámetros** | `module` — clave del módulo (`personas`, `contabilidad`, …) |

## Propósito de negocio

Tablero del módulo: lista las tablas (recursos) que contiene y permite buscar entre ellas. Resuelve el problema de que la barra lateral, con 58 enlaces visibles, se vuelve difícil de recorrer.

## Acceso y permisos

- Protegida por `ProtectedRoute`.
- **No filtra por permisos.** Muestra `resourceModule.resources` completo, a diferencia de la barra lateral de `AppShell`, que sí aplica `userHasAnyPermission(resource.permissions)` (`AppShell.tsx:83`).

> **Inconsistencia real documentada:** un recurso oculto en la barra lateral por falta de permiso **sí** aparece en este tablero. No es una brecha de seguridad (el backend decide), pero sí de coherencia de interfaz. Clasificada MEDIUM en [reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md).

## Flujo de usuario

1. Entrada desde `HomePage`, desde el enlace «Tablero del módulo» de la barra lateral, o por URL directa.
2. `findResourceModule(moduleKey)` busca el módulo.
3. Si no existe → `PageState` «Módulo no encontrado».
4. Se muestran las tarjetas de los recursos del módulo.
5. El buscador filtra en cliente sobre `label + key + table + nombres de campo` (`ModuleResourcePickerPage.tsx:36-38`), con normalización de acentos y minúsculas.
6. Al elegir una tarjeta se navega a `/modulos/:module/:resource`.

## Estados de interfaz

| Estado | Representación | Evidencia |
|---|---|---|
| Carga de la ruta | `PageState` «Cargando pantalla» | `router.tsx:19` |
| Módulo inexistente | `PageState` «Módulo no encontrado» | línea 43 |
| Sin coincidencias de búsqueda | `PageState` «Sin coincidencias» | línea 85 |
| Contenido | Rejilla de tarjetas | línea 92 |

**No hay estado de carga de datos ni de error**: todo sale de constantes del bundle.

## Contratos de datos

**Ninguno.** No hace peticiones HTTP. Lee `resourceModules` de `resourceDefinitions.ts`.

## Componentes

| Componente | Origen |
|---|---|
| `PageState` | `shared` |
| `TutorialLauncher` | feature `tutorials` (línea 58) |
| `Link` | react-router-dom |
| `humanizeFieldLabel` | `shared/utils/humanize` |

## Analítica

Ninguna, salvo los eventos internos del motor de tutoriales si se lanza uno desde aquí. Ver [observability/analytics-events.md](../observability/analytics-events.md).

## Accesibilidad

| Aspecto | Estado |
|---|---|
| Búsqueda | ⚠️ El campo de búsqueda no anuncia el número de resultados mediante región activa; el usuario de lector de pantalla no sabe que la lista cambió |
| Enlaces | ✅ Son `<Link>` reales, navegables con teclado |
| Estado vacío | ✅ Texto explicativo |
| Encabezado | ⚠️ Sin `<h1>` propio (ver [home.md](home.md)) |

## Pruebas

Ninguna. Las funciones puras `normalizeText` y el filtro de búsqueda son candidatas directas a prueba unitaria.

## Notas operativas

- Módulos válidos para `:module`: `administracion`, `personas`, `servicios_educativos`, `contabilidad`, `deuda`, `infraestructura`, `inventario`, `societario`, `seguridad`.
- Un módulo mal escrito **no** produce un 404 del router: cae en `PageState` «Módulo no encontrado» dentro del layout, con la navegación intacta.
- Anclas de tutorial: se lanzan tutoriales por módulo desde aquí (`TutorialLauncher moduleKey=…`).
