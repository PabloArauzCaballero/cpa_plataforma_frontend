import { useState } from 'react';
import { uploadSingleImage } from '@/shared/services/cloudinaryUpload';
import styles from './CloudinaryUploadField.module.css';

interface CloudinaryUploadFieldProps {
  id: string;
  label: string;
  value?: string;
  required?: boolean;
  error?: string;
  folder?: string;
  onUploaded: (url: string) => void;
}

export function CloudinaryUploadField({
  id,
  label,
  value,
  required = false,
  error,
  folder,
  onUploaded,
}: CloudinaryUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleFileChange(file: File | undefined) {
    if (!file) return;

    setFileName(file.name);
    setUploadError(null);
    setIsUploading(true);

    try {
      const result = await uploadSingleImage(file, { folder });
      onUploaded(result.url);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'No se pudo subir la imagen.';
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <label className={styles.field} htmlFor={id}>
      <span>
        {label}
        {required ? <strong> *</strong> : null}
      </span>

      <input
        id={id}
        type="file"
        accept="image/*"
        disabled={isUploading}
        onChange={(event) => void handleFileChange(event.target.files?.[0])}
      />

      <small>
        {isUploading
          ? 'Subiendo imagen a Cloudinary...'
          : fileName
            ? `Archivo seleccionado: ${fileName}`
            : 'Selecciona una imagen. Se subirá a Cloudinary y se guardará su enlace en el formulario.'}
      </small>

      {value ? (
        <a href={value} target="_blank" rel="noreferrer" className={styles.link}>
          Ver imagen subida
        </a>
      ) : null}

      {uploadError ? <small className={styles.error}>{uploadError}</small> : null}
      {error ? <small className={styles.error}>{error}</small> : null}
    </label>
  );
}
