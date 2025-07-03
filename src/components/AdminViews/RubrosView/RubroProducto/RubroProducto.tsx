import { useEffect, useState } from 'react'; // Importar React explícitamente
import styles from './RubroProducto.module.css';
import Modal from '../../../ui/Modal/Modal';
import RubroProductoForm from './RubroProductoForm/RubroProductoForm';
import { deleteCategoria, getCategoriasMenuBySucursalId, updateCategoria } from '../../../../api/articuloCategoria';
import { CategoriaArticulo } from '../../../../models/CategoriaArticulo';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

const RubroProducto = () => {
  const [rubros, setRubros] = useState<CategoriaArticulo[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
  const [rubroSeleccionado, setRubroSeleccionado] = useState<CategoriaArticulo | undefined>(undefined);
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);
  const [rubroAEliminar, setRubroAEliminar] = useState<CategoriaArticulo | null>(null);
  const [busqueda, setBusqueda] = useState('');

  const rubrosPorPagina = 8; 
  const [paginaActual, setPaginaActual] = useState(1); 

  useEffect(() => {
    fetchRubros();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  const fetchRubros = async () => {
    const data = await getCategoriasMenuBySucursalId(1); 
    const ordenados = [...data].sort((a, b) => {
      if (!a.fechaBaja && b.fechaBaja) return -1; 
      if (a.fechaBaja && !b.fechaBaja) return 1;  
      return 0; 
    });
    setRubros(ordenados);
    setPaginaActual(1); 
  };

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
    fetchRubros(); 
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
    if (!rubroAEliminar || !rubroAEliminar.id) return; 

    try {
      await deleteCategoria(rubroAEliminar.id);

      setRubros(prev =>
        prev.map(rubro =>
          rubro.id === rubroAEliminar.id
            ? { ...rubro, fechaBaja: new Date().toISOString() } as CategoriaArticulo 
            : rubro
        ).sort((a, b) => { 
            if (!a.fechaBaja && b.fechaBaja) return -1;
            if (a.fechaBaja && !b.fechaBaja) return 1;
            return 0;
        })
      );

      setRubroAEliminar(null);
      setModalConfirmacionAbierto(false);
      if (rubrosPaginados.length === 1 && paginaActual > 1 && totalPaginas === paginaActual) {
        setPaginaActual(paginaActual - 1);
      }

      Swal.fire({
        icon: "success",
        title: "Categoría dada de baja exitosamente!",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Error al dar de baja la categoría.`
      });
    }
  };

  const manejarSubmit = () => {
    fetchRubros();
    cerrarModal(); 
  };

  const handleDarDeAlta = async (rubro: CategoriaArticulo) => {
    try {
      if (!rubro.id) {
        console.error("ID de rubro o sucursal missing para dar de alta.");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Faltan datos para dar de alta la categoría.`
        });
        return;
      }

      const payload = {
        denominacion: rubro.denominacion,
        categoriaPadreId: rubro.categoriaPadre?.id ?? null, 
        sucursalId: rubro.sucursal?.id ?? 1, 
        fechaBaja: null,
      };

      await updateCategoria(rubro.id, payload);

      setRubros(prev =>
        prev.map(r =>
          r.id === rubro.id
            ? { ...r, fechaBaja: null } as CategoriaArticulo 
            : r
        ).sort((a, b) => {
            if (!a.fechaBaja && b.fechaBaja) return -1;
            if (a.fechaBaja && !b.fechaBaja) return 1;
            return 0;
        })
      );

      Swal.fire({
        icon: "success",
        title: "Categoría dada de alta exitosamente!",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Error al dar de alta la categoría`
      });
    }
  };

  const rubrosFiltrados = rubros.filter((rubro) =>
    rubro.denominacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(rubrosFiltrados.length / rubrosPorPagina);
  const rubrosPaginados = rubrosFiltrados.slice(
    (paginaActual - 1) * rubrosPorPagina,
    paginaActual * rubrosPorPagina
  );

  const cambiarPagina = (numero: number) => {
    setPaginaActual(numero);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.titleBox}>
            <h2 className={styles.title}>CATEGORÍAS PRODUCTO</h2>
          </div>
          <button className={styles.addBtn} onClick={abrirCrearRubro}>
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        <div className={styles.searchBar}>
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder='Buscar por nombre...'
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Denominación</th> 
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rubrosPaginados.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center' }}>No hay categorías que coincidan con la búsqueda.</td>
            </tr>
          ) : (
            rubrosPaginados.map((rubro) => ( 
              <tr key={rubro.id} className={rubro.fechaBaja ? styles.filaBaja : ''}>
                <td>{rubro.denominacion}</td>
                <td>{rubro.fechaBaja ? "Baja" : "Alta"}</td>
                <td>
                  {rubro.fechaBaja ? (
                    <button
                      className={styles.reactivarBtn}
                      onClick={() => handleDarDeAlta(rubro)}
                      title="Reactivar"
                    >
                      <span className="material-symbols-outlined">restart_alt</span>
                    </button>
                  ) : (
                    <>
                      <button className={styles.editBtn} onClick={() => abrirEditarRubro(rubro)} title="Editar">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button className={styles.deleteBtn} onClick={() => abrirModalEliminar(rubro)} title="Dar de baja">
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
            <p>¿Deseás dar de baja la categoría <strong>{rubroAEliminar?.denominacion}</strong>?</p> {/* Mensaje más claro */}
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