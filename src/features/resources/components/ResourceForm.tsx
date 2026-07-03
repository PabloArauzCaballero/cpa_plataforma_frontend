import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/shared/components/Button';
import { FormField } from '@/shared/components/FormField';
import type { CrudRecord, CrudResourceDefinition } from '../domain/CrudResource';
import { useResourceFormViewModel } from '../hooks/useResourceFormViewModel';
import { humanizeFieldLabel } from '@/shared/utils/humanize';
import { CloudinaryUploadField } from './CloudinaryUploadField';
import { buildResourceDraftKey, deleteLocalDraft, hasLocalDraft, readLocalDraft, saveLocalDraft } from '@/shared/services/localDraftStore';
import {
  discardBackendDraft,
  getLatestBackendDraft,
  readDraftPayload,
  saveBackendDraft,
  type BackendDraft,
  type DraftOperation,
} from '../services/backendDraftApi';
import styles from './ResourceForm.module.css';

interface ResourceFormProps {
  resource: CrudResourceDefinition;
  record: CrudRecord | null;
  isSaving: boolean;
  onSubmit: (payload: CrudRecord) => void | Promise<void>;
  onCancel: () => void;
}

function isCloudinaryArchivoTransaccionField(resource: CrudResourceDefinition, fieldName: string): boolean {
  return resource.key === 'archivos-transaccion' && fieldName === 'link_achivo';
}

function shouldHideTechnicalMirrorField(resource: CrudResourceDefinition, fieldName: string): boolean {
  return resource.key === 'archivos-transaccion' && fieldName === 'link_archivo';
}

function resolveDraftRecordId(resource: CrudResourceDefinition, record: CrudRecord | null): string | number | null {
  if (!record) return null;
  const value = record[resource.primaryKey] ?? record.id;
  return typeof value === 'string' || typeof value === 'number' ? value : null;
}

function getDraftOperation(record: CrudRecord | null): DraftOperation {
  return record ? 'update' : 'create';
}

function getDraftStatusMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo operar el borrador.';
}

