import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  calcularCambio,
  calcularResumen,
  puedeAgregar,
  type LineaCarrito,
  type ProductoTienda,
  type VentaConfirmada,
} from '../domain/CajaVenta';
import { confirmarVenta, explainVentaError, listarCatalogoTienda } from '../services/cajaApi';

function parseMonto(value: string): number {
  const parsed = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) / 100 : 0;
}

export function useCajaVentaViewModel() {
  const [productos, setProductos] = useState<ProductoTienda[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [lineas, setLineas] = useState<LineaCarrito[]>([]);
  const [efectivo, setEfectivo] = useState('');
  const [qr, setQr] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);
  const [ultimaVenta, setUltimaVenta] = useState<VentaConfirmada | null>(null);

  const cargarCatalogo = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setProductos(await listarCatalogoTienda());
    } catch (caught) {
      setError(explainVentaError(caught));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargarCatalogo();
  }, [cargarCatalogo]);

  const productosVisibles = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return productos;
    return productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(termino) || producto.sku.toLowerCase().includes(termino),
    );
  }, [productos, busqueda]);

  const resumen = useMemo(() => calcularResumen(lineas), [lineas]);
  const montoEfectivo = parseMonto(efectivo);
  const montoQr = parseMonto(qr);
  const recibido = Math.round((montoEfectivo + montoQr) * 100) / 100;
  const cambio = calcularCambio(resumen.total, montoEfectivo, montoQr);
  const faltante = Math.max(Math.round((resumen.total - recibido) * 100) / 100, 0);
  const qrExcedido = montoQr - resumen.total > 0.009;
  const puedeConfirmar = lineas.length > 0 && faltante === 0 && !qrExcedido && !isSubmitting;

  const agregarProducto = useCallback((producto: ProductoTienda) => {
    setAviso(null);
    setLineas((actuales) => {
      const existente = actuales.find((linea) => linea.producto.idBien === producto.idBien);
      if (!puedeAgregar(existente, producto)) {
        setAviso(`Sólo quedan ${producto.cantidadDisponible} unidades de ${producto.nombre}.`);
        return actuales;
      }
      if (!existente) return [...actuales, { producto, cantidad: 1 }];
      return actuales.map((linea) =>
        linea.producto.idBien === producto.idBien ? { ...linea, cantidad: linea.cantidad + 1 } : linea,
      );
    });
  }, []);

  const cambiarCantidad = useCallback((idBien: number, cantidad: number) => {
    setAviso(null);
    setLineas((actuales) =>
      actuales.flatMap((linea) => {
        if (linea.producto.idBien !== idBien) return [linea];
        if (cantidad <= 0) return [];
        const tope = linea.producto.controlaInventario ? linea.producto.cantidadDisponible : cantidad;
        return [{ ...linea, cantidad: Math.min(cantidad, tope) }];
      }),
    );
  }, []);

  const quitarProducto = useCallback((idBien: number) => {
    setLineas((actuales) => actuales.filter((linea) => linea.producto.idBien !== idBien));
  }, []);

  const limpiarVenta = useCallback(() => {
    setLineas([]);
    setEfectivo('');
    setQr('');
    setAviso(null);
    setError(null);
  }, []);

  const confirmar = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const venta = await confirmarVenta({
        lineas,
        montoEfectivo,
        montoQr,
        moneda: resumen.moneda,
      });
      setUltimaVenta(venta);
      setConfirmacionAbierta(false);
      limpiarVenta();
      // La venta descarga stock: el catálogo en pantalla quedó desactualizado.
      await cargarCatalogo();
    } catch (caught) {
      setError(explainVentaError(caught));
      setConfirmacionAbierta(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [lineas, montoEfectivo, montoQr, resumen.moneda, limpiarVenta, cargarCatalogo]);

  return {
    productos: productosVisibles,
    lineas,
    busqueda,
    efectivo,
    qr,
    resumen,
    recibido,
    cambio,
    faltante,
    qrExcedido,
    isLoading,
    isSubmitting,
    error,
    aviso,
    confirmacionAbierta,
    ultimaVenta,
    puedeConfirmar,
    setBusqueda,
    setEfectivo,
    setQr,
    agregarProducto,
    cambiarCantidad,
    quitarProducto,
    limpiarVenta,
    abrirConfirmacion: () => setConfirmacionAbierta(true),
    cerrarConfirmacion: () => setConfirmacionAbierta(false),
    descartarUltimaVenta: () => setUltimaVenta(null),
    recargarCatalogo: cargarCatalogo,
    confirmar,
  };
}
