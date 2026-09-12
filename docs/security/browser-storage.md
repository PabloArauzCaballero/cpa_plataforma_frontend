# Almacenamiento en el navegador

## Inventario completo

Todo el estado persistente del frontend está en `localStorage`. Verificado con `grep -rn "localStorage\|sessionStorage\|document.cookie\|indexedDB" src`.

| Clave | Contenido | Escrita por | Sensibilidad | Se borra al cerrar sesión |
| --- | --- | --- | --- | --- |
| `cpa.sessionToken` | Token de sesión | `session.ts:93` | **Alta** | ✅ |
| `cpa_session_token` | Token (duplicado) | `session.ts:93` | **Alta** | ✅ |
| `cpa.userEmail` | Correo del usuario | `session.ts:94` | Media | ✅ |
| `cpa_user_email` | Correo (duplicado) | `session.ts:94` | Media | ✅ |
| `cpa.session` | Objeto completo: token, correo, nombre, tipo, roles, permisos y **`rawUser`** | `session.ts:95` | **Alta** | ✅ |
| `cpa.fileLibrary.folders.v1` | Carpetas de la biblioteca de archivos | `FileLibraryPage.tsx:146` | Baja | ❌ |
| `cpa.localDraft:<recurso>:<op>` | Borradores de formularios, **saneados** (sin contraseñas ni tokens), con TTL de 7 días | `localDraftStore.ts` | Media | ❌ |
| Progreso de tutoriales | Avance por tutorial | `LocalTutorialProgressStorage.ts:79` | Baja | ❌ |
| `AUTOSTART_KEY` | Preferencia de autoarranque de tutoriales | `tutorialPreferences.ts:18` | Nula | ❌ |

## Lo que NO se usa

| Mecanismo | Estado | Implicación |
| --- | --- | --- |
| Cookies | ❌ Ninguna | Elimina la clase clásica de CSRF; imposibilita `HttpOnly` |
| `sessionStorage` | ❌ | La sesión sobrevive al cierre del navegador |
| IndexedDB | ❌ | — |
| Cache API / Service Worker | ❌ | Sin funcionamiento sin conexión |

## Características del almacenamiento actual

| Propiedad | Estado |
| --- | --- |
| Cifrado | ❌ Todo en texto plano |
| Caducidad | ⚠️ **Solo los borradores caducan** (TTL de 7 días, comprobado en cada lectura). Sesión, carpetas y progreso no expiran nunca |
| Saneado de campos sensibles | ⚠️ **Solo en los borradores** (`sanitizeDraftPayload`) |
| Espacio de nombres por usuario | ❌ Las claves son globales por origen |
| Versionado | Parcial: `cpa.fileLibrary.folders.v1` por sufijo y los borradores por campo `version` |
| Límite de tamaño | El del navegador (~5–10 MB por origen) |
| Manejo de cuota agotada | Parcial: `LocalTutorialProgressStorage.ts:83` captura y avisa con `console.warn`. Las demás escrituras **no capturan** |

> Si el almacenamiento se llena o está deshabilitado (modo privado estricto en algunos navegadores), `saveStoredSession` lanzará una excepción **no capturada** y el inicio de sesión fallará con un error opaco.

## Duplicación de claves de sesión

El token y el correo se escriben cada uno con dos convenciones de nombre (`cpa.sessionToken` y `cpa_session_token`).

`getSessionToken()` los lee en cascada. No hay comentario ni ADR que lo explique; el patrón sugiere compatibilidad con una versión anterior del formato.

**Riesgo:** una limpieza parcial podría dejar claves inconsistentes. `clearStoredSession()` borra las cinco a la vez, así que hoy no ocurre.

## Riesgos

| # | Riesgo | Severidad | Detalle |
| --- | --- | --- | --- |
| SEC-02 | El token es legible por cualquier JavaScript de la página | HIGH | Sin equivalente a `HttpOnly`. Un XSS logra robo de sesión completo |
| SEC-14 | Datos residuales tras cerrar sesión | MEDIUM | Borradores, carpetas y progreso **no se borran**. En un equipo compartido, el siguiente usuario los ve |
| SEC-06 | `rawUser` sin filtrar | MEDIUM | Se persiste íntegro lo que devuelva el backend |
| SEC-03 | Sin caducidad | MEDIUM | La sesión sobrevive al cierre del navegador indefinidamente |

## Contenido de los borradores

`shared/services/localDraftStore.ts` es **el módulo de almacenamiento mejor diseñado del proyecto**:

| Protección | Implementación |
| --- | --- |
| Saneado recursivo | `sanitizeDraftPayload()` elimina toda clave que coincida con `password`, `contrasena`, `contraseña`, `token`, `secret`, `hash` o `session` |
| Caducidad | `DEFAULT_TTL_MS = 7 días`; `readLocalDraft()` borra el borrador expirado al leerlo |
| Recuperación ante corrupción | JSON inválido → se borra la clave y se devuelve `null` |
| Versionado | Campo `version` en cada borrador |
| Clave estructurada | `cpa.localDraft:<recurso>:create` o `:edit:<id>` |

**Las contraseñas nunca llegan a `localStorage`.** Lo que sí queda, hasta 7 días, son los datos de negocio del formulario: en un alta de estudiante, nombres, fecha de nacimiento, teléfono y correo de un menor. Ver [privacy.md](privacy.md).

## Cómo inspeccionar y limpiar

```js
// Inspeccionar (consola del navegador)
Object.keys(localStorage).filter(k => k.startsWith('cpa'))

// Limpieza completa manual
localStorage.clear()
```

En DevTools: pestaña **Application** → **Local Storage** → origen de la aplicación.

## Propuestas (no ejecutadas)

| # | Propuesta | Riesgo que mitiga |
| --- | --- | --- |
| 1 | Que `clearStoredSession()` borre también borradores, carpetas y progreso | SEC-14 |
| 2 | Filtrar `rawUser` y guardar solo los campos que la interfaz usa | SEC-06 |
| 3 | Guardar la fecha de expiración de la sesión y comprobarla en `ProtectedRoute` | SEC-03 |
| 4 | Envolver las escrituras en `try/catch` con mensaje al usuario | Cuota agotada |
| 5 | Unificar las claves duplicadas del token y el correo | Consistencia |
| 6 | Migrar el token a cookie `HttpOnly` + `Secure` + `SameSite` | SEC-02 — **requiere cambio en el backend** |

Todas modifican `src/` y necesitan autorización explícita.
