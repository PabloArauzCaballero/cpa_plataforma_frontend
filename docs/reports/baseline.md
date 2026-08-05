# Informe de línea base

> Fase 0 del Plan Maestro de Documentación. Estado reproducible del repositorio **antes** de cualquier trabajo documental.
>
> - **Commit de referencia:** `618e5c3f87a580e64869919a5b81875b345978be`
> - **Rama:** `main`
> - **Fecha de evidencia:** 2026-08-04
> - **Ejecutor:** trabajo documental automatizado (sin cambios de producto)

---

## 1. Advertencia de concurrencia

Durante la ejecución de esta fase había **otros dos agentes trabajando sobre el mismo repositorio**. Eso tuvo dos efectos observados y registrados:

| Momento | Observación | Evidencia |
|---|---|---|
| Inicio de sesión | Árbol de trabajo sucio: `dist/` modificado, `src/features/resources/domain/resourceDefinitions.ts` modificado, `src/shared/components/FormField/SearchableSelect.tsx` sin trackear | `git status --porcelain` |
| Durante la fase 0 | Apareció `src/__tests__/shared/searchableSelectMatch.test.ts`, que no existía en el primer listado | `find src -type f` antes/después |
| Fin de la fase 0 | El trabajo ajeno se consolidó en el commit `618e5c3`; árbol limpio | `git log --oneline`, `git status` vacío |

**Consecuencia metodológica:** la línea base se fija en `618e5c3` (árbol limpio), no en el estado sucio inicial. Los números de la sección 3 corresponden a esa base.

Medidas de no colisión aplicadas durante todo el trabajo documental:

- Solo se crean archivos **nuevos** bajo `docs/`, `scripts/`, `structurizr/` y `mkdocs.yml`.
- Cero escrituras en `src/`, `dist/`, `package.json`, `yarn.lock`, `tsconfig*`, `vite.config.ts`.
- Cero ejecuciones de `git commit`, `git stash`, `git checkout`, `git reset`.
- El build de verificación se dirige a un `--outDir` temporal fuera del repositorio, para no sobrescribir `dist/`, que **sí está versionado** en este proyecto.

---

## 2. Stack verificado

Todo lo siguiente fue comprobado en el repositorio, no asumido.

| Elemento | Valor | Evidencia |
|---|---|---|
| Framework UI | React `^19.2.7` | `package.json` |
| Router | `react-router-dom` `7.18.0`, `createBrowserRouter` | `package.json`, `src/app/router.tsx:25` |
| Estrategia de renderizado | SPA 100 % cliente (CSR). Sin SSR, SSG, ISR ni streaming | `src/main.tsx`, ausencia de servidor de render |
| Bundler | Vite `^8.0.0` con `@vitejs/plugin-react` `6.0.2` | `package.json`, `vite.config.ts` |
| Lenguaje | TypeScript `6.0.3`, `strict: true` | `package.json`, `tsconfig.json` |
| Gestor de paquetes | Yarn Classic `1.22.22` (`packageManager`) | `package.json`, `.yarnrc.yml` (`nodeLinker: node-modules`) |
| Node en ejecución | `v24.18.0` | `node -v` |
| Node declarado para imagen | `node:24-alpine` | `Dockerfile` |
| Estilos | CSS Modules + variables CSS. **Sin** Tailwind, styled-components ni CSS-in-JS | `src/**/*.module.css`, `src/shared/styles/theme.css` |
| Estado global | **Ninguna librería**. React Context (solo tutoriales) + `useState`/`useMemo` | `src/features/tutorials/react/TutorialContext.ts`; ausencia de Redux/Zustand/Jotai |
| Estado de servidor | **Ninguna librería** (sin React Query/SWR). `fetch` manual en hooks | `src/shared/api/httpClient.ts` |
| Cliente HTTP | `fetch` nativo envuelto en `httpClient` propio | `src/shared/api/httpClient.ts` |
| Formularios | Implementación propia. **Sin** react-hook-form/Formik/Zod | `src/shared/validation/formValidation.ts` |
| i18n | **No existe**. Textos en español embebidos en el código | ausencia de i18next/react-intl |
| Iconos | FontAwesome vía paquetes npm **y** vía CDN en `index.html` | `package.json`, `index.html:14` |
| Tutoriales guiados | `driver.js` `1.8.0` | `package.json`, `src/features/tutorials/engine/DriverTutorialRenderer.ts` |
| Pruebas | Jest `^30.4.2` + ts-jest + jsdom. **Sin** Testing Library, Playwright ni Cypress | `jest.config.cjs`, `package.json` |
| Linter | **No existe**. No hay ESLint/Biome/Prettier configurado | ausencia de `.eslintrc*`, `eslint.config.*`, `biome.json` |
| Despliegue | Cloudflare Workers (assets estáticos) + imagen Docker/nginx alternativa | `wrangler.jsonc`, `Dockerfile`, `docker/nginx.conf` |

