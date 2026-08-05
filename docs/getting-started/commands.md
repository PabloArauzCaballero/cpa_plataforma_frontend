# Comandos

Todos los scripts declarados en `package.json`, con lo que hacen realmente y lo que **no** hacen.

## Scripts disponibles

| Comando | Ejecuta | Qué hace | Duración medida |
|---|---|---|---|
| `yarn dev` | `vite --host 0.0.0.0` | Servidor de desarrollo con HMR, escuchando en todas las interfaces de red | — |
| `yarn build` | `tsc -b && vite build` | Type-check con emisión de `.tsbuildinfo`, luego bundle de producción **en `dist/`** | ~2 s |
| `yarn preview` | `vite preview` | Sirve `dist/` ya compilado, para verificar el artefacto | — |
| `yarn typecheck` | `tsc --noEmit` | Verificación de tipos sin escribir nada | 5,65 s |
| `yarn test` | `jest --runInBand` | 12 suites, 156 pruebas, en serie | 2,43 s |
| `yarn test:watch` | `jest --watch` | Pruebas en modo observador | — |
| `yarn quality` | `yarn typecheck && yarn test && yarn build` | Puerta de calidad completa | ~11 s |
| `yarn ci:frontend` | `yarn quality` | Alias para integración continua | ~11 s |
| `yarn install:ci` | `yarn install --frozen-lockfile` | Instalación reproducible | 0,42 s |

## Qué NO existe

Declarado para evitar que se asuma su existencia:

| Comando esperado | Estado |
|---|---|
| `yarn lint` | ❌ **No existe.** El proyecto no tiene linter configurado |
| `yarn format` | ❌ No existe. No hay Prettier |
| `yarn test:e2e` | ❌ No existe. No hay pruebas E2E |
| `yarn test:coverage` | ❌ No existe. Jest puede generarla con `--coverage`, pero ningún script lo hace |
| `yarn analyze` | ❌ No existe. No hay analizador de bundle |
| `yarn storybook` | ❌ No existe |

> `yarn quality` **no incluye lint** porque no hay linter. No confundas "quality pasa" con "el código cumple un estándar de estilo": hoy no hay estándar automatizado. Ver [reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md).

## Diferencias importantes entre comandos parecidos

### `yarn typecheck` vs. el `tsc -b` de `yarn build`

| | `yarn typecheck` | `tsc -b` dentro de `yarn build` |
|---|---|---|
| Flag | `--noEmit` | modo build incremental |
| Escribe archivos | No | Sí: `tsconfig.tsbuildinfo` (ignorado por git) |
| Alcance | `include: ["src"]`, excluyendo `src/__tests__` y `*.test.*` | Idéntico |

**Las pruebas no se type-checkean con `yarn typecheck`.** `tsconfig.json` las excluye explícitamente; usan `tsconfig.jest.json` a través de ts-jest. Un error de tipos exclusivo de un archivo de prueba solo aparece al ejecutar `yarn test`.

### `yarn build` y el directorio `dist/`

`dist/` **está versionado** en este repositorio (30 archivos rastreados) porque Cloudflare sirve su contenido tal cual. Por eso:

```bash
# Verificar que compila SIN ensuciar dist/
npx tsc -b && npx vite build --outDir /tmp/dist-check --emptyOutDir
```

Usa `yarn build` sobre `dist/` únicamente cuando vayas a publicar. Ver [operations/build.md](../operations/build.md).

## Comandos de validación documental

Añadidos por el trabajo documental. No forman parte del producto y no tienen dependencias externas — solo Node.

| Comando | Qué valida |
|---|---|
| `node scripts/check-doc-links.mjs` | Que ningún enlace interno de `docs/` apunte a un archivo inexistente |
| `node scripts/check-doc-coverage.mjs` | Que las 10 rutas del router y los componentes compartidos tengan ficha documental |
| `node scripts/generate-route-inventory.mjs` | Regenera el inventario de rutas desde `src/app/router.tsx` |
| `node scripts/generate-component-inventory.mjs` | Regenera el inventario de componentes desde `src/shared/components` |
| `node scripts/check-api-contract-drift.mjs` | Compara los endpoints documentados con los literales `/api/*` del código |
| `node scripts/check-bundle-budget.mjs` | Compara el tamaño del bundle contra el presupuesto de `docs/performance/budgets.md` |

Todos son **no destructivos**: leen, comparan y devuelven código de salida. Ninguno reescribe código fuente.

## Secuencia recomendada antes de un pull request

```bash
yarn install --frozen-lockfile   # 1. árbol de dependencias reproducible
yarn quality                     # 2. tipos + pruebas + build
node scripts/check-doc-links.mjs # 3. documentación sin enlaces rotos
node scripts/check-doc-coverage.mjs
```
