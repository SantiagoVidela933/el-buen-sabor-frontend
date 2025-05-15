import styles from "./UserOrderList.module.css";
import { useOrder } from "../../../hooks/useOrder";
import { useState } from "react";
import Modal from "../../../components/ui/Modal/Modal"; // asegurate de que esta ruta sea la correcta
import UserOrderDetail from "../UserOrdetDetail/UserOrderDetail";


interface UserOrderListProps {
  onBack: () => void;
}

const UserOrderList = ({ onBack }: UserOrderListProps) => {
  const { orders } = useOrder();

  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[0] | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewOrder = (order: (typeof orders)[0]) => {
    setSelectedOrder(order);
    setShowModal(true);
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
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyMessage}>
                  Aún no tenés pedidos
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{formatDate(order.date)}</td>
                  <td>#{order.id}</td>
                  <td>${order.total}</td>
                  <td>{order.orderStatus}</td>
                  <td className={styles.actions}>
                    <button onClick={() => handleViewOrder(order)}>Ver</button>
                    {order.paid &&
                      (order.orderStatus === "Cancelado" ? (
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
            order={selectedOrder}
            onClose={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default UserOrderList;
