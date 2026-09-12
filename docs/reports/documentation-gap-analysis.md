# Análisis de brechas

> Fase 3 del Plan Maestro. Consolida todo lo detectado durante la auditoría del commit `618e5c3`.
>
> **Regla aplicada:** toda acción marcada como «cambia producto» queda **propuesta, no ejecutada**. Este trabajo solo produjo documentación.

## Clasificación

| Nivel | Definición | Total |
| --- | --- | ---: |
| **BLOCKER** | Impide afirmar preparación productiva | **1** |
| **CRITICAL** | Riesgo alto de seguridad, acceso, pérdida de flujo o integración | **6** |
| **HIGH** | Ausencia relevante de trazabilidad o mantenibilidad | **14** |
| **MEDIUM** | Mejora necesaria, no bloqueante | **17** |
| **LOW** | Optimización editorial o de detalle | **6** |
| | **Total** | **44** |

---

## BLOCKER

| ID | Área | Elemento real | Evidencia | Brecha | Riesgo | Acción | ¿Cambia producto? | Validación | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **G-01** | Seguridad | `useLoginViewModel.ts:8-9` | `grep -rl "PabloAdmin2026" dist/` → `dist/assets/LoginPage-BzLVRSlI.js`; 30 archivos de `dist/` versionados | Credenciales de administrador embebidas, compiladas al bundle público y presentes en el historial de git | Acceso administrativo total a datos de menores, personal y contabilidad | 1) **Rotar la contraseña de `pablo.admin` ya**; 2) vaciar los valores iniciales; 3) reconstruir y republicar; 4) evaluar purga del historial | **SÍ** | `grep -r "PabloAdmin2026" src/ dist/` → 0; `yarn quality` | 🔴 **Abierto — no ejecutado** |

---

## CRITICAL

| ID | Área | Brecha | Evidencia | Riesgo | Acción propuesta | ¿Cambia producto? |
| --- | --- | --- | --- | --- | --- | --- |
| G-02 | Contratos | Los endpoints de importación por lotes (`{list}/batch/validate` y `/process`) se invocan para los 59 recursos **sin que ningún recurso los declare** ni haya evidencia de que existan en el backend | `grep -n "batchValidate\|batchProcess" resourceDefinitions.ts` → sin coincidencias | La ruta `/batch/:module/:resource` puede estar rota por completo | Verificar con backend antes de anunciar la función | No (verificación) |
| G-03 | Pruebas | `useResourceListViewModel` (774 líneas, 22 estados) sirve **59 recursos** y tiene **0 pruebas** | `src/__tests__/` | Un fallo afecta a los 59 recursos a la vez | Escribir pruebas del view model | Sí (añade archivos) |
| G-04 | Pruebas | `formValidation.ts` (341 líneas, 15 reglas + 7 recursos con reglas contables) tiene **0 pruebas** | ídem | Errores contables silenciosos | Escribir ~40 casos sobre función pura ya exportada | Sí (añade archivos) |
| G-05 | Pruebas | `session.ts` (sesión y permisos, 178 líneas) tiene **0 pruebas** | ídem | Fallo de autenticación o de permisos sin detección | Escribir ~25 casos | Sí (añade archivos) |
| G-06 | Accesibilidad | Modales **sin trampa ni restauración de foco** | `Modal.tsx`, `useModalLayer.ts`, `ConfirmDialog.tsx` | Los formularios de los 59 recursos son inutilizables con teclado o lector de pantalla | Ampliar `useModalLayer` con gestión de foco | Sí |
| G-07 | Accesibilidad | Errores de formulario **sin `aria-describedby` ni `aria-invalid`** | `FormField.tsx:76,105,128,159` | Un usuario de lector de pantalla no percibe los errores en ningún formulario | Trasladar el patrón que ya usa `LoginForm` a `FormField` | Sí |

---

## HIGH

