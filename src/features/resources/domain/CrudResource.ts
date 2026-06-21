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
  composite?: 'transaction-with-account-movements';
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
