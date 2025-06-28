import { useEffect, useState } from 'react';
import styles from './Promociones.module.css';
import { Promocion } from '../../../models/Promocion';
import { darDeAltaPromocion, deletePromocion, getPromociones } from '../../../api/promociones';
import PromocionesForm from './PromocionesForm/PromocionesForm';
import Modal from '../../ui/Modal/Modal';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

const Promociones = () => {
  const promocionesPorPagina = 8;
  const [paginaActual, setPaginaActual] = useState(1);
  const [promocion, setPromocion] = useState<Promocion[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
  const [promocionSeleccionado, setPromocionSeleccionado] = useState<Promocion | undefined>(undefined);
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);
  const [promocionAEliminar, setPromocionAEliminar] = useState<Promocion | null>(null);
  const [busqueda, setBusqueda] = useState('');

  // Cargar promocion desde el backend al montar
  useEffect(() => {
    const fetchpromocion = async () => {
      const data = await getPromociones(); 
      console.log('Promociones:', data);
      setPromocion(data);
    };
    fetchpromocion();
  }, []);

  const abrirCrearPromocion = () => {
    setModoFormulario('crear');
    setPromocionSeleccionado(undefined);
    setModalAbierto(true);
  };

  const abrirEditarPromocion = (promocion: Promocion) => {
    setModoFormulario('editar');
    setPromocionSeleccionado(promocion);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  // Abrir modal DELETE
  const abrirModalEliminar = (producto: Promocion) => {
    setPromocionAEliminar(producto);
    setModalConfirmacionAbierto(true);
  };

  const cancelarEliminacion = () => {
    setPromocionAEliminar(null);
    setModalConfirmacionAbierto(false);
  };

  const eliminarPromocion = async () => {
    if (promocionAEliminar) {
      try {
        await deletePromocion(promocionAEliminar?.id);

        setPromocion(prev =>
          prev.map(promo =>
            promo.id === promocionAEliminar.id
              ? Promocion.fromJson({ ...promo, fechaBaja: new Date().toISOString() })
              : promo
          )
        );

        setPromocionAEliminar(null);
        setModalConfirmacionAbierto(false);

        Swal.fire({
          icon: "success",
          title: "Promoción dada de baja exitosamente!",
          showConfirmButton: false,
          timer: 1500
        });
      } catch (error) {
        if (error instanceof Error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Error al dar de baja la promocion: ${error.message}`
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Ocurrió un error al dar de baja la promocion.`
          });
        }
      }
    }
  };

  const promocionesFiltradas = promocion.filter((promo) =>
    promo.denominacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const cambiarPagina = (numero: number) => {
    setPaginaActual(numero);
  };

  // --- Cálculos para la paginación ---
  const totalPaginas = Math.ceil(promocionesFiltradas.length / promocionesPorPagina);
  const promocionesPaginadas = promocionesFiltradas.slice(
    (paginaActual - 1) * promocionesPorPagina,
    paginaActual * promocionesPorPagina
  );

  const handleDarDeAlta = async (id: number) => {
    try {
      await darDeAltaPromocion(id);

      setPromocion(prev =>
        prev.map(promo =>
          promo.id === id
            ? Promocion.fromJson({ ...promo, fechaBaja: null })
            : promo
        )
      );

      Swal.fire({
        icon: "success",
        title: "Promoción dada de alta exitosamente!",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Error al dar de alta la promocion.`
      });
    }
  };

  const promocionFiltrados = promocion.filter((promo)=> 
    promo.denominacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const manejarSubmit = (rubroActualizado: Promocion) => {
    if (modoFormulario === 'crear') {
      setPromocion(prev => [...prev, rubroActualizado]);
    } else {
      setPromocion(prev =>
        prev.map(rubro =>
          rubro.id === promocionSeleccionado?.id ? rubroActualizado : rubro
        )
      );
    }
    cerrarModal();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.titleBox}>
            <h2 className={styles.title}>PROMOCIONES</h2> {/* Texto en mayúsculas para consistencia */}
          </div>
          <button className={styles.addBtn} onClick={abrirCrearPromocion}>
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>


        <div className={styles.searchBar}>
          <span className="material-symbols-outlined">search</span>
          <input type="text" placeholder='Buscar por nombre...' value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>
        </div>
      </div>    

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Promoción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {promocionesPaginadas.map((promocion, index) => (
          <tr key={index} className={promocion.fechaBaja ? styles.filaBaja : ''}>
            <td>{promocion.denominacion}</td>
            <td>{promocion.fechaBaja ? "Baja" : "Alta"}</td>
            <td>
              {promocion.fechaBaja ? (
                <button
                  className={styles.reactivarBtn}
                  onClick={() => handleDarDeAlta(promocion.id!)}
                >
                  <span className="material-symbols-outlined">restart_alt</span>
                </button>
              ) : (
                <>
                  <button className={styles.editBtn} onClick={() => abrirEditarPromocion(promocion)}>
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button className={styles.deleteBtn} onClick={() => abrirModalEliminar(promocion)}>
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
        {promocionesPaginadas.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>No hay promociones que coincidan con la búsqueda.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* --- Sección de Paginación --- */}
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
          <PromocionesForm
            modo={modoFormulario}
            promocion={promocionSeleccionado}
            onClose={cerrarModal}
            onSubmit={manejarSubmit}
          />
        </Modal>

      )}
      {modalConfirmacionAbierto && (
        <Modal onClose={cancelarEliminacion}>
          <div className={styles.confirmation}>
            <h3>¿Estás seguro?</h3>
            <p>¿Deseás eliminar la promoción <strong>{promocionAEliminar?.denominacion}</strong>?</p>
            <div className={styles.confirmationButtons}>
              <button className={styles.confirmBtn} onClick={eliminarPromocion}>Aceptar</button>
              <button className={styles.cancelBtn} onClick={cancelarEliminacion}>Cancelar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Promociones;
