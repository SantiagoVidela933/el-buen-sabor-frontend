import React, { useEffect, useState } from "react";
import styles from "./StockIngredienteForm.module.css";
import { UnidadMedida } from "../../../../../models/UnidadMedida";
import { CategoriaArticulo } from "../../../../../models/CategoriaArticulo";
import { ArticuloInsumo } from "../../../../../models/ArticuloInsumo";
import { Imagen } from "../../../../../models/Imagen";
import { getCategoriasInsumosBySucursalId } from "../../../../../api/articuloCategoria";
import { getUnidadMedida } from "../../../../../api/unidadMedida";
import { createArticuloInsumo, updateArticuloInsumo } from "../../../../../api/articuloInsumo";

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
    ingrediente?.imagenes?.[0]?.denominacion || ""
  );
  const [stockActual, setStockActual] = useState(
    ingrediente?.stockPorSucursal?.[0]?.stockActual || 0
  );
  const [stockMinimo, setStockMinimo] = useState(
    ingrediente?.stockPorSucursal?.[0]?.stockMinimo || 0
  );

  useEffect(() => {
    async function fetchCategorias() {
      const data = await getCategoriasInsumosBySucursalId(1); // ID hardcodeado
      setCategorias(data);
    }
    fetchCategorias();
  }, []);

  useEffect(() => {
    getUnidadMedida().then(setUnidadesMedida);
  }, []);

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
      denominacion,
      precioCompra,
      esParaElaborar: false,
      unidadMedida: { id: unidadMedida.id },
      sucursal: { id: 1 },
      imagenes: imagenes.map((img) => ({
        ...(img.id ? { id: img.id } : {}),
        fechaAlta: img.fechaAlta ?? null,
        fechaModificacion: img.fechaModificacion ?? null,
        fechaBaja: img.fechaBaja ?? null,
        nombre: img.denominacion,
      })),
      categoria: { id: categoria.id },
      stockPorSucursal: [
        {
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
      } else {
        if (!ingrediente || !ingrediente.id) {
          alert("Error: insumo a editar no definido");
          return;
        }
        responseJson = await updateArticuloInsumo(ingrediente.id, articuloInsumoPayload);
      }

      const nuevoIngrediente = ArticuloInsumo.fromJson(responseJson);

      onSubmit(nuevoIngrediente);
      onClose();
    } catch (error) {
      alert("Error al guardar el insumo: " + error);
    }
  };




  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>{modo === "crear" ? "Crear Ingrediente" : "Editar Ingrediente"}</h2>

      <label>
        Nombre:
        <input
          type="text"
          value={denominacion}
          onChange={(e) => setDenominacion(e.target.value)}
          required
        />
      </label>

      <label>
        Precio compra:
        <input
          type="number"
          value={precioCompra}
          onChange={(e) => setPrecioCompra(e.target.value === "" ? 0 : parseFloat(e.target.value))}
          required
        />
      </label>

      <label>
        Margen ganancia (%):
        <input
          type="number"
          value={margenGanancia}
          onChange={(e) => setMargenGanancia(e.target.value === "" ? 0 : parseFloat(e.target.value))}
          required
        />
      </label>

      <label>
        Imagen (nombre):
        <input
          type="text"
          value={imagenNombre}
          onChange={(e) => setImagenNombre(e.target.value)}
        />
      </label>

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

      <label>
        Stock actual:
        <input
          type="number"
          value={stockActual}
          onChange={(e) => setStockActual(parseFloat(e.target.value))}
        />
      </label>

      <label>
        Stock mínimo:
        <input
          type="number"
          value={stockMinimo}
          onChange={(e) => setStockMinimo(parseFloat(e.target.value))}
        />
      </label>

      <div className={styles.actions}>
        <button type="submit">
          {modo === "crear" ? "Crear" : "Actualizar"}
        </button>
        <button type="button" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default StockIngredienteForm;
