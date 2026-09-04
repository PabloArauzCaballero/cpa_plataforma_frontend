/** Tipos de dominio del punto de venta. No son DTOs: la capa de servicios los mapea. */

export interface ProductoTienda {
  idBien: number;
  sku: string;
  nombre: string;
  categoria?: string;
  imagenUrl?: string;
  precio: number;
  moneda: string;
  cantidadDisponible: number;
  controlaInventario: boolean;
}

export interface LineaCarrito {
  producto: ProductoTienda;
  cantidad: number;
}

export type FormaPago = 'EFECTIVO' | 'QR' | 'MIXTO';

export interface ResumenVenta {
  total: number;
  cantidadTotal: number;
  moneda: string;
}

export interface VentaConfirmada {
  idTransaccion: number;
  montoTotal: number;
  montoEfectivo: number;
  montoQr: number;
  cambio: number;
}

/** Existencia insuficiente para vender una unidad más de este producto. */
export function puedeAgregar(linea: LineaCarrito | undefined, producto: ProductoTienda): boolean {
  if (!producto.controlaInventario) return true;
  const enCarrito = linea?.cantidad ?? 0;
  return enCarrito + 1 <= producto.cantidadDisponible;
}

export function calcularResumen(lineas: LineaCarrito[]): ResumenVenta {
  const total = lineas.reduce((suma, linea) => suma + linea.cantidad * linea.producto.precio, 0);
  return {
    total: Math.round(total * 100) / 100,
    cantidadTotal: lineas.reduce((suma, linea) => suma + linea.cantidad, 0),
    moneda: lineas[0]?.producto.moneda ?? 'BOB',
  };
}

export function calcularCambio(totalVenta: number, efectivo: number, qr: number): number {
  const cambio = efectivo + qr - totalVenta;
  return cambio > 0 ? Math.round(cambio * 100) / 100 : 0;
}
