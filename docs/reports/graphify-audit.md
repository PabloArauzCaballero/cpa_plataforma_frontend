# Auditoría Graphify del frontend

> Fase 1 del Plan Maestro. Primera fuente de descubrimiento estructural, **contrastada** contra el repositorio real antes de escribir arquitectura definitiva.
>
> - **Commit auditado:** `618e5c3`
> - **Fecha:** 2026-08-04
> - **Artefactos:** `graphify-out/graph.json`, `graphify-out/GRAPH_REPORT.md`, `graphify-out/graph.html`, `graphify-out/.graphify_labels.json`

---

## 1. Estado previo y alcance elegido

Al iniciar **no existía** `graphify-out/` en este repositorio. Sí existen grafos de otros proyectos del usuario (`cpa_plataforma_backend`, `mantra-core-health-redesa-api`), pero ninguno de este frontend. El grafo se construyó específicamente para esta auditoría.

### Decisión de alcance: `src/` en modo AST, sin extracción semántica

| Decisión | Motivo |
|---|---|
| Raíz de escaneo = `src/`, no la raíz del repo | La raíz incluye `docs/` (78 archivos), `prompt/`, `dist/` y `node_modules`. Un grafo mezclado con prosa y artefactos compilados diluye la señal estructural que se necesita para documentar arquitectura |
| Solo extracción AST (determinista, sin LLM) | El corpus resultó ser 138 archivos de código y 10 README. La extracción AST es reproducible y verificable; la semántica sobre 10 README aporta poco y no es determinista |
| Grafo **no dirigido** para clustering | El algoritmo de comunidades de Graphify opera sobre grafo no dirigido. La direccionalidad de los imports se analizó por separado sobre `.graphify_extract.json` |

**Limitación registrada (L-05):** el grafo describe el código, no la documentación previa del repositorio. Las relaciones con `docs/` se establecieron por lectura manual.

### Corpus detectado

```
Corpus: 148 archivos · ~79 726 palabras
  code:  138 archivos (.ts .tsx)
  docs:   10 archivos (.md — README internos de cada capa)
Archivos sensibles omitidos: 0
```

---

## 2. Resultado de la extracción

| Métrica | Valor |
|---|---:|
| Nodos AST extraídos | 989 |
| Aristas AST extraídas | 2 732 |
| Nodos en el grafo construido | **988** |
| Aristas en el grafo construido | **2 522** |
| Comunidades detectadas | **32** |
| Procedencia | 99 % `EXTRACTED` · 1 % `INFERRED` (25 aristas, confianza media 0,58) · 0 % `AMBIGUOUS` |
| Coste en tokens | 0 entrada / 0 salida (extracción puramente estructural) |

### Diagnóstico de salud del grafo — advertencia registrada

El chequeo de integridad emitió:

```
GRAPH HEALTH WARNING: 135 dangling; 75 collapsed
```

| Síntoma | Recuento | Interpretación verificada |
|---|---:|---|
| `dangling_endpoint_edges` | 135 | Aristas cuyo destino **no es un nodo del corpus**: imports a paquetes externos (`react`, `react-router-dom`, `@fortawesome/*`, `driver.js`) y a archivos `.module.css`, que el AST no modela como nodos. **No es corrupción**: es la frontera del corpus |
| `undirected_same_endpoint_collapsed_edges` | 75 | Pares origen→destino con varias aristas fusionadas al construir el grafo no dirigido. Ejemplo real verificado: `shared/components/DataTable/index.ts → DataTable.tsx` tiene 3 aristas (`imports_from`, `re_exports`, en L1 y L2) que colapsan en una |
| `exact_duplicate_edges` | 38 | Duplicados exactos, subconjunto del anterior |
| `missing_endpoint_edges` | 0 | ✅ sin extremos perdidos |
| `self_loop_edges` | 0 | ✅ sin autorreferencias |
| `unverified_code_nodes` | 0 | ✅ todos los nodos tienen archivo real |

**Conclusión:** el grafo es utilizable. Las dos alertas son propiedades esperadas del modelo (frontera del corpus y barriles `index.ts`), no defectos del código ni pérdida de datos. Se registran aquí por la regla de honestidad del plan.

---

## 3. Inventario de nodos por tipo

Recuento derivado de `graph.json` y verificado contra el árbol real de `src/`.

