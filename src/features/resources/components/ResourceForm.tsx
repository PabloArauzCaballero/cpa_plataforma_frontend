import { Button } from '@/shared/components/Button';
import { FormField } from '@/shared/components/FormField';
import type { CrudRecord, CrudResourceDefinition } from '../domain/CrudResource';
import { useResourceFormViewModel } from '../hooks/useResourceFormViewModel';
import styles from './ResourceForm.module.css';

function humanizeFieldName(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

interface ResourceFormProps {
  resource: CrudResourceDefinition;
  record: CrudRecord | null;
  isSaving: boolean;
  onSubmit: (payload: CrudRecord) => void;
  onCancel: () => void;
}

export function ResourceForm({ resource, record, isSaving, onSubmit, onCancel }: ResourceFormProps) {
  const viewModel = useResourceFormViewModel(resource, record);
  const isJsonMode = resource.fields.length === 0;

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        const payload = viewModel.getPayload();
        if (payload) onSubmit(payload);
      }}
    >
      <div className={styles.notice}>
        <strong>{resource.table}</strong>
        <span>{isJsonMode ? 'Contrato de body no documentado: usa payload JSON controlado.' : 'Campos sugeridos desde el modelo del dominio.'}</span>
      </div>

      {isJsonMode ? (
        <label className={styles.jsonField}>
          <span>Payload JSON</span>
          <textarea value={viewModel.jsonPayload} onChange={(event) => viewModel.setJsonPayload(event.target.value)} rows={12} />
          {viewModel.errors.json ? <small>{viewModel.errors.json}</small> : null}
        </label>
      ) : (
        <div className={styles.grid}>
          {resource.fields.map((field) => (
            <FormField
              key={field.name}
              id={field.name}
              label={humanizeFieldName(field.name)}
              type={field.type}
              value={viewModel.payload[field.name] as string | number | boolean}
              error={viewModel.errors[field.name]}
              required={field.required}
              onChange={(value) => viewModel.setField(field.name, value)}
            />
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar'}</Button>
      </div>
    </form>
  );
}
