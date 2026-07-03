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
  faFolder,
  faFolderOpen,
  faFolderPlus,
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
const FILE_FOLDER = import.meta.env.VITE_CLOUDINARY_LIBRARY_ROOT_FOLDER || import.meta.env.VITE_CLOUDINARY_FOLDER || 'cpa/archivos';
const FOLDERS_STORAGE_KEY = 'cpa.fileLibrary.folders.v1';

type UploadMode = 'archivo' | 'transaccion';

interface StorageFolder {
  label: string;
  path: string;
  createdAt: string;
}

function resolveMetadata(file: ServerFileRecord): Record<string, unknown> {
  if (!file.metadata_json) return {};
  if (typeof file.metadata_json === 'string') {
    try {
      const parsed = JSON.parse(file.metadata_json) as unknown;
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
    } catch {
      return {};
    }
  }
  return typeof file.metadata_json === 'object' && !Array.isArray(file.metadata_json) ? file.metadata_json : {};
}

function resolveFileUrl(file: ServerFileRecord): string {
  return String(file.url_archivo ?? file.link_archivo ?? '');
}

function resolveFileName(file: ServerFileRecord): string {
  const metadata = resolveMetadata(file);
  return String(file.nombre_archivo || metadata.original_name || metadata.originalName || `Archivo ${file.id_archivo ?? ''}`).trim();
}

function resolveFolderPath(file: ServerFileRecord): string {
  const metadata = resolveMetadata(file);
  const folderFromMetadata = String(metadata.folder || metadata.cloudinary_folder || metadata.storage_folder || '').trim();
  if (folderFromMetadata) return folderFromMetadata;

  const publicId = String(file.storage_key || '').trim();
  if (publicId.includes('/')) return publicId.split('/').slice(0, -1).join('/');

  return FILE_FOLDER;
}

function resolveFolderLabel(file: ServerFileRecord): string {
  const metadata = resolveMetadata(file);
  const label = String(metadata.folder_label || metadata.carpeta || '').trim();
  if (label) return label;
  const path = resolveFolderPath(file);
  return path.replace(`${FILE_FOLDER}/`, '') || 'Raíz';
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

function slugifyFolderSegment(value: string): string {
  return normalizeLocalSearch(value)
    .replace(/[^a-z0-9/_ -]/g, '')
    .replace(/[ _]+/g, '-')
    .replace(/\/{2,}/g, '/')
    .replace(/^-+|-+$/g, '')
    .replace(/\/-(?=\/)/g, '')
    .replace(/\/+/g, '/');
}

function normalizeFolderInput(value: string): StorageFolder {
  const label = value.trim().replace(/\s+/g, ' ');
  if (!label) throw new Error('Escribe un nombre de carpeta.');

  const slug = slugifyFolderSegment(label);
  if (!slug) throw new Error('El nombre de carpeta debe incluir letras o números.');

  const path = slug.startsWith(FILE_FOLDER) ? slug : `${FILE_FOLDER}/${slug}`;
  return { label, path, createdAt: new Date().toISOString() };
}

function readStoredFolders(): StorageFolder[] {
  try {
    const raw = window.localStorage.getItem(FOLDERS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) as unknown : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is StorageFolder => Boolean(item && typeof item === 'object' && 'path' in item && 'label' in item))
      .map((item) => ({ label: String(item.label), path: String(item.path), createdAt: String(item.createdAt || new Date().toISOString()) }));
  } catch {
    return [];
  }
}

function writeStoredFolders(folders: StorageFolder[]) {
  window.localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
}

function mergeFolders(localFolders: StorageFolder[], files: ServerFileRecord[]): StorageFolder[] {
  const map = new Map<string, StorageFolder>();
  map.set(FILE_FOLDER, { label: 'Raíz', path: FILE_FOLDER, createdAt: 'system' });

  for (const folder of localFolders) {
    map.set(folder.path, folder);
  }

  for (const file of files) {
    const path = resolveFolderPath(file);
    if (!path) continue;
    map.set(path, {
      label: resolveFolderLabel(file),
      path,
      createdAt: 'backend',
    });
  }

  return Array.from(map.values()).sort((left, right) => {
    if (left.path === FILE_FOLDER) return -1;
    if (right.path === FILE_FOLDER) return 1;
    return left.label.localeCompare(right.label, 'es');
  });
}

