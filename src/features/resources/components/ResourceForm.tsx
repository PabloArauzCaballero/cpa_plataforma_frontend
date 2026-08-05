import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faDatabase, faEraser, faFloppyDisk, faFolderOpen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/shared/components/Button';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import type { ResolvedOptions } from '../domain/changeSummary';
import { FormField } from '@/shared/components/FormField';
import type { CrudRecord, CrudResourceDefinition } from '../domain/CrudResource';
import { useResourceFormViewModel } from '../hooks/useResourceFormViewModel';
import { humanizeFieldLabel } from '@/shared/utils/humanize';
import { CloudinaryUploadField } from './CloudinaryUploadField';
import { buildResourceDraftKey, deleteLocalDraft, hasLocalDraft, readLocalDraft, saveLocalDraft } from '@/shared/services/localDraftStore';
import {
  discardPersistentDraft,
  listPersistentDrafts,
  readDraftPayload,
  savePersistentDraft,
  type PersistentDraft,
  type DraftOperation,
} from '../services/persistentDraftApi';
import { TUTORIAL_ANCHORS, tutorialAnchor } from '@/features/tutorials/domain/tutorialAnchors';
import styles from './ResourceForm.module.css';

interface ResourceFormProps {
  resource: CrudResourceDefinition;
  record: CrudRecord | null;
  isSaving: boolean;
  /**
   * `resolvedOptions` acompaña al payload porque las listas que apuntan a un
   * catálogo cargan sus opciones aquí dentro: sin ellas, quien muestre el
   * resumen de confirmación sólo puede enseñar el id en crudo.
   */
  onSubmit: (payload: CrudRecord, resolvedOptions?: ResolvedOptions) => void | Promise<void>;
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

function formatDraftDate(draft: PersistentDraft | null): string {
  const value = draft?.fecha_modificacion ?? draft?.fecha_registro;
  if (!value) return 'Sin fecha';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

export function ResourceForm({ resource, record, isSaving, onSubmit, onCancel }: ResourceFormProps) {
  const viewModel = useResourceFormViewModel(resource, record);
  const isJsonMode = resource.fields.length === 0;
  const visibleFields = resource.fields.filter((field) => !shouldHideTechnicalMirrorField(resource, field.name) && viewModel.isFieldVisible(field));
  const recordId = resolveDraftRecordId(resource, record);
  const draftOperation = getDraftOperation(record);
  const draftKey = buildResourceDraftKey(resource.key, recordId);
  const [localDraftExists, setLocalDraftExists] = useState(() => hasLocalDraft(draftKey));
  const [persistentDrafts, setPersistentDrafts] = useState<Array<PersistentDraft<CrudRecord>>>([]);
  const [confirmClear, setConfirmClear] = useState(false);
  const [selectedDraftIndex, setSelectedDraftIndex] = useState(0);
  const [isDraftBusy, setIsDraftBusy] = useState(false);
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);

  const selectedDraft = persistentDrafts[selectedDraftIndex] ?? null;
  const hasDraft = Boolean(selectedDraft?.id_borrador) || localDraftExists;
  const draftPositionLabel = persistentDrafts.length > 0 ? `${selectedDraftIndex + 1} de ${persistentDrafts.length}` : localDraftExists ? 'Respaldo local' : 'Sin borradores';

  async function refreshDrafts(nextSelectedId?: string | number | null) {
    const drafts = await listPersistentDrafts<CrudRecord>(resource, draftOperation, recordId);
    setPersistentDrafts(drafts);
    if (nextSelectedId) {
      const nextIndex = drafts.findIndex((draft) => String(draft.id_borrador) === String(nextSelectedId));
      setSelectedDraftIndex(nextIndex >= 0 ? nextIndex : 0);
      return drafts;
    }
    setSelectedDraftIndex((current) => Math.min(current, Math.max(drafts.length - 1, 0)));
    return drafts;
  }

  useEffect(() => {
    let isMounted = true;
    setPersistentDrafts([]);
    setSelectedDraftIndex(0);
    setLocalDraftExists(hasLocalDraft(draftKey));
    setDraftMessage(null);
    setDraftError(null);

    listPersistentDrafts<CrudRecord>(resource, draftOperation, recordId)
      .then((drafts) => {
        if (!isMounted) return;
        setPersistentDrafts(drafts);
        setSelectedDraftIndex(0);
      })
      .catch(() => {
        if (!isMounted) return;
        setPersistentDrafts([]);
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
      const savedDraft = await savePersistentDraft(resource, draftOperation, draftPayload, {
        recordId,
        createNew: true,
      });
      await refreshDrafts(savedDraft.id_borrador ?? null);
      saveLocalDraft(draftKey, draftPayload);
      setLocalDraftExists(true);
      setDraftMessage('Nuevo borrador guardado.');
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
      let draft = selectedDraft;
      if (!draft) {
        const drafts = await refreshDrafts();
        draft = drafts[0] ?? null;
      }

      const sistemaPayload = readDraftPayload(draft);
      if (draft && sistemaPayload) {
        applyDraftPayload(sistemaPayload);
        setDraftMessage(`Borrador cargado: ${formatDraftDate(draft)}.`);
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
      if (selectedDraft?.id_borrador) {
        await discardPersistentDraft(selectedDraft.id_borrador);
        await refreshDrafts();
      } else {
        deleteLocalDraft(draftKey);
        setLocalDraftExists(false);
      }
      setDraftMessage('Borrador descartado.');
    } catch (error) {
      setDraftError(getDraftStatusMessage(error));
    } finally {
      setIsDraftBusy(false);
    }
  }

  function goToPreviousDraft() {
    setSelectedDraftIndex((current) => Math.max(0, current - 1));
  }

  function goToNextDraft() {
    setSelectedDraftIndex((current) => Math.min(Math.max(persistentDrafts.length - 1, 0), current + 1));
  }

  return (
    <form
      {...tutorialAnchor(TUTORIAL_ANCHORS.resourceForm)}
      className={styles.form}
      // La validación nativa del navegador cortaba el envío sin avisar: en un
      // `type="email"` a medio escribir el globo de error queda fuera del modal
      // con scroll, y en móvil directamente no se ve. Con `noValidate` manda
      // `validateResourcePayload`, que sí pinta el error debajo del campo.
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const payload = viewModel.getPayload();
        if (!payload) return;
        const resolvedOptions = resource.fields.reduce<ResolvedOptions>((acc, field) => {
          acc[field.name] = viewModel.getFieldOptions(field);
          return acc;
        }, {});
        void onSubmit(payload, resolvedOptions);
      }}
    >
      {isJsonMode ? (
        <label className={styles.jsonField}>
          <span>Datos JSON</span>
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
                placeholder={field.placeholder}
                disabled={field.readOnly}
                isLoadingOptions={viewModel.isLoadingFieldOptions(field)}
                quickCreate={field.quickCreate}
                onCreateOption={
                  field.quickCreate && field.relation
                    ? (values) => viewModel.createFieldOption(field, values)
                    : undefined
                }
                onChange={(value) => viewModel.setField(field.name, value)}
              />
            );
          })}
        </div>
      )}

      <div className={styles.draftBar}>
        <div className={styles.draftInfo}>
          <strong><FontAwesomeIcon icon={faDatabase} /> Borradores guardados</strong>
          <span>Guarda varios avances sin afectar las tablas finales. Puedes moverte entre borradores antes de cargar uno.</span>
          <small className={styles.draftMeta}>{persistentDrafts.length > 0 ? `Borrador ${draftPositionLabel} · ${formatDraftDate(selectedDraft)}` : draftPositionLabel}</small>
          {draftMessage ? <small className={styles.draftSuccess}>{draftMessage}</small> : null}
          {draftError ? <small className={styles.draftError}>{draftError}</small> : null}
        </div>
        <div className={styles.draftActions}>
          <div className={styles.draftPager} aria-label="Paginación de borradores">
            <button type="button" onClick={goToPreviousDraft} disabled={isDraftBusy || selectedDraftIndex <= 0} aria-label="Borrador anterior">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span>{draftPositionLabel}</span>
            <button type="button" onClick={goToNextDraft} disabled={isDraftBusy || selectedDraftIndex >= persistentDrafts.length - 1} aria-label="Borrador siguiente">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>

          <Button type="button" variant="ghost" onClick={saveDraft} disabled={isDraftBusy}>
            <FontAwesomeIcon icon={faFloppyDisk} /> {isDraftBusy ? 'Procesando...' : 'Guardar nuevo borrador'}
          </Button>
          <Button type="button" variant="ghost" onClick={loadDraft} disabled={isDraftBusy || !hasDraft}>
            <FontAwesomeIcon icon={faFolderOpen} /> Cargar seleccionado
          </Button>
          <Button type="button" variant="ghost" onClick={discardDraft} disabled={isDraftBusy || !hasDraft}>
            <FontAwesomeIcon icon={faTrash} /> Eliminar seleccionado
          </Button>
          {/* Vaciar el formulario no toca los borradores guardados: sólo
              descarta lo que hay escrito en pantalla ahora mismo. */}
          <Button type="button" variant="ghost" onClick={() => setConfirmClear(true)} disabled={isDraftBusy}>
            <FontAwesomeIcon icon={faEraser} /> Limpiar campos
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmClear}
        title="Limpiar campos"
        message={record
          ? 'Los campos volverán a los valores que tiene guardados el registro. No se modifica nada en la base de datos.'
          : 'Se vaciará todo lo que has escrito en el formulario.'}
        warning="Los borradores guardados no se tocan."
        confirmLabel="Sí, limpiar"
        cancelLabel="Cancelar"
        variant="danger"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => { setConfirmClear(false); viewModel.resetFields(); }}
      />

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSaving} {...tutorialAnchor(TUTORIAL_ANCHORS.resourceFormSubmit)}>{isSaving ? 'Guardando...' : 'Guardar'}</Button>
      </div>
    </form>
  );
}
