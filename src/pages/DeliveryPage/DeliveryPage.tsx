import { useState } from 'react';
import styles from './DeliveryPage.module.css';
import { mockOrders, Order } from './ordersDelivery';
import Modal from '../../components/ui/Modal/Modal';
import DeliveryDetail from './DeliveryDetail/DeliveryDetail';

const DeliveryPage = () => {
  const [busquedaId, setBusquedaId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Order | null>(null);

  const filtrarPedidos = (): Order[] => {
    return mockOrders.filter(order => {
      const coincideId = busquedaId === '' || order.id.toString().includes(busquedaId);
      return coincideId;
    });
  };

  const handleVerDetalle = (pedido: Order) => {
    setPedidoSeleccionado(pedido);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setPedidoSeleccionado(null);
  };

  const pedidosFiltrados = filtrarPedidos();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Lista de Pedidos a Entregar</h2>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Buscar por Nro. de Pedido"
          value={busquedaId}
          onChange={(e) => setBusquedaId(e.target.value)}
          className={styles.input}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Fecha/Hora</th>
            <th>Forma de Entrega</th>
            <th>Forma de Pago</th>
            <th>Pagado</th>
            <th>Estado</th>
            <th>Detalle</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidosFiltrados.map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{pedido.date}</td>
              <td>{pedido.deliveryMethod}</td>
              <td>{pedido.paymentMethod}</td>
              <td>{pedido.paid ? 'Sí' : 'No'}</td>
              <td>{pedido.status}</td>
              <td>
                <button className={styles.detailBtn} onClick={() => handleVerDetalle(pedido)}>
                  Ver Detalle
                </button>
              </td>
              <td>
                <button className={styles.actionBtn}>Entregar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && pedidoSeleccionado && (
        <Modal onClose={cerrarModal}>
          <DeliveryDetail pedido={pedidoSeleccionado} onClose={cerrarModal} />
        </Modal>
      )}
    </div>
  );
};

export default DeliveryPage;
