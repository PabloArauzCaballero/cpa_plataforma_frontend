import { useEffect, useState } from 'react';
import type { CrudRecord, CrudResourceDefinition } from '../../domain/CrudResource';
import type { MovementDraft } from '../../domain/transaction/transactionFormModel';
import { buildResourceDraftKey, deleteLocalDraft, hasLocalDraft, readLocalDraft, saveLocalDraft } from '@/shared/services/localDraftStore';
import {
  discardBackendDraft,
  getLatestBackendDraft,
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

export function useTransactionDraftViewModel({
  resource,
  recordId,
  operation,
  getCurrentPayload,
  applyDraftPayload,
}: UseTransactionDraftViewModelArgs) {
  const draftKey = buildResourceDraftKey(resource.key, recordId);
  const [localDraftExists, setLocalDraftExists] = useState(() => hasLocalDraft(draftKey));
  const [backendDraft, setBackendDraft] = useState<BackendDraft<TransactionDraftPayload> | null>(null);
  const [isDraftBusy, setIsDraftBusy] = useState(false);
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setBackendDraft(null);
    setLocalDraftExists(hasLocalDraft(draftKey));
    setDraftMessage(null);
    setDraftError(null);

    getLatestBackendDraft<TransactionDraftPayload>(resource, operation, recordId)
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
  }, [resource, operation, recordId, draftKey]);

  async function saveDraft() {
    const payload = getCurrentPayload();
    setIsDraftBusy(true);
    setDraftMessage(null);
    setDraftError(null);

    try {
      const savedDraft = await saveBackendDraft(resource, operation, payload, {
        recordId,
        existingDraftId: backendDraft?.id_borrador,
      });
      setBackendDraft(savedDraft);
      saveLocalDraft(draftKey, payload);
      setLocalDraftExists(true);
      setDraftMessage('Borrador guardado en base de datos.');
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
      const draft = backendDraft ?? await getLatestBackendDraft<TransactionDraftPayload>(resource, operation, recordId);
      const backendPayload = readDraftPayload(draft);
      if (draft && backendPayload) {
        setBackendDraft(draft);
        applyDraftPayload(backendPayload);
        setDraftMessage('Borrador cargado desde base de datos.');
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
      if (backendDraft?.id_borrador) {
        await discardBackendDraft(backendDraft.id_borrador);
      }
      setBackendDraft(null);
      deleteLocalDraft(draftKey);
      setLocalDraftExists(false);
      setDraftMessage('Borrador descartado.');
    } catch (currentError) {
      setDraftError(currentError instanceof Error ? currentError.message : 'No se pudo eliminar el borrador.');
    } finally {
      setIsDraftBusy(false);
    }
  }

  return {
    hasDraft: Boolean(backendDraft?.id_borrador || localDraftExists),
    isDraftBusy,
    draftMessage,
    draftError,
    saveDraft,
    loadDraft,
    discardDraft,
  };
}
