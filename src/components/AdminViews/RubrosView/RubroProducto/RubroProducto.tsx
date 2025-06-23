import React, { useEffect, useState } from 'react'; // Importar React explícitamente
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

  // --- Lógica de Paginación ---
  const rubrosPorPagina = 5; // Define cuántos rubros mostrar por página
  const [paginaActual, setPaginaActual] = useState(1); // Estado para controlar la página actual

  // Cargar rubros desde el backend al montar
  useEffect(() => {
    fetchRubros();
  }, []);

  // Resetear la página actual a 1 cuando el filtro de búsqueda cambia
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  const fetchRubros = async () => {
    const data = await getCategoriasMenuBySucursalId(1); // Asumiendo que 1 es el ID de sucursal
    // Ordenar rubros: activos primero, luego los de baja.
    const ordenados = [...data].sort((a, b) => {
      if (!a.fechaBaja && b.fechaBaja) return -1; // a es activo, b es de baja -> a va primero
      if (a.fechaBaja && !b.fechaBaja) return 1;  // a es de baja, b es activo -> b va primero
      return 0; // Si ambos son activos o ambos son de baja, mantener el orden relativo
    });
    console.log('Rubros ordenados:', ordenados); // Para depuración
    setRubros(ordenados);
    setPaginaActual(1); // Siempre ir a la primera página al recargar los datos
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
    fetchRubros(); // Recargar rubros al cerrar el modal de formulario para asegurar datos actualizados y ordenados
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
    if (!rubroAEliminar || !rubroAEliminar.id) return; // Asegurarse de que el ID exista

    try {
      await deleteCategoria(rubroAEliminar.id); // tu función fetch DELETE

      // Actualizar el estado local para reflejar la baja lógica
      setRubros(prev =>
        prev.map(rubro =>
          rubro.id === rubroAEliminar.id
            ? { ...rubro, fechaBaja: new Date().toISOString() } as CategoriaArticulo // Casteo explícito
            : rubro
        ).sort((a, b) => { // Re-ordenar después del cambio de estado
            if (!a.fechaBaja && b.fechaBaja) return -1;
            if (a.fechaBaja && !b.fechaBaja) return 1;
            return 0;
        })
      );

      setRubroAEliminar(null);
      setModalConfirmacionAbierto(false);
       // Asegurarse de que la paginación no se rompa si el último elemento de la página es dado de baja
      if (rubrosPaginados.length === 1 && paginaActual > 1 && totalPaginas === paginaActual) {
        setPaginaActual(paginaActual - 1);
      }
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      alert("No se pudo eliminar la categoría.");
    }
  };

  const manejarSubmit = (rubroActualizado: CategoriaArticulo) => {
    // Después de crear/editar, refetch para asegurar el orden y la frescura de los datos.
    fetchRubros();
    cerrarModal(); // Esto ya cierra el modal y llama a fetchRubros()
  };

  const handleDarDeAlta = async (rubro: CategoriaArticulo) => {
    try {
      // Asegurarse de que el ID y sucursal.id existan
      if (!rubro.id || !rubro.sucursal?.id) {
        console.error("ID de rubro o sucursal missing para dar de alta.");
        alert("Faltan datos para reactivar el rubro.");
        return;
      }

      const payload = {
        denominacion: rubro.denominacion,
        categoriaPadreId: rubro.categoriaPadre?.id ?? null, // Usar el ID de la categoría padre existente, si hay
        sucursalId: rubro.sucursal.id,
        fechaBaja: null,
      };

      const actualizado = await updateCategoria(rubro.id, payload);

      // Actualizar el estado local para reflejar el alta lógica
      setRubros(prev =>
        prev.map(r =>
          r.id === rubro.id
            ? { ...r, fechaBaja: null } as CategoriaArticulo // Casteo explícito
            : r
        ).sort((a, b) => { // Re-ordenar después del cambio de estado
            if (!a.fechaBaja && b.fechaBaja) return -1;
            if (a.fechaBaja && !b.fechaBaja) return 1;
            return 0;
        })
      );
    } catch (error) {
      console.error("Error al dar de alta el rubro:", error);
      alert("Error al dar de alta el rubro");
    }
  };

  const rubrosFiltrados = rubros.filter((rubro) =>
    rubro.denominacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  // --- Cálculos para la paginación ---
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
        {/* Estructura del encabezado consistente con StockIngrediente */}
        <div className={styles.titleGroup}>
          <div className={styles.titleBox}>
            <h2 className={styles.title}>CATEGORÍAS PRODUCTO</h2> {/* Nombre actualizado */}
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
            <th>Denominación</th> {/* Cambiado de 'Rubro' a 'Denominación' para ser más genérico */}
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
            rubrosPaginados.map((rubro) => ( // Usar rubrosPaginados
              <tr key={rubro.id} className={rubro.fechaBaja ? styles.filaBaja : ''}> {/* Usar rubro.id como key */}
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

      {/* Sección de Paginación */}
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