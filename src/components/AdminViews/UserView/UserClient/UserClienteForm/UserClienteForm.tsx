import Cliente from '../../../../../models/Users/Cliente';
import styles from './UserClienteForm.module.css';

interface UserClienteFormProps {
  modo: 'crear' | 'editar';
  empleado?: Cliente;
  onClose: () => void;
  onSubmit: (empleadoActualizado: Cliente) => void;
}

const UserClienteForm = ({ modo, empleado }: UserClienteFormProps) => {
  return (
    <form className={styles.formContainer}>
      <h2>{modo === 'crear' ? 'Crear Cliente' : 'Modificar Cliente'}</h2>

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

export default UserClienteForm;
