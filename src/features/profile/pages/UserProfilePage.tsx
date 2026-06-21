import { useMemo, useState } from 'react';
import styles from './UserProfilePage.module.css';

interface ProfileFormState {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone: string;
  document: string;
  role: string;
  status: string;
  notes: string;
}

function buildInitialProfile(): ProfileFormState {
  const storedEmail = window.localStorage.getItem('cpa.userEmail') ?? 'admin.demo@cpa.test';
  const username = storedEmail.includes('@') ? storedEmail.split('@')[0] : 'admin.demo';
  const [first = 'Admin', last = 'Demo'] = username
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

  return {
    firstName: first,
    lastName: last,
    email: storedEmail,
    username,
    phone: '+591 70000000',
    document: '900001-SC',
    role: 'Super usuario',
    status: 'Activo',
    notes: 'Usuario demo para pruebas internas del sistema CPA.',
  };
}

function getInitials(firstName: string, lastName: string): string {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.trim();
  return initials ? initials.toUpperCase() : 'AD';
}

export function UserProfilePage() {
  const initialProfile = useMemo(buildInitialProfile, []);
  const [profile, setProfile] = useState<ProfileFormState>(initialProfile);
  const [message, setMessage] = useState<string | null>(null);
  const initials = getInitials(profile.firstName, profile.lastName);

  function updateField(field: keyof ProfileFormState, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
    setMessage(null);
  }

  function resetProfileForm() {
    setProfile(initialProfile);
    setMessage('Cambios restaurados con los datos iniciales de la sesión.');
  }

  function saveProfile() {
    setMessage('Perfil actualizado correctamente como mockup local.');
  }

  return (
    <main className={styles.profilePage}>
      <section className={styles.pageHeader}>
        <div>
          <h1>Perfil de Usuario</h1>
          <p>Consulta y actualiza la información general del usuario autenticado dentro del sistema CPA.</p>
        </div>

        <div className={styles.headerActions}>
          <button className={`${styles.btn} ${styles.btnLight}`} type="button" onClick={resetProfileForm}>
            <i className="fa-solid fa-rotate-left" aria-hidden="true" />
            Restaurar
          </button>

          <button className={`${styles.btn} ${styles.btnPrimary}`} type="button" onClick={saveProfile}>
            <i className="fa-solid fa-floppy-disk" aria-hidden="true" />
            Guardar cambios
          </button>
        </div>
      </section>

      {message ? <p className={styles.message}>{message}</p> : null}

      <section className={styles.profileGrid}>
        <aside className={`${styles.card} ${styles.profileSummary}`}>
          <div className={styles.profileCover} />

          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>{initials}</div>
          </div>

          <div className={styles.profileName}>
            <h2>{profile.firstName} {profile.lastName}</h2>
            <p>{profile.email}</p>
          </div>

          <div className={styles.badgeRow}>
            <span className={`${styles.badge} ${styles.badgeSuccess}`}>
              <i className="fa-solid fa-circle-check" aria-hidden="true" />
              Activo
            </span>

            <span className={`${styles.badge} ${styles.badgeInfo}`}>
              <i className="fa-solid fa-shield-halved" aria-hidden="true" />
              Super usuario
            </span>
          </div>

          <div className={styles.summaryList}>
            <div className={styles.summaryItem}>
              <div className={styles.summaryIcon}>
                <i className="fa-solid fa-user" aria-hidden="true" />
              </div>
              <div>
                <small>Nombre de usuario</small>
                <strong>{profile.username}</strong>
              </div>
            </div>

            <div className={styles.summaryItem}>
              <div className={styles.summaryIcon}>
                <i className="fa-solid fa-id-card" aria-hidden="true" />
              </div>
              <div>
                <small>ID Persona</small>
                <strong>{profile.document}</strong>
              </div>
            </div>

            <div className={styles.summaryItem}>
              <div className={styles.summaryIcon}>
                <i className="fa-solid fa-briefcase" aria-hidden="true" />
              </div>
              <div>
                <small>Rol principal</small>
                <strong>Administrador del sistema</strong>
              </div>
            </div>

            <div className={styles.summaryItem}>
              <div className={styles.summaryIcon}>
                <i className="fa-solid fa-lock" aria-hidden="true" />
              </div>
              <div>
                <small>Seguridad de sesión</small>
                <strong>Sesión privada activa</strong>
              </div>
            </div>
          </div>
        </aside>

        <section className={styles.contentStack}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Información personal</h2>
                <p>Datos principales visibles para administración, auditoría y operación interna.</p>
              </div>

              <span className={`${styles.badge} ${styles.badgeWarning}`}>
                <i className="fa-solid fa-database" aria-hidden="true" />
                Mockup
              </span>
            </div>

            <form id="profileForm">
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">Nombres</label>
                  <input id="firstName" type="text" value={profile.firstName} onChange={(event) => updateField('firstName', event.target.value)} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Apellidos</label>
                  <input id="lastName" type="text" value={profile.lastName} onChange={(event) => updateField('lastName', event.target.value)} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Correo electrónico</label>
                  <input id="email" type="email" value={profile.email} onChange={(event) => updateField('email', event.target.value)} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="username">Nombre de usuario</label>
                  <input id="username" type="text" value={profile.username} disabled />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Teléfono</label>
                  <input id="phone" type="text" value={profile.phone} onChange={(event) => updateField('phone', event.target.value)} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="document">Documento</label>
                  <input id="document" type="text" value={profile.document} onChange={(event) => updateField('document', event.target.value)} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="role">Tipo de usuario</label>
                  <select id="role" value={profile.role} onChange={(event) => updateField('role', event.target.value)}>
                    <option>Super usuario</option>
                    <option>Administrador</option>
                    <option>Operador</option>
                    <option>Consulta</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="status">Estado</label>
                  <select id="status" value={profile.status} onChange={(event) => updateField('status', event.target.value)}>
                    <option>Activo</option>
                    <option>Inactivo</option>
                    <option>Bloqueado</option>
                  </select>
                </div>

                <div className={`${styles.formGroup} ${styles.full}`}>
                  <label htmlFor="notes">Notas internas</label>
                  <textarea id="notes" value={profile.notes} onChange={(event) => updateField('notes', event.target.value)} />
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={`${styles.btn} ${styles.btnLight}`} onClick={resetProfileForm}>
                  Limpiar cambios
                </button>

                <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={saveProfile}>
                  Actualizar perfil
                </button>
              </div>
            </form>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Preferencias</h2>
                <p>Configuraciones generales del usuario dentro del panel administrativo.</p>
              </div>
            </div>

            <div className={styles.preferencesGrid}>
              <Preference icon="fa-solid fa-bell" title="Notificaciones internas" description="Recibir avisos del sistema, alertas de operación y cambios importantes." checked />
              <Preference icon="fa-solid fa-envelope" title="Resumen por correo" description="Recibir resumen administrativo cuando existan cambios relevantes." checked />
              <Preference icon="fa-solid fa-table-columns" title="Vista compacta" description="Mostrar tablas, filtros y formularios con menor separación visual." />
              <Preference icon="fa-solid fa-shield-halved" title="Confirmar acciones críticas" description="Solicitar confirmación antes de inhabilitar o modificar registros sensibles." checked />
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Permisos principales</h2>
                <p>Resumen visual de módulos habilitados para este usuario.</p>
              </div>
            </div>

            <div className={styles.permissionTableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>Módulo</th>
                    <th>Lectura</th>
                    <th>Creación</th>
                    <th>Edición</th>
                    <th>Estado</th>
                  </tr>
                </thead>

                <tbody>
                  <PermissionRow icon="fa-solid fa-building" module="Administración" />
                  <PermissionRow icon="fa-solid fa-file-invoice-dollar" module="Contabilidad" />
                  <PermissionRow icon="fa-solid fa-shield-halved" module="Seguridad" />
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2>Actividad reciente</h2>
                <p>Últimas acciones realizadas por el usuario dentro del sistema.</p>
              </div>
            </div>

            <div className={styles.activityList}>
              <Activity icon="fa-solid fa-right-to-bracket" title="Inicio de sesión" detail="Ingreso correcto con sesión privada usando token interno." date="Hace 5 min" />
              <Activity icon="fa-solid fa-list-check" title="Smoke test ejecutado" detail="Validación E2E completada con pruebas aprobadas." date="Hoy" />
              <Activity icon="fa-solid fa-user-shield" title="Permisos verificados" detail="Acceso de super usuario validado para módulos CRUD." date="Hoy" />
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function Preference({ icon, title, description, checked = false }: { icon: string; title: string; description: string; checked?: boolean }) {
  return (
    <div className={styles.preferenceItem}>
      <div className={styles.preferenceIcon}>
        <i className={icon} aria-hidden="true" />
      </div>

      <div className={styles.preferenceContent}>
        <strong>{title}</strong>
        <span>{description}</span>

        <label className={styles.switch}>
          <input type="checkbox" defaultChecked={checked} />
          <span className={styles.slider} />
        </label>
      </div>
    </div>
  );
}

function PermissionRow({ icon, module }: { icon: string; module: string }) {
  return (
    <tr>
      <td>
        <span className={styles.modulePill}>
          <i className={icon} aria-hidden="true" />
          {module}
        </span>
      </td>
      <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Permitido</span></td>
      <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Permitido</span></td>
      <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Permitido</span></td>
      <td><span className={`${styles.badge} ${styles.badgeInfo}`}>Activo</span></td>
    </tr>
  );
}

function Activity({ icon, title, detail, date }: { icon: string; title: string; detail: string; date: string }) {
  return (
    <div className={styles.activityItem}>
      <div className={styles.activityIcon}>
        <i className={icon} aria-hidden="true" />
      </div>

      <div className={styles.activityInfo}>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>

      <span className={styles.activityDate}>{date}</span>
    </div>
  );
}
