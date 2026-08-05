# Catálogo de rutas

Fuente única de verdad: `src/app/router.tsx`. Este catálogo cubre el **100 % de las rutas registradas** (10 de 10).

Regenerable con `node scripts/generate-route-inventory.mjs`.

---

## Árbol de rutas

```
/login                                          → LoginPage                 [pública]
/                                               → ProtectedRoute > AppShell [protegida]
├── (index)                                     → HomePage
├── modulos/:module                             → ModuleResourcePickerPage
├── modulos/:module/:resource                   → ResourceListPage
├── batch/:module/:resource                     → ResourceBatchPage
├── contabilidad/catalogos-cuentas-operativas   → CatalogosOperativosPage
├── contabilidad/archivos                       → FileLibraryPage
├── tutoriales                                  → TutorialCenterPage
├── perfil                                      → UserProfilePage
└── *                                           → PageState "Pantalla no encontrada"
```

## Tabla maestra

| # | Patrón | Componente | Acceso | Carga diferida | Parámetros | Ficha |
|---|---|---|---|---|---|---|
| 1 | `/login` | `LoginPage` | Pública | ✅ `lazy` | — | [login.md](login.md) |
| 2 | `/` (index) | `HomePage` | Protegida | ✅ `lazy` | — | [home.md](home.md) |
| 3 | `/modulos/:module` | `ModuleResourcePickerPage` | Protegida | ✅ `lazy` | `module` | [module-board.md](module-board.md) |
| 4 | `/modulos/:module/:resource` | `ResourceListPage` | Protegida | ✅ `lazy` | `module`, `resource` | [resource-list.md](resource-list.md) |
| 5 | `/batch/:module/:resource` | `ResourceBatchPage` | Protegida | ✅ `lazy` | `module`, `resource` | [resource-batch.md](resource-batch.md) |
| 6 | `/contabilidad/catalogos-cuentas-operativas` | `CatalogosOperativosPage` | Protegida | ✅ `lazy` | — | [catalogos-operativos.md](catalogos-operativos.md) |
| 7 | `/contabilidad/archivos` | `FileLibraryPage` | Protegida | ✅ `lazy` | — | [file-library.md](file-library.md) |
| 8 | `/tutoriales` | `TutorialCenterPage` | Protegida | ✅ `lazy` | — | [tutorials.md](tutorials.md) |
| 9 | `/perfil` | `UserProfilePage` | Protegida | ✅ `lazy` | — | [profile.md](profile.md) |
| 10 | `/*` (dentro de `/`) | `PageState` inline | Protegida | ❌ (inline) | — | [not-found.md](not-found.md) |

---

## Pantallas sin ruta propia

Tres componentes de página **no** están registrados en el router. No son rutas; se documentan aquí para que el inventario sea completo y para que nadie las busque por URL.

| Componente | Cómo se alcanza | Evidencia |
|---|---|---|
| `VentaClaseBatchPage` | Renderizada por `ResourceListPage` cuando `resource.composite === 'venta-clase-batch'`. URL efectiva: `/modulos/contabilidad/venta-clase` | `ResourceListPage.tsx:107-109` |
| `AsistenciaMasivaPage` | Renderizada por `ResourceListPage` cuando `resource.composite === 'asistencia-masiva'`. URL efectiva: `/modulos/servicios_educativos/asistencia-masiva` | `ResourceListPage.tsx:111-113` |
| `QualityGatePage` | **Inalcanzable.** Nadie la importa | `grep -rn "QualityGatePage" src` → solo su propia definición |

`QualityGatePage` es **código muerto**. Vite lo elimina del bundle por tree-shaking, pero sigue en el repositorio. Clasificado LOW en [reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md).

---

## Rutas dinámicas: cuántas pantallas reales generan

`/modulos/:module/:resource` es una sola ruta que produce **59 pantallas distintas** por composición de datos:

