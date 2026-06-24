import type { CrudRecord } from '../domain/CrudResource';
import { humanizeFieldLabel } from '@/shared/utils/humanize';

type ExportFormat = 'csv' | 'excel' | 'json';

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return '';
  const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return /[",\n\r;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function resolveColumns(records: CrudRecord[], preferredColumns: string[]): string[] {
  const discovered = Array.from(new Set(records.flatMap((record) => Object.keys(record))));
  const ordered = preferredColumns.filter((column) => discovered.includes(column));
  const missing = discovered.filter((column) => !ordered.includes(column));
  return [...ordered, ...missing];
}

function displayColumn(column: string, labels?: Record<string, string>): string {
  return labels?.[column] ?? humanizeFieldLabel(column);
}

function buildCsv(records: CrudRecord[], columns: string[], columnLabels?: Record<string, string>): string {
  const header = columns.map((column) => escapeCsv(displayColumn(column, columnLabels))).join(';');
  const rows = records.map((record) => columns.map((column) => escapeCsv(record[column])).join(';'));
  return `\uFEFF${[header, ...rows].join('\n')}`;
}

function buildExcelHtml(records: CrudRecord[], columns: string[], title: string, columnLabels?: Record<string, string>): string {
  const header = columns.map((column) => `<th>${escapeHtml(displayColumn(column, columnLabels))}</th>`).join('');
  const rows = records
    .map((record) => `<tr>${columns.map((column) => `<td>${escapeHtml(record[column])}</td>`).join('')}</tr>`)
    .join('');

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
</head>
<body>
  <table border="1">
    <thead><tr>${header}</tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
}

function downloadTextFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function safeFilename(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

export function exportRecords(options: {
  records: CrudRecord[];
  preferredColumns: string[];
  columnLabels?: Record<string, string>;
  resourceLabel: string;
  format: ExportFormat;
}) {
  const columns = resolveColumns(options.records, options.preferredColumns);
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  const baseName = `${safeFilename(options.resourceLabel || 'registros')}-${timestamp}`;

  if (options.format === 'json') {
    downloadTextFile(JSON.stringify(options.records, null, 2), `${baseName}.json`, 'application/json;charset=utf-8');
    return;
  }

  if (options.format === 'excel') {
    const html = buildExcelHtml(options.records, columns, options.resourceLabel, options.columnLabels);
    downloadTextFile(html, `${baseName}.xls`, 'application/vnd.ms-excel;charset=utf-8');
    return;
  }

  downloadTextFile(buildCsv(options.records, columns, options.columnLabels), `${baseName}.csv`, 'text/csv;charset=utf-8');
}
