# Runbooks de operación

Procedimientos de incidente para el frontend. Cada uno indica **síntoma, impacto, diagnóstico seguro, evidencia, mitigación, reversión y escalamiento**.

> **Contexto operativo real.** No hay telemetría, ni alertas, ni CI/CD. La detección de incidentes depende del reporte de usuarios y de la inspección manual. Todos los diagnósticos son de solo lectura: **ninguno modifica el producto**.

| # | Runbook | Síntoma principal |
| --- | --- | --- |
| [R-01](#r-01) | La aplicación no carga | Página en blanco, sin interfaz |
| [R-02](#r-02) | Pantalla en blanco tras navegar | La aplicación cargó pero una ruta queda vacía |
| [R-03](#r-03) | Chunks desactualizados o fallidos | `Failed to fetch dynamically imported module` |
| [R-04](#r-04) | Backend no disponible | Todas las pantallas con datos muestran error |
| [R-05](#r-05) | Autenticación en bucle | Vuelve a `/login` una y otra vez |
| [R-06](#r-06) | CORS bloqueando peticiones | Error de CORS en consola |
| [R-07](#r-07) | Assets o imágenes no disponibles | Iconos ausentes, imágenes rotas |
| [R-08](#r-08) | Variables de entorno incorrectas | 404 en todo, o fallo al subir archivos |
| [R-09](#r-09) | Aumento de errores del navegador | «Algo se desajustó» repetido |
| [R-10](#r-10) | Un listado tarda o congela la pestaña | Lentitud extrema al filtrar |
| [R-11](#r-11) | Degradación de Core Web Vitals | Percepción de lentitud general |
| [R-12](#r-12) | Reversión de una publicación | Hay que volver a la versión anterior |

> **No aplica: error de hidratación.** El plan maestro lo contempla, pero esta aplicación es **CSR pura**: no hay SSR ni hidratación, así que ese fallo no puede ocurrir. Se declara explícitamente en lugar de inventar un procedimiento.

---

## R-01 · La aplicación no carga {#r-01}

**Síntoma:** página completamente en blanco; ni siquiera la tarjeta de error de `ErrorBoundary`.
**Impacto:** total. Nadie puede trabajar.

### Diagnóstico

```bash
curl -I https://<dominio>                       # ¿responde 200?
curl -s https://<dominio> | head -30            # ¿llega el index.html con <div id="root">?
curl -sI https://<dominio>/assets/index-<hash>.js | head -5   # ¿existe el chunk?
```

En el navegador: consola y pestaña Red.

| Evidencia | Causa probable | Mitigación |
| --- | --- | --- |
| `index.html` no llega (5xx/timeout) | Worker de Cloudflare caído o mal publicado | Republicar; ver R-12 |
| `index.html` llega pero el JS da 404 | `dist/` publicado incompleto o desincronizado con el `index.html` | Reconstruir y republicar |
| El JS llega pero hay `SyntaxError` en consola | Navegador demasiado antiguo (el build es ES2020) | Verificar navegador; ver [../../getting-started/prerequisites.md](../../getting-started/prerequisites.md) |
| Todo llega y sigue en blanco | Error en `main.tsx` antes de montar React | Revisar la consola: es el único rastro |

**Reversión:** R-12.
**Escalamiento:** si `index.html` no responde, es infraestructura (Cloudflare), no frontend.

---

## R-02 · Pantalla en blanco tras navegar {#r-02}

**Síntoma:** la aplicación carga, pero al abrir una URL profunda (por ejemplo `/perfil`) y **recargar**, aparece un 404 del servidor o una página vacía.
**Impacto:** alto: los enlaces compartidos y los favoritos no funcionan.

### Diagnóstico

```bash
curl -sI https://<dominio>/perfil | head -3    # debe devolver 200 y HTML, no 404
```

**Causa casi segura:** falta la reescritura de SPA. Toda URL debe servir `index.html`.

| Alojamiento | Regla que debe existir |
| --- | --- |
| nginx | `try_files $uri $uri/ /index.html;` en `docker/nginx.conf` |
| Cloudflare Workers | Comportamiento por defecto del manejador de assets |

**Mitigación:** restaurar la regla y volver a desplegar.
**Escalamiento:** operaciones/infraestructura.

Si la reescritura funciona y aun así queda en blanco **sin** la tarjeta de error, revisa R-03.

---

## R-03 · Chunks desactualizados o fallidos {#r-03}

**Síntoma:** en consola, `Failed to fetch dynamically imported module` o `Loading chunk failed`. Ocurre típicamente **justo después de una publicación**, a usuarios con la pestaña abierta desde antes.
**Impacto:** medio; se resuelve recargando, pero el usuario no lo sabe.

### Causa

Los chunks llevan hash en el nombre. Tras publicar, los nombres cambian. Una pestaña abierta con el `index.html` antiguo pide chunks que ya no existen.

`nginx.conf` mitiga en parte: `index.html` se sirve con `no-cache, no-store, must-revalidate`, así que una recarga completa siempre trae el HTML nuevo. **Pero la navegación dentro de la SPA no recarga el HTML.**

### Diagnóstico

```bash
curl -sI https://<dominio>/assets/<chunk-del-error> | head -3   # esperado: 404
curl -s https://<dominio> | grep -o 'assets/index-[^"]*'        # el hash actual
```

**Mitigación inmediata:** indicar al usuario que recargue con `Ctrl/Cmd + Shift + R`.

**Mitigación de fondo (propuesta, no implementada):** capturar el fallo de `import()` dinámico en `withSuspense` y ofrecer «Hay una versión nueva, recarga la página». Requiere cambio de producto.

**Escalamiento:** ninguno si se resuelve al recargar. Si persiste tras recargar, es R-01.

---

## R-04 · Backend no disponible {#r-04}

**Síntoma:** la aplicación carga, `/` y `/modulos/:module` funcionan, pero toda pantalla con datos muestra «El servicio no está disponible en este momento» o «No se pudo completar la operación».
**Impacto:** alto: solo se pueden ver las pantallas estáticas.

### Diagnóstico

```bash
# Sustituye por el valor real de VITE_API_BASE_URL de ese entorno
curl -sI https://<host-api>/api/auth/publicAuth/login | head -3
```

En el navegador, pestaña Red: comprobar el código de estado de las peticiones a `/api/*`.

| Código | Interpretación |
| --- | --- |
| Sin respuesta / timeout | Backend caído o inalcanzable |
| 5xx | Backend con error interno |
| 0 + error de CORS | Ver R-06 |
| 401 | Ver R-05 |

**Prueba rápida de discriminación:** si `/` (inicio) se ve perfectamente pero `/modulos/personas/estudiante` falla, **el frontend está bien**: el inicio no hace ninguna petición.

**Mitigación:** ninguna en el frontend. No hay caché, ni modo sin conexión, ni reintentos.
**Escalamiento:** equipo de backend / infraestructura.

---

## R-05 · Autenticación en bucle {#r-05}

**Síntoma:** el usuario inicia sesión, entra, y a los pocos segundos vuelve a `/login`. O no consigue pasar de `/login`.
**Impacto:** alto para el usuario afectado.

### Cómo funciona (para diagnosticar bien)

1. `httpClient` borra la sesión ante **cualquier** `401` (`httpClient.ts:104,133`).
2. `ProtectedRoute` redirige a `/login` cuando no hay token.
3. La expulsión **no es inmediata**: ocurre en la siguiente navegación.

### Diagnóstico

En la consola del navegador, **solo lectura**:

```js
Object.keys(localStorage).filter(k => k.startsWith('cpa'))
!!localStorage.getItem('cpa.sessionToken')
```

| Evidencia | Causa | Mitigación |
| --- | --- | --- |
| No hay token tras un login «correcto» | La respuesta de login no traía el token en ninguna de las 9 posiciones aceptadas | Comparar la respuesta real con [../../integrations/authentication.md](../../integrations/authentication.md). Escalar a backend |
| Hay token, pero el backend responde `401` | Token caducado o no reconocido | Volver a iniciar sesión. Si se repite, escalar a backend |
| Hay token y el backend responde `200`, pero igual expulsa | Otra petición en paralelo devolvió `401` y borró la sesión | Revisar **todas** las peticiones en la pestaña Red, no solo la que falla |
| Error al escribir en `localStorage` | Modo privado estricto o almacenamiento lleno | Probar en ventana normal |

**Mitigación de usuario:** `localStorage.clear()` en consola y volver a iniciar sesión.
**Escalamiento:** backend, si el token válido produce `401`.

---

## R-06 · CORS bloqueando peticiones {#r-06}

**Síntoma:** en consola, `Access to fetch at '…' has been blocked by CORS policy`. Las peticiones aparecen con estado 0 o «(failed)».
**Impacto:** alto: ninguna pantalla con datos funciona, aunque el backend esté sano.

### Diagnóstico

```bash
curl -s -o /dev/null -D - -X OPTIONS https://<host-api>/api/personas/estudiante \
  -H "Origin: https://<dominio-frontend>" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: x-session-token"
```

Comprobar en la respuesta:

| Cabecera | Debe |
| --- | --- |
| `Access-Control-Allow-Origin` | Coincidir **exactamente** con el origen del frontend (esquema + host + puerto) |
| `Access-Control-Allow-Headers` | **Incluir `X-Session-Token`** |
| `Access-Control-Allow-Methods` | Incluir `GET, POST, PUT, PATCH, DELETE` |

**Causas frecuentes:**

- El dominio del frontend cambió y no se añadió a `CORS_ORIGINS` del backend. `wrangler.jsonc` documenta esta dependencia en sus comentarios.
- En desarrollo, `yarn dev` usa `--host 0.0.0.0`: el origen puede ser `localhost:5173` **o** `192.168.x.x:5173`. Ambos deben estar permitidos.

**Mitigación:** ajustar `CORS_ORIGINS` en el backend. **No hay proxy en `vite.config.ts`**, así que el frontend no puede sortearlo.
**Escalamiento:** backend.

---

## R-07 · Assets o imágenes no disponibles {#r-07}

**Síntoma A:** faltan la mayoría de los iconos (barra lateral, cabecera, estados).
**Síntoma B:** las imágenes de la biblioteca no se ven.

| Síntoma | Causa | Diagnóstico | Mitigación |
| --- | --- | --- | --- |
| A | `cdnjs.cloudflare.com` bloqueado o caído. Los iconos `<i className="fa-...">` dependen de él | `curl -sI https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css \| head -3` | Ninguna inmediata. La aplicación sigue usable. Solución de fondo: usar los paquetes npm ya instalados |
| B | Cloudinary caído, o la URL guardada apunta a un recurso borrado | Abrir la URL de la imagen directamente | Verificar en el panel de Cloudinary |
| Falta `logo.png` | `public/` no se copió al build | `curl -sI https://<dominio>/logo.png` | Reconstruir y republicar |

**Escalamiento:** ninguno para A; Cloudinary para B.

---

## R-08 · Variables de entorno incorrectas {#r-08}

**Síntoma A:** todas las peticiones devuelven 404.
**Síntoma B:** error `Missing environment variable: VITE_API_BASE_URL`.
**Síntoma C:** `Falta configurar VITE_CLOUDINARY_...` al subir un archivo.

> **Punto crítico:** las variables `VITE_*` se fijan **en tiempo de build**. Cambiarlas en Cloudflare **no tiene ningún efecto**: hay que recompilar y republicar.

### Diagnóstico

```bash
# Qué URL de API quedó compilada en el bundle publicado
curl -s https://<dominio>/assets/index-<hash>.js | grep -o 'https://[a-z0-9.-]*' | sort -u | head
```

| Síntoma | Causa | Mitigación |
| --- | --- | --- |
| A | `VITE_API_BASE_URL` incluye `/api`, duplicando el prefijo | Debe ser solo el host. Recompilar |
| B | Variable ausente en el build | Definirla en `.env.production` y recompilar |
| C | Variables de Cloudinary ausentes | Ídem |

**Reversión:** R-12.
**Escalamiento:** ninguno; es un problema de build.

---

## R-09 · Aumento de errores del navegador {#r-09}

**Síntoma:** varios usuarios reportan la pantalla «Algo se desajustó».
**Impacto:** variable.

> **Limitación grave:** **no hay telemetría**. No es posible saber cuántos usuarios están afectados ni desde cuándo. La detección depende íntegramente del reporte manual.

### Diagnóstico

1. Pedir al usuario captura de la **consola** (F12 → Consola), buscando `Error no controlado en CPA Frontend`.
2. Pedir captura de la pestaña **Red**, filtrando por peticiones fallidas.
3. Preguntar: ruta exacta, recurso y acción concreta.
4. Reproducir en local con el mismo recurso.
5. Contrastar con `git log` desde la última publicación.

**Mitigación:** si coincide con una publicación reciente, revertir (R-12).
**Escalamiento:** desarrollo.

**Mejora de fondo propuesta:** integrar un servicio de captura de errores; ver [../../observability/error-reporting.md](../../observability/error-reporting.md).

---

## R-10 · Un listado tarda o congela la pestaña {#r-10}

**Síntoma:** al escribir en el buscador o aplicar un filtro, la pantalla se queda «pensando» mucho tiempo, o el navegador avisa de que la página no responde.
**Impacto:** medio-alto en tablas grandes.

> **Esto es comportamiento por diseño, no un fallo.**

### Causa

Cuando hay búsqueda o filtro activo, `useResourceListViewModel` **abandona la paginación del servidor** y descarga el recurso completo (`useResourceListViewModel.ts:464-479`):

- páginas de 200 registros,
- tope de 50 000 filas,
- filtrado, ordenación y paginación **en el hilo principal**.

Sobre 20 000 filas son **100 peticiones secuenciales**. Además, cada campo con `relation` carga hasta 100 000 opciones al montar la pantalla.

### Diagnóstico

Pestaña Red: contar las peticiones a `{list}` tras aplicar el filtro. Si hay decenas, es este caso.

**Mitigación inmediata:** limpiar filtros; usar filtros más selectivos; reducir el tamaño de página.
**Mitigación de fondo:** que el backend aplique los filtros y eliminar el fallback local. Es un cambio conjunto frontend/backend. Ver [../../performance/rendering.md](../../performance/rendering.md).
**Escalamiento:** desarrollo + backend.

---

## R-11 · Degradación de Core Web Vitals {#r-11}

**Síntoma:** percepción generalizada de lentitud.

> **Limitación:** **no hay medición de Core Web Vitals**, ni de campo ni de laboratorio. No es posible detectar una degradación de forma objetiva con las herramientas actuales.

### Diagnóstico posible hoy

```bash
# Comparar el tamaño del bundle con la línea base
npx tsc -b && npx vite build --outDir /tmp/dist-check --emptyOutDir
node scripts/check-bundle-budget.mjs
```

Manualmente: Lighthouse desde DevTools del navegador (no está en el proyecto, pero está en el navegador).

Contrastar con [../../reports/baseline.md](../../reports/baseline.md) §4 y [../../performance/budgets.md](../../performance/budgets.md).

**Escalamiento:** desarrollo.
**Mejora de fondo:** instrumentar `web-vitals`.

---

## R-12 · Reversión de una publicación {#r-12}

**Síntoma:** una publicación introdujo un fallo.
**Impacto:** variable.

> **Ventaja de la arquitectura actual:** `dist/` está versionado en git. **El artefacto exacto de cada publicación es recuperable con `git checkout`**, sin necesidad de reconstruir.

### Procedimiento

```bash
# 1. Identificar el commit bueno anterior
git log --oneline -- dist/

# 2. Restaurar EXCLUSIVAMENTE el artefacto publicado
git checkout <commit-bueno> -- dist/

# 3. Verificar que el index.html referencia chunks que existen
grep -o 'assets/index-[^"]*' dist/index.html
ls dist/assets/ | head

# 4. Publicar
npx wrangler versions upload

# 5. Comprobar
curl -sI https://<dominio> | head -3
curl -s https://<dominio> | grep -o 'assets/index-[^"]*'
```

### Alternativa: reversión desde Cloudflare

Cloudflare Workers conserva versiones anteriores. Revertir desde el panel es **más rápido** y no toca el repositorio, pero deja el repositorio y lo publicado desincronizados. Si se usa, **hay que alinear el repositorio después**.

### Comprobaciones tras revertir

- [ ] La aplicación carga
- [ ] Se puede iniciar sesión
- [ ] Un listado muestra datos
- [ ] El fallo que motivó la reversión ha desaparecido
- [ ] El repositorio y lo publicado coinciden

**Escalamiento:** si la reversión no resuelve, el problema probablemente está en el backend (R-04), no en el frontend.
