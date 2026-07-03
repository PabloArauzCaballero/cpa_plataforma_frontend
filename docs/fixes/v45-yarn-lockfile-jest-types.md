# v45 - Corrección Yarn, lockfile y tipos Jest

## Problema corregido

En Windows aparecían dos problemas:

1. `package-lock.json found` porque el proyecto local todavía tenía un lockfile de npm.
2. `Your lockfile needs to be updated` porque `package.json` usaba versiones exactas que no coincidían con las claves del `yarn.lock`.
3. `Cannot find type definition file for 'jest'` porque el `tsconfig.json` principal incluía tipos de Jest dentro del typecheck/build de producción.

## Ajustes

- El proyecto se mantiene con Yarn Classic `1.22.22`.
- `package.json` fue alineado con las claves existentes del `yarn.lock`.
- El `tsconfig.json` principal ahora solo incluye tipos de Vite para producción.
- Se creó `tsconfig.jest.json` para pruebas.
- `jest.config.cjs` ahora usa `tsconfig.jest.json`.
- Se agregó `.npmrc` con `package-lock=false` para evitar que npm regenere lockfiles.

## Comando recomendado

```powershell
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
yarn cache clean
yarn install --frozen-lockfile
yarn quality
```
