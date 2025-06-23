import { useEffect, useState } from 'react';
import styles from './Promociones.module.css';
import { Promocion } from '../../../models/Promocion';
import { darDeAltaPromocion, deletePromocion, getPromociones, updatePromocion } from '../../../api/promociones';
import PromocionesForm from './PromocionesForm/PromocionesForm';
import Modal from '../../ui/Modal/Modal';

const Promociones = () => {
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

  // const eliminarPromocion = async () => {
  //   if (!promocion) return;

  //   try {
  //     setPromocion(prev =>
  //       prev.map(rubro =>
  //         rubro.id === promocionAEliminar?.id
  //           ? { ...rubro, fechaBaja: new Date().toISOString() } // simulamos baja lógica si tenés esa propiedad
  //           : rubro
  //       )
  //     );

  //     setPromocionAEliminar(null);
  //     setModalConfirmacionAbierto(false);
  //   } catch (error) {
  //     console.error("Error al eliminar categoría:", error);
  //     alert("No se pudo eliminar la categoría.");
  //   }
  // };

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
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
          alert(`Error al eliminar el producto: ${error.message}`);
        } else {
          console.error('Error desconocido', error);
          alert('Ocurrió un error al eliminar el producto.');
        }
      }
    }
  };

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
    } catch (error) {
      console.error(error);
      alert('Error al dar de alta el artículo');
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

  // const handleDarDeAlta = async (rubro: Promocion) => {
  //   try {
  //     const payload = {
  //       denominacion: rubro.denominacion,
  //       categoriaPadreId: 3,
  //       sucursalId: rubro.sucursal?.id ?? 1,
  //       fechaBaja: null,
  //     };

  //     const actualizado = await updatePromocion(rubro.id!, payload);

  //   //   setpromocion(prev =>
  //   //     prev.map(r =>
  //   //       r.id === rubro.id ? actualizado : r
  //   //     )
  //   //   );
  //   } catch (error) {
  //     console.error("Error al dar de alta el rubro:", error);
  //     alert("Error al dar de alta el rubro");
  //   }
  // };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Promociones</h2>
        <button className={styles.addBtn} onClick={abrirCrearPromocion}>
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
            <th>Promoción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {promocionFiltrados.map((promocion, index) => (
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
        </tbody>
      </table>

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
            <p>¿Deseás eliminar la categoría <strong>{promocionAEliminar?.denominacion}</strong>?</p>
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
