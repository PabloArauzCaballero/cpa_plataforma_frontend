import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataTable, type TableRecord } from '@/shared/components/DataTable';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Modal } from '@/shared/components/Modal';
import { PageState } from '@/shared/components/PageState';
import { SearchFilterBar } from '@/shared/components/SearchFilterBar';
import { HelpGuideModal } from '../components/HelpGuideModal';
import { ResourceExportModal } from '../components/ResourceExportModal';
import { ResourceForm } from '../components/ResourceForm';
import { ResourceHeader } from '../components/ResourceHeader';
import { TransactionForm } from '../components/TransactionForm';
import { VentaClaseBatchPage } from './VentaClaseBatchPage';
import type { CrudRecord, CrudResourceDefinition } from '../domain/CrudResource';
import { findResourceDefinition } from '../domain/resourceDefinitions';
import { useResourceListViewModel } from '../hooks/useResourceListViewModel';
import { humanizeFieldLabel, humanizeTitleLabel } from '@/shared/utils/humanize';
import { userHasAnyPermission } from '@/shared/auth/session';
import styles from './ResourceListPage.module.css';

function readHourValue(record: CrudRecord): string {
  const candidates = ['hora_llegada', 'hora_inicio_real', 'hora_inicio', 'fecha_hora', 'fecha_registro'];
  for (const key of candidates) {
    const value = record[key];
    if (value !== undefined && value !== null && String(value).trim()) return String(value);
  }
  return '';
}

function extractHour(record: CrudRecord): number | null {
  const value = readHourValue(record);
  if (!value) return null;
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) return date.getHours();
  const match = value.match(/(?:T|\s|^)(\d{1,2}):\d{2}/);
  if (!match) return null;
  const hour = Number(match[1]);
  return Number.isFinite(hour) ? hour : null;
}

function sortByHour(records: CrudRecord[]): CrudRecord[] {
  return [...records].sort((a, b) => {
    const hourA = extractHour(a);
    const hourB = extractHour(b);
    if (hourA === null && hourB === null) return 0;
    if (hourA === null) return 1;
    if (hourB === null) return -1;
    if (hourA !== hourB) return hourA - hourB;
    return readHourValue(a).localeCompare(readHourValue(b));
  });
}

function isHourVisualResource(resource: CrudResourceDefinition): boolean {
  return resource.key === 'clase-por-hora' || resource.key === 'clase-curso' || resource.key === 'aula';
}

function getHourTone(record: CrudRecord): number | null {
  const hour = extractHour(record);
  return hour === null ? null : hour % 8;
}


function resolveDeleteTargetLabel(resource: CrudResourceDefinition, record: CrudRecord): string {
  const preferredKeys = [
    'nombre',
    'nombre_cuenta',
    'codigo',
    'concepto',
    'descripcion',
    'email',
    'correo',
    resource.primaryKey,
    'id',
  ];

  for (const key of preferredKeys) {
    const value = record[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return `${humanizeFieldLabel(key)}: ${String(value)}`;
    }
  }

  return humanizeTitleLabel(resource.label, resource.key);
}

function resolveActionPermission(resource: CrudResourceDefinition, action: 'create' | 'update' | 'delete' | 'export'): string | undefined {
  if (action === 'create') return resource.permissions;
  if (!resource.permissions) return undefined;
  const base = resource.permissions.replace(/create=/gi, `${action}=`).replace(/\.CREATE/gi, `.${action.toUpperCase()}`);
  return base;
}

export function ResourceListPage() {
  const { module, resource: resourceKey } = useParams();
  const resource = findResourceDefinition(module, resourceKey);

  if (!resource) {
    return <PageState title="Recurso no encontrado" message="La opción solicitada no está disponible en este momento." />;
  }

  return <ResourceListContent resource={resource} />;
}

