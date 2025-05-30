import { useEffect, useState } from 'react';
import styles from './StockProductos.module.css';
import Modal from '../../../ui/Modal/Modal';
import StockProductoForm from './StockProductoForm/StockProductoForm';
import { getAllArticulosManufacturados } from '../../../../api/articuloManufacturado';
import { ArticuloManufacturado } from '../../../../models/ArticuloManufacturado';
import { deleteArticuloManufacturado } from '../../../../api/articuloManufacturado';

const StockProducto = () => {

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
  const [productoSeleccionado, setArticuloseleccionado] = useState<ArticuloManufacturado | undefined>(undefined);
  const [productoAEliminar, setProductoAEliminar] = useState<ArticuloManufacturado | null>(null);
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);

  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  
  useEffect(() => {
    getAllArticulosManufacturados()
      .then(data => {
        console.log('Articulos cargados:', data);
        setArticulos(data);
      })
      .catch(error => {
        console.error('Error cargando artículos manufacturados:', error);
      });
  }, []);
  

  const abrirCrearProducto = () => {
    setModoFormulario('crear');
    setArticuloseleccionado(undefined);
    setModalAbierto(true);
  };

  const abrirEditarProducto = (producto: ArticuloManufacturado) => {
    setModoFormulario('editar');
    setArticuloseleccionado(producto);
    setModalAbierto(true);
  };
  const abrirModalEliminar = (producto: ArticuloManufacturado) => {
    setProductoAEliminar(producto);
    setModalConfirmacionAbierto(true);
  };

    const eliminarProducto = async () => {
    if (productoAEliminar) {
      try {
        console.log("ID a eliminar:", productoAEliminar.id);

        await deleteArticuloManufacturado(productoAEliminar.id);

        setArticulos((prev) =>
          prev.filter((prod) => prod.id !== productoAEliminar.id)
        );
        setProductoAEliminar(null);
        setModalConfirmacionAbierto(false);
      } catch (error: any) {
        console.error(error);
        alert(`Error al eliminar el producto: ${error.message}`);
      }
    }
  };


  const cancelarEliminacion = () => {
  setProductoAEliminar(null);
  setModalConfirmacionAbierto(false);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const manejarSubmit = (productoActualizado: ArticuloManufacturado) => {
    if (modoFormulario === 'crear') {
      setArticulos(prev => [...prev, productoActualizado]);
    } else {
      setArticulos(prev =>
        prev.map(prod =>
          prod.denominacion === productoSeleccionado?.denominacion ? productoActualizado : prod
        )
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
        <input type="text" placeholder='Buscar por nombre...' />
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
        {articulos.map((producto, index) => (
          <tr key={index}>
            <td>{producto.denominacion}</td>
            <td>{producto.categoria.denominacion}</td>
            <td>{producto.precioCosto}</td>  
            <td>{producto.tiempoEstimadoMinutos}</td>  
            <td>Alta o Baja</td>  
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
