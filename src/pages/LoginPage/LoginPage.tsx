import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";

// Simulación de usuarios con roles
const fakeUsers = [
  { username: "admin", password: "1234", role: "admin" },
  { username: "cajero", password: "1234", role: "cajero" },
  { username: "cocinero", password: "1234", role: "cocinero" },
  { username: "delivery", password: "1234", role: "delivery" },
  { username: "cliente", password: "1234", role: "cliente" },
];

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🚨 Este useEffect hace el redireccionamiento automático si ya hay sesión iniciada
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const { role } = JSON.parse(user);
      navigate(`/${role}`);
    }
  }, []);

  const handleLogin = () => {
    const user = fakeUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "cliente") {
        navigate("/"); // Cliente va a landing page
      } else {
        navigate(`/${user.role}`); // Otros roles a su dashboard
      }
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

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

          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className={styles["login-button"]} onClick={handleLogin}>
            Iniciar sesión
          </button>

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
};

export default LoginPage;