import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authApi';

export function useLoginViewModel() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin.demo@cpa.test');
  const [password, setPassword] = useState('DemoAdmin123!');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!email.trim() || !password.trim()) {
      setError('Ingresa correo y contraseña.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const session = await login({ email, password });
      window.localStorage.setItem('cpa.sessionToken', session.sessionToken);
      window.localStorage.setItem('cpa.userEmail', session.email);
      navigate('/', { replace: true });
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No se pudo iniciar sesión.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    email,
    password,
    isSubmitting,
    error,
    setEmail,
    setPassword,
    submit,
  };
}
