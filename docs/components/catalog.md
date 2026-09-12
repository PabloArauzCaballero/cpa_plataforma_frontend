# Catálogo de componentes compartidos

> Verificado contra el commit `618e5c3`. Regenerable con `node scripts/generate-component-inventory.mjs`.
>
> ⚠️ **Nota de concurrencia:** mientras se escribía esta documentación, otro agente estaba modificando estilos de varios de estos componentes (`Button`, `Card`, `DataTable`, `Modal`, `PageState`, `SearchFilterBar`, `theme.css`). Las **props y el comportamiento** documentados corresponden a `618e5c3`; los detalles puramente visuales pueden haber evolucionado.

## Resumen

| Componente | Ruta | Props | Variantes | Usos | Estado |
| --- | --- | ---: | --- | ---: | --- |
| [`Button`](#button) | `shared/components/Button` | 3 + HTML | 4 | 12 | Activo |
| [`Card`](#card) | `shared/components/Card` | 3 | 2 | baja | Activo, infrautilizado |
| [`ConfirmDialog`](#confirmdialog) | `shared/components/ConfirmDialog` | 12 | 2 × 2 | 3 | Activo |
| [`DataTable`](#datatable) | `shared/components/DataTable` | 8 | — | 1 | Activo |
| [`ErrorBoundary`](#errorboundary) | `shared/components/ErrorBoundary` | 1 | — | 1 | Activo |
| [`FormField`](#formfield) | `shared/components/FormField` | 11 | 4 modos | 4 | Activo |
| [`SearchableSelect`](#searchableselect) | `shared/components/FormField` | 8 | — | 1 | Activo |
| [`Modal`](#modal) | `shared/components/Modal` | 5 | 2 | 3 | Activo |
| [`PageState`](#pagestate) | `shared/components/PageState` | 4 | — | 9 | Activo |
| [`SearchFilterBar`](#searchfilterbar) | `shared/components/SearchFilterBar` | 11 | — | 1 | Activo |
| [`InfoHint`](#infohint) | `shared/components/Tooltip` | 2 | — | dentro de `FormField` | Activo |
| [`AppShell`](#appshell) | `shared/layouts/AppShell` | 1 | — | 1 | Activo, mal ubicado |

**Ningún componente está marcado como legado, experimental ni obsoleto.** No existe convención de deprecación. Ver [deprecation.md](deprecation.md).

### Componentes posteriores al commit auditado {#componentes-posteriores}

Añadidos por trabajo concurrente **después** de `618e5c3` y por tanto **fuera del alcance de esta auditoría**. Se listan para que el inventario sea completo y para que nadie los dé por documentados:

| Componente | Ruta | Introducido en |
| --- | --- | --- |
| `AmbientBackground` | `shared/components/Background/` | `c471eca` |
| `StateArt` | `shared/components/PageState/StateArt.tsx` | trabajo en curso |

Ambos forman parte de un rediseño visual que estaba en marcha durante la auditoría. **No se han revisado sus props, su accesibilidad ni su impacto en el bundle.** Deben documentarse cuando ese trabajo se consolide, siguiendo [../governance/change-management.md](../governance/change-management.md).

---

## Button

```ts
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';   // por defecto 'primary'
  fullWidth?: boolean;                                       // por defecto false
}
```

Extiende los atributos nativos de `<button>`, así que acepta `type`, `disabled`, `onClick`, `aria-*` y cualquier `data-*`. La `className` recibida se **concatena** con las clases internas.

| Aspecto | Detalle |
| --- | --- |
| Composición de clases | `[styles.button, styles[variant], fullWidth && styles.fullWidth, className]` |
| `type` por defecto | ⚠️ **Ninguno**: hereda el `submit` implícito del HTML. Dentro de un `<form>` hay que pasar `type="button"` explícitamente. `Modal` lo hace correctamente |
| Estado de carga | ❌ No existe prop `loading`. Cada consumidor lo resuelve a mano (`LoginForm` con su propio spinner) |
| Icono | ❌ Sin prop. Se pasa como `children` |
| Accesibilidad | Hereda la del `<button>` nativo. Correcto |

**Inconsistencia detectada:** solo 12 sitios usan `Button`. Muchas pantallas (`ResourceListPage`, `UserProfilePage`, `CatalogosOperativosPage`, `ResourceBatchPage`) renderizan `<button>` nativos con estilos propios. El componente compartido **no es la vía dominante**.

---

## Card

```ts
interface CardProps {
  children: ReactNode;
  className?: string;
  tone?: 'light' | 'dark';   // por defecto 'light'
}
```

Renderiza un `<section>`.

**Infrautilizado:** `UserProfilePage` define su propio `styles.card` en lugar de usar este componente. Es el caso más claro de duplicación de patrón visual del proyecto. Ver [routes/profile.md](../routes/profile.md).

---

## ConfirmDialog

```ts
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  targetLabel?: string;     // qué registro concreto se ve afectado
  warning?: string;
  confirmLabel?: string;    // 'Confirmar'
  cancelLabel?: string;     // 'Cancelar'
  variant?: 'default' | 'danger';
  layer?: 'default' | 'top';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
```

El componente **mejor construido del proyecto** en términos de accesibilidad:

| Aspecto | Implementación |
| --- | --- |
| Rol | `role="alertdialog"` (correcto para confirmaciones destructivas) |
| Etiquetado | `aria-modal`, `aria-labelledby="confirm-dialog-title"`, `aria-describedby="confirm-dialog-message"` |
| Portal | `createPortal(..., document.body)` para que `position: fixed` no se rompa con ancestros con `transform` |
| Escape | Vía `useModalLayer`; **deshabilitado mientras `isLoading`**, para no cancelar una operación en curso |
| Estado de carga | El botón de confirmar muestra «Procesando...» y ambos se deshabilitan |
| Prop `layer` | `'top'` lo dibuja por encima del recorrido guiado, que usa un `z-index` altísimo. El comentario del código explica el caso real que lo motivó |

**Carencias:** sin trampa de foco, sin foco inicial en el botón de cancelar, sin restauración de foco al cerrar. Ver [accessibility/focus-management.md](../accessibility/focus-management.md).

`targetLabel` es un acierto de diseño: `ResourceListPage` lo rellena con `resolveDeleteTargetLabel`, que muestra «Nombre: Juan Pérez» en vez de un id, reduciendo el riesgo de inhabilitar el registro equivocado.

---

## DataTable

```ts
interface DataTableProps {
  records: TableRecord[];
  columns: string[];
  primaryKey: string;
  columnLabels?: Record<string, string>;
  onEdit?: (record: TableRecord) => void;
  onDisable?: (record: TableRecord) => void;
  canDisable?: (record: TableRecord) => boolean;
  getRowHourTone?: (record: TableRecord) => number | null;
}
```

Tabla genérica. La columna «Acciones» solo aparece si se pasa `onEdit` u `onDisable`, lo que implementa el ocultamiento por permisos.

### Lógica de presentación incorporada

| Función | Comportamiento |
| --- | --- |
| `renderValue` | `null`/`undefined` → `—`; booleano → `Sí`/`No`; objeto → `JSON.stringify`; resto → `String` |
| `isInactiveRecord` | Detecta soft-delete por `estado_registro`/`estado` (texto en `INACTIVE_STATES` o `false`) o por `es_activo`/`activo` en `false`. Marca la fila con `data-inactive` |
| `isStatusColumn` | Columna cuyo nombre contiene `estado`, o es `es_activo`/`activo` |
| `renderStatusLabel` | Booleano → `Activo`/`Inactivo` (**no** `Sí`/`No`); texto → tal cual |
| `getRowHourTone` | Delegado al consumidor; se emite como `data-hour-tone` |

`INACTIVE_STATES = ['inactivo','eliminado','anulado','baja','cancelado']`.

### Problemas

| # | Problema |
| --- | --- |
| 1 | **Sin virtualización.** Renderiza todas las filas de la página (hasta 100) |
| 2 | **Sin ordenación por cabecera.** `orderBy`/`orderDir` existen en el view model pero la tabla no ofrece controles |
| 3 | **Sin `<caption>` ni `scope` en los `<th>`** |
| 4 | **Importa de `features/tutorials`** para los anclajes (violación de capas) |
| 5 | `JSON.stringify` para objetos produce celdas ilegibles cuando el backend anida datos |

---

## ErrorBoundary

```ts
interface ErrorBoundaryProps { children: ReactNode; }
```

Único límite de error de la aplicación. Detalle completo en [architecture/error-boundaries.md](../architecture/error-boundaries.md).

---

## FormField

```ts
interface FormFieldProps {
  id: string;
  label: string;
  type?: FieldType;                    // 'text' por defecto
  value: string | number | boolean;
  error?: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<string | FormFieldOption>;
  helpText?: string;
  disabled?: boolean;
  isLoadingOptions?: boolean;
  onChange: (value: string | number | boolean) => void;
}

type FieldType = 'text' | 'email' | 'password' | 'number' | 'date' | 'time'
  | 'datetime-local' | 'textarea' | 'checkbox' | 'select' | 'url' | 'tel';
```

### Cuatro modos de render

| Modo | Condición | Salida |
| --- | --- | --- |
| Checkbox | `type === 'checkbox'` | `<label>` que envuelve el input |
| Select buscable | `type === 'select'` y **más de 12 opciones** | `SearchableSelect` |
| Select nativo | `type === 'select'` y ≤ 12 opciones | `<select>` con opción «Seleccionar» |
| Textual | resto | `<input>` o `<textarea rows={4}` |

El umbral `SEARCHABLE_OPTION_THRESHOLD = 12` está justificado en el comentario del código: por encima, el `<select>` nativo obliga a recorrer la lista a mano y en móvil es una rueda interminable; por debajo, el nativo es mejor.

### Detalles de comportamiento

| Detalle | Implementación |
| --- | --- |
| Botón «Ahora» | Para `datetime-local` y `time`. Usa `currentLocalValue`, que compone la fecha **en hora local** en vez de `toISOString()`, que devolvería UTC y en Bolivia dejaría la marcación 4 horas adelantada. El comentario lo documenta |
| Campo numérico | `''` se mantiene como cadena vacía; el resto se convierte con `Number()` |
| Obligatorio | Se marca con `<strong> *</strong>` |
| Ayuda | `helpText` se renderiza como `InfoHint` |
| Carga de opciones | `isLoadingOptions` deshabilita el select y muestra «Cargando opciones...» |
| Error | `<small className={styles.error}>` bajo el control |

### Accesibilidad

| Aspecto | Estado |
| --- | --- |
| Asociación etiqueta-control | ✅ `<label htmlFor={id}>` en los cuatro modos |
| Error asociado | ❌ **Sin `aria-describedby` ni `aria-invalid`.** El mensaje es visualmente adyacente pero **no está vinculado programáticamente** |
| Obligatorio | ❌ Sin `aria-required` ni `required` nativo; solo el asterisco visual |
| Ayuda | ✅ `InfoHint` con `aria-describedby` |

Los dos primeros son hallazgos **HIGH** de accesibilidad, que afectan a todos los formularios de los 59 recursos. Ver [accessibility/forms-and-errors.md](../accessibility/forms-and-errors.md).

---

## SearchableSelect

```ts
interface SearchableSelectProps {
  id: string;
  options: FormFieldOption[];
  value: string | number | boolean;
  disabled: boolean;
  isLoadingOptions: boolean;
  onChange: (value: string | number | boolean) => void;
  quickCreate?: QuickCreateConfig;
  onCreateOption?: (values: Record<string, unknown>) => Promise<unknown>;
}
```

Combobox propio para listas largas. Se activa desde `FormField` con más de 12 opciones.

### Algoritmo de coincidencia — probado

| Función | Comportamiento | Prueba |
| --- | --- | --- |
| `normalizeForSearch` | Quita tildes (`NFD` + rango combinante) y pasa a minúsculas, para que «Nuñez» encuentre «Núñez» | ✅ |
| `matches` | **Todos** los términos deben aparecer en la etiqueta, en cualquier orden: «san calixto» y «calixto san» encuentran «Colegio San Calixto» | ✅ |

Cubierto por `src/__tests__/shared/searchableSelectMatch.test.ts` (7 casos). **Es el único componente compartido con pruebas.**

### Accesibilidad

Usa `role="combobox"`, `role="listbox"`, `role="option"`, `aria-selected`, `aria-autocomplete` y navegación con teclado (`highlighted`). Es el componente con el patrón ARIA más completo del proyecto.

### Comportamiento cuidado

Al cerrar sin elegir, el texto vuelve a la etiqueta seleccionada, «para no dejar en pantalla una búsqueda a medias que parezca un valor». El valor que viaja en el payload sigue siendo el id de la opción.

---

## Modal

```ts
interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  size?: 'default' | 'compact';   // 'default' = 1180 px
  children: ReactNode;
}
```

| Aspecto | Implementación |
| --- | --- |
| Portal | `createPortal(..., document.body)`. El comentario explica el motivo: cualquier ancestro con `transform`/`filter`/`backdrop-filter` convierte `position: fixed` en relativo a ese ancestro |
| Rol | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"` |
| Cierre | Escape (vía `useModalLayer`) y clic en el fondo (`onMouseDown` comprobando `event.target === event.currentTarget`) |
| Capas apiladas | `useModalLayer` lleva un contador en `data-modal-count` del `body`, para que con dos capas abiertas la última en cerrarse restaure el scroll |
| Tamaño | `compact` para avisos breves; el ancho por defecto está pensado para formularios de varias columnas |

### Problema de accesibilidad

`aria-labelledby="modal-title"` usa un **id fijo**. Con dos modales abiertos simultáneamente hay **dos elementos con `id="modal-title"`** en el documento, lo que es HTML inválido y hace ambigua la referencia. Ocurre de verdad: `ResourceListPage` puede tener abierto el modal de formulario y el de resultado.

**Sin trampa de foco ni restauración de foco.** Es el hallazgo de accesibilidad más importante del proyecto, porque el modal es el contenedor de todos los formularios CRUD. Ver [accessibility/focus-management.md](../accessibility/focus-management.md).

---

## PageState

```ts
interface PageStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}
```

**El componente más reutilizado (9 usos).** Cubre por sí solo carga, vacío, error y no encontrado.

| Aspecto | Detalle |
| --- | --- |
| Encabezado | `<h2>` fijo, no configurable |
| Acción | Solo aparece si se pasan `actionLabel` **y** `onAction` |
| Marcador visual | `<div aria-hidden="true">` |
| Anuncio | ❌ **Sin `role="status"` ni `aria-live`.** Un cambio de estado no se anuncia |
| Variantes | ❌ Ninguna: el error y la carga se ven igual salvo por el texto |

La falta de distinción visual entre «cargando», «vacío» y «error» es una carencia de diseño registrada en [components/notifications.md](notifications.md).

---

## SearchFilterBar

Barra de búsqueda, filtros y acciones del listado. 11 props, incluyendo `onCreate`, `onExportOpen`, `canCreate`, `canExport` e `isSearchPending`.

Que `onCreate` y `onExportOpen` sean opcionales es el mecanismo de ocultamiento por permisos: `ResourceListPage` pasa `undefined` cuando el usuario no tiene el permiso.

**Duplicación:** define `normalizeOption()` y `renderFilterInput()`, funciones que también existen en `ResourceExportModal.tsx`. Ver [architecture/module-dependencies.md](../architecture/module-dependencies.md#código-huérfano-y-duplicado).

---

## InfoHint

```ts
interface InfoHintProps {
  text: string;
  label?: string;   // 'Más información' por defecto
}
```

Icono de ayuda con tooltip.

| Aspecto | Implementación |
| --- | --- |
| Disparadores | Hover, foco por teclado y clic para fijar (`pinned`) |
| Cierre | `onBlur` despina |
| Rol | `role="tooltip"` con `id` generado por `useId()` |
| ARIA | `aria-label`, `aria-describedby`, `aria-expanded` |
| Guarda | Devuelve `null` si `text` está vacío |

Bien resuelto: el clic para fijar cubre el caso táctil, donde no hay hover.

---

## AppShell

```ts
interface AppShellProps { children?: ReactNode; }
```

Layout del área autenticada: barra lateral, cabecera, contenido y pie. Monta `TutorialProvider`.

**Está mal ubicado.** Vive en `shared/layouts/` pero conoce `resourceDefinitions`, `moduleMeta` y toda la feature de tutoriales: es un componente de aplicación, no genérico. Su sitio es `app/`. Ver [architecture/module-dependencies.md](../architecture/module-dependencies.md#causa-2--appshell-conoce-el-dominio).

Detalle de su comportamiento en [architecture/routing-and-navigation.md](../architecture/routing-and-navigation.md).

---

## Componentes que NO existen

| Componente esperado | Estado | Cómo se resuelve hoy |
| --- | --- | --- |
| Toast / Snackbar | ❌ | Mensajes en línea o `Modal` compacto |
| Skeleton | ❌ | `PageState` «Cargando…» |
| Spinner reutilizable | ❌ | `LoginForm` define el suyo |
| Badge | ❌ | `DataTable` define `statusBadge` internamente |
| Tabs | ❌ | `CatalogosOperativosPage` y `HelpGuideModal` implementan los suyos |
| Pagination | ❌ | `ResourceListPage` la renderiza inline |
| Breadcrumb | ❌ | No hay migas de pan |
| Dropdown / Menu | ❌ | Se usa `<details>` nativo |
| Avatar | ❌ | `UserProfilePage` calcula sus iniciales |
| Tooltip genérico | Parcial | `InfoHint` está acoplado al caso de ayuda |
| Layout de formulario | ❌ | Cada formulario resuelve su rejilla |

Ver [composition-rules.md](composition-rules.md).
