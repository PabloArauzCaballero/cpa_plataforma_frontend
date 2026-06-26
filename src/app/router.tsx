import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/shared/layouts/AppShell';
import { HomePage } from '@/features/dashboard/pages/HomePage';
import { ModuleResourcePickerPage } from '@/features/dashboard/pages/ModuleResourcePickerPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { ResourceListPage } from '@/features/resources/pages/ResourceListPage';
import { ResourceBatchPage } from '@/features/resources/pages/ResourceBatchPage';
import { UserProfilePage } from '@/features/profile/pages/UserProfilePage';
import { CatalogosOperativosPage } from '@/features/catalogs/pages/CatalogosOperativosPage';
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
      { path: 'modulos/:module', element: <ModuleResourcePickerPage /> },
      { path: 'modulos/:module/:resource', element: <ResourceListPage /> },
      { path: 'batch/:module/:resource', element: <ResourceBatchPage /> },
      { path: 'contabilidad/catalogos-cuentas-operativas', element: <CatalogosOperativosPage /> },
      { path: 'perfil', element: <UserProfilePage /> },
    ],
  },
]);