| ID | Área | Brecha | Evidencia | Acción propuesta | ¿Cambia producto? |
| --- | --- | --- | --- | --- | --- |
| G-08 | Contratos | `/api/infraestructura/aula` se consulta pero **no existe como recurso**; en infraestructura hay `espacio` con `tipo: AULA` | `ventaClaseLookupApi.ts:190` vs. los 59 recursos | Verificar con backend | No (verificación) |
| G-09 | Arquitectura | `ResourceListContent` llama a `useResourceListViewModel` **después** de dos `return` condicionales. Solo funciona porque `AppShell.tsx:167` remonta con `key={location.pathname}` | `ResourceListPage.tsx:107-115` | Reordenar los hooks antes de los `return`; documentar la dependencia mientras tanto | Sí |
| G-10 | Estado | Filtros, búsqueda, página y orden **no viven en la URL** | Ausencia de `useSearchParams` | Migrar a `useSearchParams` | Sí |
| G-11 | Rendimiento | Al filtrar se descargan hasta **50 000 registros** (250 peticiones) y se procesan en el hilo principal | `useResourceListViewModel.ts:464-479` | Que el backend aplique los filtros; eliminar el fallback | Sí (conjunto con backend) |
| G-12 | Rendimiento | Los lookups cargan hasta **100 000 opciones por campo**, en paralelo | `useResourceListViewModel.ts:422` | Selector con búsqueda contra el servidor | Sí |
| G-13 | Rendimiento | El chunk inicial pesa **148 KiB gzip** porque `AppShell` monta `TutorialProvider` de forma síncrona | [bundle-analysis](../performance/bundle-analysis.md) | Cargar tutoriales y `driver.js` bajo demanda | Sí |
| G-14 | Observabilidad | **Ningún error sale del navegador**. Sin Sentry ni equivalente | `grep` sobre `package.json` | Integrar captura de errores, decidiendo antes qué datos se envían | Sí |
| G-15 | Observabilidad | **Cinco `catch` silenciosos** presentan estado normal ante fallo real | `useResourceListViewModel.ts:132,425`; `resourceMapper.ts:42`; `session.ts:61`; `cloudinaryUpload.ts:81` | Añadir `console.warn` en cada uno. Coste y riesgo casi nulos | Sí |
| G-16 | Calidad | **No hay linter** configurado | Sin `.eslintrc*`, `eslint.config.*`, `biome.json` | Incorporar ESLint o Biome con estrategia de adopción gradual | Sí |
| G-17 | Operación | **No hay CI/CD**. `ci:frontend` existe pero nadie lo invoca | Sin `.github/workflows/` | Pipeline que no falle por deuda preexistente | Sí (infraestructura) |
| G-18 | Operación | Nada garantiza que el `dist/` publicado corresponda al `src/` commiteado | `wrangler.jsonc` + proceso manual | Verificación de build reproducible en CI | Sí |
| G-19 | Seguridad | **Sin CSP ni cabeceras de seguridad** en ninguna capa | `nginx.conf`, `wrangler.jsonc`, `index.html` | Adoptar CSP en modo informe primero | Sí (configuración) |
| G-20 | Pruebas | **Ningún componente React se renderiza en ninguna prueba**; `testMatch` excluye `.tsx` | `jest.config.cjs` | Ampliar `testMatch` e instalar librería de renderizado | Sí |
| G-21 | Accesibilidad | Jerarquía de encabezados rota: `<h1>` fijo en `AppShell`, `<h1>` duplicado y `<main>` anidado en el perfil | `AppShell.tsx:151,166`; `UserProfilePage.tsx:49,52` | Reestructurar encabezados y landmarks | Sí |

---

## MEDIUM

| ID | Área | Brecha | Evidencia | Acción propuesta | ¿Cambia producto? |
| --- | --- | --- | --- | --- | --- |
| G-22 | Arquitectura | `shared/` importa de `features/` (12 importaciones) | `grep -rn "from '@/features" src/shared` | Mover `tutorialAnchors` a `shared/`; mover `AppShell` a `app/` | Sí |
| G-23 | Arquitectura | Ciclos a nivel de feature: `dashboard ↔ tutorials`, `resources ↔ tutorials` | Análisis de imports | Romper con módulos compartidos | Sí |
| G-24 | Código | `QualityGatePage` es **código huérfano** | `grep -rn "QualityGatePage" src` | Eliminar | Sí |
| G-25 | Código | `persistentDraftApi` y `backendDraftApi` **duplicados**: mismo endpoint, misma superficie | Línea 27 de ambos | Unificar | Sí |
| G-26 | Código | `normalizeOption()` y `renderFilterInput()` duplicados | `SearchFilterBar.tsx`, `ResourceExportModal.tsx` | Extraer a módulo común | Sí |
| G-27 | Rendimiento | FontAwesome cargado **dos veces**: CDN + npm | `index.html:14` + `package.json` | Elegir una vía | Sí |
| G-28 | Seguridad | Recurso externo (CDN) **sin SRI** | `index.html:14` | Añadir `integrity` o eliminar el CDN | Sí |
| G-29 | Seguridad | Preset de Cloudinary público; `uploadSingleFile` no valida tipo MIME | `cloudinaryUpload.ts` | Endurecer el preset **en el panel de Cloudinary** | No (configuración externa) |
| G-30 | Privacidad | `clearStoredSession()` no borra borradores, carpetas ni progreso | `session.ts:98-100` | Ampliar la limpieza | Sí |
| G-31 | Privacidad | `rawUser` persiste el objeto completo del usuario sin filtrar | `session.ts:138` | Filtrar a los campos usados | Sí |
| G-32 | UX / permisos | La barra lateral filtra por permisos; `ModuleResourcePickerPage`, `ResourceBatchPage`, `CatalogosOperativosPage` y `FileLibraryPage` **no** | Comparación de pantallas | Unificar el criterio | Sí |
| G-33 | Estado | Dos patrones de carga conviven: `isLoading` booleano y `LoadState` | `CatalogosOperativosPage.tsx:76` | Unificar | Sí |
| G-34 | Estado | `FileLibraryPage` tiene 19 `useState` en la propia página, sin hook | `FileLibraryPage.tsx:175-194` | Extraer a view model | Sí |
| G-35 | Diseño | **Sin tokens semánticos de estado**; cuatro componentes definen sus colores | `theme.css` | Añadir tokens | Sí |
| G-36 | Diseño | **Nueve puntos de ruptura** distintos, algunos separados por 20 px | `grep "@media" src/**/*.css` | Unificar en 3-4 tokens | Sí |
| G-37 | Contratos | `/api/contabilidad/archivo-transaccion/registrar` (singular) frente al recurso `archivos-transaccion` (plural) | `fileServerApi.ts:43` | Verificar con backend | No |
| G-38 | Convención | Solo `auth` y `profile` siguen la convención completa `Api`/`Endpoints`/`Mapper`/`dto` | Inventario de features | Alinear el resto | Sí |

