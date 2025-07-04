import { useEffect, useRef, useState } from 'react';
import styles from './StockProductoForm.module.css';
import { CategoriaArticulo } from '../../../../../models/CategoriaArticulo';
import { getCategoriasMenuABM } from '../../../../../api/articuloCategoria';
import { ArticuloManufacturado } from '../../../../../models/ArticuloManufacturado';
import { createArticuloManufacturado, updateArticuloManufacturado } from '../../../../../api/articuloManufacturado';
import { getInsumosBySucursalId } from '../../../../../api/articuloInsumo';
import { ArticuloInsumo } from '../../../../../models/ArticuloInsumo';
import { IngredienteReceta } from '../../../../../models/IngredienteReceta';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

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
  const [margenGanancia, setMargenGanancia] = useState(producto?.margenGanancia || 0);
  const [categoriaId, setCategoriaId] = useState(producto?.categoria?.id || '');
  const [mostrarInputImagen, setMostrarInputImagen] = useState(false);
  const [imagen, setImagen] = useState<File | null>(null);

  // Estado para el cálculo de costos
  const [costoTotal, setCostoTotal] = useState<number>(0);
  const [precioFinal, setPrecioFinal] = useState<number>(0);



  // Escuchar cambios en artManu
  useEffect(() => {
    if (producto) {
      setNombre(producto.denominacion || '');
      setDescripcion(producto.descripcion || '');
      setTiempoCocina(producto.tiempoEstimadoMinutos || 0);
      setMargenGanancia(producto.margenGanancia || 0);
      setCategoriaId(producto.categoria?.id?.toString() || '');
      setNombreImagenActual(producto.imagenes?.[0]?.nombre || null);
      setImagenPreview(null); // Limpia el preview si cambia el producto
    }
  }, [producto]);

  // Lista de insumos obtenidos
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
  // Estado de insumo seleccionado en formulario
  const [selectedInsumoId, setSelectedInsumoId] = useState<number>(0);
  // Estado de ingredientes agregados ( insumo y cantidad )
  const [ingredientes, setIngredientes] = useState<IngredienteReceta[]>([]);


  // GET insumos disponibles
  useEffect(() => {
    const fetchCategorias = async () => {
      const data = await getCategoriasMenuABM(1);
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

  // Calculamos el costo total y el precio final cada vez que cambian los ingredientes o el margen
  useEffect(() => {
    const nuevoTotal = ingredientes.reduce((total, { insumo, cantidad }) => {
      return total + (insumo.precioCompra * cantidad);
    }, 0);

    setCostoTotal(nuevoTotal);
    setPrecioFinal(nuevoTotal * (1 + margenGanancia / 100));
  }, [ingredientes, margenGanancia]);



  //limpiar form
  useEffect(() => {
  if (modo === 'crear') {
    setNombre('');
    setDescripcion('');
    setTiempoCocina(0);
    setMargenGanancia(0);
    setCategoriaId('');
    setIngredientes([]);
    setImagen(null);
    setImagenPreview(null);
    setNombreImagenActual(null);
  }
}, [modo]);

  // cargar ingredientes si es modo editar y producto tiene detalles **
  useEffect(() => {
    if (modo === 'editar' && producto?.detalles?.length && insumos.length > 0) {
    const ingredientesIniciales: IngredienteReceta[] = producto.detalles.map((detalle) => {
      const insumoCompleto = insumos.find((i) => i.id === detalle.articuloInsumo.id);
      return {
        insumo: insumoCompleto ?? detalle.articuloInsumo,
        cantidad: detalle.cantidad,
      };
    });
      setIngredientes(ingredientesIniciales);
    }
  }, [modo, producto, insumos]);

  const detallesConvertidos = ingredientes.map(i => ({
    cantidad: i.cantidad,
    articuloInsumo: {
      id: i.insumo.id,
      denominacion: i.insumo.denominacion,
      precioCompra: i.insumo.precioCompra,
      esParaElaborar: i.insumo.esParaElaborar,
      tipoArticulo: "insumo",
      unidadMedida: i.insumo.unidadMedida,
    }
  }));

  const handleEliminarIngrediente = (idInsumo: number) => {
    setIngredientes(prev => prev.filter(ingrediente => ingrediente.insumo.id !== idInsumo));
  };

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

      const articuloPayload = {
        tipoArticulo: 'manufacturado',
        denominacion: nombre,
        margenGanancia: margenGanancia,
        tiempoEstimadoMinutos: tiempoCocina,
        descripcion,
        detalles: detallesConvertidos,
        unidadMedida: { id: 3 },
        categoria: { id: categoriaSeleccionada.id },
        precioVenta: precioFinal
      };

      if (modo === 'crear') {
        const response = await createArticuloManufacturado(articuloPayload, imagen!);
        Swal.fire({
          icon: "success",
          title: "Producto creado exitosamente!",
          showConfirmButton: false,
          timer: 1500
        });
        const productoCompleto = ArticuloManufacturado.fromJson({
          ...response,
          categoria: categoriaSeleccionada,
        });
        onSubmit(productoCompleto);
        onClose();
      } else {
        if (!producto) {
          alert('Error: producto a editar no definido');
          return;
        }
        const response = await updateArticuloManufacturado(producto.id!, articuloPayload, imagen ?? undefined);
        Swal.fire({
          icon: "success",
          title: "Producto actualizado exitosamente!",
          showConfirmButton: false,
          timer: 1500
        });
        const productoActualizado = ArticuloManufacturado.fromJson({
          ...response,
          categoria: categoriaSeleccionada,
        });
        onSubmit(productoActualizado);
        onClose();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Error al intentar guardar el producto`
      });
    }
  };

  // Muestro imagen (img, nombre) a editar en form
  const [nombreImagenActual, setNombreImagenActual] = useState<string | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const didSetPreview = useRef(false);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
      setImagen(file);
      setNombreImagenActual(file.name);
      setImagenPreview(URL.createObjectURL(file));
      didSetPreview.current = true;
    }
  };
  useEffect(() => {
    const nombreArchivo = producto?.imagenes?.[0]?.nombre;
    if (nombreArchivo) {
      setNombreImagenActual(nombreArchivo);
      setImagenPreview(`http://localhost:8080/imagenes/${nombreArchivo}`);
      didSetPreview.current = true;
    } else {
      setNombreImagenActual(null);
      setImagenPreview(null);
      didSetPreview.current = false;
    }
  }, [producto?.imagenes]);


  return (
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h2>{modo === 'crear' ? 'Crear Producto' : 'Modificar Producto'}</h2>
        <div className={styles.fieldsGrid}>
          <div className={styles.fieldGroup}>
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => {
                // Filtra la entrada para permitir solo letras (y espacios)
                const onlyLetters = e.target.value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/g, '');
                setNombre(onlyLetters);
              }}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label>Descripción</label>
            <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className={styles.textareaInput}
              />
          </div>
          <div className={styles.fieldGroup}>
            <label>Tiempo en cocina</label>
            <input type="number" value={tiempoCocina} onChange={(e) => setTiempoCocina(Number(e.target.value))} />
          </div>
          <div className={styles.fieldGroup}>
            <label>Rubro</label>
            <select value={categoriaId} onChange={(e) => {
              const selected = categorias.find((c) => c.id === Number(e.target.value));
              setCategoriaId(selected && selected.id !== undefined ? selected.id.toString() : '');
              }}
            >
              <option value="">-- Selecciona un rubro --</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.denominacion}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.fieldGroupFull}>
            <div className={styles.recipeHeader}>
              <label>Receta</label>
              <div className={styles.selectContainer}>
                <select
                  value={selectedInsumoId}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    const insumoYaAgregado = ingredientes.some(ing => ing.insumo.id === id);
                    if (id !== 0 && !insumoYaAgregado) {
                      const insumo = insumos.find(i => i.id === id);
                      if (insumo) {
                        setIngredientes((prev) => [...prev, { insumo, cantidad: 0 }]);
                      }
                    }
                    setSelectedInsumoId(0); // Reset select
                  }}
                >
                  <option value={0}>-- Seleccionar ingrediente --</option>
                  {insumos.map((insumo) => (
                    <option
                      key={insumo.id}
                      value={insumo.id}
                      disabled={ingredientes.some((ing) => ing.insumo.id === insumo.id)}
                    >
                      {insumo.denominacion}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <table className={styles.ingredientesTable}>
              <thead>
                <tr>
                  <th>Ingrediente</th>
                  <th>Cantidad</th>
                  <th>Costo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ingredientes.map(({ insumo, cantidad }, index) => (
                  <tr key={insumo.id}>
                    <td>
                      {insumo.denominacion}</td>
                    <td>
                      <div className={styles.inputWithUnit}>
                        <input
                          type="number"
                          min={0}
                          step={0.001}
                          value={cantidad}
                          onChange={(e) => {
                            const nuevaCantidad = Number(e.target.value);
                            setIngredientes((prev) =>
                              prev.map((ing, i) =>
                                i === index ? { ...ing, cantidad: nuevaCantidad } : ing
                              )
                            );
                          }}
                          className={styles.quantityField}
                        />
                        <span className={styles.unitText}>
                          {insumo.unidadMedida?.denominacion ?? ''}
                        </span>
                      </div>
                    </td>
                    <td className={styles.moneyCell}>
                      ${(insumo.precioCompra * cantidad).toFixed(2)}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleEliminarIngrediente(insumo.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.fieldGroupFull}>
            <h4 style={{margin :'5px 0'}}>Calcular Precio:</h4>
            <div className={styles.costSummary}>
              <div className={styles.costEquation}>
                <span className={styles.costLabel}>Costo:</span>
                <span className={styles.costValue}>${costoTotal.toFixed(2)}</span>
                <div className={styles.equationOperator}>+</div>
                  <span className={styles.costLabel}>Ganancia:</span>
                  <div className={styles.gainSection}>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={margenGanancia}
                      onChange={(e) => setMargenGanancia(Number(e.target.value))}
                      className={styles.marginInput}
                    />
                    <span className={styles.percentSymbol}>%</span>
                  </div>
                <div className={styles.equationOperator}>=</div>
                <span className={styles.costLabel}>Precio:</span>
                <span className={styles.finalCostValue}>${precioFinal.toFixed(2)}</span>

              </div>
            </div>
          </div>

          <div className={styles.fieldGroupFull}>
            <label htmlFor="imagen">Imágen</label>
            {nombreImagenActual && !mostrarInputImagen ? (
            <>
                <button
                  type="button"
                  onClick={() => setMostrarInputImagen(true)}
                  className={styles.saveBtn}
                  style={{ marginBottom: '1em' }}
                >
                  Cambiar imagen
                </button>
              </>
            ) : (
              <>
                <input
                  type="file"
                  id="imagen"
                  className={styles.imageInput}
                  onChange={handleImageChange}
                />
                {nombreImagenActual && <p>Imagen seleccionada: {nombreImagenActual}</p>}
              </>
            )}
            {imagenPreview ? (
              <div style={{ margin: '1em auto' }}>
                <img
                  src={imagenPreview}
                  alt="Preview"
                  style={{ maxWidth: 200, border: '1px solid black' }}
                  onError={(e) => {
                    console.error('Error cargando imagen:', e.currentTarget.src);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <p>No hay imagen para mostrar</p>
            )}
          </div>
        </div>
        <div className={styles.buttonActions}>
          <button type="submit" className={styles.saveBtn}>
            {modo === "crear" ? "Crear" : "Actualizar"}
          </button>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Cancelar
          </button>
        </div>
      </form>
  );
};

export default StockProductoForm;