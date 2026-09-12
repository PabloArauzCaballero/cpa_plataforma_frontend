# Pruebas de accesibilidad

## Estado: no existen

Sin `axe-core`, `jest-axe`, `pa11y` ni Lighthouse en el proyecto. La única auditoría disponible es la **manual sobre el código** de [../accessibility/audit-report.md](../accessibility/audit-report.md).

## Por qué es una carencia relevante aquí

Los dos hallazgos críticos de accesibilidad son **exactamente el tipo de defecto que una prueba automatizada detecta**:

| Hallazgo | ¿Lo detectaría `axe`? |
| --- | --- |
| [A11Y-02](../accessibility/audit-report.md) Errores de formulario sin `aria-describedby` / `aria-invalid` | ✅ Sí, directamente |
| [A11Y-07](../accessibility/audit-report.md) `aria-labelledby` con id duplicado | ✅ Sí |
| [A11Y-03](../accessibility/audit-report.md) `<main>` anidado y `<h1>` duplicado | ✅ Sí |
| [A11Y-06](../accessibility/audit-report.md) Tablas sin `scope` | ✅ Sí |
| [A11Y-11](../accessibility/audit-report.md) Contraste insuficiente | ✅ Sí, con medición real |
| [A11Y-01](../accessibility/audit-report.md) Sin trampa de foco | ⚠️ Parcialmente: requiere prueba de interacción |
| [A11Y-05](../accessibility/audit-report.md) Información solo por color | ❌ No: requiere criterio humano |
| [A11Y-12](../accessibility/audit-report.md) Sin salto al contenido | ⚠️ Depende de la regla |

**Cinco de doce hallazgos se habrían detectado automáticamente** desde el primer día.

## El obstáculo

Las pruebas de accesibilidad de componente requieren **primero** las pruebas de componente, que hoy son imposibles: `testMatch` excluye `.tsx` y no hay librería de renderizado. Ver [component-tests.md](component-tests.md).

## Propuesta por capas

> Ninguna implementada: todas añaden dependencias y requieren autorización.

### Capa 1 — `jest-axe` sobre pruebas de componente

Depende de habilitar antes las pruebas de componente.

```ts
// Ejemplo del patrón, no un archivo existente
const { container } = render(<FormField id="x" label="Nombre" value="" error="Campo obligatorio." onChange={() => {}} />);
expect(await axe(container)).toHaveNoViolations();
```

Objetivos prioritarios: `FormField` (con y sin error), `Modal`, `ConfirmDialog`, `DataTable`, `PageState`, `SearchableSelect`.

### Capa 2 — Pruebas de interacción de teclado

Cubren lo que `axe` no ve:

| Prueba | Verifica |
| --- | --- |
| Abrir modal y tabular | El foco no sale del modal |
| Cerrar modal con `Escape` | El foco vuelve al disparador |
| Enviar formulario inválido | El foco va al primer campo con error |
| Recorrer `SearchableSelect` con flechas | La opción resaltada avanza y `Enter` selecciona |

### Capa 3 — Auditoría de página completa

Con Playwright + `@axe-core/playwright`, sobre las 10 rutas reales. Detectaría problemas de composición que las pruebas unitarias no ven: jerarquía de encabezados, landmarks duplicados, contraste renderizado.

### Capa 4 — Lighthouse en el pipeline

Puntuación de accesibilidad como métrica de tendencia, con umbral mínimo.

## Umbral recomendado de adopción

Aplicando la regla de [../governance/change-management.md](../governance/change-management.md): **no hacer fallar el build por deuda preexistente**.

1. Ejecutar en modo informe y registrar el número de violaciones actuales.
2. Fijar ese número como techo: **no se permiten violaciones nuevas**.
3. Reducir el techo a medida que se corrigen los hallazgos.
4. Solo cuando llegue a cero, exigir cero.

## Lo que ninguna herramienta detecta

Registrado para que la automatización no genere una falsa sensación de cumplimiento:

- Si el texto alternativo **describe bien** la imagen.
- Si el orden de tabulación es **lógico** (no solo si existe).
- Si un mensaje de error es **comprensible**.
- Si la información por color tiene **alternativa suficiente**.
- Si el recorrido guiado de `driver.js` es usable con lector de pantalla.

Las herramientas automatizadas detectan aproximadamente el 30-40 % de los problemas reales. **La auditoría manual sigue siendo necesaria.**

## Estado formal

Con dos hallazgos críticos abiertos, el frontend **no cumple WCAG 2.2 AA**. Ver [../accessibility/standard-and-scope.md](../accessibility/standard-and-scope.md).
