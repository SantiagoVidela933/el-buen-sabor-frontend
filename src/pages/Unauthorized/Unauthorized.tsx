import "./Unauthorized.css";
import { useNavigate } from "react-router-dom"; 

export default function Unauthorized() {
  const navigate = useNavigate(); 

  const handleGoBack = () => {
    navigate("/");
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