### Estructura del repositorio

Repositorio **simple** (no monorepo). Arquitectura **por features** con capa `shared` transversal:

```
src/
├── app/          # composición raíz: App, router, ProtectedRoute
├── config/       # lectura de variables de entorno
├── features/     # auth, catalogs, dashboard, files, profile, quality, resources, tutorials
├── shared/       # api, auth, components, layouts, services, styles, utils, validation
└── __tests__/    # pruebas Jest (fuera de las features)
```

Volumen: **23 475** líneas de TypeScript/TSX y **7 007** líneas de CSS en 138 archivos de código.

---

## 3. Ejecución de la línea base

Todos los comandos se ejecutaron sobre `618e5c3`, árbol limpio.

| # | Comando | Herramienta | Resultado | Duración | Observaciones |
|---|---|---|---|---|---|
| 1 | `yarn install --frozen-lockfile` | Yarn 1.22.22 | ✅ éxito | 0,42 s | `success Already up-to-date.` El lockfile **no** se modificó |
| 2 | `yarn typecheck` (`tsc --noEmit`) | TypeScript 6.0.3 | ✅ 0 errores | 5,65 s | — |
| 3 | `yarn test` (`jest --runInBand`) | Jest 30 | ✅ 12 suites / **156** pruebas | 2,43 s | 0 fallos, 0 skips, 0 snapshots |
| 4 | `npx tsc -b && npx vite build --outDir <tmp>` | Vite 8.0.16 | ✅ éxito | 2 s (build Vite: 186 ms) | 173 módulos transformados |
| 5 | `yarn audit` | Yarn 1 | ⚠️ no ejecutado | — | Ver limitación L-03 |
| 6 | Lint | — | ⛔ no aplica | — | El proyecto **no tiene** linter configurado |
| 7 | Pruebas E2E | — | ⛔ no aplica | — | El proyecto **no tiene** pruebas E2E |
| 8 | Análisis de bundle | — | ⛔ no existe herramienta | — | Medido manualmente, ver §4 |
| 9 | Lighthouse / axe | — | ⛔ no aplica | — | No hay pruebas de navegador |

### Detalle de pruebas (12 suites, 156 casos)

| Suite | Casos |
|---|---:|
| `__tests__/tutorials/tutorialEngine.test.ts` | 28 |
| `__tests__/tutorials/tutorialProgress.test.ts` | 18 |
| `__tests__/tutorials/tutorialRegistry.test.ts` | 16 |
| `__tests__/tutorials/tutorialCatalog.test.ts` | 13 |
| `__tests__/tutorials/targetResolver.test.ts` | 12 |
| `__tests__/tutorials/tutorialValidation.test.ts` | 12 |
| `__tests__/tutorials/tutorialRenderer.test.ts` | 10 |
| `__tests__/resources/transactionFormModel.test.ts` | 9 |
| `__tests__/tutorials/tutorialFlow.integration.test.ts` | 9 |
| `__tests__/shared/searchableSelectMatch.test.ts` | 7 |
| `__tests__/resources/fieldTooltips.test.ts` | 5 |
| `__tests__/resources/resourceMapper.test.ts` | 3 |
| **Total** | **156** |

**Distribución real:** 118 de 156 casos (76 %) prueban la feature *tutoriales*. Las 8 rutas de negocio y los componentes compartidos concentran 38 casos. No hay medición de cobertura configurada (`coverage/` está en `.gitignore` pero ningún script la genera).

---

## 4. Métricas iniciales de artefacto

Build de producción del commit `618e5c3` (medido en `outDir` temporal, sin tocar `dist/`).

| Métrica | Valor |
|---|---:|
| JavaScript total | 865 255 B (845 KiB) |
| CSS total | 123 638 B (121 KiB) |
| Chunk inicial `index-*.js` | 478 676 B → **148 469 B gzip** |
| CSS inicial `index-*.css` | 23 811 B → 5 670 B gzip |
| Chunk más pesado tras el inicial | `resourceDefinitions-*.js` 180 531 B (30 920 B gzip) |
| Chunk de ruta más pesado | `ResourceListPage-*.js` 114 671 B (33 430 B gzip) |
| CSS de ruta más pesado | `ResourceListPage-*.css` 43 210 B (7 360 B gzip) |
| Módulos transformados | 173 |
| Tiempo de build Vite | 186 ms |

Estos valores son la **referencia de no regresión**: cualquier cambio posterior debe compararse contra ellos. Ver [performance/budgets.md](../performance/budgets.md).

---

## 5. Contratos consumidos desde el backend

Se verificaron por lectura del código, no por ejecución. El frontend consume **9 familias de endpoints** más 59 recursos CRUD generados por definición. Detalle completo en [integrations/backend-api.md](../integrations/backend-api.md).

