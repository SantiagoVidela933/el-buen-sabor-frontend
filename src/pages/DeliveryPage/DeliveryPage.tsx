import React, { useEffect, useState } from 'react'; // Aseguramos importación de React
import styles from './DeliveryPage.module.css';
import Modal from '../../components/ui/Modal/Modal';
import DeliveryDetail from './DeliveryDetail/DeliveryDetail';
import { cambiarEstadoPedidoVenta, getPedidosVentasDelivery } from '../../api/pedidoVenta';
import { PedidoVenta } from '../../models/PedidoVenta';
import { formatearFechaHora } from '../../api/formatearFechaHora'; 
import { Estado } from '../../models/enums/Estado';

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
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const pedidosFiltrados = pedidos
    .filter((pedido) =>
      search.trim() === "" || (pedido.id !== undefined && pedido.id.toString().includes(search.trim())
    )
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}> {/* Añadido .header para el layout */}
        <div className={styles.titleGroup}> {/* Añadido .titleGroup para envolver el título */}
          <div className={styles.titleBox}> {/* Añadido .titleBox para el fondo del título */}
            <h2 className={styles.title}>LISTA DE PEDIDOS A ENTREGAR</h2> {/* Título ajustado y en mayúsculas */}
          </div>
        </div>

        {/* Barra de búsqueda - integrada directamente en el header, sin filtro de estado */}
        <div className={styles.searchBar}>
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Buscar por Nro. de Pedido..." // Placeholder ajustado
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div> {/* Fin de .header */}

      <div className={styles.tableWrapper}> {/* Envuelve la tabla para el overflow-x */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Fecha y Hora</th>
              <th>Forma de Entrega</th>
              <th>Forma de Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.noData}> 
                  No hay pedidos de delivery que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id}>
                  <td>#{pedido.id}</td> 
                  <td>{formatearFechaHora(pedido)}</td>
                  <td>{pedido.tipoEnvio}</td>
                  <td>{pedido.formaPago}</td>
                  <td className={styles.actions}>
                    <button className={styles.detailBtn} onClick={() => handleViewOrder(pedido)}>Ver detalle</button>
                    <button
                      className={styles.btn} 
                      onClick={async () => {
                        try {
                          if (pedido.id !== undefined) {
                            await cambiarEstadoPedidoVenta(pedido.id, Estado.ENTREGADO);
                          }
                          await fetchPedidos(); 
                        } catch (error) {
                          console.error("Error al marcar como entregado:", error);
                        }
                      }}
                    >
                      Marcar como entregado
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedOrder && (
        <Modal onClose={() => setShowModal(false)}>
          <DeliveryDetail pedido={selectedOrder} onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  );
};

export default DeliveryPage;