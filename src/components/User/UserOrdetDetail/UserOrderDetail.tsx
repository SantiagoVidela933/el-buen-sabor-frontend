import styles from '../../User/UserOrdetDetail/UserOrderDetail.module.css';
import { Order } from '../../../models/Orders/Order';
import { Product } from '../../../models/Products/Product';

interface OrderDetailProps {
  order: Order;
  onClose: () => void;
}

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

const OrderDetail = ({ order, onClose }: OrderDetailProps) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Pedido : {order.id}</h2>

      <div className={styles.details}>
        <div>
          <p><strong>Fecha:</strong> {order.date}</p>
          <p><strong>Estado:</strong> {order.orderStatus}</p>
          <p><strong>Nombre y Apellido:</strong> Juan Perez</p>
          <p><strong>Teléfono:</strong> 2616000999</p>
          <p><strong>Dirección:</strong> Madre Teresa 1230</p>
          <p><strong>Departamento:</strong> Guaymallén</p>
        </div>
        <div>
          <p><strong>Forma de Entrega:</strong> Delivery</p>
          <p><strong>Forma de Pago:</strong> Mercado Pago</p>
          <p><strong>Hora estimada:</strong> 22:00 - 22:20</p>
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
          {order.products?.map(({ product, quantity }, index) => (
            <tr key={index}>
              <td>{product.title}</td>
              <td>{quantity}</td>
              <td>${product.price}</td>
              <td>${product.price * quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.summary}>
        <p><strong>Sub Total:</strong> $10000</p>
        <p><strong>Descuentos:</strong> $1500</p>
        <p className={styles.total}><strong>TOTAL:</strong> ${order.total}</p>
      </div>

    </div>
  );
};

export default OrderDetail;
