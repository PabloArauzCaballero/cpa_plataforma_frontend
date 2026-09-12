# Caché y CDN

## Situación: la buena configuración no es la que está en uso

| Alojamiento | Estado | Política de caché |
| --- | --- | --- |
| **Cloudflare Workers** | ✅ **En uso** | Por defecto del manejador de assets estáticos. **Sin configuración explícita** |
| nginx (Docker) | Alternativa no desplegada | ✅ Política completa y correcta |

`wrangler.jsonc` solo declara `name`, `compatibility_date` y `assets.directory`. **No define cabeceras ni reglas de caché.**

## La política que existe (nginx)

```nginx
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    try_files $uri =404;
}
location / {
    try_files $uri $uri/ /index.html;
}
location = /index.html {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
gzip on;
gzip_types text/plain text/css application/javascript application/json image/svg+xml;
gzip_min_length 1024;
```

Es la combinación correcta y está bien razonada en los propios comentarios del archivo:

| Regla | Por qué es correcta |
| --- | --- |
| `/assets/` inmutable durante un año | Los nombres llevan hash de contenido: un cambio produce un nombre nuevo, así que nunca se sirve contenido obsoleto bajo el mismo nombre |
| `index.html` sin caché | Es el único archivo con nombre fijo; debe reflejar el despliegue nuevo de inmediato |
| `try_files` a `index.html` | Reescritura de SPA para URLs profundas |

## Lo que hay que verificar en Cloudflare

Como la política no está declarada, conviene comprobar el comportamiento real:

```bash
# ¿index.html se cachea? (NO debería)
curl -sI https://<dominio> | grep -i "cache-control\|age\|cf-cache-status"

# ¿Los assets se cachean con caducidad larga? (SÍ deberían)
curl -sI https://<dominio>/assets/index-<hash>.js | grep -i "cache-control\|age\|cf-cache-status"
```

| Resultado esperado | Si no se cumple |
| --- | --- |
| `index.html`: sin caché o TTL muy corto | Los usuarios verían la versión anterior tras publicar |
| `/assets/*`: TTL largo | Se perdería el beneficio de los hashes |

**Esta verificación no se ha realizado**: requiere acceso al dominio de producción, fuera del alcance de esta auditoría documental.

## El efecto secundario conocido: chunks desactualizados

La combinación «hash en el nombre + `index.html` sin caché» produce un caso conocido: una pestaña abierta **desde antes** de una publicación conserva el `index.html` antiguo y pedirá chunks que ya no existen.

Síntoma: `Failed to fetch dynamically imported module`.
Procedimiento: [runbook R-03](runbooks/index.md#r-03).

**No hay manejo en el código**: no se captura el fallo de `import()` para ofrecer «hay una versión nueva, recarga la página». Es una propuesta registrada.

## Compresión

| Alojamiento | Compresión |
| --- | --- |
| nginx | `gzip on`, desde 1 024 B, para texto, CSS, JS, JSON y SVG |
| Cloudflare | Automática (gzip y Brotli) |

El chunk inicial pasa de **478 676 B a 148 469 B con gzip** (69 % de reducción). Brotli mejoraría algo más.

## CDN

Cloudflare actúa como CDN de los assets propios. Además, la aplicación depende de **un CDN externo**:

| Recurso | Origen | Problema |
| --- | --- | --- |
| FontAwesome CSS | `cdnjs.cloudflare.com` | **Sin SRI**, sin CSP, y redundante con los paquetes npm |
| Imágenes de la biblioteca | `res.cloudinary.com` | URLs públicas; caché controlada por Cloudinary |

Ver [../security/dependencies.md](../security/dependencies.md).

## Invalidación de caché

| Escenario | Mecanismo |
| --- | --- |
| Publicar una versión nueva | Los hashes cambian: la invalidación es automática para los assets |
| Corregir `index.html` | Debe no estar cacheado; si lo está, hay que purgar |
| Revertir a una versión anterior | Los assets antiguos **siguen en el repositorio** (`dist/` versionado): se restauran con `git checkout`. Ver [runbook R-12](runbooks/index.md#r-12) |

**Ventaja poco habitual:** al versionarse `dist/`, revertir no depende de que el CDN conserve versiones antiguas.

## Recomendaciones (no ejecutadas)

| # | Recomendación | Motivo |
| --- | --- | --- |
| 1 | **Verificar la política real de Cloudflare** con los `curl` de arriba | Hoy es una suposición |
| 2 | Declarar la política explícitamente (archivo `_headers` o regla de transformación) | Que no dependa de valores por defecto |
| 3 | Añadir cabeceras de seguridad en la misma capa | Ver [../security/content-security-policy.md](../security/content-security-policy.md) |
| 4 | Capturar el fallo de `import()` y sugerir recargar | Resuelve R-03 en la interfaz |
| 5 | Documentar cualquier configuración hecha en el panel de Cloudflare | Hoy quedaría fuera del control de versiones |
