# Ruta `/perfil`

| | |
|---|---|
| **Patrón** | `/perfil` (fija) |
| **Componente** | `UserProfilePage` |
| **Archivos** | `src/features/profile/pages/UserProfilePage.tsx` (214 líneas), `hooks/useUserProfileViewModel.ts`, `services/profileApi.ts`, `services/profileMapper.ts` (167 líneas) |
| **Layout** | `AppShell` |

## Propósito de negocio

Mostrar quién está autenticado: nombre, correo, estado, rol principal, roles y permisos activos. Es la pantalla de referencia para responder «¿por qué no veo tal opción?».

## Acceso y permisos

- Protegida por `ProtectedRoute`.
- No exige permisos: siempre muestra los datos de la **propia** sesión.
- Enlace fijo en la cabecera de `AppShell` (`AppShell.tsx:156-159`), mostrando el nombre del usuario.
- **Solo lectura.** No permite editar el perfil ni cambiar la contraseña.

## Flujo de usuario

1. Se abre desde la cabecera.
2. `useUserProfileViewModel` llama a `GET /api/auth/privateAuth/me`.
3. `profileMapper` normaliza la respuesta a `UserProfile`.
4. Se pintan avatar (iniciales calculadas), datos, insignias de estado y listas de roles y permisos.
5. El botón «Actualizar datos» vuelve a consultar (`reload`).

## Estados de interfaz

| Estado | Representación | Línea |
|---|---|---|
| Cargando | `PageState` «Cargando perfil» | 33-35 |
| Error o perfil ausente | `PageState` «No se pudo cargar el perfil» + «Reintentar» | 37-46 |
| Contenido | Tarjetas de resumen y detalle | 48+ |

Los valores ausentes se muestran como `No disponible` mediante el helper `display()` (líneas 15-17), nunca como campo vacío.

## Contratos de datos

**`GET /api/auth/privateAuth/me`** (`profileEndpoints.ts:2`)

Autenticación: cabecera `X-Session-Token` añadida por `httpClient`.

`profileMapper.ts` (167 líneas) normaliza la respuesta a `UserProfile`, con la misma estrategia tolerante que el mapper de login: acepta múltiples alias por campo. El historial del proyecto registra dos iteraciones sobre este mapper (`docs/fixes/v35-perfil-mapper-respuesta-backend.md`, `v16-perfil-real-sin-mock.md`), señal de que el contrato real fue cambiando.

### Reglas de presentación

| Regla | Implementación |
|---|---|
| Rol principal | `esSuperUsuario` → «Super usuario»; si no, el primer rol; si no, `tipoUsuario`; si no, «Sin rol principal disponible» (líneas 23-27) |
| Iniciales del avatar | Dos primeras iniciales del nombre completo; si solo hay una palabra, los dos primeros caracteres; fallback `CP` (líneas 8-13) |
| Booleanos | «Sí» / «No» (líneas 19-21) |

## Componentes

`PageState` y marcado propio. No reutiliza `Card` ni `DataTable`: define su propio `styles.card`.

Es un caso de **duplicación de patrón visual**: existe un componente `Card` compartido que esta pantalla no usa. Registrado en [components/catalog.md](../components/catalog.md#card).

## Analítica

Ninguna.

## Accesibilidad

| Aspecto | Estado |
|---|---|
| Encabezado | ✅ **Única pantalla con `<h1>` propio** (`<h1>PERFIL DE USUARIO</h1>`, línea 52). Convive con el `<h1>` «Gestión CPA» de `AppShell`: **dos `<h1>` en la misma página**, lo que rompe la jerarquía |
| Landmark | ✅ Usa `<main>` (línea 49) — pero `AppShell` ya envuelve el contenido en `<main>` (`AppShell.tsx:166`): **`<main>` anidado**, no válido |
| Iconos | ✅ `aria-hidden="true"` |
| Avatar | ⚠️ Las iniciales son texto, correcto; sin `aria-label` que aclare que representan al usuario |
| Botón de recarga | ⚠️ Texto visible «Actualizar datos», correcto; sin anuncio del resultado |
| Insignias | ⚠️ Estado por color + texto; el texto está presente |

Dos hallazgos estructurales (`<h1>` duplicado y `<main>` anidado) registrados en [accessibility/audit-report.md](../accessibility/audit-report.md#a11y-03).

## Pruebas

Ninguna. `profileMapper` (167 líneas de normalización con alias) es lógica pura sin cobertura.

## Notas operativas

- Los permisos que muestra esta pantalla son los que el backend devolvió en `/me`, que **pueden diferir** de los que se guardaron en `localStorage` durante el login. `userHasAnyPermission` lee los de `localStorage`, no los de esta pantalla.
- Si `/me` devuelve `401`, `httpClient` limpia la sesión y la siguiente navegación protegida redirige a `/login`.
- No hay cierre de sesión desde esta pantalla; el botón está en la cabecera de `AppShell` (`logout()`, línea 49), que hace `clearStoredSession()` + `navigate('/login')`. **No notifica al backend**: no se invoca ningún endpoint de logout, así que la sesión sigue viva en el servidor hasta que expire. Ver [security/session-and-tokens.md](../security/session-and-tokens.md).
