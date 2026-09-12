# Reglas de composición

Normas observadas en el código y convenciones que conviene mantener.

## Jerarquía de composición

```
main.tsx
└── App (ErrorBoundary + RouterProvider)
    └── router
        ├── LoginPage → LoginForm → Button
        └── ProtectedRoute → AppShell (TutorialProvider)
            └── Outlet (remontado con key={location.pathname})
                └── Página
                    ├── Componentes de feature
                    └── Componentes compartidos
```

## Reglas de dependencia entre componentes

| Regla | Cumplimiento |
| --- | --- |
| Un componente compartido no depende de una feature | ❌ **Violada**: `DataTable`, `Modal`, `SearchFilterBar` y `AppShell` importan de `features/tutorials` |
| Un componente de feature no se usa desde otra feature | ✅ Cumplida |
| Las páginas componen; los hooks orquestan | ⚠️ Mayoritaria: `FileLibraryPage` (19 estados) y `CatalogosOperativosPage` (12) no extraen su estado a un hook |
| El dominio no importa React | ✅ Cumplida |
| Los componentes no llaman a `fetch` | ✅ Cumplida; una excepción en una página (`AsistenciaMasivaPage.tsx:21` tiene un endpoint literal) |

Ver [../architecture/module-dependencies.md](../architecture/module-dependencies.md).

## Patrones de API de componente observados

### `children` para el contenido, props para la configuración

`Modal`, `Card` y `ConfirmDialog` reciben el contenido por `children` y la configuración por props. Es coherente.

### Props opcionales como control de permisos

Patrón propio del proyecto y bien aplicado:

```tsx
<DataTable
  onEdit={canUpdate ? viewModel.openEdit : undefined}
  onDisable={canDelete ? … : undefined}
/>
```

`DataTable` solo dibuja la columna «Acciones» si recibe alguna de las dos. **La ausencia de la prop es el mecanismo de ocultación.** Lo mismo hace `SearchFilterBar` con `onCreate` y `onExportOpen`.

Ventaja: el componente no necesita conocer el modelo de permisos.

### Extensión de props nativas

`Button` extiende `ButtonHTMLAttributes<HTMLButtonElement>`, así que acepta cualquier atributo estándar y `data-*` — necesario para los anclajes de tutorial.

Es el único componente que lo hace. `FormField`, `Modal` y `DataTable` definen interfaces cerradas.

### Concatenación de `className`

```tsx
const classes = [styles.button, styles[variant], fullWidth ? styles.fullWidth : '', className]
  .filter(Boolean).join(' ');
```

`Button` y `Card` permiten extender estilos desde fuera. El resto, no.

### Portales para capas superpuestas

`Modal` y `ConfirmDialog` usan `createPortal(..., document.body)` con un motivo documentado en el propio código:

> Dentro del árbol de la página, cualquier ancestro con `transform`/`filter`/`backdrop-filter` convierte `position: fixed` en relativo a ese ancestro.

**Regla que se deriva:** cualquier componente que se dibuje superpuesto **debe** usar portal.

### Contador de capas

`useModalLayer` lleva `data-modal-count` en el `body` para que, con dos capas abiertas, la última en cerrarse restaure el scroll. Es la solución correcta al caso real de un `ConfirmDialog` sobre un `Modal`.

### Prop `layer` para el orden de apilado

`ConfirmDialog` acepta `layer: 'default' | 'top'`, donde `'top'` lo dibuja por encima del recorrido guiado, que usa un `z-index` muy alto.

## Reglas para componentes nuevos

1. **Antes de crear, comprobar si ya existe.** El proyecto ya duplica patrones: `UserProfilePage` reimplementa `Card`; `SearchFilterBar` y `ResourceExportModal` duplican `normalizeOption` y `renderFilterInput`.
2. **Ubicación:** en `shared/components/` **solo** si lo usarán dos o más features. Si no, en `features/<feature>/components/`.
3. **Estructura:** carpeta con `Componente.tsx`, `Componente.module.css` e `index.ts`.
4. **Estilos:** tokens de `theme.css`, no valores literales.
5. **Accesibilidad desde el principio:** etiqueta asociada, error vinculado con `aria-describedby`, `aria-label` en botones que solo llevan icono, `aria-hidden` en iconos decorativos.
6. **Ids:** `useId()`, nunca literales. `Modal` y `ConfirmDialog` usan ids fijos y eso ya produce un defecto real ([A11Y-07](../accessibility/audit-report.md)).
7. **Superposición:** portal al `body` y `useModalLayer`.
8. **Sin acoplar a una feature:** si un componente compartido necesita algo de una feature, es señal de que el contrato está mal ubicado.

## Composición del formulario CRUD

```
ResourceListPage
└── Modal
    └── ResourceForm | TransactionForm
        ├── FormField × N          (según resourceDefinitions)
        │   ├── SearchableSelect   (si hay más de 12 opciones)
        │   └── InfoHint           (si hay helpText)
        └── CloudinaryUploadField  (campos de archivo)
```

`TransactionForm` se descompone además en `TransactionHeaderFields`, `TransactionMovementsTable`, `TransactionMovementEditor` y `TransactionDraftActions` — el mejor ejemplo de descomposición del proyecto.

## Componentes que faltan

Ver la tabla final de [catalog.md](catalog.md#componentes-que-no-existen). Los que más se echan en falta, por número de reimplementaciones:

| Componente | Reimplementado en |
| --- | --- |
| Badge | `DataTable` (`statusBadge`), perfil, catálogos |
| Tabs | `CatalogosOperativosPage`, `HelpGuideModal` |
| Pagination | `ResourceListPage`, `FileLibraryPage` |
| Spinner | `LoginForm` |
| Avatar | `UserProfilePage` |
