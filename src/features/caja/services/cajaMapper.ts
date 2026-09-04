import type { LineaCarrito, ProductoTienda, VentaConfirmada } from '../domain/CajaVenta';
import type { ProductoTiendaDto, VentaProductoItemDto, VentaProductoResponseDto } from './dto/CajaDto';

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function mapProductoTienda(dto: ProductoTiendaDto): ProductoTienda {
  return {
    idBien: toNumber(dto.id_bien),
    sku: String(dto.sku ?? ''),
    nombre: String(dto.nombre ?? 'Producto sin nombre'),
    categoria: dto.categoria ?? undefined,
    imagenUrl: dto.imagen_url ?? undefined,
    precio: toNumber(dto.precio_referencia),
    moneda: String(dto.moneda ?? 'BOB'),
    cantidadDisponible: toNumber(dto.cantidad_disponible),
    controlaInventario: Boolean(dto.controla_inventario),
  };
}

export function mapLineasToItems(lineas: LineaCarrito[]): VentaProductoItemDto[] {
  return lineas.map((linea) => ({
    id_bien: linea.producto.idBien,
    cantidad: linea.cantidad,
    precio_unitario: linea.producto.precio,
  }));
}

export function mapVentaConfirmada(dto: VentaProductoResponseDto): VentaConfirmada {
  const data = dto?.data ?? {};
  return {
    idTransaccion: toNumber(data.transaccion?.id_transaccion),
    montoTotal: toNumber(data.monto_total),
    montoEfectivo: toNumber(data.monto_efectivo),
    montoQr: toNumber(data.monto_qr),
    cambio: toNumber(data.cambio),
  };
}
