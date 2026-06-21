import { Button } from '@/shared/components/Button';
import { FormField } from '@/shared/components/FormField';
import { useLoginViewModel } from '../hooks/useLoginViewModel';
import styles from './LoginForm.module.css';

export function LoginForm() {
  const viewModel = useLoginViewModel();

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        void viewModel.submit();
      }}
    >
      <div className={styles.heading}>
        <span>Acceso privado</span>
        <h1>Ingresar a CPA</h1>
        <p>Usa las credenciales seed del backend o las credenciales reales configuradas para el sistema.</p>
      </div>
      <FormField id="email" label="Correo" type="email" value={viewModel.email} onChange={(value) => viewModel.setEmail(String(value))} required />
      <FormField id="password" label="Contraseña" type="password" value={viewModel.password} onChange={(value) => viewModel.setPassword(String(value))} required />
      {viewModel.error ? <p className={styles.error}>{viewModel.error}</p> : null}
      <Button type="submit" fullWidth disabled={viewModel.isSubmitting}>
        {viewModel.isSubmitting ? 'Validando...' : 'Iniciar sesión'}
      </Button>
    </form>
  );
}
