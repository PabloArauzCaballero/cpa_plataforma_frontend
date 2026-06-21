import type { ReactNode } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getModuleVisualMeta } from '@/features/dashboard/moduleMeta';
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
          <NavLink to="/" end className={styles.homeLink}>
            <i className="fa-solid fa-house" aria-hidden="true" />
            <span>Inicio</span>
          </NavLink>
          {resourceModules.map((module) => {
            const meta = getModuleVisualMeta(module.key);

            return (
              <details key={module.key} open={module.key === 'personas' || module.key === 'servicios_educativos'}>
                <summary>
                  <span className={styles.moduleSummaryIcon}>
                    <i className={meta.icon} aria-hidden="true" />
                  </span>
                  <span className={styles.moduleSummaryText}>
                    <strong>{module.label}</strong>
                    <small>{meta.shortDescription}</small>
                  </span>
                </summary>
                <div className={styles.moduleLinks}>
                  {module.resources.map((resource) => (
                    <NavLink to={`/modulos/${module.key}/${resource.key}`} key={resource.key}>
                      {resource.label}
                    </NavLink>
                  ))}
                </div>
              </details>
            );
          })}
        </nav>
      </aside>
      <div className={styles.mainArea}>
        <header className={styles.header}>
          <div>
            <p>Plataforma interna</p>
            <h1>Gestión CPA</h1>
          </div>
          <div className={styles.userBox}>
            <NavLink to="/perfil">
              <i className="fa-solid fa-user-circle" aria-hidden="true" />
              {email}
            </NavLink>
            <button onClick={logout}>
              <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
              Cerrar sesión
            </button>
          </div>
        </header>
        <main className={styles.content}>{children ?? <Outlet />}</main>
        <footer className={styles.footer}>
          <span>CPA Plataforma</span>
          <span>Frontend React para gestión modular interna</span>
        </footer>
      </div>
    </div>
  );
}
