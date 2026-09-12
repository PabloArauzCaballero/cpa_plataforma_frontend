# ADR-0007: Tolerancia extrema al contrato del backend

## Estado
**Aceptado**, con un riesgo importante documentado.

## Contexto
El frontend consume una API cuyo contrato **no está especificado formalmente**: no hay OpenAPI accesible desde este repositorio. El historial de `docs/fixes/` registra varias correcciones sucesivas por cambios de forma en las respuestas (`v11-normalizacion-respuesta-listados`, `v35-perfil-mapper-respuesta-backend`, `v36-validacion-contrato-backend`).

## Fuerzas y restricciones
- El backend evoluciona en paralelo, con su propio equipo y ritmo.
- Una respuesta con forma inesperada rompía pantallas en producción.
- Sin contrato ejecutable, no es posible generar tipos ni validar automáticamente.

## Opciones consideradas
| Opción | Ventaja | Inconveniente |
| --- | --- | --- |
| **A. Mappers tolerantes con múltiples alias** | El frontend sobrevive a cambios de forma | El contrato real se vuelve inobservable |
| B. Contrato estricto con validación en tiempo de ejecución (Zod) | Los cambios se detectan de inmediato | Rompe la pantalla ante cualquier variación; requiere dependencia |
| C. Tipos generados desde OpenAPI | Contrato verificable en tiempo de compilación | **Requiere que el backend publique OpenAPI**: no está disponible |

## Decisión
**Opción A**, aplicada de forma sistemática en dos direcciones:

**Salida** — `appendQuery` envía cada concepto con varios nombres:
`q`/`search`/`term`; `onlyActivos`/`only_activos`; `includeInactive`/`include_inactive`; `<clave>` y `filter_<clave>`.

**Entrada** — cada mapper acepta múltiples formas:

| Mapper | Formas aceptadas |
| --- | --- |
| `normalizeListResult` | array directo, o `rows`/`items`/`results`/`records`/`data`, o anidado bajo `data.*` incluido `data.detalle` |
| Paginación | `meta`, `pagination`, `paging`; `limit`/`pageSize`, `count`/`total` |
| `buildStoredSessionFromLoginResponse` | 9 posiciones para el token; alias por cada campo del usuario |
| `normalizeBatchValidationResponse` | claves en español e inglés; estado por subcadena |

## Consecuencias positivas
- El frontend **no se rompe** cuando el backend cambia la envoltura de la respuesta.
- Funciona contra distintas versiones del backend sin ramas de código.
- Los mensajes de error se sanean antes de mostrarse, evitando filtrar topología interna.

## Consecuencias negativas
- **El contrato real es inobservable desde el frontend.** Leyendo el código no se puede saber qué forma devuelve realmente el backend.
- **Una respuesta con forma desconocida se convierte en lista vacía**, no en error: la interfaz muestra «Sin registros», indistinguible de una tabla realmente vacía. Es el fallo silencioso más grave del sistema.
- Las URLs se inflan con parámetros duplicados, y **no se puede saber cuál respeta el servidor**.
- Un `status` de fila desconocido en la validación por lotes se clasifica como **válido por defecto**.
- Imposibilita detectar drift contractual de forma automática.

## Riesgos
| Riesgo | Severidad | Estado |
| --- | --- | --- |
| Un cambio de contrato pasa inadvertido y se presenta como «no hay datos» | 🟠 **Alto** | Real y sin mitigación |
| El backend ignora todos los parámetros de búsqueda y nadie se entera | 🟠 Alto | De hecho, el fallback de filtrado local sugiere que ya ocurre |
| Los mappers acumulan alias indefinidamente sin que se retiren los obsoletos | 🟡 Medio | 9 posiciones solo para el token |

## Evidencia
`resourceMapper.ts:25-80`, `resourceApi.ts:41-74`, `session.ts:102-140`, `resourceApi.ts:146-203`, `docs/fixes/v11`, `v35`, `v36`.

## Plan de revisión
**Revisar en cuanto el backend publique un OpenAPI.** Ese sería el momento de pasar a la opción C: generar tipos, validar el contrato en CI y retirar los alias obsoletos.

Mitigación intermedia propuesta, de bajo coste: que `normalizeListResult` distinga «lista vacía» de «forma no reconocida» y registre un aviso en el segundo caso. Ver [../observability/error-reporting.md](../observability/error-reporting.md).
