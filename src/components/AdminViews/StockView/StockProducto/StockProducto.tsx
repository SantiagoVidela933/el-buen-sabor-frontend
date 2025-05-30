import { useEffect, useState } from 'react';
import styles from './StockProductos.module.css';
import Modal from '../../../ui/Modal/Modal';
import StockProductoForm from './StockProductoForm/StockProductoForm';
import { getAllArticulosManufacturados } from '../../../../api/articuloManufacturado';
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
  
  // Carga inicial de productos
  useEffect(() => {
    getAllArticulosManufacturados()
      .then(data => {
        setArticulos(data);
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
        setArticulos((prev) =>
          prev.filter((prod) => prod.id !== productoAEliminar.id)
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

  const articulosFiltrados = articulos.filter((producto)=>
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

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <h2 className={styles.title}>Productos</h2>
        <button className={styles.addBtn} onClick={abrirCrearProducto}>
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      <div className={styles.searchBar}>
        <span className="material-symbols-outlined">search</span>
        <input 
          type="text" 
          placeholder='Buscar por nombre...' 
          value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>
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
        {articulosFiltrados.map((producto, index) => (
          <tr key={index}>
            <td>{producto.denominacion}</td>
            <td>{producto.categoria?.denominacion ?? 'Sin categoría'}</td>
            <td>{producto.precioVenta}</td>  
            <td>{producto.tiempoEstimadoMinutos}</td>  
            <td>{producto.estado ? "Alta" : "Baja"}</td>
            <td>
              <button className={styles.editBtn} onClick={() => abrirEditarProducto(producto)}>
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => abrirModalEliminar(producto)}
              >
              <span className="material-symbols-outlined">delete</span>
              </button>
              
            </td>  
          </tr>
        ))}
        </tbody>
      </table>
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
