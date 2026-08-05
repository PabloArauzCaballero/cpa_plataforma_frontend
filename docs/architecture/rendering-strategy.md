# Estrategia de renderizado

## Modelo: CSR puro

**Client-Side Rendering al 100 %.** No hay SSR, SSG, ISR, streaming ni hidratación.

```tsx
// src/main.tsx
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode><App /></React.StrictMode>,
);
```

`index.html` entrega un `<div id="root">` vacío y un `<script type="module">`. Todo el HTML lo genera React en el navegador.

### Por qué es la decisión correcta aquí

| Factor | Situación |
|---|---|
| Audiencia | Personal interno tras autenticación |
| SEO | Irrelevante: nada debe indexarse |
| Primera impresión | No hay usuarios anónimos que abandonen |
| Complejidad operativa | Sin servidor de render: se despliega como archivos estáticos |

Registrado en [ADR-0003](../adr/ADR-0003-renderizado-csr.md).

### Coste asumido

| Coste | Medición |
|---|---|
| Pantalla vacía hasta ejecutar JS | Chunk inicial de **148 KiB gzip** |
| Sin contenido sin JavaScript | La aplicación no funciona con JS desactivado |
| Sin `<noscript>` | `index.html` no ofrece mensaje alternativo |

## `React.StrictMode`

Activo en `main.tsx`. En desarrollo provoca **doble invocación** de efectos y renders para detectar efectos no idempotentes.

Consecuencia observable en desarrollo: los `useEffect` de carga se ejecutan dos veces, y por tanto **cada listado hace dos peticiones**. En producción no ocurre. Es esperado; no confundirlo con un defecto al depurar.

## División de código

### Por ruta

Las 9 páginas usan `lazy()` + `import()`:

```tsx
const HomePage = lazy(() => import('@/features/dashboard/pages/HomePage')
  .then((module) => ({ default: module.HomePage })));
```

El `.then(...)` es necesario porque las páginas se exportan con nombre, no por defecto.

### Chunks reales del build

| Chunk | Bytes | gzip | Cuándo se descarga |
|---|---:|---:|---|
| `index-*.js` | 478 676 | **148 469** | Siempre |
| `index-*.css` | 23 811 | 5 670 | Siempre |
| `resourceDefinitions-*.js` | 180 531 | 30 920 | Con la primera pantalla que toque recursos |
| `ResourceListPage-*.js` | 114 671 | 33 430 | Al abrir un listado |
| `ResourceListPage-*.css` | 43 210 | 7 360 | Ídem |
| `FileLibraryPage-*.js` | 15 773 | 5 340 | Biblioteca de archivos |
| `CatalogosOperativosPage-*.js` | 15 099 | 4 480 | Catálogos |
| `UserProfilePage-*.js` | 11 089 | 3 470 | Perfil |
| `TutorialCenterPage-*.js` | 10 905 | 3 360 | Centro de tutoriales |
| `jsx-runtime-*.js` | 8 408 | 3 200 | Compartido |
| `FormField-*.js` | 5 850 | 2 150 | Compartido entre formularios |
| `resourceApi-*.js` | 3 820 | 1 510 | Compartido |
| `LoginPage-*.js` | 2 390 | 1 140 | Login |

Total: **865 KiB JS**, **121 KiB CSS**, 173 módulos, build en 186 ms.

### El problema del chunk inicial

478 KiB sin comprimir para la carga inicial es **desproporcionado** para una SPA cuyo `HomePage` pesa 2,4 KiB. El chunk incluye React, react-router-dom, los tres paquetes de FontAwesome, `driver.js` y todo el subsistema de tutoriales, porque `AppShell` monta `TutorialProvider` de forma síncrona.

`AppShell` no está en `lazy()`: es el elemento del layout, así que entra en el chunk del router junto con todo lo que importa.

Cuantificación y propuestas en [performance/bundle-analysis.md](../performance/bundle-analysis.md).

### `resourceDefinitions` como chunk propio

180 KiB (31 KiB gzip) de definiciones de recursos. Se separa automáticamente porque lo importan varios chunks. Contiene:

- 59 definiciones de recurso con todos sus campos,
- enriquecidas por `resourceFieldCatalog.ts` (**4 803 líneas**, el archivo más grande del proyecto).

Es el precio del CRUD dirigido por datos: la configuración viaja al navegador.

## Suspense y estado de carga

Un único fallback para todas las rutas (`router.tsx:17-23`):

```tsx
<Suspense fallback={<PageState title="Cargando pantalla"
                               message="Preparando la vista solicitada." />}>
```

No hay skeletons ni fallbacks por ruta. Ver [components/notifications.md](../components/notifications.md).

## Remontaje en cada navegación

```tsx
// AppShell.tsx
<div key={location.pathname} className={styles.routeTransition}>
  {children ?? <Outlet />}
</div>
```

Cambiar `key` **desmonta y vuelve a montar** el subárbol completo.

| Consecuencia | Signo |
|---|---|
| Estado local descartado en cada navegación | Neutro: se busca ese efecto |
| Ninguna caché de datos entre pantallas | ➖ Cada vuelta atrás repite todas las peticiones |
| Transición CSS reproducible por ruta | ➕ Es el motivo declarado (`styles.routeTransition`) |
| Neutraliza el defecto de orden de hooks de `ResourceListPage` | ⚠️ **Dependencia oculta**: quitar el `key` rompería esa pantalla. Ver [routes/resource-list.md](../routes/resource-list.md#riesgo-orden-de-hooks) |

## Memoización

Uso de `useMemo` y `useCallback` en los view models, principalmente en `useResourceListViewModel`:

| Valor memoizado | Motivo |
|---|---|
| `availableFilters` | Recalcula filtros solo si cambian recurso, registros u opciones de lookup |
| `query` | Objeto estable que alimenta `load` |
| `load` (`useCallback`) | Evita relanzar el efecto en cada render |
| `displayRecords` (en la página) | Ordenación por hora solo cuando aplica |

No hay `React.memo` en ningún componente. Con listas de hasta 100 filas y remontaje por ruta, no es un problema medido.

## Renderizado de listas

`DataTable` renderiza **todas** las filas de la página; no hay virtualización. Con el tope de 100 filas por página del selector es aceptable.

El riesgo no está en el DOM sino en los datos: al filtrar se descargan hasta 50 000 registros para procesarlos en memoria. Ver [performance/rendering.md](../performance/rendering.md).

## Lo que no se hace

| Técnica | Estado |
|---|---|
| Prefetch de rutas al pasar el ratón | ❌ |
| Precarga de chunks críticos (`modulepreload` manual) | ❌ (Vite inyecta el suyo) |
| `React.memo` / `useTransition` / `useDeferredValue` | ❌ |
| Virtualización de listas | ❌ |
| Optimización de imágenes | ❌ Solo `public/logo.png` |
| Optimización de fuentes | ❌ Se usa `Inter, system-ui, sans-serif` sin `@font-face`: si Inter no está instalada, cae a la del sistema. **Ninguna fuente web se descarga** — es eficiente y evita CLS |
| Service Worker / caché offline | ❌ |
