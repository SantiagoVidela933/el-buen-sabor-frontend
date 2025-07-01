import React, { useEffect, useState } from "react";
import styles from "./PedidosView.module.css";
import Modal from "../ui/Modal/Modal";
import PedidoDetalle from "./PedidosDetalle/PedidoDetalle";
import { PedidoVenta } from "../../models/PedidoVenta";
import { agregarMinutosExtraPedido, cambiarEstadoPedidoVenta, getPedidosVentasCocinero, marcarPedidoListo } from "../../api/pedidoVenta";
import { formatearFechaHora } from "../../api/formatearFechaHora";
import { Estado } from "../../models/enums/Estado";

const PedidosView = () => {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<PedidoVenta | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [pedidos, setPedidos] = useState<PedidoVenta[]>([]);

  // Paginación
  const pedidosPorPagina = 8;
  const [paginaActual, setPaginaActual] = useState(1);

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
    setPaginaActual(1); // Resetear a la primera página en cada búsqueda
  };

  const pedidosFiltrados = pedidos.filter((pedido) =>
    search.trim() === "" || (pedido.id !== undefined && pedido.id !== null && pedido.id.toString().includes(search.trim()))
  );

  // Lógica de Paginación
  const totalPaginas = Math.ceil(pedidosFiltrados.length / pedidosPorPagina);
  const pedidosPaginados = pedidosFiltrados.slice(
    (paginaActual - 1) * pedidosPorPagina,
    paginaActual * pedidosPorPagina
  );

  const cambiarPagina = (numero: number) => {
    setPaginaActual(numero);
  };

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
        <div className={styles.titleGroup}>
          <div className={styles.titleBox}>
            <h2 className={styles.title}>PEDIDOS A PREPARAR</h2>
          </div>
        </div>
        <div className={styles.searchBar}>
          <span className="material-symbols-outlined">search</span> {/* Lupa de búsqueda añadida aquí */}
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
            {pedidosPaginados.length > 0 ? (
              pedidosPaginados.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.id}</td>
                  <td>{formatearFechaHora(pedido)}</td>
                  <td>{pedido.tipoEnvio}</td>
                  <td>{pedido.formaPago}</td>
                  <td className={styles.actions}>
                    <button className={styles.detailBtn} onClick={() => handleViewOrder(pedido)}>Ver detalle</button>
                    <button
                      className={`${styles.btn} ${styles.listo}`}
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
                    <button
                      className={`${styles.btn}`}
                      style={{backgroundColor:"red" }}
                      onClick={async () => {
                        try {
                          if (pedido.id !== undefined) {
                            await cambiarEstadoPedidoVenta(pedido.id, Estado.CANCELADO);
                            await fetchPedidos();
                          }
                        } catch (error) {
                          console.error("Error al marcar como listo:", error);
                        }
                      }}
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.noData}>
                  No hay pedidos que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Sección de Paginación --- */}
      {totalPaginas > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              className={`${styles.paginationButton} ${
                paginaActual === i + 1 ? styles.activePage : ""
              }`}
              onClick={() => cambiarPagina(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {showModal && selectedOrder && (
        <Modal onClose={() => setShowModal(false)}>
          <PedidoDetalle 
            pedido={selectedOrder} 
            actualizarMinutosExtra={actualizarMinutosExtra} 
            onClose={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default PedidosView;