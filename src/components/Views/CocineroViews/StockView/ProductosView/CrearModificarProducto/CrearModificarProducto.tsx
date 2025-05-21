// CrearModificarProducto.tsx
import { useEffect, useState } from "react";
import styles from "./CrearModificarProducto.module.css";

export interface Producto {
  id: number;
  nombre: string;
  rubro: string;
  precioVenta: number;
  tiempoEnCocina: string;
  estado: "Alta" | "Baja";
}

interface Props {
  producto?: Producto;
  onGuardar: (producto: Producto) => void;
  onCancelar: () => void;
}

const CrearModificarProducto = ({ producto, onGuardar, onCancelar }: Props) => {
  const [formData, setFormData] = useState<Producto>({
    id: producto?.id ?? Date.now(),
    nombre: producto?.nombre ?? "",
    rubro: producto?.rubro ?? "",
    precioVenta: producto?.precioVenta ?? 0,
    tiempoEnCocina: producto?.tiempoEnCocina ?? "",
    estado: producto?.estado ?? "Alta",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "precioVenta" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.innerWrapper}>
        <h2>{producto ? "Modificar Producto" : "Crear Producto"}</h2>

        <div className={styles.columns}>
          <div className={styles.column}>
            <label>Nombre</label>
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />

            <label>Descripción</label>
            <input
              name="descripcion"
              value={(formData as any).descripcion || ""}
              onChange={handleChange}
            />

            <label>Precio Venta</label>
            <input
              name="precioVenta"
              type="number"
              value={formData.precioVenta}
              onChange={handleChange}
              required
            />

            <label>Estado</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            >
              <option value="Alta">Alta</option>
              <option value="Baja">Baja</option>
            </select>
          </div>

          <div className={styles.column}>
            <label>Rubro</label>
            <input
              name="rubro"
              value={formData.rubro}
              onChange={handleChange}
              required
            />

            <label>Tiempo en cocina</label>
            <input
              name="tiempoEnCocina"
              value={formData.tiempoEnCocina}
              onChange={handleChange}
              required
            />

            <label>Receta</label>
            <button
              className={styles.recetaButton}
              onClick={() =>
                alert("Funcionalidad de receta no implementada aún")
              }
            >
              {producto ? "Modificar Receta" : "Crear Receta"}
            </button>

            <label>Imagen</label>
            <input type="file" accept="image/*" />
          </div>
        </div>

        <div className={styles.buttons}>
          <button type="submit">Guardar</button>
          <button type="button" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
};

export default CrearModificarProducto;
