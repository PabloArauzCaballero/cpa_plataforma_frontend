# ADR-0010: Subida de archivos directa del navegador a Cloudinary

## Estado
**Aceptado**, con un riesgo abierto que no es corregible desde este repositorio.

## Contexto
La plataforma necesita adjuntar comprobantes, imágenes y documentos a transacciones contables, y ofrecer una biblioteca de archivos.

## Fuerzas y restricciones
- El backend no debería gastar ancho de banda ni almacenamiento en binarios.
- Se necesitan previsualizaciones y transformaciones de imagen.
- El despliegue es estático: no hay servidor propio que pueda firmar subidas.

## Opciones consideradas
| Opción | Ventaja | Inconveniente |
| --- | --- | --- |
| **A. Subida directa con unsigned preset** | Sin carga en el backend; sencillo | **El preset es público**: cualquiera puede subir |
| B. Subida a través del backend | Control de acceso completo | El backend soporta el tráfico y el almacenamiento |
| C. Subida directa con firma del backend | Control de acceso + sin carga de tráfico | Requiere un endpoint de firma en el backend |

## Decisión
**Opción A.** `shared/services/cloudinaryUpload.ts` sube directamente a `api.cloudinary.com` con un *unsigned upload preset*; después, `fileServerApi` registra la URL en el backend.

Límites aplicados en el cliente: **10 MB** para imágenes (con validación de tipo MIME) y **25 MB** para archivos genéricos (sin validación de tipo).

## Consecuencias positivas
- El backend no procesa binarios.
- Cloudinary aporta CDN, transformaciones y previsualizaciones sin trabajo adicional.
- Mensajes de error claros y accionables para cada modo de fallo.
- Implementación pequeña y contenida: 164 líneas.

## Consecuencias negativas
- **El preset viaja en el bundle público.** Cualquiera puede subir archivos a la cuenta **sin tener sesión en la plataforma**.
- **`uploadSingleFile` no valida el tipo MIME**: acepta cualquier extensión.
- **Los límites del cliente son evitables**: quien use el preset directamente no pasa por este código.
- **La operación no es atómica**: si Cloudinary acepta el archivo y falla el registro en el backend, queda un binario huérfano. No hay compensación ni reintento.
- Las URLs resultantes son **públicas**: un comprobante con datos personales es accesible por su URL.
- `uploadMultipleImages` usa `Promise.all`: si una falla, rechaza el conjunto, pero las ya subidas permanecen.

## Riesgos
| Riesgo | Severidad | Mitigación posible |
| --- | --- | --- |
| Abuso del preset para subir contenido arbitrario | 🟠 **Alto** | **Solo en el panel de Cloudinary**: restringir formatos, tamaño, carpeta obligatoria, moderación. **No corregible desde este repositorio** |
| Agotamiento de cuota de la cuenta | 🟡 Medio | Ídem |
| Documentos con datos personales accesibles por URL | 🟡 Medio | Entrega firmada o de acceso restringido |
| Binarios huérfanos | 🟢 Bajo | Conciliación periódica |

## Evidencia
`src/shared/services/cloudinaryUpload.ts`, `src/features/files/services/fileServerApi.ts`, `src/features/files/pages/FileLibraryPage.tsx:293-311`, `.env.example`, [almacenamiento de archivos](../integrations/file-storage.md).

## Plan de revisión
**Revisar si** el volumen o la sensibilidad de los archivos crece. La opción C (firma desde el backend) conserva la ventaja de no cargar el backend con tráfico y elimina el riesgo principal; requiere un endpoint de firma.

**Acción inmediata, independiente del código:** verificar y endurecer la configuración del preset en el panel de Cloudinary. Es la única mitigación disponible hoy.
