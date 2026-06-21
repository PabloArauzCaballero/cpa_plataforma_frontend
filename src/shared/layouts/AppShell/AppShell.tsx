import type { ReactNode } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { resourceModules } from '@/features/resources/domain/resourceDefinitions';
import styles from './AppShell.module.css';

interface AppShellProps {
  children?: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();
  const email = window.localStorage.getItem('cpa.userEmail') ?? 'Usuario CPA';

  function logout() {
    window.localStorage.removeItem('cpa.sessionToken');
    window.localStorage.removeItem('cpa.userEmail');
    navigate('/login', { replace: true });
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <strong>CPA</strong>
          <span>Centro de Preparación Académica</span>
        </div>
        <nav className={styles.nav} aria-label="Navegación principal">
          <NavLink to="/" end>Inicio</NavLink>
          {resourceModules.map((module) => (
            <details key={module.key} open={module.key === 'personas' || module.key === 'servicios_educativos'}>
              <summary>{module.label}</summary>
              {module.resources.map((resource) => (
                <NavLink to={`/modulos/${module.key}/${resource.key}`} key={resource.key}>
                  {resource.label}
                </NavLink>
              ))}
            </details>
          ))}
        </nav>
      </aside>
      <div className={styles.mainArea}>
        <header className={styles.header}>
          <div>
            <p>Plataforma interna</p>
            <h1>Gestión CPA</h1>
          </div>
          <div className={styles.userBox}>
            <NavLink to="/perfil">{email}</NavLink>
            <button onClick={logout}>Cerrar sesión</button>
          </div>
        </header>
        <main className={styles.content}>{children ?? <Outlet />}</main>
        <footer className={styles.footer}>
          <span>CPA Plataforma</span>
          <span>Frontend React basado en endpoints documentados</span>
        </footer>
      </div>
    </div>
  );
}
