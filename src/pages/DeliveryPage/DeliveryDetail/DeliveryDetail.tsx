import styles from './DeliveryDetail.module.css';
import { PedidoVenta } from '../../../models/PedidoVenta';

type DeliveryDetailProps = {
  pedido: PedidoVenta;
  onClose?: () => void;
};

const DeliveryDetail: React.FC<DeliveryDetailProps> = ({ pedido, onClose }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Detalle del Pedido #{pedido.id}</h2>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <th>Fecha/Hora</th>
              <td>
                {new Date(pedido.fechaPedido).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                {pedido.horaPedido}
              </td>
            </tr>
            <tr>
              <th>Forma de Entrega</th>
              <td>{pedido.tipoEnvio}</td>
            </tr>
            <tr>
              <th>Forma de Pago</th>
              <td>{pedido.formaPago}</td>
            </tr>
            <tr>
              <th>Estado</th>
              <td>{pedido.estado}</td>
            </tr>

            {pedido.cliente && (
              <>
                <tr>
                  <th>Cliente</th>
                  <td>{pedido.cliente.nombre} {pedido.cliente.apellido}</td>
                </tr>
                <tr>
                  <th>Teléfono</th>
                  <td>{pedido.cliente.telefono}</td>
                </tr>
              </>
            )}

            {(pedido.domicilio || (pedido.cliente && pedido.cliente.domicilio)) && (
              <tr>
                <th>Dirección</th>
                <td>
                  {pedido.domicilio
                    ? `${pedido.domicilio.calle} ${pedido.domicilio.numero}, ${pedido.domicilio.localidad?.nombre || ''}`
                    : pedido.cliente?.domicilio
                      ? `${pedido.cliente.domicilio.calle} ${pedido.cliente.domicilio.numero}, ${pedido.cliente.domicilio.localidad?.nombre || ''}`
                      : "No disponible"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {onClose && (
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.closeBtn}>
            Cerrar
          </button>
        </div>
      )}
    </div>
  );

};

export default DeliveryDetail;
