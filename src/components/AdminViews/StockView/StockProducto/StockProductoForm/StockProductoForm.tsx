import { useState } from 'react';
import { Product } from '../../../../../models/Products/Product';
import styles from './StockProductoForm.module.css';
import Modal from '../../../../ui/Modal/Modal';
import CreateRecetaForm from '../../../../ui/CreateRecetaForm/CreateRecetaForm';

interface StockProductoFormProps {
  producto?: Product;
  modo: 'crear' | 'editar';
  onClose: () => void;
  onSubmit: (productoActualizado: Product) => void;
}

const StockProductoForm = ({ producto, onClose, modo }: StockProductoFormProps) => {

  const [openModalReceta, setOpenModalReceta] = useState(false);
  const openModal = () => setOpenModalReceta(true);
  const closeModal = () => setOpenModalReceta(false);

  return (
    <>
      <form className={styles.formContainer}>
      <h2>{modo === 'crear' ? 'Crear Producto' : 'Modificar Producto'}</h2>

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
          <input type="number" defaultValue={producto?.cookingTime || ''} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Precio de Venta</label>
          <input type="number" defaultValue={producto?.price || ''} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Rubro</label>
          <select defaultValue={producto?.productCategory.description || ''}>
            <option value="">-- Selecciona un rubro --</option>
            <option value="">Hamburguesa</option>
            <option value="">Pancho</option>
            <option value="">Bebida</option>
            <option value="">Papas Fritas</option>
            <option value="">Pizza</option>
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label>Estado</label>
          <select defaultValue={producto?.available ? "Alta" : "Baja"}>
            <option value="Alta">Alta</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        <div className={styles.fieldGroupFull}>
          <label>Receta</label>
          <button type="button" className={styles.recipeButton} onClick={openModal}>
            Crear receta
          </button>
        </div>

        <div className={styles.fieldGroupFull}>
          <label htmlFor="imagen">Imágen</label>
          <input type="file" id="imagen" className={styles.imageInput} />
        </div>
      </div>

      <div className={styles.buttonActions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
        <button type="submit" className={styles.saveBtn}>Guardar</button>
      </div>
    </form>
      {openModalReceta && (
        <Modal onClose={closeModal}>
          <CreateRecetaForm />
        </Modal>
      )}

    </>
  );
};

export default StockProductoForm;
