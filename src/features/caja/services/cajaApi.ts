import { HttpError, httpClient } from '@/shared/api/httpClient';
import type { LineaCarrito, ProductoTienda, VentaConfirmada } from '../domain/CajaVenta';
import { mapLineasToItems, mapProductoTienda, mapVentaConfirmada } from './cajaMapper';
import type { CatalogoTiendaResponseDto, VentaProductoRequestDto, VentaProductoResponseDto } from './dto/CajaDto';

const CATALOGO_ENDPOINT = '/api/inventario/catalogo-tienda';
const VENTA_ENDPOINT = '/api/contabilidad/venta-producto/registrar';

export interface ConfirmarVentaInput {
  lineas: LineaCarrito[];
  montoEfectivo: number;
  montoQr: number;
  moneda: string;
  observaciones?: string;
}

export async function listarCatalogoTienda(search?: string): Promise<ProductoTienda[]> {
  const query = new URLSearchParams({ limit: '200' });
  if (search?.trim()) query.set('search', search.trim());

  const response = await httpClient.get<CatalogoTiendaResponseDto>(`${CATALOGO_ENDPOINT}?${query.toString()}`);
  const rows = Array.isArray(response?.data) ? response.data : [];
  return rows.map(mapProductoTienda);
}

export async function confirmarVenta(input: ConfirmarVentaInput): Promise<VentaConfirmada> {
  const payload: VentaProductoRequestDto = {
    fecha: new Date().toISOString().slice(0, 10),
    moneda: input.moneda,
    monto_efectivo: input.montoEfectivo,
    monto_qr: input.montoQr,
    items: mapLineasToItems(input.lineas),
    observaciones: input.observaciones,
  };

  const response = await httpClient.post<VentaProductoResponseDto, VentaProductoRequestDto>(VENTA_ENDPOINT, payload);
  return mapVentaConfirmada(response);
}

/** Traduce los errores del backend a un mensaje accionable para el cajero. */
export function explainVentaError(error: unknown): string {
  if (error instanceof HttpError) {
    const raw = error.message || '';
    const message = raw.toLowerCase();

    if (error.status === 401) return 'Tu sesión expiró. Vuelve a iniciar sesión para seguir cobrando.';
    if (error.status === 403) return 'No tienes permiso para registrar ventas. Pide acceso al administrador.';
    if (message.includes('stock insuficiente')) return raw;
    if (message.includes('periodo') && message.includes('cerrado')) {
      return 'El periodo contable de hoy está cerrado. Avisa a contabilidad antes de seguir cobrando.';
    }
    if (message.includes('canal_cobro_efectivo')) {
      return 'Falta configurar la cuenta operativa CANAL_COBRO_EFECTIVO en Contabilidad.';
    }
    if (message.includes('canal_cobro_qr')) {
      return 'Falta configurar la cuenta operativa CANAL_COBRO_QR en Contabilidad.';
    }
    if (message.includes('ingreso_venta_producto_tienda') || message.includes('costo_venta_producto_tienda')) {
      return 'Faltan las cuentas contables de productos de tienda. Revisa Contabilidad > Cuentas operativas.';
    }
    if (message.includes('no está balanceado')) {
      return 'El asiento contable no cuadra. No se registró nada; revisa los precios de los productos.';
    }

    return raw || 'No se pudo registrar la venta.';
  }

  return error instanceof Error ? error.message : 'No se pudo registrar la venta.';
}
