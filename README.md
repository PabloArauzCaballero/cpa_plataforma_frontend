# CPA Plataforma Frontend

Frontend React + TypeScript + Vite para la plataforma interna del Centro de Preparación Académica CPA.

## Qué incluye

- Login privado usando `POST /api/auth/publicAuth/login`.
- Layout administrativo con header, sidebar, footer y perfil básico.
- Home con resumen de módulos.
- Navegación por todos los recursos CRUD documentados en `docs/endpoints/endpoints.md`.
- Listados genéricos con buscar, filtro, crear registro, editar e inhabilitar cuando el registro expone un campo de estado.
- Formulario especial para `contabilidad/transaccion`: la transacción y sus movimientos de cuenta se cargan juntos en un solo flujo balanceado.
- Pantalla de importación batch por recurso pensada para subir Excel/CSV con muchos registros, validar y procesar el lote.
- Consumo de API centralizado mediante `src/shared/api/httpClient.ts`.
- `X-Session-Token` agregado automáticamente cuando existe sesión local.
- Tokens visuales generados desde `docs/theme/cpa-palette.json`.

## Instalación con Yarn

Este proyecto usa Yarn Classic como gestor único de dependencias. No mezclar con `npm install`.

```bash
yarn install --frozen-lockfile
cp .env.example .env
yarn dev
```

## Docker

Imagen multi-stage: build con Node 24 + Yarn Classic, runtime con Nginx sirviendo `dist/`.

```bash
docker compose up -d --build
# http://localhost:5173
docker compose logs -f frontend
docker compose down
```

Se publica en `5173`, el mismo puerto de `yarn dev`, porque el CORS de la API solo
acepta ese origen. Servir el contenedor en otro puerto rompe el login salvo que se
agregue el nuevo origen a la whitelist del backend. Como el puerto está ocupado por
`yarn dev`, hay que apagar el dev server antes de levantar el contenedor.

Variables:

| Variable | Default | Nota |
| --- | --- | --- |
| `FRONTEND_PORT` | `5173` | Puerto publicado en el host. Debe coincidir con el CORS de la API. |
| `VITE_API_BASE_URL` | `http://localhost:3000` | Se resuelve en build; cambiarla exige `--build`. |
| `VITE_CLOUDINARY_*` | ver `.env.example` | Igual, se resuelven en build. |

Las variables `VITE_*` se compilan dentro del bundle, no se leen en runtime. Para apuntar a otra API:

```bash
VITE_API_BASE_URL=https://api.midominio.com docker compose up -d --build
```

Si la API corre en el host, `http://localhost:3000` funciona porque la petición la hace el navegador, no el contenedor. Si la API corriera en otro contenedor, usar el nombre del servicio o `host.docker.internal` (ya declarado en `extra_hosts`).

Nginx resuelve las rutas de `react-router` con fallback a `index.html`, cachea `/assets/*` con hash por un año y deja `index.html` sin caché.

## Calidad

```bash
yarn typecheck
yarn test
yarn build
yarn quality
```

## Variable de entorno

```env
VITE_API_BASE_URL=http://localhost:3000
```

El sistema documenta rutas con prefijo `/api`, por lo que la URL base no debe repetir `/api`.

### Desarrollo vs. producción

Hay dos archivos y Vite elige según el modo:

| Archivo | Lo usa | Apunta a |
| --- | --- | --- |
| `.env` | `yarn dev` y `yarn test` | `http://localhost:3000` (la API en tu máquina) |
| `.env.production` | `yarn build` | la API publicada en Render |

`.env.production` pisa a `.env` durante el build, así que no hay que editar nada
para pasar de local a publicado. Las variables `VITE_*` se resuelven en tiempo de
compilación: **cambiar la URL exige `yarn build` y publicar el `dist/` nuevo**.

`dist/` está versionado porque Cloudflare sirve ese contenido tal cual. Si se
edita `src/` sin reconstruir, lo publicado se queda con el código anterior.

En Docker mandan los `build args` del `docker-compose.yml` (variables de entorno
reales, que tienen prioridad sobre cualquier `.env*`), por eso el contenedor local
sigue apuntando a `http://localhost:3000`.

## Credenciales demo documentadas

El archivo `docs/endpoints/endpoints.md` documenta estas credenciales de seed:

```txt
pablo.admin
PabloAdmin2026!
```

## Nota técnica

El `prompt/index.md` original estaba orientado a sistema. En esta entrega se corrigió para frontend y se aplicó `prompt/programacionFrontend.md` como prompt específico del proyecto.

## Corrección aplicada al batch

La pantalla `/batch/:module/:resource` ya no usa un arreglo JSON manual. Ahora funciona como importador de Excel/CSV:

1. Selección de archivo `.xlsx`, `.xls` o `.csv`.
2. Modo de importación: crear, actualizar o crear/actualizar.
3. Validación por `POST {endpoint}/batch/validate` usando `multipart/form-data`.
4. Procesamiento por `POST {endpoint}/batch/process` usando `multipart/form-data`.
5. Resumen de filas válidas, observadas y con error.

## Transacciones contables

`contabilidad/transaccion` se trata como caso compuesto. El modal de creación/edición contiene el encabezado de la transacción y una tabla interna de movimientos Debe/Haber. El frontend exige al menos dos movimientos y balancea Debe contra Haber antes de enviar el payload.
