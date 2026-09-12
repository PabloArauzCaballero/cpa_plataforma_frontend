# Estrategia de pruebas

## Estado actual, medido

| Métrica | Valor |
| --- | ---: |
| Suites | 12 |
| Casos | 156 |
| Tiempo de ejecución | 2,43 s |
| Fallos | 0 |
| Snapshots | 0 |
| Cobertura medida | ❌ **Ninguna herramienta la genera** |

## El hallazgo central: la inversión está donde no está el riesgo

| Área | Casos | % | Peso en el producto |
| --- | ---: | ---: | --- |
| **Tutoriales** | 118 | 76 % | Apoyo a la adopción |
| Dominio de recursos | 17 | 11 % | **El producto: 59 recursos CRUD** |
| Componentes compartidos | 7 | 4 % | Transversal |
| Todo lo demás | 14 | 9 % | — |

Desglose de lo probado frente a lo no probado en el núcleo de negocio:

| Módulo | Líneas | Riesgo | Casos |
| --- | ---: | --- | ---: |
| `useResourceListViewModel.ts` | 774 | **Muy alto**: 22 estados, filtrado local, paginación, permisos | **0** |
| `formValidation.ts` | 341 | **Muy alto**: reglas contables reales | **0** |
| `session.ts` | 178 | **Muy alto**: sesión y permisos | **0** |
| `resourceApi.ts` | 237 | Alto: construcción de consulta y batch | **0** |
| `httpClient.ts` | 150 | Alto: cabeceras, errores, 401 | **0** |
| `profileMapper.ts` | 167 | Medio | **0** |
| `cloudinaryUpload.ts` | 164 | Medio | **0** |
| `resourceMapper.ts` | 80 | Alto: única puerta de entrada de listas | 3 |
| `TutorialEngine.ts` | 522 | Medio (contenido en su feature) | 28 |

**Los cinco módulos de mayor riesgo del producto suman 0 pruebas.** El motor de tutoriales, que no maneja datos de negocio, tiene 28.

Esto no es una crítica al trabajo hecho en tutoriales —está bien probado— sino una constatación de dónde falta.

## Capas de prueba

| Capa | Estado | Herramienta |
| --- | --- | --- |
| Unitarias de lógica pura | ✅ Existe | Jest + ts-jest |
| Hooks y stores | ❌ No existe | — |
| Componentes | ❌ **Imposible sin cambiar la configuración** | — |
| Integración de features | ⚠️ Solo tutoriales (`tutorialFlow.integration.test.ts`) | Jest |
| E2E de journeys | ❌ No existe | — |
| Contratos de API | ❌ No existe | — |
| Regresión visual | ❌ No existe | — |
| Accesibilidad | ❌ No existe | — |
| Rendimiento | ❌ No existe | — |
| Smoke de despliegue | ❌ No existe | — |

### Por qué las pruebas de componente son imposibles hoy

```js
// jest.config.cjs
testMatch: ['**/__tests__/**/*.test.ts'],   // ← sin la "x"
```

El patrón excluye `.test.tsx`. Como todo componente React necesita JSX, **no se puede escribir una prueba de componente sin cambiar la configuración**. Además no hay librería de renderizado instalada (`@testing-library/react` ausente).

Consecuencia: **ningún componente React se renderiza en ninguna prueba del proyecto.**

## Matriz de trazabilidad journey ↔ prueba

| Journey | Ruta | Componentes | API | Unit. | Integr. | E2E | Visual | A11y | Estado |
| --- | --- | --- | --- | :---: | :---: | :---: | :---: | :---: | --- |
| Iniciar sesión | `/login` | LoginForm | `publicAuth/login` | ❌ | ❌ | ❌ | ❌ | ❌ | 🔴 Sin cobertura |
| Consultar un recurso | `/modulos/:m/:r` | ResourceListPage, DataTable | `{list}` | ⚠️ solo mapper | ❌ | ❌ | ❌ | ❌ | 🔴 Crítico |
| Filtrar y buscar | ídem | SearchFilterBar | `{list}` | ❌ | ❌ | ❌ | ❌ | ❌ | 🔴 Crítico |
| Crear un registro | modal | ResourceForm, FormField | `{create}` | ❌ | ❌ | ❌ | ❌ | ❌ | 🔴 Crítico |
| Editar un registro | modal | ídem | `{detail}`, `{update}` | ❌ | ❌ | ❌ | ❌ | ❌ | 🔴 Crítico |
| Inhabilitar un registro | modal | ConfirmDialog | `{update}` | ❌ | ❌ | ❌ | ❌ | ❌ | 🔴 Crítico |
| Exportar | modal | ResourceExportModal | `{list}` | ❌ | ❌ | ❌ | ❌ | ❌ | 🟠 Alto |
| Registrar transacción contable | modal | TransactionForm | `{create}` | ✅ 9 (modelo) | ❌ | ❌ | ❌ | ❌ | 🟠 Alto |
| Parte de clases pasadas | `/modulos/contabilidad/venta-clase` | VentaClaseBatchPage | `registrar-batch` | ❌ | ❌ | ❌ | ❌ | ❌ | 🔴 Crítico |
| Pasar lista | `/modulos/servicios_educativos/asistencia-masiva` | AsistenciaMasivaPage | 4 endpoints | ❌ | ❌ | ❌ | ❌ | ❌ | 🔴 Crítico |
| Configurar cuentas operativas | `/contabilidad/catalogos-cuentas-operativas` | CatalogosOperativosPage | 6 endpoints | ❌ | ❌ | ❌ | ❌ | ❌ | 🟠 Alto |
| Subir archivo | `/contabilidad/archivos` | FileLibraryPage | Cloudinary + 3 | ❌ | ❌ | ❌ | ❌ | ❌ | 🟠 Alto |
| Importar por lote | `/batch/:m/:r` | ResourceBatchPage | batch × 2 | ❌ | ❌ | ❌ | ❌ | ❌ | 🟠 Alto |
| Seguir un tutorial | `/tutoriales` | TutorialCenterPage | progreso | ✅ 118 | ✅ 9 | ❌ | ❌ | ❌ | 🟢 Cubierto |
| Ver el perfil | `/perfil` | UserProfilePage | `privateAuth/me` | ❌ | ❌ | ❌ | ❌ | ❌ | 🟠 Alto |

