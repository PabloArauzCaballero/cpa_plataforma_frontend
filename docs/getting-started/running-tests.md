# Ejecutar pruebas

## Comando

```bash
yarn test          # jest --runInBand  → 12 suites, 156 pruebas, ~2,4 s
yarn test:watch    # jest --watch
```

`--runInBand` fuerza ejecución **en serie** (un solo worker). Es deliberado: varias suites de tutoriales manipulan `window.localStorage` y temporizadores globales del entorno jsdom, y en paralelo interferirían entre sí.

## Configuración real

`jest.config.cjs`:

| Opción | Valor | Consecuencia |
|---|---|---|
| `preset` | `ts-jest` | TypeScript compilado en cada ejecución |
| `testEnvironment` | `jsdom` | Hay `window`, `document` y `localStorage` |
| `roots` | `<rootDir>/src` | Solo busca dentro de `src/` |
| `testMatch` | `**/__tests__/**/*.test.ts` | ⚠️ **Solo `.ts`, no `.tsx`** |
| `moduleNameMapper` | `^@/(.*)$ → <rootDir>/src/$1` | El alias `@/` funciona en pruebas |
| `moduleNameMapper` | `\.(css\|less\|scss\|sass)$ → src/__tests__/styleMock.js` | Los CSS Modules devuelven un objeto vacío |
| `transform` | `ts-jest` con `tsconfig.jest.json` | Config de tipos separada de la de build |

### Consecuencia de `testMatch: **/__tests__/**/*.test.ts`

El patrón **excluye `.test.tsx`**. Como todo componente React necesita JSX, en la práctica esto significa que **no se puede escribir una prueba de componente renderizado** sin cambiar la configuración. Es coherente con que el proyecto no tenga `@testing-library/react` instalado.

Efecto medible: las pruebas cubren lógica pura (dominio, mappers, motor de tutoriales) pero **ningún componente React se renderiza en ninguna prueba**. Ver [testing/component-tests.md](../testing/component-tests.md).

## Qué se prueba hoy

| Suite | Casos | Qué cubre |
|---|---:|---|
| `tutorials/tutorialEngine.test.ts` | 28 | Máquina de estados del motor de tutoriales |
| `tutorials/tutorialProgress.test.ts` | 18 | Cálculo y persistencia de progreso |
| `tutorials/tutorialRegistry.test.ts` | 16 | Registro y resolución de tutoriales |
| `tutorials/tutorialCatalog.test.ts` | 13 | Integridad del catálogo y de los anclajes |
| `tutorials/targetResolver.test.ts` | 12 | Resolución de selectores DOM de cada paso |
| `tutorials/tutorialValidation.test.ts` | 12 | Validación de definiciones de tutorial |
| `tutorials/tutorialRenderer.test.ts` | 10 | Contrato del renderizador |
| `tutorials/tutorialFlow.integration.test.ts` | 9 | Recorrido completo de un tutorial |
| `resources/transactionFormModel.test.ts` | 9 | Modelo del formulario de transacción contable |
| `shared/searchableSelectMatch.test.ts` | 7 | Coincidencia de texto del selector buscable |
| `resources/fieldTooltips.test.ts` | 5 | Textos de ayuda por campo |
| `resources/resourceMapper.test.ts` | 3 | Normalización de respuestas de lista |

**Distribución:** 118 de 156 casos (76 %) son de tutoriales. Ver el desequilibrio y su riesgo en [testing/strategy.md](../testing/strategy.md).

## Qué NO se prueba

Declarado explícitamente:

| Área | Estado |
|---|---|
| Componentes React renderizados | ❌ ninguna prueba |
| Rutas y navegación | ❌ ninguna prueba |
| Guarda `ProtectedRoute` | ❌ ninguna prueba |
| `httpClient` (cabeceras, errores, 401) | ❌ ninguna prueba |
| `shared/auth/session` (parseo de login, permisos) | ❌ ninguna prueba |
| `shared/validation/formValidation` (341 líneas, 8 reglas por recurso) | ❌ ninguna prueba |
| `useResourceListViewModel` (774 líneas, 22 estados) | ❌ ninguna prueba |
| Subida a Cloudinary | ❌ ninguna prueba |
| Journeys E2E | ❌ no existe la capa |
| Accesibilidad | ❌ no existe la capa |
| Regresión visual | ❌ no existe la capa |

## Cobertura

**No hay medición configurada.** Jest puede generarla, pero ningún script del proyecto lo hace y `coverage/` está en `.gitignore`.

Para obtener una lectura puntual sin modificar el repositorio:

```bash
npx jest --coverage --coverageDirectory=/tmp/cpa-coverage
```

> No añadas `--coverage` a `yarn test` sin acordar antes un umbral: convertirlo en puerta de calidad con la cobertura actual haría fallar el build por deuda preexistente. Ver [governance/change-management.md](../governance/change-management.md).

## Ejecutar una suite concreta

```bash
npx jest tutorialEngine              # por nombre de archivo
npx jest -t "reanuda el tutorial"    # por nombre de caso
```

## Datos de prueba

Las pruebas usan **datos sintéticos y deterministas** construidos en `src/__tests__/tutorials/testFactories.ts`. Ninguna prueba hace peticiones de red ni toca servicios reales — no hay `fetch` mockeado porque no hay pruebas que lleguen a la capa HTTP. Ver [testing/test-data.md](../testing/test-data.md).

## Reglas al modificar pruebas

1. No reescribas una prueba para que pase: corrige el código o registra el fallo.
2. No hay snapshots en el proyecto (0 snapshots). Si introduces alguno, revísalo caso por caso.
3. Diferencia siempre un fallo nuevo de la deuda preexistente contrastando con [reports/baseline.md](../reports/baseline.md) §3.
