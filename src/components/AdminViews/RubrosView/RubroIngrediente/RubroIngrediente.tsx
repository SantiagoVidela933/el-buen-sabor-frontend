import { useState } from 'react';
import styles from './RubroIngrediente.module.css';
import Modal from '../../../ui/Modal/Modal';
import {
  vegetalesCategory,
  lacteosCategory,
  carnesCategory,
  panificadosCategory,
} from "../../../../data/ingredientCategory";
import { IngredientCategory } from '../../../../models/Products/Ingredient/IngredientCategory';
import RubroIngredienteForm from './RubroIngredienteForm/RubroIngredienteForm';

const rubrosIniciales: IngredientCategory[] = [
  vegetalesCategory,
  lacteosCategory,
  carnesCategory,
  panificadosCategory,
];

const RubroIngrediente = () => {

  const [rubros, setRubros] = useState<IngredientCategory[]>(rubrosIniciales);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
  const [rubroSeleccionado, setRubroSeleccionado] = useState<IngredientCategory | undefined>(undefined);

  const abrirCrearRubro = () => {
    setModoFormulario('crear');
    setRubroSeleccionado(undefined);
    setModalAbierto(true);
  };

  const abrirEditarRubro = (rubroIngrediente: IngredientCategory) => {
    setModoFormulario('editar');
    setRubroSeleccionado(rubroIngrediente);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const manejarSubmit = (rubroActualizado: IngredientCategory) => {
    if (modoFormulario === 'crear') {
      setRubros(prev => [...prev, rubroActualizado]);
    } else {
      setRubros(prev =>
        prev.map(rubro =>
          rubro.title === rubroSeleccionado?.title ? rubroActualizado : rubro
        )
      );
    }
    cerrarModal();
  };

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <h2 className={styles.title}>Ingredientes</h2>
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
            <td>{rubro.title}</td>
            <td>{rubro.parentCategory?.title}</td>  
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
          <RubroIngredienteForm
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

export default RubroIngrediente
