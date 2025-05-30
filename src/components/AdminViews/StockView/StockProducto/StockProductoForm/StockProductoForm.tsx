import { useEffect, useState } from 'react';
import styles from './StockProductoForm.module.css';
import { CategoriaArticulo } from '../../../../../models/CategoriaArticulo';
import { getCategoriasMenuBySucursalId } from '../../../../../api/articuloCategoria';
import { ArticuloManufacturado } from '../../../../../models/ArticuloManufacturado';
import { createArticuloManufacturado, updateArticuloManufacturado } from '../../../../../api/articuloManufacturado';
import { ArticuloManufacturadoDetalle } from '../../../../../models/ArticuloManufacturadoDetalle';
import { getInsumosBySucursalId } from '../../../../../api/articuloInsumo';
import { ArticuloInsumo } from '../../../../../models/ArticuloInsumo';
import { IngredienteReceta } from '../../../../../models/IngredienteReceta';

interface StockProductoFormProps {
  producto?: ArticuloManufacturado;
  modo: 'crear' | 'editar';
  onClose: () => void;
  onSubmit: (productoActualizado: ArticuloManufacturado) => void;
}

const StockProductoForm = ({ producto, onClose, modo, onSubmit }: StockProductoFormProps) => {
  const [categorias, setCategorias] = useState<CategoriaArticulo[]>([]);

  // Estado para campos del formulario
  const [nombre, setNombre] = useState(producto?.denominacion || '');
  const [descripcion, setDescripcion] = useState(producto?.descripcion || '');
  const [tiempoCocina, setTiempoCocina] = useState(producto?.tiempoEstimadoMinutos || 0);
  const [precio, setPrecio] = useState(producto?.precioVenta || 0);
  const [categoriaId, setCategoriaId] = useState(producto?.categoria?.id || '');
  const [imagen, setImagen] = useState<File | null>(null);

  // Lista de insumos obtenidos
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
  // Estado de insumo seleccionado en formulario
  const [selectedInsumoId, setSelectedInsumoId] = useState<number>(0);
  // Estado de cantidad de insumo
  const [cantidad, setCantidad] = useState<number>(0);
  // Estado de ingredientes agregados ( insumo y cantidad )
  const [ingredientes, setIngredientes] = useState<IngredienteReceta[]>([]);
  // GET insumos disponibles
  useEffect(() => {
    const fetchCategorias = async () => {
      const data = await getCategoriasMenuBySucursalId(1);
      setCategorias(data);
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchInsumos = async () => {
      const data = await getInsumosBySucursalId(1);
      setInsumos(data);
    };
    fetchInsumos();
  }, []);


  // ** NUEVO: cargar ingredientes si es modo editar y producto tiene detalles **
  useEffect(() => {
    if (modo === 'editar' && producto?.detalles?.length) {
      console.log(insumos)
      // Mapear detalles a ingredientes con insumo y cantidad
      const ingredientesIniciales: IngredienteReceta[] = producto.detalles.map(detalle => ({
        insumo: detalle.articuloInsumo,
        cantidad: detalle.cantidad
      }));
      setIngredientes(ingredientesIniciales);
    }
  }, [modo, producto]);

  // Agregar ingrediente a lista
  const handleAgregarIngrediente = () => {
    if (selectedInsumoId === 0) return alert('Seleccioná un ingrediente');
    if (cantidad <= 0) return alert('Ingresá una cantidad válida');

    const insumo = insumos.find(i => i.id === selectedInsumoId);
    if (!insumo) return alert('Ingrediente no encontrado');

    setIngredientes((prev) => {
      const existe = prev.find(i => i.insumo.id === selectedInsumoId);
      if (existe) {
        return prev.map(i =>
          i.insumo.id === selectedInsumoId
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        );
      }
      return [...prev, { insumo, cantidad }];
    });
    setSelectedInsumoId(0);
    setCantidad(0);
  };

  const detallesConvertidos: ArticuloManufacturadoDetalle[] = ingredientes.map((i) => ({
    cantidad: i.cantidad,
    articuloInsumo: i.insumo
  }));

  const handleEliminarIngrediente = (idInsumo: number) => {
    setIngredientes(prev => prev.filter(ingrediente => ingrediente.insumo.id !== idInsumo));
  };

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
        detalles: detallesConvertidos,
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

  // Muestro imagen (img, nombre) a editar en form
  const [nombreImagenActual, setNombreImagenActual] = useState<string | null>(
    producto?.imagenes?.length ? producto.imagenes[0].denominacion : null
  );
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagen(file);
      setNombreImagenActual(file.name); 
      setImagenPreview(URL.createObjectURL(file)); 
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
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <select
                value={selectedInsumoId}
                onChange={(e) => setSelectedInsumoId(Number(e.target.value))}
              >
                <option value={0}>-- Seleccionar ingrediente --</option>
                {insumos.map((insumo) => (
                  <option key={insumo.id} value={insumo.id}>
                    {insumo.denominacion}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Cantidad"
                value={cantidad}
                min={0}
                step={0.1}
                onChange={(e) => setCantidad(Number(e.target.value))}
              />

              <button type="button" onClick={handleAgregarIngrediente}>Agregar</button>
            </div>

            <h4>Ingredientes Agregados:</h4>
              <ul style={{ paddingLeft: '1.25rem' }}>
                {ingredientes.map(({ insumo, cantidad }) => (
                  <li key={insumo.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>
                      {insumo?.denominacion} — {cantidad} {insumo?.unidadMedida?.denominacion ?? ''}
                    </span>

                    <button type="button" onClick={() => handleEliminarIngrediente(insumo.id)}>Eliminar</button>
                  </li>
                ))}
              </ul>
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
      {/* {openModalReceta && (
        <Modal onClose={closeModal}>
          <CreateRecetaForm onChange={setDetalles}/>
        </Modal>
      )} */}
    </>
  );
};

export default StockProductoForm;
