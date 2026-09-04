import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import type { LineaCarrito, ResumenVenta } from '../domain/CajaVenta';
import styles from './CarritoPanel.module.css';

interface CarritoPanelProps {
  lineas: LineaCarrito[];
  resumen: ResumenVenta;
  onCambiarCantidad: (idBien: number, cantidad: number) => void;
  onQuitar: (idBien: number) => void;
}

export function CarritoPanel({ lineas, resumen, onCambiarCantidad, onQuitar }: CarritoPanelProps) {
  if (lineas.length === 0) {
    return <p className={styles.vacio}>Toca un producto del catálogo para empezar la venta.</p>;
  }

  return (
    <div className={styles.panel}>
      <ul className={styles.lista}>
        {lineas.map((linea) => {
          const subtotal = linea.cantidad * linea.producto.precio;
          const inputId = `cantidad-${linea.producto.idBien}`;

          return (
            <li key={linea.producto.idBien} className={styles.linea}>
              <div className={styles.info}>
                <span className={styles.nombre}>{linea.producto.nombre}</span>
                <span className={styles.unitario}>
                  {resumen.moneda} {linea.producto.precio.toFixed(2)} c/u
                </span>
              </div>

              <label className={styles.cantidadLabel} htmlFor={inputId}>
                <span className="sr-only">Cantidad de {linea.producto.nombre}</span>
                <input
                  id={inputId}
                  type="number"
                  min={1}
                  max={linea.producto.controlaInventario ? linea.producto.cantidadDisponible : undefined}
                  value={linea.cantidad}
                  className={styles.cantidad}
                  onChange={(event) => onCambiarCantidad(linea.producto.idBien, Number(event.target.value))}
                />
              </label>

              <span className={styles.subtotal}>{subtotal.toFixed(2)}</span>

              <button
                type="button"
                className={styles.quitar}
                onClick={() => onQuitar(linea.producto.idBien)}
                aria-label={`Quitar ${linea.producto.nombre} de la venta`}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.total}>
        <span>Total ({resumen.cantidadTotal} art.)</span>
        <strong>
          {resumen.moneda} {resumen.total.toFixed(2)}
        </strong>
      </div>
    </div>
  );
}
