import { Ingredient } from '../../../../../models/Products/Ingredient/Ingredient';
import styles from './StockIngredienteForm.module.css';

interface StockIngredienteFormProps {
  ingrediente?: Ingredient;
  modo: 'crear' | 'editar';
  onClose: () => void;
  onSubmit: (ingredienteActualizado: Ingredient) => void;
}

const StockIngredienteForm = ({ ingrediente, onClose, modo }: StockIngredienteFormProps) => {
  return (
    <form className={styles.formContainer}>
      <h2>{modo === 'crear' ? 'Crear Ingrediente' : 'Modificar Ingrediente'}</h2>

      <div className={styles.fieldsGrid}>
        <div className={styles.fieldGroup}>
          <label>Nombre</label>
          <input type="text" defaultValue={ingrediente?.title || ''} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Rubro</label>
          <select defaultValue={ingrediente?.ingredientCategory.title || ''}>
            <option value="">-- Selecciona un rubro --</option>
            <option value="">Hamburguesa</option>
            <option value="">Pancho</option>
            <option value="">Bebida</option>
            <option value="">Papas Fritas</option>
            <option value="">Pizza</option>
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label>Stock Mínimo</label>
          <input type="number" defaultValue={ingrediente?.minStock || ''} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Stock Actual</label>
          <input type="number" defaultValue={ingrediente?.currentStock || ''} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Precio de costo</label>
          <input type="number" defaultValue={ingrediente?.price || ''} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Estado</label>
          <select defaultValue={ingrediente?.available ? "Alta" : "Baja"}>
            <option value="Alta">Alta</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
      </div>

      <div className={styles.buttonActions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
        <button type="submit" className={styles.saveBtn}>Guardar</button>
      </div>
    </form>
  );
};

export default StockIngredienteForm;
