import styles from './FormField.module.css';

export type FieldType = 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'datetime-local' | 'textarea' | 'checkbox';

interface FormFieldProps {
  id: string;
  label: string;
  type?: FieldType;
  value: string | number | boolean;
  error?: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string | number | boolean) => void;
}

export function FormField({
  id,
  label,
  type = 'text',
  value,
  error,
  placeholder,
  required = false,
  onChange,
}: FormFieldProps) {
  if (type === 'checkbox') {
    return (
      <label className={styles.checkboxField} htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span>{label}</span>
      </label>
    );
  }

  return (
    <label className={styles.field} htmlFor={id}>
      <span>
        {label}
        {required ? <strong> *</strong> : null}
      </span>
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={String(value ?? '')}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={String(value ?? '')}
          placeholder={placeholder}
          onChange={(event) => onChange(type === 'number' ? (event.target.value === '' ? '' : Number(event.target.value)) : event.target.value)}
        />
      )}
      {error ? <small>{error}</small> : null}
    </label>
  );
}