export function ResourceForm({ resource, record, isSaving, onSubmit, onCancel }: ResourceFormProps) {
  const viewModel = useResourceFormViewModel(resource, record);
  const isJsonMode = resource.fields.length === 0;
  const visibleFields = resource.fields.filter((field) => !shouldHideTechnicalMirrorField(resource, field.name));
  const recordId = resolveDraftRecordId(resource, record);
  const draftOperation = getDraftOperation(record);
  const draftKey = buildResourceDraftKey(resource.key, recordId);
  const [localDraftExists, setLocalDraftExists] = useState(() => hasLocalDraft(draftKey));
  const [backendDraft, setBackendDraft] = useState<BackendDraft<CrudRecord> | null>(null);
  const [isDraftBusy, setIsDraftBusy] = useState(false);
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setBackendDraft(null);
    setLocalDraftExists(hasLocalDraft(draftKey));
    setDraftMessage(null);
    setDraftError(null);

    getLatestBackendDraft<CrudRecord>(resource, draftOperation, recordId)
      .then((draft) => {
        if (!isMounted) return;
        setBackendDraft(draft);
      })
      .catch(() => {
        if (!isMounted) return;
        setBackendDraft(null);
      });

    return () => {
      isMounted = false;
    };
  }, [resource, draftOperation, recordId, draftKey]);

  function getDraftPayload(): CrudRecord {
    return isJsonMode ? { jsonPayload: viewModel.jsonPayload } : viewModel.payload;
  }

  function applyDraftPayload(draftPayload: CrudRecord) {
    if (isJsonMode && typeof draftPayload.jsonPayload === 'string') {
      viewModel.setJsonPayload(String(draftPayload.jsonPayload));
      return;
    }
    viewModel.replacePayload(draftPayload);
  }

  async function saveDraft() {
    const draftPayload = getDraftPayload();
    setIsDraftBusy(true);
    setDraftError(null);
    setDraftMessage(null);

    try {
      const savedDraft = await saveBackendDraft(resource, draftOperation, draftPayload, {
        recordId,
        existingDraftId: backendDraft?.id_borrador,
      });
      setBackendDraft(savedDraft);
      saveLocalDraft(draftKey, draftPayload);
      setLocalDraftExists(true);
      setDraftMessage('Borrador guardado en base de datos.');
    } catch (error) {
      saveLocalDraft(draftKey, draftPayload);
      setLocalDraftExists(true);
      setDraftError(`No se pudo guardar en base. Se dejó respaldo local. ${getDraftStatusMessage(error)}`);
    } finally {
      setIsDraftBusy(false);
    }
  }

  async function loadDraft() {
    setIsDraftBusy(true);
    setDraftError(null);
    setDraftMessage(null);

    try {
      const draft = backendDraft ?? await getLatestBackendDraft<CrudRecord>(resource, draftOperation, recordId);
      const backendPayload = readDraftPayload(draft);
      if (draft && backendPayload) {
        setBackendDraft(draft);
        applyDraftPayload(backendPayload);
        setDraftMessage('Borrador cargado desde base de datos.');
        return;
      }

      const localDraft = readLocalDraft<CrudRecord>(draftKey);
      if (localDraft) {
        applyDraftPayload(localDraft.payload);
        setDraftMessage('Borrador cargado desde respaldo local.');
        return;
      }

      setDraftError('No hay borrador disponible para este formulario.');
    } catch (error) {
      const localDraft = readLocalDraft<CrudRecord>(draftKey);
      if (localDraft) {
        applyDraftPayload(localDraft.payload);
        setDraftMessage('Borrador cargado desde respaldo local.');
      } else {
        setDraftError(getDraftStatusMessage(error));
      }
    } finally {
      setIsDraftBusy(false);
    }
  }

  async function discardDraft() {
    setIsDraftBusy(true);
    setDraftError(null);
    setDraftMessage(null);

    try {
      if (backendDraft?.id_borrador) {
        await discardBackendDraft(backendDraft.id_borrador);
      }
      setBackendDraft(null);
      deleteLocalDraft(draftKey);
      setLocalDraftExists(false);
      setDraftMessage('Borrador descartado.');
    } catch (error) {
      setDraftError(getDraftStatusMessage(error));
    } finally {
      setIsDraftBusy(false);
    }
  }

  const hasDraft = Boolean(backendDraft?.id_borrador) || localDraftExists;

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        const payload = viewModel.getPayload();
        if (payload) void onSubmit(payload);
      }}
    >
      {isJsonMode ? (
        <label className={styles.jsonField}>
          <span>Payload JSON</span>
          <textarea value={viewModel.jsonPayload} onChange={(event) => viewModel.setJsonPayload(event.target.value)} rows={12} />
          {viewModel.errors.json ? <small>{viewModel.errors.json}</small> : null}
        </label>
      ) : (
        <div className={styles.grid}>
          {visibleFields.map((field) => {
            const label = humanizeFieldLabel(field.label, field.name);

            if (isCloudinaryArchivoTransaccionField(resource, field.name)) {
              return (
                <CloudinaryUploadField
                  key={field.name}
                  id={field.name}
                  label="Imagen del comprobante"
                  value={String(viewModel.payload.link_achivo ?? viewModel.payload.link_archivo ?? '')}
                  error={viewModel.errors[field.name]}
                  required={field.required}
                  folder="cpa/archivos-transaccion"
                  onUploaded={(url) => {
                    viewModel.setField('link_achivo', url);
                    viewModel.setField('link_archivo', url);
                  }}
                />
              );
            }

            return (
              <FormField
                key={field.name}
                id={field.name}
                label={label}
                type={field.type}
                value={viewModel.payload[field.name] as string | number | boolean}
                error={viewModel.errors[field.name]}
                required={field.required}
                options={viewModel.getFieldOptions(field)}
                helpText={field.helpText}
                isLoadingOptions={viewModel.isLoadingFieldOptions(field)}
                onChange={(value) => viewModel.setField(field.name, value)}
              />
            );
          })}
        </div>
      )}

      <div className={styles.draftBar}>
        <div>
          <strong>Borrador en base de datos</strong>
          <span>Guarda formularios incompletos sin afectar las tablas finales. El respaldo local solo se usa si el servidor no responde.</span>
          {draftMessage ? <small className={styles.draftSuccess}>{draftMessage}</small> : null}
          {draftError ? <small className={styles.draftError}>{draftError}</small> : null}
        </div>
        <div className={styles.draftActions}>
          <Button type="button" variant="ghost" onClick={saveDraft} disabled={isDraftBusy}>{isDraftBusy ? 'Procesando...' : 'Guardar borrador'}</Button>
          <Button type="button" variant="ghost" onClick={loadDraft} disabled={isDraftBusy || !hasDraft}>Cargar borrador</Button>
          <Button type="button" variant="ghost" onClick={discardDraft} disabled={isDraftBusy || !hasDraft}>Eliminar borrador</Button>
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar'}</Button>
      </div>
    </form>
  );
}
