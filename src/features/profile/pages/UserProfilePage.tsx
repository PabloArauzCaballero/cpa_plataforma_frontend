import { Card } from '@/shared/components/Card';
import styles from './UserProfilePage.module.css';

export function UserProfilePage() {
  const email = window.localStorage.getItem('cpa.userEmail') ?? 'Usuario CPA';
  const token = window.localStorage.getItem('cpa.sessionToken') ?? '';

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <span>Perfil</span>
        <h2>Sesión activa</h2>
        <p>Vista de perfil local. El endpoint de perfil no está documentado, por eso no se consulta información adicional.</p>
      </div>
      <Card className={styles.card}>
        <dl>
          <div>
            <dt>Usuario</dt>
            <dd>{email}</dd>
          </div>
          <div>
            <dt>Token de sesión</dt>
            <dd>{token ? `${token.slice(0, 10)}...${token.slice(-6)}` : 'Sin token'}</dd>
          </div>
          <div>
            <dt>Autenticación</dt>
            <dd>X-Session-Token enviado automáticamente en cada request protegida.</dd>
          </div>
        </dl>
      </Card>
    </section>
  );
}
