import { AmbientBackground } from '@/shared/components/Background';
import { LoginForm } from '../components/LoginForm';
import styles from './LoginPage.module.css';

/**
 * Argumentos de valor del producto. Van como datos y no como marcado suelto
 * para que ampliar la lista no obligue a tocar la maquetación.
 */
const HIGHLIGHTS = [
  {
    icon: 'fa-solid fa-layer-group',
    title: 'Nueve módulos operativos',
    text: 'Personas, académico, contabilidad, deuda, inventario e infraestructura en una sola plataforma.',
  },
  {
    icon: 'fa-solid fa-table-list',
    title: 'Consulta y carga masiva',
    text: 'Búsqueda, filtros, exportación e importación por Excel sobre cada tabla del sistema.',
  },
  {
    icon: 'fa-solid fa-route',
    title: 'Tutoriales guiados',
    text: 'Recorridos paso a paso integrados en la propia pantalla que estás usando.',
  },
];

export function LoginPage() {
  return (
    <main className={`${styles.page} bgSurface`} data-bg="auth">
      <AmbientBackground variant="auth" reactive />

      <div className={styles.shell}>
        {/* ── Zona visual: identidad y motivos para confiar ─────────────── */}
        <section className={styles.visual}>
          <div className={styles.brand}>
            <img src="/logo.png" alt="CPA Centro de Preparación Académica" className={styles.logo} />
            <div className={styles.brandText}>
              <strong>CPA Plataforma</strong>
              <span>Centro de Preparación Académica</span>
            </div>
          </div>

          <div className={styles.copy}>
            <h2>
              Gestión académica, administrativa y financiera
              <em> en un solo lugar.</em>
            </h2>
            <p>
              Portal interno para consultar recursos, crear registros, editar información operativa y revisar la
              trazabilidad del centro.
            </p>
          </div>

          <ul className={styles.highlights}>
            {HIGHLIGHTS.map((item) => (
              <li key={item.title}>
                <span className={styles.highlightIcon}>
                  <i className={item.icon} aria-hidden="true" />
                </span>
                <span className={styles.highlightText}>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </span>
              </li>
            ))}
          </ul>

          <p className={styles.trust}>
            <i className="fa-solid fa-lock" aria-hidden="true" />
            Conexión privada · Las credenciales las asigna administración
          </p>
        </section>

        {/* ── Zona funcional ────────────────────────────────────────────── */}
        <div className={styles.formZone}>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
