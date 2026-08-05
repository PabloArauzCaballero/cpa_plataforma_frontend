# Ruta `/login`

| | |
|---|---|
| **Patrón** | `/login` |
| **Componente** | `LoginPage` → `LoginForm` |
| **Archivos** | `src/features/auth/pages/LoginPage.tsx`, `src/features/auth/components/LoginForm.tsx`, `src/features/auth/hooks/useLoginViewModel.ts` |
| **Layout** | Ninguno. Es la única ruta fuera de `AppShell` |
| **Carga** | `lazy()` + `Suspense` |

## Propósito de negocio

Único punto de entrada a la plataforma. Convierte credenciales en una sesión persistida en el navegador que habilita todas las demás rutas.

## Acceso y permisos

- **Pública.** No cuelga de `ProtectedRoute`.
- No comprueba si ya existe una sesión: un usuario autenticado que navegue a `/login` verá el formulario de nuevo.
- No hay registro, recuperación de contraseña ni segundo factor. El pie del formulario deriva a administración: *«¿Problemas para entrar? Contacta con administración del centro.»*

## Flujo de usuario

1. El usuario abre `/login` (directamente o redirigido por `ProtectedRoute`).
2. Escribe usuario/correo y contraseña. Puede alternar la visibilidad de la contraseña.
3. Al enviar, `useLoginViewModel.submit()`:
   - valida que ninguno esté vacío → si lo están, `Ingresa usuario o correo y contraseña.`
   - `POST /api/auth/publicAuth/login`
   - mapea la respuesta con `mapLoginResponse` → `buildStoredSessionFromLoginResponse`
   - persiste con `saveStoredSession()` en `localStorage`
   - navega a `/` con `replace: true`
4. Si algo falla, muestra el mensaje del backend ya saneado por `httpClient`.

**No hay redirección de retorno.** Aunque hayas intentado abrir `/perfil`, tras iniciar sesión acabas en `/`.

## Estados de interfaz

| Estado | Representación | Evidencia |
|---|---|---|
| Inactivo | Formulario con botón «Iniciar sesión» | `LoginForm.tsx:110-113` |
| Enviando | Botón deshabilitado, spinner, texto «Validando…»; ambos inputs deshabilitados | `LoginForm.tsx:104-108,56,74` |
| Error de validación local | `<p role="alert">` con icono | `LoginForm.tsx:96-101` |
| Error del servidor | Mismo bloque, con el mensaje saneado | `useLoginViewModel.ts:26` |
| Éxito | Navegación inmediata a `/`; no hay pantalla de confirmación | `useLoginViewModel.ts:24` |
| Carga de la ruta | `PageState` «Cargando pantalla» | `router.tsx:19` |

## Contratos de datos

**`POST /api/auth/publicAuth/login`**

Petición:
```json
{ "email": "<usuario o correo>", "password": "<texto plano>" }
```

Respuesta: el mapper es **deliberadamente tolerante**. `buildStoredSessionFromLoginResponse` (`shared/auth/session.ts:102-140`) acepta el token en cualquiera de estas posiciones, en orden:

`data.sessionToken` → `data.token` → `data.session_token` → `root.sessionToken` → `root.token` → `root.session_token` → `data.idSesion` / `data.id_sesion` / `data.sessionId` / `data.session_id`

Si ninguna existe lanza: `La respuesta de login no incluye data.sessionToken ni data.id_sesion.`

Del usuario extrae, también con múltiples alias: `nombres`/`nombre`/`firstName`, `apellidos`/`apellido`/`lastName`, `email`, `nombre_usuario`/`usuario`/`username`, `tipo_usuario`/`rol`/`role`, `es_super_usuario`/`esSuperUsuario`, `roles`, `permisos`/`permissions`.

Roles y permisos se normalizan a `MAYÚSCULAS_CON_GUION_BAJO` (`normalizeToken`, `session.ts:31-33`).

Detalle completo: [integrations/authentication.md](../integrations/authentication.md).

