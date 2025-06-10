import "./Unauthorized.css";
import { useNavigate } from "react-router-dom"; // ¡Importa useNavigate, no Navigate!

export default function Unauthorized() {
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  const handleGoBack = () => {
    navigate("/"); // Usa la función navigate para ir a la ruta raíz
  };

  return (
    <>
      <div className="unauthorized-component">
        <div className="container">
          <div className="imagen-central">
            <img src="../../../public/img/unauthorized.png" alt="Unauthorized" />
          </div>
          <div>
            <button onClick={handleGoBack}>Volver</button>
          </div>
        </div>
      </div>
    </>
  );
}