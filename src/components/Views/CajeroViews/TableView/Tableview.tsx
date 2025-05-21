import React, { useState, useMemo } from "react";
import styles from "./TableView.module.css";
import Modal from "../../../../components/ui/Modal/Modal"; // Asegúrate de que la ruta sea correcta
import DetallePedidoView from "../../../../components/Views/CajeroViews/DetallePedidoView/DetallePedidoView"; // Importa el nuevo componente

// Importa tu clase Order
import { Order } from '../../../../models/Orders/Order'; // Asegúrate de que la ruta sea correcta

export type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (item: T) => React.ReactNode;
};

// Tipo genérico para la tabla, extendido para incluir la propiedad 'orderStatus'
type TableProps<T extends { orderStatus: string; }> = { // Extendemos T para asegurar que 'orderStatus' es una propiedad
  columns: Column<T>[];
  data: T[];
  title?: string;
  itemsPerPage?: number;
};

// Modificamos la función Table para que acepte el tipo Order
export function Table<T extends Order>({ // Usamos Order como el tipo de T
  columns,
  data,
  title,
  itemsPerPage = 5,
}: TableProps<T>) { // El tipo de T ahora es Order, que ya incluye orderStatus
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [estadoFiltro, setEstadoFiltro] = useState<string | null>(null);
  const [showEstadoMenu, setShowEstadoMenu] = useState(false);

  // Nuevos estados para controlar el modal de detalle del pedido
  const [showDetallePedidoModal, setShowDetallePedidoModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Order | null>(null);

  // Filtrado por texto y por estado
  const filteredData = data.filter((item) => {
    // Buscar en todas las propiedades que sean strings o números, excluyendo objetos complejos como 'products'
    const matchesSearch = Object.keys(item).some(key => {
      const value = item[key as keyof Order];
      if (typeof value === 'string' || typeof value === 'number') {
        return String(value).toLowerCase().includes(search.toLowerCase());
      }
      return false;
    });

    // Filtro por estado del pedido
    const matchesEstado = estadoFiltro ? item.orderStatus === estadoFiltro : true;
    return matchesSearch && matchesEstado;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Función para abrir el modal de detalle del pedido
  const handleVerDetalle = (pedido: Order) => {
    setSelectedPedido(pedido);
    setShowDetallePedidoModal(true);
  };

  // Función para cerrar el modal de detalle del pedido
  const handleCloseDetallePedido = () => {
    setShowDetallePedidoModal(false);
    setSelectedPedido(null); // Limpiar el pedido seleccionado al cerrar
  };


  return (
    <div className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}

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
              {/* Estados basados en tu clase Order */}
              {["A confirmar", "En cocina", "En delivery", "Listo"].map(
                (estado) => (
                  <div
                    key={estado}
                    className={styles.estadoOption}
                    onClick={() => {
                      setEstadoFiltro(estado);
                      setShowEstadoMenu(false);
                      setPage(1); // Resetear página al cambiar filtro
                    }}
                  >
                    {estado}
                  </div>
                )
              )}
              <div
                className={styles.estadoOption}
                onClick={() => {
                  setEstadoFiltro(null);
                  setShowEstadoMenu(false);
                  setPage(1); // Resetear página al cambiar filtro
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
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
            <th>Detalle</th> {/* Nueva columna */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {currentData.length > 0 ? (
            currentData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.render ? col.render(row) : String(row[col.accessor])}
                  </td>
                ))}
                <td>
                  <button
                    className={styles.detalleButton}
                    onClick={() => handleVerDetalle(row)} // Pasa el pedido completo a la función
                  >
                    Ver detalle
                  </button>
                </td>{" "}
                <td>
                  <div className={styles.actions}>
                    {/* Botones de acciones, ajusta según la lógica que tengas para ellos */}
                    <button className={`${styles.btn} ${styles.cocina}`}>
                      A cocina
                    </button>
                    <button className={`${styles.btn} ${styles.pagar}`}>
                      Pagar
                    </button>
                    <button className={`${styles.btn} ${styles.verFactura}`}>
                      Ver factura
                    </button>
                    <button className={`${styles.btn} ${styles.anular}`}>
                      Anular
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 2} className={styles.noData}>
                No hay datos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`${styles.paginationButton} ${
                page === i + 1 ? styles.activePage : ""
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal para DetallePedidoView */}
      {showDetallePedidoModal && selectedPedido && (
        <Modal onClose={handleCloseDetallePedido}>
          <DetallePedidoView
            pedido={selectedPedido}
            onClose={handleCloseDetallePedido}
          />
        </Modal>
      )}
    </div>
  );
}

export default Table;