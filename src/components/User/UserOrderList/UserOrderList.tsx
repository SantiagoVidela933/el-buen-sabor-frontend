import styles from "./UserOrderList.module.css";
import { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal/Modal";
import UserOrderDetail from "../UserOrdetDetail/UserOrderDetail";
import { PedidoVenta } from "../../../models/PedidoVenta";
import { Estado } from "../../../models/enums/Estado";
import { getMisPedidosVenta } from "../../../api/pedidoVenta";
import { useAuth0 } from "@auth0/auth0-react";
import { descargarFacturaPDF, descargarNotaCreditoPDF } from "../../../api/factura";
import { formatearFechaHora } from "../../../api/formatearFechaHora";


interface UserOrderListProps {
  onBack: () => void;
}

const UserOrderList = ({ onBack }: UserOrderListProps) => {
  const [pedidos, setPedidos] = useState<PedidoVenta[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PedidoVenta | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getMisPedidosVenta(getAccessTokenSilently);
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
    let nombre = "";
    let color = "";

    switch (estado) {
      case Estado.PENDIENTE:
        nombre = "Pendiente";
        color = "#ff6609"; 
        break;
      case Estado.PREPARACION:
        nombre = "En Preparación";
        color = "#2196f3"; 
        break;
      case Estado.RECHAZADO:
        nombre = "Rechazado";
        color = "#f44336"; 
        break;
      case Estado.EN_DELIVERY:
        nombre = "En Camino";
        color = "#ffeb3b"; 
        break;
      case Estado.ENTREGADO:
        nombre = "Entregado";
        color = "#4CAF50"; 
        break;
      case Estado.CANCELADO:
        nombre = "Cancelado";
        color = "#f44336"; 
        break;
      default:
        nombre = Estado[estado]; 
        color = "#777";
    }
    return <span style={{ color, fontWeight: "bold" }}>{nombre}</span>;
  };

  const handleDownloadFactura = async (facturaId: number) => {
    try {
      setIsLoading(true);
      await descargarFacturaPDF(facturaId, `factura-${facturaId}.pdf`);
    } catch (error) {
      console.error(error);
      alert("No se pudo descargar la factura. Intente nuevamente más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadNotaCredito = async (facturaId: number) => {
    try {
      setIsLoading(true);
      await descargarNotaCreditoPDF(facturaId, `nota-credito-${facturaId}.pdf`);
    } catch (error) {
      console.error(error);
      alert("No se pudo descargar la nota de crédito. Intente nuevamente más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const numeroColumnasTabla = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPedidos = pedidos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(pedidos.length / itemsPerPage);

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.titleBox}>
            <h2 className={styles.title}>MIS PEDIDOS</h2>
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Nro. Pedido</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentPedidos.length === 0 ? ( 
              <tr>
                <td colSpan={numeroColumnasTabla} className={styles.noData}>
                  Aún no tenés pedidos
                </td>
              </tr>
            ) : (
              currentPedidos.map((order) => ( 
                <tr key={order.id}>
                  <td>{formatearFechaHora(order)}</td>
                  <td>#{order.id}</td>
                  <td>{formatoARS.format(order.totalVenta)}</td>
                  <td>{renderEstado(order.estado)}</td>
                  <td className={styles.actions}>
                    <button className={styles.viewBtn} onClick={() => handleViewOrder(order)}>Ver detalle</button>

                      {order.estado === Estado.CANCELADO ? (
                        <button
                          disabled={isLoading}
                          onClick={() => {
                              const facturaId = order.facturas[order.facturas.length - 1].id;
                              if (facturaId !== undefined) {
                                handleDownloadNotaCredito(facturaId);
                              } else {
                                alert("ID de factura no disponible");
                              }
                          }}
                          className={styles.docButton}
                        >
                          Nota de crédito
                        </button>
                      ) : order.estado===Estado.ENTREGADO?(
                        <button
                          disabled={isLoading}
                          onClick={() => {
                            const facturaId = order.facturas[0]?.id;
                            if (facturaId !== undefined) {
                              handleDownloadFactura(facturaId);
                            } else {
                              alert("ID de factura no disponible");
                            }
                          }}
                          className={styles.docButton}
                        >
                          Factura
                        </button>
                      ):null }
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && ( 
        <div className={styles.paginationControls}>
          {renderPaginationButtons()}
        </div>
      )}

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