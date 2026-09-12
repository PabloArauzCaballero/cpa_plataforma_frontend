# Informe de auditoría de accesibilidad

| | |
| --- | --- |
| **Estándar** | WCAG 2.2 nivel AA (ver [standard-and-scope.md](standard-and-scope.md)) |
| **Commit auditado** | `618e5c3` |
| **Método** | Revisión manual del código fuente y del marcado generado |
| **Alcance** | 10 rutas, 11 componentes compartidos, formularios de 59 recursos |

## Limitación del método — declarada

**No se ejecutó ninguna herramienta automatizada** (axe, Lighthouse, pa11y) ni prueba con lector de pantalla real. El proyecto no incluye ninguna, y añadirla es una propuesta de cambio, no una acción documental.

Consecuencia: esta auditoría detecta **problemas estructurales verificables en el código**, pero no mide contraste real renderizado, orden de foco efectivo ni comportamiento con lector de pantalla. Los hallazgos son **reales**; la lista **no es exhaustiva**.

## Uso de ARIA en el proyecto

Recuento sobre `src/**/*.tsx`:

| Atributo | Usos |
| --- | ---: |
| `aria-hidden` | 35 |
| `aria-label` | 24 |
| `aria-pressed` | 4 |
| `aria-expanded` | 3 |
| `aria-valuenow` / `valuemin` / `valuemax` | 2 cada uno |
| `aria-modal` | 2 |
| `aria-labelledby` | 2 |
| `aria-describedby` | 2 |
| `aria-controls` | 2 |
| `aria-selected` | 1 |
| `aria-live` | **1** |
| `aria-disabled` | 1 |
| `aria-autocomplete` | 1 |

| Rol | Usos |
| --- | ---: |
| `role="progressbar"` | 2 |
| `role="tablist"` | 2 |
| `role="dialog"` | 1 |
| `role="alertdialog"` | 1 |
| `role="combobox"` | 1 |
| `role="listbox"` | 1 |
| `role="option"` | 1 |
| `role="tooltip"` | 1 |

**Un solo `aria-live` en toda la aplicación.** Es el dato más revelador: una aplicación que carga datos, filtra, guarda y borra de forma asíncrona apenas anuncia nada.

## Hallazgos

### A11Y-01 · Sin trampa ni restauración de foco en modales — 🔴 CRÍTICO {#a11y-01}

| | |
| --- | --- |
| **Criterio WCAG** | 2.4.3 Orden del foco (A), 2.1.2 Sin trampas de teclado (A) |
| **Ubicación** | `shared/components/Modal/Modal.tsx`, `shared/components/Modal/useModalLayer.ts`, `shared/components/ConfirmDialog/ConfirmDialog.tsx` |
| **Alcance** | **Todos los formularios CRUD de los 59 recursos**, exportación, guía de ayuda, confirmaciones |

`useModalLayer` gestiona el cierre con `Escape` y el bloqueo del scroll, pero **no gestiona el foco**:

- No se mueve el foco al modal al abrirlo.
- El tabulador **sale del modal** y recorre la página de fondo, que sigue en el DOM.
- Al cerrar, el foco **no vuelve** al elemento que lo abrió.

Para un usuario de teclado o lector de pantalla, abrir un formulario significa perder la referencia.

**Corrección propuesta:** ampliar `useModalLayer` para (a) guardar `document.activeElement` al abrir, (b) enfocar el primer elemento enfocable del modal, (c) confinar el tabulador dentro del contenedor, (d) restaurar el foco al cerrar. Es un cambio localizado en un solo hook que beneficia a `Modal` y `ConfirmDialog` a la vez.

### A11Y-02 · Errores de formulario sin vínculo programático — 🔴 CRÍTICO {#a11y-02}

| | |
| --- | --- |
| **Criterio WCAG** | 3.3.1 Identificación de errores (A), 4.1.3 Mensajes de estado (AA) |
| **Ubicación** | `shared/components/FormField/FormField.tsx` (líneas 76, 105, 128, 159) |
| **Alcance** | Todos los formularios de los 59 recursos |

El error se renderiza como `<small className={styles.error}>{error}</small>` junto al control, **sin `aria-describedby`, sin `aria-invalid` y sin `role="alert"`**.

Un usuario de lector de pantalla que enfoque el campo **no oye el error**. Al enviar un formulario inválido tampoco se anuncia nada ni se mueve el foco.

**El patrón correcto ya existe en el proyecto:** `LoginForm` usa `aria-invalid`, `aria-describedby` y `role="alert"`. Basta trasladarlo a `FormField`.

### A11Y-03 · Jerarquía de encabezados incorrecta — 🟠 ALTO {#a11y-03}

| | |
| --- | --- |
| **Criterio WCAG** | 1.3.1 Información y relaciones (A), 2.4.6 Encabezados y etiquetas (AA) |

