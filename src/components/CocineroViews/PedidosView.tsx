import React, { useEffect, useState } from "react";
import styles from "./PedidosView.module.css";
import Modal from "../ui/Modal/Modal";
import PedidoDetalle from "./PedidosDetalle/PedidoDetalle";
import { PedidoVenta } from "../../models/PedidoVenta";
import { agregarMinutosExtraPedido, getPedidosVentasCocinero, marcarPedidoListo } from "../../api/pedidoVenta";
import { formatearFechaHora } from "../../api/formatearFechaHora";
import UserOrderDetail from "../User/UserOrdetDetail/UserOrderDetail";
const PedidosView = () => {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<PedidoVenta | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [pedidos, setPedidos] = useState<PedidoVenta[]>([]);

  // GET Pedidos de Venta Delivery
  const fetchPedidos = async () => {
    try {
      const data = await getPedidosVentasCocinero();
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
      search.trim() === "" || (pedido.id !== undefined && pedido.id !== null && pedido.id.toString().includes(search.trim()))
    )

  const actualizarMinutosExtra = async (pedidoId: number, minutosExtra: number) => {
    try {
      await agregarMinutosExtraPedido(pedidoId, minutosExtra);
      await fetchPedidos();
    } catch (error) {
      console.error("Error al actualizar minutos extra:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}> {/* Añadido .titleGroup para envolver el título */}
            <div className={styles.titleBox}> {/* Añadido .titleBox para el fondo del título */}
              <h2 className={styles.title}>PEDIDOS A PREPARAR</h2>
            </div>
          </div>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Buscar por Nro. de Pedido"
            value={search}
            onChange={handleSearchChange}
            className={styles.input}
          />
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th>Pedido</th>
              <th>Fecha/Hora</th>
              <th>Forma de Entrega</th>
              <th>Forma de Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{formatearFechaHora(pedido)}</td>
                <td>{pedido.tipoEnvio}</td>
                <td>{pedido.formaPago}</td>
                <td className={styles.actions}>
                  <button className={styles.detailBtn} onClick={() => handleViewOrder(pedido)}>Ver</button>
                  <button
                    className={styles.btn}
                    onClick={async () => {
                      try {
                        if (pedido.id !== undefined) {
                          await marcarPedidoListo(pedido.id);
                          await fetchPedidos();
                        }
                      } catch (error) {
                        console.error("Error al marcar como listo:", error);
                      }
                    }}
                  >
                    Marcar como listo
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedOrder && (
        <Modal onClose={() => setShowModal(false)}>
          <UserOrderDetail
            pedidoVenta={selectedOrder}
            onClose={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default PedidosView;
