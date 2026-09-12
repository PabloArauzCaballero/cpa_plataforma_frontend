# Análisis del bundle

Build de producción del commit `618e5c3`, medido en un `outDir` temporal para no alterar `dist/`.

## Composición

| Chunk | Bytes | gzip | % del JS | Cuándo se carga |
| --- | ---: | ---: | ---: | --- |
| `index-*.js` | 478 676 | 148 469 | 55,3 % | **Siempre** |
| `resourceDefinitions-*.js` | 180 531 | 30 920 | 20,9 % | Primera pantalla de recursos |
| `ResourceListPage-*.js` | 114 671 | 33 430 | 13,3 % | Listado |
| `FileLibraryPage-*.js` | 15 773 | 5 340 | 1,8 % | Biblioteca |
| `CatalogosOperativosPage-*.js` | 15 099 | 4 480 | 1,7 % | Catálogos |
| `UserProfilePage-*.js` | 11 089 | 3 470 | 1,3 % | Perfil |
| `TutorialCenterPage-*.js` | 10 905 | 3 360 | 1,3 % | Tutoriales |
| `jsx-runtime-*.js` | 8 408 | 3 200 | 1,0 % | Compartido |
| `ResourceBatchPage-*.js` | 7 400 | 2 520 | 0,9 % | Importación |
| `FormField-*.js` | 5 850 | 2 150 | 0,7 % | Formularios |
| `resourceApi-*.js` | 3 820 | 1 510 | 0,4 % | Compartido |
| `ModuleResourcePickerPage-*.js` | 3 700 | 1 500 | 0,4 % | Tablero |
| `cloudinaryUpload-*.js` | 2 580 | 830 | 0,3 % | Subidas |
| `LoginPage-*.js` | 2 390 | 1 140 | 0,3 % | Login |
| `HomePage-*.js` | 2 460 | 1 020 | 0,3 % | Inicio |
| `resourceMapper-*.js` | 1 190 | 540 | 0,1 % | Compartido |
| `humanize-*.js` | 670 | 410 | 0,1 % | Compartido |
| **Total JS** | **865 255** | — | 100 % | — |

| CSS | Bytes | gzip |
| --- | ---: | ---: |
| `ResourceListPage-*.css` | 43 210 | 7 360 |
| `index-*.css` | 23 811 | 5 670 |
| `FileLibraryPage-*.css` | 9 945 | 2 250 |
| `TutorialCenterPage-*.css` | 8 581 | 1 960 |
| `UserProfilePage-*.css` | 8 197 | 2 050 |
| `CatalogosOperativosPage-*.css` | 6 174 | 1 550 |
| `ResourceBatchPage-*.css` | 6 032 | 1 630 |
| `ModuleResourcePickerPage-*.css` | 5 831 | 1 550 |
| `FormField-*.css` | 5 383 | 1 500 |
| `HomePage-*.css` | 4 731 | 1 450 |
| `LoginPage-*.css` | 1 706 | 620 |
| **Total CSS** | **123 638** | — |

173 módulos transformados. Build en **186 ms**.

## El problema principal: el chunk inicial

**478 KiB sin comprimir / 148 KiB gzip para la carga inicial**, cuando la primera pantalla (`HomePage`) pesa 2,4 KiB.

### Qué contiene y por qué

| Contenido | Motivo de su presencia |
| --- | --- |
| React 19 + react-dom | Inevitable |
| react-router-dom 7 | Inevitable |
| `AppShell` | **No usa `lazy()`**: es el elemento del layout en `router.tsx`, así que entra en el chunk del router |
| Todo el subsistema de tutoriales | `AppShell.tsx:22` monta `<TutorialProvider>` de forma **síncrona**, arrastrando `TutorialEngine`, `TutorialRegistry`, catálogo, almacenes y `tutorialAnchors` |
| `driver.js` 1.8.0 | Importado por `DriverTutorialRenderer`, alcanzable desde el provider |
| `@fortawesome/*` (3 paquetes) | Importados por `DataTable` y `ConfirmDialog` |
| `shared/auth/session` | Necesario en `ProtectedRoute` |
| `httpClient`, `config/env` | Compartidos |

**La causa raíz está identificada:** el subsistema de tutoriales —17 de las 32 comunidades del grafo de código— se carga íntegro antes de que el usuario vea nada, aunque el 100 % de los usuarios que no abren un tutorial nunca lo necesiten.

