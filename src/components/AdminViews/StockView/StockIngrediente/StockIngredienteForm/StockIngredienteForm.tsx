import React, { useEffect, useState, useRef } from "react";
import styles from "./StockIngredienteForm.module.css";
import { UnidadMedida } from "../../../../../models/UnidadMedida";
import { CategoriaArticulo } from "../../../../../models/CategoriaArticulo";
import { ArticuloInsumo } from "../../../../../models/ArticuloInsumo";
import { Imagen } from "../../../../../models/Imagen";
import { getCategoriasInsumosABM, getCategoriasMenuABM } from "../../../../../api/articuloCategoria";
import { getUnidadMedida } from "../../../../../api/unidadMedida";
import { createArticuloInsumo, subirImagen, updateArticuloInsumo } from "../../../../../api/articuloInsumo";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

interface Props {
  ingrediente?: ArticuloInsumo;
  modo: "crear" | "editar";
  onClose: () => void;
  onSubmit: (nuevo: any) => void;
}

const StockIngredienteForm: React.FC<Props> = ({ ingrediente, modo, onClose, onSubmit }) => {
  const [denominacion, setDenominacion] = useState(ingrediente?.denominacion || "");
  const [precioCompra, setPrecioCompra] = useState(ingrediente?.precioCompra || 0);
  const [margenGanancia, setMargenGanancia] = useState(ingrediente?.margenGanancia || 0);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [unidadMedida, setUnidadMedida] = useState<UnidadMedida | undefined>(undefined);
  const [categorias, setCategorias] = useState<CategoriaArticulo[]>([]);
  const [categoria, setCategoria] = useState<CategoriaArticulo | null>(null);
  const [imagenNombre, setImagenNombre] = useState(
    ingrediente?.imagenes?.length 
      ? ingrediente.imagenes[ingrediente.imagenes.length - 1].nombre 
      : ""
  );
  const [stockMaximo, setStockMaximo] = useState(
    ingrediente?.stockPorSucursal?.[0]?.stockMaximo || 0
  );
  const [stockMinimo, setStockMinimo] = useState(
    ingrediente?.stockPorSucursal?.[0]?.stockMinimo || 0
  );
  const [esParaElaborar, setEsParaElaborar] = useState(modo === "editar" ? (ingrediente?.esParaElaborar ?? true) : true);

  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [nombreImagenActual, setNombreImagenActual] = useState<string | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [mostrarInputImagen, setMostrarInputImagen] = useState(false);
  const didSetPreview = useRef(false);
  
    useEffect(() => {
    const imagenString = (ingrediente as any)?.imagen;
    // Si hay imágenes, tomamos la última del array
    const imagenes = ingrediente?.imagenes || [];
    const nombreArchivo = imagenes.length > 0 
      ? imagenes[imagenes.length - 1].nombre 
      : null;

    if (imagenString && (!ingrediente?.imagenes || ingrediente.imagenes.length === 0)) {
      setNombreImagenActual(imagenString);
      setImagenNombre(imagenString);
      setImagenPreview(`http://localhost:8080/imagenes/${imagenString}`);
      didSetPreview.current = true;
      return;
    }
    if (nombreArchivo) {
      setNombreImagenActual(nombreArchivo);
      setImagenPreview(`http://localhost:8080/imagenes/${nombreArchivo}`);
      didSetPreview.current = true;
    } else if (modo === "editar" && ingrediente?.id) {
      fetchImageForIngrediente(ingrediente.id);
    }
  }, [ingrediente?.imagenes, (ingrediente as any)?.imagen, modo, ingrediente?.id]);
  
  
  const fetchImageForIngrediente = async (ingredienteId: number) => {
    if (!ingredienteId) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/articuloInsumo/articulo/${ingredienteId}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const imageName = await response.text();
      console.log("Fetched image name:", imageName);
      
      if (imageName && typeof imageName === 'string' && imageName.trim() !== '') {
        setImagenNombre(imageName);
        setNombreImagenActual(imageName);
        // Usar la misma ruta que StockProductoForm
        setImagenPreview(`http://localhost:8080/imagenes/${imageName}`);
        didSetPreview.current = true;
      }
    } catch (error) {
      console.error("Error fetching image for ingredient:", error);
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImagenArchivo(file);
    if (file) {
      setNombreImagenActual(file.name);
      setImagenPreview(URL.createObjectURL(file));
      didSetPreview.current = true;
    } else {
      setNombreImagenActual(null);
      setImagenPreview(null);
      didSetPreview.current = false;
    }
  };

  useEffect(() => {
    async function fetchCategorias() {
      if (esParaElaborar) {
        // Cargo categorías para insumos (las que ya tenés)
        const data = await getCategoriasInsumosABM(1);
        setCategorias(data);
      } else {
        // Cargo categorías de menú (manufacturados)
        const data = await getCategoriasMenuABM(1);
        setCategorias(data);
      }
    }
    fetchCategorias();
  }, [esParaElaborar]);

  useEffect(() => {
    getUnidadMedida().then(setUnidadesMedida);
  }, []);

  useEffect(() => {
    if (modo === "editar" && ingrediente) {
      console.log("Setting form values from ingrediente:", ingrediente);
      
      // Basic data
      setDenominacion(ingrediente.denominacion || "");
      setPrecioCompra(ingrediente.precioCompra || 0);
      
      // Handle margin of gain - ensure it's a number and not 0 when it shouldn't be
      const margin = ingrediente.margenGanancia;
      console.log("Margin from backend:", margin, "Type:", typeof margin);
      
      // If it's not a para elaborar item, margin should be > 0
      if (!ingrediente.esParaElaborar && (!margin || margin <= 0)) {
        console.warn("Non-elaboration item has invalid margin, using default 20%");
        setMargenGanancia(20); // Default reasonable margin
      } else {
        setMargenGanancia(Number(margin || 0));
      }
      
      // Handle image
      if (ingrediente.imagenes && ingrediente.imagenes.length > 0) {
        const imagen = ingrediente.imagenes[ingrediente.imagenes.length - 1];
        setImagenNombre(imagen.nombre || "");
        setNombreImagenActual(imagen.nombre || null);
        
        // Use the correct endpoint for images
        const imageUrl = `http://localhost:8080/api/v1/imagenes/${imagen.nombre}`;
        console.log("Setting image preview URL:", imageUrl);
        setImagenPreview(imageUrl);
        didSetPreview.current = true;
      } else if (!ingrediente.esParaElaborar) {
        console.warn("No images found for this ingredient");
        
        // Try to fetch the image name from the specific endpoint
        if (ingrediente.id !== undefined) {
          fetchImageForIngrediente(ingrediente.id);
        }
      }
      
      setUnidadMedida(ingrediente.unidadMedida || undefined);
      setCategoria(ingrediente.categoria || null);
      
      const stockSucursal = ingrediente.stockPorSucursal?.[0];
      if (stockSucursal) {
        setStockMaximo(stockSucursal.stockMaximo ?? 0);
        setStockMinimo(stockSucursal.stockMinimo ?? 0);
      }
      
      // Set the elaboration flag
      setEsParaElaborar(ingrediente.esParaElaborar ?? true);
    }
  }, [ingrediente, modo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!denominacion) {
      alert("Debes ingresar una denominación.");
      return;
    }
    if (!stockMinimo || stockMinimo < 0) {
      alert("El stock mínimo debe ser un número positivo.");
      return;
    }
    if (!stockMaximo || stockMaximo < 0) {
      alert("El stock máximo debe ser un número positivo.");
      return;
    }

    if (!categoria) {
      alert("Debes seleccionar una categoría.");
      return;
    }

    if (!unidadMedida) {
      alert("Debes seleccionar una unidad de medida");
      return;
    }

    if (precioCompra <= 0) {
      alert("El precio de compra debe ser mayor a 0.");
      return;
    }
    
    if (!esParaElaborar) {
      if (margenGanancia <= 0) {
        alert("El margen de ganancia debe ser mayor a 0.");
        return;
      }

      if (!nombreImagenActual && !imagenArchivo) {
        alert("Debes seleccionar una imagen o usar la existente.");
        return;
      }
    }

    let nombreImagenBackend = "";

    try {
      if (imagenArchivo) {
        // Subo la imagen y obtengo el nombre encriptado que genera backend
        nombreImagenBackend = await subirImagen(imagenArchivo);
      } else {
        // Si no seleccionó archivo nuevo, uso el que ya tenía (editar)
        nombreImagenBackend = imagenNombre;
      }
    } catch (error) {
      alert("Error al subir la imagen: " + (error as Error).message);
      return;
    }

    const imagenes: Imagen[] =
      !esParaElaborar && nombreImagenBackend
        ? [new Imagen(nombreImagenBackend)]
        : [];

    const articuloInsumoPayload = {
      tipoArticulo: "insumo",
      denominacion,
      precioCompra,
      esParaElaborar,
      unidadMedida: { id: unidadMedida.id },
      sucursal: { id: 1 },
      imagenes: imagenes.map((img) => ({
        ...(img.id ? { id: img.id } : {}),
        fechaAlta: img.fechaAlta ?? null,
        fechaModificacion: img.fechaModificacion ?? null,
        fechaBaja: img.fechaBaja ?? null,
        nombre: img.nombre,
      })),
      categoria: { id: categoria.id },
      stockPorSucursal: [
        {
          sucursal: { 
            id: 1, 
            nombre: "Sucursal Principal", 
            fechaAlta: null,
            fechaModificacion: null,
            fechaBaja: null
          },
          stockActual: 0, // No se usa en insumos, pero se requiere
          stockMinimo,
          stockMaximo,
          fechaAlta: null,
          fechaModificacion: null,
          fechaBaja: null,
        },
      ],
      margenGanancia,
      precioVenta: 0,
      ...(modo === "editar" && ingrediente && ingrediente.id
        ? { id: ingrediente.id }
        : {}),
      fechaAlta: null,
      fechaModificacion: null,
      fechaBaja: null,
    };

    try {
      let responseJson;
      if (modo === "crear") {
        responseJson = await createArticuloInsumo(articuloInsumoPayload, imagenArchivo || undefined);
        Swal.fire({
          icon: "success",
          title: "Insumo creado exitosamente!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        if (!ingrediente || !ingrediente.id) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Error: insumo a editar no definido`,
          });
          return;
        }
        responseJson = await updateArticuloInsumo(ingrediente.id, articuloInsumoPayload);
        Swal.fire({
          icon: "success",
          title: "Insumo actualizado exitosamente!",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      const nuevoIngrediente = ArticuloInsumo.fromJson(responseJson);
      onSubmit(nuevoIngrediente);
      onClose();
    } catch (error) {
      alert("Error al guardar el insumo: " + error);
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2>{modo === "crear" ? "Crear Ingrediente" : "Editar Ingrediente"}</h2>
      <div className={styles.fieldsGrid}>
        <div className={styles.fieldGroup}>
          <label>
            Nombre:
            <input
              type="text"
              value={denominacion}
              onChange={(e) => setDenominacion(e.target.value)}
              required
            />
          </label>
        </div>

        <div className={styles.fieldGroup}>
          <label>
            Unidad de medida:
            <select
              value={unidadMedida?.id ?? ""}
              onChange={(e) => {
                const selected = unidadesMedida.find(u => u.id === Number(e.target.value));
                if (selected) setUnidadMedida(selected);
              }}
            >
              <option value="">Seleccionar...</option>
              {unidadesMedida.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.denominacion}
                </option>
              ))}
            </select>
          </label>
        </div>
        
        <div className={styles.fieldGroup}>
          <label>
            Stock mínimo:
            <input
              type="number"
              value={stockMinimo}
              onChange={(e) => setStockMinimo(parseFloat(e.target.value))}
            />
          </label>
        </div>
        
        <div className={styles.fieldGroup}>
          <label>
            Stock Máximo:
            <input
              type="number"
              value={stockMaximo}
              onChange={(e) => setStockMaximo(parseFloat(e.target.value))}
            />
          </label>
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.inlineFieldGroup}>
            <label className={styles.inlineLabel}>Tipo de insumo:
              <div className={styles.buttonToggleGroup}>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${esParaElaborar ? styles.activeButton : ''}`}
                  onClick={() => setEsParaElaborar(true)}
                >
                  Para elaborar
                </button>
                <button
                  type="button"
                  className={`${styles.toggleButton} ${!esParaElaborar ? styles.activeButton : ''}`}
                  onClick={() => setEsParaElaborar(false)}
                >
                  Para venta directa
                </button>
              </div>
            </label>
          </div>
        </div>
        
        <div className={styles.fieldGroup}>
          <label>Categoría:
            <select
              value={categoria?.id ?? ""}
              onChange={(e) => {
                const selected = categorias.find((c) => c.id === Number(e.target.value));
                setCategoria(selected ?? null);
              }}
            >
              <option value="">Seleccionar...</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.denominacion}
                </option>
              ))}
            </select>
          </label>
        </div>
        
        <div className={styles.fieldGroup}>
          <label>
            Precio compra:
            <input
              type="number"
              value={precioCompra}
              onChange={(e) => setPrecioCompra(e.target.value === "" ? 0 : parseFloat(e.target.value))}
              required
            />
          </label>
        </div>
        
        {!esParaElaborar && (
          <>
            <div className={styles.fieldGroupFull}>
              <h4 style={{margin: '5px 0'}}>Calcular Precio:</h4>
              <div className={styles.costSummary}>
                <div className={styles.costEquation}>
                  <span className={styles.costLabel}>Costo:</span>
                  <span className={styles.costValue}>${precioCompra.toFixed(2)}</span>
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
                  <span className={styles.finalCostValue}>${(precioCompra * (1 + margenGanancia / 100)).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className={styles.fieldGroupFull}>
              <label htmlFor="imagen">Imágen</label>
              {nombreImagenActual && !mostrarInputImagen ? (
                <>
                  <p>Imagen seleccionada: {nombreImagenActual}</p>
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
                    accept="image/*"
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
                      // Intenta cargar con una URL alternativa
                      if (e.currentTarget.src.includes('/api/v1/imagenes/')) {
                        console.log('Intentando URL sin /api/v1/');
                        e.currentTarget.src = e.currentTarget.src.replace('/api/v1/imagenes/', '/imagenes/');
                      } else if (e.currentTarget.src.includes('/imagenes/')) {
                        console.log('Intentando URL con /api/imagenes/');
                        e.currentTarget.src = e.currentTarget.src.replace('/imagenes/', '/api/imagenes/');
                      } else {
                        e.currentTarget.style.display = 'none';
                      }
                    }}
                  />
                </div>
              ) : (
                <p>No hay imagen para mostrar</p>
              )}
            </div>
          </>
        )}
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

export default StockIngredienteForm;
