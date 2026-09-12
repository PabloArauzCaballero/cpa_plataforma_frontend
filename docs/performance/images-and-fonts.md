# Imágenes y fuentes

## Fuentes: el acierto silencioso del proyecto

```css
--font-family-base: Inter, system-ui, sans-serif;
```

**No se descarga ninguna fuente web.** No hay `@font-face`, ni enlace a Google Fonts, ni archivos `.woff2` en el repositorio.

| Consecuencia | Signo |
| --- | --- |
| **Cero peticiones de fuente** | ➕ |
| **Cero FOIT / FOUT** | ➕ Nada parpadea ni cambia de tipografía al cargar |
| **Cero CLS por fuente** | ➕ Elimina la causa más común de desplazamiento de diseño |
| **Cero dependencia de un CDN de fuentes** | ➕ |
| El aspecto varía entre sistemas | ➖ Si Inter no está instalada, se usa `system-ui` |

Es probablemente la decisión que mejor protege el CLS de esta aplicación, y no está documentada como decisión deliberada en ningún sitio del repositorio: se registra aquí.

**Implicación para regresión visual:** las capturas deben generarse siempre en el mismo entorno, porque `system-ui` se resuelve distinto en macOS, Windows y Linux. Ver [../testing/visual-regression.md](../testing/visual-regression.md).

## Iconos: el punto débil

Aquí sí hay descarga externa, y por partida doble.

| Vía | Qué carga | Peso |
| --- | --- | --- |
| **CDN** (`index.html:14`) | `cdnjs.cloudflare.com/.../font-awesome/6.5.2/css/all.min.css` **y sus archivos de fuente** | Decenas de KB de CSS + los `.woff2` que referencia |
| **npm** | `@fortawesome/fontawesome-svg-core`, `free-solid-svg-icons`, `react-fontawesome` | Dentro del chunk inicial |

**Se paga el coste de ambas.** La vía CDN cubre la mayoría de los iconos (`<i className="fa-solid fa-house">`); la vía npm cubre solo 5 usos (`<FontAwesomeIcon>`).

Además, el CDN se carga **sin `integrity` (SRI)** y sin CSP que lo acote. Ver [../security/dependencies.md](../security/dependencies.md).

### Propuestas

| Opción | Ahorro | Riesgo |
| --- | --- | --- |
| **A. Eliminar el CDN, usar solo npm** | Una petición externa menos, más las fuentes de FontAwesome | Sustituir todos los `<i className="fa-...">` |
| **B. Eliminar npm, usar solo el CDN + SRI** | Tres paquetes fuera del chunk inicial | Sustituir 5 usos de `FontAwesomeIcon` |

La opción **B** es la de menor esfuerzo (5 sustituciones frente a decenas) y libera peso del chunk inicial, que es el problema de rendimiento principal. La opción **A** elimina la dependencia externa, que es el problema de seguridad principal.

**Ambas son cambios de producto** y requieren autorización.

## Imágenes

| Imagen | Origen | Uso |
| --- | --- | --- |
| `public/logo.png` | Local | Cabecera de `AppShell`, favicon y `apple-touch-icon` |
| Imágenes de la biblioteca | Cloudinary | `FileLibraryPage`, previsualizaciones |
| Comprobantes | Cloudinary | `CloudinaryUploadField` |

**No hay ninguna otra imagen en la aplicación.** Es una interfaz de tablas y formularios: el peso visual está en el CSS, no en las imágenes.

### Lo que no se hace

| Técnica | Estado |
| --- | --- |
| `srcset` / `sizes` | ❌ |
| Formatos modernos (WebP, AVIF) | ❌ El logo es PNG |
| `loading="lazy"` | ❌ No verificado en la rejilla de archivos |
| `width`/`height` explícitos para reservar espacio | ❌ Riesgo de CLS en la biblioteca |
| Transformaciones de Cloudinary para servir miniaturas | ❌ **Se sirve la URL original** |
| Compresión en cliente antes de subir | ❌ El archivo sube tal cual, hasta 10/25 MB |

### El riesgo concreto

`FileLibraryPage` muestra una rejilla de archivos usando las **URLs originales de Cloudinary**. Una imagen de 8 MB subida por un usuario se descarga íntegra para mostrarse como miniatura.

Cloudinary ofrece transformaciones por URL (`/w_200,c_fill/`) que resolverían esto **sin cambiar nada en el backend**. Es la mejora de rendimiento de menor coste identificada en esta área.

## `logo.png`

| Aspecto | Estado |
| --- | --- |
| Usos | Cabecera, `<link rel="icon">`, `<link rel="apple-touch-icon">` |
| Formato | PNG |
| Texto alternativo | ✅ `alt="CPA Centro de Preparación Académica"` |
| Optimización | ❌ Sin verificar; podría servirse como WebP con respaldo |

Al usarse como favicon y como icono de aplicación, se descarga siempre.

## Resumen de prioridades

| # | Acción | Impacto | Coste |
| --- | --- | --- | --- |
| 1 | Servir miniaturas de Cloudinary con transformación por URL | 🟠 Alto en la biblioteca | Bajo |
| 2 | Resolver la doble vía de FontAwesome | 🟠 Alto (bundle + seguridad) | Medio |
| 3 | `width`/`height` y `loading="lazy"` en la rejilla de archivos | 🟡 Medio (CLS) | Bajo |
| 4 | Optimizar `logo.png` | 🟢 Bajo | Muy bajo |

**Lo que ya está bien y conviene no romper:** la ausencia total de fuentes web.