| Tipo de nodo | Cantidad | Ubicación real |
|---|---:|---|
| Páginas (`pages/`) | 12 | 10 enrutadas + 2 compuestas embebidas |
| Layouts | 1 | `shared/layouts/AppShell` |
| Features | 8 | `auth`, `catalogs`, `dashboard`, `files`, `profile`, `quality`, `resources`, `tutorials` |
| Componentes compartidos | 10 familias | `Button`, `Card`, `ConfirmDialog`, `DataTable`, `ErrorBoundary`, `FormField` (+`SearchableSelect`), `Modal`, `PageState`, `SearchFilterBar`, `Tooltip/InfoHint` |
| Componentes de feature | 11 | 7 en `resources`, 2 en `tutorials/react`, 1 en `auth`, 1 en `dashboard` |
| Hooks (view models) | 6 | 2 en `resources`, 2 en `resources/hooks/transaction`, 1 en `auth`, 1 en `profile` |
| Contexts / Providers | 1 | `TutorialContext` + `TutorialProvider` |
| Stores globales | **0** | No existe store global |
| Servicios / clientes API | 16 | Ver [integrations/backend-api.md](../integrations/backend-api.md) |
| Definiciones de dominio | 12 | `resourceDefinitions`, `resourceFieldCatalog`, `CrudResource`, `fieldTooltips`, dominio de tutoriales |
| Utilidades | 4 | `humanize`, `formValidation`, `localDraftStore`, `exportRecords` |
| Archivos de prueba | 12 | `src/__tests__/**` |
| Configuración | 2 | `config/env.ts`, `vite-env.d.ts` |

---

## 4. Comunidades detectadas y su lectura arquitectónica

32 comunidades. Las 10 más grandes concentran el 65 % de los nodos. La cohesión se muestra cruda, sin símbolos.

| # | Etiqueta asignada | Nodos | Cohesión | Lectura |
|---|---|---:|---:|---|
| C0 | Tutoriales React y Tablero | 80 | 0,056 | El React de tutoriales está entrelazado con el tablero: `AppShell` y `ModuleResourcePickerPage` montan `TutorialLauncher` |
| C1 | Listados, Tablas y Modales | 74 | 0,055 | `ResourceListPage` + `DataTable` + `Modal` + `SearchFilterBar` + `humanize` |
| C2 | Servicios de Recursos y Biblioteca de Archivos | 72 | 0,058 | `FileLibraryPage` comparte servicios con `resources` |
| C3 | Dominio de Tutoriales y Sesión | 71 | 0,065 | `tutorialAccess` depende de `shared/auth/session` para filtrar por rol |
| C4 | Dominio y Formularios de Recursos | 68 | 0,078 | `resourceDefinitions` + `resourceFieldCatalog` + `ResourceForm` + `useResourceFormViewModel` |
| C5 | Catálogos Operativos y Venta de Clase | 63 | 0,067 | `CatalogosOperativosPage` y los lookups de venta-clase comparten servicios |
| C6 | Borradores y Transacciones | 63 | 0,071 | `TransactionForm` + `localDraftStore` + `persistentDraftApi`/`backendDraftApi` |
| C7 | **Arranque, Router y Cliente HTTP** | 44 | 0,072 | `main` → `App` → `router` → `ProtectedRoute` → `AppShell`, más `httpClient` y `config/env`. **Es el núcleo de composición** |
| C8 | Venta de Clase y Errores HTTP | 44 | 0,098 | `VentaClaseBatchPage` + `ventaClaseApi` + `HttpError` |
| C9 | Hooks de Listado y Exportación | 41 | 0,096 | `useResourceListViewModel` + `resourceApi` + `exportRecords` |
| C10 | Autenticación y Campos de Formulario | 38 | 0,092 | Todo `features/auth` + `FormField`/`SearchableSelect`/`InfoHint` |
| C11 | Motor de Tutoriales | 35 | 0,128 | `TutorialEngine` |
| C12 | Perfil de Usuario | 29 | 0,160 | Feature `profile` completa y aislada |
| C21 | Validación de Formularios | 18 | 0,281 | `shared/validation/formValidation` — muy cohesivo, sin fugas |
| C25 | Subida a Cloudinary | 12 | 0,288 | `cloudinaryUpload` + `CloudinaryUploadField` |
| C28 | **Página de Quality Gate** | 3 | 0,667 | Aislada del resto: **código huérfano**, ver §6 |
| C30 | Mock de Estilos en Pruebas | 1 | 1,0 | `styleMock.js` |
| C31 | Tipos de Entorno Vite | 1 | 1,0 | `vite-env.d.ts` |

Las 32 etiquetas completas están en `graphify-out/.graphify_labels.json`.

**Lectura de conjunto:** 17 de las 32 comunidades (53 %) pertenecen a la feature *tutoriales*. Es la subsistema más grande y más internamente estructurado del frontend, por encima de cualquier feature de negocio.

---

