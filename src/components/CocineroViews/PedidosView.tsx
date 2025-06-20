import React, { useEffect, useState } from "react";
import styles from "./PedidosView.module.css";
import Modal from "../ui/Modal/Modal";
import PedidoDetalle from "./PedidosDetalle/PedidoDetalle";
import { PedidoVenta } from "../../models/PedidoVenta";
import { cambiarEstadoPedidoVenta, getPedidosVentasCocinero } from "../../api/pedidoVenta";
import { Estado } from "../../models/enums/Estado";

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
      console.log(data)
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
      <h2 className={styles.title}>Lista de Pedidos a Preparar</h2>
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
              <td className={styles.actions}>
                <button onClick={() => handleViewOrder(pedido)}>Ver</button>
                <button
                  onClick={async () => {
                    try {
                      await cambiarEstadoPedidoVenta(pedido.id, Estado.ENTREGADO);
                      await fetchPedidos(); 
                    } catch (error) {
                      console.error("Error al marcar como entregado:", error);
                    }
                  }}
                  disabled={!pedido.facturas || pedido.facturas.length === 0}
                >
                  Marcar como entregado
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && selectedOrder && (
        <Modal onClose={() => setShowModal(false)}>
          <PedidoDetalle pedido={selectedOrder} />
        </Modal>
      )}
    </div>
  );
}

export default PedidosView;
