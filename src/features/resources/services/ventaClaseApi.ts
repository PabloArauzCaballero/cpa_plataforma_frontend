import { httpClient } from '@/shared/api/httpClient';

export interface VentaClaseRowPayload {
  fecha: string;
  hora_ingreso: string;
  hora_salida: string;
  nombre_completo_estudiante: string;
  tutor: string;
  motivo_clase: string;
  materia_producto: string;
  tema: string;
  subtema: string;
  efectivo: number;
  qr: number;
  cxc: number;
  paquete: string;
  situacion_base: string;
}

export interface VentaClaseBatchPayload {
  registros: VentaClaseRowPayload[];
}

export async function registrarVentaClaseBatch(payload: VentaClaseBatchPayload): Promise<unknown> {
  return httpClient.post<unknown, VentaClaseBatchPayload>('/api/contabilidad/venta-clase/registrar-batch', payload);
}