| Módulo (`:module`) | Recursos (`:resource`) | Visibles en navegación |
|---|---:|---:|
| `administracion` | 7 | 7 |
| `personas` | 7 | 7 |
| `servicios_educativos` | 10 | 10 |
| `contabilidad` | 12 | 11 |
| `deuda` | 2 | 2 |
| `infraestructura` | 5 | 5 |
| `inventario` | 4 | 4 |
| `societario` | 7 | 7 |
| `seguridad` | 5 | 5 |
| **Total** | **59** | **58** |

`transaccion-movimiento-cuenta` lleva `hideFromNavigation: true` (`resourceDefinitions.ts:355`): sigue siendo accesible por URL, pero no aparece en la barra lateral porque se edita como parte del formulario de transacción.

Inventario completo de los 59 recursos con tabla, clave primaria y endpoints: [reports/frontend-inventory.md](../reports/frontend-inventory.md).

---

## Comportamiento transversal de las rutas

### Protección

Todas las rutas salvo `/login` cuelgan del elemento:

```tsx
<ProtectedRoute><AppShell /></ProtectedRoute>
```

`ProtectedRoute` (`src/app/ProtectedRoute.tsx:9-13`) hace una única comprobación: si `getSessionToken()` devuelve `null`, redirige con `<Navigate to="/login" replace />`.

- **No comprueba permisos.** No hay guardas por rol a nivel de ruta.
- **No valida el token contra el backend.** Basta con que exista una cadena en `localStorage`.
- **No hay redirección de vuelta:** tras iniciar sesión siempre se va a `/`, nunca a la URL que se intentaba abrir.

Ver [architecture/routing-and-navigation.md](../architecture/routing-and-navigation.md) y [security/threat-model.md](../security/threat-model.md).

### Carga diferida

Las 9 páginas reales usan `lazy()` + `import()` dinámico, envueltas por `withSuspense()` (`router.tsx:17-23`), cuyo *fallback* es:

```
PageState · "Cargando pantalla" / "Preparando la vista solicitada."
```

Vite genera un chunk por página. Tamaños medidos en [performance/bundle-analysis.md](../performance/bundle-analysis.md).

### Remontaje en cada navegación

`AppShell.tsx:167` renderiza el contenido con `<div key={location.pathname}>`. Al cambiar la ruta, **el subárbol se desmonta y se vuelve a montar** en vez de reconciliarse.

Consecuencias reales:
- Todo el estado local de la pantalla anterior se pierde (no hay caché de listados).
- Cada navegación vuelve a pedir los datos al backend.
- Neutraliza un defecto latente en `ResourceListPage` — ver [resource-list.md](resource-list.md#riesgo-orden-de-hooks).

### Estados de interfaz disponibles

El proyecto tiene un único componente de estado, `PageState`, con cuatro props (`title`, `message`, `actionLabel`, `onAction`). No existen componentes dedicados de *skeleton*, *toast* ni banner de error. Ver [components/notifications.md](../components/notifications.md).

| Estado | Cómo se representa |
|---|---|
| Cargando (ruta) | `PageState` «Cargando pantalla» desde `Suspense` |
| Cargando (datos, primera vez) | `PageState` «Cargando registros» |
| Cargando (datos, recarga) | Texto plano «Actualizando resultados...» |
| Vacío | `PageState` «Sin registros» con acción «Crear registro» si hay permiso |
| Error | `PageState` con `actionLabel="Reintentar"` |
| Éxito | `Modal` compacto con icono `fa-circle-check` |
| Sin permiso | Ausencia del botón (no hay mensaje explícito) |
| Ruta inexistente | `PageState` «Pantalla no encontrada» |

### Metadatos y SEO

El `<title>` es **fijo**: `CPA Plataforma`, definido en `index.html`. Ninguna ruta lo modifica. No hay `react-helmet`, ni Open Graph, ni `robots.txt`, ni sitemap.

Es coherente con el producto: es un panel interno tras autenticación, no contenido indexable. Registrado como decisión, no como brecha.

### Pruebas

**Ninguna ruta tiene prueba automatizada.** No hay pruebas de router, de `ProtectedRoute` ni de navegación. Ver [testing/strategy.md](../testing/strategy.md) y la matriz en [governance/traceability-matrix.md](../governance/traceability-matrix.md).
