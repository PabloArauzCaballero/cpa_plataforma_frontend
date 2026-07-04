# v42 - Borradores respaldados por sistema

## Objetivo

El frontend deja de tratar los borradores como un mecanismo únicamente local. Cuando el sistema expone `administracion.registro_borrador`, los formularios guardan avances en base de datos y solo usan `localStorage` como respaldo de emergencia.

## Endpoint usado

```http
POST  /api/administracion/registro-borrador
GET   /api/administracion/registro-borrador
PATCH /api/administracion/registro-borrador/:id_borrador
```

## Payload

```json
{
  "modulo": "personas",
  "recurso": "estudiante",
  "operacion": "create",
  "titulo": "Nuevo registro - Estudiante",
  "payload_json": {},
  "ids_json": {},
  "metadata_json": {
    "pantalla": "frontend-react",
    "version_frontend": "1.1.28"
  },
  "estado_borrador": "BORRADOR",
  "clave_cliente": "frontend:personas:estudiante:create:new"
}
```

## Reglas

- No se insertan formularios incompletos en las tablas finales.
- El borrador se guarda en `registro-borrador`.
- Si la API falla, se deja un respaldo local sanitizado.
- Cargar borrador prioriza sistema y luego respaldo local.
- Eliminar borrador marca `estado_borrador = DESCARTADO`.
- Transacciones también guardan encabezado y movimientos como borrador sin crear asiento final.
