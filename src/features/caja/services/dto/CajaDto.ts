/** DTOs de transporte del punto de venta. Coinciden con el contrato del backend. */

export interface ProductoTiendaDto {
  id_bien: number;
  sku: string;
  nombre: string;
  categoria?: string | null;
  imagen_url?: string | null;
  precio_referencia: number;
  moneda: string;
  cantidad_disponible: number;
  controla_inventario: boolean;
}

export interface CatalogoTiendaResponseDto {
  success?: boolean;
  message?: string;
  data?: ProductoTiendaDto[];
  count?: number;
  total?: number;
}

export interface VentaProductoItemDto {
  id_bien: number;
  cantidad: number;
  precio_unitario: number;
}

export interface VentaProductoRequestDto {
  fecha: string;
  moneda: string;
  monto_efectivo: number;
  monto_qr: number;
  items: VentaProductoItemDto[];
  observaciones?: string;
}

export interface VentaProductoResponseDto {
  success?: boolean;
  message?: string;
  data?: {
    transaccion?: { id_transaccion?: number | string };
    monto_total?: number | string;
    monto_efectivo?: number | string;
    monto_qr?: number | string;
    cambio?: number | string;
  };
}
