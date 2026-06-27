import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getSessionToken } from '@/shared/auth/session';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = getSessionToken();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
