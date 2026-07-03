# v46 - Yarn lock con registry público

## Problema corregido

El `yarn.lock` generado anteriormente tenía URLs `resolved` apuntando a un registry interno del entorno de generación:

```txt
https://packages.applied-caas-gateway1.internal.api.openai.org/artifactory/api/npm/npm-public/
```

En una computadora local esas URLs no son accesibles y Yarn fallaba durante `[2/4] Fetching packages` con `ETIMEDOUT`.

## Corrección

- Se reemplazaron todas las URLs internas del `yarn.lock` por `https://registry.npmjs.org/`.
- Se fijó `.yarnrc` para usar el registry público de npm.
- Se fijó `.npmrc` con `package-lock=false` para evitar conflictos con Yarn.

## Comandos recomendados

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
yarn cache clean
yarn install --frozen-lockfile --network-timeout 900000
yarn quality
```
