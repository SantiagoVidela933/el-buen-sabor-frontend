import { ProductCategory } from '../../../../../models/Products/ProductCategory';
import styles from './RubroProductoForm.module.css';

interface RubroProductFormProps {
  rubro?: ProductCategory;
  modo: 'crear' | 'editar';
  onClose: () => void;
  onSubmit: (rubroActualizado: ProductCategory) => void;
}

const RubroProductForm = ({ rubro, onClose, modo }: RubroProductFormProps) => {
  return (
    <form className={styles.formContainer}>
      <h2>{modo === 'crear' ? 'Crear Rubro Producto' : 'Modificar Rubro Producto'}</h2>

      <div className={styles.fieldsGrid}>
        <div className={styles.fieldGroup}>
          <label>Nombre</label>
          <input type="text" defaultValue={rubro?.description || ''} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Rubro</label>
          <select defaultValue={rubro?.parentCategory?.description || ''}>
            <option value="">-- Selecciona un rubro --</option>
            <option value="">Hamburguesa</option>
            <option value="">Bebida</option>
            <option value="">Panchos</option>
            <option value="">Papas Fritas</option>
            <option value="">Bebidas</option>
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

export default RubroProductForm
