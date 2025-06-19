import { useEffect, useState } from 'react';
import styles from './StockProductos.module.css';
import Modal from '../../../ui/Modal/Modal';
import StockProductoForm from './StockProductoForm/StockProductoForm';
import { darDeAltaArticuloManufacturado, getAllArticulosManufacturados } from '../../../../api/articuloManufacturado';
import { ArticuloManufacturado } from '../../../../models/ArticuloManufacturado';
import { deleteArticuloManufacturado } from '../../../../api/articuloManufacturado';

const StockProducto = () => {
  // Estados de control de modales y formularios
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
  const [busqueda, setBusqueda] = useState('');

  // Estados de producto seleccionado y a eliminar
  const [productoSeleccionado, setArticuloseleccionado] = useState<ArticuloManufacturado | undefined>(undefined);
  const [productoAEliminar, setProductoAEliminar] = useState<ArticuloManufacturado | null>(null);

  // Lista de producto
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);

  // --- Lógica de Paginación ---
  const productosPorPagina = 8; // Define cuántos productos mostrar por página
  const [paginaActual, setPaginaActual] = useState(1); // Estado para controlar la página actual

  // Carga inicial de productos
  useEffect(() => {
    getAllArticulosManufacturados()
      .then(data => {
        setArticulos(data);
        setPaginaActual(1); // Resetear a la primera página al cargar nuevos artículos
      })
      .catch(error => {
        console.error('Error cargando artículos manufacturados:', error);
      });
  }, []);

  // Abrir modal POST
  const abrirCrearProducto = () => {
    setModoFormulario('crear');
    setArticuloseleccionado(undefined);
    setModalAbierto(true);
  };

  // Abrir modal PUT
  const abrirEditarProducto = (producto: ArticuloManufacturado) => {
    setModoFormulario('editar');
    setArticuloseleccionado(producto);
    setModalAbierto(true);
  };

  // Abrir modal DELETE
  const abrirModalEliminar = (producto: ArticuloManufacturado) => {
    setProductoAEliminar(producto);
    setModalConfirmacionAbierto(true);
  };

  // Confirmar DELETE
  const eliminarProducto = async () => {
    if (productoAEliminar) {
      try {
        await deleteArticuloManufacturado(productoAEliminar.id);

        setArticulos(prev =>
          prev.map(prod =>
            prod.id === productoAEliminar.id
              ? ArticuloManufacturado.fromJson({ ...prod, fechaBaja: new Date().toISOString() })
              : prod
          )
        );

        setProductoAEliminar(null);
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

  // Cancelar DELETE
  const cancelarEliminacion = () => {
    setProductoAEliminar(null);
    setModalConfirmacionAbierto(false);
  };

  // Cerrar modal general
  const cerrarModal = () => setModalAbierto(false);

  const articulosFiltrados = articulos.filter((producto) =>
    producto.denominacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Guardar cambios del formulario (crear o editar)
  const manejarSubmit = (productoActualizado: ArticuloManufacturado) => {
    if (modoFormulario === 'crear') {
      setArticulos(prev => [...prev, productoActualizado]);
    } else {
      setArticulos(prev =>
        prev.map(prod => prod.id === productoActualizado.id ? productoActualizado : prod)
      );
    }
    cerrarModal();
  };

  // Dar de alta un articulo manufacturado
  const handleDarDeAlta = async (id: number) => {
    try {
      await darDeAltaArticuloManufacturado(id);

      setArticulos(prev =>
        prev.map(prod =>
          prod.id === id
            ? ArticuloManufacturado.fromJson({ ...prod, fechaBaja: null })
            : prod
        )
      );
    } catch (error) {
      console.error(error);
      alert('Error al dar de alta el artículo');
    }
  };

  // --- Cálculos para la paginación ---
  const totalPaginas = Math.ceil(articulosFiltrados.length / productosPorPagina);
  const productosPaginados = articulosFiltrados.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );

  const cambiarPagina = (numero: number) => {
    setPaginaActual(numero);
  };

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        {/* Agrupando el título y el botón de añadir para aplicar estilos */}
        <div className={styles.titleGroup}>
          <div className={styles.titleBox}>
            <h2 className={styles.title}>PRODUCTOS</h2> {/* Texto en mayúsculas para consistencia */}
          </div>
          <button className={styles.addBtn} onClick={abrirCrearProducto}>
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        <div className={styles.searchBar}>
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder='Buscar por nombre...'
            value={busqueda} onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1); // Resetear a la primera página al cambiar el filtro
            }} />
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Rubro</th>
            <th>Precio</th>
            <th>Tiempo en cocina</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosPaginados.map((producto, index) => ( // Usamos productosPaginados
            <tr
              key={index}
              className={producto.fechaBaja ? styles.filaBaja : ''}
            >
              <td>{producto.denominacion}</td>
              <td>{producto.categoria?.denominacion ?? 'Sin categoría'}</td>
              <td>{producto.precioVenta}</td>
              <td>{producto.tiempoEstimadoMinutos}</td>
              <td>{producto.fechaBaja ? "Baja" : "Alta"}</td>
              <td>
                {producto.fechaBaja ? (
                  <button
                    className={styles.reactivarBtn}
                    onClick={() => handleDarDeAlta(producto.id)}
                  >
                    <span className="material-symbols-outlined">restart_alt</span>
                  </button>
                ) : (
                  <>
                    <button
                      className={styles.editBtn}
                      onClick={() => abrirEditarProducto(producto)}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => abrirModalEliminar(producto)}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {productosPaginados.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>No hay productos que coincidan con la búsqueda.</td>
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
          <StockProductoForm
            modo={modoFormulario}
            producto={productoSeleccionado}
            onClose={cerrarModal}
            onSubmit={manejarSubmit}
          />
        </Modal>
      )}
      {modalConfirmacionAbierto && (
        <Modal onClose={cancelarEliminacion}>
          <div className={styles.confirmation}>
            <h3>¿Estás seguro?</h3>
            <p>
              ¿Deseás eliminar el producto{" "}
              <strong>{productoAEliminar?.denominacion}</strong>?
            </p>
            <div className={styles.confirmationButtons}>
              <button className={styles.confirmBtn} onClick={eliminarProducto}>
                Aceptar
              </button>
              <button
                className={styles.cancelBtn}
                onClick={cancelarEliminacion}
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default StockProducto