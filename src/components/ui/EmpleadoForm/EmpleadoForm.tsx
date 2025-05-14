import Empleado from '../../../models/Empleado';
import styles from './EmpleadoForm.module.css';

interface EmpleadoFormProps {
  modo: 'crear' | 'editar';
  empleado?: Empleado;
  onClose: () => void;
  onSubmit: (empleadoActualizado: Empleado) => void;
}

const EmpleadoForm = ({ modo, empleado, onClose, onSubmit }: EmpleadoFormProps) => {
  return (
    <form className={styles.formContainer}>
      <h2>{modo === 'crear' ? 'Crear Empleado' : 'Modificar Empleado'}</h2>

      <div className={styles.fieldsGrid}>
        <div className={styles.fieldGroup}>
          <label>Nombre</label>
          <input type="text" defaultValue={empleado?.nombre || ''} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Apellido</label>
          <input type="text" defaultValue={empleado?.apellido || ''} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Teléfono</label>
          <input type="tel" defaultValue={empleado?.telefono || ''} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Dirección</label>
          <input type="text" defaultValue={empleado?.direccion || ''} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Email</label>
          <input type="email" defaultValue={empleado?.email || ''} />
        </div>

        <div className={styles.fieldGroup}>
          <label>Departamento</label>
            <select  defaultValue={empleado?.departamento || ''}>
                <option value="">-- Selecciona un departamento --</option>
                <option value="capital">Capital</option>
                <option value="general_alvear">General Alvear</option>
                <option value="godoy_cruz">Godoy Cruz</option>
                <option value="guaymallen">Guaymallén</option>
                <option value="junin">Junín</option>
                <option value="la_paz">La Paz</option>
                <option value="las_heras">Las Heras</option>
                <option value="lavalle">Lavalle</option>
                <option value="lujan_de_cuyo">Luján de Cuyo</option>
                <option value="maipu">Maipú</option>
                <option value="malargue">Malargüe</option>
                <option value="rivadavia">Rivadavia</option>
                <option value="san_carlos">San Carlos</option>
                <option value="san_martin">San Martín</option>
                <option value="san_rafael">San Rafael</option>
                <option value="santa_rosa">Santa Rosa</option>
                <option value="tunuyan">Tunuyán</option>
                <option value="tupungato">Tupungato</option>
            </select>
        </div>

        <div className={styles.fieldGroup}>
          <label>Clave provisoria</label>
          <input type="password" />
        </div>

        <div className={styles.fieldGroup}>
          <label>Repetir clave provisoria</label>
          <input type="password" />
        </div>

        <div className={styles.fieldGroup}>
          <label>Rol</label>
          <select defaultValue={empleado?.rol || ''}>
            <option value="">Seleccionar rol</option>
            <option value="Cajero">Cajero</option>
            <option value="Cocinero">Cocinero</option>
            <option value="Delivery">Delivery</option>
          </select>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        {modo === 'editar' && (
          <div className={styles.leftButtons}>
            <button type="button">Dar de Baja</button>
            <button type="button">Dar de Alta</button>
          </div>
        )}
        <div className={styles.rightButtons}>
          <button type="submit">Guardar</button>
        </div>
      </div>
    </form>
  );
};

export default EmpleadoForm;
