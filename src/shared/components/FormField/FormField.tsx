import { InfoHint } from '../Tooltip';
import { SearchableSelect } from './SearchableSelect';
import styles from './FormField.module.css';

/** Desde cuántas opciones conviene buscar por texto en vez de desplegar la lista. */
const SEARCHABLE_OPTION_THRESHOLD = 12;

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

/**
 * Momento actual en el formato que espera el input, en hora local.
 *
 * `toISOString()` no sirve: devuelve UTC y en Bolivia dejaría la marcación cuatro
 * horas adelantada. Se compone a partir de las partes locales de la fecha.
 */
function currentLocalValue(type: FieldType): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  if (type === 'time') return time;
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${time}`;
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

    // A partir de cierta cantidad el <select> nativo deja de ser usable: hay que
    // recorrer la lista entera a mano, y en móvil es una rueda interminable. El
    // caso real son las unidades educativas, que son cientos. Por debajo del
    // umbral (tipo de estudiante, turno, nivel...) el nativo es mejor: se abre
    // de una y no hace falta teclear nada.
    if (normalizedOptions.length > SEARCHABLE_OPTION_THRESHOLD) {
      return (
        <label className={styles.field} htmlFor={id}>
          <span>
            {label}
            {required ? <strong> *</strong> : null}
            {helpText ? <InfoHint text={helpText} label={`Ayuda: ${label}`} /> : null}
          </span>
          <SearchableSelect
            id={id}
            options={normalizedOptions}
            value={value}
            disabled={disabled}
            isLoadingOptions={isLoadingOptions}
            onChange={onChange}
          />
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
        <TextualInput
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
        />
      )}
      {error ? <small className={styles.error}>{error}</small> : null}
    </label>
  );
}

interface TextualInputProps {
  id: string;
  type: FieldType;
  value: string | number | boolean;
  placeholder?: string;
  disabled: boolean;
  onChange: (value: string | number | boolean) => void;
}

function TextualInput({ id, type, value, placeholder, disabled, onChange }: TextualInputProps) {
  const input = (
    <input
      id={id}
      type={type}
      value={String(value ?? '')}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(event) => onChange(type === 'number' ? (event.target.value === '' ? '' : Number(event.target.value)) : event.target.value)}
    />
  );

  // Marcar una hora casi siempre significa "ahora": el atajo ahorra teclear la
  // fecha completa y evita equivocarse de día al registrar una asistencia.
  const offersNow = type === 'datetime-local' || type === 'time';
  if (!offersNow) return input;

  return (
    <div className={styles.timeRow}>
      {input}
      <button
        type="button"
        className={styles.nowButton}
        disabled={disabled}
        onClick={() => onChange(currentLocalValue(type))}
        title="Poner la fecha y hora de este momento"
      >
        Ahora
      </button>
    </div>
  );
}
