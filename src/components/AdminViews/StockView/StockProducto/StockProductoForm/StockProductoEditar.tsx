import { Product } from '../../../../../models/Products/Product';
import styles from './StockProductoEditar.module.css';

interface StockProductoEditarProps {
  producto?: Product;
  onClose: () => void;
  onSubmit: (productoActualizado: Product) => void;
}

const StockProductoEditar = ({ producto }: StockProductoEditarProps) => {
  return (
    <form className={styles.formContainer}>
      <h2>Editar Nuevo Producto</h2>

      <div className={styles.fieldsGrid}>
        <div className={styles.fieldGroup}>
          <label>Nombre</label>
          <input type="text" defaultValue={producto?.title || ''} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Descripción</label>
          <input type="text" defaultValue={producto?.description || ''} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Tiempo en cocina</label>
          <input type="text" defaultValue={producto?.cookingTime || ''} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Precio de Venta</label>
          <input type="number" defaultValue={producto?.price || ''} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Rubro</label>
            <select  defaultValue={producto?.productCategory.description || ''}>
              <option value="">-- Selecciona un rubro --</option>
              <option value="">Hamburguesa</option>
              <option value="">Pancho</option>
              <option value="">Bebida</option>
              <option value="">Papas Fritas</option>
              <option value="">Pizza</option>
            </select>
        </div>

        <div className={styles.fieldGroup}>
          <label>Estado Alta Baja</label>
            <select  defaultValue={producto?.available || ''}>
              <option value="">Alta</option>
              <option value="">Baja</option>
            </select>
        </div>

        <div className={styles.buttonRecipe}>
          <label>Receta</label>
          <button type="button">Crear / Modificar receta</button>
        </div>

        <div className={styles.fieldGroup}>
          <label>Imágen</label>
          <input type="file"  />
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <div className={styles.leftButtons}>
          <button type="button">Cancelar</button>
        </div>
        <div className={styles.rightButtons}>
          <button type="submit">Guardar</button>
        </div>
      </div>
    </form>
  );
};

export default StockProductoEditar;
