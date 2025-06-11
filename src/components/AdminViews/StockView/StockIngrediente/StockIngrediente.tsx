import styles from "./StockIngrediente.module.css";
import { useEffect, useState } from "react";
import StockIngredienteForm from "./StockIngredienteForm/StockIngredienteForm";
import { ArticuloInsumo } from "../../../../models/ArticuloInsumo";
import { deleteArticuloInsumo, getAllArticuloInsumo } from "../../../../api/articuloInsumo";
import Modal from "../../../ui/Modal/Modal";

export default function StockIngrediente() {
 const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
  const [selectedInsumo, setSelectedInsumo] = useState<ArticuloInsumo | undefined>(undefined);
  const [insumoAEliminar, setInsumoAEliminar] = useState<ArticuloInsumo | null>(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchInsumos();
  }, []);

  const fetchInsumos = async () => {
    const data = await getAllArticuloInsumo();
    setInsumos(data);
  };

  const manejarSubmit = (insumoActualizado: ArticuloInsumo) => {
    if (modoFormulario === 'crear') {
      setInsumos(prev => [...prev, insumoActualizado]);
    } else {
      setInsumos(prev => prev.map(i => i.id === insumoActualizado.id ? insumoActualizado : i));
    }
    setModalOpen(false);
  };

  const abrirCrear = () => {
    setModoFormulario('crear');
    setSelectedInsumo(undefined);
    setModalOpen(true);
  };

  const abrirEditar = (insumo: ArticuloInsumo) => {
    setModoFormulario('editar');
    setSelectedInsumo(insumo);
    setModalOpen(true);
  };

  const abrirConfirmEliminar = (insumo: ArticuloInsumo) => {
    setInsumoAEliminar(insumo);
    setModalConfirmOpen(true);
  };

  const confirmarEliminar = async () => {
    if (!insumoAEliminar) return;
    try {
      await deleteArticuloInsumo(insumoAEliminar.id);
      setInsumos(prev => prev.filter(i => i.id !== insumoAEliminar.id));
      setModalConfirmOpen(false);
      setInsumoAEliminar(null);
    } catch (error) {
      alert('Error al eliminar el insumo');
      console.error(error);
    }
  };

  const cancelarEliminar = () => {
    setModalConfirmOpen(false);
    setInsumoAEliminar(null);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    fetchInsumos();
  };

  const insumosFiltrados = insumos.filter(i =>
    i.denominacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Stock de Ingredientes</h2>
        <button className={styles.addButton} onClick={abrirCrear}>
          +
        </button>
        <input 
          type="text"
          placeholder="Buscar..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Denominación</th>
            <th>Unidad</th>
            <th>Precio Compra</th>
            <th>Elaborar</th>
            <th>Sucursales</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {insumosFiltrados.map((i) => (
            <tr key={i.id}>
              <td>{i.denominacion}</td>
              <td>{i.unidadMedida.denominacion}</td>
              <td>${i.precioCompra}</td>
              <td>{i.esParaElaborar ? "Sí" : "No"}</td>
              <td>{i.stockPorSucursal.length}</td>
              <td>
                <button onClick={() => abrirEditar(i)}>Editar</button>
                <button onClick={() => abrirConfirmEliminar(i)}>Eliminar</button>
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
        <Modal onClose={cancelarEliminar}>
          <div>
            <p>¿Seguro querés eliminar <strong>{insumoAEliminar?.denominacion}</strong>?</p>
            <button onClick={confirmarEliminar}>Aceptar</button>
            <button onClick={cancelarEliminar}>Cancelar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
