import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getSessionToken, isCashierOnlyUser } from '@/shared/auth/session';

const CASHIER_HOME = '/caja/venta';

/** Rutas que un cajero puro sí puede abrir además del punto de venta. */
const CASHIER_ALLOWED_PREFIXES = [CASHIER_HOME, '/perfil'];

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = getSessionToken();
  const location = useLocation();

  if (!token) return <Navigate to="/login" replace />;

  /**
   * El cajero sólo tiene que cobrar: entra directo al punto de venta y no
   * navega el resto del sistema. El backend valida los permisos igualmente;
   * esto es únicamente la experiencia de la pantalla.
   */
  if (isCashierOnlyUser()) {
    const permitida = CASHIER_ALLOWED_PREFIXES.some((prefix) => location.pathname.startsWith(prefix));
    if (!permitida) return <Navigate to={CASHIER_HOME} replace />;
  }

  return <>{children}</>;
}
