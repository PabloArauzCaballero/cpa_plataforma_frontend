# ADR-0005: CSS Modules con variables CSS nativas

## Estado
**Aceptado.**

## Contexto
La aplicación tiene una identidad visual definida (azul CPA `#012B65`, cian `#20A0C5`) y 30 archivos de estilo para 12 pantallas y 22 componentes. Existen plantillas HTML de referencia en `docs/template/`, lo que indica que el diseño se definió antes que el código.

## Fuerzas y restricciones
- Identidad de marca concreta y ya decidida.
- Tema oscuro por defecto.
- Vite soporta CSS Modules **de serie**, sin configuración.
- El equipo es pequeño: cada herramienta añadida hay que mantenerla.

## Opciones consideradas
| Opción | Ventaja | Inconveniente |
| --- | --- | --- |
| **A. CSS Modules + variables CSS** | Nativo en Vite; ámbito local automático; cero dependencias; tokens en tiempo de ejecución | Los tokens no son accesibles desde TypeScript |
| B. Tailwind | Rápido; sistema de diseño integrado | Requiere configuración y adaptar la paleta; marcado verboso |
| C. styled-components / Emotion | Tokens en JS; estilos dinámicos | Coste en tiempo de ejecución; dependencia |
| D. Sass | Mixins, anidamiento | Preprocesador extra; las variables no existen en tiempo de ejecución |

## Decisión
**Opción A.** Un archivo `.module.css` por componente o pantalla, y `src/shared/styles/theme.css` con **45 tokens** en `:root`, importado desde `global.css`, importado a su vez desde `main.tsx`.

## Consecuencias positivas
- **Cero dependencias de estilo.**
- Ámbito local automático: sin colisiones de nombres de clase.
- Los tokens son variables CSS reales: se pueden cambiar en tiempo de ejecución y se heredan.
- Vite genera un chunk de CSS por ruta, alineado con la división de código.
- Tipografía fluida con `clamp()`, sin media queries para el tamaño de texto.
- `prefers-reduced-motion` respetado en 6 puntos.

## Consecuencias negativas
- **Los tokens no son accesibles desde TypeScript**: un componente que necesitara un color en JS tendría que repetirlo. Hoy no ocurre, porque no hay gráficos.
- **Sin sistema de utilidades**: cada componente reescribe su espaciado y su layout. 7 007 líneas de CSS para 23 475 de TS/TSX.
- **No hay tokens semánticos de estado** (éxito, advertencia, error, información): cuatro componentes definen sus colores de estado por su cuenta.
- **Nueve puntos de ruptura distintos** escritos a mano (900, 780, 760, 720, 640, 560, 1040, 980, 960 px), algunos separados por 20 px.
- Nada verifica que se usen los tokens en lugar de valores literales.
- `ResourceListPage.module.css` pesa 43 KiB, el 35 % de todo el CSS: sin herramienta de cobertura no se sabe cuánto se usa.

## Riesgos
| Riesgo | Severidad |
| --- | --- |
| Fragmentación de puntos de ruptura y de valores literales | 🟡 Medio, ya materializado |
| CSS muerto acumulado sin detección | 🟡 Medio |
| Duplicación de patrones visuales (`UserProfilePage` reimplementa `Card`) | 🟡 Medio |

## Evidencia
`src/shared/styles/theme.css` (63 líneas, 45 tokens), `src/shared/styles/global.css`, 30 archivos `.module.css`, `docs/template/`, `docs/theme/cpa-palette.json`, [tokens](../design-system/tokens.md).

## Plan de revisión
Revisar si: (1) el CSS supera las 10 000 líneas, (2) se necesita un tema claro conmutable, o (3) hacen falta tokens en JavaScript (por ejemplo, al introducir gráficos).

Mejora de bajo coste y alto valor, sin cambiar de tecnología: **añadir tokens semánticos de estado y unificar los puntos de ruptura**.
