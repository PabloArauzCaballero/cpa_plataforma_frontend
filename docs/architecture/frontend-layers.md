# Capas del frontend

## Organización elegida

**Arquitectura por features con capa `shared` transversal.** No es atomic design, ni capas horizontales puras, ni monorepo.

```
src/
├── main.tsx              punto de entrada
├── app/                  composición raíz
├── config/               entorno
├── features/<dominio>/   una carpeta por dominio funcional
└── shared/               transversal
```

Verificado contra el árbol real; ver [reports/frontend-inventory.md](../reports/frontend-inventory.md).

## Estructura interna de una feature

Convención observada en `auth`, `profile` y `resources` (las más completas):

| Subcarpeta | Contenido | Regla |
|---|---|---|
| `pages/` | Pantallas. Un archivo `.tsx` + su `.module.css` | Componen; delegan la lógica al hook |
| `components/` | Componentes propios de la feature | No los usa otra feature |
| `hooks/` | View models: estado, efectos, orquestación | Son la capa de aplicación |
| `domain/` | Tipos, constantes y reglas puras | **Sin efectos secundarios, sin React, sin HTTP** |
| `services/` | Acceso a datos | Ver desglose abajo |

### Convención de `services/`

| Archivo | Responsabilidad | Ejemplo |
|---|---|---|
| `*Api.ts` | Hace la llamada mediante `httpClient` | `authApi.ts` |
| `*Endpoints.ts` | Centraliza las URLs literales | `authEndpoints.ts:2` |
| `*Mapper.ts` | Convierte la respuesta cruda al modelo de dominio | `authMapper.ts` |
| `dto/` | Forma cruda tal como llega del backend | `LoginResponseDto.ts` |

Cumplimiento real:

| Feature | `Api` | `Endpoints` | `Mapper` | `dto/` |
|---|:---:|:---:|:---:|:---:|
| `auth` | ✅ | ✅ | ✅ | ✅ |
| `profile` | ✅ | ✅ | ✅ | ✅ |
| `resources` | ✅ | ❌ (URLs en `resourceDefinitions`) | ✅ | ✅ parcial |
| `catalogs` | ✅ | ❌ (URLs inline) | ❌ | ❌ |
| `files` | ✅ | ❌ (URLs inline) | ❌ | ❌ (usa `domain/ServerFile.ts`) |
| `tutorials` | ✅ | ❌ (URLs inline) | ❌ | ❌ |

`auth` y `profile` siguen la convención completa; el resto la aplica parcialmente. Es **deuda de consistencia**, no un defecto funcional. Registrada como MEDIUM en [reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md).

## Inventario de features

| Feature | Páginas | Componentes | Hooks | Servicios | Dominio | Pruebas |
|---|---:|---:|---:|---:|---:|---:|
| `auth` | 1 | 1 | 1 | 4 | 1 | 0 |
| `catalogs` | 1 | 0 | 0 | 1 | 0 | 0 |
| `dashboard` | 2 | 1 | 0 | 0 | 1 | 0 |
| `files` | 1 | 0 | 0 | 1 | 1 | 0 |
| `profile` | 1 | 0 | 1 | 3 | 1 | 0 |
| `quality` | 1 | 0 | 0 | 0 | 0 | 0 |
| `resources` | 5 | 11 | 4 | 8 | 5 | 3 |
| `tutorials` | 1 | 2 | 0 | 7 | 6 | 8 |

`quality` contiene una sola página **huérfana**. `dashboard` y `catalogs` no tienen hooks: manejan el estado directamente en la página.

## Capa `shared`

| Subcarpeta | Contenido |
|---|---|
| `api/` | `httpClient.ts` — único punto de salida HTTP hacia el backend |
| `auth/` | `session.ts` — lectura/escritura de sesión y evaluación de permisos |
| `components/` | 10 familias de componentes de interfaz |
| `layouts/` | `AppShell` |
| `services/` | `cloudinaryUpload.ts`, `localDraftStore.ts` |
| `styles/` | `global.css`, `theme.css` |
| `utils/` | `humanize.ts` |
| `validation/` | `formValidation.ts` |

## Reglas de dependencia y su cumplimiento

| Regla | Estado | Evidencia |
|---|---|---|
| `domain/` no importa de `services/` ni de React | ✅ Cumplida | Sin importaciones cruzadas detectadas |
| `services/` no importa de `pages/` ni de `components/` | ✅ Cumplida | — |
| `pages/` no llama a `fetch` directamente | ⚠️ **Una excepción**: `AsistenciaMasivaPage.tsx:21` contiene el literal `/api/personas/estudiante` en la propia página | `grep -n "'/api/" src/features/resources/pages/` |
| Una feature no importa de otra feature | ⚠️ **Excepciones**: `AppShell` (shared) importa de `resources` y de `tutorials`; `ResourceHeader` (resources) importa de `tutorials` | — |
| `shared/` no importa de `features/` | ❌ **Violada sistemáticamente** | Ver [module-dependencies.md](module-dependencies.md#violación-shared--features) |

## Dónde vive cada tipo de lógica

| Tipo de lógica | Ubicación canónica | Ejemplo real |
|---|---|---|
| Reglas de negocio puras | `features/*/domain/` | `formValidation.ts` (en `shared`), `transactionFormModel.ts` |
| Orquestación de pantalla | `features/*/hooks/` | `useResourceListViewModel` |
| Acceso a datos | `features/*/services/` | `resourceApi.ts` |
| Normalización de respuesta | `services/*Mapper.ts` | `resourceMapper.ts` |
| Presentación reutilizable | `shared/components/` | `DataTable` |
| Presentación específica | `features/*/components/` | `TransactionForm` |
| Configuración | `config/env.ts` | — |
| Estado persistente | `shared/auth/session.ts`, `shared/services/localDraftStore.ts` | — |

### Excepción notable: `formValidation` en `shared`

`shared/validation/formValidation.ts` contiene reglas específicas de negocio contable (`grupo-cuenta`, `pago-tutor`, `centro-costo`, `centro-costo-mapa`, `cuenta-asignacion`, `deuda`, `pago`). Por su contenido pertenece al dominio de `resources`; está en `shared` porque también lo usan otros formularios.

Es la razón por la que `shared/validation/` importa tipos de `features/resources/domain/CrudResource` (`formValidation.ts:1`) — otra inversión de dependencia, esta vez solo de tipos, sin coste en tiempo de ejecución.

## Alias de importación

`@/` → `src/`, declarado en **tres** archivos que deben mantenerse sincronizados:

| Archivo | Clave |
|---|---|
| `vite.config.ts` | `resolve.alias` |
| `tsconfig.json` | `compilerOptions.paths` |
| `jest.config.cjs` | `moduleNameMapper` |

Desincronizarlos produce fallos distintos en build, type-check y pruebas. Registrado en [governance/change-management.md](../governance/change-management.md).

## Ubicación de las pruebas

Las pruebas **no** están junto al código: viven en `src/__tests__/`, replicando parcialmente la estructura de features.

| Elección | Consecuencia |
|---|---|
| `src/__tests__/<feature>/` | `tsconfig.json` puede excluirlas limpiamente del build |
| `testMatch: **/__tests__/**/*.test.ts` | **Solo `.ts`**: ningún archivo `.tsx` se ejecuta, luego no hay pruebas de componente |

Ver [testing/strategy.md](../testing/strategy.md).
