import { Button } from '@/shared/components/Button';
import { FormField } from '@/shared/components/FormField';
import type { CrudRecord, CrudResourceDefinition } from '../domain/CrudResource';
import { useResourceFormViewModel } from '../hooks/useResourceFormViewModel';
import { humanizeFieldLabel } from '@/shared/utils/humanize';
import { CloudinaryUploadField } from './CloudinaryUploadField';
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

function isCloudinaryArchivoTransaccionField(resource: CrudResourceDefinition, fieldName: string): boolean {
  return resource.key === 'archivos-transaccion' && fieldName === 'link_achivo';
}

function shouldHideTechnicalMirrorField(resource: CrudResourceDefinition, fieldName: string): boolean {
  return resource.key === 'archivos-transaccion' && fieldName === 'link_archivo';
}

export function ResourceForm({ resource, record, isSaving, onSubmit, onCancel }: ResourceFormProps) {
  const viewModel = useResourceFormViewModel(resource, record);
  const isJsonMode = resource.fields.length === 0;
  const visibleFields = resource.fields.filter((field) => !shouldHideTechnicalMirrorField(resource, field.name));

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
        <strong>Contrato de datos</strong>
        <span>{isJsonMode ? 'Usa un cuerpo JSON controlado para este registro.' : 'Campos alineados al payload documentado para este recurso.'}</span>
      </div>

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

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar'}</Button>
      </div>
    </form>
  );
}
