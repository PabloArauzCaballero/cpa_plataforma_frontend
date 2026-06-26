import type { FieldType } from '@/shared/components/FormField';

export interface ResourceLookupRelation {
  endpoint: string;
  valueField: string;
  labelFields: string[];
  resourceKey?: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface ConditionalSelectOptions {
  dependsOn: string;
  valuesByControllerValue: Record<string, Array<string | SelectOption>>;
}

export type FieldValueKind = 'string' | 'number' | 'boolean';

export interface ResourceFieldDefinition {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: Array<string | SelectOption>;
  relation?: ResourceLookupRelation;
  selectSource?: 'enum' | 'catalog' | 'foreignKey';
  valueKind?: FieldValueKind;
  min?: number;
  max?: number;
  maxLength?: number;
  checks?: string[];
  helpText?: string;
  conditionalOptions?: ConditionalSelectOptions;
  requiredWhen?: Record<string, string | number | boolean>;
  exclusiveGroup?: string;
}

export interface CrudResourceDefinition {
  key: string;
  module: string;
  moduleLabel: string;
  label: string;
  table: string;
  primaryKey: string;
  primaryKeys?: string[];
  endpoints: {
    list: string;
    detail: (id: string) => string;
    create: string;
    update: (id: string) => string;
    batchValidate?: string;
    batchProcess?: string;
  };
  permissions: string;
  fields: ResourceFieldDefinition[];
  hideFromNavigation?: boolean;
  composite?: 'transaction-with-account-movements' | 'venta-clase-batch';
}

export interface BatchValidationRow {
  rowNumber: number;
  operation?: string;
  status: 'valid' | 'warning' | 'error';
  message?: string;
  payload?: CrudRecord;
  errors?: Record<string, string[]>;
}

export interface BatchValidationResult {
  importId?: string;
  totalRows: number;
  validRows: number;
  warningRows: number;
  errorRows: number;
  rows: BatchValidationRow[];
  raw?: unknown;
}

export interface BatchProcessResult {
  importId?: string;
  totalRows: number;
  createdRows: number;
  updatedRows: number;
  errorRows: number;
  message: string;
  raw?: unknown;
}


export type CrudRecord = Record<string, unknown>;


export interface ResourceTableFilter {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'datetime-local' | 'time' | 'boolean' | 'select';
  options?: Array<string | SelectOption>;
}

export interface ResourceListQuery {
  page: number;
  limit: number;
  offset: number;
  orderBy?: string;
  orderDir: 'ASC' | 'DESC';
  search?: string;
  filters: Record<string, string | number | boolean>;
}

export interface ResourceListResult {
  records: CrudRecord[];
  count: number;
  limit: number;
  offset: number;
  page: number;
}

