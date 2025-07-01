import React, { useEffect, useRef, useState } from "react";
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
    ingrediente?.imagenes?.[0]?.nombre || ""
  );
  const [imagen, setImagen] = useState<File | null>(null);
  const [stockActual, setStockActual] = useState(
    ingrediente?.stockPorSucursal?.[0]?.stockActual || 0
  );
  const [stockMinimo, setStockMinimo] = useState(
    ingrediente?.stockPorSucursal?.[0]?.stockMinimo || 0
  );
  const [esParaElaborar, setEsParaElaborar] = useState(ingrediente?.esParaElaborar ?? false);

  const [mostrarInputImagen, setMostrarInputImagen] = useState(false);
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [nombreImagenActual, setNombreImagenActual] = useState<string | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0] ?? null;
//   setImagenArchivo(file);
//   if (file) {
//     setNombreImagenActual(file.name);
//     setImagenPreview(URL.createObjectURL(file));
//   } else {
//     setNombreImagenActual(null);
//     setImagenPreview(null);
//   }
// };

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
      setDenominacion(ingrediente.denominacion || "");
      setPrecioCompra(ingrediente.precioCompra || 0);
      setMargenGanancia(ingrediente.margenGanancia || 0);
      setImagenNombre(ingrediente.imagenes?.[0]?.nombre || "");
      setUnidadMedida(ingrediente.unidadMedida || undefined);
      setCategoria(ingrediente.categoria || null);
      const stockSucursal = ingrediente.stockPorSucursal?.[0];
      if (stockSucursal) {
        setStockActual(stockSucursal.stockActual ?? 0);
        setStockMinimo(stockSucursal.stockMinimo ?? 0);
      }

      setNombreImagenActual(ingrediente.imagenes?.length ? ingrediente.imagenes[0].nombre : null);
      setImagenPreview(null);
    }
  }, [ingrediente, modo]);

  useEffect(() => {
    const nombreArchivo = ingrediente?.imagenes?.[0]?.nombre;
    if (nombreArchivo) {
      setNombreImagenActual(nombreArchivo);
      setImagenPreview(`http://localhost:8080/imagenes/${nombreArchivo}`);
      didSetPreview.current = true;
    } else {
      setNombreImagenActual(null);
      setImagenPreview(null);
      didSetPreview.current = false;
    }
  }, [ingrediente?.imagenes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoria) {
      alert("Debes seleccionar una categoría.");
      return;
    }

    if (!unidadMedida) {
      alert("Debes seleccionar una unidad de medida");
      return;
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
      // imagenes: imagenes.map((img) => ({
      //   ...(img.id ? { id: img.id } : {}),
      //   fechaAlta: img.fechaAlta ?? null,
      //   fechaModificacion: img.fechaModificacion ?? null,
      //   fechaBaja: img.fechaBaja ?? null,
      //   nombre: img.nombre,
      // })),
      categoria: { id: categoria.id },
      stockPorSucursal: [
        {
          sucursal: { id: 1 },
          stockActual,
          stockMinimo,
          stockMaximo: 0,
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
        responseJson = await createArticuloInsumo(articuloInsumoPayload, imagen!);
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
        responseJson = await updateArticuloInsumo(ingrediente.id, articuloInsumoPayload, imagen!);
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
            Precio compra:
            <input
              type="number"
              value={precioCompra}
              onChange={(e) => setPrecioCompra(e.target.value === "" ? 0 : parseFloat(e.target.value))}
              required
            />
          </label>
        </div>

        
        
        <div className={styles.fieldGroup}>
          <label>
            Stock actual:
            <input
              type="number"
              value={stockActual}
              onChange={(e) => setStockActual(parseFloat(e.target.value))}
            />
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
        
        <div>
          <label>
            ¿Es para elaborar?
            <input
              type="checkbox"
              checked={esParaElaborar}
              onChange={(e) => setEsParaElaborar(e.target.checked)}
            />
          </label>
        </div>
                <div className={styles.fieldGroup}>
          <label>
            Categoría:
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
          <div></div>
        {!esParaElaborar && (
          <><div className={styles.fieldGroup}>
            <label>
              Margen ganancia (%):
              <input
                type="number"
                value={margenGanancia}
                onChange={(e) => setMargenGanancia(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                required />
            </label>
          </div><div className={styles.fieldGroupFull}>
              <label htmlFor="imagen">Imagen:</label>
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
                    onChange={handleImageChange} />
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
                    } } />
                </div>
              ) : (
                <p>No hay imagen para mostrar</p>
              )}
            </div></>
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