## 5. Nodos de alta centralidad (god nodes)

| # | Nodo | Grado | Archivo | Riesgo |
|---|---|---:|---|---|
| 1 | `TutorialEngine` | 38 | `features/tutorials/engine/TutorialEngine.ts` | Alto acoplamiento interno de tutoriales. Mitigado: 28 pruebas |
| 2 | `TutorialDefinition` | 37 | `features/tutorials/domain/TutorialDefinition.ts` | Tipo central del catálogo |
| 3 | `tutorialAnchor` | 35 | `features/tutorials/domain/tutorialAnchors.ts` | **Atraviesa la frontera de capas**: componentes de `shared/` importan de `features/tutorials`. Ver §7 |
| 4 | `TutorialProgressEntry` | 24 | `features/tutorials/domain/TutorialProgress.ts` | — |
| 5 | `TUTORIAL_ANCHORS` | 24 | `features/tutorials/domain/tutorialAnchors.ts` | Igual que #3 |
| 6 | `CrudRecord` | 22 | `features/resources/domain/CrudResource.ts` | `Record<string, unknown>` — tipo deliberadamente abierto; toda la tipificación de datos de negocio se apoya en él |
| 7 | `CrudResourceDefinition` | 21 | `features/resources/domain/CrudResource.ts` | Contrato del motor CRUD genérico |
| 8 | `TutorialProgressService` | 20 | `features/tutorials/services/TutorialProgressService.ts` | — |
| 9 | `normalizeListResponse()` | 18 | `features/resources/services/resourceMapper.ts` | **Punto único de tolerancia a formato**: absorbe 5 formas distintas de respuesta del backend. Solo 3 pruebas |
| 10 | `TutorialRegistry` | 18 | `features/tutorials/registry/TutorialRegistry.ts` | — |

**Observación clave:** 7 de los 10 nodos más conectados pertenecen a tutoriales; solo 3 al negocio (`CrudRecord`, `CrudResourceDefinition`, `normalizeListResponse`). La centralidad del grafo **no** coincide con la centralidad del valor de negocio.

---

## 6. Código huérfano y duplicación

### Huérfano confirmado

| Elemento | Evidencia | Clasificación |
|---|---|---|
| `src/features/quality/pages/QualityGatePage.tsx` (+ su CSS) | `grep -rn "QualityGatePage" src` devuelve **solo** su propia definición. No está en `router.tsx` ni importado por nadie. Comunidad C28 aislada con cohesión 1,0 | Código muerto. No entra al bundle (Vite hace tree-shaking), pero sí al repositorio |

### Duplicación relevante confirmada

| Elementos | Evidencia | Impacto |
|---|---|---|
| `services/persistentDraftApi.ts` y `services/backendDraftApi.ts` | Ambos apuntan a `/api/administracion/registro-borrador` (líneas 27 de cada uno) y exponen `get`/`post`/`patch` | Dos clientes para el mismo recurso. Riesgo de divergencia de comportamiento |
| `normalizeOption()` y `renderFilterInput()` | Definidos por duplicado en `SearchFilterBar.tsx` y en `ResourceExportModal.tsx` | Lógica de filtros duplicada entre el buscador y el modal de exportación |
| FontAwesome | Cargado por CDN en `index.html:14` **y** presente como 3 paquetes npm | Doble coste de carga; ver [performance/bundle-analysis.md](../performance/bundle-analysis.md) |

### Sin dependencias circulares detectadas

El análisis de las 2 597 aristas candidatas no reveló ciclos de import entre módulos. `self_loop_edges: 0` y no se detectaron componentes fuertemente conexos de tamaño > 1 en la capa de módulos.

---

## 7. Contraste Graphify ↔ repositorio real

Cada afirmación del grafo se verificó contra el código. Aquí las discrepancias y confirmaciones que importan.