| Problema | Evidencia |
| --- | --- |
| `AppShell` pone `<h1>Gestión CPA</h1>` fijo en todas las rutas | `AppShell.tsx:151` |
| Ninguna pantalla salvo el perfil tiene `<h1>` propio | `HomePage` empieza en `<h2>`; `PageState` renderiza `<h2>` |
| `UserProfilePage` añade su propio `<h1>` | **Dos `<h1>` en la misma página** |
| `UserProfilePage` usa `<main>` dentro del `<main>` de `AppShell` | **`<main>` anidado**: HTML inválido y dos landmarks principales |

Consecuencia: navegar por encabezados no permite distinguir en qué pantalla se está.

### A11Y-04 · Cambios de contenido no anunciados — 🟠 ALTO {#a11y-04}

| | |
| --- | --- |
| **Criterio WCAG** | 4.1.3 Mensajes de estado (AA) |

Situaciones sin anuncio:

| Situación | Componente |
| --- | --- |
| Se aplica un filtro y cambia el número de registros | `ResourceListPage` + `DataTable` |
| Aparece «Cargando registros» / «Actualizando resultados...» | `PageState`, texto plano |
| Se guarda un registro correctamente | `Modal` de resultado |
| Se guarda una configuración de catálogo | `CatalogosOperativosPage` |
| Termina la validación de un lote | `ResourceBatchPage` |
| Termina una subida de archivo | `FileLibraryPage` |
| Se navega a una ruta inexistente | `PageState` |

`PageState` es el componente que más se beneficiaría: añadirle `role="status"` cubriría la mayoría de los casos de un golpe.

### A11Y-05 · Información transmitida solo por color — 🟠 ALTO {#a11y-05}

| | |
| --- | --- |
| **Criterio WCAG** | 1.4.1 Uso del color (A) |
| **Ubicación** | `ResourceListPage.tsx:59-62` y `DataTable.tsx:97` |

Para `clase-por-hora`, `clase-curso` y `aula`, cada fila recibe `data-hour-tone` (0–7) que se traduce en un color de fondo. **El bloque horario se comunica exclusivamente por color.** La leyenda dice «Cada color representa un bloque horario distinto», lo que confirma que no hay alternativa textual.

Los badges de estado de `DataTable`, en cambio, **sí** llevan texto además de color (`renderStatusLabel`): ese caso está bien resuelto.

### A11Y-06 · Tablas sin estructura semántica completa — 🟡 MEDIO {#a11y-06}

| | |
| --- | --- |
| **Criterio WCAG** | 1.3.1 Información y relaciones (A) |
| **Ubicación** | `DataTable.tsx:82-90`, y las tablas propias de `CatalogosOperativosPage`, `ResourceBatchPage` y `FileLibraryPage` |

Falta `<caption>` que identifique la tabla y `scope="col"` en los `<th>`. Con hasta 14 columnas de datos de negocio, la navegación por celdas pierde el encabezado de referencia.

### A11Y-07 · `aria-labelledby` con id duplicado — 🟡 MEDIO {#a11y-07}

| | |
| --- | --- |
| **Criterio WCAG** | 4.1.1 Análisis sintáctico / 1.3.1 |
| **Ubicación** | `Modal.tsx:35,43` |

`Modal` usa `aria-labelledby="modal-title"` con **id literal**. `ResourceListPage` puede tener dos modales abiertos (formulario y resultado), produciendo **dos elementos con el mismo id**. La referencia se vuelve ambigua.

`ConfirmDialog` tiene el mismo patrón (`confirm-dialog-title`, `confirm-dialog-message`), aunque solo se abre uno cada vez.

**Corrección:** usar `useId()`, como ya hacen `InfoHint` y `LoginForm`.

### A11Y-08 · Enlaces sin distinción no cromática — 🟡 MEDIO {#a11y-08}

| | |
| --- | --- |
| **Criterio WCAG** | 1.4.1 Uso del color (A) |
| **Ubicación** | `shared/styles/global.css` |

```css
a { color: inherit; text-decoration: none; }
```

Regla global que elimina el subrayado y hereda el color. Cada enlace debe recuperar por su cuenta una indicación visual; donde no lo haga, no se distingue del texto.

### A11Y-09 · Anillo de foco dependiente de `color-mix()` — 🟡 MEDIO {#a11y-09}

| | |
| --- | --- |
| **Criterio WCAG** | 2.4.7 Foco visible (AA) |
| **Ubicación** | `theme.css:60` |

```css
--ring-focus: 0 0 0 3px color-mix(in srgb, var(--color-secondary) 32%, transparent);
```

`color-mix()` requiere Chrome 111+, Safari 16.2+ o Firefox 113+. En navegadores anteriores la variable **no resuelve y el anillo no se dibuja**, dejando la navegación por teclado sin indicador. No hay fallback.

