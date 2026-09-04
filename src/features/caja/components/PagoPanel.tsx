import styles from './PagoPanel.module.css';

interface PagoPanelProps {
  moneda: string;
  total: number;
  efectivo: string;
  qr: string;
  recibido: number;
  cambio: number;
  faltante: number;
  qrExcedido: boolean;
  onEfectivoChange: (value: string) => void;
  onQrChange: (value: string) => void;
  onPagoExacto: () => void;
}

export function PagoPanel({
  moneda,
  total,
  efectivo,
  qr,
  recibido,
  cambio,
  faltante,
  qrExcedido,
  onEfectivoChange,
  onQrChange,
  onPagoExacto,
}: PagoPanelProps) {
  return (
    <section className={styles.panel} aria-label="Cobro">
      <div className={styles.campos}>
        <label className={styles.campo} htmlFor="pago-efectivo">
          <span>Efectivo</span>
          <input
            id="pago-efectivo"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={efectivo}
            placeholder="0.00"
            onChange={(event) => onEfectivoChange(event.target.value)}
          />
        </label>

        <label className={styles.campo} htmlFor="pago-qr">
          <span>QR</span>
          <input
            id="pago-qr"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={qr}
            placeholder="0.00"
            onChange={(event) => onQrChange(event.target.value)}
          />
        </label>
      </div>

      <button type="button" className={styles.exacto} onClick={onPagoExacto} disabled={total <= 0}>
        Pago exacto en efectivo ({moneda} {total.toFixed(2)})
      </button>

      <dl className={styles.resumen}>
        <div>
          <dt>Recibido</dt>
          <dd>
            {moneda} {recibido.toFixed(2)}
          </dd>
        </div>
        <div>
          <dt>Cambio</dt>
          <dd className={styles.cambio}>
            {moneda} {cambio.toFixed(2)}
          </dd>
        </div>
      </dl>

      {faltante > 0 ? (
        <p className={styles.alerta} role="status">
          Faltan {moneda} {faltante.toFixed(2)} para completar el pago.
        </p>
      ) : null}

      {qrExcedido ? (
        <p className={styles.alerta} role="status">
          El cobro por QR no puede superar el total: no se puede dar cambio de un pago electrónico.
        </p>
      ) : null}
    </section>
  );
}
