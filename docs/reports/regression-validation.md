# Validación de regresión

> Fase 19 del Plan Maestro. Demuestra que el trabajo documental **no introdujo ninguna regresión**.

## Naturaleza del trabajo evaluado

Todo lo realizado fue clasificado como:

| Tipo | Alcance |
| --- | --- |
| `DOCUMENTAL` | Todos los archivos de `docs/`, `structurizr/` y `mkdocs.yml` |
| `INSTRUMENTACIÓN SEGURA` | Los 6 scripts de `scripts/`, todos de solo lectura |
| `CAMBIO DE PRODUCTO` | **Ninguno** |

## Archivos creados

| Ruta | Naturaleza |
| --- | --- |
| `docs/**` | Documentación (archivos nuevos) |
| `structurizr/workspace.dsl` | Modelo C4, no ejecutable |
| `scripts/*.mjs` | 6 scripts de validación, no destructivos |
| `mkdocs.yml` | Configuración de portal opcional, **no instalado** |
| `docs/ci/pipeline-propuesto.yml` | Plantilla de CI, **deliberadamente NO activa** |

## Archivos NO tocados — verificación

| Ruta | Modificada por este trabajo |
| --- | --- |
| `src/**` | ❌ **No** |
| `dist/**` | ❌ **No** |
| `package.json` | ❌ No |
| `yarn.lock` | ❌ No |
| `tsconfig.json`, `tsconfig.jest.json` | ❌ No |
| `vite.config.ts` | ❌ No |
| `jest.config.cjs` | ❌ No |
| `Dockerfile`, `docker/**` | ❌ No |
| `wrangler.jsonc` | ❌ No |
| `index.html` | ❌ No |
| `.env*` | ❌ No |
| `.github/**` | ❌ No creado |

**Cero dependencias añadidas.** Ni MkDocs, ni Structurizr, ni ninguna herramienta de análisis entró en `package.json`.

## Precauciones aplicadas durante la ejecución

| Precaución | Motivo |
| --- | --- |
| El build de verificación se dirigió a `--outDir` temporal fuera del repositorio | `dist/` está versionado; construir sobre él lo habría ensuciado |
| No se ejecutó `git commit`, `stash`, `checkout` ni `reset` | Había **otros dos agentes trabajando en paralelo** sobre el mismo repositorio |
| No se ejecutó `yarn install` sin `--frozen-lockfile` | Preservar el lockfile |
| Solo se escribieron archivos **nuevos** bajo `docs/` | Preservar trabajo ajeno. Se produjo **una excepción, detectada y revertida**: ver «Incidencias propias» |
| `graphify-out/` está en `.gitignore` | El artefacto de análisis no ensucia el árbol |

## Contexto de concurrencia — declarado

Durante toda la auditoría hubo **otros dos agentes modificando el repositorio**. Cambios ajenos observados:

| Momento | Cambio ajeno | Efecto en esta validación |
| --- | --- | --- |
| Inicio | Árbol sucio con `dist/`, `resourceDefinitions.ts` y `SearchableSelect.tsx` | Se fijó la línea base en el commit limpio posterior |
| Durante | Aparición de `src/__tests__/shared/searchableSelectMatch.test.ts` | Las pruebas pasaron de 11 suites/149 casos a 12/156 |
| Durante | Commit `618e5c3` | **Línea base fijada aquí** |
| Durante | Commit `c471eca` («permite dar de alta el colegio desde el formulario…») | HEAD avanzó |
| Durante | Rediseño visual en curso: `Background/`, `StateArt.tsx`, `backgrounds.css`, `theme.css`, `global.css`, `LoginPage`, `PageState`, `Button`, `Card`, `DataTable`, `Modal`, `SearchFilterBar`, `AppShell` | Documentado; los valores de tokens y props pueden haber evolucionado |

> **Consecuencia metodológica declarada:** toda la documentación está anclada al commit **`618e5c3`**, que es verificable con `git show`. Los cambios posteriores de otros agentes **no son atribuibles a este trabajo** y no invalidan la línea base, pero sí implican que algunos detalles visuales pueden haber cambiado desde entonces. Cada documento afectado lleva una nota de concurrencia.

## Incidencias propias detectadas y corregidas

Registradas por transparencia, aunque ya estén resueltas.

| # | Incidencia | Detección | Corrección |
| --- | --- | --- | --- |
| 1 | La normalización de tablas Markdown se aplicó también a **3 documentos preexistentes** que no formaban parte de este trabajo: `docs/endpoints/endpoints.md`, `docs/tutoriales.md`, `docs/validation/frontend-checks-catalog.md` | `git status` diferenciando archivos presentes en `618e5c3` | `git checkout --` sobre esos 3 archivos. Verificado: sin diferencias frente al original. El cambio era puramente cosmético (estilo de la fila separadora), pero **no correspondía tocarlos** |
| 2 | El verificador de anclas colapsaba espacios múltiples en un guion; GitHub genera uno por espacio | 15 enlaces marcados como rotos que sí existían | Corregido en `scripts/check-doc-links.mjs` |
| 3 | El detector de marcadores provisionales confundía la palabra española «TODO» con un marcador | 6 falsos positivos | Ahora exige dos puntos (`TODO:`) |
| 4 | El inventario de componentes marcaba `SearchableSelect` y `CloudinaryUploadField` como huérfanos | Contradicción con la lectura del código | Se excluía la carpeta entera en vez del propio archivo |

## Hallazgo del verificador de presupuesto — no atribuible a este trabajo

La ejecución final de `check-bundle-budget.mjs` sobre un build del árbol de trabajo actual **falló**:

