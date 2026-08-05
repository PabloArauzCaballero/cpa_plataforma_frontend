# Ruta `/contabilidad/archivos`

| | |
|---|---|
| **Patrón** | `/contabilidad/archivos` (fija) |
| **Componente** | `FileLibraryPage` |
| **Archivo** | `src/features/files/pages/FileLibraryPage.tsx` (605 líneas — la página más extensa) |
| **Servicios** | `features/files/services/fileServerApi.ts`, `shared/services/cloudinaryUpload.ts` |
| **Layout** | `AppShell` |

## Propósito de negocio

Biblioteca visual de archivos: subir comprobantes, imágenes y documentos, organizarlos en carpetas, buscarlos y asociarlos a transacciones contables.

## Acceso y permisos

- Protegida por `ProtectedRoute`.
- **No evalúa permisos** en el frontend.
- Enlace visible en la barra lateral dentro del módulo `contabilidad` (`AppShell.tsx:117-120`).

## Flujo de usuario

### Subida

1. El usuario elige modo (`uploadMode`: `archivo` u otro), archivo, descripción y carpeta destino.
2. `handleUpload()` (línea 293):
   - **Sube el archivo directamente a Cloudinary desde el navegador** — `uploadSingleFile(selectedFile, { folder })`, línea 311. **No pasa por el backend.**
   - Con la URL devuelta, registra el archivo en el backend: `POST /api/contabilidad/archivo/registrar`.
   - Si se indicó `transactionId`, además asocia: `POST /api/contabilidad/archivo-transaccion/registrar` con el `associationType` (por defecto `SOPORTE`).
3. Se recarga el listado.

### Consulta

`loadFiles(page)` → `GET /api/contabilidad/archivo?<query>` con búsqueda (`query`), proveedor (`provider`), carpeta (`folderFilter`) y paginación.

### Carpetas

Las carpetas se guardan **solo en el navegador**:

```ts
const FOLDERS_STORAGE_KEY = 'cpa.fileLibrary.folders.v1';   // línea 32
```

Se leen con `readStoredFolders()` (línea 134) y se escriben en `localStorage` (línea 146).

> **Consecuencia real:** la estructura de carpetas **no es compartida**. Cada usuario, en cada navegador, ve su propia organización. Borrar los datos del sitio la elimina. Las carpetas existen en Cloudinary solo cuando contienen al menos un archivo subido a esa ruta.
>
> Registrado como MEDIUM en [reports/documentation-gap-analysis.md](../reports/documentation-gap-analysis.md) y en [data-and-state/persistence.md](../data-and-state/persistence.md).

## Estados de interfaz

19 `useState` (líneas 175-194). Estados visibles:

| Estado | Variable |
|---|---|
| Cargando listado | `isLoading` |
| Subiendo | `isUploading` |
| Mensaje informativo | `message` |
| Error | `error` |
| Vacío | derivado de `files.length === 0` |
| Confirmación de borrado de carpeta | `folderPendingDelete` |
| Paginación | `page`, `count` |

## Contratos de datos

| Operación | Destino | Servicio |
|---|---|---|
| Listar archivos | `GET /api/contabilidad/archivo?{query}` | `fileServerApi.ts:32` |
| Registrar archivo | `POST /api/contabilidad/archivo/registrar` | `fileServerApi.ts:37` |
| Asociar a transacción | `POST /api/contabilidad/archivo-transaccion/registrar` | `fileServerApi.ts:43` |
| Subir binario | `POST https://api.cloudinary.com/v1_1/{cloud}/auto/upload` | `cloudinaryUpload.ts:120` |

Ninguno de estos tres endpoints del backend forma parte de los 59 recursos CRUD. Nota: el recurso CRUD se llama `archivos-transaccion` (plural, `/api/contabilidad/archivos-transaccion`) mientras esta pantalla usa `/api/contabilidad/archivo-transaccion/registrar` (singular). **Son rutas distintas**; conviene confirmar con backend que ambas existen.

## Integración con Cloudinary

| Aspecto | Valor |
|---|---|
| Modo | *Unsigned upload preset* |
| Variables | `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`, `VITE_CLOUDINARY_LIBRARY_ROOT_FOLDER` |
| Límite en cliente | 25 MB para archivo genérico (`MAX_GENERIC_FILE_SIZE_BYTES`) |
| Validación de tipo | Solo para imágenes (`uploadSingleImage`); `uploadSingleFile` **no valida el tipo MIME** |
| Autenticación | Ninguna. El preset es público por diseño |

> **Riesgo de seguridad SEC-04.** Un preset unsigned permite que cualquiera que lea el bundle suba archivos a la cuenta de Cloudinary, sin sesión en la plataforma. La mitigación no está en el frontend: debe restringirse en el panel de Cloudinary (tipos permitidos, tamaño máximo, carpeta obligatoria, moderación). Ver [security/threat-model.md](../security/threat-model.md#t-06) y [integrations/file-storage.md](../integrations/file-storage.md).

## Componentes

`ConfirmDialog` (borrado de carpeta), `PageState`, y controles nativos. Renderiza su propia rejilla de archivos.

Incluye `copyUrl(url)` (línea 358) que usa la API de portapapeles.

## Analítica

Ninguna.

## Accesibilidad

| Aspecto | Estado |
|---|---|
| Copiar URL | ⚠️ Verificar que la confirmación de copiado se anuncie |
| Rejilla de archivos | ⚠️ Verificar textos alternativos de las previsualizaciones |
| Subida | ❌ Sin barra de progreso accesible; solo estado booleano `isUploading` |
| Confirmación de borrado | ✅ `ConfirmDialog` con `role="alertdialog"` |
| Encabezado | Sin `<h1>` propio |

## Pruebas

Ninguna. Tampoco de `cloudinaryUpload` ni de `fileServerApi`.

## Notas operativas

- **La subida no es atómica.** Si Cloudinary acepta el archivo y luego falla `POST /archivo/registrar`, el binario queda huérfano en Cloudinary sin registro en la base. No hay compensación ni reintento.
- El borrado de una carpeta afecta solo a `localStorage`; **no borra nada en Cloudinary ni en el backend**.
- La subida no es cancelable (no hay `AbortController`).
- Con el CDN de FontAwesome bloqueado, los iconos de tipo de archivo desaparecen.