### Propuestas cuantificadas

> Ninguna ejecutada: todas modifican `src/`.

| # | Propuesta | Ahorro estimado | Riesgo |
| --- | --- | --- | --- |
| 1 | Cargar `TutorialProvider` con `lazy()` + `Suspense` dentro de `AppShell` | **Alto**: sacaría del arranque el motor, el catálogo, los almacenes y `driver.js` | Medio: hay que preservar los anclajes, que se emiten en el render de componentes compartidos |
| 2 | Cargar `driver.js` bajo demanda, solo al iniciar un tutorial | Medio | Bajo: `DriverTutorialRenderer` ya está detrás de una interfaz (`TutorialRenderer`) |
| 3 | Eliminar el CDN de FontAwesome y usar solo los paquetes npm | Ahorra 1 petición externa y ~30 KiB de CSS de terceros | Bajo, pero hay que sustituir todos los `<i className="fa-...">` |
| 4 | Al revés: eliminar los paquetes npm y usar solo el CDN | Ahorra los 3 paquetes del bundle | Bajo: solo 5 usos de `FontAwesomeIcon` |
| 5 | Dividir `resourceDefinitions` por módulo | Reduciría el chunk de 180 KiB a lo necesario | **Alto**: `AppShell` necesita `resourceModules` completo para la barra lateral |

Las propuestas 2 y 4 son las de mejor relación beneficio/riesgo.

## `resourceDefinitions`: 180 KiB de configuración

Segundo chunk más pesado. Contiene las 59 definiciones enriquecidas por `resourceFieldCatalog.ts` (**4 803 líneas**, el archivo más grande del proyecto).

Es el **precio explícito del CRUD dirigido por datos**: la configuración de todas las pantallas viaja al navegador. A cambio, añadir un recurso no requiere escribir componentes.

Crece linealmente con cada recurso nuevo. Es la métrica a vigilar si el catálogo se amplía.

## `ResourceListPage`: 114 KiB JS + 43 KiB CSS

La pantalla más pesada, coherente con ser la más compleja: 283 líneas de página, 774 de view model, y arrastra `DataTable`, `SearchFilterBar`, `Modal`, `ConfirmDialog`, `ResourceForm`, `TransactionForm`, `ResourceExportModal` y `HelpGuideModal`.

**43 KiB de CSS para una sola ruta** es desproporcionado: es el 35 % de todo el CSS del proyecto. Sugiere estilos acumulados; sin herramienta de cobertura de CSS no es posible confirmar cuánto se usa realmente.

## Lo que está bien

| Aspecto | Evidencia |
| --- | --- |
| **Solo 7 dependencias de producción** | Superficie mínima y deliberada |
| **División por ruta efectiva** | 9 chunks de página, ninguno mayor de 16 KiB salvo `ResourceListPage` |
| **Módulos compartidos extraídos** | `FormField`, `resourceApi`, `resourceMapper`, `humanize`, `cloudinaryUpload` |
| **Cero fuentes web** | Ninguna descarga de fuente |
| **Sin source maps en producción** | Por defecto de Vite |
| **Nombres con hash** | Permite caché inmutable de 1 año (`nginx.conf`) |
| **Build muy rápido** | 186 ms |

## Herramientas ausentes

| Herramienta | Estado | Qué aportaría |
| --- | --- | --- |
| `rollup-plugin-visualizer` | ❌ | Composición exacta del chunk inicial |
| `vite-bundle-analyzer` | ❌ | Ídem |
| Cobertura de CSS | ❌ | Cuánto de los 43 KiB de `ResourceListPage.css` se usa |
| Comprobación de presupuesto en CI | ❌ | Añadida por este trabajo: `scripts/check-bundle-budget.mjs` |

Instalar un analizador es una **propuesta de cambio** (añade dependencia de desarrollo y toca `vite.config.ts`). Registrada en [../reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md).

## Reproducir la medición

```bash
npx tsc -b && npx vite build --outDir /tmp/dist-check --emptyOutDir
find /tmp/dist-check/assets -type f | xargs ls -l | awk '{print $5, $9}' | sort -rn
for f in /tmp/dist-check/assets/*.js; do echo "$(gzip -c "$f" | wc -c) $f"; done | sort -rn
```
