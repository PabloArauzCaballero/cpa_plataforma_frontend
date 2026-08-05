# Resolución de problemas (desarrollo)

Problemas de entorno de desarrollo. Para incidentes en producción, ver [operations/runbooks/index.md](../operations/runbooks/index.md).

---

## `yarn install --frozen-lockfile` falla

**Síntoma:** `Your lockfile needs to be updated`.

**Causa:** alguien cambió `package.json` sin regenerar `yarn.lock`.

**Qué NO hacer:** ejecutar `yarn install` sin el flag. Eso reescribe el lockfile y hace que tu árbol de dependencias difiera del que se compila en producción.

**Qué hacer:** identificar el commit que desincronizó ambos archivos (`git log -p package.json yarn.lock`) y corregirlo en su propio pull request.

---

## `Missing environment variable: VITE_API_BASE_URL`

**Síntoma:** la aplicación carga, pero cualquier pantalla con datos lanza este error.

**Origen:** `src/config/env.ts:6`, invocado desde `assertEnv()` al comienzo de cada petición.

**Solución:**
```bash
cp .env.example .env
# editar VITE_API_BASE_URL
```
Reinicia `yarn dev`: Vite lee los `.env` **al arrancar**, no en caliente.

---

## Todas las peticiones devuelven 404

**Causa más frecuente:** `VITE_API_BASE_URL` incluye `/api`.

Las rutas del código ya llevan el prefijo (`/api/personas/estudiante`), así que la URL se duplica: `https://host/api/api/personas/estudiante`.

**Solución:** `VITE_API_BASE_URL` debe ser solo el host — `https://host`, sin `/api` y sin barra final (la barra final se elimina automáticamente).

---

## Errores CORS en el navegador

**Síntoma:** `Access to fetch at '...' has been blocked by CORS policy`.

**Causa:** el backend no acepta el origen desde el que sirves el frontend. `yarn dev` usa `--host 0.0.0.0`, por lo que el origen puede ser `http://localhost:5173` **o** `http://192.168.x.x:5173` según cómo abras la aplicación.

**Solución:** añade el origen exacto (esquema + host + puerto) a la configuración `CORS_ORIGINS` del backend. El frontend no puede resolverlo por su cuenta: no hay proxy configurado en `vite.config.ts`.

---

## Sesión que expira y vuelve al login en bucle

**Comportamiento del código:** `httpClient` borra la sesión ante **cualquier** respuesta `401` (`httpClient.ts:104,133`) y `ProtectedRoute` redirige a `/login` cuando no hay token.

**Si entras en bucle:**
1. Comprueba en DevTools → Application → Local Storage que existen `cpa.sessionToken`, `cpa_session_token` y `cpa.session`.
2. Si el token existe pero el backend devuelve `401`, el token caducó o el backend no reconoce la cabecera `X-Session-Token`.
3. Limpieza manual: `localStorage.clear()` en la consola, y vuelve a iniciar sesión.

Ver [integrations/authentication.md](../integrations/authentication.md).

---

## La subida de archivos falla

| Mensaje | Causa | Solución |
|---|---|---|
| `Falta configurar VITE_CLOUDINARY_CLOUD_NAME` | Variable ausente | Defínela en `.env` y reinicia |
| `Falta configurar VITE_CLOUDINARY_UPLOAD_PRESET` | Variable ausente | Ídem |
| `Cloudinary rechazó la subida.` | Preset inválido, firmado en vez de unsigned, o restricción de tipo/tamaño | Revisa el preset en el panel de Cloudinary |
| `La imagen excede el límite de 10 MB.` | Validación del cliente (`cloudinaryUpload.ts:4`) | Reduce el archivo |
| `El archivo excede el límite de 25 MB.` | Validación del cliente (`cloudinaryUpload.ts:5`) | Ídem |
| `No se pudo subir … por un problema de red.` | `fetch` a `api.cloudinary.com` falló | Comprueba conectividad y bloqueadores del navegador |

---

## Un listado tarda muchísimo o congela la pestaña

**Esto es comportamiento esperado del diseño actual, no un fallo de tu entorno.**

Cuando escribes en el buscador o aplicas un filtro, `useResourceListViewModel` **descarga el universo completo del recurso** y filtra en el navegador (`useResourceListViewModel.ts:464-479`), porque algunos endpoints genéricos no aplican todos los filtros en servidor.

- Paginación interna: 200 registros por petición.
- Tope: 50 000 registros (`listAllResource(..., maxRows = 50000)`).

Sobre tablas grandes eso son **cientos de peticiones secuenciales**. Ver el riesgo cuantificado en [performance/rendering.md](../performance/rendering.md) y [data-and-state/server-state.md](../data-and-state/server-state.md).

**Mitigación en desarrollo:** trabaja con un conjunto de datos reducido.

---

## Los selects tardan en poblarse

Los campos con `relation` cargan sus opciones con `listAllLookupOptions(relation, 300, 100000)` (`useResourceListViewModel.ts:422`): páginas de 300 y hasta **100 000** opciones. En un recurso con varios campos relacionados, esas cargas ocurren en paralelo al montar la pantalla.

Mientras tanto el campo muestra `Cargando opciones...` y está deshabilitado (`FormField.tsx:120,123`).

---

## `yarn build` ensucia el árbol de git

Es lo esperado: `dist/` **está versionado** en este repositorio.

Para comprobar que el proyecto compila sin tocar `dist/`:
```bash
npx tsc -b && npx vite build --outDir /tmp/dist-check --emptyOutDir
```

---

## Un error de tipos solo aparece al ejecutar pruebas

`tsconfig.json` **excluye** `src/__tests__` y `**/*.test.*`. Las pruebas se type-checkean con `tsconfig.jest.json` a través de ts-jest.

Consecuencia: `yarn typecheck` puede pasar y `yarn test` fallar por tipos. Ejecuta siempre `yarn quality`.

---

## Añadí una prueba `.test.tsx` y Jest no la encuentra

`testMatch` es `**/__tests__/**/*.test.ts` — **sin `x`**. Los archivos `.test.tsx` se ignoran silenciosamente.

Cambiar esto implica además instalar una librería de renderizado (no hay ninguna). Es una **propuesta de cambio de producto**, no un ajuste local. Ver [testing/component-tests.md](../testing/component-tests.md).

---

## Pantalla en blanco tras un error

`ErrorBoundary` (`src/shared/components/ErrorBoundary/ErrorBoundary.tsx`) envuelve toda la aplicación y muestra «Algo se desajustó» con botones de recargar e ir al inicio. El detalle real queda en la consola del navegador (`console.error`), **no se envía a ningún servicio**: no hay captura remota de errores. Ver [observability/error-reporting.md](../observability/error-reporting.md).

Si ves blanco de verdad (sin la tarjeta), el fallo ocurrió **antes** de montar React: revisa la consola por errores de carga del módulo o de `index.html`.

---

## Los iconos no se ven

FontAwesome se carga por dos vías:
1. CDN en `index.html:14` (`cdnjs.cloudflare.com`) — cubre los iconos escritos como `<i className="fa-solid …">`.
2. Paquetes npm `@fortawesome/*` — cubren los `<FontAwesomeIcon icon={…} />`.

Si el CDN está bloqueado (red corporativa, bloqueador), **solo desaparecen los del primer grupo**, que son la mayoría de la navegación. Ver [security/dependencies.md](../security/dependencies.md).