```text
FALLO  CSS inicial (gzip)   7762 / 7000  (111 %)
AVISO  CSS total          142874 / 135000  (106 %)
```

| Aspecto | Detalle |
| --- | --- |
| Causa | El rediseño visual en curso de **otro agente**: `backgrounds.css` nuevo, más cambios en `theme.css`, `AppShell.module.css`, `HelpGuideModal.module.css` y `TutorialLauncher.module.css` |
| ¿Es mío? | **No.** Este trabajo no modificó ni un solo archivo CSS |
| Valor de la incidencia | ➕ **El script funciona**: detectó una regresión real de presupuesto en su primera ejecución sobre trabajo ajeno |
| Acción | Quien realice el rediseño debe justificar el aumento y actualizar [../performance/budgets.md](../performance/budgets.md) en el mismo pull request, o reducir el CSS inicial |

## Otros cambios ajenos observados al cierre

| Observación | Detalle |
| --- | --- |
| Las pruebas pasaron de 12 suites / 156 casos a **13 / 162** | Otro agente añadió pruebas. **Mejora**, no regresión |
| El commit `c471eca` **incluyó 22 de los documentos de este trabajo** | Otro agente ejecutó un `git add` amplio que arrastró archivos de `docs/`. No fue una acción de este trabajo, que nunca ejecutó `git commit` |
| `dist/` fue reconstruido y modificado | Por otro agente, con su propio `yarn build` |

## Comparación con la línea base

| Métrica | Línea base (`618e5c3`) | Tras el trabajo documental | Regresión |
| --- | --- | --- | --- |
| Archivos de `src/` modificados por este trabajo | — | **0** | ✅ Ninguna |
| Archivos de `dist/` modificados por este trabajo | — | **0** | ✅ Ninguna |
| Errores de type-check | 0 | 0 | ✅ |
| Suites de prueba | 12 | 12 | ✅ |
| Casos de prueba | 156 | 156 | ✅ |
| Pruebas fallidas | 0 | 0 | ✅ |
| Build | correcto, 173 módulos | correcto | ✅ |
| JS inicial (gzip) | 148 693 B | 148 693 B | ✅ Idéntico |
| CSS inicial (gzip) | 5 663 B | 5 663 B | ✅ Idéntico |
| JS total | 865 255 B | 865 255 B | ✅ Idéntico |
| Dependencias | 7 prod / 10 dev | 7 prod / 10 dev | ✅ |
| `yarn.lock` | sin cambios | sin cambios | ✅ |

Las métricas de bundle son **idénticas por construcción**: no se tocó ningún archivo que entre en el bundle.

## Resultado de los scripts de validación

| Script | Resultado |
| --- | --- |
| `check-doc-links.mjs` | ✅ Todos los enlaces internos y anclas resuelven |
| `check-doc-coverage.mjs` | ✅ 10/10 rutas documentadas · componentes catalogados · `APP_ROUTE_PATTERNS` sincronizado · 0 marcadores provisionales |
| `check-api-contract-drift.mjs` | ✅ 131 endpoints del código, todos documentados |
| `check-bundle-budget.mjs` | ✅ 7/7 sobre el build de la línea base · ⚠️ falla sobre el árbol actual por el rediseño ajeno (ver arriba) |
| `generate-route-inventory.mjs` | ✅ 10 rutas · 9 módulos · 59 recursos |
| `generate-component-inventory.mjs` | ✅ Inventario generado, sin huérfanos falsos |

## Regresiones visuales

**No aplica.** No se modificó ningún archivo CSS, ni ningún componente, ni ninguna plantilla.

> Nota: sí hubo cambios visuales en el repositorio durante el periodo, pero fueron introducidos por **otro agente** en su propio trabajo de rediseño. No son atribuibles a esta auditoría y no han sido evaluados aquí.

## Regresiones contractuales

**Ninguna.** No se modificó ningún servicio, endpoint, mapper ni definición de recurso.

Las **seis divergencias contractuales detectadas** (D-01 a D-06) son **preexistentes**: se documentaron sin tocar el código, conforme a la regla de «describir primero el comportamiento real y registrar la brecha».

## Reversión

Procedimiento completo en [baseline.md](baseline.md) §8. Resumen:

```bash
rm -rf docs/reports docs/getting-started docs/business docs/routes docs/components \
       docs/design-system docs/data-and-state docs/integrations docs/accessibility \
       docs/security docs/performance docs/observability docs/operations docs/testing \
       docs/adr docs/governance docs/ci
rm -f  docs/index.md
rm -f  docs/architecture/{overview,system-context,containers,frontend-layers,module-dependencies,rendering-strategy,routing-and-navigation,state-management,data-flow,error-boundaries,integration-map}.md
rm -rf structurizr scripts graphify-out
rm -f  mkdocs.yml
```

**No hay nada que revertir en `src/`, `dist/`, `package.json` ni `yarn.lock`.**

## Declaración

> **Cero regresiones atribuibles al trabajo documental.**
>
> Ningún archivo ejecutable fue modificado. Las métricas de build, tipos, pruebas y bundle son idénticas a la línea base. Los cambios ajenos observados durante el periodo están registrados y diferenciados.

## Lo que esta validación NO demuestra

Declarado explícitamente:

| Limitación | Motivo |
| --- | --- |
| No demuestra que el producto esté libre de defectos | La auditoría **encontró** 44 brechas, incluida 1 bloqueante |
| No demuestra que los cambios de otros agentes no introdujeran regresiones | Están fuera de su alcance y no fueron evaluados |
| No hay verificación visual automatizada | No existe esa capa en el proyecto |
| No hay verificación en navegador | Sin backend ni entorno disponible |
