import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faBoxArchive,
  faCircleExclamation,
  faCloudArrowUp,
  faCopy,
  faFile,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFileWord,
  faLink,
  faMagnifyingGlass,
  faRotateRight,
  faServer,
} from '@fortawesome/free-solid-svg-icons';
import { uploadSingleFile } from '@/shared/services/cloudinaryUpload';
import type { ServerFileRecord } from '../domain/ServerFile';
import { listServerFiles, registerServerFile, registerTransactionFile } from '../services/fileServerApi';
import styles from './FileLibraryPage.module.css';

const DEFAULT_LIMIT = 24;
const FILE_FOLDER = 'cpa/archivo-general';

type UploadMode = 'archivo' | 'transaccion';

function resolveFileUrl(file: ServerFileRecord): string {
  return String(file.url_archivo ?? file.link_archivo ?? '');
}

function resolveFileName(file: ServerFileRecord): string {
  const metadata = (typeof file.metadata_json === 'object' && file.metadata_json !== null ? file.metadata_json : {}) as Record<string, unknown>;
  return String(file.nombre_archivo || metadata.original_name || metadata.originalName || `Archivo ${file.id_archivo ?? ''}`).trim();
}

function resolveSizeLabel(value: unknown): string {
  const bytes = Number(value);
  if (!Number.isFinite(bytes) || bytes <= 0) return 'Sin tamaño';
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function isImage(file: ServerFileRecord): boolean {
  const mime = String(file.tipo_mime ?? '').toLowerCase();
  const url = resolveFileUrl(file).toLowerCase();
  return mime.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(url);
}

function iconForFile(file: ServerFileRecord) {
  const mime = String(file.tipo_mime ?? '').toLowerCase();
  const url = resolveFileUrl(file).toLowerCase();
  if (isImage(file)) return faFileImage;
  if (mime.includes('pdf') || url.endsWith('.pdf')) return faFilePdf;
  if (mime.includes('spreadsheet') || mime.includes('excel') || /\.(xlsx?|csv)(\?|$)/i.test(url)) return faFileExcel;
  if (mime.includes('word') || /\.(docx?|rtf)(\?|$)/i.test(url)) return faFileWord;
  return faFile;
}

function normalizeLocalSearch(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function FileLibraryPage() {
  const [files, setFiles] = useState<ServerFileRecord[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [provider, setProvider] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [uploadMode, setUploadMode] = useState<UploadMode>('archivo');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [associationType, setAssociationType] = useState('SOPORTE');

  const filteredFiles = useMemo(() => {
    const term = normalizeLocalSearch(query);
    if (!term) return files;
    return files.filter((file) => {
      const content = [
        resolveFileName(file),
        file.descripcion,
        file.tipo_mime,
        file.storage_provider,
        resolveFileUrl(file),
      ].join(' ');
      return normalizeLocalSearch(content).includes(term);
    });
  }, [files, query]);

  const totalPages = Math.max(1, Math.ceil(Math.max(count, files.length) / DEFAULT_LIMIT));

  async function loadFiles(nextPage = page) {
    setIsLoading(true);
    setError(null);
    try {
      const result = await listServerFiles({ page: nextPage, limit: DEFAULT_LIMIT, q: query, provider });
      setFiles(result.records as ServerFileRecord[]);
      setCount(result.count);
      setPage(result.page || nextPage);
    } catch (caught) {
      const resolved = caught instanceof Error ? caught.message : 'No se pudo cargar la biblioteca de archivos.';
      setError(resolved);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadFiles(1);
    }, 700);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, provider]);

  useEffect(() => {
    void loadFiles(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpload() {
    if (!selectedFile) {
      setError('Selecciona un archivo antes de subirlo.');
      return;
    }

    if (uploadMode === 'transaccion' && !Number(transactionId)) {
      setError('Para asociar a una transacción debes indicar un ID de transacción válido.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setMessage(null);

    try {
      const cloudinary = await uploadSingleFile(selectedFile, { folder: FILE_FOLDER });
      const basePayload = {
        nombre_archivo: selectedFile.name,
        descripcion: description.trim() || undefined,
        url_archivo: cloudinary.url,
        tipo_mime: selectedFile.type || undefined,
        tamano_bytes: selectedFile.size,
        storage_provider: 'CLOUDINARY',
        storage_key: cloudinary.publicId,
        metadata_json: {
          original_name: selectedFile.name,
          resource_type: cloudinary.resourceType,
          format: cloudinary.format,
          width: cloudinary.width,
          height: cloudinary.height,
        },
      };

      if (uploadMode === 'transaccion') {
        await registerTransactionFile({
          ...basePayload,
          id_transaccion: Number(transactionId),
          tipo_asociacion: associationType,
          observacion: description.trim() || undefined,
        });
        setMessage('Archivo subido y asociado a la transacción correctamente.');
      } else {
        await registerServerFile(basePayload);
        setMessage('Archivo subido y registrado correctamente.');
      }

      setSelectedFile(null);
      setDescription('');
      setTransactionId('');
      await loadFiles(1);
    } catch (caught) {
      const resolved = caught instanceof Error ? caught.message : 'No se pudo subir o registrar el archivo.';
      setError(resolved);
    } finally {
      setIsUploading(false);
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setMessage('Enlace copiado al portapapeles.');
    } catch {
      setError('No se pudo copiar el enlace. Abre el archivo y copia la URL manualmente.');
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>Contabilidad · archivos</span>
          <h2>Biblioteca de archivos</h2>
          <p>
            Sube comprobantes, contratos, planillas o respaldos y visualiza los archivos registrados en el servidor de archivos.
          </p>
        </div>
        <div className={styles.heroBadge}>
          <FontAwesomeIcon icon={faServer} />
          <strong>{count}</strong>
          <small>archivo(s) registrados</small>
        </div>
      </section>

      <section className={styles.uploadPanel}>
        <div className={styles.panelHeader}>
          <div>
            <h3><FontAwesomeIcon icon={faCloudArrowUp} /> Subir archivo</h3>
            <p>El archivo se sube al storage configurado y luego se registra en base de datos con su URL segura.</p>
          </div>
          <div className={styles.modeSwitch}>
            <button type="button" className={uploadMode === 'archivo' ? styles.activeMode : ''} onClick={() => setUploadMode('archivo')}>
              Solo registrar archivo
            </button>
            <button type="button" className={uploadMode === 'transaccion' ? styles.activeMode : ''} onClick={() => setUploadMode('transaccion')}>
              Asociar a transacción
            </button>
          </div>
        </div>

        <div className={styles.uploadGrid}>
          <label className={styles.fileDrop}>
            <FontAwesomeIcon icon={faBoxArchive} />
            <strong>{selectedFile ? selectedFile.name : 'Seleccionar archivo'}</strong>
            <small>{selectedFile ? resolveSizeLabel(selectedFile.size) : 'PDF, imagen, Excel, Word u otro respaldo válido.'}</small>
            <input type="file" onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} />
          </label>

          <label>
            Descripción
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Ejemplo: Comprobante de pago, contrato, planilla o respaldo contable." />
          </label>

          {uploadMode === 'transaccion' ? (
            <>
              <label>
                ID transacción
                <input type="number" min="1" value={transactionId} onChange={(event) => setTransactionId(event.target.value)} placeholder="Ejemplo: 125" />
              </label>
              <label>
                Tipo de asociación
                <select value={associationType} onChange={(event) => setAssociationType(event.target.value)}>
                  <option value="SOPORTE">Soporte</option>
                  <option value="COMPROBANTE">Comprobante</option>
                  <option value="CONTRATO">Contrato</option>
                  <option value="RESPALDO">Respaldo</option>
                  <option value="OTRO">Otro</option>
                </select>
              </label>
            </>
          ) : null}
        </div>

        <div className={styles.actionsRow}>
          <button type="button" onClick={() => void handleUpload()} disabled={isUploading}>
            <FontAwesomeIcon icon={faCloudArrowUp} />
            {isUploading ? 'Subiendo...' : 'Subir y registrar'}
          </button>
        </div>
      </section>

      <section className={styles.libraryPanel}>
        <div className={styles.panelHeader}>
          <div>
            <h3><FontAwesomeIcon icon={faFile} /> Archivos registrados</h3>
            <p>Consulta, abre y copia enlaces de los archivos que ya existen en el servidor.</p>
          </div>
          <button type="button" onClick={() => void loadFiles(page)} disabled={isLoading} className={styles.secondaryButton}>
            <FontAwesomeIcon icon={faRotateRight} /> Actualizar
          </button>
        </div>

        <div className={styles.filters}>
          <label>
            Buscar
            <div className={styles.inputIcon}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre, descripción, proveedor o URL" />
            </div>
          </label>
          <label>
            Proveedor
            <select value={provider} onChange={(event) => setProvider(event.target.value)}>
              <option value="">Todos</option>
              <option value="CLOUDINARY">Cloudinary</option>
              <option value="LOCAL">Local</option>
              <option value="S3">S3</option>
            </select>
          </label>
        </div>

        {message ? <div className={styles.success}>{message}</div> : null}
        {error ? <div className={styles.error}><FontAwesomeIcon icon={faCircleExclamation} /> {error}</div> : null}

        {isLoading ? <div className={styles.empty}>Cargando archivos...</div> : null}

        {!isLoading && filteredFiles.length === 0 ? (
          <div className={styles.empty}>No hay archivos para mostrar con los filtros actuales.</div>
        ) : null}

        <div className={styles.fileGrid}>
          {filteredFiles.map((file) => {
            const url = resolveFileUrl(file);
            const name = resolveFileName(file);
            return (
              <article key={String(file.id_archivo ?? url)} className={styles.fileCard}>
                <div className={styles.preview}>
                  {isImage(file) && url ? <img src={url} alt={name} loading="lazy" /> : <FontAwesomeIcon icon={iconForFile(file)} />}
                </div>
                <div className={styles.fileBody}>
                  <h4>{name}</h4>
                  <p>{file.descripcion || 'Sin descripción registrada.'}</p>
                  <div className={styles.metaGrid}>
                    <span>{file.tipo_mime || 'Tipo no informado'}</span>
                    <span>{resolveSizeLabel(file.tamano_bytes)}</span>
                    <span>{file.storage_provider || 'Proveedor no informado'}</span>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  {url ? (
                    <a href={url} target="_blank" rel="noreferrer">
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} /> Abrir
                    </a>
                  ) : null}
                  {url ? (
                    <button type="button" onClick={() => void copyUrl(url)}>
                      <FontAwesomeIcon icon={faCopy} /> Copiar
                    </button>
                  ) : null}
                  {url ? (
                    <span title={url} className={styles.urlHint}>
                      <FontAwesomeIcon icon={faLink} /> Enlace disponible
                    </span>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.pagination}>
          <button type="button" disabled={page <= 1 || isLoading} onClick={() => void loadFiles(page - 1)}>Anterior</button>
          <span>Página {page} de {totalPages}</span>
          <button type="button" disabled={page >= totalPages || isLoading} onClick={() => void loadFiles(page + 1)}>Siguiente</button>
        </div>
      </section>
    </div>
  );
}
