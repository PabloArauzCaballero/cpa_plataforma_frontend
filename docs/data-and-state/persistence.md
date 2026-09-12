# Persistencia en el navegador

## Inventario de claves

Todo en `localStorage`. **No se usan cookies, `sessionStorage` ni IndexedDB** (verificado por grep).

| Clave | Escrita por | Contenido | Caduca | Se borra al cerrar sesión |
| --- | --- | --- | --- | --- |
| `cpa.sessionToken` | `session.ts:93` | Token | ❌ | ✅ |
| `cpa_session_token` | `session.ts:93` | Token (duplicado) | ❌ | ✅ |
| `cpa.userEmail` | `session.ts:94` | Correo | ❌ | ✅ |
| `cpa_user_email` | `session.ts:94` | Correo (duplicado) | ❌ | ✅ |
| `cpa.session` | `session.ts:95` | Sesión completa + `rawUser` | ❌ | ✅ |
| `cpa.localDraft:<recurso>:<op>` | `localDraftStore.ts` | Borrador saneado | ✅ **7 días** | ❌ |
| `cpa.fileLibrary.folders.v1` | `FileLibraryPage.tsx:146` | Carpetas de la biblioteca | ❌ | ❌ |
| Progreso de tutoriales | `LocalTutorialProgressStorage.ts:79` | Avance por tutorial | ❌ | ❌ |
| Autoarranque de tutoriales | `tutorialPreferences.ts:18` | Booleano | ❌ | ❌ |

## `localDraftStore` — el módulo bien diseñado

`src/shared/services/localDraftStore.ts` es el único almacén del proyecto con protecciones reales:

| Protección | Implementación |
| --- | --- |
| **Saneado recursivo** | `sanitizeDraftPayload()` elimina toda clave que coincida con `/password/i`, `/contrasena/i`, `/contraseña/i`, `/token/i`, `/secret/i`, `/hash/i`, `/session/i`, en cualquier nivel de anidamiento |
| **Caducidad** | `DEFAULT_TTL_MS = 7 días`; cada borrador guarda `savedAt` y `expiresAt` |
| **Limpieza en lectura** | `readLocalDraft()` borra el borrador expirado en el momento de leerlo |
| **Recuperación ante corrupción** | JSON inválido → se borra la clave y se devuelve `null` |
| **Versionado** | Campo `version` |
| **Clave estructurada** | `buildResourceDraftKey(recurso, id)` → `<recurso>:create` o `<recurso>:edit:<id>` |

**Las contraseñas nunca llegan a `localStorage`.**

Este módulo es el patrón que convendría aplicar al resto: caducidad, saneado y recuperación ante datos corruptos.

## Borradores remotos

Además del almacén local existe uno remoto, sobre `/api/administracion/registro-borrador`, consumido por **dos servicios equivalentes** (`persistentDraftApi` y `backendDraftApi`) que apuntan al mismo endpoint con la misma superficie. Duplicación registrada como G-25.

## Carpetas de la biblioteca de archivos

Se guardan **solo en el navegador**:

| Consecuencia | Detalle |
| --- | --- |
| No compartida | Cada usuario y cada navegador ve su propia organización |
| No sobrevive a la limpieza del sitio | — |
| No se borra al cerrar sesión | El siguiente usuario del equipo ve las carpetas del anterior |
| Borrar una carpeta | **Solo afecta a `localStorage`**: no borra nada en Cloudinary ni en el backend |

En Cloudinary, una carpeta existe únicamente cuando contiene al menos un archivo.

## Lo que sobrevive al cierre de sesión

`clearStoredSession()` borra **exclusivamente** las 5 claves de sesión. Permanecen:

- borradores (hasta 7 días),
- carpetas de la biblioteca,
- progreso de tutoriales,
- preferencia de autoarranque.

En un equipo compartido, el siguiente usuario puede ver borradores del anterior con datos de negocio — incluidos, por ejemplo, los de un estudiante menor de edad. Registrado como [SEC-14](../security/frontend-security.md#sec-14) y G-30.

## Manejo de errores de escritura

| Módulo | Captura errores |
| --- | --- |
| `LocalTutorialProgressStorage` | ✅ `try/catch` con `console.warn` |
| `session.ts` | ❌ |
| `localDraftStore` | ❌ en la escritura; ✅ en la lectura |
| `FileLibraryPage` | ❌ |

Si el almacenamiento está lleno o deshabilitado (modo privado estricto en algunos navegadores), `saveStoredSession` lanzará una excepción **no capturada** y el inicio de sesión fallará con un error opaco.

## Hidratación

**No aplica.** La aplicación es CSR pura: no hay hidratación ni desajuste entre servidor y cliente.

El estado persistido se lee **de forma síncrona** en el primer render (`ProtectedRoute` llama a `getSessionToken()` directamente), lo que evita un parpadeo de «no autenticado».

## Recomendaciones (no ejecutadas)

| # | Recomendación | Riesgo que mitiga |
| --- | --- | --- |
| 1 | Que `clearStoredSession()` borre también las claves `cpa.localDraft:*`, carpetas y progreso | SEC-14 |
| 2 | Aplicar el patrón de `localDraftStore` (TTL + saneado) a la sesión | SEC-03 |
| 3 | Filtrar `rawUser` antes de persistirlo | SEC-06 |
| 4 | Envolver las escrituras en `try/catch` | Cuota agotada |
| 5 | Unificar las claves duplicadas de token y correo | Consistencia |
