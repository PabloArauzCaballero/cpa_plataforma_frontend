import { LoginForm } from '../components/LoginForm';
import styles from './LoginPage.module.css';

export function LoginPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.copy}>
          <span>CPA Plataforma</span>
          <h2>Gestión académica, administrativa y financiera en un solo lugar.</h2>
          <p>
            Frontend modular para consultar recursos, crear registros, editar información operativa y revisar la trazabilidad del centro.
          </p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
