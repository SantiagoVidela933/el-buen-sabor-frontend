import React, { useState, useEffect } from "react";
import styles from "./TableView.module.css";
import Modal from "../ui/Modal/Modal";
import UserOrderDetail from "../User/UserOrdetDetail/UserOrderDetail";
import { PedidoVenta } from "../../models/PedidoVenta";
import { getPedidosVentas } from "../../api/pedidoVenta";
import { Estado } from "../../models/enums/Estado";
import { descargarFacturaPDF } from "../../api/factura";

interface TableProps {
  onBack: () => void;
}

export function Table({onBack}: TableProps) {
  const [search, setSearch] = useState("");
  const [pedidos, setPedidos] = useState<PedidoVenta[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PedidoVenta | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEstadoMenu, setShowEstadoMenu] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState<Estado | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const estadoLabels: Record<Estado, string> = {
    [Estado.PREPARACION]: "En cocina",
    [Estado.PENDIENTE]: "A confirmar",
    [Estado.CANCELADO]: "Cancelado",
    [Estado.RECHAZADO]: "Rechazado",
    [Estado.ENTREGADO]: "Entregado",
  };

  // GET Pedidos de Venta
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getPedidosVentas();
        console.log("Pedidos: ",data);
        setPedidos(data);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      }
    };
    fetchPedidos();
  }, []);

  const handleViewOrder = (order: PedidoVenta) => {
    setSelectedOrder(order);
    setShowModal(true);
  };
  
  const formatoARS = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });
  
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

  // Buscar por número de pedido
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const pedidosFiltrados = pedidos
    .filter((pedido) =>
      search.trim() === "" || pedido.id.toString() === search.trim()
    )
    .filter((pedido) =>
      estadoFiltro === null ? true : pedido.estado === estadoFiltro
    );
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>CAJERO</h2>
      <div className={styles.searchFilterContainer}>
        <div className={styles.estadoFilter}>
          <button
            onClick={() => setShowEstadoMenu(!showEstadoMenu)}
            className={styles.estadoButton}
          >
            Estado ▾
          </button>
          {showEstadoMenu && (
            <div className={styles.estadoDropdown}>
              {Object.entries(estadoLabels).map(([key, label]) => (
                <div
                  key={key}
                  className={styles.estadoOption}
                  onClick={() => {
                    setEstadoFiltro(key as Estado);
                    setShowEstadoMenu(false);
                  }}
                >
                  {label}
                </div>
              ))}
              <div
                className={styles.estadoOption}
                onClick={() => {
                  setEstadoFiltro(null);
                  setShowEstadoMenu(false);
                }}
              >
                Ver todos
              </div>
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Buscar número de pedido"
          value={search}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
              <th>Fecha y Hora</th>
              <th>Nro pedido</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
        </thead>
        <tbody >
            {pedidosFiltrados.map((order) => (
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
                  <td>{estadoLabels[order.estado]}</td>
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
              ))}
          </tbody>
      </table>

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
}

export default Table;