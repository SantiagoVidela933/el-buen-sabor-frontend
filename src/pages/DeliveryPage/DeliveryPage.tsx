import React, { useEffect, useState } from 'react';
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

  // --- NUEVA LÓGICA DE PAGINACIÓN ---
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8); // Puedes ajustar la cantidad de ítems por página si es necesario

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
    // IMPORTANTE: Reiniciar la página a 1 cuando cambia la búsqueda
    setCurrentPage(1);
  };

  const pedidosFiltrados = pedidos
    .filter((pedido) =>
      search.trim() === "" || (pedido.id !== undefined && pedido.id.toString().includes(search.trim())
    )
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.titleBox}>
            <h2 className={styles.title}>LISTA DE PEDIDOS A ENTREGAR</h2>
          </div>
        </div>

        <div className={styles.searchBar}>
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Buscar por Nro. de Pedido..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
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
            {/* Renderiza los ítems de la página actual */}
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.noData}> 
                  No hay pedidos de delivery que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              currentItems.map((pedido) => (
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
                          console.log('Intentando marcar como entregado el pedido ID:', pedido.id);
                          console.log('Estado actual del pedido:', pedido.estado);
                          console.log('Datos del pedido:', pedido);
                          if (pedido.id !== undefined) {
                            console.log('Llamando a la API para cambiar estado...');
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

      {/* --- CONTROLES DE PAGINACIÓN NUMÉRICA --- */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              // Aplica la clase 'activePage' solo si es la página actual
              className={`${styles.paginationButton} ${currentPage === index + 1 ? styles.activePage : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {showModal && selectedOrder && (
        <Modal onClose={() => setShowModal(false)}>
          <DeliveryDetail pedido={selectedOrder} onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  );
};

export default DeliveryPage;