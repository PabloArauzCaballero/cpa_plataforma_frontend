# Notificaciones y estados de interfaz

## No hay sistema de notificaciones

Sin toast, sin snackbar, sin centro de notificaciones, sin banner global. Toda la retroalimentación se resuelve con tres piezas.

## Las tres piezas disponibles

### 1. `PageState` — el caballo de batalla

```ts
interface PageStateProps { title: string; message?: string; actionLabel?: string; onAction?: () => void; }
```

**Nueve usos.** Cubre por sí solo cuatro estados distintos:

| Estado | Ejemplo real |
| --- | --- |
| Cargando | «Cargando registros» / «Preparando información de Estudiante.» |
| Vacío | «Sin registros» / «No hay datos para mostrar con los filtros actuales.» |
| Error | «No se pudo completar la operación» + «Reintentar» |
| No encontrado | «Pantalla no encontrada» / «Recurso no encontrado» / «Módulo no encontrado» |

| Limitación | Detalle |
| --- | --- |
| **Sin variantes visuales** | Cargando, vacío y error se ven **igual** salvo por el texto. No hay `variant` ni icono distintivo |
| **Sin anuncio** | Sin `role="status"` ni `aria-live` |
| `<h2>` fijo | No configurable |

> **Mejora de mayor alcance y menor coste de todo el trabajo de accesibilidad:** añadir `role="status"` a `PageState` cubriría de golpe 9 puntos de uso en todas las rutas. Ver [../accessibility/screen-readers.md](../accessibility/screen-readers.md).

### 2. Mensajes en línea

Texto plano dentro de la pantalla:

```tsx
{viewModel.isLoading && viewModel.records.length > 0 ? <p>Actualizando resultados...</p> : null}
{viewModel.message ? <p className={styles.message}>{viewModel.message}</p> : null}
```

Sin estilo compartido ni componente: cada pantalla define el suyo.

### 3. `Modal` compacto de resultado

Para confirmar el resultado de una operación destructiva:

```tsx
<Modal title={disableResult.title} isOpen size="compact" onClose={clearDisableResult}>
  <div data-status={disableResult.status}>
    <span aria-hidden="true"><i className={status === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'} /></span>
    <p>{disableResult.text}</p>
    <button onClick={clearDisableResult}>Entendido</button>
  </div>
</Modal>
```

Bien resuelto: distingue éxito y error **por icono y por texto**, no solo por color. Pero es **modal y bloqueante** — exige cerrar antes de continuar, donde un toast bastaría.

## Cómo se comunica cada situación hoy

| Situación | Mecanismo | Adecuado |
| --- | --- | --- |
| Carga de ruta | `PageState` desde `Suspense` | ✅ |
| Carga inicial de datos | `PageState` | ✅ |
| Recarga con datos en pantalla | Texto plano | ⚠️ Discreto pero no anunciado |
| Lista vacía | `PageState` con acción de crear | ✅ |
| Error de carga | `PageState` + «Reintentar» | ✅ |
| Error de guardado | Mensaje de la pantalla | ⚠️ |
| Éxito al guardar | Cierre del modal + recarga | ⚠️ **No hay confirmación explícita** |
| Éxito al inhabilitar | `Modal` compacto | ⚠️ Bloqueante |
| Error de campo | `<small>` bajo el control | ❌ Sin ARIA |
| Sin permiso | **Ausencia del botón** | ⚠️ Sin explicación |
| Sesión expirada | Mensaje de error del `httpClient` | ✅ Texto claro |
| Error global | `ErrorBoundary` | ✅ Con dos acciones de recuperación |
| Subida en curso | Booleano `isUploading` | ⚠️ Sin progreso |
| Fallo de lookup | **Nada** | ❌ Select vacío sin explicación |

## Los dos huecos importantes

### El silencio del éxito

Guardar un registro **no produce confirmación explícita**: el modal se cierra y la lista se recarga. En una tabla larga, el usuario puede no ver si su registro se creó.

Inhabilitar sí confirma, con un modal. **Hay incoherencia entre operaciones equivalentes.**

### El silencio del fallo de lookup

Si la carga de opciones de un campo relacionado falla, el `catch` devuelve `[]` y el select queda vacío. El usuario concluye que no hay opciones disponibles, cuando en realidad hubo un error.

Ver [../observability/error-reporting.md](../observability/error-reporting.md).

## Propuesta (no ejecutada)

| # | Propuesta | Coste | Valor |
| --- | --- | --- | --- |
| 1 | `role="status"` en `PageState` | Muy bajo | **Alto**: 9 puntos de uso |
| 2 | Variante visual en `PageState` (`loading` / `empty` / `error`) | Bajo | Medio |
| 3 | Confirmación no bloqueante al guardar | Medio | Medio |
| 4 | Mensaje cuando falla un lookup, en vez de select vacío | Bajo | Alto |
| 5 | Componente de notificación no modal reutilizable | Medio | Medio |

La 1 y la 4 son las de mejor relación valor/coste. Todas modifican `src/`.
