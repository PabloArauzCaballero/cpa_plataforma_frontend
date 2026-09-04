import {
  calcularCambio,
  calcularResumen,
  puedeAgregar,
  type LineaCarrito,
  type ProductoTienda,
} from '@/features/caja/domain/CajaVenta';
import { mapLineasToItems, mapProductoTienda, mapVentaConfirmada } from '@/features/caja/services/cajaMapper';

function crearProducto(overrides: Partial<ProductoTienda> = {}): ProductoTienda {
  return {
    idBien: 1,
    sku: 'SKU-1',
    nombre: 'Cuaderno',
    precio: 12.5,
    moneda: 'BOB',
    cantidadDisponible: 3,
    controlaInventario: true,
    ...overrides,
  };
}

describe('dominio de caja', () => {
  it('suma el total y la cantidad de artículos del carrito', () => {
    const lineas: LineaCarrito[] = [
      { producto: crearProducto(), cantidad: 2 },
      { producto: crearProducto({ idBien: 2, precio: 5 }), cantidad: 3 },
    ];

    expect(calcularResumen(lineas)).toEqual({ total: 40, cantidadTotal: 5, moneda: 'BOB' });
  });

  it('devuelve un total en cero cuando el carrito está vacío', () => {
    expect(calcularResumen([])).toEqual({ total: 0, cantidadTotal: 0, moneda: 'BOB' });
  });

  it('bloquea agregar una unidad más allá del stock disponible', () => {
    const producto = crearProducto({ cantidadDisponible: 2 });

    expect(puedeAgregar(undefined, producto)).toBe(true);
    expect(puedeAgregar({ producto, cantidad: 1 }, producto)).toBe(true);
    expect(puedeAgregar({ producto, cantidad: 2 }, producto)).toBe(false);
  });

  it('permite agregar sin límite los productos que no controlan inventario', () => {
    const producto = crearProducto({ controlaInventario: false, cantidadDisponible: 0 });

    expect(puedeAgregar({ producto, cantidad: 99 }, producto)).toBe(true);
  });

  it('calcula el cambio y nunca devuelve un cambio negativo', () => {
    expect(calcularCambio(40, 50, 0)).toBe(10);
    expect(calcularCambio(40, 20, 20)).toBe(0);
    expect(calcularCambio(40, 10, 0)).toBe(0);
  });
});

describe('mapper de caja', () => {
  it('traduce el producto del backend al modelo de dominio', () => {
    const producto = mapProductoTienda({
      id_bien: 7,
      sku: 'SKU-7',
      nombre: 'Marcador',
      categoria: null,
      imagen_url: 'https://res.cloudinary.com/demo/image/upload/marcador.png',
      precio_referencia: 8.5,
      moneda: 'BOB',
      cantidad_disponible: 12,
      controla_inventario: true,
    });

    expect(producto).toEqual({
      idBien: 7,
      sku: 'SKU-7',
      nombre: 'Marcador',
      categoria: undefined,
      imagenUrl: 'https://res.cloudinary.com/demo/image/upload/marcador.png',
      precio: 8.5,
      moneda: 'BOB',
      cantidadDisponible: 12,
      controlaInventario: true,
    });
  });

  it('convierte el carrito en las líneas que espera el endpoint', () => {
    const items = mapLineasToItems([{ producto: crearProducto(), cantidad: 2 }]);

    expect(items).toEqual([{ id_bien: 1, cantidad: 2, precio_unitario: 12.5 }]);
  });

  it('lee la venta confirmada aunque el backend devuelva importes como texto', () => {
    const venta = mapVentaConfirmada({
      data: {
        transaccion: { id_transaccion: '101' },
        monto_total: '40.00',
        monto_efectivo: '40.00',
        monto_qr: '0.00',
        cambio: '10.00',
      },
    });

    expect(venta).toEqual({
      idTransaccion: 101,
      montoTotal: 40,
      montoEfectivo: 40,
      montoQr: 0,
      cambio: 10,
    });
  });
});
