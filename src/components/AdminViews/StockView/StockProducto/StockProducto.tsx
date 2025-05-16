import { useState } from 'react';
import { productosIniciales } from '../../../../data/product2';
import styles from './StockProductos.module.css';
import { Product } from '../../../../models/Products/Product';
import Modal from '../../../ui/Modal/Modal';
import StockProductoEditar from './StockProductoEditar/StockProductoEditar';

const StockProducto = () => {

  const [productos, setProductos] = useState<Product[]>(productosIniciales);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
  const [productoSeleccionado, setProductoSeleccionado] = useState<Product | undefined>(undefined);

  const abrirCrearProducto = () => {
    setModoFormulario('crear');
    setProductoSeleccionado(undefined);
    setModalAbierto(true);
  };

  const abrirEditarProducto = (producto: Product) => {
    setModoFormulario('editar');
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const manejarSubmit = (productoActualizado: Product) => {
    if (modoFormulario === 'crear') {
      setProductos(prev => [...prev, productoActualizado]);
    } else {
      setProductos(prev =>
        prev.map(prod =>
          prod.title === productoSeleccionado?.title ? productoActualizado : prod
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
            <th>Tiprodo en cocina</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {productos.map((producto, index) => (
          <tr key={index}>
            <td>{producto.title}</td>
            <td>{producto.productCategory.description}</td>
            <td>{producto.price}</td>  
            <td>{producto.cookingTime}</td>  
            <td>{producto.available}</td>  
            <td>
              <button className={styles.editBtn} onClick={() => abrirEditarProducto(producto)}>
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button className={styles.deleteBtn}>
                <span className="material-symbols-outlined">delete</span>
              </button>
            </td>  
          </tr>
        ))}
        </tbody>
      </table>
      {modalAbierto && (
        <Modal onClose={cerrarModal}>
          <StockProductoEditar
            producto={productoSeleccionado}
            onClose={cerrarModal}
            onSubmit={manejarSubmit}
          />
        </Modal>
      )}
    </div>
  )
}

export default StockProducto
