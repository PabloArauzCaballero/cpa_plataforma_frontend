# Prerrequisitos

Verificado contra `package.json`, `.yarnrc`, `.yarnrc.yml`, `.npmrc` y `Dockerfile` del commit `618e5c3`.

## Herramientas obligatorias

| Herramienta | Versión requerida | Cómo se declara | Verificación |
|---|---|---|---|
| Node.js | 24.x | `Dockerfile` usa `node:24-alpine`; la línea base se ejecutó con `v24.18.0` | `node -v` |
| Yarn | **Classic 1.22.22** | `"packageManager": "yarn@1.22.22"` en `package.json` | `yarn -v` |
| Git | cualquiera reciente | — | `git --version` |

> **No uses npm ni pnpm.** El proyecto tiene `yarn.lock` (Yarn Classic) y no tiene `package-lock.json` ni `pnpm-lock.yaml`. Instalar con otro gestor genera un árbol de dependencias distinto al que se compila en producción.
>
> **No uses Yarn Berry (2+).** `.yarnrc.yml` declara `nodeLinker: node-modules`, pero `packageManager` fija Yarn Classic. Berry reescribiría el lockfile.

## Configuración de registro

`.npmrc` y `.yarnrc` fijan el registro público de npm. No hace falta autenticación ni token privado para instalar.

## Herramientas opcionales

| Herramienta | Para qué | Necesaria |
|---|---|---|
| Docker + Docker Compose | Levantar la imagen nginx de `Dockerfile` / `docker-compose.yml` | No, solo para probar el empaquetado |
| Wrangler (`npx wrangler`) | Publicar en Cloudflare Workers | Solo para desplegar |
| Python 3 + `graphifyy` | Regenerar el grafo de código de `graphify-out/` | No, artefacto de análisis |

## Lo que NO necesitas

| Herramienta | Motivo |
|---|---|
| ESLint / Prettier / Biome | **El proyecto no tiene linter configurado.** No hay `.eslintrc*`, `eslint.config.*` ni `biome.json` |
| Playwright / Cypress | No hay pruebas E2E |
| Storybook | No existe catálogo de componentes |
| Base de datos local | El frontend no habla con ninguna base de datos; consume la API del backend |

## Backend

El frontend **no funciona sin el backend**. Necesitas una instancia de la API de CPA alcanzable en `VITE_API_BASE_URL`.

- Para desarrollo local, el valor por defecto documentado en `.env.example` es `http://localhost:3000`.
- El backend debe aceptar el origen del frontend en su configuración `CORS_ORIGINS`. Ver [security/frontend-security.md](../security/frontend-security.md#cors-desde-la-perspectiva-del-cliente).
- Autenticación: el frontend envía la cabecera `X-Session-Token`. Ver [integrations/authentication.md](../integrations/authentication.md).

## Navegadores soportados

`tsconfig.json` compila a **ES2020** y Vite 8 aplica sus valores por defecto (no hay `build.target` ni `browserslist` declarados en el repositorio). En la práctica eso significa navegadores con soporte de módulos ES y `import.meta`.

El código usa además:

| API | Uso | Soporte |
|---|---|---|
| `color-mix()` en CSS | `--ring-focus` en `theme.css:60` | Chrome 111+, Safari 16.2+, Firefox 113+ |
| `createPortal` | `Modal.tsx` | React, universal |
| `URLSearchParams`, `FormData`, `fetch` | `httpClient`, `resourceApi` | universal moderno |
| `localStorage` | sesión, borradores, preferencias | universal |

**No hay polyfills ni transpilación a navegadores antiguos.** No se soporta Internet Explorer. Ver [operations/environments.md](../operations/environments.md#compatibilidad-de-navegadores).
