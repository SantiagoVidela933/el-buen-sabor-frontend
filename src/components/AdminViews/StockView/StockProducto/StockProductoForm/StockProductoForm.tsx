import { useEffect, useState } from 'react';
import styles from './StockProductoForm.module.css';
import Modal from '../../../../ui/Modal/Modal';
import CreateRecetaForm from '../../../../ui/CreateRecetaForm/CreateRecetaForm';
import { CategoriaArticulo } from '../../../../../models/CategoriaArticulo';
import { getCategoriasMenuBySucursalId } from '../../../../../api/articuloCategoria';
import { ArticuloManufacturado } from '../../../../../models/ArticuloManufacturado';
import { createArticuloManufacturado, updateArticuloManufacturado } from '../../../../../api/articuloManufacturado';
import { ArticuloManufacturadoDetalle } from '../../../../../models/ArticuloManufacturadoDetalle';

interface StockProductoFormProps {
  producto?: ArticuloManufacturado;
  modo: 'crear' | 'editar';
  onClose: () => void;
  onSubmit: (productoActualizado: ArticuloManufacturado) => void;
}

const StockProductoForm = ({ producto, onClose, modo }: StockProductoFormProps) => {
  const [categorias, setCategorias] = useState<CategoriaArticulo[]>([]);
  const [openModalReceta, setOpenModalReceta] = useState(false);

  const [nombre, setNombre] = useState(producto?.denominacion || '');
  const [descripcion, setDescripcion] = useState(producto?.descripcion || '');
  const [tiempoCocina, setTiempoCocina] = useState(producto?.tiempoEstimadoMinutos || 0);
  const [precio, setPrecio] = useState(producto?.precioCalculado() || 0);
  const [categoriaId, setCategoriaId] = useState(producto?.categoria?.id || '');
  const [imagen, setImagen] = useState<File | null>(null);
  const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalle[]>([]);

  const openModal = () => setOpenModalReceta(true);
  const closeModal = () => setOpenModalReceta(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      const data = await getCategoriasMenuBySucursalId(1);
      setCategorias(data);
    };
    fetchCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !descripcion || !imagen || detalles.length === 0) {
      alert('Por favor completá todos los campos obligatorios y agregá al menos un ingrediente.');
      return;
    }

    try {
      const categoriaSeleccionada = categorias.find((c) => c.id === Number(categoriaId));
      if (!categoriaSeleccionada) {
        alert('Seleccioná una categoría válida.');
        return;
      }

      // Armás el payload según el formato que requiere el backend
      const articuloPayload = {
        denominacion: nombre,
        margenGanancia: precio, // precio de venta
        tiempoEstimadoMinutos: tiempoCocina,
        descripcion,
        detalles: detalles.map(d => ({
          cantidad: d.cantidad,
          articuloInsumo: { id: d.articuloInsumo.id }
        })),
        unidadMedida: { id: 3 }, // fijo
        categoria: { id: categoriaSeleccionada.id }
      };

      console.log("Payload final:", articuloPayload);
      console.log("Imagen a enviar:", imagen.name);


      const response = await createArticuloManufacturado(articuloPayload, imagen);

      console.log('[SUCCESS] Artículo creado exitosamente:', response);
      alert('Artículo creado correctamente');
      onClose(); // cerrar modal o formulario luego de crear

    } catch (error) {
      console.error('[ERROR] Fallo al crear el artículo manufacturado:', error);
      alert('Hubo un error al crear el artículo. Revisá la consola para más detalles.');
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

        <div className={styles.fieldGroupFull}>
          <label>Receta</label>
          <button type="button" className={styles.recipeButton} onClick={openModal}>
            Crear receta
          </button>
        </div>

        <div className={styles.fieldGroupFull}>
          <label htmlFor="imagen">Imágen</label>
          <input
            type="file"
            id="imagen"
            className={styles.imageInput}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImagen(file);
                console.log('[DEBUG] Imagen seleccionada:', file);
              }
            }}
          />
        </div>
      </div>

      <div className={styles.buttonActions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
        <button type="submit" className={styles.saveBtn}>Guardar</button>
      </div>
    </form>
      {openModalReceta && (
        <Modal onClose={closeModal}>
          <CreateRecetaForm onChange={setDetalles}/>
        </Modal>
      )}

    </>
  );
};

export default StockProductoForm;
