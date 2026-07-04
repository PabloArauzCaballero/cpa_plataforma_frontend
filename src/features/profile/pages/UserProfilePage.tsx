import { useMemo } from 'react';
import { PageState } from '@/shared/components/PageState';
import { useUserProfileViewModel } from '../hooks/useUserProfileViewModel';
import type { UserProfile } from '../domain/UserProfile';
import styles from './UserProfilePage.module.css';

function getInitials(profile: UserProfile): string {
  const fullName = profile.nombreCompleto || `${profile.nombres} ${profile.apellidos}`.trim() || profile.username || profile.email;
  const parts = fullName.split(/\s+/).filter(Boolean);
  const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : fullName.slice(0, 2);
  return initials ? initials.toUpperCase() : 'CP';
}

function display(value: string | undefined | null, fallback = 'No disponible'): string {
  return value && String(value).trim() ? String(value).trim() : fallback;
}

function formatBoolean(value: boolean): string {
  return value ? 'Sí' : 'No';
}

function getMainRole(profile: UserProfile): string {
  if (profile.esSuperUsuario) return 'Super usuario';
  if (profile.roles.length > 0) return profile.roles[0];
  return display(profile.tipoUsuario, 'Sin rol principal disponible');
}

export function UserProfilePage() {
  const { profile, isLoading, error, reload } = useUserProfileViewModel();
  const initials = useMemo(() => (profile ? getInitials(profile) : 'CP'), [profile]);

  if (isLoading) {
    return <PageState title="Cargando perfil" message="Consultando la sesión actual del usuario autenticado." />;
  }

  if (error || !profile) {
    return (
      <PageState
        title="No se pudo cargar el perfil"
        message={error ?? 'La sesión no devolvió información de perfil.'}
        actionLabel="Reintentar"
        onAction={reload}
      />
    );
  }

  return (
    <main className={styles.profilePage}>
      <section className={styles.pageHeader}>
        <div>
          <h1>PERFIL DE USUARIO</h1>
          <p>Información de tu cuenta, roles y permisos activos dentro del sistema CPA.</p>
        </div>

        <div className={styles.headerActions}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} type="button" onClick={reload}>
            <i className="fa-solid fa-rotate" aria-hidden="true" />
            Actualizar datos
          </button>
        </div>
      </section>

      <section className={styles.profileGrid}>
        <aside className={`${styles.card} ${styles.profileSummary}`}>
          <div className={styles.profileCover} />

          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>{initials}</div>
          </div>

          <div className={styles.profileName}>
            <h2>{display(profile.nombreCompleto)}</h2>
            <p>{display(profile.email)}</p>
          </div>

          <div className={styles.badgeRow}>
            <span className={`${styles.badge} ${styles.badgeSuccess}`}>
              <i className="fa-solid fa-circle-check" aria-hidden="true" />
              {display(profile.estado, 'Estado no disponible')}
            </span>

            <span className={`${styles.badge} ${styles.badgeInfo}`}>
              <i className="fa-solid fa-shield-halved" aria-hidden="true" />
              {getMainRole(profile)}
            </span>
          </div>

          <div className={styles.summaryList}>
            <SummaryItem icon="fa-solid fa-user" label="Nombre de usuario" value={display(profile.username)} />
            <SummaryItem icon="fa-solid fa-id-card" label="ID Persona" value={display(profile.idPersona)} />
            <SummaryItem icon="fa-solid fa-briefcase" label="Tipo de usuario" value={display(profile.tipoUsuario)} />
            <SummaryItem icon="fa-solid fa-lock" label="Super usuario" value={formatBoolean(profile.esSuperUsuario)} />
          </div>
        </aside>

        <section className={styles.contentStack}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Información personal</h2>
                <p>Datos devueltos por la sesión actual.</p>
              </div>

              <span className={`${styles.badge} ${styles.badgeInfo}`}>
                <i className="fa-solid fa-user" aria-hidden="true" />
                Sesión
              </span>
            </div>

            <div className={styles.formGrid}>
              <ReadOnlyField label="Nombres" value={display(profile.nombres)} />
              <ReadOnlyField label="Apellidos" value={display(profile.apellidos)} />
              <ReadOnlyField label="Correo electrónico" value={display(profile.email)} />
              <ReadOnlyField label="Nombre de usuario" value={display(profile.username)} />
              <ReadOnlyField label="Teléfono" value={display(profile.telefono)} />
              <ReadOnlyField label="ID Persona" value={display(profile.idPersona)} />
              <ReadOnlyField label="Tipo de usuario" value={display(profile.tipoUsuario)} />
              <ReadOnlyField label="Estado" value={display(profile.estado)} />
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Roles</h2>
                <p>Roles asignados a tu usuario. Si no existen roles activos, esta sección queda vacía.</p>
              </div>
            </div>

            {profile.roles.length > 0 ? (
              <div className={styles.chipList}>
                {profile.roles.map((role) => <span className={`${styles.badge} ${styles.badgeInfo}`} key={role}>{role}</span>)}
              </div>
            ) : (
              <p className={styles.emptyText}>No hay roles activos para esta sesión.</p>
            )}
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Permisos</h2>
                <p>Permisos activos de tu sesión. No se muestran permisos de prueba.</p>
              </div>
            </div>

            {profile.permisos.length > 0 ? (
              <div className={styles.permissionTableWrapper}>
                <table>
                  <thead>
                    <tr>
                      <th>Permiso</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.permisos.map((permission) => (
                      <tr key={permission}>
                        <td>{permission}</td>
                        <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Permitido</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={styles.emptyText}>No hay permisos activos para esta sesión.</p>
            )}
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Sesión</h2>
                <p>Resumen de sesión para soporte</p>
              </div>
            </div>

            <div className={styles.rawGrid}>
              <ReadOnlyField label="Fuente" value="Sesión autenticada" />
              <ReadOnlyField label="Datos de usuario" value={profile.username || profile.idPersona ? 'Disponible' : 'No disponible'} />
              <ReadOnlyField label="Datos de persona" value={profile.nombreCompleto || profile.nombres || profile.apellidos ? 'Disponible' : 'No disponible'} />
              <ReadOnlyField label="Datos de sesión" value={Object.keys((profile.rawData.session as Record<string, unknown>) ?? {}).length > 0 ? 'Disponible' : 'No disponible'} />
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.formGroup}>
      <label>{label}</label>
      <input type="text" value={value} disabled readOnly />
    </div>
  );
}

function SummaryItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className={styles.summaryItem}>
      <div className={styles.summaryIcon}>
        <i className={icon} aria-hidden="true" />
      </div>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
