import { useEffect, useState } from 'react';
import styles from './DeliveryPage.module.css';
import Modal from '../../components/ui/Modal/Modal';
import DeliveryDetail from './DeliveryDetail/DeliveryDetail';
import { getPedidosVentasDelivery } from '../../api/pedidoVenta';
import { PedidoVenta } from '../../models/PedidoVenta';

const DeliveryPage = () => {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<PedidoVenta | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [pedidos, setPedidos] = useState<PedidoVenta[]>([]);

  // GET Pedidos de Venta Delivery
  const fetchPedidos = async () => {
    try {
      const data = await getPedidosVentasDelivery();
      setPedidos(data);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    }
  };
  useEffect(() => {
    fetchPedidos();
  }, []);

  const handleViewOrder = (pedido: PedidoVenta) => {
    setSelectedOrder(pedido);
    setShowModal(true);
  };

  // Buscar por número de pedido
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const pedidosFiltrados = pedidos
    .filter((pedido) =>
      search.trim() === "" || pedido.id.toString().includes(search.trim())
    )

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Lista de Pedidos a Entregar</h2>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Buscar por Nro. de Pedido"
          value={search}
          onChange={handleSearchChange}
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
            {/* <th>Pagado</th> */}
            <th>Detalle</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidosFiltrados.map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>
                {new Date(pedido.fechaPedido).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })} - {" "}
                {pedido.horaPedido}
              </td>
              <td>{pedido.tipoEnvio}</td>
              <td>{pedido.formaPago}</td>
              {/* <td>{pedido. ? 'Sí' : 'No'}</td> */}
              <td>
                <button className={styles.detailBtn} onClick={() => handleViewOrder(pedido)}>
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
      {showModal && selectedOrder && (
        <Modal onClose={() => setShowModal(false)}>
          <DeliveryDetail pedido={selectedOrder} onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  );
};

export default DeliveryPage;
