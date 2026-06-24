import { useParams } from 'react-router-dom';
import { DataTable } from '@/shared/components/DataTable';
import { Modal } from '@/shared/components/Modal';
import { PageState } from '@/shared/components/PageState';
import { SearchFilterBar } from '@/shared/components/SearchFilterBar';
import { ResourceExportModal } from '../components/ResourceExportModal';
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

  if (viewModel.isLoading && viewModel.records.length === 0) {
    return <PageState title="Cargando registros" message={`Preparando información de ${resource.label}.`} />;
  }

  return (
    <section className={styles.page}>
      <ResourceHeader resource={resource} total={viewModel.totalRecords} visible={viewModel.visibleRecords.length} />

      <SearchFilterBar
        search={viewModel.search}
        filters={viewModel.filters}
        filterFields={viewModel.availableFilters}
        onSearchChange={viewModel.setSearch}
        onFilterChange={viewModel.setFilterValue}
        onClearFilters={viewModel.clearFilters}
        onCreate={viewModel.openCreate}
        onReload={() => void viewModel.load()}
        onExportOpen={viewModel.openExportModal}
        isSearchPending={viewModel.search !== viewModel.debouncedSearch}
      />

      {viewModel.isLoading && viewModel.records.length > 0 ? <p className={styles.message}>Actualizando resultados...</p> : null}
      {viewModel.message ? <p className={styles.message}>{viewModel.message}</p> : null}
      {viewModel.error ? <PageState title="No se pudo completar la operación" message={viewModel.error} actionLabel="Reintentar" onAction={() => void viewModel.load()} /> : null}

      {!viewModel.error && viewModel.visibleRecords.length === 0 ? (
        <PageState title="Sin registros" message="No hay datos para mostrar con los filtros actuales." actionLabel="Crear registro" onAction={viewModel.openCreate} />
      ) : null}

      {!viewModel.error && viewModel.visibleRecords.length > 0 ? (
        <>
          <DataTable
            records={viewModel.visibleRecords}
            columns={viewModel.columns}
            primaryKey={resource.primaryKey}
            onEdit={viewModel.openEdit}
            canDisable={viewModel.canDisableRecord}
            onDisable={(record) => void viewModel.disable(record)}
          />
          <div className={styles.pagination}>
            <div>
              Página <strong>{viewModel.page}</strong> de <strong>{viewModel.totalPages}</strong> · {viewModel.totalRecords} registros
            </div>
            <label>
              Filas por página
              <select value={viewModel.pageSize} onChange={(event) => viewModel.changePageSize(Number(event.target.value))}>
                {viewModel.pageSizeOptions.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </label>
            <div className={styles.paginationActions}>
              <button type="button" onClick={viewModel.goToPreviousPage} disabled={!viewModel.hasPreviousPage}>Anterior</button>
              <button type="button" onClick={viewModel.goToNextPage} disabled={!viewModel.hasNextPage}>Siguiente</button>
            </div>
          </div>
        </>
      ) : null}

      <ResourceExportModal
        title={`Exportar ${resource.label}`}
        isOpen={viewModel.isExportModalOpen}
        filterFields={viewModel.availableFilters}
        initialSearch={viewModel.debouncedSearch}
        initialFilters={viewModel.filters}
        isExporting={viewModel.isExporting}
        error={viewModel.exportError}
        onClose={viewModel.closeExportModal}
        onExport={viewModel.exportWithQuery}
      />

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
