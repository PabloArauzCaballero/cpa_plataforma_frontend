# Gestión del foco

## Resumen

| Aspecto | Estado |
| --- | --- |
| Indicador de foco visible | ⚠️ Definido con `--ring-focus`, pero depende de `color-mix()` |
| Trampa de foco en modales | ❌ **No existe** |
| Foco inicial al abrir un modal | ❌ No se establece |
| Restauración del foco al cerrar | ❌ No se restaura |
| Cierre con `Escape` | ✅ Implementado |
| Bloqueo del scroll de fondo | ✅ Implementado, con contador de capas |
| Navegación con flechas en el combobox | ✅ `SearchableSelect` |
| Enlace para saltar al contenido | ❌ No existe |

## El hallazgo crítico: modales sin gestión de foco

`useModalLayer` (`src/shared/components/Modal/useModalLayer.ts`, 44 líneas) resuelve bien dos cosas y **omite la tercera**:

```ts
export function useModalLayer(isOpen: boolean, onClose?: () => void): void {
  // ✅ Escape cierra
  // ✅ Bloqueo del scroll con contador data-modal-count, para capas apiladas
  // ❌ Nada sobre el foco
}
```

### Qué ocurre en la práctica

1. El usuario abre un formulario de alta. **El foco sigue en el botón «Crear»**, detrás del modal.
2. Al tabular, el recorrido **entra en la página de fondo**, que sigue en el DOM y es enfocable.
3. Un lector de pantalla lee el contenido de fondo como si el modal no existiera.
4. Al cerrar, **el foco se pierde**: vuelve al `<body>`.

Como `Modal` es el contenedor de **todos los formularios CRUD de los 59 recursos**, el impacto es transversal.

`ConfirmDialog` comparte el mismo hook y el mismo problema, agravado porque es una confirmación destructiva.

### Corrección propuesta

Ampliar `useModalLayer` para que reciba una referencia al contenedor y:

1. Guarde `document.activeElement` al abrir.
2. Enfoque el primer elemento enfocable del contenedor (o el propio contenedor con `tabIndex={-1}`).
3. Confine el tabulador: al llegar al último elemento, volver al primero, y viceversa con `Shift+Tab`.
4. Restaure el foco guardado al cerrar.

**Ventaja de esta ruta:** es **un solo hook**. Corregirlo arregla `Modal` y `ConfirmDialog` a la vez, y por tanto los 59 recursos.

> **No ejecutado.** Modifica `src/` y es un cambio de producto: requiere autorización y verificación funcional.

## Indicador de foco

```css
/* theme.css:60 */
--ring-focus: 0 0 0 3px color-mix(in srgb, var(--color-secondary) 32%, transparent);
```

| Aspecto | Evaluación |
| --- | --- |
| Contraste del anillo | Cian sobre azul oscuro: buena visibilidad |
| Grosor | 3 px: suficiente |
| **Compatibilidad** | ⚠️ `color-mix()` requiere Chrome 111+, Safari 16.2+, Firefox 113+. **Sin fallback: en navegadores anteriores no se dibuja nada** |

Corrección de coste mínimo: declarar primero un valor sólido y sobrescribirlo con `color-mix()` en un `@supports`.

## Orden del foco

El orden depende del orden del DOM; no hay ningún `tabIndex` positivo en el proyecto (verificado), lo cual es correcto.

**Problema estructural:** `AppShell` renderiza la barra lateral —con hasta 58 enlaces de recurso más los de módulo— **antes** del contenido principal. Sin enlace de salto, un usuario de teclado recorre toda la navegación en cada pantalla.

Corrección estándar: un enlace «Saltar al contenido» como primer elemento enfocable, visible solo al recibir foco, apuntando al `<main>`.

## Lo que sí está bien resuelto

| Componente | Comportamiento |
| --- | --- |
| `SearchableSelect` | Navegación con flechas mediante estado `highlighted`; patrón combobox completo con `role`, `aria-selected` y `aria-autocomplete` |
| `InfoHint` | Se abre con foco de teclado, no solo con hover; `onBlur` lo cierra; se puede fijar con clic para el caso táctil |
| Superposición del menú móvil | Es un `<button>` real, enfocable y accionable con teclado |
| Botón de menú | `aria-expanded`, `aria-controls`, `aria-label` dinámico |
| `ConfirmDialog` durante la operación | `Escape` se deshabilita mientras `isLoading`, para no cancelar a medias |
| Cierre del cajón al navegar | `useEffect` sobre `location.pathname` |

## Verificación manual sugerida

Sin herramientas automatizadas, la comprobación mínima es:

1. Cargar `/login` y recorrer todo con `Tab`: ¿se ve siempre dónde está el foco?
2. Iniciar sesión y abrir un listado. Tabular hasta «Crear» y pulsar `Enter`.
3. **Con el modal abierto, tabular:** ¿el foco se queda dentro?
4. Pulsar `Escape`: ¿vuelve el foco al botón «Crear»?
5. Repetir con `ConfirmDialog` desde el icono de papelera.

Los pasos 3 y 4 fallan hoy, según el análisis del código.
