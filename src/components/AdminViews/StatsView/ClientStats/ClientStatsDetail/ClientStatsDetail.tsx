import { useEffect, useState } from "react";
import React from "react"; // Aseguramos que React esté importado
import styles from "./ClientStatsDetail.module.css";
import { PedidoVenta } from "../../../../../models/PedidoVenta";
import { getPedidosVentasPorCliente } from "../../../../../api/pedidoVenta";
import OrderDetailRanking from "../ClientStatsDetail/OrderDetailRanking/OrderDetailRankign";
import Modal from "../../../../ui/Modal/Modal";

interface ClienteStatsDetailsProps {
  clienteId: number | null;
  fechaInicio: string;
  fechaFin: string;
}

const ClienteStatsDetails: React.FC<ClienteStatsDetailsProps> = ({ clienteId, fechaInicio, fechaFin }) => {
  const [pedidos, setPedidos] = useState<PedidoVenta[]>([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<PedidoVenta | null>(null); // Pedido seleccionado para mostrar detalles

  // --- Estados para la paginación ---
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(2); // Ajusta la cantidad de ítems por página si es necesario

  const formatoMoneda = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  // fetch - obtengo categorias de articulos manufacturados
  useEffect(() => {
    const fetchPedidos = async () => {
      if (clienteId === null) return;
      try {
        const data = await getPedidosVentasPorCliente(clienteId, fechaInicio, fechaFin);
        setPedidos(data);
        setCurrentPage(1); // Resetear a la primera página cuando cambian los pedidos
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      }
    };
    fetchPedidos();
  }, [clienteId, fechaInicio, fechaFin]);

  const handleVerDetalle = (pedido: PedidoVenta) => {
    setPedidoSeleccionado(pedido);
  };

  const handleCerrarDetalle = () => {
    setPedidoSeleccionado(null);
  };

  // --- Lógica de Paginación ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pedidos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pedidos.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Fecha y Hora</th>
            <th>Nro pedido</th>
            <th>Total</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {/* Usamos currentItems para renderizar los pedidos de la página actual */}
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan={4} className={styles.emptyMessage}> {/* Colspan ajustado a 4 */}
                No hay pedidos para este cliente en el rango de fechas seleccionado.
              </td>
            </tr>
          ) : (
            currentItems.map((order) => (
              <tr key={order.id}>
                <td>
                  {(() => {
                    if (typeof order.fechaPedido === "string") {
                      const [year, month, day] = (order.fechaPedido as string).split('-').map(Number);
                      const date = new Date(year, month - 1, day);
                      return date.toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      });
                    }
                    return "Fecha inválida";
                  })()}{" "}
                  {order.horaPedido}
                </td>
                <td>#{order.id}</td>
                <td>{formatoMoneda.format(order.totalVenta)}</td>
                <td>
                  <button
                    className={styles.detailBtn}
                    onClick={() => handleVerDetalle(order)}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* --- Controles de Paginación Numérica --- */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`${styles.paginationButton} ${currentPage === index + 1 ? styles.activePage : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {pedidoSeleccionado && (
        <Modal onClose={handleCerrarDetalle}>
          <OrderDetailRanking pedidoVenta={pedidoSeleccionado} />
        </Modal>
      )}
    </div>
  );
};

export default ClienteStatsDetails;