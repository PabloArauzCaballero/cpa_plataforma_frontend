# Fix v11 - Normalización de listados CRUD

## Problema detectado

Algunos endpoints del backend CPA sí devolvían registros correctamente, por ejemplo:

```json
{
  "success": true,
  "message": "grupo_cuenta listado correctamente.",
  "data": {
    "count": 3,
    "rows": [
      { "id_grupo_cuenta": "4", "codigo": "WF.TEST.ACTIVO" }
    ],
    "limit": 20,
    "offset": 0
  },
  "pagination": {
    "count": 3,
    "limit": 20,
    "offset": 0
  }
}
```

El frontend mostraba `0 de 0 registros` porque el normalizador solo leía `data.items`, `response.rows`, `response.items` o arrays directos, pero no contemplaba el formato real principal del backend:

```ts
response.data.rows
```

## Corrección aplicada

Se actualizó:

```txt
src/features/resources/services/resourceMapper.ts
```

Ahora `normalizeListResponse` reconoce:

- `[]`
- `{ rows: [] }`
- `{ items: [] }`
- `{ results: [] }`
- `{ records: [] }`
- `{ data: [] }`
- `{ data: { rows: [] } }`
- `{ data: { items: [] } }`
- `{ data: { results: [] } }`
- `{ data: { records: [] } }`

Esto corrige listados como `contabilidad/grupo-cuenta` y también beneficia los selects FK que cargan opciones con GET.

## Validación

Se ejecutó correctamente:

```bash
npm run build
```
