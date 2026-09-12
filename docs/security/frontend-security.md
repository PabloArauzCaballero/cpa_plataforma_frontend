# Seguridad del frontend

> Auditoría sobre el commit `618e5c3`. Cada hallazgo indica archivo, línea y método de verificación.

## Resumen de hallazgos

| ID | Hallazgo | Severidad | Estado |
| --- | --- | --- | --- |
| [SEC-01](#sec-01) | Credenciales de administrador embebidas en el código y publicadas en el bundle | 🔴 **BLOCKER** | Abierto |
| [SEC-02](#sec-02) | Token de sesión en `localStorage`, accesible por cualquier JavaScript | 🟠 HIGH | Abierto, mitigable |
| [SEC-04](#sec-04) | Preset de subida de Cloudinary público y sin restricción verificada | 🟠 HIGH | Abierto |
| [SEC-11](#sec-11) | Sin Content-Security-Policy en ninguna capa de servicio | 🟠 HIGH | Abierto |
| [SEC-12](#sec-12) | Recurso externo (FontAwesome CDN) sin SRI | 🟡 MEDIUM | Abierto |
| [SEC-03](#sec-03) | Sesión sin caducidad ni renovación en el cliente | 🟡 MEDIUM | Abierto |
| [SEC-05](#sec-05) | Cerrar sesión no invalida el token en el servidor | 🟡 MEDIUM | Abierto |
| [SEC-06](#sec-06) | `rawUser` persiste el objeto completo del usuario sin filtrar | 🟡 MEDIUM | Abierto |
| [SEC-07](#sec-07) | Autorización de interfaz en modo permisivo | 🟡 MEDIUM | Aceptado por diseño |
| [SEC-13](#sec-13) | Source maps: comportamiento no declarado | 🟢 LOW | Verificado, sin riesgo |
| [SEC-14](#sec-14) | Datos residuales en `localStorage` tras cerrar sesión | 🟡 MEDIUM | Abierto |

---

## SEC-01 · Credenciales de administrador embebidas {#sec-01}

**Severidad: BLOCKER. Impide declarar aptitud productiva.**

### Evidencia

```ts
// src/features/auth/hooks/useLoginViewModel.ts:8-9
const [email, setEmail] = useState('pablo.admin');
const [password, setPassword] = useState('PabloAdmin2026!');
```

Verificación reproducible:

```bash
grep -n "useState('pablo" src/features/auth/hooks/useLoginViewModel.ts
grep -rl "PabloAdmin2026" dist/                # → dist/assets/LoginPage-*.js
git log --oneline -- src/features/auth/hooks/useLoginViewModel.ts
git ls-files dist | wc -l                      # → 30 archivos de dist versionados
```

### Alcance real de la exposición

| Vector | Estado |
| --- | --- |
| Código fuente del repositorio | ✅ Expuesto |
| Bundle compilado `dist/assets/LoginPage-*.js` | ✅ Expuesto — **verificado** |
| Repositorio git (`dist/` versionado) | ✅ Expuesto, y en el historial |
| Sitio publicado en Cloudflare Workers | ✅ Expuesto: basta abrir el archivo del navegador |
| Historial de git | ✅ Presente desde los commits `da9f782` y `6489ed5` |

Cualquier persona que abra la aplicación, pulse «ver código fuente» y busque en el chunk de login obtiene **un usuario administrador válido y su contraseña**.

### Impacto

Acceso administrativo completo a la plataforma: 59 recursos de negocio, incluidos datos de menores (estudiantes: nombres, fechas de nacimiento, teléfonos, unidad educativa), datos de personal, contabilidad y el módulo de seguridad.

### Propuesta de corrección {#propuesta-de-corrección-sec-01}

> **No ejecutada.** Modifica `src/` y es un cambio de producto: requiere autorización explícita, según la regla 5 del plan maestro.

**Acción inmediata, independiente del código —y prioritaria sobre él:**

1. **Rotar ahora la contraseña del usuario `pablo.admin`** en el backend. La credencial ya está publicada; cambiar el código no la revoca.
2. Revisar los registros de acceso del backend para ese usuario.

**Cambio de código propuesto:**

```ts
// src/features/auth/hooks/useLoginViewModel.ts
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
```

| Aspecto | Detalle |
| --- | --- |
| Archivos afectados | 1 (`useLoginViewModel.ts`), 2 líneas |
| Impacto funcional | El formulario aparece vacío. `submit()` ya valida campos vacíos con «Ingresa usuario o correo y contraseña.» |
| Pruebas necesarias | Prueba unitaria de `useLoginViewModel` con campos vacíos; verificación manual del login |
| Riesgo de regresión | Muy bajo |
| Reversión | `git revert` del commit |
| Requisito adicional | Reconstruir `dist/` y volver a publicar, **y** purgar el historial si se considera necesario (el `dist/` antiguo sigue en git) |

**Verificación posterior obligatoria:**

```bash
grep -r "PabloAdmin2026" src/ dist/    # debe devolver 0 resultados
yarn quality                            # tipos + pruebas + build sin regresión
```

---

## SEC-02 · Token en `localStorage` {#sec-02}

`shared/auth/session.ts` guarda el token en 5 claves de `localStorage`.

| Aspecto | Consecuencia |
| --- | --- |
| Accesible desde JavaScript | Cualquier script de la página puede leerlo. No existe protección equivalente a `HttpOnly` |
| Persistencia | Indefinida: sobrevive al cierre del navegador |
| Cifrado | Ninguno |
| Superficie de XSS | Un XSS logra robo de sesión completo |

**Matiz importante:** el riesgo es proporcional a la exposición a XSS. Este frontend **no usa `dangerouslySetInnerHTML` en ningún sitio** (verificado: `grep -rn "dangerouslySetInnerHTML" src` → 0 resultados) y React escapa por defecto. La superficie propia es pequeña; el riesgo real entra por terceros (ver SEC-11 y SEC-12).

Alternativa habitual: cookie `HttpOnly` + `Secure` + `SameSite`. Requiere cambio en el backend. Es una **propuesta conjunta frontend/backend**, no una corrección local.

---

## SEC-03 · Sesión sin caducidad en el cliente {#sec-03}

No se guarda fecha de expiración ni se comprueba ninguna. El frontend asume que la sesión es válida hasta que el backend responda `401`.

Consecuencia: un equipo compartido conserva la sesión indefinidamente hasta que alguien pulse «Cerrar sesión» o el backend caduque el token.

---

## SEC-04 · Preset de Cloudinary público {#sec-04}

Detalle completo en [../integrations/file-storage.md](../integrations/file-storage.md#riesgos-de-seguridad).

Resumen: el *unsigned upload preset* viaja en el bundle. Cualquiera puede subir archivos a la cuenta **sin tener sesión en la plataforma**. La mitigación está en el panel de Cloudinary (restringir formatos, tamaño, carpeta, moderación), **no es corregible desde este repositorio**.

---

## SEC-05 · Cierre de sesión solo local {#sec-05}

`logout()` en `AppShell` ejecuta `clearStoredSession()` y navega. **No llama a ningún endpoint del backend** — no existe uno de cierre de sesión en el código.

El token sigue siendo válido en el servidor hasta que caduque por su cuenta.

---

## SEC-06 · `rawUser` sin filtrar {#sec-06}

```ts
// shared/auth/session.ts:138
rawUser: user,   // objeto de usuario completo del backend
```

Se persiste en `cpa.session` **todo** lo que el backend devuelva del usuario. Si la respuesta incluye datos personales, quedan en `localStorage` indefinidamente y sin cifrar. Ver [privacy.md](privacy.md).

---

## SEC-07 · Autorización de interfaz permisiva {#sec-07}

`userHasAnyPermission` devuelve `true` por cuatro caminos distintos, incluido «el usuario no tiene ningún permiso cargado». Es una decisión consciente y comentada en el código.

**No es una vulnerabilidad si el backend autoriza correctamente.** Es un riesgo de expectativa: nadie debe asumir que ocultar un botón protege un dato. Modelado en [threat-model.md · T-04](threat-model.md).

---

## SEC-11 · Sin Content-Security-Policy {#sec-11}

Verificado: no hay `Content-Security-Policy` en `docker/nginx.conf`, ni en `wrangler.jsonc`, ni como `<meta>` en `index.html`.

Tampoco hay:

| Cabecera | Estado |
| --- | --- |
| `Content-Security-Policy` | ❌ |
| `X-Frame-Options` / `frame-ancestors` | ❌ — la aplicación **puede embeberse en un iframe ajeno** (clickjacking) |
| `Strict-Transport-Security` | ❌ (Cloudflare puede aplicarla a nivel de zona) |
| `X-Content-Type-Options: nosniff` | ❌ |
| `Referrer-Policy` | ❌ |
| `Permissions-Policy` | ❌ |

CSP propuesta y procedimiento en [content-security-policy.md](content-security-policy.md). **No aplicada:** requiere cambiar la configuración de servicio y puede romper cargas legítimas; necesita autorización y verificación en un entorno de prueba.

---

## SEC-12 · Recurso externo sin SRI {#sec-12}

`index.html:14` carga la hoja de estilos de FontAwesome desde `cdnjs.cloudflare.com` **sin `integrity` ni `crossorigin`**, y sin CSP que lo acote.

Un compromiso del CDN permitiría inyectar CSS arbitrario. CSS puede exfiltrar datos mediante selectores de atributo con `background-image`, por ejemplo el valor de un campo de formulario.

Además es **redundante**: los paquetes npm `@fortawesome/*` ya están instalados.

---

## SEC-13 · Source maps {#sec-13}

`vite.config.ts` no declara `build.sourcemap`. El valor por defecto de Vite es `false`, así que **no se generan source maps en producción**. Verificado: no hay archivos `.map` en `dist/`.

Sin riesgo. Se documenta para que nadie lo active sin evaluar: activarlos expondría el código original completo.

---

## SEC-14 · Datos residuales tras cerrar sesión {#sec-14}

`clearStoredSession()` borra únicamente las 5 claves de sesión. **Sobreviven**:

| Dato | Clave | Riesgo |
| --- | --- | --- |
| Borradores de formulario | claves de `localDraftStore` | **Pueden contener datos personales a medio capturar** |
| Carpetas de la biblioteca | `cpa.fileLibrary.folders.v1` | Bajo |
| Progreso de tutoriales | clave de `LocalTutorialProgressStorage` | Bajo |
| Preferencia de autoarranque | `AUTOSTART_KEY` | Nulo |

En un equipo compartido, el siguiente usuario puede ver borradores del anterior. Ver [privacy.md](privacy.md).

---

## Lo que está bien resuelto

Registrado con el mismo rigor que los defectos:

| Práctica | Evidencia |
| --- | --- |
| **Sin `dangerouslySetInnerHTML`** | `grep -rn "dangerouslySetInnerHTML" src` → 0 resultados. Toda la salida pasa por el escapado de React |
| **Sin `eval`, `new Function` ni `innerHTML` manual** | Verificado por grep |
| **Saneado de mensajes de error** | `sanitizeTechnicalPaths` elimina URLs, métodos HTTP y rutas `/api/…` de los mensajes al usuario, evitando filtrar topología interna |
| **Filtros sensibles ocultos** | `shouldShowFilter` excluye campos con `password`, `contrasena`, `hash` o `token`, impidiendo sondear por esos valores |
| **Superficie de dependencias mínima** | 7 dependencias de producción |
| **Sin cookies ni `credentials: 'include'`** | Elimina de raíz la clase de ataques CSRF basados en cookies |
| **Sin source maps en producción** | Por defecto de Vite |
| **Advertencia explícita sobre contraseñas** | El `helpText` del campo `password` documenta que viaja por HTTPS y se almacena hasheada |

## CSRF

**No aplica en su forma clásica.** El frontend no usa cookies: autentica con una cabecera propia (`X-Session-Token`) que un sitio de terceros no puede añadir a una petición entre orígenes sin pasar el *preflight* CORS. La protección efectiva depende de que el backend **no** acepte `Access-Control-Allow-Origin: *` junto con credenciales, y de que mantenga una lista blanca de orígenes.

## Redirecciones abiertas

**Sin riesgo.** Todas las navegaciones son a rutas literales (`/`, `/login`). No hay ningún punto donde una URL de parámetro o de query se use como destino de redirección. Verificado.

## Enlaces externos

`FileLibraryPage` muestra URLs de Cloudinary. Conviene verificar que los enlaces a destinos externos lleven `rel="noopener noreferrer"` cuando usen `target="_blank"`. No auditado exhaustivamente.
