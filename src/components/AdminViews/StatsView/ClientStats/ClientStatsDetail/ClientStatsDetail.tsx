import styles from "./ClientStatsDetail.module.css";
import { useEffect, useState } from "react";
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

    const formatoMoneda = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  // fetch - obtengo categorias de articulos manufacturados
  useEffect(() => {
    const fetchPedidos = async () => {
      if(clienteId === null) return;
      try {
        const data = await getPedidosVentasPorCliente(clienteId, fechaInicio, fechaFin);
        setPedidos(data);
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
            {pedidos.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyMessage}>
                  No hay pedidos
                </td>
              </tr>
            ) : (
              pedidos.map((order) => (
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
                      className={styles.verDetalleBtn}
                      onClick={() => handleVerDetalle(order)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
              {pedidoSeleccionado && (
        <Modal onClose={handleCerrarDetalle}>
          <OrderDetailRanking pedidoVenta={pedidoSeleccionado} />
        </Modal>
      )}
    </div>
  );
};

export default ClienteStatsDetails;
