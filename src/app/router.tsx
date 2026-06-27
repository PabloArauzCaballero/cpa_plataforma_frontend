import { Suspense, lazy, type ReactElement } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/shared/layouts/AppShell';
import { PageState } from '@/shared/components/PageState';
import { ProtectedRoute } from './ProtectedRoute';

const HomePage = lazy(() => import('@/features/dashboard/pages/HomePage').then((module) => ({ default: module.HomePage })));
const ModuleResourcePickerPage = lazy(() => import('@/features/dashboard/pages/ModuleResourcePickerPage').then((module) => ({ default: module.ModuleResourcePickerPage })));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const ResourceListPage = lazy(() => import('@/features/resources/pages/ResourceListPage').then((module) => ({ default: module.ResourceListPage })));
const ResourceBatchPage = lazy(() => import('@/features/resources/pages/ResourceBatchPage').then((module) => ({ default: module.ResourceBatchPage })));
const UserProfilePage = lazy(() => import('@/features/profile/pages/UserProfilePage').then((module) => ({ default: module.UserProfilePage })));
const CatalogosOperativosPage = lazy(() => import('@/features/catalogs/pages/CatalogosOperativosPage').then((module) => ({ default: module.CatalogosOperativosPage })));
const QualityGatePage = lazy(() => import('@/features/quality/pages/QualityGatePage').then((module) => ({ default: module.QualityGatePage })));

function withSuspense(element: ReactElement) {
  return (
    <Suspense fallback={<PageState title="Cargando pantalla" message="Preparando la vista solicitada." />}>
      {element}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: withSuspense(<LoginPage />),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: 'modulos/:module', element: withSuspense(<ModuleResourcePickerPage />) },
      { path: 'modulos/:module/:resource', element: withSuspense(<ResourceListPage />) },
      { path: 'batch/:module/:resource', element: withSuspense(<ResourceBatchPage />) },
      { path: 'contabilidad/catalogos-cuentas-operativas', element: withSuspense(<CatalogosOperativosPage />) },
      { path: 'calidad', element: withSuspense(<QualityGatePage />) },
      { path: 'perfil', element: withSuspense(<UserProfilePage />) },
      { path: '*', element: <PageState title="Pantalla no encontrada" message="La opción solicitada no existe o fue movida." /> },
    ],
  },
]);
