# Matriz de trazabilidad

Conecta **negocio → ruta → componentes → API → prueba → documento**. Regenerable parcialmente con `node scripts/generate-route-inventory.mjs` y `node scripts/check-api-contract-drift.mjs`.

## Matriz principal

| Journey | Ruta | Componentes clave | API consumida | Permiso | Prueba | Documento |
| --- | --- | --- | --- | --- | --- | --- |
| J-01 Iniciar sesión | `/login` | `LoginForm`, `Button` | `POST /api/auth/publicAuth/login` | — (pública) | ❌ | [routes/login.md](../routes/login.md) |
| J-02 Consultar recurso | `/modulos/:m/:r` | `ResourceListPage`, `DataTable`, `SearchFilterBar`, `PageState` | `GET {list}` + lookups | lectura implícita | ⚠️ mapper (3) | [routes/resource-list.md](../routes/resource-list.md) |
| J-03 Alta | modal | `ResourceForm`, `FormField`, `SearchableSelect`, `Modal` | `POST {create}` | `{MODULO}.{TABLA}.CREATE` | ❌ | [data-and-state/forms-and-validation.md](../data-and-state/forms-and-validation.md) |
| J-04 Edición | modal | ídem + `TransactionForm` | `GET {detail}`, `PATCH {update}` | `…UPDATE` (derivado) | ❌ | ídem |
| J-05 Inhabilitar | modal | `ConfirmDialog` | `PATCH {update}` | `…DELETE` (derivado) | ❌ | [routes/resource-list.md](../routes/resource-list.md) |
| J-06 Parte de clases | `/modulos/contabilidad/venta-clase` | `VentaClaseBatchPage` | `POST /venta-clase/registrar-batch` + 5 lookups | `CONTABILIDAD.VENTA_CLASE.REGISTRAR_BATCH` | ❌ | [business/user-journeys.md](../business/user-journeys.md) |
| J-07 Pasar lista | `/modulos/servicios_educativos/asistencia-masiva` | `AsistenciaMasivaPage` | 4 endpoints | `SERVICIOS_EDUCATIVOS.ASISTENCIA_CLASE_CURSO.CREATE` | ❌ | ídem |
| J-08 Cuentas operativas | `/contabilidad/catalogos-cuentas-operativas` | `CatalogosOperativosPage` | 6 endpoints | ❌ ninguno comprobado | ❌ | [routes/catalogos-operativos.md](../routes/catalogos-operativos.md) |
| J-09 Archivos | `/contabilidad/archivos` | `FileLibraryPage`, `ConfirmDialog` | Cloudinary + 3 endpoints | ❌ ninguno comprobado | ❌ | [routes/file-library.md](../routes/file-library.md) |
| J-10 Importación | `/batch/:m/:r` | `ResourceBatchPage` | `{list}/batch/validate`, `/process` | ❌ ninguno comprobado | ❌ | [routes/resource-batch.md](../routes/resource-batch.md) |
| J-11 Tutoriales | `/tutoriales` | `TutorialCenterPage`, `TutorialCard` | `/api/onboarding/tutoriales/progreso` | por rol, en el catálogo | ✅ **118** | [routes/tutorials.md](../routes/tutorials.md) |
| J-12 Perfil | `/perfil` | `UserProfilePage` | `GET /api/auth/privateAuth/me` | — | ❌ | [routes/profile.md](../routes/profile.md) |
| — Tablero de módulo | `/modulos/:m` | `ModuleResourcePickerPage` | ninguna | ❌ no filtra | ❌ | [routes/module-board.md](../routes/module-board.md) |
| — Inicio | `/` | `HomePage`, `ModuleSummary` | ninguna | — | ❌ | [routes/home.md](../routes/home.md) |
| — No encontrado | `/*` | `PageState` | ninguna | — | ❌ | [routes/not-found.md](../routes/not-found.md) |

## Trazabilidad módulo → riesgo → prueba

