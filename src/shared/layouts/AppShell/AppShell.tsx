import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getModuleVisualMeta } from '@/features/dashboard/moduleMeta';
import { clearStoredSession, getSessionDisplayName, userHasAnyPermission } from '@/shared/auth/session';
import { resourceModules } from '@/features/resources/domain/resourceDefinitions';
import { TutorialButton } from '@/features/onboarding/TutorialButton';
import { useFirstRunOnboarding } from '@/features/onboarding/useFirstRunOnboarding';
import styles from './AppShell.module.css';

interface AppShellProps {
  children?: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const email = getSessionDisplayName();
  const [navOpen, setNavOpen] = useState(false);

  // Recorrido de bienvenida automático la primera vez que el usuario entra.
  useFirstRunOnboarding(true);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  // Prevent the page behind the mobile drawer from scrolling while it is open.
  useEffect(() => {
    if (!navOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [navOpen]);

  function logout() {
    clearStoredSession();
    navigate('/login', { replace: true });
  }

  return (
    <div className={styles.shell} data-nav-open={navOpen}>
      <button
        type="button"
        className={styles.overlay}
        aria-label="Cerrar menú de navegación"
        hidden={!navOpen}
        onClick={() => setNavOpen(false)}
      />
      <aside id="app-sidebar" className={styles.sidebar} data-open={navOpen}>
        <div className={styles.brand}>
          <span className={styles.brandTitle}>CPA Plataforma</span>
          <span>Centro de Preparación Académica</span>
        </div>
        <nav className={styles.nav} aria-label="Navegación principal">
          <NavLink to="/" end className={styles.homeLink}>
            <i className="fa-solid fa-house" aria-hidden="true" />
            <span>Inicio</span>
          </NavLink>
          {resourceModules.map((module) => {
            const meta = getModuleVisualMeta(module.key);
            const visibleResources = module.resources.filter((resource) => userHasAnyPermission(resource.permissions));
            if (visibleResources.length === 0) return null;

            return (
              <details
                key={module.key}
                data-tour={module.key === 'personas' ? 'module-personas' : undefined}
                open={module.key === 'personas' || module.key === 'servicios_educativos'}
              >
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
                  <NavLink to={`/modulos/${module.key}`} end className={styles.moduleBoardLink}>
                    <i className="fa-solid fa-table-cells-large" aria-hidden="true" />
                    Tablero del módulo
                  </NavLink>
                  {module.key === 'contabilidad' ? (
                    <>
                      <NavLink to="/contabilidad/catalogos-cuentas-operativas" className={styles.moduleBoardLink}>
                        <i className="fa-solid fa-sliders" aria-hidden="true" />
                        Catálogos y cuentas operativas
                      </NavLink>
                      <NavLink to="/contabilidad/archivos" className={styles.moduleBoardLink}>
                        <i className="fa-solid fa-folder-open" aria-hidden="true" />
                        Biblioteca de archivos
                      </NavLink>
                    </>
                  ) : null}
                  {visibleResources.map((resource) => (
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
          <div className={styles.headerBrand}>
            <button
              type="button"
              className={styles.menuButton}
              aria-label={navOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={navOpen}
              aria-controls="app-sidebar"
              onClick={() => setNavOpen((open) => !open)}
            >
              <i className={navOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'} aria-hidden="true" />
            </button>
            <img src="/logo.png" alt="CPA Centro de Preparación Académica" className={styles.headerLogo} />
            <div>
              <p>Plataforma interna</p>
              <h1>Gestión CPA</h1>
            </div>
          </div>
          <div className={styles.userBox}>
            <TutorialButton />
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
        <main className={styles.content}>
          <div key={location.pathname} className={styles.routeTransition}>
            {children ?? <Outlet />}
          </div>
        </main>
        <footer className={styles.footer}>
          <span>CPA Plataforma · Versión 1.1.37</span>
          <span>Todos los derechos reservados 2026</span>
        </footer>
      </div>
    </div>
  );
}
