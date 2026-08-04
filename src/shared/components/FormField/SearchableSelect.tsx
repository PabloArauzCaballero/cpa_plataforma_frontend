import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { FormFieldOption } from './FormField';
import styles from './FormField.module.css';

interface SearchableSelectProps {
  id: string;
  options: FormFieldOption[];
  value: string | number | boolean;
  disabled: boolean;
  isLoadingOptions: boolean;
  onChange: (value: string | number | boolean) => void;
}

/**
 * Quita tildes y pasa a minúsculas, para que "Nuñez" encuentre a "Núñez".
 * Los nombres de colegios se escriben con y sin acento indistintamente, y un
 * filtro literal deja fuera la mitad de los resultados.
 */
export function normalizeForSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Cada término tiene que aparecer en la etiqueta, en cualquier orden. Así
 * "san calixto" encuentra a "Colegio San Calixto" y también "calixto san".
 */
export function matches(label: string, query: string): boolean {
  const haystack = normalizeForSearch(label);
  return normalizeForSearch(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

/**
 * Selector con búsqueda por texto para listas largas.
 *
 * Un `<select>` nativo con cientos de unidades educativas obliga a recorrer la
 * lista entera a mano: en móvil es una rueda interminable y en escritorio sólo
 * se puede saltar tecleando las primeras letras exactas. Aquí se escribe parte
 * del nombre y la lista se reduce.
 *
 * El valor real que viaja en el payload sigue siendo el id de la opción; lo que
 * se escribe es sólo el filtro. Al cerrar sin elegir, el texto vuelve a la
 * etiqueta seleccionada para no dejar en pantalla una búsqueda a medias que
 * parezca un valor.
 */
export function SearchableSelect({ id, options, value, disabled, isLoadingOptions, onChange }: SearchableSelectProps) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);

  const selectedOption = options.find((option) => String(option.value) === String(value ?? '')) ?? null;
  const visibleOptions = useMemo(
    () => (query.trim() ? options.filter((option) => matches(option.label, query)) : options),
    [options, query],
  );

  // Al cerrar, el input muestra lo elegido, no lo tecleado.
  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  // Un clic fuera cierra la lista: sin esto queda abierta encima del resto del
  // formulario y tapa los campos siguientes.
  useEffect(() => {
    if (!isOpen) return undefined;
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen]);

  function commit(option: FormFieldOption) {
    onChange(option.value);
    setIsOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setHighlighted((current) => {
        if (!visibleOptions.length) return 0;
        return (current + step + visibleOptions.length) % visibleOptions.length;
      });
      return;
    }
    if (event.key === 'Enter' && isOpen) {
      const option = visibleOptions[highlighted];
      if (option) {
        event.preventDefault();
        commit(option);
      }
      return;
    }
    if (event.key === 'Escape' && isOpen) {
      // Se detiene aquí para que Escape cierre la lista y no el modal entero.
      event.stopPropagation();
      setIsOpen(false);
    }
  }

  const placeholder = isLoadingOptions
    ? 'Cargando opciones...'
    : selectedOption
      ? selectedOption.label
      : 'Escribe para buscar';

  return (
    <div className={styles.searchable} ref={containerRef}>
      <input
        id={id}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-autocomplete="list"
        disabled={disabled || isLoadingOptions}
        placeholder={placeholder}
        data-selected={selectedOption ? 'true' : undefined}
        value={isOpen ? query : (selectedOption?.label ?? '')}
        onChange={(event) => {
          setQuery(event.target.value);
          setHighlighted(0);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
      />

      {selectedOption && !disabled && !isLoadingOptions ? (
        <button
          type="button"
          className={styles.searchableClear}
          aria-label="Quitar selección"
          onClick={() => {
            onChange('');
            setIsOpen(false);
          }}
        >
          ×
        </button>
      ) : null}

      {isOpen ? (
        <ul className={styles.searchableList} id={listId} role="listbox">
          {visibleOptions.length ? (
            visibleOptions.slice(0, 50).map((option, index) => (
              <li key={String(option.value)}>
                <button
                  type="button"
                  role="option"
                  aria-selected={String(option.value) === String(value ?? '')}
                  data-highlighted={index === highlighted ? 'true' : undefined}
                  // `mousedown` y no `click`: el blur del input llega antes que
                  // el click y cerraría la lista sin llegar a elegir nada.
                  onMouseDown={(event) => {
                    event.preventDefault();
                    commit(option);
                  }}
                  onMouseEnter={() => setHighlighted(index)}
                >
                  {option.label}
                </button>
              </li>
            ))
          ) : (
            <li className={styles.searchableEmpty}>Sin resultados para “{query}”</li>
          )}
          {visibleOptions.length > 50 ? (
            <li className={styles.searchableEmpty}>
              {visibleOptions.length - 50} resultados más. Afina la búsqueda.
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
