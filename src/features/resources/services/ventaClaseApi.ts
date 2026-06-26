import { HttpError, httpClient } from '@/shared/api/httpClient';

export interface VentaClaseRowPayload {
  fecha: string;
  hora_ingreso: string;
  hora_salida?: string;
  id_estudiante?: number;
  nombre_estudiante?: string;
  id_tutor?: number;
  nombre_tutor?: string;
  id_aula?: number;
  id_materia_tree?: number;
  id_producto_educativo?: number;
  materia?: string;
  tema?: string;
  subtema?: string;
  motivo_clase: string;
  efectivo: number;
  qr: number;
  cxc: number;
  paquete: number;
  situacion_base: string;
}

export interface VentaClaseBatchPayload {
  fecha: string;
  items: VentaClaseRowPayload[];
}

export function explainVentaClaseError(error: unknown): string {
  if (error instanceof HttpError) {
    const rawMessage = error.message || '';
    const message = rawMessage.toLowerCase();

    if (error.status === 401) return 'Tu sesión expiró o no es válida. Vuelve a iniciar sesión.';
    if (error.status === 403) return 'No tienes permisos para registrar partes de clases pasadas.';
    if (message.includes('canal_cobro_efectivo') || message.includes('canal cobro efectivo')) {
      return 'Falta configurar la cuenta operativa CANAL_COBRO_EFECTIVO. Revisa Contabilidad > Configuración de cuentas operativas.';
    }
    if (message.includes('canal_cobro_qr') || message.includes('canal cobro qr')) {
      return 'Falta configurar la cuenta operativa CANAL_COBRO_QR. Revisa Contabilidad > Configuración de cuentas operativas.';
    }
    if (message.includes('estudiante_cxc')) {
      return 'El estudiante seleccionado no tiene cuenta ESTUDIANTE_CXC asociada. Revisa la creación/asignación de cuentas del estudiante.';
    }
    if (message.includes('estudiante_paquete_diferido')) {
      return 'El estudiante seleccionado no tiene cuenta ESTUDIANTE_PAQUETE_DIFERIDO asociada. Revisa la creación/asignación de cuentas del estudiante.';
    }
    if (message.includes('debe') && message.includes('haber')) {
      return 'El asiento contable no cuadra. No se limpió la tabla para que puedas corregir la fila.';
    }

    return rawMessage || 'No se pudo registrar el parte de clases pasadas.';
  }

  return error instanceof Error ? error.message : 'No se pudo registrar el parte de clases pasadas.';
}

export async function registrarVentaClaseBatch(payload: VentaClaseBatchPayload): Promise<unknown> {
  return httpClient.post<unknown, VentaClaseBatchPayload>('/api/contabilidad/venta-clase/registrar-batch', payload);
}
