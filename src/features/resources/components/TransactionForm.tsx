import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { Button } from '@/shared/components/Button';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import type { ResolvedOptions } from '../domain/changeSummary';
import type { CrudRecord, CrudResourceDefinition } from '../domain/CrudResource';
import { useResourceFormViewModel } from '../hooks/useResourceFormViewModel';
import { useTransactionMovementsViewModel } from '../hooks/transaction/useTransactionMovementsViewModel';
import { useTransactionDraftViewModel } from '../hooks/transaction/useTransactionDraftViewModel';
import { TransactionHeaderFields } from './transaction/TransactionHeaderFields';
import { TransactionMovementEditor } from './transaction/TransactionMovementEditor';
import { TransactionMovementsTable } from './transaction/TransactionMovementsTable';
import { TransactionDraftActions } from './transaction/TransactionDraftActions';
import {
  cleanPayloadForSelectedTransactionType,
  getMovementPayload,
  getTransactionVisibleFieldNames,
  resolveTransactionDraftRecordId,
  TRANSACTION_COMMON_FIELDS,
  validateMovementBusinessRules,
  validateTransactionHeaderBusinessRules,
} from '../domain/transaction/transactionFormModel';
import type { DraftOperation } from '../services/persistentDraftApi';
import styles from './TransactionForm.module.css';

interface TransactionFormProps {
  resource: CrudResourceDefinition;
  record: CrudRecord | null;
  isSaving: boolean;
  onSubmit: (payload: CrudRecord, resolvedOptions?: ResolvedOptions) => void | Promise<void>;
  onCancel: () => void;
}

