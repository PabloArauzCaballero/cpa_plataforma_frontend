import { useParams } from 'react-router-dom';
import { DataTable } from '@/shared/components/DataTable';
import { Modal } from '@/shared/components/Modal';
import { PageState } from '@/shared/components/PageState';
import { SearchFilterBar } from '@/shared/components/SearchFilterBar';
import { ResourceForm } from '../components/ResourceForm';
import { ResourceHeader } from '../components/ResourceHeader';
import { TransactionForm } from '../components/TransactionForm';
import type { CrudResourceDefinition } from '../domain/CrudResource';
import { findResourceDefinition } from '../domain/resourceDefinitions';
import { useResourceListViewModel } from '../hooks/useResourceListViewModel';
import styles from './ResourceListPage.module.css';

export function ResourceListPage() {
  const { module, resource: resourceKey } = useParams();
  const resource = findResourceDefinition(module, resourceKey);

  if (!resource) {
    return <PageState title="Recurso no encontrado" message="La opción solicitada no está disponible en este momento." />;
  }

  return <ResourceListContent resource={resource} />;
}

function ResourceListContent({ resource }: { resource: CrudResourceDefinition }) {
  const viewModel = useResourceListViewModel(resource);

  if (viewModel.isLoading) {
    return <PageState title="Cargando registros" message={`Preparando información de ${resource.label}.`} />;
  }

  return (
    <section className={styles.page}>
      <ResourceHeader resource={resource} total={viewModel.records.length} visible={viewModel.visibleRecords.length} />

      <SearchFilterBar
        search={viewModel.search}
        status={viewModel.status}
        statusOptions={viewModel.statusOptions}
        onSearchChange={viewModel.setSearch}
        onStatusChange={viewModel.setStatus}
        onCreate={viewModel.openCreate}
        onReload={() => void viewModel.load()}
      />

      {viewModel.message ? <p className={styles.message}>{viewModel.message}</p> : null}
      {viewModel.error ? <PageState title="No se pudo completar la operación" message={viewModel.error} actionLabel="Reintentar" onAction={() => void viewModel.load()} /> : null}

      {!viewModel.error && viewModel.visibleRecords.length === 0 ? (
        <PageState title="Sin registros" message="No hay datos para mostrar con los filtros actuales." actionLabel="Crear registro" onAction={viewModel.openCreate} />
      ) : null}

      {!viewModel.error && viewModel.visibleRecords.length > 0 ? (
        <DataTable
          records={viewModel.visibleRecords}
          columns={viewModel.columns}
          primaryKey={resource.primaryKey}
          onEdit={viewModel.openEdit}
          canDisable={viewModel.canDisableRecord}
          onDisable={(record) => void viewModel.disable(record)}
        />
      ) : null}

      <Modal
        title={viewModel.editingRecord ? `Editar ${resource.label}` : `Crear ${resource.label}`}
        isOpen={viewModel.isFormOpen}
        onClose={() => viewModel.setIsFormOpen(false)}
      >
        {resource.composite === 'transaction-with-account-movements' ? (
          <TransactionForm
            resource={resource}
            record={viewModel.editingRecord}
            isSaving={viewModel.isSaving}
            onSubmit={(payload) => void viewModel.save(payload)}
            onCancel={() => viewModel.setIsFormOpen(false)}
          />
        ) : (
          <ResourceForm
            resource={resource}
            record={viewModel.editingRecord}
            isSaving={viewModel.isSaving}
            onSubmit={(payload) => void viewModel.save(payload)}
            onCancel={() => viewModel.setIsFormOpen(false)}
          />
        )}
      </Modal>
    </section>
  );
}
