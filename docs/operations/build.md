# Build

## Comando

```bash
yarn build     # tsc -b && vite build
```

Dos fases:

| Fase | Comando | Qué hace | Salida |
| --- | --- | --- | --- |
| 1 | `tsc -b` | Type-check incremental | `tsconfig.tsbuildinfo` (ignorado por git) |
| 2 | `vite build` | Bundle de producción | **`dist/`** |

Si la fase 1 falla, la 2 no se ejecuta: los errores de tipos **bloquean el build**.

## Resultado medido (commit `618e5c3`)

| Métrica | Valor |
| --- | ---: |
| Módulos transformados | 173 |
| Tiempo de `vite build` | 186 ms |
| Tiempo total (`tsc -b` + build) | ~2 s |
| Chunks JS | 17 |
| Archivos CSS | 12 |
| JS total | 865 255 B |
| CSS total | 123 638 B |
| Chunk inicial (gzip) | **148 469 B** |

Detalle por chunk en [../performance/bundle-analysis.md](../performance/bundle-analysis.md).

## `dist/` está versionado: implicación práctica

`yarn build` **sobrescribe `dist/`**, que está bajo control de versiones (30 archivos rastreados). Cada build ensucia el árbol con nombres de hash nuevos.

### Para verificar que compila, sin tocar `dist/`

```bash
npx tsc -b && npx vite build --outDir /tmp/dist-check --emptyOutDir
```

Es el comando que se usó para toda la medición de esta auditoría, precisamente para no alterar el trabajo de otras personas sobre el repositorio.

### Para publicar

```bash
yarn build              # ahora sí, sobre dist/
git add dist/
git commit -m "..."
npx wrangler versions upload
```

Ver [deployment.md](deployment.md) y [ADR-0009](../adr/ADR-0009-dist-versionado.md).

## Configuración

`vite.config.ts` es mínimo:

```ts
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
});
```

**No declara:** `build.target`, `build.sourcemap`, `build.rollupOptions`, `server.proxy`, ni división manual de chunks. Todo son valores por defecto de Vite 8.

| Consecuencia | Detalle |
| --- | --- |
| Sin source maps en producción | Valor por defecto `false`. Verificado: no hay `.map` en `dist/` |
| Sin proxy de desarrollo | Los problemas de CORS se resuelven en el backend, no aquí |
| División de chunks automática | Vite decide; el resultado es razonable (9 chunks de página + compartidos) |

## Variables de entorno en el build

Las `VITE_*` se **sustituyen literalmente** en el código durante el build. No existen en tiempo de ejecución.

| Entorno de build | Archivo leído |
| --- | --- |
| `yarn build` local | `.env.production` |
| `yarn dev` | `.env` |
| Docker | `ARG` → `ENV`, disponibles durante `yarn build` |

**Regla que hay que interiorizar:** cambiar una variable después del build no tiene ningún efecto. Ver [configuration.md](configuration.md).

## Puerta de calidad

```bash
yarn quality      # typecheck && test && build
yarn ci:frontend  # alias
```

| Incluye | Estado |
| --- | --- |
| Type-check | ✅ |
| Pruebas (156 casos) | ✅ |
| Build | ✅ |
| **Lint** | ❌ **No existe linter en el proyecto** |
| Cobertura | ❌ No se mide |
| Presupuesto de bundle | ❌ (añadido por este trabajo como script aparte) |

> «`yarn quality` pasa» **no significa** que el código cumpla un estándar de estilo: no hay ninguno automatizado.

## Reproducibilidad

| Requisito | Estado |
| --- | --- |
| Lockfile versionado | ✅ |
| `--frozen-lockfile` en CI y Docker | ✅ |
| Gestor fijado | ✅ `yarn@1.22.22` |
| Versión de Node fijada | ⚠️ Solo en el `Dockerfile` (`node:24-alpine`); **no hay `.nvmrc` ni campo `engines`** |
| Build determinista | ⚠️ No verificado: nadie comprueba que dos builds del mismo commit produzcan los mismos hashes |

**Recomendación:** añadir `engines.node` en `package.json` o un `.nvmrc`, para que la versión de Node no dependa de lo que cada persona tenga instalado.

## Verificación tras construir

```bash
# El index.html referencia chunks que existen
grep -o 'assets/index-[^"]*' dist/index.html
ls dist/assets/ | head

# Ningún secreto se ha compilado
grep -rn "password\|secret\|token" dist/assets/*.js | grep -v "sessionToken\|X-Session-Token" | head

# Presupuesto de tamaño
node scripts/check-bundle-budget.mjs
```

> La segunda comprobación es la que habría detectado [SEC-01](../security/frontend-security.md#sec-01) antes de publicar. Debería formar parte de cualquier pipeline futuro.
