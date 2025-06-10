import styles from "./UserOrderList.module.css";
import { useState } from "react";
import Modal from "../../../components/ui/Modal/Modal"; // asegurate de que esta ruta sea la correcta
import UserOrderDetail from "../UserOrdetDetail/UserOrderDetail";
import { usePedidoVenta } from "../../../hooks/usePedidoVenta";
import { PedidoVenta } from "../../../models/PedidoVenta";
import { Estado } from "../../../models/enums/Estado";


interface UserOrderListProps {
  onBack: () => void;
}

const UserOrderList = ({ onBack }: UserOrderListProps) => {
  const { pedidos } = usePedidoVenta();

  const [selectedOrder, setSelectedOrder] = useState<PedidoVenta | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewOrder = (order: PedidoVenta) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const formatoARS = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  const renderEstado = (estado: Estado) => {
    const nombre = Estado[estado];
    const color =
      estado === Estado.CANCELADO
        ? "red"
        : estado === Estado.ENTREGADO
        ? "green"
        : "orange";
    return <span style={{ color, fontWeight: "bold" }}>{nombre}</span>;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mis Pedidos</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Nro pedido</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyMessage}>
                  Aún no tenés pedidos
                </td>
              </tr>
            ) : (
              pedidos.map((order) => (
                <tr key={order.id}>
                  <td>
                    {order.fechaPedido.toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    {order.horaPedido}
                  </td>
                  <td>#{order.id}</td>
                  <td>{formatoARS.format(order.totalVenta)}</td>
                  <td>{renderEstado(order.estado)}</td>
                  <td className={styles.actions}>
                    <button onClick={() => handleViewOrder(order)}>Ver</button>

                    {/* Mostrar botón Nota de crédito o Factura según estado y facturas */}
                    {order.facturas.length > 0 &&
                      (order.estado === Estado.CANCELADO ? (
                        <button
                          onClick={() =>
                            alert(`Descargar nota de crédito de ${order.id}`)
                          }
                        >
                          Nota de crédito
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            alert(`Descargar factura de ${order.id}`)
                          }
                        >
                          Factura
                        </button>
                      ))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button className={styles.backButton} onClick={onBack}>
        Volver
      </button>

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

};

export default UserOrderList;
