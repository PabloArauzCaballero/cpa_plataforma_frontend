# ADR-0008: Sesión en `localStorage` con cabecera propia

## Estado
**Aceptado.**

## Contexto
El backend autentica con un token opaco. El frontend se sirve desde un dominio (`*.workers.dev`) distinto al del backend, es decir, **hay dos orígenes diferentes**.

## Fuerzas y restricciones
- Frontend y backend en orígenes distintos: las cookies entre orígenes requieren `SameSite=None; Secure` y configuración CORS con credenciales.
- El backend expone la sesión en la respuesta de login, en varias formas posibles.
- El frontend se despliega como archivos estáticos: no hay servidor propio donde fijar una cookie.

## Opciones consideradas
| Opción | Ventaja | Inconveniente |
| --- | --- | --- |
| **A. `localStorage` + cabecera `X-Session-Token`** | Simple; funciona entre orígenes sin configuración de cookies; inmune a CSRF por cookie | Legible por cualquier JS; sin `HttpOnly` |
| B. Cookie `HttpOnly` + `Secure` + `SameSite` | Inaccesible desde JS | **Requiere cambio en el backend**; hay que gestionar CSRF; complicado entre orígenes |
| C. Token en memoria + refresh en cookie | Mejor equilibrio | Requiere endpoint de refresco; se pierde la sesión al recargar |
| D. `sessionStorage` | Muere al cerrar la pestaña | Obliga a reautenticar en cada pestaña nueva |

## Decisión
**Opción A.** El token se guarda en `localStorage` y `httpClient` lo añade como `X-Session-Token` en cada petición.

Se persisten **cinco claves**: `cpa.sessionToken`, `cpa_session_token`, `cpa.userEmail`, `cpa_user_email` y `cpa.session` (objeto completo).

## Consecuencias positivas
- **CSRF clásico no aplica**: no se usan cookies, y un sitio de terceros no puede añadir una cabecera personalizada a una petición entre orígenes sin pasar el preflight CORS.
- Sin `credentials: 'include'`: la configuración CORS del backend es más simple.
- La sesión sobrevive al cierre del navegador: el usuario no reautentica cada día.
- Funciona igual en desarrollo (`localhost`) y en producción, sin ajustes de cookies.

## Consecuencias negativas
- El token es **legible por cualquier JavaScript de la página**: un XSS logra robo de sesión completo. Mitigado en parte porque el proyecto no usa `dangerouslySetInnerHTML`, `eval` ni `innerHTML` manual.
- **Sin caducidad en el cliente**: no se guarda ni comprueba fecha de expiración.
- **Cerrar sesión no invalida el token en el servidor**: no existe endpoint de logout.
- **Sin sincronización entre pestañas**: cerrar sesión en una no expulsa a las demás.
- `cpa.session` incluye `rawUser`, el objeto de usuario completo **sin filtrar**.
- La duplicación de nombres de clave (`cpa.sessionToken` / `cpa_session_token`) no está explicada en ninguna parte.

## Riesgos
| Riesgo | Severidad | Documento |
| --- | --- | --- |
| Robo de token por XSS | 🟠 Alto (probabilidad baja, impacto crítico) | [SEC-02](../security/frontend-security.md#sec-02) |
| Sesión indefinida en equipo compartido | 🟡 Medio | [SEC-03](../security/frontend-security.md#sec-03) |
| Token vivo tras «Cerrar sesión» | 🟡 Medio | [SEC-05](../security/frontend-security.md#sec-05) |
| Datos personales en `rawUser` | 🟡 Medio | [SEC-06](../security/frontend-security.md#sec-06) |

## Evidencia
`src/shared/auth/session.ts`, `src/shared/api/httpClient.ts:73-76,104,133`, `src/app/ProtectedRoute.tsx`, `grep -rn "document.cookie" src` → sin resultados.

## Plan de revisión
Revisar **conjuntamente con el equipo de backend**. Ninguna alternativa es implementable solo desde el frontend. La prioridad no es cambiar el mecanismo, sino cerrar [SEC-01](../security/frontend-security.md#sec-01), que es un riesgo mucho mayor y sí es corregible aquí.
