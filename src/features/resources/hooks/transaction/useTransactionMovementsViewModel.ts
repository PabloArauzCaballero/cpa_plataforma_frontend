import { useEffect, useMemo, useState } from 'react';
import type { CrudRecord, SelectOption } from '../../domain/CrudResource';
import { accountMovementRelation } from '../../domain/resourceFieldCatalog';
import { listAllLookupOptions } from '../../services/lookupApi';
import {
  emptyMovement,
  filterAccountOptions,
  getMovementTotals,
  getOptionLabel,
  getRecordMovements,
  getSelectedAccountLabel,
  toMoney,
  type MovementDraft,
} from '../../domain/transaction/transactionFormModel';

export function useTransactionMovementsViewModel(record: CrudRecord | null) {
  const [movements, setMovements] = useState<MovementDraft[]>(() => getRecordMovements(record));
  const [movementDraft, setMovementDraft] = useState<MovementDraft>(emptyMovement);
  const [editingMovementIndex, setEditingMovementIndex] = useState<number | null>(null);
  const [accountOptions, setAccountOptions] = useState<SelectOption[]>([]);
  const [accountSearchInput, setAccountSearchInput] = useState('');
  const [accountSearch, setAccountSearch] = useState('');
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);

  useEffect(() => {
    setMovements(getRecordMovements(record));
    setMovementDraft(emptyMovement);
    setEditingMovementIndex(null);
    setAccountSearchInput('');
    setAccountSearch('');
  }, [record]);

  useEffect(() => {
    let isMounted = true;
    if (!accountMovementRelation) return undefined;

    setIsLoadingAccounts(true);
    listAllLookupOptions(accountMovementRelation)
      .then((options) => {
        if (isMounted) setAccountOptions(options);
      })
      .catch(() => {
        if (isMounted) setAccountOptions([]);
      })
      .finally(() => {
        if (isMounted) setIsLoadingAccounts(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setAccountSearch(accountSearchInput);
    }, 650);

    return () => window.clearTimeout(timeoutId);
  }, [accountSearchInput]);

  const filteredAccountOptions = useMemo(() => filterAccountOptions(accountOptions, accountSearch), [accountOptions, accountSearch]);
  const selectedAccountLabel = useMemo(
    () => getSelectedAccountLabel(accountOptions, movementDraft.cuentaId),
    [accountOptions, movementDraft.cuentaId],
  );
  const totals = useMemo(() => getMovementTotals(movements), [movements]);

  function setMovementField(name: keyof MovementDraft, value: string) {
    setMovementDraft((current) => ({ ...current, [name]: value }));
  }

  function selectAccount(accountId: string) {
    setMovementField('cuentaId', accountId);
    setAccountSearchInput('');
    setAccountSearch('');
  }

  function saveMovement(): string | null {
    if (!movementDraft.cuentaId.trim() || !Number.isFinite(Number(movementDraft.cuentaId)) || Number(movementDraft.cuentaId) <= 0) {
      return 'Debes seleccionar una cuenta válida.';
    }

    if (toMoney(movementDraft.monto) <= 0) {
      return 'El monto del movimiento debe ser mayor a cero.';
    }

    setMovements((current) => {
      if (editingMovementIndex === null) return [...current, movementDraft];
      return current.map((item, index) => (index === editingMovementIndex ? movementDraft : item));
    });
    resetMovementEditor();
    return null;
  }

  function removeMovement(index: number) {
    setMovements((current) => current.filter((_, currentIndex) => currentIndex !== index));
    if (editingMovementIndex === index) {
      resetMovementEditor();
      return;
    }
    if (editingMovementIndex !== null && index < editingMovementIndex) {
      setEditingMovementIndex(editingMovementIndex - 1);
    }
  }

  function editMovement(index: number) {
    const movement = movements[index];
    if (!movement) return;
    setEditingMovementIndex(index);
    setMovementDraft(movement);
    setAccountSearchInput(getOptionLabel(accountOptions, movement.cuentaId));
    setAccountSearch('');
  }

  function resetMovementEditor() {
    setEditingMovementIndex(null);
    setMovementDraft(emptyMovement);
    setAccountSearchInput('');
    setAccountSearch('');
  }

  function replaceMovements(nextMovements: MovementDraft[]) {
    setMovements(Array.isArray(nextMovements) ? nextMovements : []);
    resetMovementEditor();
  }

  return {
    movements,
    movementDraft,
    editingMovementIndex,
    accountOptions,
    accountSearchInput,
    filteredAccountOptions,
    selectedAccountLabel,
    isLoadingAccounts,
    totals,
    setAccountSearchInput,
    setMovementField,
    selectAccount,
    saveMovement,
    removeMovement,
    editMovement,
    resetMovementEditor,
    replaceMovements,
  };
}
