# Variables de entorno

Todas las variables del frontend llevan el prefijo `VITE_` y **se resuelven en tiempo de build**, no en runtime. Vite las sustituye literalmente en el bundle.

> **Consecuencia de seguridad, no negociable:** cualquier valor `VITE_*` queda escrito en texto plano dentro de los archivos JavaScript publicados y es legible por cualquiera que abra la aplicación. **Nunca pongas un secreto aquí.** Ver [security/frontend-security.md](../security/frontend-security.md#variables-públicas-y-privadas).

## Inventario

| Variable | Obligatoria | Consumida en | Efecto si falta |
|---|---|---|---|
| `VITE_API_BASE_URL` | **Sí** | `src/config/env.ts:2` | `assertEnv()` lanza `Missing environment variable: VITE_API_BASE_URL` en la **primera** petición HTTP. La aplicación carga pero ninguna pantalla con datos funciona |
| `VITE_CLOUDINARY_CLOUD_NAME` | Solo para archivos | `src/shared/services/cloudinaryUpload.ts:1` | `assertCloudinaryConfig()` lanza `Falta configurar VITE_CLOUDINARY_CLOUD_NAME` al intentar subir |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Solo para archivos | `src/shared/services/cloudinaryUpload.ts:2` | Igual que la anterior, con su propio mensaje |
| `VITE_CLOUDINARY_FOLDER` | No | `src/shared/services/cloudinaryUpload.ts:3` | Vacío ⇒ Cloudinary sube a la raíz del preset |
| `VITE_CLOUDINARY_LIBRARY_ROOT_FOLDER` | No | `src/features/files/pages/FileLibraryPage.tsx` | Carpeta raíz de la biblioteca visual de archivos |

No hay otras variables `VITE_*` en el código. Verificado con `grep -rn "import.meta.env" src`.

## Detalle

### `VITE_API_BASE_URL`

```ts
// src/config/env.ts
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '',
};
```

- Se le quita la barra final, así que `https://api.example.com/` y `https://api.example.com` son equivalentes.
- **Debe apuntar al host, sin `/api`.** Todas las rutas del código ya incluyen el prefijo `/api` (por ejemplo `/api/personas/estudiante`). Duplicarlo produce `404` en todas las pantallas.
- Valor de desarrollo documentado: `http://localhost:3000`.
- Valor de producción: definido en `.env.production` (versionado en el repositorio).

### Variables de Cloudinary

El frontend sube archivos **directamente a Cloudinary desde el navegador**, sin pasar por el backend, usando un *unsigned upload preset*.

- `VITE_CLOUDINARY_UPLOAD_PRESET` es un preset **sin firma**. Por diseño es público y no constituye una credencial secreta, pero **sí permite que cualquiera suba archivos a esa cuenta**. Debe estar restringido en el panel de Cloudinary (tipos permitidos, tamaño, carpeta). Ver [integrations/file-storage.md](../integrations/file-storage.md).
- Endpoints usados: `https://api.cloudinary.com/v1_1/<cloud_name>/image/upload` y `.../auto/upload`.
- Límites aplicados en el cliente: **10 MB** para imágenes, **25 MB** para archivos genéricos (`cloudinaryUpload.ts:4-5`). Son validaciones de conveniencia; el límite real lo impone Cloudinary.

## Archivos de entorno del repositorio

| Archivo | Versionado | Uso |
|---|---|---|
| `.env.example` | ✅ Sí | Plantilla documentada. Cópiala a `.env` |
| `.env` | ❌ No (`.gitignore:17`) | Tu entorno local |
| `.env.production` | ✅ Sí | El que consume `yarn build` para el bundle publicado |
| `.env.local`, `.env.*.local` | ❌ No | Sobrescrituras locales |

> **Nota sobre `.env.production` versionado.** Es una decisión deliberada del proyecto, comentada en `.gitignore`. Es aceptable **únicamente** porque ninguna de estas variables es un secreto: la URL del API es pública y el preset de Cloudinary es unsigned por diseño. Si en el futuro se añade cualquier variable con valor sensible, este archivo debe dejar de versionarse. Ver [security/privacy.md](../security/privacy.md).

## Cómo se inyectan en cada entorno

| Entorno | Mecanismo |
|---|---|
| Desarrollo local | Archivo `.env` leído por Vite |
| Build de producción local | Archivo `.env.production` leído por `vite build` |
| Docker | `ARG` en `Dockerfile` → `ENV` → disponibles durante `yarn build`. Ver `Dockerfile:8-19` |
| Cloudflare Workers | **Ninguno en runtime.** El Worker sirve `dist/` ya compilado; las variables quedaron fijadas en el build que produjo esos archivos |

**Implicación operativa:** cambiar `VITE_API_BASE_URL` en Cloudflare **no tiene efecto**. Hay que recompilar y volver a publicar `dist/`. Ver [operations/configuration.md](../operations/configuration.md).

## Verificación

```bash
# Qué variables lee realmente el código
grep -rn "import.meta.env" src

# Qué variables define tu entorno actual (sin exponer valores completos)
sed -E 's/=(.{0,6}).*/=\1…/' .env
```

## Ausencias declaradas

No existen variables para: nivel de log, feature flags, DSN de Sentry, clave de analítica, versión de release ni entorno (`dev`/`staging`/`prod`). El frontend **no sabe en qué entorno se está ejecutando**. Ver [observability/logging.md](../observability/logging.md) y [operations/feature-flags.md](../operations/feature-flags.md).
