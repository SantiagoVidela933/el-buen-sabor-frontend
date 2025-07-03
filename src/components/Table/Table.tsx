import React, { useState } from "react";
import styles from "./Table.module.css";
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

export function Table<T extends Record<string, any>>({
  columns,
  data,
  title,
  itemsPerPage = 5,
}: TableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [estadoFiltro, setEstadoFiltro] = useState<string | null>(null);
  const [showEstadoMenu, setShowEstadoMenu] = useState(false);

  const filteredData = data.filter((item) => {
    const matchesSearch = Object.values(item).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    );
    const matchesEstado = estadoFiltro ? item.estado === estadoFiltro : true;
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
              {["A confirmar", "En cocina", "En delivery", "Listo"].map(
                (estado) => (
                  <div
                    key={estado}
                    className={styles.estadoOption}
                    onClick={() => {
                      setEstadoFiltro(estado);
                      setShowEstadoMenu(false);
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
        
        <div className={styles.paginationInfo}>
          Página {page} de {totalPages || 1}
        </div>
      </div>

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
            <th>Detalle</th>
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
                  >
                    Ver detalle
                  </button>
                </td>{" "}
                <td>
                  <div className={styles.actions}>
                    <button className={`${styles.btn} ${styles.cocina}`}>
                      A cocina
                    </button>
                    <button className={`${styles.btn} ${styles.pagar}`}>
                      Pagar
                    </button>
                    <button className={`${styles.btn} ${styles.listo}`}>
                      Ver factura
                    </button>
                    <button className={`${styles.btn} ${styles.delivery}`}>
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
    </div>
  );
}