### A11Y-10 · Recorridos guiados no auditados — 🟡 MEDIO {#a11y-10}

La accesibilidad del recorrido guiado la determina `driver.js` 1.8.0, no el código del proyecto: gestión de foco, `aria-live` del globo y navegación por teclado son de la librería. **No auditado.**

`prefers-reduced-motion` se respeta en el CSS propio de tutoriales, pero **no cubre las animaciones internas de `driver.js`**.

### A11Y-11 · Contraste de texto atenuado sobre superficie — 🟡 MEDIO {#a11y-11}

`--color-text-muted` (`#9AA9BB`) sobre `--color-surface` (`#0E3E74`) da aproximadamente **4,3:1**, por debajo del 4,5:1 exigido para texto normal.

Cálculo analítico, **no verificado con herramienta**. Requiere comprobación con medición real.

### A11Y-12 · Sin enlace para saltar al contenido — 🟢 BAJO {#a11y-12}

| | |
| --- | --- |
| **Criterio WCAG** | 2.4.1 Evitar bloques (A) |

`AppShell` renderiza una barra lateral con hasta 58 enlaces antes del contenido principal. **No hay «Saltar al contenido»**, así que un usuario de teclado debe tabular por toda la navegación en cada pantalla.

## Lo que está bien resuelto

Registrado con el mismo rigor:

| Práctica | Evidencia |
| --- | --- |
| **`LoginForm` completo** | `aria-invalid`, `aria-describedby`, `role="alert"`, `aria-pressed` en el botón de revelar, `autoComplete` correcto, `noValidate` |
| **`SearchableSelect`** | Patrón combobox completo: `role="combobox"`, `listbox`, `option`, `aria-selected`, `aria-autocomplete`, navegación con flechas |
| **`ConfirmDialog`** | `role="alertdialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`; Escape deshabilitado durante la operación |
| **`InfoHint`** | Funciona con hover, foco y clic (cubre el caso táctil); `role="tooltip"` con `useId()` |
| **Superposición del menú móvil** | Es un `<button>` real con `aria-label`, no un `<div>` con `onClick` |
| **Botón de menú** | `aria-expanded`, `aria-controls`, `aria-label` dinámico |
| **Iconos decorativos** | 35 usos de `aria-hidden="true"`, aplicado con consistencia |
| **Acciones de tabla** | `aria-label="Editar registro"` / `"Inhabilitar registro"` |
| **Barras de progreso** | `role="progressbar"` con los tres valores ARIA |
| **`prefers-reduced-motion`** | Respetado en 6 lugares del CSS propio |
| **Etiquetas de formulario** | `<label htmlFor>` correcto en los cuatro modos de `FormField` |

El proyecto **no es inaccesible por descuido**: tiene patrones bien resueltos. Los fallos se concentran en dos piezas transversales — `Modal` y `FormField` — y en la ausencia de regiones activas.

## Resumen y priorización

| ID | Hallazgo | Severidad | Alcance | Esfuerzo estimado |
| --- | --- | --- | --- | --- |
| A11Y-01 | Sin gestión de foco en modales | 🔴 Crítico | 59 recursos | Un hook |
| A11Y-02 | Errores de formulario sin ARIA | 🔴 Crítico | 59 recursos | Un componente |
| A11Y-03 | Jerarquía de encabezados y `<main>` anidado | 🟠 Alto | Todas las rutas | Varios archivos |
| A11Y-04 | Cambios no anunciados | 🟠 Alto | Todas las rutas | `PageState` + puntuales |
| A11Y-05 | Bloque horario solo por color | 🟠 Alto | 3 recursos | Una columna o etiqueta |
| A11Y-06 | Tablas sin `caption`/`scope` | 🟡 Medio | Todos los listados | `DataTable` + 3 pantallas |
| A11Y-07 | Id duplicado en `aria-labelledby` | 🟡 Medio | Modales | Dos componentes |
| A11Y-08 | Enlaces sin distinción no cromática | 🟡 Medio | Global | Una regla CSS |
| A11Y-09 | Anillo de foco sin fallback | 🟡 Medio | Global | Una variable CSS |
| A11Y-10 | `driver.js` no auditado | 🟡 Medio | Tutoriales | Investigación |
| A11Y-11 | Contraste de texto atenuado | 🟡 Medio | Global | Un token |
| A11Y-12 | Sin salto al contenido | 🟢 Bajo | Todas las rutas | Un enlace |

**Dos correcciones —`useModalLayer` y `FormField`— resuelven los dos hallazgos críticos y cubren los 59 recursos.** Es la intervención con mayor retorno.

## Estado formal

> **Con 2 hallazgos críticos abiertos, el frontend NO cumple WCAG 2.2 nivel AA.**

Ninguna corrección se ha aplicado: todas modifican `src/` y son cambios de producto que requieren autorización, verificación funcional y revisión visual. Registradas en [../reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md).
