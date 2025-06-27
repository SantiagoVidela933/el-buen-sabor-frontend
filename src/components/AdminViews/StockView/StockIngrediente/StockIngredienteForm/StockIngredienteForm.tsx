import React, { useEffect, useState } from "react";
import styles from "./StockIngredienteForm.module.css";
import { UnidadMedida } from "../../../../../models/UnidadMedida";
import { CategoriaArticulo } from "../../../../../models/CategoriaArticulo";
import { ArticuloInsumo } from "../../../../../models/ArticuloInsumo";
import { Imagen } from "../../../../../models/Imagen";
import { getCategoriasInsumosABM } from "../../../../../api/articuloCategoria";
import { getUnidadMedida } from "../../../../../api/unidadMedida";
import { createArticuloInsumo, updateArticuloInsumo } from "../../../../../api/articuloInsumo";
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
  const [stockActual, setStockActual] = useState(
    ingrediente?.stockPorSucursal?.[0]?.stockActual || 0
  );
  const [stockMinimo, setStockMinimo] = useState(
    ingrediente?.stockPorSucursal?.[0]?.stockMinimo || 0
  );
  const [esParaElaborar, setEsParaElaborar] = useState(ingrediente?.esParaElaborar ?? false);

  useEffect(() => {
    async function fetchCategorias() {
      const data = await getCategoriasInsumosABM(1); 
      setCategorias(data);
    }
    fetchCategorias();
  }, []);

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
    }
  }, [ingrediente, modo]);


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

    const imagenes: Imagen[] = imagenNombre ? [new Imagen(imagenNombre)] : [];

    const articuloInsumoPayload = {
      tipoArticulo: 'insumo',
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
        responseJson = await createArticuloInsumo(articuloInsumoPayload);
        Swal.fire({
          icon: "success",
          title: "Insumo creado exitosamente!",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        if (!ingrediente || !ingrediente.id) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Error: insumo a editar no definido`
          });
          return;
        }
        responseJson = await updateArticuloInsumo(ingrediente.id, articuloInsumoPayload);
        Swal.fire({
          icon: "success",
          title: "Insumo actualizado exitosamente!",
          showConfirmButton: false,
          timer: 1500
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
            Margen ganancia (%):
            <input
              type="number"
              value={margenGanancia}
              onChange={(e) => setMargenGanancia(e.target.value === "" ? 0 : parseFloat(e.target.value))}
              required
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
