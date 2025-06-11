import styles from '../../User/UserOrdetDetail/UserOrderDetail.module.css';
import { PedidoVenta } from '../../../models/PedidoVenta';
import { FormaPago } from '../../../models/enums/FormaPago';
import { TipoEnvio } from '../../../models/enums/TipoEnvio';
import { Estado } from '../../../models/enums/Estado';

interface OrderDetailProps {
  pedidoVenta: PedidoVenta;
  onClose: () => void;
}

const OrderDetail = ({ pedidoVenta, onClose }: OrderDetailProps) => {

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
            {new Date(pedidoVenta.fechaPedido).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
          <p>
            <strong>Estado:</strong> {Estado[pedidoVenta.estado]}
          </p>
          <p>
            <strong>Nombre y Apellido:</strong>{" "}
            {pedidoVenta.cliente
              ? `${pedidoVenta.cliente.nombre} ${pedidoVenta.cliente.apellido}`
              : "No registrado"}
          </p>
          <p>
            <strong>Teléfono:</strong>{" "}
            {pedidoVenta.cliente ? pedidoVenta.cliente.telefono : "No registrado"}
          </p>
          <p>
            <strong>Dirección:</strong>{" "}
            {pedidoVenta.domicilio
              ? `${pedidoVenta.domicilio.calle} ${pedidoVenta.domicilio.numero}`
              : "No registrada"}
          </p>
          <p>
            <strong>Departamento:</strong>{" "}
            {pedidoVenta.domicilio ? pedidoVenta.domicilio.departamento : "No registrado"}
          </p>
        </div>
        <div>
          <p>
            <strong>Forma de Entrega:</strong> {TipoEnvio[pedidoVenta.tipoEnvio]}
          </p>
          <p>
            <strong>Forma de Pago:</strong> {FormaPago[pedidoVenta.formaPago]}
          </p>
          <p>
            <strong>Hora estimada:</strong>{" "}
            {pedidoVenta.horaPedido} -{" "}
            {(() => {
              // Calculo hora estimada + 20 minutos
              const [h, m] = pedidoVenta.horaPedido.split(":").map(Number);
              let date = new Date(pedidoVenta.fechaPedido);
              date.setHours(h, m + 20);
              const hh = date.getHours().toString().padStart(2, "0");
              const mm = date.getMinutes().toString().padStart(2, "0");
              return `${hh}:${mm}`;
            })()}
          </p>
        </div>
      </div>

      <table className={styles.productTable}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Sub total</th>
          </tr>
        </thead>
        <tbody>
          {pedidoVenta.pedidosVentaDetalle
            ?.filter((detalle) => detalle.articulo?.tipoArticulo === "manufacturado")
            .map((detalle, index) => (
              <tr key={index}>
                <td>{detalle.articulo?.denominacion || "Producto sin nombre"}</td>
                <td>{detalle.cantidad}</td>
                <td>{formatoMoneda.format(detalle.subtotal / detalle.cantidad)}</td>
                <td>{formatoMoneda.format(detalle.subtotal)}</td>
              </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.summary}>
        <p>
          <strong>Sub Total:</strong> {formatoMoneda.format(pedidoVenta.totalVenta)}
        </p>
        <p>
          <strong>Descuentos:</strong> - - -
        </p>
        <p className={styles.total}>
          <strong>TOTAL:</strong> {formatoMoneda.format(pedidoVenta.totalVenta)}
        </p>
      </div>
    </div>
  );
};

export default OrderDetail;
