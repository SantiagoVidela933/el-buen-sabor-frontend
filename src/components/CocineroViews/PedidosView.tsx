import React, { useState } from "react";
import styles from "./PedidosView.module.css";
import Modal from "../ui/Modal/Modal";
import { PedidoCocinero } from "../../models/Orders/PedidoCocinero";
import PedidoDetalle from "./PedidosDetalle/PedidoDetalle";
export type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (item: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  title?: string;
  itemsPerPage?: number;
};

export function PedidosView({
  columns,
  data,
  title,
  itemsPerPage = 5,
}: TableProps<PedidoCocinero>) {
  const [selectedPedido, setSelectedPedido] = useState<PedidoCocinero | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [estadoFiltro, setEstadoFiltro] = useState<string | null>(null);
  const [showEstadoMenu, setShowEstadoMenu] = useState(false);

  // Filtrado por texto
  /*const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  // Filtrado por texto y por estado
  const filteredData = data.filter((item) => {
    const matchesSearch = Object.values(item).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    );
    const matchesEstado = estadoFiltro ? item.estado === estadoFiltro : true;
    return matchesSearch && matchesEstado;
  });*/

  const filteredData = data.filter((item) => {
    if (!search.trim()) return true;
    return String(item.pedido) === search.trim();
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

  const [modalOpen, setModalOpen] = useState(false);

  const handleVerDetalle = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}

      <div className={styles.searchFilterContainer}>
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
                    onClick={() => {
                      setSelectedPedido(row);
                      setModalOpen(true);
                    }}
                  >
                    Ver detalle
                  </button>
                </td>{" "}
                {/* Nuevo botón de detalle */}
                <td>
                  <div className={styles.actions}>
                    <button className={`${styles.btn} ${styles.masmin}`}>
                      + 10 min
                    </button>
                    <button className={`${styles.btn} ${styles.listo}`}>
                      Listo
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

      {modalOpen && selectedPedido && (
        <Modal onClose={() => setModalOpen(false)}>
          <PedidoDetalle pedido={selectedPedido} />
        </Modal>
      )}
    </div>
  );
}

export default PedidosView;
