# Lectores de pantalla

> **No se probó con ningún lector de pantalla real.** Lo que sigue es un análisis del marcado y de los atributos ARIA presentes en el código, no una verificación de experiencia.

## El dato que resume la situación

**Un solo `aria-live` en toda la aplicación.**

Es una aplicación que carga datos de forma asíncrona, filtra, guarda, borra, sube archivos y valida formularios — y casi nada de eso se anuncia.

## Qué no se anuncia

| Situación | Componente | Consecuencia |
| --- | --- | --- |
| La lista termina de cargar | `ResourceListPage` | El usuario no sabe que hay resultados |
| Un filtro cambia el número de registros | `SearchFilterBar` + `DataTable` | Se aplica un filtro y nada indica el efecto |
| Aparece «Actualizando resultados...» | Texto plano | — |
| Se guarda un registro | `Modal` de resultado | El éxito pasa desapercibido |
| Se produce un error de campo | `FormField` | Ver [forms-and-errors.md](forms-and-errors.md) |
| Termina una subida de archivo | `FileLibraryPage` | — |
| Termina la validación de un lote | `ResourceBatchPage` | — |
| Se navega a una ruta inexistente | `PageState` | — |
| Se copia una URL al portapapeles | `FileLibraryPage` | — |

## Qué sí se anuncia

| Situación | Mecanismo |
| --- | --- |
| Error de inicio de sesión | `role="alert"` en `LoginForm` |
| Apertura de un diálogo de confirmación | `role="alertdialog"` + `aria-labelledby` + `aria-describedby` |
| Apertura de un modal | `role="dialog"` + `aria-modal` + `aria-labelledby` |
| Progreso de un tutorial | `role="progressbar"` con `aria-valuenow`/`min`/`max` |
| Estado de un filtro activo | `aria-pressed` en los botones de filtro |
| Estado del menú móvil | `aria-expanded` + `aria-controls` |
| Ayuda contextual | `role="tooltip"` + `aria-describedby` |

## Estructura del documento

| Elemento | Estado |
| --- | --- |
| `<html lang="es">` | ✅ Correcto en `index.html` |
| `<main>` | ⚠️ Presente en `AppShell`, pero `UserProfilePage` anida otro dentro |
| `<nav aria-label="Navegación principal">` | ✅ Correcto |
| `<aside>` para la barra lateral | ✅ |
| `<header>`, `<footer>` | ✅ |
| Jerarquía de encabezados | ❌ Ver [A11Y-03](audit-report.md) |
| Landmarks duplicados | ❌ Dos `<main>` y dos `<h1>` en `/perfil` |

## Tablas

`DataTable` produce una `<table>` con `<thead>`, `<tbody>`, `<th>` y `<td>` — la estructura básica es correcta. Falta:

- `<caption>` que identifique de qué tabla se trata;
- `scope="col"` en los `<th>`.

Con hasta 14 columnas de datos de negocio, la navegación por celdas pierde la referencia del encabezado.

## Iconos

35 usos de `aria-hidden="true"`, aplicados con consistencia tanto a los `<i className="fa-...">` como a los `<FontAwesomeIcon>`. **Los iconos decorativos están correctamente ocultos**, y los botones que solo contienen icono llevan `aria-label`:

```tsx
<button aria-label="Editar registro">…</button>
<button aria-label="Inhabilitar registro">…</button>
<button aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>…</button>
<button aria-label="Cerrar menú de navegación" …>
```

Es un punto fuerte real del proyecto.

## Corrección de mayor alcance

**Añadir `role="status"` a `PageState`.**

`PageState` se usa en 9 lugares y cubre carga, vacío, error y no encontrado. Un solo cambio en ese componente haría que la mayoría de los cambios de estado se anunciaran.

```tsx
// Propuesta, no ejecutada
<div className={styles.state} role="status">
```

| Aspecto | Detalle |
| --- | --- |
| Archivos afectados | 1 |
| Impacto visual | Ninguno |
| Riesgo | Muy bajo |
| Cobertura | 9 puntos de uso, en todas las rutas con datos |

Complemento recomendado: una región activa en `ResourceListPage` que anuncie «N registros» al cambiar el resultado del filtro.

## Verificación pendiente

Comprobar con VoiceOver (macOS), NVDA o JAWS:

1. Recorrer `/login` y enviar el formulario vacío.
2. Abrir un listado y aplicar un filtro: ¿se anuncia el cambio?
3. Abrir el modal de alta: ¿se anuncia su apertura? ¿se puede salir?
4. Enviar el formulario con errores: ¿se anuncian?
5. Navegar por encabezados: ¿se distingue la pantalla actual?
6. Navegar por landmarks: ¿hay uno o dos `<main>`?

Los puntos 2, 3, 4 y 6 fallan según el análisis del código.