export function TransactionForm({ resource, record, isSaving, onSubmit, onCancel }: TransactionFormProps) {
  const headerViewModel = useResourceFormViewModel(resource, record);
  const movementsViewModel = useTransactionMovementsViewModel(record);
  const [error, setError] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const recordId = resolveTransactionDraftRecordId(resource, record);
  const draftOperation: DraftOperation = record ? 'update' : 'create';
  const transactionType = String(headerViewModel.payload.tipo_transaccion ?? '').toUpperCase();
  const visibleFieldNames = useMemo(() => getTransactionVisibleFieldNames(transactionType), [transactionType]);
  const visibleFieldNameSet = useMemo(() => new Set(visibleFieldNames), [visibleFieldNames]);
  const commonFields = useMemo(
    () => resource.fields.filter((field) => TRANSACTION_COMMON_FIELDS.includes(field.name)),
    [resource.fields],
  );
  const contextualFields = useMemo(
    () => resource.fields.filter((field) => !TRANSACTION_COMMON_FIELDS.includes(field.name) && visibleFieldNameSet.has(field.name)),
    [resource.fields, visibleFieldNameSet],
  );

  const draftViewModel = useTransactionDraftViewModel({
    resource,
    recordId,
    operation: draftOperation,
    getCurrentPayload: () => ({
      header: headerViewModel.payload,
      movements: movementsViewModel.movements,
    }),
    applyDraftPayload: (payload) => {
      headerViewModel.replacePayload(payload.header ?? {});
      movementsViewModel.replaceMovements(payload.movements ?? []);
      setError(null);
    },
  });

  function handleHeaderFieldChange(fieldName: string, value: unknown) {
    headerViewModel.setField(fieldName, value);

    if (fieldName !== 'tipo_transaccion') return;

    const nextType = String(value ?? '').toUpperCase();
    const nextVisible = new Set(getTransactionVisibleFieldNames(nextType));
    resource.fields.forEach((field) => {
      if (!TRANSACTION_COMMON_FIELDS.includes(field.name) && !nextVisible.has(field.name)) {
        headerViewModel.setField(field.name, '');
      }
    });
  }

  function handleSaveMovement() {
    const movementError = movementsViewModel.saveMovement();
    setError(movementError);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const rawHeaderPayload = headerViewModel.getPayload();
    if (!rawHeaderPayload) {
      setError('Completa los campos obligatorios de la transacción.');
      return;
    }

    const headerPayload = cleanPayloadForSelectedTransactionType(rawHeaderPayload, visibleFieldNames);
    const headerBusinessError = validateTransactionHeaderBusinessRules(headerPayload);
    if (headerBusinessError) {
      setError(headerBusinessError);
      return;
    }

    if (movementsViewModel.movements.length < 2) {
      setError('Una transacción contable debe tener al menos dos movimientos.');
      return;
    }

    const movementBusinessError = validateMovementBusinessRules(movementsViewModel.movements);
    if (movementBusinessError) {
      setError(movementBusinessError);
      return;
    }

    if (Math.abs(movementsViewModel.totals.diferencia) > 0.009) {
      setError('La transacción no está balanceada: el total Debe debe ser igual al total Haber.');
      return;
    }

    setError(null);
    // Igual que en `ResourceForm`: las opciones de las listas que apuntan a un
    // catálogo viven aquí, así que viajan con el payload para que el resumen de
    // confirmación pueda enseñar nombres en vez de identificadores.
    const resolvedOptions = resource.fields.reduce<ResolvedOptions>((acc, field) => {
      acc[field.name] = headerViewModel.getFieldOptions(field);
      return acc;
    }, {});

    onSubmit({
      ...headerPayload,
      movimientos: movementsViewModel.movements.map(getMovementPayload),
    }, resolvedOptions);
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.notice}>
        <strong>Transacción contable</strong>
        <span>Encabezado de transacción + movimientos de cuenta en un solo envío.</span>
      </div>

      <TransactionHeaderFields
        commonFields={commonFields}
        contextualFields={contextualFields}
        transactionType={transactionType}
        headerViewModel={headerViewModel}
        onFieldChange={handleHeaderFieldChange}
      />

      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <div>
            <h3>Movimientos de cuenta</h3>
            <p>Registra el Debe y el Haber dentro de la misma transacción.</p>
          </div>
          <div className={styles.balance} data-balanced={Math.abs(movementsViewModel.totals.diferencia) <= 0.009}>
            <span>Debe: {movementsViewModel.totals.debe.toFixed(2)}</span>
            <span>Haber: {movementsViewModel.totals.haber.toFixed(2)}</span>
            <strong>Diferencia: {movementsViewModel.totals.diferencia.toFixed(2)}</strong>
          </div>
        </div>

        <TransactionMovementEditor
          movementDraft={movementsViewModel.movementDraft}
          editingMovementIndex={movementsViewModel.editingMovementIndex}
          accountSearchInput={movementsViewModel.accountSearchInput}
          filteredAccountOptions={movementsViewModel.filteredAccountOptions}
          selectedAccountLabel={movementsViewModel.selectedAccountLabel}
          totalAccountCount={movementsViewModel.accountOptions.length}
          isLoadingAccounts={movementsViewModel.isLoadingAccounts}
          onAccountSearchChange={movementsViewModel.setAccountSearchInput}
          onSelectAccount={movementsViewModel.selectAccount}
          onMovementFieldChange={movementsViewModel.setMovementField}
          onSaveMovement={handleSaveMovement}
          onCancelEdition={() => {
            movementsViewModel.resetMovementEditor();
            setError(null);
          }}
        />

        <TransactionMovementsTable
          movements={movementsViewModel.movements}
          accountOptions={movementsViewModel.accountOptions}
          editingMovementIndex={movementsViewModel.editingMovementIndex}
          onEditMovement={(index) => {
            movementsViewModel.editMovement(index);
            setError(null);
          }}
          onRemoveMovement={movementsViewModel.removeMovement}
        />
      </section>

      {error ? <p className={styles.error}>{error}</p> : null}

      <ConfirmDialog
        isOpen={confirmClear}
        title="Limpiar campos"
        message={record
          ? 'La cabecera y los movimientos volverán a los valores guardados del registro. No se modifica nada en la base de datos.'
          : 'Se vaciarán la cabecera y todos los movimientos cargados.'}
        warning="Los borradores guardados no se tocan."
        confirmLabel="Sí, limpiar"
        cancelLabel="Cancelar"
        variant="danger"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          setConfirmClear(false);
          headerViewModel.resetFields();
          movementsViewModel.replaceMovements([]);
          movementsViewModel.resetMovementEditor();
          setError(null);
        }}
      />

      <TransactionDraftActions
        hasDraft={draftViewModel.hasDraft}
        storedDraftCount={draftViewModel.storedDraftCount}
        draftPositionLabel={draftViewModel.draftPositionLabel}
        selectedDraftLabel={draftViewModel.selectedDraftLabel}
        canGoPreviousDraft={draftViewModel.canGoPreviousDraft}
        canGoNextDraft={draftViewModel.canGoNextDraft}
        isDraftBusy={draftViewModel.isDraftBusy}
        draftMessage={draftViewModel.draftMessage}
        draftError={draftViewModel.draftError}
        onSaveDraft={draftViewModel.saveDraft}
        onLoadDraft={draftViewModel.loadDraft}
        onDiscardDraft={draftViewModel.discardDraft}
        onClearFields={() => setConfirmClear(true)}
        onPreviousDraft={draftViewModel.goToPreviousDraft}
        onNextDraft={draftViewModel.goToNextDraft}
      />

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar transacción'}</Button>
      </div>
    </form>
  );
}
