import { useState } from 'react';
import styles from './RegistrarCompra.module.css';

// Importa los datos de ingredientes desde IngredientesView para el select
// Esto es para propósitos de demostración. En una aplicación real,
// es posible que quieras obtener esta lista de una API o un contexto.
import { INGREDIENTES_DATA_INITIAL } from '../../IngredientesView/IngredientesView'; // Asegúrate de que la ruta sea correcta // Asegúrate de que la ruta sea correcta

interface RegistrarCompraProps {
  onClose: () => void;
  onSave: (data: { ingrediente: string; cantidad: number; precioCosto: number }) => void;
}

const RegistrarCompra = ({ onClose, onSave }: RegistrarCompraProps) => {
  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioCosto, setPrecioCosto] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validación básica
    if (!ingredienteSeleccionado || !cantidad || !precioCosto) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const data = {
      ingrediente: ingredienteSeleccionado,
      cantidad: parseFloat(cantidad),
      precioCosto: parseFloat(precioCosto.replace(',', '.')), // Para manejar la coma como decimal
    };

    onSave(data);
    onClose(); // Cerrar el modal después de guardar
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Compra de stock</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="ingrediente">Ingrediente</label>
          <select
            id="ingrediente"
            className={styles.select}
            value={ingredienteSeleccionado}
            onChange={(e) => setIngredienteSeleccionado(e.target.value)}
            required
          >
            <option value="" disabled>Selecciona un ingrediente</option>
            {INGREDIENTES_DATA_INITIAL.map((ingrediente) => (
              <option key={ingrediente.id} value={ingrediente.nombre}>
                {ingrediente.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="cantidad">Cantidad</label>
          <input
            type="number"
            id="cantidad"
            className={styles.input}
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            min="1"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="precioCosto">Precio de costo</label>
          <input
            type="text" // Usamos text para permitir la coma, luego la reemplazamos a punto
            id="precioCosto"
            className={styles.input}
            value={precioCosto}
            onChange={(e) => setPrecioCosto(e.target.value)}
            placeholder="$354,25"
            required
          />
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

export default RegistrarCompra;