| Módulo de código | Líneas | Sirve a | Riesgo | Pruebas | Documento |
| --- | ---: | --- | --- | ---: | --- |
| `useResourceListViewModel.ts` | 774 | J-02…J-05, 59 recursos | 🔴 Muy alto | **0** | [architecture/state-management.md](../architecture/state-management.md) |
| `resourceFieldCatalog.ts` | 4 803 | J-03, J-04 | 🟠 Alto | 0 | [adr/ADR-0004](../adr/ADR-0004-crud-dirigido-por-datos.md) |
| `formValidation.ts` | 341 | J-03, J-04 | 🔴 Muy alto | **0** | [data-and-state/forms-and-validation.md](../data-and-state/forms-and-validation.md) |
| `session.ts` | 178 | Todos | 🔴 Muy alto | **0** | [integrations/authentication.md](../integrations/authentication.md) |
| `httpClient.ts` | 150 | Todos | 🟠 Alto | **0** | [architecture/error-boundaries.md](../architecture/error-boundaries.md) |
| `resourceApi.ts` | 237 | J-02…J-05, J-10 | 🟠 Alto | 0 | [integrations/backend-api.md](../integrations/backend-api.md) |
| `resourceMapper.ts` | 80 | J-02 | 🟠 Alto | 3 | [architecture/data-flow.md](../architecture/data-flow.md) |
| `profileMapper.ts` | 167 | J-12 | 🟡 Medio | 0 | [routes/profile.md](../routes/profile.md) |
| `cloudinaryUpload.ts` | 164 | J-09 | 🟡 Medio | 0 | [integrations/file-storage.md](../integrations/file-storage.md) |
| `localDraftStore.ts` | ~95 | J-03, J-04 | 🟡 Medio | **0** | [data-and-state/persistence.md](../data-and-state/persistence.md) |
| `TutorialEngine.ts` | 522 | J-11 | 🟡 Medio | **28** | [routes/tutorials.md](../routes/tutorials.md) |
| `SearchableSelect.tsx` | 195 | J-03, J-04 | 🟡 Medio | **7** | [components/catalog.md](../components/catalog.md) |

**Correlación observada:** los cinco módulos de riesgo muy alto y alto que sostienen el negocio suman **3 pruebas**; los dos de riesgo medio del subsistema de tutoriales suman **35**.

## Trazabilidad hallazgo → evidencia → documento

| Hallazgo | Evidencia reproducible | Severidad | Documento |
| --- | --- | --- | --- |
| SEC-01 credenciales | `grep -rl "PabloAdmin2026" dist/` | BLOCKER | [security/frontend-security.md](../security/frontend-security.md#sec-01) |
| A11Y-01 foco en modales | `Modal.tsx`, `useModalLayer.ts` | CRÍTICO | [accessibility/focus-management.md](../accessibility/focus-management.md) |
| A11Y-02 errores sin ARIA | `FormField.tsx:76,105,128,159` | CRÍTICO | [accessibility/forms-and-errors.md](../accessibility/forms-and-errors.md) |
| D-01 endpoints de batch | `grep -n "batchValidate" resourceDefinitions.ts` → 0 | CRÍTICO | [integrations/backend-api.md](../integrations/backend-api.md) |
| D-02 recurso `aula` | `ventaClaseLookupApi.ts:190` | ALTO | ídem |
| G-09 orden de hooks | `ResourceListPage.tsx:107-115` + `AppShell.tsx:167` | ALTO | [routes/resource-list.md](../routes/resource-list.md#riesgo-orden-de-hooks) |
| G-11 filtrado local | `useResourceListViewModel.ts:464-479` | ALTO | [performance/rendering.md](../performance/rendering.md) |
| G-15 catch silenciosos | 5 ubicaciones | ALTO | [observability/logging.md](../observability/logging.md) |
| G-22 violación de capas | `grep -rn "from '@/features" src/shared` → 12 | MEDIO | [architecture/module-dependencies.md](../architecture/module-dependencies.md) |
| G-24 código huérfano | `grep -rn "QualityGatePage" src` | MEDIO | [reports/frontend-inventory.md](../reports/frontend-inventory.md) |

## Comandos de verificación de la matriz

```bash
# Rutas y recursos desde el código
node scripts/generate-route-inventory.mjs

# Cobertura documental (rutas, componentes, sincronía, marcadores)
node scripts/check-doc-coverage.mjs

# Endpoints del código frente a los documentados
node scripts/check-api-contract-drift.mjs

# Recuento de pruebas por suite
for f in src/__tests__/**/*.test.ts; do echo "$f: $(grep -cE '^\s*(it|test)\(' $f)"; done
```

## Métricas de trazabilidad

| Métrica | Objetivo | Real |
| --- | ---: | ---: |
| Rutas registradas documentadas | 100 % | **100 %** (10/10) |
| Journeys documentados | 100 % | **100 %** (12/12) |
| Componentes compartidos catalogados | 100 % | **100 %** (11/11) |
| Integraciones trazadas | 100 % | **100 %** |
| Módulos críticos documentados | 100 % | **100 %** |
| **Journeys con prueba automatizada** | 100 % o excepción | 🔴 **8 %** (1/12) |
| **Módulos de riesgo alto con prueba** | 100 % | 🔴 **17 %** (1/6) |
