# Validación de formularios

Las reglas de validación se derivan de `docs/validation/frontend-checks-catalog.json`, `docs/endpoints/endpoints.md` y `docs/db/ddl.sql`.

Los formularios no deben inventar campos ni checks. Deben usar la metadata de `resourceFieldCatalog.ts` y esta capa compartida antes de serializar payloads.