## Componentes

| Componente | Origen | Nota |
|---|---|---|
| `LoginForm` | feature `auth` | Monta sus propios inputs en lugar de usar `FormField`. La decisión está justificada en el comentario de `LoginForm.tsx:6-15`: necesita mostrar/ocultar contraseña, icono dentro del control y `autoComplete`, ranuras que `FormField` no expone y que no compensa añadir para los cientos de campos que sí lo usan |
| `Button` | `shared` | `type="submit"`, `fullWidth` |

## Analítica

**Ninguna.** No se emite ningún evento en el inicio de sesión: ni intento, ni éxito, ni fallo. No hay servicio de analítica en el proyecto. Ver [observability/analytics-events.md](../observability/analytics-events.md).

## Accesibilidad

Es la pantalla mejor tratada del proyecto:

| Aspecto | Estado |
|---|---|
| Etiquetas asociadas | ✅ `<label htmlFor>` en ambos campos |
| Errores anunciados | ✅ `role="alert"` + `aria-describedby` apuntando al mensaje |
| Estado inválido | ✅ `aria-invalid` en ambos inputs cuando hay error |
| Autocompletado | ✅ `autoComplete="username"` / `"current-password"` |
| Botón de revelar | ✅ `aria-label` dinámico + `aria-pressed` |
| Iconos decorativos | ✅ todos con `aria-hidden="true"` |
| Validación nativa | ✅ `noValidate` en el `<form>`: la validación la controla la aplicación y el mensaje se pinta en el DOM, no en el globo del navegador |
| Spinner | ✅ `aria-hidden`; el cambio de texto del botón comunica el estado |

Sin hallazgos abiertos. Ver [accessibility/audit-report.md](../accessibility/audit-report.md).

## Pruebas

**Ninguna.** No hay pruebas de `LoginForm`, `useLoginViewModel`, `authApi`, `authMapper` ni `buildStoredSessionFromLoginResponse`.

Es especialmente notable porque `buildStoredSessionFromLoginResponse` contiene 12 rutas de resolución de alias y una excepción: es lógica pura, fácil de probar y hoy sin cobertura. Registrado como HIGH en [reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md).

## Notas operativas

> ### 🔴 SEC-01 · Credenciales embebidas
>
> ```ts
> // src/features/auth/hooks/useLoginViewModel.ts:8-9
> const [email, setEmail] = useState('pablo.admin');
> const [password, setPassword] = useState('PabloAdmin2026!');
> ```
>
> El formulario **precarga credenciales reales de administrador**. Estas cadenas:
>
> - se compilan al bundle: verificado en `dist/assets/LoginPage-BzLVRSlI.js`;
> - viajan en el repositorio, porque `dist/` está versionado (30 archivos rastreados);
> - se sirven públicamente desde el Worker de Cloudflare declarado en `wrangler.jsonc`;
> - están en el historial de git desde los commits `da9f782` y `6489ed5`.
>
> Cualquier persona que abra la aplicación y mire el código fuente obtiene un usuario administrador válido.
>
> **Clasificación: BLOCKER.** Impide declarar aptitud productiva.
> **Este trabajo documental no lo corrige**: es un cambio de producto y requiere autorización. La propuesta con impacto, pasos y plan de reversión está en [security/frontend-security.md](../security/frontend-security.md#propuesta-de-corrección-sec-01).
> **Rotar la contraseña de `pablo.admin` no es opcional ni posterior:** la credencial ya está publicada.

Otras notas:

- Tras un `401` en cualquier petición, `httpClient` borra la sesión (`httpClient.ts:104`) y la siguiente navegación protegida cae aquí.
- La contraseña viaja en el cuerpo de un `POST` sobre HTTPS. El backend la almacena hasheada (documentado en el `helpText` del recurso `usuario`).
- No hay bloqueo por intentos fallidos ni CAPTCHA en el frontend; si existe, es responsabilidad del backend.
