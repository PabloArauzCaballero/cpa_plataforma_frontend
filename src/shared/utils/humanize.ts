const ACRONYMS = new Set(['id', 'url', 'api', 'json', 'csv', 'pdf', 'xml', 'fk', 'pk', 'kpi', 'sku']);

const WORD_REPLACEMENTS: Record<string, string> = {
  id: 'ID',
  url: 'URL',
  api: 'API',
  json: 'JSON',
  csv: 'CSV',
  pdf: 'PDF',
  xml: 'XML',
  fk: 'FK',
  pk: 'PK',
  kpi: 'KPI',
  sku: 'SKU',
  achivo: 'archivo',
};

function normalizeSeparators(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function capitalize(value: string): string {
  if (!value) return value;
  const lower = value.toLowerCase();
  if (ACRONYMS.has(lower)) return lower.toUpperCase();
  const replaced = WORD_REPLACEMENTS[lower] ?? lower;
  if (ACRONYMS.has(replaced.toLowerCase())) return replaced.toUpperCase();
  return replaced.charAt(0).toUpperCase() + replaced.slice(1);
}

export function humanizeLabel(value: string): string {
  const clean = normalizeSeparators(value);
  if (!clean) return value;
  return clean
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

export function humanizeFieldLabel(labelOrName: string, fallback?: string): string {
  const value = labelOrName || fallback || '';
  return humanizeLabel(value);
}

export function humanizeTitleLabel(labelOrName: string, fallback?: string): string {
  return humanizeFieldLabel(labelOrName, fallback).toUpperCase();
}
