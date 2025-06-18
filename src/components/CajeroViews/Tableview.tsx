import React, { useState, useEffect } from "react";
import styles from "./TableView.module.css";
import Modal from "../ui/Modal/Modal";
import UserOrderDetail from "../User/UserOrdetDetail/UserOrderDetail";
import { PedidoVenta } from "../../models/PedidoVenta";
import { cambiarEstadoPedidoVenta, getPedidosVentas } from "../../api/pedidoVenta";
import { Estado } from "../../models/enums/Estado";
import { TipoEnvio } from "../../models/enums/TipoEnvio";

export function Table() {
  const [search, setSearch] = useState("");
  const [pedidos, setPedidos] = useState<PedidoVenta[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PedidoVenta | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEstadoMenu, setShowEstadoMenu] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState<Estado | null>(null);

  const estadoLabels: Record<Estado, string> = {
    [Estado.PREPARACION]: "En cocina",
    [Estado.PENDIENTE]: "A confirmar",
    [Estado.CANCELADO]: "Cancelado",
    [Estado.RECHAZADO]: "Rechazado",
    [Estado.ENTREGADO]: "Entregado",
    [Estado.EN_DELIVERY]: "En delivery",
  };

  // GET Pedidos de Venta
  const fetchPedidos = async () => {
    try {
      const data = await getPedidosVentas();
      setPedidos(data);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    }
  };
  useEffect(() => {
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
  
  // Buscar por número de pedido
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const pedidosFiltrados = pedidos
    .filter((pedido) =>
      search.trim() === "" || pedido.id.toString().includes(search.trim())
    )
    .filter((pedido) =>
      estadoFiltro === null ? true : pedido.estado === estadoFiltro
    );

  const tieneManufacturados = (pedido: PedidoVenta): boolean => {
    return pedido.pedidosVentaDetalle.some(
      (detalle) => detalle.articulo?.tipoArticulo === "manufacturado"
    );
  };

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

                    {order.estado === Estado.PENDIENTE && (
                      <button
                        onClick={async () => {
                          try {
                            const nuevoEstado = tieneManufacturados(order)
                              ? Estado.PREPARACION
                              : Estado.ENTREGADO;

                            await cambiarEstadoPedidoVenta(order.id, nuevoEstado);
                            await fetchPedidos();
                          } catch (error) {
                            console.error("Error al cambiar estado:", error);
                          }
                        }}
                      >
                        {tieneManufacturados(order) ? "Enviar a cocina" : "Marcar como entregado"}
                      </button>
                    )}

                    {order.estado === Estado.PREPARACION && (
                      <>
                        {order.tipoEnvio === TipoEnvio.TAKE_AWAY && (
                          <button
                            disabled={order.facturas.length === 0}
                            onClick={async () => {
                              try {
                                await cambiarEstadoPedidoVenta(order.id, Estado.ENTREGADO);
                                await fetchPedidos();
                              } catch (error) {
                                console.error("Error al cambiar estado:", error);
                              }
                            }}
                          >
                            Marcar como entregado
                          </button>
                        )}

                        {order.tipoEnvio === TipoEnvio.DELIVERY && (
                          <button
                            disabled={order.facturas.length === 0}
                            onClick={async () => {
                              try {
                                const EN_DELIVERY = "EN_DELIVERY";
                                await cambiarEstadoPedidoVenta(order.id, EN_DELIVERY as Estado);
                                await fetchPedidos();
                              } catch (error) {
                                console.error("Error al cambiar estado:", error);
                              }
                            }}
                          >
                            Pasar a En delivery
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
      </table>
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