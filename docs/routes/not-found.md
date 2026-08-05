# Ruta `/*` (no encontrada)

| | |
|---|---|
| **Patrón** | `*`, como hijo de `/` |
| **Componente** | `PageState` **inline** (no hay componente de página dedicado) |
| **Definición** | `src/app/router.tsx:46` |
| **Layout** | `AppShell` |

## Definición real

```tsx
{ path: '*', element: <PageState
    title="Pantalla no encontrada"
    message="La opción solicitada no existe o fue movida." /> }
```

## Propósito

Capturar cualquier ruta no reconocida dentro del área autenticada y mostrar un mensaje comprensible sin sacar al usuario de la aplicación.

## Acceso y permisos

- Es **hija de `/`**, por lo que está **protegida**: pasa por `ProtectedRoute` y se renderiza dentro de `AppShell`.
- Consecuencia: un usuario **sin sesión** que escriba una URL inexistente no ve esta pantalla, sino que es redirigido a `/login`.

## Flujo de usuario

1. El usuario escribe o sigue una URL no registrada, por ejemplo `/reportes`.
2. React Router hace coincidir `*` dentro de `/`.
3. Se muestra el `PageState` **con la barra lateral y la cabecera intactas**, de modo que el usuario puede seguir navegando.

## Estados de interfaz

Un único estado. `PageState` recibe solo `title` y `message`: **no hay acción**.

> **Carencia real:** no se ofrece un botón «Ir al inicio». Comparado con `ErrorBoundary`, que sí ofrece «Recargar pantalla» e «Ir al inicio», esta pantalla deja al usuario sin acción explícita. La recuperación depende de que use la barra lateral.
>
> Clasificado LOW en [reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md). La corrección (añadir `actionLabel`/`onAction`) es un **cambio de producto**, no documental.

## Contratos de datos

Ninguno.

## Componentes

`PageState` únicamente.

## Analítica

Ninguna. **No se registra ningún evento de ruta no encontrada**, ni en consola. No hay forma de saber a qué URLs inexistentes llegan los usuarios ni si hay enlaces rotos en la interfaz.

## Accesibilidad

| Aspecto | Estado |
|---|---|
| Encabezado | `PageState` renderiza `<h2>` (`PageState.tsx:15`) |
| Marcador visual | ✅ `aria-hidden="true"` en el elemento decorativo |
| Anuncio | ❌ Sin `role="status"` ni región activa: al navegar a una ruta inexistente, un lector de pantalla no anuncia el cambio automáticamente |

## Pruebas

Ninguna.

## Casos límite verificados por lectura del código

| Caso | Resultado |
|---|---|
| `/modulos/inexistente` | **No** llega aquí. `ModuleResourcePickerPage` sí coincide y muestra su propio `PageState` «Módulo no encontrado» |
| `/modulos/personas/inexistente` | **No** llega aquí. `ResourceListPage` muestra «Recurso no encontrado» |
| `/reportes` | ✅ Llega aquí |
| `/login/extra` | ✅ Llega aquí (la ruta `/login` no tiene hijos, así que `/login/extra` cae en el comodín de `/` y, sin sesión, redirige a `/login`) |

Es decir, **hay tres pantallas distintas de «no encontrado»** con textos distintos según dónde falle la coincidencia. Es coherente y da mejor contexto que un 404 único, pero conviene conocerlo al diagnosticar.

## Notas operativas

- **Requiere que el servidor reescriba a `index.html`.** Al ser una SPA con `createBrowserRouter`, cualquier recarga de una URL profunda debe servir `index.html`:
  - nginx: `try_files $uri $uri/ /index.html` (`docker/nginx.conf`)
  - Cloudflare Workers: lo hace por defecto el manejador de assets estáticos
  - Si esta reescritura falla, el usuario recibe un **404 del servidor**, no esta pantalla. Ver [operations/runbooks/pantalla-en-blanco.md](../operations/runbooks/pantalla-en-blanco.md).
- Es la única «ruta» que no usa carga diferida: el elemento es inline y viaja en el chunk del router.
