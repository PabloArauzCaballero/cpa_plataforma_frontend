import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authApi';
import { saveStoredSession } from '@/shared/auth/session';

export function useLoginViewModel() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('pablo.admin');
  const [password, setPassword] = useState('PabloAdmin2026!');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!email.trim() || !password.trim()) {
      setError('Ingresa usuario o correo y contraseña.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const session = await login({ email, password });
      saveStoredSession(session);
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
