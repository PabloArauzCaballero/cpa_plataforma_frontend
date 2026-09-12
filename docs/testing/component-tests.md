# Pruebas de componente

## Estado: no existen, y hoy no pueden escribirse

```js
// jest.config.cjs
testMatch: ['**/__tests__/**/*.test.ts'],   // ← sin la "x"
```

El patrón **excluye `.test.tsx`**. Como todo componente React necesita JSX, no se puede escribir una prueba de componente sin cambiar la configuración.

Además, **no hay librería de renderizado instalada**: `@testing-library/react`, `@testing-library/jest-dom` y `@testing-library/user-event` están ausentes de `package.json`.

> **Un archivo `.test.tsx` se ignora en silencio.** Quien lo escriba no recibe ningún aviso: Jest simplemente no lo ejecuta.

## Qué queda sin cubrir

| Componente | Riesgo si se rompe |
| --- | --- |
| `FormField` | **Todos los formularios de los 59 recursos** |
| `Modal` | Contenedor de todos los formularios |
| `ConfirmDialog` | Confirmación de operaciones destructivas |
| `DataTable` | Todos los listados |
| `SearchFilterBar` | Búsqueda y filtros |
| `PageState` | Todos los estados de todas las pantallas |
| `ErrorBoundary` | Recuperación ante error |
| `ProtectedRoute` | Guarda de acceso |
| `AppShell` | Layout y navegación |
| `SearchableSelect` | ⚠️ Su **lógica** sí está probada (7 casos), pero no su render |

## Efecto colateral: la accesibilidad no se puede verificar

Los dos hallazgos críticos de accesibilidad —[A11Y-01](../accessibility/audit-report.md) (foco en modales) y [A11Y-02](../accessibility/audit-report.md) (errores sin ARIA)— **son exactamente el tipo de defecto que una prueba de componente con `axe-core` detecta automáticamente**.

Sin esta capa, la accesibilidad solo se puede auditar a mano, y las regresiones pasan inadvertidas.

## Qué haría falta

| Paso | Cambio |
| --- | --- |
| 1 | `testMatch: ['**/__tests__/**/*.test.[jt]s?(x)']` en `jest.config.cjs` |
| 2 | Instalar `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event` |
| 3 | Opcional: `jest-axe` para comprobar accesibilidad |
| 4 | Verificar que `styleMock.js` sigue cubriendo los CSS Modules (ya lo hace) |

**Es un cambio de producto**: añade dependencias y modifica configuración. Requiere autorización.

## Alternativa considerada: Vitest

Vitest compartiría configuración con Vite (alias, plugins, transformaciones) y es más rápido. La contrapartida es migrar la configuración actual de Jest, que hoy funciona bien y ejecuta 156 casos en 2,43 s.

**Recomendación:** no migrar por migrar. Si se decide cubrir componentes, ampliar Jest es el camino de menor fricción.

## Primeras pruebas recomendadas, por valor

Si se habilita esta capa, este es el orden que más riesgo cubre:

| # | Objetivo | Qué verificar |
| --- | --- | --- |
| 1 | `FormField` | Que el error se vincule con `aria-describedby`; que `aria-invalid` aparezca; que el umbral de 12 opciones conmute a `SearchableSelect`; que el botón «Ahora» produzca hora local |
| 2 | `Modal` | Que atrape el foco; que lo restaure al cerrar; que `Escape` cierre; que el portal se monte en `body` |
| 3 | `ConfirmDialog` | Que `isLoading` deshabilite ambos botones y bloquee `Escape` |
| 4 | `DataTable` | Que `renderStatusLabel` muestre «Activo»/«Inactivo» y no «Sí»/«No»; que la columna de acciones desaparezca sin permisos |
| 5 | `ProtectedRoute` | Que redirija sin token y deje pasar con token |
| 6 | `PageState` | Que la acción solo aparezca con `actionLabel` **y** `onAction` |

## Prioridad relativa

Esta capa es **importante pero no la primera**. Antes conviene escribir las ~115 pruebas de funciones puras que **ya se pueden escribir hoy** sin tocar ninguna configuración (`session.ts`, `formValidation.ts`, `resourceApi.ts`, `resourceMapper.ts`, `localDraftStore.ts`).

Ver [strategy.md](strategy.md) y [../adr/ADR-0011-jest-sin-testing-library.md](../adr/ADR-0011-jest-sin-testing-library.md).
