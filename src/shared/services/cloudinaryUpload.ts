const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_DEFAULT_FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER || '';
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

function assertCloudinaryConfig() {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error('Falta configurar VITE_CLOUDINARY_CLOUD_NAME.');
  }

  if (!CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Falta configurar VITE_CLOUDINARY_UPLOAD_PRESET.');
  }
}

function validateImageFile(file: File) {
  if (!file) throw new Error('No se envió ningún archivo.');

  if (!String(file.type || '').startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen válida.');
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('La imagen excede el límite de 10 MB.');
  }
}

function resolveFolder(folder?: string) {
  const chosen = (folder || CLOUDINARY_DEFAULT_FOLDER || '').trim();
  return chosen || undefined;
}

export async function uploadSingleImage(file: File, { folder }: { folder?: string } = {}): Promise<CloudinaryUploadResult> {
  assertCloudinaryConfig();
  validateImageFile(file);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const resolvedFolder = resolveFolder(folder);
  if (resolvedFolder) {
    formData.append('folder', resolvedFolder);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });
  } catch {
    throw new Error('No se pudo subir la imagen a Cloudinary por un problema de red.');
  }

  let body: Record<string, unknown> | null = null;
  try {
    body = (await response.json()) as Record<string, unknown>;
  } catch {
    body = null;
  }

  if (!response.ok) {
    const errorBody = body?.error as { message?: string } | undefined;
    const detail = errorBody?.message || 'Revisa el upload preset y la configuración de Cloudinary.';
    throw new Error(`Cloudinary rechazó la subida. ${detail}`);
  }

  if (!body?.secure_url) {
    throw new Error('Cloudinary no devolvió una URL usable para la imagen.');
  }

  return {
    url: String(body.secure_url),
    publicId: String(body.public_id ?? ''),
    width: typeof body.width === 'number' ? body.width : undefined,
    height: typeof body.height === 'number' ? body.height : undefined,
    format: typeof body.format === 'string' ? body.format : undefined,
  };
}

export async function uploadMultipleImages(files: FileList | File[], { folder }: { folder?: string } = {}): Promise<string[]> {
  const list = Array.from(files || []).filter(Boolean);
  if (list.length === 0) return [];

  const uploads = await Promise.all(list.map((file) => uploadSingleImage(file, { folder })));
  return uploads.map((item) => item.url);
}