**Métrica del plan: «flujos críticos con prueba = 100 % o excepción formal».**
**Resultado: 1 de 15 journeys tiene cobertura. 14 requieren excepción formal.** Registrado en [../reports/production-readiness.md](../reports/production-readiness.md).

## Plan de mejora propuesto

> Ninguna de estas acciones se ha ejecutado: todas añaden archivos a `src/` o cambian configuración, y son cambios de producto que requieren autorización.

### Nivel 1 — Sin cambiar ninguna configuración

Estas pruebas se pueden escribir **hoy**, como `.test.ts`, sobre funciones puras ya exportadas. Máximo valor por el mínimo coste.

| # | Objetivo | Por qué primero | Casos estimados |
| --- | --- | --- | ---: |
| 1 | `session.ts`: `buildStoredSessionFromLoginResponse`, `userHasAnyPermission`, `parsePermissionString`, `normalizeToken` | Sesión y permisos, sin cobertura, 12 rutas de resolución de alias | ~25 |
| 2 | `formValidation.ts`: `validateResourcePayload` | 15 reglas genéricas + 7 recursos con reglas contables | ~40 |
| 3 | `resourceApi.ts`: `appendQuery`, `normalizeBatchValidationResponse`, `normalizeBatchProcessResponse` | Construcción de consulta y normalización de lotes | ~20 |
| 4 | `resourceMapper.ts`: ampliar a las 10 formas de respuesta aceptadas | Hoy solo 3 casos para el punto de entrada de todos los datos | ~10 |
| 5 | `localDraftStore.ts`: `sanitizeDraftPayload`, TTL, corrupción | Protege datos personales | ~10 |
| 6 | `humanize.ts`, `exportRecords.ts` | Baratas | ~10 |

**~115 casos nuevos sin tocar `jest.config.cjs` ni añadir dependencias.** Duplicaría la cobertura del núcleo de negocio.

### Nivel 2 — Requiere configuración

| # | Objetivo | Cambio necesario |
| --- | --- | --- |
| 7 | Pruebas de componente (`FormField`, `DataTable`, `Modal`, `ConfirmDialog`) | `testMatch` a `.test.tsx` + instalar `@testing-library/react` |
| 8 | Pruebas de `httpClient` | Mock de `fetch` |
| 9 | Pruebas de hooks (`useResourceListViewModel`) | `@testing-library/react` |

### Nivel 3 — Nueva infraestructura

| # | Objetivo | Coste |
| --- | --- | --- |
| 10 | E2E de los 5 journeys críticos | Playwright + entorno con backend o mocks |
| 11 | Accesibilidad automatizada | `axe-core` sobre las pruebas de componente |
| 12 | Regresión visual | Playwright con capturas de referencia |
| 13 | Contratos de API | Requiere OpenAPI del backend |

## Reglas de trabajo

1. **No reescribir una prueba para que pase.** Corregir el código o registrar el fallo.
2. **No actualizar snapshots en bloque.** Hoy no hay snapshots; si se introducen, revisarlos uno a uno.
3. **Distinguir siempre** una regresión nueva de la deuda preexistente, contrastando con [../reports/baseline.md](../reports/baseline.md) §3.
4. **Datos sintéticos y deterministas.** Como ya hace `testFactories.ts`.
5. **Ninguna prueba debe llamar a un servicio real.** Hoy se cumple: ninguna prueba llega a la capa HTTP.
6. **Probar también los caminos negativos:** error, latencia, permisos ausentes, sesión expirada, respuesta con forma desconocida.

## Criterio de salida (definición de suficiencia)

| Criterio | Estado |
| --- | --- |
| Cada journey crítico tiene E2E o excepción formal | ❌ 14 de 15 sin cobertura ni excepción registrada hasta este informe |
| Los componentes compartidos críticos tienen cobertura | ❌ Solo `SearchableSelect` |
| Existe medición de cobertura | ❌ |
| Las pruebas pasan | ✅ 156/156 |
| No hay pruebas frágiles ni ignoradas | ✅ 0 `skip`, 0 snapshots |
