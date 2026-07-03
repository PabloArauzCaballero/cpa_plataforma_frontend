import { FormField } from '@/shared/components/FormField';
import type { ResourceFieldDefinition } from '../../domain/CrudResource';
import type { useResourceFormViewModel } from '../../hooks/useResourceFormViewModel';
import { getTransactionTypeLabel, humanizeFieldName, TRANSACTION_TYPE_HELP } from '../../domain/transaction/transactionFormModel';
import styles from '../TransactionForm.module.css';

type HeaderViewModel = ReturnType<typeof useResourceFormViewModel>;

interface TransactionHeaderFieldsProps {
  commonFields: ResourceFieldDefinition[];
  contextualFields: ResourceFieldDefinition[];
  transactionType: string;
  headerViewModel: HeaderViewModel;
  onFieldChange: (fieldName: string, value: unknown) => void;
}

export function TransactionHeaderFields({
  commonFields,
  contextualFields,
  transactionType,
  headerViewModel,
  onFieldChange,
}: TransactionHeaderFieldsProps) {
  return (
    <section className={styles.section}>
      <h3>Datos de la transacción</h3>
      <div className={styles.grid}>
        {commonFields.map((field) => (
          <FormField
            key={field.name}
            id={field.name}
            label={field.label && field.label !== field.name ? field.label : humanizeFieldName(field.name)}
            type={field.type}
            value={headerViewModel.payload[field.name] as string | number | boolean}
            error={headerViewModel.errors[field.name]}
            required={field.required}
            options={headerViewModel.getFieldOptions(field)}
            helpText={field.helpText}
            isLoadingOptions={headerViewModel.isLoadingFieldOptions(field)}
            onChange={(value) => onFieldChange(field.name, value)}
          />
        ))}
      </div>

      <div className={styles.contextBox}>
        <strong>{getTransactionTypeLabel(transactionType)}</strong>
        <span>{TRANSACTION_TYPE_HELP[transactionType] ?? 'Elige un tipo de transacción para mostrar solo los campos relacionados.'}</span>
      </div>

      {contextualFields.length ? (
        <div className={styles.grid}>
          {contextualFields.map((field) => (
            <FormField
              key={field.name}
              id={field.name}
              label={field.label && field.label !== field.name ? field.label : humanizeFieldName(field.name)}
              type={field.type}
              value={headerViewModel.payload[field.name] as string | number | boolean}
              error={headerViewModel.errors[field.name]}
              required={field.required}
              options={headerViewModel.getFieldOptions(field)}
              helpText={field.helpText}
              isLoadingOptions={headerViewModel.isLoadingFieldOptions(field)}
              onChange={(value) => onFieldChange(field.name, value)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
