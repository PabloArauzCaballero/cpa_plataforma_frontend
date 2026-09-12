# Navegación por teclado

## Estado

| Elemento | Accesible con teclado | Nota |
| --- | --- | --- |
| Formulario de login | ✅ | Controles nativos; botón de revelar con `aria-pressed` |
| Barra lateral | ✅ | `NavLink` reales y `<details>` nativo |
| Botón de menú móvil | ✅ | `aria-expanded`, `aria-controls` |
| Superposición del menú | ✅ | Es un `<button>` real, no un `<div>` |
| Tabla: acciones de fila | ✅ | `<button>` con `aria-label` |
| Paginación | ✅ | `<button>` con `disabled` correcto |
| Buscador y filtros | ✅ | Controles nativos |
| Selector buscable | ✅ | Flechas, `Enter`, patrón combobox |
| Ayuda contextual | ✅ | Se abre con foco, no solo con hover |
| **Modales** | ❌ | **Sin trampa ni restauración de foco** |
| **Salto al contenido** | ❌ | No existe |
| Recorrido guiado | ❓ | Depende de `driver.js`, no auditado |

## Atajos y teclas implementados

| Tecla | Contexto | Comportamiento | Código |
| --- | --- | --- | --- |
| `Escape` | Cualquier capa modal | Cierra la capa | `useModalLayer.ts:26-28` |
| `Escape` | `ConfirmDialog` con `isLoading` | **Deshabilitado**, para no cancelar a medias | `ConfirmDialog.tsx` |
| `↑` / `↓` | `SearchableSelect` abierto | Mueve la opción resaltada | `SearchableSelect.tsx` |
| `Enter` | `SearchableSelect` | Selecciona la opción resaltada | ídem |
| `Tab` | Global | Orden del DOM; **sin `tabIndex` positivos** | verificado |

No hay atajos globales de aplicación (tipo `Ctrl+K`), lo cual evita conflictos con los del navegador y con las tecnologías de apoyo.

## Los dos problemas

### 1. Modales sin confinamiento del foco

Es el hallazgo crítico [A11Y-01](audit-report.md). Detalle y corrección propuesta en [focus-management.md](focus-management.md).

Impacto concreto para un usuario de teclado: al abrir el formulario de alta de un estudiante, el foco no entra en el modal; al tabular, recorre la página de fondo; al cerrar, se pierde.

### 2. Sin enlace para saltar al contenido

`AppShell` renderiza, antes del contenido principal:

- enlace a Inicio,
- enlace a Tutoriales,
- por cada módulo visible: el `<summary>` del desplegable, el enlace al tablero, y un enlace por recurso.

Con los 58 recursos visibles y 9 módulos, son **decenas de paradas de tabulador antes de llegar al contenido**, en cada pantalla.

Corrección estándar, de coste muy bajo: un enlace «Saltar al contenido» como primer elemento enfocable del documento, oculto salvo al recibir foco, apuntando al `<main>` de `AppShell`.

## Verificación manual sugerida

Sin herramientas automatizadas, esta es la comprobación mínima reproducible:

| # | Paso | Resultado esperado | Hoy |
| --- | --- | --- | --- |
| 1 | Cargar `/login`, tabular por todo | El foco es visible en cada parada | ✅ (salvo navegadores sin `color-mix`) |
| 2 | Iniciar sesión solo con teclado | Se puede | ✅ |
| 3 | Llegar al contenido desde el inicio del documento | Pocas paradas | ❌ decenas |
| 4 | Abrir el modal de alta con `Enter` | El foco entra en el modal | ❌ |
| 5 | Tabular con el modal abierto | El foco no sale del modal | ❌ |
| 6 | Cerrar con `Escape` | El foco vuelve al botón que lo abrió | ❌ |
| 7 | Usar el selector buscable con flechas | Funciona | ✅ |
| 8 | Confirmar una inhabilitación con teclado | Funciona | ✅ (salvo el foco) |

Los pasos 3 a 6 fallan según el análisis del código.