| # | Afirmación derivada del grafo | Verificación en el repositorio | Veredicto |
|---|---|---|---|
| V-01 | El grafo agrupa `AsistenciaMasivaPage` y `VentaClaseBatchPage` dentro de `resources` | `router.tsx` **no las enruta**. `ResourceListPage.tsx:108,112` las renderiza condicionalmente según `resource.composite` | ✅ Confirmado: son pantallas sin URL propia |
| V-02 | `shared/layouts/AppShell` aparece en la comunidad de tutoriales (C0) | `AppShell.tsx:22` monta `<TutorialProvider>` | ✅ Confirmado: el provider vive en el layout, no en `App.tsx` |
| V-03 | `shared/components/*` importa de `features/tutorials` | `DataTable.tsx:2`, `Modal.tsx:4`, `AppShell.tsx:6-9` importan `tutorialAnchors` | ✅ Confirmado: **violación de la dirección de dependencia** shared→features. Ver [architecture/module-dependencies.md](../architecture/module-dependencies.md) |
| V-04 | `shared/auth/session` está en la comunidad de tutoriales (C3) | `tutorialAccess.ts` filtra tutoriales por rol usando la sesión | ✅ Confirmado |
| V-05 | Existe un nodo de test `searchableSelectMatch.test.ts` | El archivo apareció **durante** la auditoría, creado por otro agente. Existe y pasa | ✅ Confirmado; registrado en [baseline.md](baseline.md) §1 |
| V-06 | `CrudResourceDefinition` es el contrato central de datos | 59 definiciones de recurso lo instancian en `resourceDefinitions.ts` | ✅ Confirmado |
| V-07 | No hay nodo de store global | No existe Redux/Zustand/Jotai en `package.json` | ✅ Confirmado: el estado global se limita a `localStorage` + un Context |
| V-08 | El grafo no modela `.module.css` como nodos | 30 archivos `.module.css` en `src/` invisibles para el grafo | ⚠️ Punto ciego del grafo. El sistema de diseño se documentó por lectura directa |
| V-09 | El grafo no modela las llamadas HTTP como aristas hacia el backend | Las URLs son literales string, no nodos | ⚠️ Punto ciego. El mapa de integraciones se construyó por `grep` sobre literales `/api/*` |

**Ninguna afirmación del grafo resultó falsa.** Dos puntos ciegos (V-08, V-09) obligaron a complementar con análisis estático manual, reproducible con los comandos registrados en [governance/traceability-matrix.md](../governance/traceability-matrix.md).

---

## 8. Conexiones sorprendentes reportadas

Graphify señaló 5 puentes entre comunidades. Verificados:

| Puente | Relación | Verificación |
|---|---|---|
| `InMemoryProgressStorage` → `TutorialProgressStorage` | `implements` | Real: el doble de prueba implementa el puerto de producción. Buena señal de diseño |
| `Harness` → `TutorialEngine` | `references` | Real: `tutorialEngine.test.ts` define un arnés propio |
| `mapLoginResponse()` → `buildStoredSessionFromLoginResponse()` | `calls` | Real: `authMapper.ts` delega en `shared/auth/session.ts`. Es el punto donde la respuesta del backend se convierte en sesión persistida |
| `ModuleResourcePickerPage()` → `humanizeFieldLabel()` | `calls` | Real: el tablero humaniza nombres de columna con la utilidad compartida |
| `Harness` → `TutorialRenderView` | `references` | Real |

---

## 9. Preguntas que el grafo permite responder

Generadas por Graphify y conservadas como guía de exploración:

1. ¿Cómo llega el token de sesión desde el login hasta cada petición HTTP? → recorrido `LoginForm → useLoginViewModel → authApi → authMapper → session → httpClient`.
2. ¿Qué pasa cuando el backend responde con una forma de lista distinta? → `normalizeListResult` en `resourceMapper.ts`.
3. ¿Por qué `shared/` depende de `features/tutorials`? → los anclajes de tutorial se incrustan como `data-*` en componentes compartidos.

---

## 10. Artefactos generados y cómo regenerarlos

| Artefacto | Ruta | Contenido |
|---|---|---|
| Grafo interactivo | `graphify-out/graph.html` | Visualización navegable, sin servidor |
| Grafo crudo | `graphify-out/graph.json` | 988 nodos, 2 522 aristas, comunidad por nodo |
| Informe de auditoría | `graphify-out/GRAPH_REPORT.md` | Salida nativa de Graphify |
| Etiquetas de comunidad | `graphify-out/.graphify_labels.json` | Las 32 etiquetas en español |

`graphify-out/` está en `.gitignore` (línea 30) — **no se versiona**, es un artefacto local regenerable:

```bash
# Reconstruir el grafo desde cero
/graphify src
```

---

## 11. Criterio de salida de la Fase 1

| Criterio | Estado |
|---|---|
| Artefactos Graphify consultados antes de escribir arquitectura | ✅ Esta auditoría precede a `docs/architecture/**` |
| Nodos inventariados (rutas, componentes, hooks, servicios, pruebas) | ✅ §3 |
| Relaciones inventariadas (imports, composición, ciclos, huérfanos, centralidad) | ✅ §5, §6 |
| Contraste contra repositorio, router y pruebas | ✅ §7, 9 verificaciones |
| Limitaciones declaradas | ✅ §1 (L-05), §7 (V-08, V-09) |
| Advertencias de salud del grafo visibles | ✅ §2 |
