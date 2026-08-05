import { useId, useState } from 'react';
import { Button } from '@/shared/components/Button';
import { useLoginViewModel } from '../hooks/useLoginViewModel';
import styles from './LoginForm.module.css';

/**
 * El formulario de acceso monta sus propios campos en vez de reutilizar
 * `FormField`.
 *
 * Motivo: son sólo dos campos, pero necesitan tratamientos que el campo
 * genérico no expone —mostrar/ocultar contraseña, icono dentro del control y
 * autocompletado de credenciales—. Añadir esas ranuras a `FormField`
 * afectaría a los cientos de campos de los formularios de recursos para
 * beneficiar a una única pantalla.
 */
export function LoginForm() {
  const viewModel = useLoginViewModel();
  const [showPassword, setShowPassword] = useState(false);
  const errorId = useId();

  const isBusy = viewModel.isSubmitting;

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void viewModel.submit();
      }}
    >
      <div className={styles.heading}>
        <span className={styles.eyebrow}>
          <i className="fa-solid fa-shield-halved" aria-hidden="true" />
          Acceso privado
        </span>
        <h1>Ingresar a CPA</h1>
        <p>Usa las credenciales asignadas por administración para ingresar al sistema.</p>
      </div>

      <div className={styles.fields}>
        <label className={styles.field} htmlFor="email">
          <span className={styles.label}>Usuario o correo</span>
          <span className={styles.control}>
            <i className="fa-solid fa-user" aria-hidden="true" />
            <input
              id="email"
              name="email"
              type="text"
              value={viewModel.email}
              onChange={(event) => viewModel.setEmail(event.target.value)}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
              disabled={isBusy}
              aria-invalid={viewModel.error ? true : undefined}
              aria-describedby={viewModel.error ? errorId : undefined}
              placeholder="nombre.usuario"
            />
          </span>
        </label>

        <label className={styles.field} htmlFor="password">
          <span className={styles.label}>Contraseña</span>
          <span className={styles.control}>
            <i className="fa-solid fa-lock" aria-hidden="true" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={viewModel.password}
              onChange={(event) => viewModel.setPassword(event.target.value)}
              autoComplete="current-password"
              required
              disabled={isBusy}
              aria-invalid={viewModel.error ? true : undefined}
              aria-describedby={viewModel.error ? errorId : undefined}
              placeholder="••••••••"
            />
            <button
              type="button"
              className={styles.reveal}
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              aria-pressed={showPassword}
            >
              <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} aria-hidden="true" />
            </button>
          </span>
        </label>
      </div>

      {/* `role="alert"` para que el lector de pantalla anuncie el fallo sin que
          el usuario tenga que volver a recorrer el formulario. */}
      {viewModel.error ? (
        <p className={styles.error} id={errorId} role="alert">
          <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
          <span>{viewModel.error}</span>
        </p>
      ) : null}

      <Button type="submit" fullWidth disabled={isBusy} className={styles.submit}>
        {isBusy ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            Validando…
          </>
        ) : (
          <>
            Iniciar sesión
            <i className="fa-solid fa-arrow-right-to-bracket" aria-hidden="true" />
          </>
        )}
      </Button>

      <p className={styles.footnote}>¿Problemas para entrar? Contacta con administración del centro.</p>
    </form>
  );
}
