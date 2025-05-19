import { IngredientCategory } from '../../../../../models/Products/Ingredient/IngredientCategory';
import styles from './RubroIngredienteForm.module.css';

interface RubroIngredienteFormProps {
  rubro?: IngredientCategory;
  modo: 'crear' | 'editar';
  onClose: () => void;
  onSubmit: (rubroActualizado: IngredientCategory) => void;
}

const RubroIngredienteForm = ({ rubro, onClose, modo }: RubroIngredienteFormProps) => {
  return (
    <form className={styles.formContainer}>
      <h2>{modo === 'crear' ? 'Crear Rubro Ingrediente' : 'Modificar Rubro Ingrediente'}</h2>

      <div className={styles.fieldsGrid}>
        <div className={styles.fieldGroup}>
          <label>Nombre</label>
          <input type="text" defaultValue={rubro?.title || ''} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Rubro</label>
          <select defaultValue={rubro?.parentCategory?.title || ''}>
            <option value="">-- Selecciona un rubro --</option>
            <option value="">Vegetales</option>
            <option value="">Lacteos</option>
            <option value="">Carnes</option>
            <option value="">Panificados</option>
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label>Estado</label>
          <select defaultValue={rubro?.available ? "Alta" : "Baja"}>
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

export default RubroIngredienteForm
