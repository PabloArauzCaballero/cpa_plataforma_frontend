# Política documental

## Principios

1. **Toda afirmación técnica se rastrea** a un archivo y línea, a un comando ejecutado o a una prueba. Si no hay traza, es un defecto documental.
2. **La documentación describe el producto real**, no el deseado. Lo que falta se declara como ausencia, no se omite.
3. **Se versiona junto al código**, en el mismo pull request.
4. **Cero relleno.** Un documento que no aporta decisión no se escribe.
5. **Las limitaciones se declaran.** Lo que no se pudo verificar se dice explícitamente.
6. **Separación estricta**: comportamiento actual, decisión, riesgo y recomendación son secciones distintas.

## Idioma y estilo

| Regla | Detalle |
| --- | --- |
| Idioma | Español técnico, coherente con la interfaz del producto |
| Terminología | La misma que ve el usuario: «recurso», «módulo», «inhabilitar», «parte de clases pasadas» |
| Referencias a código | Ruta y línea: `src/shared/api/httpClient.ts:104` |
| Cifras | Siempre medidas, nunca estimadas sin decirlo |
| Comandos | Reproducibles y no destructivos |
| Marcadores provisionales | ❌ **Prohibidos**: TODO, TBD, FIXME, «pendiente». Verificado por `scripts/check-doc-coverage.mjs` |

## Seguridad del contenido documental

**Nunca incluir:** tokens, contraseñas, claves, datos personales reales, hosts internos ni capturas con datos de producción.

Cuando hay que citar un valor, se enmascara:

```bash
sed -E 's/=(.{0,6}).*/=\1…/' .env
```

**Excepción justificada:** la credencial de [SEC-01](../security/frontend-security.md#sec-01) se nombra en la documentación porque **ya es pública** (está en el bundle publicado y en el historial de git) y ocultarla impediría dimensionar el incidente. La contraseña completa **no se reproduce**; se referencia el patrón para poder verificar la corrección.

## Adaptaciones respecto a la estructura del plan maestro

El plan permite adaptar la estructura al repositorio real y prohíbe crear carpetas vacías o contenido de relleno. Adaptaciones aplicadas y su motivo:

| Adaptación | Motivo |
| --- | --- |
| **Una ficha por ruta** (`docs/routes/<ruta>.md`) con las 10 secciones exigidas como encabezados, en vez de 10 archivos por ruta | 10 rutas × 10 archivos = 100 documentos, la mayoría de dos párrafos. Sería relleno |
| **Los 12 runbooks en un solo `runbooks/index.md`** con anclas | Se consultan como una guía única durante un incidente; 12 archivos de 30 líneas fragmentan sin aportar |
| **`design-system/tokens.md` cubre color, tipografía, espaciado, sombras y movimiento** | Los tokens son 45 y están en un único archivo (`theme.css`): separarlos en 8 documentos duplicaría contexto |
| **`components/catalog.md` incluye props y eventos** | Las props se documentan junto al componente, no en un documento aparte |
| **Sin `integrations/realtime.md` ni `integrations/analytics.md`** | **No existen esas integraciones.** Su ausencia se declara explícitamente en [integrations/external-services.md](../integrations/external-services.md) |
| **Sin `architecture/diagrams/`** | Los diagramas están embebidos como Mermaid en cada documento y el modelo C4 en `structurizr/workspace.dsl` |
| **Sin Storybook** | No existe en el proyecto; incorporarlo es una propuesta de cambio, no una acción documental |

## Herramientas

| Herramienta | Estado | Nota |
| --- | --- | --- |
| Markdown + Mermaid | ✅ En uso | Se renderiza en GitHub y en MkDocs |
| Structurizr DSL | ✅ `structurizr/workspace.dsl` | **`structurizr-cli` no está instalado**: el archivo es la fuente del modelo, y los Mermaid su representación navegable |
| MkDocs Material | ⚠️ `mkdocs.yml` preparado | **MkDocs no está instalado.** El portal es opcional: la documentación se lee igual en el repositorio |
| Scripts de validación | ✅ 6 scripts en Node puro, sin dependencias | Ver abajo |

**Decisión deliberada:** ningún elemento del portal documental añade dependencias a `package.json` ni participa en el build del producto. La documentación no puede romper la aplicación.

## Validación automática

| Script | Qué verifica | Destructivo |
| --- | --- | --- |
| `check-doc-links.mjs` | Que todo enlace interno y toda ancla resuelvan | No |
| `check-doc-coverage.mjs` | Rutas documentadas, componentes catalogados, `APP_ROUTE_PATTERNS` sincronizado, sin marcadores provisionales | No |
| `check-api-contract-drift.mjs` | Que los endpoints del código estén documentados y viceversa | No |
| `check-bundle-budget.mjs` | Tamaño del bundle contra el presupuesto | No |
| `generate-route-inventory.mjs` | Regenera el inventario desde el código | No |
| `generate-component-inventory.mjs` | Regenera el catálogo de componentes | No |

Todos leen y comparan; **ninguno reescribe código fuente**.

```bash
node scripts/check-doc-links.mjs
node scripts/check-doc-coverage.mjs
node scripts/check-api-contract-drift.mjs
node scripts/check-bundle-budget.mjs
```

## Ciclo de vida de un documento

| Evento | Acción |
| --- | --- |
| Cambio en el código que afecta a lo documentado | Actualizar en el mismo PR — ver [change-management.md](change-management.md) |
| Un hallazgo se corrige | Actualizar su estado en [reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md) |
| Una decisión se reemplaza | Marcar el ADR como `Reemplazado` y enlazar el nuevo |
| Un documento queda obsoleto | Eliminarlo, no dejarlo vacío |

## Datos de trazabilidad de esta documentación

| Dato | Valor |
| --- | --- |
| Commit auditado | `618e5c3` |
| Fecha de evidencia | 2026-08-04 |
| Método | Lectura de código, ejecución de comandos, análisis Graphify (988 nodos) |
| Verificado en navegador | ❌ No: sin backend ni entorno disponible |
| Herramientas de a11y y rendimiento | ❌ No disponibles en el proyecto |
