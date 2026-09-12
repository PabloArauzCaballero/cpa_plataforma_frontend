# Entornos

## Entornos existentes

| Entorno | Cómo se levanta | Origen de variables | Alojamiento |
| --- | --- | --- | --- |
| **Desarrollo** | `yarn dev` (`vite --host 0.0.0.0`) | `.env` (ignorado por git) | Servidor de desarrollo de Vite |
| **Producción** | `yarn build` + `npx wrangler versions upload` | `.env.production` (versionado) | Cloudflare Workers, Worker `cpaplataformafrontend` |
| **Contenedor** (alternativo) | `docker compose up --build` | `ARG` del `Dockerfile` | nginx 1.27-alpine |

> **No existe entorno de pruebas ni de preproducción.** No hay `.env.staging` ni un segundo Worker declarado. Los cambios van de desarrollo a producción sin paso intermedio.
>
> Es la carencia operativa más relevante: cualquier cambio de configuración de servicio (CSP, cabeceras, caché) tendría que probarse directamente en producción. Registrado en [../reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md).

## El frontend no sabe en qué entorno está

No hay `VITE_APP_ENV`, `MODE` propio ni bandera equivalente. Verificado: las únicas variables `VITE_*` son la URL del API y las cuatro de Cloudinary.

Consecuencias:

- No se pueden condicionar comportamientos por entorno (por ejemplo, nivel de registro).
- Un error capturado no puede etiquetarse con su entorno.
- Un usuario no puede saber si está en producción o en una copia.

## Configuración por entorno

| Variable | Desarrollo | Producción |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:3000` (documentado en `.env.example`) | Definida en `.env.production` |
| `VITE_CLOUDINARY_CLOUD_NAME` | Vacía por defecto | Definida |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Vacía por defecto | Definida |
| `VITE_CLOUDINARY_FOLDER` | `cpa/archivos` | `cpa/archivos` |
| `VITE_CLOUDINARY_LIBRARY_ROOT_FOLDER` | `cpa/archivos` | `cpa/archivos` |

**Todas se resuelven en tiempo de build.** Ver [configuration.md](configuration.md).

## Dependencias externas por entorno

| Dependencia | Desarrollo | Producción |
| --- | --- | --- |
| Backend | Instancia local o remota, según `.env` | Instancia de producción |
| CORS | El backend debe aceptar `localhost:5173` **y** `192.168.x.x:5173`, porque `yarn dev` escucha en todas las interfaces | Debe aceptar el dominio del Worker |
| Cloudinary | Misma cuenta que producción, salvo que se configure otra | Cuenta de producción |
| cdnjs | Igual en ambos | Igual |

> **Riesgo:** si desarrollo y producción comparten cuenta de Cloudinary, las pruebas locales suben archivos al mismo almacén que producción. No hay separación declarada.

## Compatibilidad de navegadores {#compatibilidad-de-navegadores}

**El proyecto no declara navegadores soportados.** No hay `browserslist` en `package.json` ni `build.target` en `vite.config.ts`.

Lo que se puede afirmar por el código:

| Requisito | Origen | Mínimo aproximado |
| --- | --- | --- |
| Módulos ES e `import.meta` | Vite 8 por defecto | Navegadores modernos |
| `target: ES2020` | `tsconfig.json` | Chrome 80+, Safari 13.1+, Firefox 74+ |
| `color-mix()` en CSS | `theme.css:60` (`--ring-focus`) | **Chrome 111+, Safari 16.2+, Firefox 113+** |
| `text-wrap: balance` | `global.css` | Chrome 114+, Safari 17.5+ — degrada bien |
| `URLSearchParams`, `FormData`, `fetch`, `localStorage` | Código | Universal moderno |

**El límite efectivo lo marca `color-mix()`**, y su fallo es silencioso: en navegadores anteriores **el anillo de foco no se dibuja**, degradando la accesibilidad por teclado sin ningún aviso.

No se soporta Internet Explorer. No hay polyfills.

**Recomendación:** declarar `browserslist` explícitamente y añadir un valor sólido de respaldo para `--ring-focus`. Ambos son cambios pequeños; el segundo corrige [A11Y-09](../accessibility/audit-report.md).

## Paridad entre entornos

| Aspecto | Desarrollo | Producción | ¿Paridad? |
| --- | --- | --- | --- |
| Servidor | Vite dev server | Cloudflare Workers | ❌ |
| Reescritura de SPA | Automática | Por defecto del manejador de assets | ⚠️ Distinto mecanismo |
| Política de caché | Sin caché | Por defecto de Cloudflare | ❌ |
| Compresión | Automática | Automática | ✅ |
| Minificación | ❌ | ✅ | ❌ esperado |
| `React.StrictMode` | Duplica efectos | No | ❌ esperado |
| Cabeceras de seguridad | Ninguna | Ninguna | ✅ (por ausencia en ambos) |

La divergencia relevante es la **política de caché**: la configuración cuidada que existe (`docker/nginx.conf`) **no es la que está en uso**. Ver [cache-and-cdn.md](cache-and-cdn.md).
