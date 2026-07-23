import { InfoHint } from '../Tooltip';
import styles from './FormField.module.css';

export type FieldType = 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'datetime-local' | 'textarea' | 'checkbox' | 'select' | 'url' | 'tel';

export interface FormFieldOption {
  value: string | number;
  label: string;
}

interface FormFieldProps {
  id: string;
  label: string;
  type?: FieldType;
  value: string | number | boolean;
  error?: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<string | FormFieldOption>;
  helpText?: string;
  disabled?: boolean;
  isLoadingOptions?: boolean;
  onChange: (value: string | number | boolean) => void;
}

function normalizeOption(option: string | FormFieldOption): FormFieldOption {
  return typeof option === 'string' ? { value: option, label: option } : option;
}

export function FormField({
  id,
  label,
  type = 'text',
  value,
  error,
  placeholder,
  required = false,
  options = [],
  helpText,
  disabled = false,
  isLoadingOptions = false,
  onChange,
}: FormFieldProps) {
  if (type === 'checkbox') {
    return (
      <label className={styles.checkboxField} htmlFor={id} aria-disabled={disabled}>
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span>
          {label}
          {helpText ? <InfoHint text={helpText} label={`Ayuda: ${label}`} /> : null}
        </span>
        {error ? <small className={styles.error}>{error}</small> : null}
      </label>
    );
  }

  if (type === 'select') {
    const normalizedOptions = options.map(normalizeOption);

    return (
      <label className={styles.field} htmlFor={id}>
        <span>
          {label}
          {required ? <strong> *</strong> : null}
          {helpText ? <InfoHint text={helpText} label={`Ayuda: ${label}`} /> : null}
        </span>
        <select
          id={id}
          value={String(value ?? '')}
          disabled={disabled || isLoadingOptions}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">{isLoadingOptions ? 'Cargando opciones...' : 'Seleccionar'}</option>
          {normalizedOptions.map((option) => (
            <option key={String(option.value)} value={String(option.value)}>{option.label}</option>
          ))}
        </select>
        {error ? <small className={styles.error}>{error}</small> : null}
      </label>
    );
  }

  return (
    <label className={styles.field} htmlFor={id}>
      <span>
        {label}
        {required ? <strong> *</strong> : null}
        {helpText ? <InfoHint text={helpText} label={`Ayuda: ${label}`} /> : null}
      </span>
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={String(value ?? '')}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={String(value ?? '')}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => onChange(type === 'number' ? (event.target.value === '' ? '' : Number(event.target.value)) : event.target.value)}
        />
      )}
      {error ? <small className={styles.error}>{error}</small> : null}
    </label>
  );
}
