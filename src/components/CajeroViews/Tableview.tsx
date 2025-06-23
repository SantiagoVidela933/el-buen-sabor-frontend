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

  // --- Estados para paginación (Aunque no los uses directamente en el renderizado de paginación numérica, la lógica de filtrado los necesita) ---
  const [currentPage, setCurrentPage] = useState(1); // Necesario para el reseteo al filtrar/buscar
  const itemsPerPage = 5; // Define cuántos elementos quieres por página

  const estadoLabels: Record<Estado, string> = {
    [Estado.PREPARACION]: "En cocina",
    [Estado.PENDIENTE]: "A confirmar",
    [Estado.CANCELADO]: "Cancelado",
    [Estado.RECHAZADO]: "Rechazado",
    [Estado.ENTREGADO]: "Entregado",
    [Estado.EN_DELIVERY]: "En delivery",
    [Estado.LISTO]: "Listo"
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
    setCurrentPage(1); // Resetear a la primera página al buscar
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

  // --- Lógica de paginación para el filtrado ---
  const totalPages = Math.ceil(pedidosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPedidos = pedidosFiltrados.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Generar los botones de números de página
  const getPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${styles.paginationButton} ${
            currentPage === i ? styles.activePage : ""
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className={styles.container}>
      {/* HEADER: Título y barra de búsqueda/filtro */}
      <div className={styles.header}> {/* Añadido .header para el layout */}
        <div className={styles.titleGroup}> {/* Añadido .titleGroup para envolver el título */}
          <div className={styles.titleBox}> {/* Añadido .titleBox para el fondo del título */}
            <h2 className={styles.title}>CAJERO</h2>
          </div>
        </div>

        <div className={styles.searchFilterContainer}>
          {/* Filtro por estado */}
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
                      setCurrentPage(1); // Resetear a la primera página al cambiar filtro
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
                    setCurrentPage(1); // Resetear a la primera página al ver todos
                  }}
                >
                  Ver todos
                </div>
              </div>
            )}
          </div>
          {/* Barra de búsqueda */}
          <div className={styles.searchBar}> {/* Usamos .searchBar para el input */}
            <span className="material-symbols-outlined">search</span> {/* Icono de búsqueda */}
            <input
              type="text"
              placeholder="Buscar número de pedido..." 
              value={search}
              onChange={handleSearchChange}
              // className={styles.searchInput} <- Reemplazado por estilos en .searchBar input
            />
          </div>
        </div>
      </div> {/* Fin de .header */}

      {/* TABLA DE PEDIDOS */}
      <div className={styles.tableWrapper}>
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
          <tbody>
            {currentPedidos.length > 0 ? ( // Usamos currentPedidos para la paginación
              currentPedidos.map((order) => (
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
                    {/* Botón Ver Detalle - Ahora usa la clase .detailBtn */}
                    <button className={styles.detailBtn} onClick={() => handleViewOrder(order)}>Ver detalle</button>

                    {order.estado === Estado.PENDIENTE && (
                      <button
                        className={styles.btn} // Usa la clase .btn
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
                    {order.estado === Estado.LISTO && (
                      <>
                        {order.tipoEnvio === TipoEnvio.TAKE_AWAY && (
                          <button
                            className={styles.btn}
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
                            className={styles.btn}
                            disabled={order.facturas.length === 0}
                            onClick={async () => {
                              try {
                                await cambiarEstadoPedidoVenta(order.id, Estado.EN_DELIVERY);
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
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.noData}>
                  No hay pedidos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Controles de paginación numérica --- */}
      {pedidosFiltrados.length > 0 && totalPages > 1 && (
        <div className={styles.pagination}>
          {getPaginationButtons()}
        </div>
      )}

      {/* MODAL DE DETALLE DEL PEDIDO */}
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