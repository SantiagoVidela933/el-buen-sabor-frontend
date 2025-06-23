import React, { useEffect, useState } from "react";
import styles from "./PedidosView.module.css";
import Modal from "../ui/Modal/Modal";
import PedidoDetalle from "./PedidosDetalle/PedidoDetalle";
import { PedidoVenta } from "../../models/PedidoVenta";
import { agregarMinutosExtraPedido, getPedidosVentasCocinero, marcarPedidoListo } from "../../api/pedidoVenta";

const PedidosView = () => {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<PedidoVenta | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [pedidos, setPedidos] = useState<PedidoVenta[]>([]);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Ajusta la cantidad de elementos por página

  // GET Pedidos de Venta Delivery
  const fetchPedidos = async () => {
    try {
      const data = await getPedidosVentasCocinero();
      setPedidos(data);
      console.log(data);
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
    setCurrentPage(1); // Resetear a la primera página en cada búsqueda
  };

  const pedidosFiltrados = pedidos.filter((pedido) =>
    search.trim() === "" || pedido.id.toString().includes(search.trim())
  );

  const actualizarMinutosExtra = async (pedidoId: number, minutosExtra: number) => {
    try {
      await agregarMinutosExtraPedido(pedidoId, minutosExtra);
      await fetchPedidos();
    } catch (error) {
      console.error("Error al actualizar minutos extra:", error);
    }
  };

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPedidos = pedidosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(pedidosFiltrados.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderPaginationButtons = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`${styles.paginationButton} ${currentPage === i ? styles.activePage : ''}`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const numeroColumnasTabla = 5; // Pedido, Fecha/Hora, Forma de Entrega, Forma de Pago, Acciones

  return (
    <div className={styles.container}>
      {/* Nuevo encabezado con estilos consistentes */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.titleBox}>
            <h2 className={styles.title}>LISTA DE PEDIDOS A PREPARAR</h2>
          </div>
        </div>
        {/* Barra de búsqueda con estilos consistentes */}
        <div className={styles.searchBar}>
            <span className="material-symbols-outlined">search</span>
            <input
                type="text"
                placeholder="Buscar por Nro. de Pedido"
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
            {currentPedidos.length === 0 ? (
              <tr>
                <td colSpan={numeroColumnasTabla} className={styles.noData}>
                  No hay pedidos para mostrar.
                </td>
              </tr>
            ) : (
              currentPedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>#{pedido.id}</td>
                  <td>
                    {new Date(pedido.fechaPedido).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    - {pedido.horaPedido}
                  </td>
                  <td>{pedido.tipoEnvio}</td>
                  <td>{pedido.formaPago}</td>
                  <td className={styles.actions}>
                    <button className={styles.viewBtn} onClick={() => handleViewOrder(pedido)}>Ver detalle</button>
                    <button
                      className={styles.actionBtn} // Usamos actionBtn para "Marcar como listo"
                      onClick={async () => {
                        try {
                          await marcarPedidoListo(pedido.id);
                          await fetchPedidos();
                        } catch (error) {
                          console.error("Error al marcar como listo:", error);
                        }
                      }}
                    >
                      Marcar como listo
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className={styles.paginationControls}>
          {renderPaginationButtons()}
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
};

export default PedidosView;