# Integración Cloudinary - Archivos Transacción

## Objetivo

En el recurso **Contabilidad > Archivos Transacción**, el usuario ya no debe escribir manualmente el enlace del comprobante.

El flujo correcto es:

1. El usuario selecciona una imagen.
2. El frontend sube la imagen a Cloudinary usando un upload preset unsigned.
3. Cloudinary devuelve `secure_url`.
4. El frontend coloca esa URL en el payload como:
   - `link_achivo`
   - `link_archivo`
5. El backend recibe el link y guarda el registro normalmente.

## Variables requeridas

```env
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
VITE_CLOUDINARY_FOLDER=cpa/archivos-transaccion
```

## Archivos modificados

- `src/shared/services/cloudinaryUpload.ts`
- `src/features/resources/components/CloudinaryUploadField.tsx`
- `src/features/resources/components/CloudinaryUploadField.module.css`
- `src/features/resources/components/ResourceForm.tsx`
- `src/features/resources/hooks/useResourceFormViewModel.ts`
- `.env.example`
- `prompt/programacionFrontend.md`

## Validaciones

- Solo acepta imágenes.
- Máximo 10 MB.
- Requiere `VITE_CLOUDINARY_CLOUD_NAME`.
- Requiere `VITE_CLOUDINARY_UPLOAD_PRESET`.
- Muestra mensaje claro si Cloudinary rechaza la subida.

## Nota sobre `link_achivo`

El backend conserva el campo histórico `link_achivo`. Para compatibilidad, el frontend envía tanto `link_achivo` como `link_archivo` con la misma URL cuando se sube la imagen.
