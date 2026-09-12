# Formularios y errores accesibles

## El contraste que resume el problema

El proyecto **ya tiene el patrón correcto implementado**, pero solo en un sitio.

### `LoginForm` — correcto

```tsx
<input
  id="email"
  aria-invalid={viewModel.error ? true : undefined}
  aria-describedby={viewModel.error ? errorId : undefined}
  autoComplete="username"
/>
…
<p className={styles.error} id={errorId} role="alert">{viewModel.error}</p>
```

Con el comentario que explica la intención:

> `role="alert"` para que el lector de pantalla anuncie el fallo sin que el usuario tenga que volver a recorrer el formulario.

### `FormField` — incorrecto

```tsx
<label className={styles.field} htmlFor={id}>
  <span>{label}{required ? <strong> *</strong> : null}…</span>
  <input id={id} type={type} value={…} onChange={…} />
  {error ? <small className={styles.error}>{error}</small> : null}
</label>
```

Sin `aria-invalid`, sin `aria-describedby`, sin `role="alert"`, sin `aria-required`.

`FormField` genera **todos los campos de los 59 recursos**. `LoginForm` genera dos.

## Hallazgos

| ID | Problema | Criterio WCAG | Alcance |
| --- | --- | --- | --- |
| A11Y-02a | El mensaje de error **no está vinculado** al control (`aria-describedby` ausente) | 3.3.1 (A) | Todos los formularios |
| A11Y-02b | El estado inválido **no se expone** (`aria-invalid` ausente) | 4.1.2 (A) | Todos los formularios |
| A11Y-02c | El error aparece **sin anunciarse** (`role="alert"` o `aria-live` ausentes) | 4.1.3 (AA) | Todos los formularios |
| A11Y-02d | Lo obligatorio se marca **solo visualmente** con `*` | 3.3.2 (A) | Todos los formularios |
| A11Y-02e | Al enviar un formulario inválido, **no se mueve el foco** ni se ofrece resumen de errores | 3.3.1 (A) | Todos los formularios |

## Lo que sí está bien

| Aspecto | Evidencia |
| --- | --- |
| Etiqueta asociada al control | ✅ `<label htmlFor={id}>` en los cuatro modos de `FormField` |
| Ayuda contextual accesible | ✅ `InfoHint` con `role="tooltip"`, `aria-describedby` y `useId()` |
| Estado de carga de opciones | ✅ El control se deshabilita y muestra «Cargando opciones...» |
| Selector buscable | ✅ Patrón combobox completo en `SearchableSelect` |
| Casilla de verificación | ✅ El `<label>` envuelve el `<input>` y añade `aria-disabled` |
| Validación en la aplicación, no nativa | ✅ El mensaje se pinta en el DOM en vez del globo del navegador, decisión documentada en el código |
| Campos sensibles fuera de los filtros | ✅ `shouldShowFilter` excluye `password`, `contrasena`, `hash`, `token` |

## Corrección propuesta

> **No ejecutada.** Modifica `src/` y es un cambio de producto.

En `FormField`, para los cuatro modos de render:

```tsx
const errorId = `${id}-error`;
const helpId  = `${id}-help`;

<input
  id={id}
  aria-invalid={error ? true : undefined}
  aria-required={required || undefined}
  aria-describedby={[error && errorId, helpText && helpId].filter(Boolean).join(' ') || undefined}
  …
/>
{error ? <small id={errorId} className={styles.error} role="alert">{error}</small> : null}
```

| Aspecto | Detalle |
| --- | --- |
| Archivos afectados | 1 (`FormField.tsx`), cuatro puntos de render |
| Impacto visual | **Ninguno**: solo se añaden atributos ARIA |
| Riesgo de regresión | Muy bajo |
| Beneficio | Cubre los 59 recursos de una vez |
| Validación | Revisión manual con teclado; idealmente `axe` sobre pruebas de componente |

Complemento recomendado: al enviar un formulario con errores, mover el foco al primer campo inválido.

## Mensajes de error: la parte bien hecha

La **redacción** de los mensajes es un punto fuerte del proyecto, independientemente de su exposición ARIA.

| Origen | Ejemplo |
| --- | --- |
| `httpClient` 401 | «Tu sesión expiró o no es válida. Vuelve a iniciar sesión.» |
| `httpClient` 403 | «No tienes permisos para realizar esta acción.» |
| `httpClient` 5xx | «El servicio no está disponible en este momento. Intenta nuevamente.» |
| Validación | «Campo obligatorio.», «Ingrese un correo válido.», «El total debe coincidir con subtotal más ajustes.» |
| Negocio | «La cuenta de costo debe ser diferente de la cuenta de ingreso.» |

Están en español, sin jerga técnica, y dicen **qué hacer**. Además, `sanitizeTechnicalPaths` elimina URLs y rutas internas antes de mostrarlos.

El problema no es **qué** dicen, sino que **un lector de pantalla no los recibe**.

## Verificación manual sugerida

1. Abrir un formulario de alta con `Tab` y `Enter`.
2. Enviar vacío.
3. Con un lector de pantalla, tabular a un campo obligatorio: **hoy no se anuncia el error**.
4. Comprobar si algo indica que el campo es obligatorio más allá del asterisco.

Los pasos 3 y 4 fallan según el análisis del código.
