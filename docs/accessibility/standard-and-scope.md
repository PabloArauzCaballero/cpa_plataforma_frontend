# Estándar y alcance de accesibilidad

## Estándar aplicable

**WCAG 2.2, nivel AA.**

> El proyecto **no declara** ningún estándar de accesibilidad: no hay contrato, política ni comentario que lo fije. WCAG 2.2 AA se adopta aquí como **referencia por defecto** por ser el criterio habitual para aplicaciones internas y el exigido por la mayoría de marcos normativos.
>
> **Formalizar el estándar aplicable es una decisión organizativa pendiente**, previa a cualquier declaración de conformidad. Registrada en [../reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md).

## Alcance auditado

| Incluido | Excluido |
| --- | --- |
| Las 10 rutas registradas | Las páginas HTML de referencia de `docs/template/` (no forman parte de la aplicación) |
| Los 11 componentes compartidos | El comportamiento interno de `driver.js` |
| Los formularios generados para los 59 recursos | El backend |
| `AppShell` (navegación, cabecera, menú móvil) | Documentos y archivos subidos por los usuarios |
| Tokens de color y foco | |

## Método

| Aspecto | Detalle |
| --- | --- |
| Técnica | Revisión manual del código fuente y del marcado generado |
| Herramientas automatizadas | ❌ **Ninguna.** El proyecto no incluye axe, Lighthouse ni pa11y |
| Lector de pantalla | ❌ No se probó |
| Navegación por teclado real | ❌ No se probó en navegador |
| Contraste | Cálculo analítico, sin medición renderizada |

**Consecuencia declarada:** los hallazgos del [informe de auditoría](audit-report.md) son **reales y verificables en el código**, pero la lista **no es exhaustiva**. Un fallo de orden de foco o de anuncio efectivo solo se detecta ejecutando.

## Excepciones registradas

| Excepción | Justificación | Riesgo residual |
| --- | --- | --- |
| No se audita `driver.js` 1.8.0 | Es una dependencia de terceros cuyo comportamiento de foco y ARIA no controla este código | Los recorridos guiados pueden no ser accesibles. Ver [A11Y-10](audit-report.md#a11y-10) |
| No se mide contraste renderizado | Sin herramienta en el proyecto | Un caso identificado analíticamente por debajo del umbral, sin confirmar |
| No se prueba con tecnología de apoyo real | Sin entorno disponible durante la auditoría | Puede haber fallos de experiencia no detectables por código |

## Criterios WCAG con hallazgos abiertos

| Criterio | Nivel | Hallazgo |
| --- | --- | --- |
| 1.3.1 Información y relaciones | A | [A11Y-03](audit-report.md), [A11Y-06](audit-report.md) |
| 1.4.1 Uso del color | A | [A11Y-05](audit-report.md), [A11Y-08](audit-report.md) |
| 1.4.3 Contraste mínimo | AA | [A11Y-11](audit-report.md) |
| 2.1.2 Sin trampas de teclado | A | [A11Y-01](audit-report.md) |
| 2.4.1 Evitar bloques | A | [A11Y-12](audit-report.md) |
| 2.4.3 Orden del foco | A | [A11Y-01](audit-report.md) |
| 2.4.6 Encabezados y etiquetas | AA | [A11Y-03](audit-report.md) |
| 2.4.7 Foco visible | AA | [A11Y-09](audit-report.md) |
| 3.3.1 Identificación de errores | A | [A11Y-02](audit-report.md) |
| 4.1.1 Análisis sintáctico | — | [A11Y-07](audit-report.md) |
| 4.1.3 Mensajes de estado | AA | [A11Y-02](audit-report.md), [A11Y-04](audit-report.md) |

## Declaración de conformidad

> **El frontend NO cumple WCAG 2.2 nivel AA**, con 2 hallazgos críticos y 4 altos abiertos.

Ninguna corrección se ha aplicado en esta fase: todas modifican `src/` y son cambios de producto. Ver [audit-report.md](audit-report.md) para la priorización.

## Cómo verificar cuando existan herramientas

```bash
# Ninguno de estos comandos funciona hoy: las herramientas no están instaladas.
# Se documentan como el objetivo a alcanzar.
npx @axe-core/cli http://localhost:5173/login
npx lighthouse http://localhost:5173 --only-categories=accessibility
```

Incorporarlas es una propuesta registrada en [../testing/accessibility-tests.md](../testing/accessibility-tests.md).
