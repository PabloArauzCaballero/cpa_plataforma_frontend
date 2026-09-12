# Configuración

## Principio que gobierna todo

> **Toda la configuración del frontend se resuelve en tiempo de build.** No existe configuración en tiempo de ejecución.

Vite sustituye literalmente las referencias a `import.meta.env.VITE_*` por sus valores durante el bundling. El artefacto resultante es específico de una configuración.

## Consecuencias, en orden de importancia

### 1. Cambiar una variable en el alojamiento no tiene efecto

Definir `VITE_API_BASE_URL` en el panel de Cloudflare, en variables del contenedor o en el sistema operativo del servidor **no cambia nada**: el valor ya está escrito dentro de los archivos JavaScript publicados.

Para cambiarla hay que **recompilar y volver a publicar**. Es la causa más frecuente de confusión operativa. Ver [runbook R-08](runbooks/index.md#r-08).

### 2. Todo valor de configuración es público

Cualquier `VITE_*` es legible por quien abra la aplicación:

```bash
curl -s https://<dominio>/assets/index-<hash>.js | grep -o 'https://[a-z0-9.-]*' | sort -u
```

**Nunca debe existir un secreto en una variable `VITE_*`.**

Agravante específico de este proyecto: como `dist/` está versionado, lo compilado queda además **en el historial de git**. Ver [ADR-0009](../adr/ADR-0009-dist-versionado.md).

### 3. Un artefacto por entorno

No se puede promover el mismo `dist/` de un entorno a otro si la configuración difiere. Cada entorno necesita su propio build.

## Inventario de configuración

### Variables de entorno

| Variable | Obligatoria | Consumida en | Público |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | Sí | `config/env.ts:2` | Sí |
| `VITE_CLOUDINARY_CLOUD_NAME` | Para archivos | `cloudinaryUpload.ts:1` | Sí |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Para archivos | `cloudinaryUpload.ts:2` | Sí |
| `VITE_CLOUDINARY_FOLDER` | No | `cloudinaryUpload.ts:3` | Sí |
| `VITE_CLOUDINARY_LIBRARY_ROOT_FOLDER` | No | `FileLibraryPage.tsx` | Sí |

Detalle en [../getting-started/environment-variables.md](../getting-started/environment-variables.md).

### Configuración fuera de variables de entorno

| Elemento | Dónde | Riesgo de desincronización |
| --- | --- | --- |
| Nombre del Worker | `wrangler.jsonc` → `name` | Si no coincide con el Worker existente, se publica en otro distinto |
| Directorio de assets | `wrangler.jsonc` → `assets.directory` | — |
| Política de caché de nginx | `docker/nginx.conf` | **No está en uso**: producción usa Cloudflare |
| Alias `@/` | `vite.config.ts`, `tsconfig.json`, `jest.config.cjs` | **Tres archivos que deben mantenerse sincronizados** |
| Versión mostrada al usuario | `AppShell.tsx:172`, **literal** | ⚠️ No se lee de `package.json`: hay que actualizar ambos |
| `CORS_ORIGINS` | **En el backend** | Debe incluir el dominio del Worker |
| Preset de subida | **En el panel de Cloudinary** | Fuera del control de versiones |

### Configuración que vive fuera del repositorio

| Elemento | Dónde | Problema |
| --- | --- | --- |
| Restricciones del preset de Cloudinary | Panel de Cloudinary | **No versionada, no auditable desde aquí.** Es la única mitigación de [SEC-04](../security/frontend-security.md#sec-04) |
| Dominio y DNS | Panel de Cloudflare | — |
| Posibles reglas de cabeceras | Panel de Cloudflare | Si se usan para añadir CSP, quedarían fuera del repositorio |

Toda configuración fuera del repositorio debe documentarse aquí para que no se pierda cuando cambie la persona que la conoce.

## Feature flags

**No existen.** Sin variables, sin mecanismo, sin servicio.

Consecuencias: no hay despliegue progresivo, ni activación por usuario, ni interruptor de emergencia. Un cambio se publica para todos a la vez, y la única marcha atrás es revertir el artefacto ([runbook R-12](runbooks/index.md#r-12)).

**Aproximación más cercana a un flag** en el código actual: `hideFromNavigation` en las definiciones de recurso, que oculta un recurso de la barra lateral sin retirarlo. Es configuración de datos, no un flag de despliegue.

Si se necesitaran flags reales, la restricción principal es que **el frontend no tiene configuración en tiempo de ejecución**: un flag por variable `VITE_*` exigiría recompilar, es decir, no sería un flag. Habría que servirlos desde el backend.

## Cómo verificar la configuración publicada

```bash
# Hash del bundle actualmente publicado
curl -s https://<dominio> | grep -o 'assets/index-[^"]*'

# Qué URL de API quedó compilada
curl -s https://<dominio>/assets/index-<hash>.js | grep -o 'https://[a-z0-9.-]*' | sort -u

# Coincidencia entre lo publicado y el repositorio
grep -o 'assets/index-[^"]*' dist/index.html
```

## Recomendaciones (no ejecutadas)

| # | Recomendación | Motivo |
| --- | --- | --- |
| 1 | Leer la versión de `package.json` en vez del literal de `AppShell` | Evita que diverjan |
| 2 | Añadir `VITE_APP_ENV` | Permite que el frontend sepa dónde se ejecuta |
| 3 | Verificar en CI que el alias `@/` coincide en los tres archivos | Evita fallos divergentes entre build, tipos y pruebas |
| 4 | Documentar y versionar la configuración del preset de Cloudinary | Hoy es conocimiento tácito |
| 5 | Declarar `engines.node` o `.nvmrc` | Reproducibilidad |
