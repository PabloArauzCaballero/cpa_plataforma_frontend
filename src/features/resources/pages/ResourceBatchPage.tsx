import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { PageState } from '@/shared/components/PageState';
import type { BatchProcessResult, BatchValidationResult, CrudResourceDefinition } from '../domain/CrudResource';
import { findResourceDefinition } from '../domain/resourceDefinitions';
import { processBatchResource, validateBatchResource } from '../services/resourceApi';
import styles from './ResourceBatchPage.module.css';

const acceptedFileTypes = '.xlsx,.xls,.csv';

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function buildTemplate(resource: CrudResourceDefinition): string {
  const headers = resource.fields.map((field) => field.name);
  const sample = resource.fields.map((field) => {
    if (field.type === 'number') return '0';
    if (field.type === 'date') return '2026-01-01';
    if (field.type === 'datetime-local') return '2026-01-01T08:00';
    if (field.type === 'time') return '08:00';
    if (field.type === 'checkbox') return 'true';
    return `valor_${field.name}`;
  });

  return `${headers.join(',')}\n${sample.join(',')}\n`;
}

function downloadTemplate(resource: CrudResourceDefinition) {
  const content = buildTemplate(resource);
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `plantilla-${resource.module}-${resource.key}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function getStatusLabel(status: string): string {
  if (status === 'error') return 'Error';
  if (status === 'warning') return 'Observado';
  return 'Válido';
}

export function ResourceBatchPage() {
  const { module, resource: resourceKey } = useParams();
  const resource = findResourceDefinition(module, resourceKey);

  if (!resource) {
    return <PageState title="Recurso no encontrado" message="La ruta solicitada no existe en la matriz de endpoints documentada." />;
  }

  return <ResourceBatchContent resource={resource} />;
}

function ResourceBatchContent({ resource }: { resource: CrudResourceDefinition }) {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState('create');
  const [validation, setValidation] = useState<BatchValidationResult | null>(null);
  const [processResult, setProcessResult] = useState<BatchProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const canProcess = !!file && !!validation && validation.errorRows === 0;
  const validationEndpoint = useMemo(() => resource.endpoints.batchValidate ?? `${resource.endpoints.list}/batch/validate`, [resource]);
  const processEndpoint = useMemo(() => resource.endpoints.batchProcess ?? `${resource.endpoints.list}/batch/process`, [resource]);

  async function validateFile() {
    if (!file) {
      setError('Selecciona un archivo Excel o CSV antes de validar.');
      return;
    }

    try {
      setError(null);
      setProcessResult(null);
      setIsValidating(true);
      const result = await validateBatchResource(resource, file, mode);
      setValidation(result);
    } catch (currentError) {
      setValidation(null);
      setError(currentError instanceof Error ? currentError.message : 'No se pudo validar el archivo batch.');
    } finally {
      setIsValidating(false);
    }
  }

  async function processFile() {
    if (!file || !validation) return;

    try {
      setError(null);
      setIsProcessing(true);
      const result = await processBatchResource(resource, file, mode, validation.importId);
      setProcessResult(result);
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No se pudo procesar el archivo batch.');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <span>{resource.moduleLabel}</span>
          <h2>Importar Excel · {resource.label}</h2>
          <p>
            Carga masiva real para muchos registros. Primero se valida el archivo y luego se procesa el lote contra el backend.
          </p>
        </div>
        <Link to={`/modulos/${resource.module}/${resource.key}`}>Volver a lista</Link>
      </div>

      <Card className={styles.card}>
        <div className={styles.uploadGrid}>
          <label className={styles.fileBox}>
            <input
              type="file"
              accept={acceptedFileTypes}
              onChange={(event) => {
                const selected = event.target.files?.[0] ?? null;
                setFile(selected);
                setValidation(null);
                setProcessResult(null);
                setError(null);
              }}
            />
            <strong>{file ? file.name : 'Seleccionar archivo Excel'}</strong>
            <span>{file ? `${formatBytes(file.size)} · ${file.type || 'tipo no informado'}` : 'Formatos aceptados: .xlsx, .xls o .csv'}</span>
          </label>

          <div className={styles.settings}>
            <label>
              <span>Modo de importación</span>
              <select value={mode} onChange={(event) => setMode(event.target.value)}>
                <option value="create">Crear registros nuevos</option>
                <option value="update">Actualizar registros existentes</option>
                <option value="upsert">Crear o actualizar</option>
              </select>
            </label>
            <button type="button" className={styles.templateButton} onClick={() => downloadTemplate(resource)}>
              Descargar plantilla CSV
            </button>
          </div>
        </div>

        <div className={styles.endpointBox}>
          <div>
            <strong>Validación</strong>
            <code>POST {validationEndpoint}</code>
          </div>
          <div>
            <strong>Procesamiento</strong>
            <code>POST {processEndpoint}</code>
          </div>
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={() => downloadTemplate(resource)}>
            Plantilla
          </Button>
          <Button type="button" onClick={() => void validateFile()} disabled={isValidating || !file}>
            {isValidating ? 'Validando...' : 'Validar archivo'}
          </Button>
          <Button type="button" onClick={() => void processFile()} disabled={isProcessing || !canProcess}>
            {isProcessing ? 'Procesando...' : 'Procesar importación'}
          </Button>
        </div>
      </Card>

      {validation ? (
        <Card className={styles.resultCard}>
          <div className={styles.stats}>
            <div><span>Total</span><strong>{validation.totalRows}</strong></div>
            <div><span>Válidos</span><strong>{validation.validRows}</strong></div>
            <div><span>Observados</span><strong>{validation.warningRows}</strong></div>
            <div><span>Errores</span><strong>{validation.errorRows}</strong></div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fila</th>
                  <th>Operación</th>
                  <th>Estado</th>
                  <th>Mensaje</th>
                </tr>
              </thead>
              <tbody>
                {validation.rows.length ? validation.rows.slice(0, 60).map((row) => (
                  <tr key={`${row.rowNumber}-${row.status}-${row.message ?? ''}`}>
                    <td>{row.rowNumber}</td>
                    <td>{row.operation ?? mode}</td>
                    <td><span className={`${styles.badge} ${styles[row.status]}`}>{getStatusLabel(row.status)}</span></td>
                    <td>{row.message ?? 'Sin observaciones'}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4}>El backend no devolvió detalle por fila. Revisa el resumen del lote.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      {processResult ? (
        <Card className={styles.resultCard}>
          <h3>Importación procesada</h3>
          <p>{processResult.message}</p>
          <div className={styles.stats}>
            <div><span>Total</span><strong>{processResult.totalRows}</strong></div>
            <div><span>Creados</span><strong>{processResult.createdRows}</strong></div>
            <div><span>Actualizados</span><strong>{processResult.updatedRows}</strong></div>
            <div><span>Errores</span><strong>{processResult.errorRows}</strong></div>
          </div>
        </Card>
      ) : null}
    </section>
  );
}
