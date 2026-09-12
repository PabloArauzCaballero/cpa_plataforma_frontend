# ADR-0004: CRUD genérico dirigido por datos

## Estado

**Aceptado.** Es la decisión estructural que define el producto.

## Contexto

El backend expone 59 recursos CRUD sobre 9 esquemas de base de datos (administración, personas, servicios educativos, contabilidad, deuda, infraestructura, inventario, societario, seguridad). Todos siguen el mismo patrón: listar, detalle, crear, actualizar.

Construir una pantalla a mano por recurso habría supuesto **59 páginas, 59 formularios y 59 tablas**, con la consiguiente divergencia de comportamiento entre ellas.

## Fuerzas y restricciones

- El catálogo de recursos crece con el negocio.
- El equipo es pequeño: el historial muestra un único autor principal.
- Los recursos comparten estructura, pero no completamente: hay campos condicionales, claves compuestas, altas transaccionales y tres formularios compuestos.
- La consistencia de la interfaz es un valor en sí: es un panel administrativo de uso diario.

## Opciones consideradas

| Opción | Ventaja | Inconveniente |
| --- | --- | --- |
| **A. Una pantalla por recurso** | Máximo control por caso | 59 × 3 artefactos; divergencia inevitable |
| **B. Motor genérico dirigido por datos** | Un solo motor; añadir un recurso es añadir un objeto | La configuración viaja al navegador; el tipado se debilita |
| **C. Generación de código en tiempo de build** | Tipos fuertes por recurso | Requiere herramienta propia y un paso de build extra |
| **D. Solución de terceros (admin genérico)** | Rápido | Poco control sobre la interfaz y sobre el contrato real del backend |

## Decisión

**Opción B.** Un array de `CrudResourceDefinition` en `resourceDefinitions.ts` describe los 59 recursos; `ResourceListPage` + `useResourceListViewModel` + `ResourceForm` los sirven todos.

`resourceFieldCatalog.ts` (4 803 líneas) enriquece las definiciones con etiquetas, validaciones y relaciones.

Se admiten tres escapes al patrón mediante `composite`:

| Valor | Pantalla sustituta |
| --- | --- |
| `transaction-with-account-movements` | `TransactionForm` dentro del modal |
| `venta-clase-batch` | `VentaClaseBatchPage` |
| `asistencia-masiva` | `AsistenciaMasivaPage` |

## Consecuencias positivas

- Añadir un recurso es añadir un objeto: **cero componentes nuevos**.
- Comportamiento uniforme en las 59 pantallas: mismos estados, mismos mensajes, misma paginación.
- Una corrección en el motor beneficia a los 59 recursos a la vez.
- Los permisos, filtros y validaciones se declaran junto al recurso.
- El mecanismo `composite` permite salir del patrón sin romperlo.

## Consecuencias negativas

- **`resourceDefinitions` pesa 180 KiB** (31 KiB gzip) en el bundle: la configuración de todas las pantallas viaja al navegador aunque se use una.
- **El tipado se apoya en `CrudRecord = Record<string, unknown>`**: no hay tipos por recurso, así que TypeScript no protege el acceso a los campos.
- `useResourceListViewModel` concentra **774 líneas y 22 estados**: es el punto de mayor complejidad del proyecto.
- Un fallo en el motor afecta a **los 59 recursos simultáneamente**.
- La lógica específica se infiltra en el motor: `ResourceListPage` contiene condiciones por `resource.key` (`clase-por-hora`, `clase-curso`, `aula`, `transaccion`).

## Riesgos

| Riesgo | Estado |
| --- | --- |
| El motor concentra el riesgo y **no tiene ninguna prueba** | 🔴 Real. `useResourceListViewModel`: 0 casos |
| El chunk de definiciones crece linealmente con el catálogo | 🟡 Vigilar con [../performance/budgets.md](../performance/budgets.md) |
| Las condiciones por `resource.key` erosionan la genericidad | 🟡 4 casos hoy |
| `CrudRecord` desactiva la ayuda del compilador en el dominio de negocio | 🟡 Aceptado |

## Evidencia

- `src/features/resources/domain/CrudResource.ts` — contrato
- `src/features/resources/domain/resourceDefinitions.ts` (536 líneas) — 59 definiciones
- `src/features/resources/domain/resourceFieldCatalog.ts` (4 803 líneas) — enriquecimiento
- `src/features/resources/pages/ResourceListPage.tsx` (283 líneas)
- `src/features/resources/hooks/useResourceListViewModel.ts` (774 líneas)
- Comunidades C1, C2, C4, C6, C8, C9 del [grafo Graphify](../reports/graphify-audit.md)

## Plan de revisión

Revisar si se cumple alguna de estas condiciones:

1. `resourceDefinitions` supera los 35 KiB gzip (presupuesto).
2. Las condiciones por `resource.key` en el motor superan las 8.
3. Los recursos con `composite` superan los 6: indicaría que el patrón genérico ya no sirve.
4. Se necesita tipado fuerte por recurso, por ejemplo para generar tipos desde un OpenAPI del backend.
