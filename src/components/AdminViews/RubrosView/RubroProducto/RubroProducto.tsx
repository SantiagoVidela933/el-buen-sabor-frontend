import { useEffect, useState } from 'react';
import styles from './RubroProducto.module.css';
import Modal from '../../../ui/Modal/Modal';
import RubroProductoForm from './RubroProductoForm/RubroProductoForm';
import { deleteCategoria, getCategoriasMenuBySucursalId, updateCategoria } from '../../../../api/articuloCategoria';
import { CategoriaArticulo } from '../../../../models/CategoriaArticulo';

const RubroProducto = () => {
  const [rubros, setRubros] = useState<CategoriaArticulo[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
  const [rubroSeleccionado, setRubroSeleccionado] = useState<CategoriaArticulo | undefined>(undefined);
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);
  const [rubroAEliminar, setRubroAEliminar] = useState<CategoriaArticulo | null>(null);
  const [busqueda, setBusqueda] = useState('');

  // Cargar rubros desde el backend al montar
  useEffect(() => {
    const fetchRubros = async () => {
      const data = await getCategoriasMenuBySucursalId(1); 
      console.log('Rubros:', data);
      setRubros(data);
    };
    fetchRubros();
  }, []);

  const abrirCrearRubro = () => {
    setModoFormulario('crear');
    setRubroSeleccionado(undefined);
    setModalAbierto(true);
  };

  const abrirEditarRubro = (rubroProducto: CategoriaArticulo) => {
    setModoFormulario('editar');
    setRubroSeleccionado(rubroProducto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const abrirModalEliminar = (rubro: CategoriaArticulo) => {
    setRubroAEliminar(rubro);
    setModalConfirmacionAbierto(true);
  };

  const cancelarEliminacion = () => {
    setRubroAEliminar(null);
    setModalConfirmacionAbierto(false);
  };

  const eliminarRubro = async () => {
    if (!rubroAEliminar) return;

    try {
      await deleteCategoria(rubroAEliminar.id!); // tu función fetch DELETE

      setRubros(prev =>
        prev.map(rubro =>
          rubro.id === rubroAEliminar.id
            ? { ...rubro, fechaBaja: new Date().toISOString() } // simulamos baja lógica si tenés esa propiedad
            : rubro
        )
      );

      setRubroAEliminar(null);
      setModalConfirmacionAbierto(false);
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      alert("No se pudo eliminar la categoría.");
    }
  };

  const rubrosFiltrados = rubros.filter((rubro)=> 
    rubro.denominacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const manejarSubmit = (rubroActualizado: CategoriaArticulo) => {
    if (modoFormulario === 'crear') {
      setRubros(prev => [...prev, rubroActualizado]);
    } else {
      setRubros(prev =>
        prev.map(rubro =>
          rubro.id === rubroSeleccionado?.id ? rubroActualizado : rubro
        )
      );
    }
    cerrarModal();
  };

  const handleDarDeAlta = async (rubro: CategoriaArticulo) => {
    try {
      const payload = {
        denominacion: rubro.denominacion,
        categoriaPadreId: 3,
        sucursalId: rubro.sucursal?.id ?? 1,
        fechaBaja: null,
      };

      const actualizado = await updateCategoria(rubro.id!, payload);

      setRubros(prev =>
        prev.map(r =>
          r.id === rubro.id ? actualizado : r
        )
      );
    } catch (error) {
      console.error("Error al dar de alta el rubro:", error);
      alert("Error al dar de alta el rubro");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Productos</h2>
        <button className={styles.addBtn} onClick={abrirCrearRubro}>
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      <div className={styles.searchBar}>
        <span className="material-symbols-outlined">search</span>
        <input type="text" placeholder='Buscar por nombre...' value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Rubro</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {rubrosFiltrados.map((rubro, index) => (
          <tr key={index} className={rubro.fechaBaja ? styles.filaBaja : ''}>
            <td>{rubro.denominacion}</td>
            <td>{rubro.fechaBaja ? "Baja" : "Alta"}</td>
            <td>
              {rubro.fechaBaja ? (
                <button
                  className={styles.reactivarBtn}
                  onClick={() => handleDarDeAlta(rubro)}
                >
                  <span className="material-symbols-outlined">restart_alt</span>
                </button>
              ) : (
                <>
                  <button className={styles.editBtn} onClick={() => abrirEditarRubro(rubro)}>
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button className={styles.deleteBtn} onClick={() => abrirModalEliminar(rubro)}>
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      {modalAbierto && (
        <Modal onClose={cerrarModal}>
          <RubroProductoForm
            modo={modoFormulario}
            rubro={rubroSeleccionado}
            onClose={cerrarModal}
            onSubmit={manejarSubmit}
          />
        </Modal>
      )}
      {modalConfirmacionAbierto && (
        <Modal onClose={cancelarEliminacion}>
          <div className={styles.confirmation}>
            <h3>¿Estás seguro?</h3>
            <p>¿Deseás eliminar la categoría <strong>{rubroAEliminar?.denominacion}</strong>?</p>
            <div className={styles.confirmationButtons}>
              <button className={styles.confirmBtn} onClick={eliminarRubro}>Aceptar</button>
              <button className={styles.cancelBtn} onClick={cancelarEliminacion}>Cancelar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RubroProducto;
