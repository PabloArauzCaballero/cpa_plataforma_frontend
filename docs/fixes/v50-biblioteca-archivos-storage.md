# v50 - Biblioteca gráfica de archivos

Se agregó una pantalla profesional para operar el flujo real de archivos del backend.

## Nueva ruta

```txt
/contabilidad/archivos
```

## Funcionalidades

- Subida visual de archivos usando el storage configurado en Cloudinary.
- Registro posterior en el backend con:
  - `POST /api/contabilidad/archivo/registrar`
- Asociación opcional a una transacción con:
  - `POST /api/contabilidad/archivo-transaccion/registrar`
- Visualización de archivos existentes desde:
  - `GET /api/contabilidad/archivo`
- Vista tipo galería con preview de imágenes, iconos por tipo de archivo, metadatos, copia de enlace y apertura externa.

## Payload alineado al backend

El frontend envía al backend:

```json
{
  "nombre_archivo": "comprobante.pdf",
  "descripcion": "Respaldo contable",
  "url_archivo": "https://...",
  "tipo_mime": "application/pdf",
  "tamano_bytes": 12345,
  "storage_provider": "CLOUDINARY",
  "storage_key": "cpa/archivo-general/...",
  "metadata_json": {}
}
```

Si se asocia a transacción, envía `id_transaccion`, `tipo_asociacion`, `observacion` y el objeto `archivo`.
