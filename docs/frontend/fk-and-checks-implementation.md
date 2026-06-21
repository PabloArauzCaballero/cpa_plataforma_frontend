# Implementación de checks, catálogos y foreign keys

Esta versión del frontend usa una capa de metadatos para que los formularios no inventen campos ni validaciones.

## Fuentes usadas

- `docs/endpoints/endpoints.md`: payloads reales, campos relevantes y obligatoriedad.
- `docs/db/ddl.sql`: enums, foreign keys, tipos y constraints de base de datos.
- `docs/validation/frontend-checks-catalog.json`: reglas de validación normalizadas para el frontend.
- `docs/validation/generated-resource-field-catalog.json`: catálogo generado por recurso/campo.

## Archivos principales

- `src/features/resources/domain/resourceFieldCatalog.ts`: aplica metadatos de checks, selects, enums y relaciones FK sobre los recursos CRUD.
- `src/features/resources/services/lookupApi.ts`: consulta opciones para selects de FK usando GET del recurso relacionado.
- `src/shared/validation/formValidation.ts`: valida payloads antes de enviarlos.
- `src/features/resources/hooks/useResourceFormViewModel.ts`: carga catálogos, opciones FK y serializa payloads limpios.
- `src/features/resources/components/TransactionForm.tsx`: usa selector de cuenta para movimientos contables.

## Reglas implementadas

- FK con endpoint disponible se renderiza como select.
- Enums y catálogos finitos se renderizan como select.
- Números se serializan como number.
- Booleanos se serializan como boolean.
- Campos opcionales vacíos no se envían.
- Fechas inicio/fin se validan antes de guardar.
- Latitud, longitud, email, URL y montos tienen validación previa.
- La UI no muestra endpoints, rutas, tablas, PKs ni token.

## Limitación controlada

Si una FK apunta a una tabla que no tiene endpoint GET documentado, el frontend mantiene fallback controlado. No se inventa una ruta.


## Corrección aplicada para catálogos no definidos como enum PostgreSQL

El frontend debe priorizar `docs/validation/frontend-checks-catalog.json`, especialmente `fieldDefinitions`, antes de asumir que solo los `CREATE TYPE ... AS ENUM` del DDL son catálogos válidos. Si un campo de negocio está guardado como `varchar` o `text`, pero el catálogo define valores finitos, se renderiza como `select` y se valida contra esos valores.

## Ampliación aplicada: catálogos por endpoint y contexto de negocio

Se agregó soporte para `resourceFieldDefinitions` dentro de `docs/validation/frontend-checks-catalog.json` para que campos genéricos como `tipo`, `categoria`, `estado`, `modalidad`, `motivo` o `sub_tipo` no se contaminen entre módulos.

El frontend ahora lee primero el catálogo por recurso/campo, luego las definiciones globales y después los enums/checks generados desde DDL. Esto permite que campos `varchar` o `text` con valores finitos se rendericen como `select` aunque no sean `CREATE TYPE AS ENUM` en PostgreSQL.

Ver detalle en `docs/validation/endpoint-field-catalog-analysis.md`.
