# Instalación local

Procedimiento verificado en el commit `618e5c3`. Los tiempos son los medidos en la línea base.

## 1. Clonar e instalar

```bash
git clone <url-del-repositorio> cpa_plataforma_frontend
cd cpa_plataforma_frontend
yarn install --frozen-lockfile
```

`--frozen-lockfile` es obligatorio: garantiza que no se reescriba `yarn.lock`. Si el comando falla porque el lockfile no coincide con `package.json`, **no lo regeneres**; eso indica que alguien cambió dependencias sin actualizar el lockfile y debe corregirse en su propio pull request.

Tiempo medido con caché caliente: **0,42 s** (`success Already up-to-date.`).

## 2. Configurar el entorno

```bash
cp .env.example .env
```

Edita `.env` y ajusta al menos `VITE_API_BASE_URL`. El detalle de cada variable está en [environment-variables.md](environment-variables.md).

> `.env` está en `.gitignore` (línea 17). `.env.example` y `.env.production` **sí** se versionan, deliberadamente: el primero documenta las variables, el segundo es el que consume `yarn build` para el bundle publicado.

## 3. Levantar el servidor de desarrollo

```bash
yarn dev
```

Ejecuta `vite --host 0.0.0.0`, es decir, escucha en todas las interfaces (no solo `localhost`). Esto permite abrir la aplicación desde un teléfono en la misma red, que es como se probaron los ajustes móviles del proyecto.

Vite imprime la URL local y la de red. La aplicación se sirve en `/` y el router captura todas las rutas.

## 4. Verificar que funciona

```bash
yarn quality   # typecheck + test + build, en ese orden
```

Salida esperada en un árbol limpio:

```
$ tsc --noEmit          → sin errores            (~5,7 s)
$ jest --runInBand      → 12 suites, 156 pruebas (~2,4 s)
$ tsc -b && vite build  → 173 módulos            (~0,2 s de bundling)
```

## 5. Iniciar sesión

Necesitas el backend levantado. La pantalla `/login` envía `POST /api/auth/publicAuth/login` con `{ email, password }` y guarda la sesión en `localStorage`.

> ⚠️ **El formulario de login viene con credenciales precargadas en el código** (`src/features/auth/hooks/useLoginViewModel.ts:8-9`). Es un defecto de seguridad conocido y bloqueante, no una comodidad de desarrollo aprobada. Ver [security/frontend-security.md](../security/frontend-security.md#sec-01).

## Advertencia sobre `dist/`

Este proyecto **versiona el directorio `dist/`**: Cloudflare sirve el contenido compilado tal cual desde el repositorio (`wrangler.jsonc` declara `assets.directory: "./dist"`).

Consecuencia práctica al desarrollar:

- `yarn build` **sobrescribe** `dist/` y produce archivos con hash nuevo, ensuciando el árbol de git.
- Si solo quieres verificar que el build compila sin tocar `dist/`, usa un directorio de salida temporal:

```bash
npx tsc -b && npx vite build --outDir /tmp/dist-check --emptyOutDir
```

- Publica `dist/` en un commit **solo** cuando vayas a desplegar. Ver [operations/build.md](../operations/build.md).

## Alternativa: Docker

```bash
docker compose up --build
```

`Dockerfile` compila con `node:24-alpine` y sirve con `nginx:1.27-alpine` usando `docker/nginx.conf`. Las variables `VITE_*` se resuelven **en tiempo de build**, no en runtime: pásalas como `ARG`/`build-args`, no como variables de entorno del contenedor.

## Estructura del código

```
src/
├── main.tsx                # punto de entrada: monta <App/> en #root
├── app/
│   ├── App.tsx             # ErrorBoundary + RouterProvider
│   ├── router.tsx          # las 10 rutas, todas con lazy + Suspense
│   └── ProtectedRoute.tsx  # guarda de navegación por token
├── config/env.ts           # lectura y aserción de VITE_API_BASE_URL
├── features/               # una carpeta por dominio funcional
│   └── <feature>/
│       ├── components/     # componentes propios de la feature
│       ├── domain/         # tipos y reglas puras
│       ├── hooks/          # view models (estado + efectos)
│       ├── pages/          # pantallas
│       └── services/       # clientes HTTP y mappers
└── shared/                 # transversal: api, auth, components, layouts, styles, utils, validation
```

La convención de la capa `services` es: `*Api.ts` hace la llamada, `*Mapper.ts` normaliza la respuesta, `*Endpoints.ts` centraliza las URLs, `dto/` describe la forma cruda del backend. Ver [architecture/frontend-layers.md](../architecture/frontend-layers.md).

## Alias de importación

`@/` apunta a `src/`. Está declarado dos veces y ambas deben mantenerse sincronizadas:

- `vite.config.ts` → `resolve.alias` (para el bundle)
- `tsconfig.json` → `compilerOptions.paths` (para el type-check)
- `jest.config.cjs` → `moduleNameMapper` (para las pruebas)
