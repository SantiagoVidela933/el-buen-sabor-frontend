import { useState } from "react";
import styles from './LoginPage.module.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className={styles["login-page"]}>
      <div className={styles["left-section"]}>
        <div className={styles["logo-container"]}>
          <img
            src="src/assets/logos/logo_buenSabor.png"
            alt="Logo"
            className={styles["logo-img"]}
          />
        </div>
        <div className={styles["images-container"]}>
          <img
            src="src/assets/images/imagen-pensamiento.png"
            alt="Pensamiento"
            className={styles["pensamiento"]}
          />
          <img
            src="src/assets/images/imagen-personas.png"
            alt="Personas"
            className={styles["personas"]}
          />
          <img
            src="src/assets/images/imagen-celular.png"
            alt="Celular"
            className={styles["celular"]}
          />
        </div>
      </div>

      <div className={styles["right-section"]}>
        <div className={styles["form-container"]}>
          <h2>
            Te damos la bienvenida a <br />
            <strong>“Buen Sabor”</strong>
          </h2>
          <p>
            Iniciar sesión
            <br />
            Selecciona cómo quieres hacerlo
          </p>

          <input type="text" placeholder="Usuario" />
          <input type="password" placeholder="Contraseña" />

          <button className={styles["login-button"]}>Iniciar sesión</button>

          <a href="#" className={styles["forgot-link"]}>
            ¿Olvidaste tu contraseña?
          </a>

          <button className={styles["google-button"]}>
            Continuar con Google
          </button>

          <div className={styles["register"]}>
            <input type="checkbox" id="register" />
            <label htmlFor="register">Registrarme</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
