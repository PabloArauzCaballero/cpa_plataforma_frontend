import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import type { ProductoTienda } from '../domain/CajaVenta';
import styles from './ProductoGrid.module.css';

interface ProductoGridProps {
  productos: ProductoTienda[];
  enCarrito: Record<number, number>;
  onSeleccionar: (producto: ProductoTienda) => void;
}

function formatearPrecio(precio: number, moneda: string): string {
  return `${moneda} ${precio.toFixed(2)}`;
}

export function ProductoGrid({ productos, enCarrito, onSeleccionar }: ProductoGridProps) {
  if (productos.length === 0) {
    return (
      <p className={styles.vacio}>
        No hay productos de tienda que coincidan. Verifica el catálogo en Inventario &gt; Bien.
      </p>
    );
  }

  return (
    <ul className={styles.grid}>
      {productos.map((producto) => {
        const cantidadEnCarrito = enCarrito[producto.idBien] ?? 0;
        const agotado = producto.controlaInventario && producto.cantidadDisponible <= cantidadEnCarrito;

        return (
          <li key={producto.idBien}>
            <button
              type="button"
              className={styles.card}
              onClick={() => onSeleccionar(producto)}
              disabled={agotado}
              aria-label={`Agregar ${producto.nombre} a la venta. Precio ${formatearPrecio(producto.precio, producto.moneda)}`}
            >
              <span className={styles.imagenBox}>
                {producto.imagenUrl ? (
                  <img src={producto.imagenUrl} alt="" className={styles.imagen} loading="lazy" decoding="async" />
                ) : (
                  <span className={styles.placeholder} aria-hidden="true">
                    <FontAwesomeIcon icon={faBoxOpen} />
                  </span>
                )}
                {cantidadEnCarrito > 0 ? <span className={styles.badge}>{cantidadEnCarrito}</span> : null}
              </span>

              <span className={styles.nombre}>{producto.nombre}</span>
              <span className={styles.sku}>{producto.sku}</span>
              <span className={styles.precio}>{formatearPrecio(producto.precio, producto.moneda)}</span>
              <span className={styles.stock} data-agotado={agotado ? 'true' : 'false'}>
                {producto.controlaInventario ? `${producto.cantidadDisponible} disponibles` : 'Sin control de stock'}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
