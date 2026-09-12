# Registro de decisiones de arquitectura (ADR)

## Aviso metodológico

Estos ADR **documentan el estado observado**, no una deliberación histórica. El repositorio no contiene ADR previos ni actas de decisión, así que:

- El **contexto** y las **fuerzas** se infieren del código, de sus comentarios y del historial de `docs/fixes/` (52 documentos de corrección).
- Las **opciones consideradas** son las alternativas razonables del ecosistema en el momento, **no** un registro de lo que el equipo debatió realmente.
- **No se inventan razonamientos.** Donde no hay evidencia, se dice explícitamente.
- El estado es `Aceptado` cuando la decisión está implementada y en uso.

## Índice

| ADR | Título | Estado | Impacto |
| --- | --- | --- | --- |
| [ADR-0001](ADR-0001-react-vite-typescript.md) | React 19 + Vite 8 + TypeScript estricto | Aceptado | Alto |
| [ADR-0002](ADR-0002-yarn-classic.md) | Yarn Classic como gestor único | Aceptado | Medio |
| [ADR-0003](ADR-0003-renderizado-csr.md) | Renderizado 100 % en cliente (SPA) | Aceptado | Alto |
| [ADR-0004](ADR-0004-crud-dirigido-por-datos.md) | CRUD genérico dirigido por datos | Aceptado | **Muy alto** |
| [ADR-0005](ADR-0005-css-modules.md) | CSS Modules + variables CSS | Aceptado | Medio |
| [ADR-0006](ADR-0006-sin-libreria-de-estado.md) | Sin librería de estado ni de servidor | Aceptado | **Alto** |
| [ADR-0007](ADR-0007-tolerancia-de-contrato.md) | Tolerancia extrema al contrato del backend | Aceptado | **Alto** |
| [ADR-0008](ADR-0008-sesion-en-localstorage.md) | Sesión en `localStorage` con cabecera propia | Aceptado | Alto |
| [ADR-0009](ADR-0009-dist-versionado.md) | `dist/` versionado en el repositorio | Aceptado | **Alto** |
| [ADR-0010](ADR-0010-subida-directa-cloudinary.md) | Subida de archivos directa a Cloudinary | Aceptado | Medio |
| [ADR-0011](ADR-0011-jest-sin-testing-library.md) | Jest sin librería de renderizado | Aceptado | **Alto** |
| [ADR-0012](ADR-0012-sin-i18n.md) | Sin internacionalización | Aceptado | Bajo |

## Decisiones sin ADR porque no hay evidencia de decisión

Se listan para que su ausencia sea explícita:

| Tema | Situación |
| --- | --- |
| **Ausencia de linter** | No hay configuración de ESLint/Biome ni rastro de que se retirara. Parece una omisión, no una decisión. Registrado como brecha, no como ADR |
| **Ausencia de CI/CD** | Ídem |
| **Duplicación de claves de sesión** (`cpa.sessionToken` y `cpa_session_token`) | Sugiere compatibilidad con un formato anterior, pero no hay comentario ni evidencia. Sin ADR |
| **Duplicación de `persistentDraftApi` / `backendDraftApi`** | Sin evidencia de que fuera intencionado. Registrado como duplicación |
| **Doble vía de FontAwesome** (CDN + npm) | Sin evidencia de decisión. Registrado como brecha |
| **Ausencia de compatibilidad de navegadores declarada** | Sin `browserslist` ni `build.target`. Sin ADR |

## Plantilla

```markdown
# ADR-XXXX: Título

## Estado
Propuesto | Aceptado | Reemplazado | Rechazado | Obsoleto

## Contexto
## Fuerzas y restricciones
## Opciones consideradas
## Decisión
## Consecuencias positivas
## Consecuencias negativas
## Riesgos
## Evidencia
## Plan de revisión
```

## Cuándo escribir un ADR nuevo

Cuando un cambio afecte a: framework o versión mayor, estrategia de renderizado, organización de carpetas, sistema de estilos, gestión de estado, cliente de API, autenticación, estrategia de pruebas, despliegue, o incorporación de una dependencia de producción.

Ver [../governance/change-management.md](../governance/change-management.md).
