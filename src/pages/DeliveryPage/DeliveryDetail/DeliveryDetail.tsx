import React from 'react';
import styles from './DeliveryDetail.module.css';
import { Order } from '../ordersDelivery';

type DeliveryDetailProps = {
  pedido: Order;
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
              <td>{pedido.date}</td>
            </tr>
            <tr>
              <th>Forma de Entrega</th>
              <td>{pedido.deliveryMethod}</td>
            </tr>
            <tr>
              <th>Forma de Pago</th>
              <td>{pedido.paymentMethod}</td>
            </tr>
            <tr>
              <th>Pagado</th>
              <td>{pedido.paid ? 'Sí' : 'No'}</td>
            </tr>
            <tr>
              <th>Estado</th>
              <td>{pedido.status}</td>
            </tr>
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
