import styles from './OrderDetailRanking.module.css';
import { PedidoVenta } from '../../../../../../models/PedidoVenta';
import { FormaPago } from '../../../../../../models/enums/FormaPago';
import { TipoEnvio } from '../../../../../../models/enums/TipoEnvio';

interface OrderDetailProps {
  pedidoVenta: PedidoVenta;
}

const OrderDetailRanking = ({ pedidoVenta }: OrderDetailProps) => {

  const formatoMoneda = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Pedido : {pedidoVenta.id}</h2>

      <div className={styles.details}>
        <div>
          <p>
            <strong>Fecha:</strong>{" "}
            {(() => {
              if (typeof pedidoVenta.fechaPedido === "string") {
                const [year, month, day] = (pedidoVenta.fechaPedido as string).split('-').map(Number);
                const date = new Date(year, month - 1, day);
                return date.toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });
              }
              return "Fecha inválida";
            })()}{" "}
            {pedidoVenta.horaPedido}
          </p>
        </div>
        <div>
          <p>
            <strong>Forma de Entrega:</strong> {TipoEnvio[pedidoVenta.tipoEnvio]}
          </p>
          <p>
            <strong>Forma de Pago:</strong> {FormaPago[pedidoVenta.formaPago]}
          </p>
        </div>
      </div>

      <table className={styles.productTable}>
        <thead>
          <tr>
            <th>Producto/Promoción</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {pedidoVenta.pedidosVentaDetalle.map((detalle, index) => (
            <tr key={index}>
              <td>
                {detalle.promocion
                  ? detalle.promocion.denominacion
                  : detalle.articulo?.denominacion}
              </td>
              <td>{detalle.cantidad}</td>
              <td>{formatoMoneda.format(detalle.subtotal / detalle.cantidad)}</td>
              <td>{formatoMoneda.format(detalle.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.summary}>
        <p>
          <strong>Sub Total:</strong> {formatoMoneda.format(pedidoVenta.pedidosVentaDetalle.reduce((acc, detalle) => acc + detalle.subtotal, 0))}
        </p>

        {pedidoVenta.descuento>0 && (
          <div className={styles.resumen_desc}>
            <p>Descuento (10%)</p>
            <span>-${(pedidoVenta.totalVenta*(pedidoVenta.descuento/100)).toFixed(2)}</span>
          </div>
        )}
        {pedidoVenta.descuento == null ||  pedidoVenta.descuento==0 && (
            <div className={styles.resumen_desc}>
              <p>Descuento:</p>
              <span>-----</span>
            </div>
          )}
        <p className={styles.total}>
          <strong>TOTAL:</strong> {formatoMoneda.format(pedidoVenta.totalVenta)}
        </p>
      </div>
    </div>
  );
};

export default OrderDetailRanking;
