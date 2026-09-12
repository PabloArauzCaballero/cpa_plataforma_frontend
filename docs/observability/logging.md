# Registro (logging)

## Estado

**Todo el registro del frontend ocurre en la consola del navegador. Nada se envía a ningún servicio.**

## Inventario completo

5 llamadas a `console.*` en `src/`, excluyendo pruebas:

| # | Ubicación | Nivel | Contenido | Activo en producción |
| --- | --- | --- | --- | --- |
| 1 | `ErrorBoundary.tsx:21` | `error` | `'Error no controlado en CPA Frontend'`, el error y el `componentStack` | ✅ |
| 2 | `LocalTutorialProgressStorage.ts:83` | `warn` | Fallo al guardar el progreso localmente | ✅ |
| 3 | `tutorialAnalytics.ts:50` | `warn` | `target-missing` y `progress-sync-failed` | ✅ |
| 4 | `tutorialAnalytics.ts:58` | `info` | Resto de eventos de tutorial | Solo con `debug: true` |
| 5 | `catalog/index.ts:43` | `error` / `warn` | Problemas de validación del catálogo de tutoriales | ✅ |

Cinco puntos de registro para 23 475 líneas de código.

## No hay niveles de registro

| Elemento | Estado |
| --- | --- |
| Variable de nivel (`VITE_LOG_LEVEL`) | ❌ |
| Envoltorio propio de logger | ❌ Se usa `console` directamente |
| Distinción desarrollo/producción | ⚠️ Solo en `tutorialAnalytics`, mediante la opción `debug` |
| El frontend sabe en qué entorno se ejecuta | ❌ **No.** No hay `VITE_APP_ENV` ni equivalente |

La consecuencia práctica es que no se puede subir el nivel de detalle en producción para diagnosticar un incidente concreto, ni bajarlo para reducir ruido.

## El criterio correcto, aplicado en un solo sitio

`tutorialAnalytics.ts` documenta y aplica el criterio adecuado:

> «Los fallos se registran siempre (también en producción): un tutorial que apunta a un elemento inexistente es un defecto que hay que poder ver, no silenciar.»

**Ese criterio no se aplica al resto del frontend.** Hay cinco `catch` que silencian fallos reales sin dejar rastro:

| Ubicación | Qué silencia |
| --- | --- |
| `useResourceListViewModel.ts:425` | Fallo de carga de opciones de un select |
| `resourceMapper.ts:42` | Respuesta con forma no reconocida |
| `useResourceListViewModel.ts:132` | Fallo al enriquecer una transacción con sus movimientos |
| `session.ts:61` | Sesión almacenada corrupta |
| `cloudinaryUpload.ts:81` | Respuesta no JSON de Cloudinary |

**La corrección de mayor relación valor/coste de todo el trabajo de observabilidad** es añadir un `console.warn` en cada uno de esos cinco puntos: no cambia comportamiento, no altera la interfaz y hace visible lo que hoy es invisible.

## Datos personales en los registros

| Fuente | Riesgo |
| --- | --- |
| `ErrorBoundary` | ⚠️ El `componentStack` puede incluir props renderizadas; si el error ocurre al pintar un registro, podrían aparecer datos del registro |
| `tutorialAnalytics` | ✅ Solo identificadores de tutorial y paso |
| El resto | ✅ Sin datos |

Como todo permanece en la consola del usuario y nada se transmite, el riesgo de fuga externa es **nulo hoy**. Cambiaría por completo si se integrara un servicio remoto: en ese momento habría que decidir explícitamente qué se envía. Ver [../security/privacy.md](../security/privacy.md).

## Lo que no se registra y debería

| Evento | Estado |
| --- | --- |
| Errores HTTP con su código y ruta | ❌ `HttpError.details` se descarta sin leerse |
| Fallos de red | ❌ |
| Promesas rechazadas sin `catch` | ❌ Sin `window.onunhandledrejection` |
| Errores fuera de React | ❌ Sin `window.onerror` |
| Fallos de carga de chunk | ❌ |
| Rutas no encontradas | ❌ |

## Propuestas (no ejecutadas)

| # | Propuesta | Coste | Valor |
| --- | --- | --- | --- |
| 1 | `console.warn` en los cinco `catch` silenciosos | Muy bajo | **Alto** |
| 2 | Registrar `HttpError.details` antes de descartarlo | Muy bajo | Alto |
| 3 | Añadir `VITE_APP_ENV` para que el frontend conozca su entorno | Bajo | Medio |
| 4 | Envoltorio `logger` con niveles, en vez de `console` directo | Bajo | Medio |
| 5 | `window.onerror` y `onunhandledrejection` | Bajo | Medio |
| 6 | Envío remoto de errores | Medio | Alto — decidir antes qué datos se envían |

Todas modifican `src/` y requieren autorización.
