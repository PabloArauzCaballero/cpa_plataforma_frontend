# ADR-0011: Jest sin librería de renderizado de componentes

## Estado
**Aceptado**, pero es la decisión con mayor coste de calidad del proyecto.

## Contexto
El proyecto usa Jest 30 con ts-jest y jsdom. La configuración limita las pruebas a `**/__tests__/**/*.test.ts` — **sin la `x` de `.tsx`**.

## Fuerzas y restricciones
- El equipo es pequeño.
- La lógica de tutoriales es compleja y merece prueba unitaria intensiva.
- Añadir `@testing-library/react` implica dependencias nuevas y aprender su modelo.

## Opciones consideradas
| Opción | Ventaja | Inconveniente |
| --- | --- | --- |
| **A. Jest solo para lógica pura** | Ligero, rápido (2,4 s), sin dependencias extra | **Ningún componente se prueba jamás** |
| B. Jest + Testing Library | Cubre componentes, hooks y accesibilidad básica | 3-4 dependencias más; pruebas más lentas |
| C. Vitest + Testing Library | Comparte configuración con Vite; más rápido | Migración de la configuración actual |

## Decisión
**Opción A.** `testMatch: ['**/__tests__/**/*.test.ts']`, entorno jsdom, CSS mockeado con `styleMock.js`, ejecución en serie con `--runInBand`.

## Consecuencias positivas
- Suite muy rápida: **156 casos en 2,43 s**.
- Cero dependencias de prueba más allá de Jest y ts-jest.
- Las pruebas de lógica pura son estables: sin fragilidad de DOM, 0 snapshots.
- El subsistema de tutoriales está **bien probado**: 118 casos, incluida una prueba de integración de flujo y una validación de contrato entre el catálogo de tutoriales y los anclajes del DOM.

## Consecuencias negativas

| Carencia | Alcance |
| --- | --- |
| **Ningún componente React se renderiza en ninguna prueba** | 11 componentes compartidos + 11 de feature |
| No se prueban los hooks | `useResourceListViewModel` (774 líneas, 22 estados): 0 casos |
| No se prueba la accesibilidad | Los dos hallazgos críticos de a11y habrían sido detectables con `axe` sobre pruebas de componente |
| No se prueban routing ni guardas | `ProtectedRoute`: 0 casos |
| **Un `.test.tsx` se ignora en silencio** | Quien lo escriba no recibe ningún aviso |

Distribución resultante: **76 % de las pruebas cubren tutoriales**, mientras el motor CRUD que sirve 59 recursos tiene 12 casos.

## Riesgos
| Riesgo | Severidad |
| --- | --- |
| Una regresión en `FormField` o `Modal` afecta a los 59 recursos y **no la detecta ninguna prueba** | 🔴 Alto |
| Los fallos de accesibilidad se acumulan sin detección | 🟠 Alto |
| Falsa sensación de cobertura: «156 pruebas pasan» no significa que el producto esté probado | 🟠 Alto |

## Evidencia
`jest.config.cjs`, `package.json` (sin `@testing-library/*`), `src/__tests__/` (12 archivos, todos `.ts`), [estrategia de pruebas](../testing/strategy.md).

## Plan de revisión

**Revisar ya.** La mitigación recomendada tiene dos fases:

1. **Sin cambiar nada de la configuración**, escribir ~115 casos sobre funciones puras ya exportadas y hoy sin cobertura: `session.ts`, `formValidation.ts`, `resourceApi.ts`, `resourceMapper.ts`, `localDraftStore.ts`. Duplicaría la cobertura del núcleo de negocio con coste mínimo.
2. Solo después, evaluar la opción B o C para cubrir componentes y accesibilidad.

Detalle en [../testing/strategy.md](../testing/strategy.md).
