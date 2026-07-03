# v44 - Ajuste Yarn y dependencias sin conflicto

## Objetivo

El proyecto se ajustó para trabajar con Yarn Classic, evitando mezcla de administradores de paquetes y conflictos por lockfiles duplicados.

## Cambios

- Se eliminó `package-lock.json` del proyecto final.
- Se conserva `yarn.lock` como único lockfile fuente.
- Se agregó `packageManager: yarn@1.22.22` en `package.json`.
- Los scripts de calidad ahora usan `yarn` internamente:
  - `yarn quality`
  - `yarn ci:frontend`
- Se agregó `yarn install --frozen-lockfile` como flujo recomendado de instalación.
- Las dependencias de build (`vite`, `typescript`, `@vitejs/plugin-react`) quedaron en `devDependencies`.
- Se fijaron versiones exactas para reducir diferencias entre instalaciones.

## Comandos recomendados

```bash
yarn install --frozen-lockfile
yarn typecheck
yarn test
yarn build
yarn quality
```

## Regla de mantenimiento

No mezclar `npm install` con Yarn en este repositorio. Si se usa Yarn, el repositorio debe mantenerse con `yarn.lock` como único lockfile.
