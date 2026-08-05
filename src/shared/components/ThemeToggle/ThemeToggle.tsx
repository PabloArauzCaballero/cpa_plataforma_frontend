import { useTheme } from '@/shared/theme/useTheme';
import styles from './ThemeToggle.module.css';

/**
 * Cambio entre vista clara y oscura.
 *
 * Arranca siguiendo la preferencia del sistema y, en cuanto se pulsa, pasa a
 * mandar la elección manual, que se recuerda entre sesiones.
 *
 * El control es un `switch`: comunica un estado con dos posiciones, no una
 * acción que se dispara. `aria-checked` refleja si la vista oscura está activa
 * y la etiqueta dice a dónde lleva la pulsación.
 */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Cambiar a vista clara' : 'Cambiar a vista oscura'}
      title={isDark ? 'Vista clara' : 'Vista oscura'}
      className={styles.toggle}
      data-theme-state={theme}
      onClick={toggle}
    >
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb}>
          <i className={isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun'} />
        </span>
      </span>
    </button>
  );
}
