import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/shared/layouts/AppShell';
import { HomePage } from '@/features/dashboard/pages/HomePage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { ResourceListPage } from '@/features/resources/pages/ResourceListPage';
import { ResourceBatchPage } from '@/features/resources/pages/ResourceBatchPage';
import { UserProfilePage } from '@/features/profile/pages/UserProfilePage';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'modulos/:module/:resource', element: <ResourceListPage /> },
      { path: 'batch/:module/:resource', element: <ResourceBatchPage /> },
      { path: 'perfil', element: <UserProfilePage /> },
    ],
  },
]);