No fue posible contrastar contra un OpenAPI del backend: **no hay especificación OpenAPI en este repositorio**. Existe `docs/endpoints/endpoints.md` y `docs/validation/frontend-checks-catalog.json` como documentación previa, pero no son contratos ejecutables. Ver limitación L-01.

---

## 6. Fallos y deuda preexistentes

Ningún comando de la línea base falló. Los puntos siguientes **no son fallos de ejecución** sino ausencias estructurales detectadas, registradas aquí para no atribuirlas al trabajo documental:

| ID | Hallazgo | Severidad | Estado |
|---|---|---|---|
| P-01 | Credenciales de administrador embebidas en `src/features/auth/hooks/useLoginViewModel.ts:8-9` y compiladas al bundle público | **BLOCKER** | Preexistente. Ver [security/frontend-security.md](../security/frontend-security.md) |
| P-02 | No hay linter configurado | HIGH | Preexistente |
| P-03 | No hay pruebas E2E ni de componentes React | HIGH | Preexistente |
| P-04 | No hay medición de cobertura | MEDIUM | Preexistente |
| P-05 | No hay CI/CD versionado en el repo (`.github/`, `.gitlab-ci.yml` ausentes) | HIGH | Preexistente |
| P-06 | `dist/` versionado en git: el artefacto compilado viaja en el repositorio | MEDIUM | Decisión deliberada, documentada en `.gitignore` y `wrangler.jsonc` |
| P-07 | `src/features/quality/pages/QualityGatePage.tsx` no está referenciado por nadie (código huérfano) | LOW | Preexistente |
| P-08 | FontAwesome se carga por CDN externo sin SRI y además está como dependencia npm | MEDIUM | Preexistente |
| P-09 | Sin Content-Security-Policy en ninguna capa de servicio | HIGH | Preexistente |

---

## 7. Limitaciones de esta línea base

| ID | Limitación | Impacto | Mitigación aplicada |
|---|---|---|---|
| L-01 | No hay OpenAPI del backend accesible desde este repositorio | No se puede verificar drift contractual de forma automática | Se documentó el contrato **tal como lo consume el frontend** y se marcó el drift como no verificable |
| L-02 | No hay entorno de navegador ni backend levantado durante la auditoría | Los journeys se verificaron por lectura de código y pruebas, no por ejecución | Se declara explícitamente en cada journey el método de verificación |
| L-03 | `yarn audit` no se ejecutó para evitar tráfico de red y contención con los otros agentes | Sin inventario de CVEs en esta línea base | Registrado como acción pendiente en [security/dependencies.md](../security/dependencies.md) |
| L-04 | No hay capturas visuales de referencia (no existe herramienta de navegador en el proyecto) | La regresión visual no es comprobable automáticamente | Registrado en [testing/visual-regression.md](../testing/visual-regression.md) |
| L-05 | Graphify se ejecutó solo sobre `src/` en modo AST (sin extracción semántica LLM) | El grafo cubre código, no la prosa de los README internos | Documentado en [reports/graphify-audit.md](graphify-audit.md) |

---

## 8. Plan de reversión del trabajo documental

Todos los archivos producidos por este trabajo son **nuevos** y están confinados a rutas conocidas. Reversión total:

```bash
# Elimina exclusivamente lo creado por el trabajo documental.
rm -rf docs/reports docs/getting-started docs/business docs/routes \
       docs/components docs/design-system docs/data-and-state \
       docs/integrations docs/accessibility docs/security docs/performance \
       docs/observability docs/operations docs/testing docs/adr docs/governance
rm -f  docs/index.md
rm -f  docs/architecture/overview.md docs/architecture/system-context.md \
       docs/architecture/containers.md docs/architecture/frontend-layers.md \
       docs/architecture/module-dependencies.md docs/architecture/rendering-strategy.md \
       docs/architecture/routing-and-navigation.md docs/architecture/state-management.md \
       docs/architecture/data-flow.md docs/architecture/error-boundaries.md \
       docs/architecture/integration-map.md
rm -rf structurizr scripts graphify-out
rm -f  mkdocs.yml
```

No hay que revertir nada en `src/`, `dist/`, `package.json` ni `yarn.lock`: **no fueron tocados**. `graphify-out/` ya estaba en `.gitignore`, por lo que nunca ensució el árbol.

---

## 9. Criterio de salida de la Fase 0

| Criterio | Estado |
|---|---|
| Repositorio instalable de forma reproducible | ✅ `--frozen-lockfile` sin modificar el lockfile |
| Línea base ejecutada y registrada | ✅ 4 comandos con resultado, duración y evidencia |
| Cero archivos funcionales modificados durante el diagnóstico | ✅ verificado con `git status` |
| Riesgos y cambios preexistentes diferenciados del trabajo propio | ✅ §1, §6 |
| Fallos no ignorados silenciosamente | ✅ §6 y §7 |
