# Ruta `/contabilidad/catalogos-cuentas-operativas`

| | |
|---|---|
| **Patrón** | `/contabilidad/catalogos-cuentas-operativas` (fija, sin parámetros) |
| **Componente** | `CatalogosOperativosPage` |
| **Archivo** | `src/features/catalogs/pages/CatalogosOperativosPage.tsx` (353 líneas) |
| **Servicio** | `src/features/catalogs/services/catalogosOperativosApi.ts` (199 líneas) |
| **Layout** | `AppShell` |

## Propósito de negocio

Configurar qué **cuenta contable** corresponde a cada concepto operativo (por ejemplo, con qué cuenta se registra el efectivo, el QR o las cuentas por cobrar de una venta de clase) y consultar los catálogos académicos que alimentan otras pantallas.

Es la pantalla que hace que el parte de clases pasadas pueda contabilizarse: sin esta configuración, `VentaClaseBatchPage` no sabe a qué cuenta imputar cada forma de cobro.

## Acceso y permisos

- Protegida por `ProtectedRoute`.
- **No evalúa permisos** en el frontend, pese a modificar configuración contable. La autorización es responsabilidad del backend.
- Enlace visible en la barra lateral solo dentro del módulo `contabilidad` (`AppShell.tsx:111-116`).

## Flujo de usuario

1. Al montar, `loadData()` lanza **cinco peticiones en paralelo** con `Promise.all` (líneas 93-99).
2. Se presenta una interfaz de pestañas (`activeTab`), con `cuentas` por defecto.
3. En la pestaña de cuentas operativas, el usuario asigna una cuenta contable a cada concepto usando un selector con búsqueda por concepto (`accountSearch` es un mapa por fila).
4. Al guardar una fila, `saveConfig(row)`:
   - `PATCH /api/contabilidad/configuracion-cuenta-operativa/{id}` si la configuración ya existe,
   - `POST /api/contabilidad/configuracion-cuenta-operativa` si es nueva.
5. Se muestra un mensaje de éxito (`saveMessage`) y `savingCode` marca qué fila está guardándose.
6. Las pestañas de catálogos (materias, productos educativos, unidades educativas) son de **solo lectura**, con buscador propio (`catalogSearch`).

## Estados de interfaz

| Estado | Representación | Línea |
|---|---|---|
| Cargando | `PageState` «Cargando catálogos» | 152 |
| Error de carga | `PageState` «No se pudieron cargar los catálogos» + «Reintentar» | 156 |
| Contenido | Pestañas con tablas | — |
| Guardando una fila | `savingCode` identifica la fila en curso | 79 |
| Guardado correcto | `saveMessage` | 78 |

Modelo de carga con `LoadState` (`idle`/…), distinto del patrón booleano `isLoading` del resto del proyecto. Es una **inconsistencia de patrón** entre features, registrada en [architecture/state-management.md](../architecture/state-management.md).

## Contratos de datos

| Operación | Método y ruta |
|---|---|
| Opciones de cuenta | `GET /api/contabilidad/cuenta` |
| Configuración operativa | `GET /api/contabilidad/configuracion-cuenta-operativa` |
| Crear configuración | `POST /api/contabilidad/configuracion-cuenta-operativa` |
| Actualizar configuración | `PATCH /api/contabilidad/configuracion-cuenta-operativa/{id_configuracion_cuenta}` |
| Catálogo de materias | `GET /api/servicios_educativos/materia-tree` |
| Catálogo de productos | `GET /api/servicios_educativos/producto-educativo` |
| Catálogo de unidades educativas | `GET /api/personas/unidad-educativa` |

`/api/contabilidad/configuracion-cuenta-operativa` **no forma parte de los 59 recursos CRUD**: es un endpoint propio de esta pantalla, sin definición en `resourceDefinitions.ts`. Ver [integrations/backend-api.md](../integrations/backend-api.md).

## Componentes

`PageState` y controles nativos. La pantalla renderiza sus propias tablas y pestañas; no reutiliza `DataTable` ni `Modal`.

Las pestañas usan `role="tablist"` (2 apariciones de `role="tablist"` en el proyecto, ambas aquí y en `HelpGuideModal`).

## Analítica

Ninguna.

## Accesibilidad

| Aspecto | Estado |
|---|---|
| Pestañas | ⚠️ `role="tablist"` presente, pero conviene verificar `role="tab"`, `aria-selected` y navegación con flechas |
| Tablas | ⚠️ Sin `<caption>` ni `scope` |
| Guardado | ❌ El mensaje de éxito no se anuncia por región activa |
| Buscadores | ❌ Sin anuncio del número de resultados |
| Encabezado | Sin `<h1>` propio |

## Pruebas

Ninguna, ni de la pantalla ni de `catalogosOperativosApi`.

## Notas operativas

- Las cinco peticiones iniciales son paralelas: **si una falla, `Promise.all` rechaza y la pantalla entera muestra error**, aunque las otras cuatro hayan respondido. No hay degradación parcial.
- Los catálogos se cargan **completos** en memoria; no hay paginación. Sobre `unidad-educativa`, que tiene cientos de filas, es aceptable, pero crece con los datos.
- El guardado es por fila, no transaccional: si el usuario configura varias filas y una falla, las anteriores ya quedaron guardadas.
- Cambios aquí afectan a [venta-clase](resource-list.md) — el parte de clases pasadas depende de esta configuración.
