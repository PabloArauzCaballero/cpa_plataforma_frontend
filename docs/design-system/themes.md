# Temas

## Un solo tema: oscuro

La aplicación **siempre** se ve igual. No hay conmutador de tema claro/oscuro, ni preferencia guardada, ni variación por sistema.

| Token | Valor |
| --- | --- |
| `--color-background` | `#012B65` (azul CPA profundo) |
| `--color-surface` | `#0E3E74` |
| `--color-text-primary` | `#FFFFFF` |

`index.html` declara además `<meta name="theme-color" content="#00255f">`, que tiñe la barra del navegador en móvil.

## `prefers-color-scheme`: un solo uso

Aparece **una vez** en todo el CSS. No implementa un tema claro: es un ajuste puntual.

**Interpretación:** el tema oscuro es una decisión de identidad de marca, no una preferencia del usuario. La paleta procede de `docs/theme/cpa-palette.json` y de las plantillas HTML de `docs/template/`, es decir, el diseño se definió antes que el código.

## ¿Es un problema de accesibilidad?

**No en sí mismo.** WCAG no exige ofrecer tema claro. Lo que exige es contraste suficiente, y sobre el fondo principal los ratios son amplios (13,9:1 para texto blanco).

Los riesgos de contraste identificados no vienen de que el tema sea oscuro, sino de dos combinaciones concretas:

- texto atenuado sobre superficie elevada (~4,3:1),
- texto blanco sobre el cian del botón primario (~2,6:1).

Ver [../accessibility/color-and-contrast.md](../accessibility/color-and-contrast.md).

## La única superficie clara

`--color-surface-soft: #F5F8FA` es el único valor claro de la paleta. Se usa en superficies puntuales.

**Cuidado:** cualquier texto sobre esa superficie necesita color oscuro. Si hereda `--color-text-primary` (blanco), el contraste sería prácticamente nulo. No se ha verificado dónde se usa exactamente ni con qué texto: es una comprobación pendiente.

## Qué haría falta para un tema claro

> No implementado. Sería un **cambio de producto** con impacto visual en todas las pantallas.

| Paso | Detalle |
| --- | --- |
| 1 | Los tokens semánticos ya existen (`--color-background`, `--color-surface`, `--color-text-*`): la base está bien puesta |
| 2 | Definir el juego de valores claros y verificar contraste en cada combinación |
| 3 | Aplicarlos con `[data-theme="light"]` en `:root` o mediante `prefers-color-scheme` |
| 4 | Revisar los **valores literales** repartidos por los 30 archivos `.module.css`: no todos usan tokens, y esos no cambiarían |
| 5 | Persistir la preferencia (`localStorage`) y añadir el control |
| 6 | Revisar visualmente las 10 rutas en ambos temas — **sin regresión visual automatizada** |

**El paso 4 es el verdadero obstáculo.** Con 7 007 líneas de CSS y sin herramienta que verifique el uso de tokens, no se sabe cuántos colores están escritos a mano.

## Recomendación

Antes de plantear un tema claro, conviene:

1. **Añadir tokens semánticos de estado** (éxito, advertencia, error, información), que hoy no existen y obligan a cada componente a definir sus colores. Ver [tokens.md](tokens.md).
2. **Auditar el uso de valores literales** frente a tokens.

Ambas mejoras aportan valor por sí solas y son requisito para cualquier trabajo de tematización posterior.