export function FileLibraryPage() {
  const [files, setFiles] = useState<ServerFileRecord[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [provider, setProvider] = useState('');
  const [folderFilter, setFolderFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [uploadMode, setUploadMode] = useState<UploadMode>('archivo');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [associationType, setAssociationType] = useState('SOPORTE');
  const [folders, setFolders] = useState<StorageFolder[]>(() => readStoredFolders());
  const [selectedFolderPath, setSelectedFolderPath] = useState(FILE_FOLDER);
  const [newFolderName, setNewFolderName] = useState('');

  const availableFolders = useMemo(() => mergeFolders(folders, files), [files, folders]);
  const selectedFolder = availableFolders.find((folder) => folder.path === selectedFolderPath) ?? availableFolders[0];

  const filteredFiles = useMemo(() => {
    const term = normalizeLocalSearch(query);
    return files.filter((file) => {
      const folderPath = resolveFolderPath(file);
      if (folderFilter && folderPath !== folderFilter) return false;

      if (!term) return true;
      const content = [
        resolveFileName(file),
        file.descripcion,
        file.tipo_mime,
        file.storage_provider,
        resolveFileUrl(file),
        resolveFolderLabel(file),
        resolveFolderPath(file),
      ].join(' ');
      return normalizeLocalSearch(content).includes(term);
    });
  }, [files, folderFilter, query]);

  const totalPages = Math.max(1, Math.ceil(Math.max(count, files.length) / DEFAULT_LIMIT));

  async function loadFiles(nextPage = page) {
    setIsLoading(true);
    setError(null);
    try {
      const result = await listServerFiles({ page: nextPage, limit: DEFAULT_LIMIT, q: query, provider, folder: folderFilter });
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
  }, [query, provider, folderFilter]);

  useEffect(() => {
    void loadFiles(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCreateFolder() {
    setError(null);
    setMessage(null);
    try {
      const folder = normalizeFolderInput(newFolderName);
      const exists = folders.some((item) => item.path === folder.path) || folder.path === FILE_FOLDER;
      if (exists) {
        setSelectedFolderPath(folder.path);
        setMessage('La carpeta ya existe y quedó seleccionada para la próxima subida.');
        setNewFolderName('');
        return;
      }

      const nextFolders = [...folders, folder].sort((left, right) => left.label.localeCompare(right.label, 'es'));
      setFolders(nextFolders);
      writeStoredFolders(nextFolders);
      setSelectedFolderPath(folder.path);
      setMessage('Carpeta creada en la biblioteca. Se materializará en Cloudinary cuando subas el primer archivo ahí.');
      setNewFolderName('');
    } catch (caught) {
      const resolved = caught instanceof Error ? caught.message : 'No se pudo crear la carpeta.';
      setError(resolved);
    }
  }

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
      const folderPath = selectedFolder?.path || FILE_FOLDER;
      const folderLabel = selectedFolder?.label || 'Raíz';
      const cloudinary = await uploadSingleFile(selectedFile, { folder: folderPath });
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
          folder: folderPath,
          cloudinary_folder: folderPath,
          folder_label: folderLabel,
          carpeta: folderLabel,
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
            Sube comprobantes, contratos, planillas o respaldos y organiza los archivos en carpetas del storage configurado.
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
            <p>El archivo se sube al storage configurado y se registra en base de datos con su URL segura y carpeta.</p>
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

        <div className={styles.folderPanel}>
          <div>
            <h4><FontAwesomeIcon icon={faFolderPlus} /> Crear carpeta</h4>
            <p>Las carpetas de Cloudinary se crean cuando subes el primer archivo dentro de ellas.</p>
          </div>
          <div className={styles.folderCreator}>
            <input
              value={newFolderName}
              onChange={(event) => setNewFolderName(event.target.value)}
              placeholder="Ejemplo: Comprobantes / Julio 2026"
            />
            <button type="button" onClick={handleCreateFolder}>
              <FontAwesomeIcon icon={faFolderPlus} /> Crear carpeta
            </button>
          </div>
        </div>

        <div className={styles.uploadGrid}>
          <label>
            Carpeta destino
            <select value={selectedFolderPath} onChange={(event) => setSelectedFolderPath(event.target.value)}>
              {availableFolders.map((folder) => (
                <option key={folder.path} value={folder.path}>{folder.label}</option>
              ))}
            </select>
            <small className={styles.fieldHint}>{selectedFolder?.path || FILE_FOLDER}</small>
          </label>

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
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre, descripción, carpeta, proveedor o URL" />
            </div>
          </label>
          <label>
            Carpeta
            <select value={folderFilter} onChange={(event) => setFolderFilter(event.target.value)}>
              <option value="">Todas</option>
              {availableFolders.map((folder) => (
                <option key={folder.path} value={folder.path}>{folder.label}</option>
              ))}
            </select>
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

        <div className={styles.folderSummary}>
          {availableFolders.map((folder) => (
            <button
              key={folder.path}
              type="button"
              className={folderFilter === folder.path ? styles.activeFolderChip : ''}
              onClick={() => setFolderFilter(folderFilter === folder.path ? '' : folder.path)}
              title={folder.path}
            >
              <FontAwesomeIcon icon={folder.path === FILE_FOLDER ? faFolderOpen : faFolder} /> {folder.label}
            </button>
          ))}
        </div>

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
                  <span className={styles.folderBadge}><FontAwesomeIcon icon={faFolderOpen} /> {resolveFolderLabel(file)}</span>
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
