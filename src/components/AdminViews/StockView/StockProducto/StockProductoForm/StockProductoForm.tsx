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

const StockProductoForm = ({ producto, onClose, modo, onSubmit }: StockProductoFormProps) => {
  const [categorias, setCategorias] = useState<CategoriaArticulo[]>([]);
  const [openModalReceta, setOpenModalReceta] = useState(false);

  // Estado para campos del formulario
  const [nombre, setNombre] = useState(producto?.denominacion || '');
  const [descripcion, setDescripcion] = useState(producto?.descripcion || '');
  const [tiempoCocina, setTiempoCocina] = useState(producto?.tiempoEstimadoMinutos || 0);
  const [precio, setPrecio] = useState(producto?.precioVenta || 0);
  const [categoriaId, setCategoriaId] = useState(producto?.categoria?.id || '');
  const [imagen, setImagen] = useState<File | null>(null);
  const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalle[]>([]);

  // Abrir / Cerrar modal de receta
  const openModal = () => setOpenModalReceta(true);
  const closeModal = () => setOpenModalReceta(false);

  // Cargar categorias de articulos manufacturados
  useEffect(() => {
    const fetchCategorias = async () => {
      const data = await getCategoriasMenuBySucursalId(1);
      setCategorias(data);
    };
    fetchCategorias();
  }, []);

  // Submit del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !descripcion) {
      alert('Por favor completá todos los campos obligatorios y agregá al menos un ingrediente.');
      return;
    }

    try {
      const categoriaSeleccionada = categorias.find((c) => c.id === Number(categoriaId));
      if (!categoriaSeleccionada) {
        alert('Seleccioná una categoría válida.');
        return;
      }

      // payload segun modelo back
      const articuloPayload = {
        denominacion: nombre,
        margenGanancia: precio,
        tiempoEstimadoMinutos: tiempoCocina,
        descripcion,
        detalles: detalles.map(d => ({
          cantidad: d.cantidad,
          articuloInsumo: { id: d.articuloInsumo.id }
        })),
        unidadMedida: { id: 3 }, // hardcodeo 'Unidad'
        categoria: { id: categoriaSeleccionada.id }
      };

      if (modo === 'crear') {
        const response = await createArticuloManufacturado(articuloPayload, imagen!);
        alert('Artículo creado correctamente');
        onSubmit(response);
        onClose();
      } else {
        if (!producto) {
          alert('Error: producto a editar no definido');
          return;
        }
        const response = await updateArticuloManufacturado(producto.id, articuloPayload, imagen ?? undefined);
        alert('Artículo actualizado correctamente');
        onSubmit(response);
        onClose();
      }
    } catch (error) {
      console.error('[ERROR] Error al guardar artículo:', error);
      alert('Hubo un error al guardar el artículo. Revisá la consola para más detalles.');
    }
  };

  const [nombreImagenActual, setNombreImagenActual] = useState<string | null>(
    producto?.imagenes?.length ? producto.imagenes[0].denominacion : null
  );
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagen(file);
      setNombreImagenActual(file.name); // mostrar nombre archivo nuevo
      setImagenPreview(URL.createObjectURL(file)); // opcional: mostrar preview
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
              onChange={handleImageChange}
            />
            {nombreImagenActual && <p>Imagen seleccionada: {nombreImagenActual}</p>}
            {imagenPreview && <img src={imagenPreview} alt="Preview" style={{ maxWidth: 200 }} />}
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
