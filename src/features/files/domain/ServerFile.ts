export interface ServerFileRecord {
  id_archivo?: number | string;
  nombre_archivo?: string;
  descripcion?: string;
  url_archivo?: string;
  link_archivo?: string;
  tipo_mime?: string;
  tamano_bytes?: number | string;
  storage_provider?: string;
  storage_key?: string;
  checksum_sha256?: string;
  metadata_json?: Record<string, unknown> | string | null;
  estado_registro?: string;
  fecha_registro?: string;
  fecha_modificacion?: string | null;
}

export interface FileUploadPayload {
  nombre_archivo?: string;
  descripcion?: string;
  url_archivo: string;
  tipo_mime?: string;
  tamano_bytes?: number;
  storage_provider?: string;
  storage_key?: string;
  metadata_json?: Record<string, unknown>;
}

export interface TransactionFilePayload extends FileUploadPayload {
  id_transaccion: number;
  tipo_asociacion?: string;
  observacion?: string;
}

export interface FileListFilters {
  q?: string;
  provider?: string;
  mime?: string;
  page?: number;
  limit?: number;
}
