import { useEffect, useState } from 'react';
import { Ingredient } from '../../../../models/Products/Ingredient/Ingredient';
import styles from './StockIngrediente.module.css';
import Modal from '../../../ui/Modal/Modal';

import StockIngredienteForm from './StockIngredienteForm/StockIngredienteForm';
import { MeasurementUnit } from '../../../../models/Products/Ingredient/MeasurementUnit';
import { getInsumosBySucursalId } from '../../../../api/articuloInsumo';
import { ArticuloInsumo } from '../../../../models/ArticuloInsumo';
import { mapArticuloInsumoToIngredient } from '../../../../utils/mappers/articuloInsumoMapper';

const StockIngrediente = () => {

  const [ingredientes, setIngredientos] = useState<Ingredient[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
  const [ingredienteSeleccionado, setIngredientoSeleccionado] = useState<Ingredient | undefined>(undefined);

  const abrirCrearIngrediento = () => {
    setModoFormulario('crear');
    setIngredientoSeleccionado(undefined);
    setModalAbierto(true);
  };

  const abrirEditarIngrediento = (ingrediente: Ingredient) => {
    setModoFormulario('editar');
    setIngredientoSeleccionado(ingrediente);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const manejarSubmit = (ingredienteActualizado: Ingredient) => {
    if (modoFormulario === 'crear') {
      setIngredientos(prev => [...prev, ingredienteActualizado]);
    } else {
      setIngredientos(prev =>
        prev.map(prod =>
          prod.title === ingredienteSeleccionado?.title ? ingredienteActualizado : prod
        )
      );
    }
    cerrarModal();
  };

  useEffect(() => {
  async function fetchIngredientes() {
    const data: ArticuloInsumo[] = await getInsumosBySucursalId(1); // o la sucursal que corresponda
    const ingredientes: Ingredient[] = data.map(mapArticuloInsumoToIngredient);
    setIngredientos(ingredientes);
  }

  fetchIngredientes();
}, []);

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <h2 className={styles.title}>Ingredientes</h2>
        <button className={styles.addBtn} onClick={abrirCrearIngrediento}>
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
            <th>Ingrediente</th>
            <th>Rubro</th>
            <th>Precio</th>
            <th>Stock Minimo</th>
            <th>Stock Actual</th>
            <th>Unidad de Medida</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {ingredientes.map((ingrediente, index) => (
          <tr key={index}>
            <td>{ingrediente.title}</td>
            <td>{ingrediente.ingredientCategory.title}</td>
            <td>{ingrediente.price}</td>  
            <td>{ingrediente.minStock}</td>  
            <td>{ingrediente.currentStock}</td>  
            <td>{MeasurementUnit[ingrediente.measurementUnit]}</td>  
            <td>{ingrediente.available}</td>  
            <td>
              <button className={styles.editBtn} onClick={() => abrirEditarIngrediento(ingrediente)}>
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
          <StockIngredienteForm
            modo={modoFormulario}
            ingrediente={ingredienteSeleccionado}
            onClose={cerrarModal}
            onSubmit={manejarSubmit}
          />
        </Modal>
      )}
    </div>
  )
}

export default StockIngrediente
