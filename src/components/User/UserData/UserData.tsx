import styles from './UserData.module.css';

const UserData = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>Mis datos personales</h3>
      </div>
      <form className={styles.form}>
        <label>
          Nombre
          <input type="text" />
        </label>
        <label>
          Apellido
          <input type="text" />
        </label>
        <label>
          Teléfono
          <input type="number" />
        </label>
        <label>
          Email
          <input type="email" />
        </label>
        <label>
          Contraseña
          <input type="password" />
        </label>
        <label>
          Fecha de Nacimiento
          <input type="date" />
        </label>
        <label>
          Dirección
          <input type="text" />
        </label>
        <label>
          Departamento
          <select>
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
        </label>
        <div className={styles.buttonWrapper}>
          <button type="submit">Guardar cambios</button>
        </div>
      </form>
    </div>
  );
};

export default UserData;
