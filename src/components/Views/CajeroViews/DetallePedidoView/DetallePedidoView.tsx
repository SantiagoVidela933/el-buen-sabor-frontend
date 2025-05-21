import React from 'react';
import styles from './DetallePedidoView.module.css';
import { Order } from '../../../../models/Orders/Order';
import { Product } from '../../../../models/Products/Product';

interface DetallePedidoViewProps {
  pedido: Order;
  onClose: () => void;
}

const DetallePedidoView = ({ pedido, onClose }: DetallePedidoViewProps) => {

  // Calculamos el subtotal de los productos con verificación de nulidad
  const subTotalProductos = pedido.products
    ? pedido.products.reduce((sum, item) => {
        // Verifica que item.product exista y que item.product.price sea un número
        if (item && item.product && typeof item.product.price === 'number') {
          return sum + (item.product.price * item.quantity);
        }
        return sum; // Si no es válido, no lo sumamos
      }, 0)
    : 0;

  const descuentosAplicados = 0; // Se mantiene en 0 a menos que lo agregues a tu clase Order

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Detalle del Pedido: {pedido.id}</h2>

      <div className={styles.details}>
        <div>
          <p><strong>Fecha:</strong> {pedido.date}</p>
          <p><strong>Estado:</strong> {pedido.orderStatus}</p>
          {/* Añade más detalles de Order si los tienes y no están comentados */}
           <p><strong>¿Pagado?:</strong> {pedido.paid ? 'Sí' : 'No'}</p>
        </div>
        <div>
          {/* Otros detalles de Order si los tienes */}
        </div>
      </div>

      <table className={styles.productTable}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Sub Total</th>
          </tr>
        </thead>
        <tbody>
          {pedido.products && pedido.products.length > 0 ? (
            pedido.products.map((item, index) => (
              <tr key={index}>
                {/* Verifica item.product y item.product.price antes de acceder a ellos */}
                <td>{item.product?.title || 'Producto Desconocido'}</td>
                <td>{item.quantity}</td>
                <td>${(typeof item.product?.price === 'number' ? item.product.price : 0).toFixed(2)}</td>
                <td>${(typeof item.product?.price === 'number' ? item.product.price * item.quantity : 0).toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No hay productos en este pedido.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={styles.summary}>
        <p><strong>Sub Total Productos:</strong> ${subTotalProductos.toFixed(2)}</p>
        {descuentosAplicados > 0 && <p><strong>Descuentos:</strong> ${descuentosAplicados.toFixed(2)}</p>}
        {/* Asegúrate de que pedido.total es siempre un número. Si puede ser undefined, añade un fallback */}
        <p className={styles.total}><strong>TOTAL:</strong> ${(typeof pedido.total === 'number' ? pedido.total : 0).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default DetallePedidoView;