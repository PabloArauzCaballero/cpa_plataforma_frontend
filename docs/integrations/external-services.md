# Servicios externos

Inventario completo de todo lo que el frontend consume fuera del backend propio.

## Servicios activos

| Servicio | Uso | Punto de contacto | Autenticación | Criticidad |
| --- | --- | --- | --- | --- |
| **Cloudinary** | Almacenamiento de archivos | `api.cloudinary.com/v1_1/{cloud}/…` | Unsigned preset público | Alta: sin él no se suben archivos |
| **cdnjs.cloudflare.com** | Hoja de estilos de FontAwesome 6.5.2 | `index.html:14` | Ninguna | Media: sin él faltan la mayoría de los iconos |
| **Cloudflare Workers** | Alojamiento de la propia aplicación | `wrangler.jsonc` | — | Total |

Cloudinary tiene documento propio: [file-storage.md](file-storage.md).

## cdnjs.cloudflare.com

```html
<!-- index.html:14 -->
<link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
```

### Problemas verificados

| # | Problema | Detalle |
| --- | --- | --- |
| 1 | **Sin `integrity` (SRI)** | Si el CDN sirve contenido alterado, el navegador lo aplica sin verificar |
| 2 | **Sin `crossorigin`** | Complementa a SRI; tampoco está |
| 3 | **Sin CSP que lo acote** | Ni nginx ni el Worker definen `Content-Security-Policy`. Un CSS malicioso podría exfiltrar datos vía selectores de atributo y `background-image` |
| 4 | **Redundante** | Los paquetes npm `@fortawesome/fontawesome-svg-core`, `free-solid-svg-icons` y `react-fontawesome` ya están instalados y en el bundle |
| 5 | **Punto único de fallo** | Con el CDN bloqueado (red corporativa, bloqueador, caída) desaparecen los iconos de navegación, cabecera y estados |

### Doble vía de iconos

| Vía | Sintaxis | Cobertura |
| --- | --- | --- |
| CDN (CSS) | `<i className="fa-solid fa-house" />` | La mayoría: barra lateral, cabecera, estados, tarjetas |
| npm (SVG) | `<FontAwesomeIcon icon={faPen} />` | 5 usos, en `DataTable` y poco más |

Se paga el coste de ambas. Unificar en una sola es una **propuesta de cambio de producto** registrada en [reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md).

## Cloudflare Workers

| Aspecto | Valor |
| --- | --- |
| Nombre del Worker | `cpaplataformafrontend` |
| Modo | Assets estáticos (`assets.directory: "./dist"`), **sin código de Worker** |
| Fecha de compatibilidad | `2026-08-04` |
| Publicación | `npx wrangler versions upload`, manual |
| Cabeceras de seguridad | ❌ Ninguna configurada |

El dominio del Worker debe coincidir con lo que el backend acepta en `CORS_ORIGINS`; así está documentado en los comentarios de `wrangler.jsonc`.

## Dependencias npm de terceros en tiempo de ejecución

| Paquete | Versión | Función | Riesgo |
| --- | --- | --- | --- |
| `react`, `react-dom` | 19.2.7 | UI | Bajo |
| `react-router-dom` | 7.18.0 | Enrutado | Bajo |
| `driver.js` | 1.8.0 (fijada) | Recorridos guiados. **Manipula el DOM y el foco** | Medio: controla la interacción durante un tutorial |
| `@fortawesome/*` | ^7.x | Iconos SVG | Bajo |

Solo 7 dependencias de producción. Superficie pequeña y deliberada.

`driver.js` está fijada sin `^`, a diferencia del resto: decisión razonable para una librería que toma el control de la interacción.

Ver [security/dependencies.md](../security/dependencies.md).

## Servicios que NO se usan

Declarado explícitamente. Verificado con `grep` sobre `src/` y `package.json`.

| Categoría | Estado |
| --- | --- |
| Analítica de producto (GA, Plausible, Mixpanel, PostHog) | ❌ Ninguna |
| Captura de errores (Sentry, Bugsnag, Rollbar) | ❌ Ninguna |
| Monitorización de rendimiento (web-vitals, Datadog RUM) | ❌ Ninguna |
| Mapas (Google Maps, Mapbox, Leaflet) | ❌ Ninguno, pese a existir campos `latitud`/`longitud` en 3 recursos |
| Chat o soporte (Intercom, Zendesk) | ❌ |
| Pagos (Stripe, PayPal) | ❌ |
| Identidad externa (Auth0, Firebase Auth, SSO) | ❌ |
| Notificaciones push | ❌ |
| Fuentes web (Google Fonts) | ❌ Se usa `Inter, system-ui, sans-serif` **sin descargar ninguna fuente**. Si Inter no está instalada, cae a la del sistema |
| Feature flags (LaunchDarkly, Unleash) | ❌ |

## Comunicación en tiempo real

**No existe.** Verificado:

```bash
grep -rn "WebSocket\|EventSource\|socket.io\|pusher" src   # sin resultados
grep -rn "setInterval" src                                  # sin uso para datos
```

- No hay WebSockets, SSE ni polling.
- La actualización de datos es siempre **bajo demanda**: al montar la pantalla o al pulsar recargar.
- Dos usuarios editando el mismo registro no se enteran el uno del otro. No hay bloqueo optimista ni control de versión en el frontend (algunos recursos tienen columna `version_registro`, pero el frontend la trata como una columna de auditoría más).

Es coherente con un panel administrativo de uso interno y baja concurrencia. Registrado como decisión, no como brecha.

## Analítica

**No existe telemetría de producto.** El único subsistema con eventos es tutoriales, y **no envía nada fuera del navegador**: guarda los últimos 50 eventos en memoria y escribe en consola. Ver [observability/analytics-events.md](../observability/analytics-events.md).

## Impacto de la caída de cada servicio

| Servicio caído | Efecto |
| --- | --- |
| Backend | La aplicación carga; `/` y `/modulos/:module` funcionan; toda pantalla con datos muestra error con «Reintentar» |
| Cloudinary | No se pueden subir archivos. Las URLs ya guardadas dejan de mostrar la imagen |
| cdnjs | Faltan la mayoría de los iconos; la aplicación sigue siendo usable |
| Cloudflare Workers | La aplicación no carga en absoluto |

Procedimientos en [operations/runbooks/index.md](../operations/runbooks/index.md).
