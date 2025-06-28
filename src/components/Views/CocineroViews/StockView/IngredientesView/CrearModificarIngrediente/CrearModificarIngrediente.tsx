import { useState, useEffect } from 'react';
import styles from './CrearModificarIngrediente.module.css';

// Define el tipo Ingrediente aquí también para asegurar consistencia
type Ingrediente = {
  id: number;
  nombre: string;
  rubro: string;
  precioCosto: number;
  stockMinimo: number;
  stockActual: number;
  unidad: string;
  estado: "Alta" | "Baja";
};

// Define los rubros y unidades de medida disponibles (pueden venir de una API real)
const RUBROS_DISPONIBLES = ["Vegetales", "Carnes", "Lácteos", "Secos", "Especias", "Frutas", "Aceites", "Panadería", "Condimentos", "Otros"];
const UNIDADES_MEDIDA_DISPONIBLES = ["kg", "lt", "unidad", "gr", "ml", "cm3", "m"];

interface CrearModificarIngredienteProps {
  onClose: () => void;
  onSave: (ingrediente: Omit<Ingrediente, 'id'> & { id?: number }) => void; // id opcional para nuevos
  ingredienteToEdit?: Ingrediente; // Ingrediente a editar, si existe
}

const CrearModificarIngrediente = ({ onClose, onSave, ingredienteToEdit }: CrearModificarIngredienteProps) => {
  const [nombre, setNombre] = useState('');
  const [rubro, setRubro] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');
  const [stockActual, setStockActual] = useState('');
  const [precioCosto, setPrecioCosto] = useState('');
  const [unidad, setUnidad] = useState('');
  const [estado, setEstado] = useState<'Alta' | 'Baja'>('Alta');

  // Cargar los datos del ingrediente si se está editando
  useEffect(() => {
    if (ingredienteToEdit) {
      setNombre(ingredienteToEdit.nombre);
      setRubro(ingredienteToEdit.rubro);
      setStockMinimo(ingredienteToEdit.stockMinimo.toString());
      setStockActual(ingredienteToEdit.stockActual.toString());
      setPrecioCosto(ingredienteToEdit.precioCosto.toFixed(2).replace('.', ',')); // Formato con coma
      setUnidad(ingredienteToEdit.unidad);
      setEstado(ingredienteToEdit.estado);
    } else {
      // Limpiar el formulario si no hay ingrediente para editar (para "Nuevo")
      setNombre('');
      setRubro('');
      setStockMinimo('');
      setStockActual('');
      setPrecioCosto('');
      setUnidad('');
      setEstado('Alta');
    }
  }, [ingredienteToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!nombre || !rubro || !stockMinimo || !stockActual || !precioCosto || !unidad || !estado) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const nuevoOEditadoIngrediente: Omit<Ingrediente, 'id'> & { id?: number } = {
      nombre,
      rubro,
      stockMinimo: parseInt(stockMinimo),
      stockActual: parseInt(stockActual),
      precioCosto: parseFloat(precioCosto.replace(',', '.')), // Convertir coma a punto para el parseo
      unidad,
      estado,
    };

    if (ingredienteToEdit) {
      // Si estamos editando, incluimos el ID
      nuevoOEditadoIngrediente.id = ingredienteToEdit.id;
    }

    onSave(nuevoOEditadoIngrediente);
    onClose(); // Cerrar el modal después de guardar
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Editar / Nuevo Ingrediente</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              className={styles.input}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="rubro">Rubro</label>
            <select
              id="rubro"
              className={styles.select}
              value={rubro}
              onChange={(e) => setRubro(e.target.value)}
              required
            >
              <option value="" disabled>Selecciona un rubro</option>
              {RUBROS_DISPONIBLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="stockMinimo">Stock Mínimo</label>
            <input
              type="number"
              id="stockMinimo"
              className={styles.input}
              value={stockMinimo}
              onChange={(e) => setStockMinimo(e.target.value)}
              min="0"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="stockActual">Stock Actual</label>
            <input
              type="number"
              id="stockActual"
              className={styles.input}
              value={stockActual}
              onChange={(e) => setStockActual(e.target.value)}
              min="0"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="precioCosto">Precio de costo</label>
            <input
              type="text" // Usamos text para permitir la coma
              id="precioCosto"
              className={styles.input}
              value={precioCosto}
              onChange={(e) => {
                const value = e.target.value;
                // Permitir solo números, comas y puntos
                if (/^[\d.,]*$/.test(value)) {
                  setPrecioCosto(value);
                }
              }}
              placeholder="$354,25"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="unidadMedida">Unidad de Medida</label>
            <select
              id="unidadMedida"
              className={styles.select}
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              required
            >
              <option value="" disabled>Selecciona una unidad</option>
              {UNIDADES_MEDIDA_DISPONIBLES.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="estado">Estado Alta/Baja</label>
            <select
              id="estado"
              className={styles.select}
              value={estado}
              onChange={(e) => setEstado(e.target.value as "Alta" | "Baja")}
              required
            >
              <option value="Alta">Alta</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" className={`${styles.button} ${styles.cancelButton}`} onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className={`${styles.button} ${styles.saveButton}`}>
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearModificarIngrediente;