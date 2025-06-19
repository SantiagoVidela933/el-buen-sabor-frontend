import React, { useEffect, useState } from 'react'; // Aseguramos importación de React
import styles from './DeliveryPage.module.css';
import Modal from '../../components/ui/Modal/Modal';
import DeliveryDetail from './DeliveryDetail/DeliveryDetail';
import { cambiarEstadoPedidoVenta, getPedidosVentasDelivery } from '../../api/pedidoVenta';
import { PedidoVenta } from '../../models/PedidoVenta';
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

  // Buscar por número de pedido
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const pedidosFiltrados = pedidos
    .filter((pedido) =>
      search.trim() === "" || pedido.id.toString().includes(search.trim())
    );

  const estadoLabels: Record<Estado, string> = {
    [Estado.PREPARACION]: "En cocina",
    [Estado.PENDIENTE]: "A confirmar",
    [Estado.CANCELADO]: "Cancelado",
    [Estado.RECHAZADO]: "Rechazado",
    [Estado.ENTREGADO]: "Entregado",
    [Estado.EN_DELIVERY]: "En delivery",
  };

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
              <th>Fecha y Hora</th> {/* Consistencia en la columna */}
              <th>Forma de Entrega</th>
              <th>Forma de Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.length === 0 ? (
              <tr>
                {/* Aquí es donde se aplica colSpan para que la celda abarque todas las columnas */}
                <td colSpan={5} className={styles.noData}> 
                  No hay pedidos de delivery que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id}>
                  <td>#{pedido.id}</td> {/* Añadido # para consistencia */}
                  <td>
                    {new Date(pedido.fechaPedido).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })} {" "}
                    {pedido.horaPedido}
                  </td>
                  <td>{pedido.tipoEnvio}</td>
                  <td>{pedido.formaPago}</td>
                  <td className={styles.actions}>
                    <button className={styles.detailBtn} onClick={() => handleViewOrder(pedido)}>Ver detalle</button> {/* Clase detailBtn */}
                    <button
                      className={styles.btn} // Clase btn para el botón de acción principal
                      onClick={async () => {
                        try {
                          await cambiarEstadoPedidoVenta(pedido.id, Estado.ENTREGADO);
                          await fetchPedidos(); 
                        } catch (error) {
                          console.error("Error al marcar como entregado:", error);
                        }
                      }}
                      disabled={pedido.facturas.length === 0} 
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