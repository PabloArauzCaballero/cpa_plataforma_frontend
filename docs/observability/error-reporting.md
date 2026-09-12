# Captura y reporte de errores

## Estado: no existe reporte remoto

**Ningún error del frontend sale del navegador.** Verificado: no hay Sentry, Bugsnag, Rollbar, Datadog ni ningún endpoint propio de registro.

Consecuencia operativa directa: **nadie sabe cuántos usuarios ven una pantalla de error, ni cuáles, ni por qué.** El único canal de detección es que un usuario lo reporte.

## Qué se registra hoy, y dónde

5 llamadas a `console.*` en todo `src/` (excluyendo pruebas):

| Ubicación | Nivel | Contenido | En producción |
| --- | --- | --- | --- |
| `ErrorBoundary.tsx:21` | `console.error` | `'Error no controlado en CPA Frontend'`, el error y el `componentStack` de React | ✅ Siempre |
| `LocalTutorialProgressStorage.ts:83` | `console.warn` | Fallo al guardar el progreso localmente | ✅ Siempre |
| `tutorialAnalytics.ts:50` | `console.warn` | Eventos `target-missing` y `progress-sync-failed` | ✅ **Siempre, por decisión explícita** |
| `tutorialAnalytics.ts:58` | `console.info` | Resto de eventos de tutorial | Solo con `debug: true` |
| `catalog/index.ts:43` | `console.error` / `warn` | Problemas de validación del catálogo de tutoriales | ✅ Siempre |

El criterio de `tutorialAnalytics` está comentado en el código y es el correcto:

> «Los fallos se registran siempre (también en producción): un tutorial que apunta a un elemento inexistente es un defecto que hay que poder ver, no silenciar.»

**Ese criterio no se aplica al resto del frontend.** Ver la sección de errores silenciosos.

## Lo que NO se registra

| Evento | Estado |
| --- | --- |
| Errores HTTP (4xx, 5xx) | ❌ **Nada.** `HttpError` se lanza, la pantalla muestra el mensaje y el objeto se descarta |
| `HttpError.details` (payload original del backend) | ❌ Se conserva en el objeto pero **ningún consumidor lo lee** |
| Fallos de red | ❌ |
| Promesas rechazadas sin `catch` | ❌ Sin `window.onunhandledrejection` |
| Errores de JavaScript fuera de React | ❌ Sin `window.onerror` |
| Fallos de carga de chunk (despliegue nuevo) | ❌ Sin manejo específico |
| Rutas no encontradas | ❌ |
| Fallos de lookup | ❌ Silenciados con `catch { return [] }` |
| Respuestas con forma no reconocida | ❌ Se convierten en lista vacía |

## Los cinco fallos silenciosos

| # | Ubicación | Comportamiento | Lo que ve el usuario |
| --- | --- | --- | --- |
| 1 | `useResourceListViewModel.ts:425` | `catch { return [field.name, []] }` | Un select **vacío**, sin explicación |
| 2 | `resourceMapper.ts:42` | Forma desconocida → `{ rows: [] }` | **«Sin registros»**, indistinguible de una tabla vacía real |
| 3 | `useResourceListViewModel.ts:132` | `catch { return record }` | Edita una transacción **sin sus movimientos** |
| 4 | `session.ts:61` | `catch { return null }` | Redirige a login sin decir por qué |
| 5 | `cloudinaryUpload.ts:81` | Respuesta no JSON → `body = null` | Mensaje genérico |

Los tres primeros **presentan un estado normal ante un fallo real**. Son los más peligrosos porque no generan ni siquiera una queja del usuario: el usuario concluye que no hay datos.

**Corrección de coste mínimo y alto valor:** añadir `console.warn` en cada uno de esos cinco `catch`. No cambia comportamiento, no altera la interfaz, y hace visible en la consola lo que hoy es invisible. Sigue siendo un cambio de `src/` y requiere autorización, pero es de riesgo prácticamente nulo.

## `ErrorBoundary`

| Aspecto | Estado |
| --- | --- |
| Cobertura | Toda la aplicación (por encima del `RouterProvider`) |
| Granularidad | ❌ Único: un fallo en una tabla tumba la aplicación entera |
| Recuperación | Recargar o ir al inicio con `window.location` |
| Reinicio automático | ❌ `hasError` nunca vuelve a `false` |
| Errores asíncronos | ❌ Los límites de React no los capturan |
| Identificador de incidente | ❌ El usuario no puede aportar un código |
| Envío remoto | ❌ Solo consola |

Detalle en [../architecture/error-boundaries.md](../architecture/error-boundaries.md).

## Contexto que faltaría para diagnosticar

Si se instrumentara un servicio de errores, hoy no habría con qué enriquecer el evento:

| Contexto | Disponible |
| --- | --- |
| Versión de release | ❌ Solo el literal «Versión 1.1.37» codificado en `AppShell.tsx:172`, no leído de `package.json` |
| Entorno (`dev`/`staging`/`prod`) | ❌ El frontend **no sabe en qué entorno se ejecuta** |
| Identificador de usuario | ⚠️ Disponible en `localStorage`, pero **enviarlo sería tratar datos personales** |
| Identificador de sesión | ⚠️ Ídem; además es el token: **nunca debe enviarse a un tercero** |
| Ruta actual | ✅ Obtenible del router |
| Identificador de correlación con el backend | ❌ No existe |

La ausencia de un identificador de correlación es la carencia más limitante: **no hay forma de unir un error del navegador con la petición correspondiente en el backend**.

## Propuestas (no ejecutadas)

| # | Propuesta | Coste | Valor |
| --- | --- | --- | --- |
| 1 | `console.warn` en los cinco `catch` silenciosos | Muy bajo | **Alto**: hace visible lo invisible |
| 2 | Registrar `HttpError.details` antes de descartarlo | Muy bajo | Alto |
| 3 | Distinguir «lista vacía» de «respuesta no reconocida» en `normalizeListResult` | Bajo | Alto |
| 4 | Leer la versión de `package.json` en vez del literal del pie | Bajo | Medio |
| 5 | Añadir `VITE_APP_ENV` para que el frontend sepa su entorno | Bajo | Medio |
| 6 | Cabecera `X-Request-Id` generada en `httpClient` y devuelta por el backend | Medio | **Alto**: habilita la correlación |
| 7 | Integrar un servicio de captura de errores | Medio | Alto — decidir antes qué datos se envían, por privacidad |
| 8 | `window.onerror` y `onunhandledrejection` | Bajo | Medio |

Todas modifican `src/` o la configuración y requieren autorización. Las propuestas 1, 2 y 3 son de riesgo prácticamente nulo y deberían priorizarse.

## Cómo diagnosticar hoy

Sin telemetría, el procedimiento real es:

1. Pedir al usuario que abra la consola del navegador (F12 → Consola).
2. Buscar `Error no controlado en CPA Frontend`.
3. Pedir captura de la consola **y** de la pestaña Red, filtrando por peticiones fallidas.
4. Contrastar con los registros del backend por hora y usuario.

Procedimientos completos en [../operations/runbooks/index.md](../operations/runbooks/index.md).
