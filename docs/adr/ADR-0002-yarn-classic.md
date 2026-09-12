# ADR-0002: Yarn Classic como gestor de paquetes único

## Estado
**Aceptado.**

## Contexto
El proyecto necesita instalaciones reproducibles entre desarrollo, Docker y cualquier futura CI. El historial registra tres correcciones consecutivas de dependencias: `v44-yarn-dependencias-sin-conflictos`, `v45-yarn-lockfile-jest-types`, `v46-yarn-lock-registry-publico`.

## Fuerzas y restricciones
- Instalaciones deterministas obligatorias.
- El `Dockerfile` debe reproducir exactamente el árbol de dependencias local.
- La secuencia de correcciones muestra que hubo problemas reales de resolución.

## Opciones consideradas
| Opción | Ventaja | Inconveniente |
| --- | --- | --- |
| **A. Yarn Classic 1.x** | Maduro y estable; `--frozen-lockfile` fiable | Sin mantenimiento activo |
| B. Yarn Berry (2+) | Moderno; PnP opcional | La migración reescribe el lockfile; PnP complica el diagnóstico |
| C. npm | Incluido con Node | Historial de resoluciones menos predecible en este proyecto |
| D. pnpm | Rápido; eficiente en disco | Otra herramienta que instalar en cada entorno |

## Decisión
**Opción A**, fijada de forma explícita:

| Declaración | Archivo |
| --- | --- |
| `"packageManager": "yarn@1.22.22"` | `package.json` |
| `nodeLinker: node-modules` | `.yarnrc.yml` |
| Registro público | `.npmrc`, `.yarnrc` |
| `"install:ci": "yarn install --frozen-lockfile"` | `package.json` |
| `RUN yarn install --frozen-lockfile` | `Dockerfile` |

## Consecuencias positivas
- Instalación reproducible verificada: **0,42 s**, `success Already up-to-date`, sin modificar el lockfile.
- `.yarnrc.yml` con `nodeLinker: node-modules` evita el modo PnP aunque alguien invoque Yarn Berry.
- Sin autenticación de registro: cualquiera puede instalar.

## Consecuencias negativas
- Yarn 1 no recibe mantenimiento activo.
- Coexisten `.yarnrc` (Classic) y `.yarnrc.yml` (Berry): puede confundir sobre qué versión se espera.
- Usar npm o pnpm por error genera un árbol distinto al que se compila en producción.

## Riesgos
| Riesgo | Severidad |
| --- | --- |
| Alguien instala con npm y produce un `package-lock.json` divergente | 🟡 Medio: no hay verificación automatizada |
| Yarn 1 deja de funcionar con una versión futura de Node | 🟢 Bajo a corto plazo |

## Evidencia
`package.json`, `.yarnrc`, `.yarnrc.yml`, `.npmrc`, `Dockerfile`, `docs/fixes/v44`–`v46`, [línea base](../reports/baseline.md) §3.

## Plan de revisión
Revisar si Yarn 1 deja de funcionar con la versión de Node soportada, o si se adopta un monorepo (donde pnpm o Yarn Berry ofrecen ventajas claras).
