import { useEffect, useState } from 'react';
import styles from './StockProductoForm.module.css';
import Modal from '../../../../ui/Modal/Modal';
import CreateRecetaForm from '../../../../ui/CreateRecetaForm/CreateRecetaForm';
import { CategoriaArticulo } from '../../../../../models/CategoriaArticulo';
import { getCategoriasMenuBySucursalId } from '../../../../../api/articuloCategoria';
import { ArticuloManufacturado } from '../../../../../models/ArticuloManufacturado';
import { createArticuloManufacturado } from '../../../../../api/articuloManufacturado';

interface StockProductoFormProps {
  producto?: ArticuloManufacturado;
  modo: 'crear' | 'editar';
  onClose: () => void;
  onSubmit: (productoActualizado: ArticuloManufacturado) => void;
}

const StockProductoForm = ({ producto, onClose, modo }: StockProductoFormProps) => {

  // estado que contiene las cat. de articulos manufacturados
  const [categorias, setCategorias] = useState<CategoriaArticulo[]>([]);
  const [openModalReceta, setOpenModalReceta] = useState(false);

  // CAPTURA DE DATOS DEL FORM
  const [nombre, setNombre] = useState(producto?.denominacion || '');
  const [descripcion, setDescripcion] = useState(producto?.descripcion || '');
  const [tiempoCocina, setTiempoCocina] = useState(producto?.tiempoEstimadoMinutos || 0);
  const [precio, setPrecio] = useState(producto?.precioCalculado() || 0);
  const [categoriaId, setCategoriaId] = useState(producto?.categoria?.id || '');
  // const [estado, setEstado] = useState(producto?.es ? 'Alta' : 'Baja');

  const openModal = () => setOpenModalReceta(true);
  const closeModal = () => setOpenModalReceta(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      const data = await getCategoriasMenuBySucursalId(1);
      setCategorias(data);
    };
    fetchCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const nuevoArticulo = new ArticuloManufacturado(/* ... */);
      await createArticuloManufacturado(nuevoArticulo);
      onClose(); // cerrar modal si todo sale bien
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  };


  return (
    <>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2>{modo === 'crear' ? 'Crear Producto' : 'Modificar Producto'}</h2>

      <div className={styles.fieldsGrid}>
        <div className={styles.fieldGroup}>
          <label>Nombre</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Descripción</label>
          <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Tiempo en cocina</label>
          <input type="number" value={tiempoCocina} onChange={(e) => setTiempoCocina(Number(e.target.value))} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Precio de Venta</label>
          <input type="number" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Rubro</label>
          <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
            <option value="">-- Selecciona un rubro --</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.denominacion}
              </option>
            ))}
          </select>
        </div>


        <div className={styles.fieldGroup}>
          <label>Estado</label>
          <select defaultValue="Estado">
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
