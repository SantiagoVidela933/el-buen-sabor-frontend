import styles from "./UserOrderList.module.css";
import { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal/Modal";
import UserOrderDetail from "../UserOrdetDetail/UserOrderDetail";
import { PedidoVenta } from "../../../models/PedidoVenta";
import { Estado } from "../../../models/enums/Estado";
import { getMisPedidosVenta } from "../../../api/pedidoVenta";
import { useAuth0 } from "@auth0/auth0-react";
import { descargarFacturaPDF } from "../../../api/factura";


interface UserOrderListProps {
  onBack: () => void;
}

const UserOrderList = ({ onBack }: UserOrderListProps) => {
  
  const [pedidos, setPedidos] = useState<PedidoVenta[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PedidoVenta | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  // fetch - obtengo categorias de articulos manufacturados
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getMisPedidosVenta(getAccessTokenSilently);
        console.log(data);
        setPedidos(data);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      }
    };
    fetchPedidos();
  }, [getAccessTokenSilently]);

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

  // Función para descargar la factura en PDF
  const handleDownloadFactura = async (facturaId: number) => {
    try {
      setIsLoading(true);
      await descargarFacturaPDF(facturaId, `factura-${facturaId}.pdf`);
    } catch (error) {
      alert("No se pudo descargar la factura. Intente nuevamente más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para descargar la nota de crédito
  const handleDownloadNotaCredito = async (facturaId: number) => {
    try {
      setIsLoading(true);
      await descargarFacturaPDF(facturaId, `nota-credito-${facturaId}.pdf`);
    } catch (error) {
      alert("No se pudo descargar la nota de crédito. Intente nuevamente más tarde.");
    } finally {
      setIsLoading(false);
    }
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
                    {new Date(order.fechaPedido).toLocaleDateString("es-AR", {
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
                    {order.factura && order.factura.length > 0 && (
                      order.estado === Estado.CANCELADO ? (
                        <button
                          disabled={isLoading}
                          onClick={() => handleDownloadNotaCredito(order.factura[0].id)}
                          className={styles.docButton}
                        >
                          Nota de crédito
                        </button>
                      ) : (
                        <button
                          disabled={isLoading}
                          onClick={() => handleDownloadFactura(order.factura[0].id)}
                          className={styles.docButton}
                        >
                          Factura
                        </button>
                      )
                    )}
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