---

## LOW

| ID | Área | Brecha | Evidencia | Acción propuesta | ¿Cambia producto? |
| --- | --- | --- | --- | --- | --- |
| G-39 | UX | La pantalla «no encontrada» no ofrece acción de volver | `router.tsx:46` | Añadir `actionLabel`/`onAction` | Sí |
| G-40 | Operación | La versión «1.1.37» del pie está **codificada literalmente**, no leída de `package.json` | `AppShell.tsx:172` | Leerla del `package.json` | Sí |
| G-41 | Contratos | El recurso `archivos-transaccion` declara `link_achivo` (con errata) **y** `link_archivo`; el primero es obligatorio | `resourceDefinitions.ts:239` | Verificar con backend | No |
| G-42 | Contratos | `venta-clase` usa el mismo endpoint para `list` y `create` | `resourceDefinitions.ts:300` | Corregir la definición | Sí |
| G-43 | Código | Endpoint literal dentro de una página, saltándose la capa de servicios | `AsistenciaMasivaPage.tsx:21` | Mover a un servicio | Sí |
| G-44 | Navegación | La ruta `/batch/:module/:resource` **no está enlazada** desde ninguna parte de la interfaz | `grep -rn "/batch/" src` | Decidir si se enlaza o se retira | Sí |

---

## Cobertura por área exigida

| Área del plan | Documentada | Documento |
| --- | --- | --- |
| Negocio y journeys | ✅ | [business/user-journeys.md](../business/user-journeys.md) |
| Rutas y navegación | ✅ 10/10 | [routes/route-catalog.md](../routes/route-catalog.md) |
| Arquitectura | ✅ | [architecture/overview.md](../architecture/overview.md) + 10 documentos |
| Componentes y diseño | ✅ | [components/catalog.md](../components/catalog.md), [design-system/tokens.md](../design-system/tokens.md) |
| Datos y estado | ✅ | [architecture/state-management.md](../architecture/state-management.md), [data-and-state/](../data-and-state/forms-and-validation.md) |
| Integraciones | ✅ | [integrations/backend-api.md](../integrations/backend-api.md) |
| Accesibilidad | ✅ | [accessibility/audit-report.md](../accessibility/audit-report.md) |
| Seguridad y privacidad | ✅ | [security/](../security/frontend-security.md) — 6 documentos |
| Rendimiento | ✅ | [performance/budgets.md](../performance/budgets.md), [bundle-analysis.md](../performance/bundle-analysis.md) |
| Pruebas | ✅ | [testing/strategy.md](../testing/strategy.md) |
| Observabilidad | ✅ | [observability/error-reporting.md](../observability/error-reporting.md) |
| Operación y despliegue | ✅ | [operations/deployment.md](../operations/deployment.md), [runbooks](../operations/runbooks/index.md) |
| Gobierno | ✅ | [governance/](../governance/documentation-policy.md) |

## Resumen ejecutivo de la brecha

**Lo que este frontend hace bien:** arquitectura coherente y deliberada, tolerancia real a los cambios del backend, mensajes de error cuidados, dependencias mínimas, `localDraftStore` bien diseñado, tutoriales sólidamente probados, reversión de despliegue trivial.

**Dónde está el problema:** la inversión en calidad no sigue al riesgo. El 76 % de las pruebas cubre tutoriales, mientras los cinco módulos que sostienen el negocio (view model, validación, sesión, cliente HTTP, mappers) suman 3 casos. A eso se añade una credencial de administrador publicada, que por sí sola bloquea la aptitud productiva.

**Con menos esfuerzo del que parece se cambia el panorama:** vaciar dos líneas del login (G-01), añadir `console.warn` a cinco `catch` (G-15), y escribir ~115 pruebas sobre funciones puras que **ya están exportadas** (G-03, G-04, G-05) sin tocar ninguna configuración.
