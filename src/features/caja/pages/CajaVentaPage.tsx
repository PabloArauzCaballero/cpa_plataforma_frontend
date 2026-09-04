import { useMemo } from 'react';
import { Button } from '@/shared/components/Button';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { PageState } from '@/shared/components/PageState';
import { CarritoPanel } from '../components/CarritoPanel';
import { PagoPanel } from '../components/PagoPanel';
import { ProductoGrid } from '../components/ProductoGrid';
import { useCajaVentaViewModel } from '../hooks/useCajaVentaViewModel';
import styles from './CajaVentaPage.module.css';

export function CajaVentaPage() {
  const vm = useCajaVentaViewModel();

  const enCarrito = useMemo(
    () => Object.fromEntries(vm.lineas.map((linea) => [linea.producto.idBien, linea.cantidad])),
    [vm.lineas],
  );

  if (vm.isLoading) {
    return <PageState title="Cargando catálogo" message="Preparando los productos disponibles para la venta." />;
  }

  return (
    <div className={styles.layout}>
      <section className={styles.catalogo} aria-label="Catálogo de productos">
        <header className={styles.catalogoHeader}>
          <div>
            <h1>Registrar venta</h1>
            <p>Selecciona los productos, cobra y confirma. El sistema registra el asiento y descarga el stock.</p>
          </div>
          <label className={styles.busqueda} htmlFor="busqueda-producto">
            <span className="sr-only">Buscar producto por nombre o SKU</span>
            <input
              id="busqueda-producto"
              type="search"
              value={vm.busqueda}
              placeholder="Buscar por nombre o SKU"
              onChange={(event) => vm.setBusqueda(event.target.value)}
            />
          </label>
        </header>

        {vm.aviso ? (
          <p className={styles.aviso} role="status">
            {vm.aviso}
          </p>
        ) : null}

        <ProductoGrid productos={vm.productos} enCarrito={enCarrito} onSeleccionar={vm.agregarProducto} />
      </section>

      <aside className={styles.venta} aria-label="Venta en curso">
        <h2>Venta actual</h2>

        <CarritoPanel
          lineas={vm.lineas}
          resumen={vm.resumen}
          onCambiarCantidad={vm.cambiarCantidad}
          onQuitar={vm.quitarProducto}
        />

        {vm.lineas.length > 0 ? (
          <PagoPanel
            moneda={vm.resumen.moneda}
            total={vm.resumen.total}
            efectivo={vm.efectivo}
            qr={vm.qr}
            recibido={vm.recibido}
            cambio={vm.cambio}
            faltante={vm.faltante}
            qrExcedido={vm.qrExcedido}
            onEfectivoChange={vm.setEfectivo}
            onQrChange={vm.setQr}
            onPagoExacto={() => vm.setEfectivo(vm.resumen.total.toFixed(2))}
          />
        ) : null}

        {vm.error ? (
          <p className={styles.error} role="alert">
            {vm.error}
          </p>
        ) : null}

        {vm.ultimaVenta ? (
          <div className={styles.exito} role="status">
            <strong>Venta #{vm.ultimaVenta.idTransaccion} registrada</strong>
            <span>
              Total {vm.resumen.moneda} {vm.ultimaVenta.montoTotal.toFixed(2)} · Cambio {vm.resumen.moneda}{' '}
              {vm.ultimaVenta.cambio.toFixed(2)}
            </span>
            <button type="button" onClick={vm.descartarUltimaVenta}>
              Entendido
            </button>
          </div>
        ) : null}

        <div className={styles.acciones}>
          <Button variant="ghost" onClick={vm.limpiarVenta} disabled={vm.lineas.length === 0 || vm.isSubmitting}>
            Cancelar venta
          </Button>
          <Button onClick={vm.abrirConfirmacion} disabled={!vm.puedeConfirmar} fullWidth>
            Confirmar venta
          </Button>
        </div>
      </aside>

      <ConfirmDialog
        isOpen={vm.confirmacionAbierta}
        title="Confirmar venta"
        message="Se registrará la venta con su asiento contable y se descargará el stock. Esta operación no se puede deshacer desde caja."
        targetLabel={`${vm.resumen.cantidadTotal} artículo(s) · Total ${vm.resumen.moneda} ${vm.resumen.total.toFixed(2)}`}
        warning={vm.cambio > 0 ? `Recuerda entregar ${vm.resumen.moneda} ${vm.cambio.toFixed(2)} de cambio.` : undefined}
        confirmLabel="Confirmar venta"
        isLoading={vm.isSubmitting}
        onConfirm={() => void vm.confirmar()}
        onCancel={vm.cerrarConfirmacion}
      />
    </div>
  );
}
