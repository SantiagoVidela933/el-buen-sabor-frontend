import { useState } from 'react';
import styles from './RubroProducto.module.css';
import Modal from '../../../ui/Modal/Modal';
import {
  pizzaCategory,
  burgerCategory,
  panchoCategory,
  bebidaCategory,
  papasCategory,
} from "../../../../data/productCategories";
import RubroProductoForm from './RubroProductoForm/RubroProductoForm';
import { ProductCategory } from '../../../../models/Products/ProductCategory';

const rubrosProductosIniciales: ProductCategory[] = [
  pizzaCategory,
  burgerCategory,
  panchoCategory,
  bebidaCategory,
  papasCategory
];

const RubroProducto = () => {

  const [rubros, setRubros] = useState<ProductCategory[]>(rubrosProductosIniciales);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
  const [rubroSeleccionado, setRubroSeleccionado] = useState<ProductCategory | undefined>(undefined);

  const abrirCrearRubro = () => {
    setModoFormulario('crear');
    setRubroSeleccionado(undefined);
    setModalAbierto(true);
  };

  const abrirEditarRubro = (rubroProducto: ProductCategory) => {
    setModoFormulario('editar');
    setRubroSeleccionado(rubroProducto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const manejarSubmit = (rubroActualizado: ProductCategory) => {
    if (modoFormulario === 'crear') {
      setRubros(prev => [...prev, rubroActualizado]);
    } else {
      setRubros(prev =>
        prev.map(rubro =>
          rubro.description === rubroSeleccionado?.description ? rubroActualizado : rubro
        )
      );
    }
    cerrarModal();
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
        <input type="text" placeholder='Buscar por nombre...' />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Rubro</th>
            <th>Rubro Padre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {rubros.map((rubro, index) => (
          <tr key={index}>
            <td>{rubro.description}</td>
            <td>{rubro.parentCategory?.description}</td>  
            <td>{rubro.available}</td>  
            <td>
              <button className={styles.editBtn} onClick={() => abrirEditarRubro(rubro)}>
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
          <RubroProductoForm
            modo={modoFormulario}
            rubro={rubroSeleccionado}
            onClose={cerrarModal}
            onSubmit={manejarSubmit}
          />
        </Modal>
      )}
    </div>
  )
}

export default RubroProducto
