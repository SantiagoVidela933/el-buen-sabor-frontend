import styles from "./StockIngrediente.module.css";
import { useEffect, useState } from "react";
import StockIngredienteForm from "./StockIngredienteForm/StockIngredienteForm";
import { ArticuloInsumo } from "../../../../models/ArticuloInsumo";
import {
  darDeAltaArticuloInsumo,
  darDeBajaArticuloInsumo,
  getAllArticuloInsumo,
} from "../../../../api/articuloInsumo";
import Modal from "../../../ui/Modal/Modal";

export default function StockIngrediente() {
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<"crear" | "editar">("crear");
  const [selectedInsumo, setSelectedInsumo] = useState<ArticuloInsumo | undefined>(undefined);
  const [insumoAEliminar, setInsumoAEliminar] = useState<ArticuloInsumo | null>(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetchInsumos();
  }, []);

  const fetchInsumos = async () => {
    const data = await getAllArticuloInsumo();
    setInsumos(data);
  };

  const manejarSubmit = (insumoActualizado: ArticuloInsumo) => {
    if (modoFormulario === "crear") {
      setInsumos((prev) => [...prev, insumoActualizado]);
    } else {
      setInsumos((prev) => prev.map((i) => (i.id === insumoActualizado.id ? insumoActualizado : i)));
    }
    setModalOpen(false);
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

  // 👉 Abrir confirmación para baja lógica
  const abrirConfirmDarDeBaja = (insumo: ArticuloInsumo) => {
    setInsumoAEliminar(insumo);
    setModalConfirmOpen(true);
  };

  // 👉 Confirmar baja lógica
  const confirmarDarDeBaja = async () => {
    if (!insumoAEliminar) return;
    try {
      await darDeBajaArticuloInsumo(insumoAEliminar.id);
      fetchInsumos();
      setModalConfirmOpen(false);
      setInsumoAEliminar(null);
    } catch (error) {
      alert("Error al dar de baja el insumo");
      console.error(error);
    }
  };

  const cancelarDarDeBaja = () => {
    setModalConfirmOpen(false);
    setInsumoAEliminar(null);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    fetchInsumos();
  };

  // 👉 Alta lógica sin confirmación
  const handleDarDeAlta = async (id: number) => {
    try {
      await darDeAltaArticuloInsumo(id);
      fetchInsumos();
    } catch (error) {
      alert("Error al reactivar el insumo");
      console.error(error);
    }
  };

  const insumosFiltrados = insumos.filter((i) =>
    i.denominacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Ingredientes</h2>
        <button className={styles.addBtn} onClick={abrirCrear}>
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      <div className={styles.searchBar}>
        <span className="material-symbols-outlined">search</span>
        <input
          type="text"
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Denominación</th>
            <th>Unidad</th>
            <th>Precio Compra</th>
            <th>Elaborar</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {insumosFiltrados.map((i) => (
            <tr key={i.id} className={i.fechaBaja ? styles.filaBaja : ''}> 
              <td>{i.denominacion}</td>
              <td>{i.unidadMedida.denominacion}</td>
              <td>${i.precioCompra}</td>
              <td>{i.esParaElaborar ? "Sí" : "No"}</td>
              <td>
                {i.fechaBaja ? (
                  <button onClick={() => handleDarDeAlta(i.id)} title="Reactivar" className={styles.reactivarBtn}>
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
          ))}
        </tbody>
      </table>

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
