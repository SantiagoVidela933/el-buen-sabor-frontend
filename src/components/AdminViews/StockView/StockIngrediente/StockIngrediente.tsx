import { useEffect, useState } from "react";
import styles from "./StockIngrediente.module.css";
import StockIngredienteForm from "./StockIngredienteForm/StockIngredienteForm";
import { ArticuloInsumo } from "../../../../models/ArticuloInsumo";
import {
  darDeAltaArticuloInsumo,
  darDeBajaArticuloInsumo,
  getAllArticuloInsumo,
} from "../../../../api/articuloInsumo";
import Modal from "../../../ui/Modal/Modal";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

export default function StockIngrediente() {
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<"crear" | "editar">("crear");
  const [selectedInsumo, setSelectedInsumo] = useState<ArticuloInsumo | undefined>(undefined);
  const [insumoAEliminar, setInsumoAEliminar] = useState<ArticuloInsumo | null>(null);
  const [busqueda, setBusqueda] = useState("");

  // --- Lógica de Paginación ---
  const insumosPorPagina = 8; // Define cuántos insumos mostrar por página
  const [paginaActual, setPaginaActual] = useState(1); // Estado para controlar la página actual

  useEffect(() => {
    fetchInsumos();
  }, []);

  // Resetear la página actual a 1 cuando el filtro de búsqueda cambia
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  const fetchInsumos = async () => {
    const data = await getAllArticuloInsumo();
    // Ordenar insumos: activos primero, luego los de baja.
    const ordenados = [...data].sort((a, b) => {
      if (!a.fechaBaja && b.fechaBaja) return -1; // a es activo, b es de baja -> a va primero
      if (a.fechaBaja && !b.fechaBaja) return 1;  // a es de baja, b es activo -> b va primero
      return 0; // Si ambos son activos o ambos son de baja, mantener el orden relativo
    });
    setInsumos(ordenados);
    setPaginaActual(1); // Siempre ir a la primera página al recargar los datos
  };

  const manejarSubmit = (insumoActualizado: ArticuloInsumo) => {
    // Después de crear/editar, refetch para asegurar el orden y la frescura de los datos.
    fetchInsumos();
    setModalOpen(false);
    // No es necesario setPaginaActual(1) aquí si fetchInsumos ya lo hace.
  };

  const abrirCrear = () => {
    setModoFormulario("crear");
    setSelectedInsumo(undefined);
    setModalOpen(true);
  };

  const abrirEditar = (insumo: ArticuloInsumo) => {
    setModoFormulario("editar");
    setSelectedInsumo(insumo);
    setModalOpen(true);
  };

  // Abrir confirmación para baja lógica
  const abrirConfirmDarDeBaja = (insumo: ArticuloInsumo) => {
    setInsumoAEliminar(insumo);
    setModalConfirmOpen(true);
  };

  // Confirmar baja lógica
  const confirmarDarDeBaja = async () => {
    if (!insumoAEliminar) return;
    try {
      await darDeBajaArticuloInsumo(insumoAEliminar.id!);
      // Actualizar el estado local para reflejar el cambio sin recargar todo el fetch.
      setInsumos(prev =>
        prev.map(i =>
          i.id === insumoAEliminar.id
            ? { ...i, fechaBaja: new Date().toISOString() } as ArticuloInsumo
            : i
        ).sort((a, b) => { // Re-ordenar después del cambio de estado
            if (!a.fechaBaja && b.fechaBaja) return -1;
            if (a.fechaBaja && !b.fechaBaja) return 1;
            return 0;
        })
      );
      setModalConfirmOpen(false);
      setInsumoAEliminar(null);
      // Asegurarse de que la paginación no se rompa si el último elemento de la página es dado de baja
      // y la página se queda vacía.
      if (insumosPaginados.length === 1 && paginaActual > 1 && totalPaginas === paginaActual) {
        setPaginaActual(paginaActual - 1);
      }

      Swal.fire({
        title: "Dado de baja!",
        text: "El registro ha sido exitosamente dado de baja.",
        icon: "success"
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Error al dar de baja el insumo.`
      });
    }
  };

  const cancelarDarDeBaja = () => {
    setModalConfirmOpen(false);
    setInsumoAEliminar(null);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    fetchInsumos(); // Recargar datos para asegurar la consistencia y ordenamiento
  };

  // Alta lógica sin confirmación
  const handleDarDeAlta = async (id: number) => {
    try {
      await darDeAltaArticuloInsumo(id);
      // Actualizar el estado local para reflejar el cambio.
      setInsumos(prev =>
        prev.map(i =>
          i.id === id
            ? { ...i, fechaBaja: null } as ArticuloInsumo
            : i
        ).sort((a, b) => { // Re-ordenar después del cambio de estado
            if (!a.fechaBaja && b.fechaBaja) return -1;
            if (a.fechaBaja && !b.fechaBaja) return 1;
            return 0;
        })
      );

      Swal.fire({
        icon: "success",
        title: "Insumo dado de alta exitosamente!",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Error al dar de alta el insumo.`
      });
    }
  };

  const insumosFiltrados = insumos.filter((i) =>
    i.denominacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  // --- Cálculos para la paginación ---
  const totalPaginas = Math.ceil(insumosFiltrados.length / insumosPorPagina);
  const insumosPaginados = insumosFiltrados.slice(
    (paginaActual - 1) * insumosPorPagina,
    paginaActual * insumosPorPagina
  );

  const cambiarPagina = (numero: number) => {
    setPaginaActual(numero);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.titleBox}>
            <h2 className={styles.title}>INGREDIENTES</h2>
          </div>
          <button className={styles.addBtn} onClick={abrirCrear}>
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        <div className={styles.searchBar}>
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Denominación</th>
            <th>Stock</th>
            <th>Unidad</th>
            <th>Precio Compra</th>
            <th>Es para Elaborar</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {insumosPaginados.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>No hay ingredientes que coincidan con la búsqueda.</td>
            </tr>
          ) : (
            insumosPaginados.map((i) => (
              <tr key={i.id} className={i.fechaBaja ? styles.filaBaja : ''}>
                <td>{i.denominacion}</td>
                <td>{i.stockPorSucursal[0].stockActual}</td>  
                <td>{i.unidadMedida.denominacion}</td>
                <td>${i.precioCompra}</td>
                <td>{i.esParaElaborar ? "Sí" : "No"}</td>
                <td>{i.fechaBaja ? "Baja" : "Alta"}</td>
                <td>
                  {i.fechaBaja ? (
                    <button onClick={() => handleDarDeAlta(i.id!)} title="Reactivar" className={styles.reactivarBtn}>
                      <span className="material-symbols-outlined">restart_alt</span>
                    </button>
                  ) : (
                    <>
                      <button onClick={() => abrirEditar(i)} title="Editar" className={styles.editBtn}>
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button onClick={() => abrirConfirmDarDeBaja(i)} title="Dar de baja" className={styles.deleteBtn}>
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPaginas > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              className={`${styles.paginationButton} ${
                paginaActual === i + 1 ? styles.activePage : ""
              }`}
              onClick={() => cambiarPagina(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal onClose={cerrarModal}>
          <StockIngredienteForm
            modo={modoFormulario}
            ingrediente={selectedInsumo}
            onClose={cerrarModal}
            onSubmit={manejarSubmit}
          />
        </Modal>
      )}

      {modalConfirmOpen && (
        <Modal onClose={cancelarDarDeBaja}>
          <div className={styles.confirmation}>
            <h3>¿Estás seguro?</h3>
            <p>
              ¿Seguro querés dar de baja <strong>{insumoAEliminar?.denominacion}</strong>?
            </p>
            <div className={styles.confirmationButtons}>
              <button className={styles.confirmBtn} onClick={confirmarDarDeBaja}>
                Aceptar
              </button>
              <button className={styles.cancelBtn} onClick={cancelarDarDeBaja}>
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}