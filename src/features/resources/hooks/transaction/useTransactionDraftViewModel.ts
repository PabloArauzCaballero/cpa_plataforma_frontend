import { useEffect, useMemo, useState } from 'react';
import type { CrudRecord, CrudResourceDefinition } from '../../domain/CrudResource';
import type { MovementDraft } from '../../domain/transaction/transactionFormModel';
import { buildResourceDraftKey, deleteLocalDraft, hasLocalDraft, readLocalDraft, saveLocalDraft } from '@/shared/services/localDraftStore';
import {
  discardBackendDraft,
  listBackendDrafts,
  readDraftPayload,
  saveBackendDraft,
  type BackendDraft,
  type DraftOperation,
} from '../../services/backendDraftApi';

export interface TransactionDraftPayload {
  header?: CrudRecord;
  movements?: MovementDraft[];
}

interface UseTransactionDraftViewModelArgs {
  resource: CrudResourceDefinition;
  recordId: string | number | null;
  operation: DraftOperation;
  getCurrentPayload: () => TransactionDraftPayload;
  applyDraftPayload: (payload: TransactionDraftPayload) => void;
}

function getDraftDateLabel(draft: BackendDraft<unknown> | null): string {
  const value = draft?.fecha_modificacion ?? draft?.fecha_registro;
  if (!value) return 'Sin fecha';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

export function useTransactionDraftViewModel({
  resource,
  recordId,
  operation,
  getCurrentPayload,
  applyDraftPayload,
}: UseTransactionDraftViewModelArgs) {
  const draftKey = buildResourceDraftKey(resource.key, recordId);
  const [localDraftExists, setLocalDraftExists] = useState(() => hasLocalDraft(draftKey));
  const [backendDrafts, setBackendDrafts] = useState<Array<BackendDraft<TransactionDraftPayload>>>([]);
  const [selectedDraftIndex, setSelectedDraftIndex] = useState(0);
  const [isDraftBusy, setIsDraftBusy] = useState(false);
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);

  const selectedDraft = backendDrafts[selectedDraftIndex] ?? null;

  async function refreshDrafts(nextSelectedId?: string | number | null) {
    const drafts = await listBackendDrafts<TransactionDraftPayload>(resource, operation, recordId);
    setBackendDrafts(drafts);
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
    setBackendDrafts([]);
    setSelectedDraftIndex(0);
    setLocalDraftExists(hasLocalDraft(draftKey));
    setDraftMessage(null);
    setDraftError(null);

    listBackendDrafts<TransactionDraftPayload>(resource, operation, recordId)
      .then((drafts) => {
        if (!isMounted) return;
        setBackendDrafts(drafts);
        setSelectedDraftIndex(0);
      })
      .catch(() => {
        if (!isMounted) return;
        setBackendDrafts([]);
      });

    return () => {
      isMounted = false;
    };
  }, [resource, operation, recordId, draftKey]);

  async function saveDraft() {
    const payload = getCurrentPayload();
    setIsDraftBusy(true);
    setDraftMessage(null);
    setDraftError(null);

    try {
      const savedDraft = await saveBackendDraft(resource, operation, payload, {
        recordId,
        createNew: true,
        metadata: {
          cantidad_movimientos: Array.isArray(payload.movements) ? payload.movements.length : 0,
        },
      });
      await refreshDrafts(savedDraft.id_borrador ?? null);
      saveLocalDraft(draftKey, payload);
      setLocalDraftExists(true);
      setDraftMessage('Nuevo borrador guardado en base de datos.');
    } catch (currentError) {
      saveLocalDraft(draftKey, payload);
      setLocalDraftExists(true);
      const detail = currentError instanceof Error ? currentError.message : 'No se pudo guardar en base.';
      setDraftError(`No se pudo guardar en base. Se dejó respaldo local. ${detail}`);
    } finally {
      setIsDraftBusy(false);
    }
  }

  async function loadDraft() {
    setIsDraftBusy(true);
    setDraftMessage(null);
    setDraftError(null);

    try {
      let draft = selectedDraft;
      if (!draft) {
        const drafts = await refreshDrafts();
        draft = drafts[0] ?? null;
      }

      const backendPayload = readDraftPayload(draft);
      if (draft && backendPayload) {
        applyDraftPayload(backendPayload);
        setDraftMessage(`Borrador cargado: ${getDraftDateLabel(draft)}.`);
        return;
      }

      const localDraft = readLocalDraft<TransactionDraftPayload>(draftKey);
      if (localDraft) {
        applyDraftPayload(localDraft.payload);
        setDraftMessage('Borrador cargado desde respaldo local.');
        return;
      }

      setDraftError('No hay borrador disponible para esta transacción.');
    } catch (currentError) {
      const localDraft = readLocalDraft<TransactionDraftPayload>(draftKey);
      if (localDraft) {
        applyDraftPayload(localDraft.payload);
        setDraftMessage('Borrador cargado desde respaldo local.');
      } else {
        setDraftError(currentError instanceof Error ? currentError.message : 'No se pudo cargar el borrador.');
      }
    } finally {
      setIsDraftBusy(false);
    }
  }

  async function discardDraft() {
    setIsDraftBusy(true);
    setDraftMessage(null);
    setDraftError(null);

    try {
      if (selectedDraft?.id_borrador) {
        await discardBackendDraft(selectedDraft.id_borrador);
        await refreshDrafts();
      }
      if (!selectedDraft?.id_borrador) {
        deleteLocalDraft(draftKey);
        setLocalDraftExists(false);
      }
      setDraftMessage('Borrador descartado.');
    } catch (currentError) {
      setDraftError(currentError instanceof Error ? currentError.message : 'No se pudo eliminar el borrador.');
    } finally {
      setIsDraftBusy(false);
    }
  }

  function goToPreviousDraft() {
    setSelectedDraftIndex((current) => Math.max(0, current - 1));
  }

  function goToNextDraft() {
    setSelectedDraftIndex((current) => Math.min(Math.max(backendDrafts.length - 1, 0), current + 1));
  }

  const draftPositionLabel = useMemo(() => {
    if (backendDrafts.length === 0) return localDraftExists ? 'Respaldo local' : 'Sin borradores';
    return `${selectedDraftIndex + 1} de ${backendDrafts.length}`;
  }, [backendDrafts.length, localDraftExists, selectedDraftIndex]);

  return {
    hasDraft: Boolean(selectedDraft?.id_borrador || localDraftExists),
    backendDraftCount: backendDrafts.length,
    selectedDraftIndex,
    selectedDraftLabel: getDraftDateLabel(selectedDraft),
    draftPositionLabel,
    canGoPreviousDraft: selectedDraftIndex > 0,
    canGoNextDraft: selectedDraftIndex < backendDrafts.length - 1,
    isDraftBusy,
    draftMessage,
    draftError,
    saveDraft,
    loadDraft,
    discardDraft,
    goToPreviousDraft,
    goToNextDraft,
  };
}
