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
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Pedido : {pedidoVenta.id}</h2>

      <div className={styles.details}>
        <div>
          <p>
            <strong>Fecha:</strong>{" "}
            {pedidoVenta.fechaPedido.toLocaleDateString("es-AR", {
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
          {pedidoVenta.pedidosVentaDetalle?.map(({ product, quantity }, index) => (
            <tr key={index}>
              <td>{product.title}</td>
              <td>{quantity}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>${(product.price * quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.summary}>
        <p>
          <strong>Sub Total:</strong> ${pedidoVenta.totalCosto.toFixed(2)}
        </p>
        <p>
          <strong>Descuentos:</strong> ${pedidoVenta.descuento.toFixed(2)}
        </p>
        <p className={styles.total}>
          <strong>TOTAL:</strong> ${pedidoVenta.totalVenta.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default OrderDetail;