function ResourceListContent({ resource }: { resource: CrudResourceDefinition }) {
  if (resource.composite === 'venta-clase-batch') {
    return <VentaClaseBatchPage />;
  }

  const viewModel = useResourceListViewModel(resource);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [recordPendingDisable, setRecordPendingDisable] = useState<CrudRecord | null>(null);
  const showHourColors = isHourVisualResource(resource);
  const canCreate = userHasAnyPermission(resolveActionPermission(resource, 'create'));
  const canUpdate = userHasAnyPermission(resolveActionPermission(resource, 'update'));
  const canDelete = userHasAnyPermission(resolveActionPermission(resource, 'delete'));
  const canExport = userHasAnyPermission(resource.permissions);

  const displayRecords = useMemo(() => {
    return showHourColors ? sortByHour(viewModel.visibleRecords) : viewModel.visibleRecords;
  }, [showHourColors, viewModel.visibleRecords]);

  if (viewModel.isLoading && viewModel.records.length === 0) {
    return <PageState title="Cargando registros" message={`Preparando información de ${resource.label}.`} />;
  }

  return (
    <section className={styles.page}>
      <ResourceHeader
        resource={resource}
        total={viewModel.totalRecords}
        visible={displayRecords.length}
        onHelpOpen={() => setIsHelpOpen(true)}
      />

      {showHourColors ? (
        <div className={styles.hourLegend}>
          <strong>Orden visual por hora</strong>
          <span>Cada color representa un bloque horario distinto para leer mejor aulas y clases.</span>
        </div>
      ) : null}

      <SearchFilterBar
        search={viewModel.search}
        filters={viewModel.filters}
        filterFields={viewModel.availableFilters}
        onSearchChange={viewModel.setSearch}
        onFilterChange={viewModel.setFilterValue}
        onClearFilters={viewModel.clearFilters}
        onCreate={canCreate ? viewModel.openCreate : undefined}
        onReload={() => void viewModel.load()}
        onExportOpen={canExport ? viewModel.openExportModal : undefined}
        canCreate={canCreate}
        canExport={canExport}
        isSearchPending={viewModel.search !== viewModel.debouncedSearch}
      />

      {viewModel.isLoading && viewModel.records.length > 0 ? <p className={styles.message}>Actualizando resultados...</p> : null}
      {viewModel.message ? <p className={styles.message}>{viewModel.message}</p> : null}
      {viewModel.error ? <PageState title="No se pudo completar la operación" message={viewModel.error} actionLabel="Reintentar" onAction={() => void viewModel.load()} /> : null}

      {!viewModel.error && displayRecords.length === 0 ? (
        <PageState title="Sin registros" message="No hay datos para mostrar con los filtros actuales." actionLabel={canCreate ? "Crear registro" : undefined} onAction={canCreate ? viewModel.openCreate : undefined} />
      ) : null}

      {!viewModel.error && displayRecords.length > 0 ? (
        <>
          <DataTable
            records={displayRecords}
            columns={viewModel.columns}
            columnLabels={viewModel.columnLabels}
            primaryKey={resource.primaryKey}
            onEdit={canUpdate ? viewModel.openEdit : undefined}
            canDisable={canDelete ? viewModel.canDisableRecord : undefined}
            onDisable={canDelete ? (record: TableRecord) => setRecordPendingDisable(record as CrudRecord) : undefined}
            getRowHourTone={showHourColors ? getHourTone : undefined}
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
        title={`Exportar ${humanizeTitleLabel(resource.label, resource.key)}`}
        isOpen={viewModel.isExportModalOpen}
        filterFields={viewModel.availableFilters}
        initialSearch={viewModel.debouncedSearch}
        initialFilters={viewModel.filters}
        totalRecords={viewModel.totalRecords}
        isExporting={viewModel.isExporting}
        error={viewModel.exportError}
        onClose={viewModel.closeExportModal}
        onExport={viewModel.exportWithQuery}
      />

      <HelpGuideModal isOpen={isHelpOpen} resource={resource} onClose={() => setIsHelpOpen(false)} />

      <ConfirmDialog
        isOpen={Boolean(recordPendingDisable)}
        title="Confirmar inhabilitación"
        message="Esta acción cambiará el estado del registro para que deje de estar activo en la operación diaria."
        targetLabel={recordPendingDisable ? resolveDeleteTargetLabel(resource, recordPendingDisable) : undefined}
        warning="Revisa que sea el registro correcto antes de continuar."
        confirmLabel="Sí, inhabilitar"
        cancelLabel="Cancelar"
        variant="danger"
        isLoading={viewModel.isSaving}
        onCancel={() => setRecordPendingDisable(null)}
        onConfirm={() => {
          if (!recordPendingDisable) return;
          const record = recordPendingDisable;
          setRecordPendingDisable(null);
          void viewModel.disable(record);
        }}
      />

      <Modal
        title={viewModel.editingRecord ? `Editar ${humanizeTitleLabel(resource.label, resource.key)}` : `Crear ${humanizeTitleLabel(resource.label, resource.key)}`}
        isOpen={viewModel.isFormOpen}
        onClose={() => viewModel.setIsFormOpen(false)}
      >
        {viewModel.isLoadingEditRecord ? (
          <PageState title="Cargando registro" message="Estamos cargando el detalle completo antes de editar." />
        ) : resource.composite === 'transaction-with-account-movements' ? (
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
