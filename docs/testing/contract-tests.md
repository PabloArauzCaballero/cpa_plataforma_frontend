# Pruebas de contrato

## Estado: no existen

**Ninguna prueba ejercita `httpClient` ni ningún servicio.** No hay mocks de `fetch`, ni MSW, ni Pact, ni validación de esquema.

## Por qué importan especialmente en este proyecto

Este frontend adopta **tolerancia extrema al contrato del backend** ([ADR-0007](../adr/ADR-0007-tolerancia-de-contrato.md)): cada mapper acepta múltiples formas de respuesta y cada petición envía el mismo parámetro con varios nombres.

Esa tolerancia tiene una contrapartida grave:

> **Una respuesta con forma no reconocida se convierte en lista vacía, no en error.** La pantalla muestra «Sin registros», indistinguible de una tabla realmente vacía.

Es decir: **un cambio de contrato del backend puede pasar completamente inadvertido**. Sin pruebas de contrato, no hay ningún mecanismo que lo detecte.

## El obstáculo principal

**No hay especificación OpenAPI del backend accesible desde este repositorio.** Sin contrato ejecutable no se pueden generar tipos ni validar automáticamente.

Existen `docs/endpoints/endpoints.md` y `docs/validation/frontend-checks-catalog.json` como documentación previa, pero no son contratos verificables.

## Qué se puede hacer hoy, sin OpenAPI

Estas pruebas **no requieren backend** y cubren la parte más frágil: la interpretación de la respuesta.

| # | Objetivo | Qué verificar | Casos |
| --- | --- | --- | ---: |
| 1 | `normalizeListResult` | Las **10 formas de respuesta aceptadas**: array directo, `rows`, `items`, `results`, `records`, `data`, y los anidados bajo `data.*` incluido `data.detalle`. Y la paginación en `meta`, `pagination`, `paging` | ~15 |
| 2 | `normalizeListResult` — caso crítico | Que una forma **desconocida** produzca lista vacía, documentando ese comportamiento como intencional | 2 |
| 3 | `appendQuery` | Que emita `q`/`search`/`term`, los cuatro parámetros de visibilidad, y `filter_<clave>`; que la heurística de «un solo filtro de texto → también `q`» funcione | ~10 |
| 4 | `resolveOnlyActiveFilter` | Que solo pida activos cuando el usuario lo eligió explícitamente | 5 |
| 5 | `normalizeBatchValidationResponse` | Alias en español e inglés; **que un estado desconocido se clasifique como válido**, comportamiento actual que conviene fijar por prueba | ~10 |
| 6 | `buildStoredSessionFromLoginResponse` | Las **9 posiciones del token** y los alias de cada campo del usuario; que lance si no hay token | ~15 |
| 7 | `normalizeRecordResponse` | `data` presente, ausente, y respuesta no objeto | 3 |

**~60 casos, todos sobre funciones puras ya exportadas, sin tocar la configuración de Jest.**

## Qué requeriría infraestructura

| Objetivo | Necesita |
| --- | --- |
| Probar `httpClient` (cabeceras, saneado de errores, borrado de sesión ante 401) | Mock de `fetch` (posible con Jest, sin dependencias) |
| Probar servicios completos | MSW u otro simulador de red |
| Verificar el contrato **real** contra el backend | **OpenAPI del backend** |
| Detectar drift automáticamente | OpenAPI + generación de tipos en CI |

## Drift ya detectado sin pruebas

La auditoría documental encontró seis divergencias solo leyendo el código. Con pruebas de contrato, tres de ellas se detectarían automáticamente:

| ID | Drift | ¿Lo detectaría una prueba de contrato? |
| --- | --- | --- |
| D-01 | Endpoints de batch invocados sin declarar ni verificar su existencia | ✅ Con OpenAPI |
| D-02 | `/api/infraestructura/aula` sin recurso correspondiente | ✅ Con OpenAPI |
| D-03 | Singular/plural en archivos de transacción | ✅ Con OpenAPI |
| D-04 | `link_achivo` con errata, marcado obligatorio | ⚠️ Solo con OpenAPI |
| D-05 | `venta-clase` usa el mismo endpoint para listar y crear | ✅ Verificable hoy con una prueba de la definición |
| D-06 | Los 5 recursos de seguridad con `permissions: ""` | ✅ Verificable hoy |

Mientras no haya OpenAPI, `scripts/check-api-contract-drift.mjs` cubre parcialmente el hueco: compara los endpoints literales del código con los documentados.

## Recomendación

1. **Ahora:** escribir los ~60 casos de normalización listados arriba. No requieren nada nuevo.
2. **Ahora:** ejecutar `node scripts/check-api-contract-drift.mjs` en cada PR que toque servicios.
3. **Cuando el backend publique OpenAPI:** generar tipos, validar en CI y retirar los alias obsoletos de los mappers.

Ver [strategy.md](strategy.md).
