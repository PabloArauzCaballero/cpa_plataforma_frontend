# ADR-0012: Sin internacionalización

## Estado
**Aceptado.**

## Contexto
Toda la interfaz está en español, con textos escritos directamente en el código: etiquetas, mensajes de error, estados vacíos, ayudas contextuales y contenido de los tutoriales.

## Fuerzas y restricciones
- El producto sirve a un único centro educativo, en Bolivia.
- Todos los usuarios son personal interno hispanohablante.
- No hay requisito de multilenguaje.
- El dominio de negocio (contabilidad, matrículas, tutores) está definido en español, igual que los nombres de tabla y de campo del backend.

## Opciones consideradas
| Opción | Ventaja | Inconveniente |
| --- | --- | --- |
| **A. Textos en el código, en español** | Sin dependencias; el texto se lee junto a su contexto | Cambiar de idioma exigiría refactorizar toda la interfaz |
| B. i18next o react-intl desde el principio | Preparado para crecer | Coste sin beneficio actual; indirección en cada texto |
| C. Diccionario propio sencillo | Menos dependencias que B | Reinventa una solución resuelta |

## Decisión
**Opción A.**

## Consecuencias positivas
- Cero dependencias y cero indirección: el texto se lee donde se usa.
- Los mensajes de error se redactan a medida del caso, y son notablemente buenos (`fallbackErrorMessage` en `httpClient.ts:50-57`).
- La terminología del código coincide con la del backend y con la del negocio, lo que evita una capa de traducción mental.

## Consecuencias negativas
- Añadir un idioma exigiría tocar prácticamente todos los archivos `.tsx`.
- **No hay un inventario de textos**: no se puede revisar la redacción de forma centralizada.
- Formatos de fecha y número dependen del navegador; solo hay un uso explícito de la configuración regional (`localeCompare(..., 'es')` en la ordenación).
- El atributo `lang="es"` está correctamente declarado en `index.html`, lo cual es lo importante para accesibilidad.

## Riesgos
| Riesgo | Severidad |
| --- | --- |
| Un requisito futuro de multilenguaje obligaría a una refactorización amplia | 🟢 Bajo: no hay indicios de que vaya a ocurrir |
| Inconsistencias de terminología entre pantallas | 🟡 Medio: mitigado en parte por `humanize.ts`, que normaliza etiquetas |

## Evidencia
`package.json` (sin i18next ni react-intl), `index.html` (`<html lang="es">`), `src/shared/utils/humanize.ts`, `src/shared/api/httpClient.ts:50-57`, `grep -rn "localeCompare" src`.

## Plan de revisión
Revisar solo si aparece un requisito real de segundo idioma. Mientras tanto, la mejora útil no es i18n sino un **glosario compartido** con el backend, para que la terminología sea consistente entre interfaz, base de datos y documentación. Ver [../business/glossary.md](../business/glossary.md).
