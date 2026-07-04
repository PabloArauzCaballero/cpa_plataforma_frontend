# v51 - Carpetas Cloudinary en biblioteca de archivos

## Objetivo

Agregar una experiencia visual para crear carpetas lógicas dentro de la biblioteca de archivos y usarlas como destino de subida en Cloudinary.

## Decisión técnica

Cloudinary no crea carpetas vacías desde el flujo unsigned upload del frontend. La carpeta se materializa cuando se sube el primer archivo usando el parámetro `folder`.

Por eso la UI permite:

- crear una carpeta lógica en la biblioteca;
- seleccionar la carpeta destino antes de subir;
- enviar el archivo a Cloudinary con `folder`;
- guardar en `metadata_json` la carpeta usada:
  - `folder`,
  - `cloudinary_folder`,
  - `folder_label`,
  - `carpeta`.

## Cambios frontend

- Nueva sección visual **Crear carpeta** en `Biblioteca de archivos`.
- Selector de **Carpeta destino** para cada subida.
- Filtro por carpeta en la biblioteca.
- Chips visuales de carpetas.
- Badge de carpeta en cada tarjeta de archivo.
- Las carpetas locales se guardan en `localStorage` hasta que existan archivos registrados con metadata de carpeta.

## Sistema

No se inventó endpoint nuevo. Se mantiene el contrato actual:

- `POST /api/contabilidad/archivo/registrar`
- `POST /api/contabilidad/archivo-transaccion/registrar`

La carpeta viaja dentro de `metadata_json` y el path real queda en el `public_id`/`storage_key` de Cloudinary.
