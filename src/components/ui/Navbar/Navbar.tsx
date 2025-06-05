import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import CartButton from "./CartButton/CartButton";
import Modal from "../Modal/Modal";
import UserData from "../../User/UserData/UserData";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onCartClick: () => void;
  onViewChange: (view: "main" | "cart" | "orders") => void;
}

const Navbar = ({ onCartClick, onViewChange }: NavbarProps) => {
  const [optionUser, setOptionUser] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // ✅ Verificar si hay un usuario guardado al cargar
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleOptionUser = () => {
    setOptionUser((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setOptionUser(false);
    navigate("/"); // Redirigir al home
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className={styles.navbar}>
      {/* Logo App */}
      <div className={styles.box_logo} onClick={() => onViewChange("main")}>
        <img
          className={styles.logo}
          src="/src/assets/logos/logo_buenSabor.png"
          alt="Logo Buen Sabor"
        />
      </div>

      {/* Perfil Usuario */}
      <div className={styles.box_user}>
        {isLoggedIn ? (
          // ✅ Si hay sesión iniciada
          <div className={styles.user_actions}>
            <div
              className={styles.user_actions_profile}
              onClick={handleOptionUser}
            >
              <span className="material-symbols-outlined">person</span>
              <button>Mi Cuenta</button>
            </div>
            {optionUser && (
              <div className={styles.profile_options}>
                <button onClick={() => setOpenModal(true)}>
                  Mis datos personales
                </button>
                {openModal && (
                  <Modal
                    onClose={() => {
                      setOpenModal(false);
                      setOptionUser(false);
                    }}
                  >
                    <UserData />
                  </Modal>
                )}
                <button
                  onClick={() => {
                    onViewChange("orders");
                    setOptionUser(false);
                  }}
                >
                  Mis pedidos
                </button>
                <button onClick={handleLogout}>Cerrar sesión</button>
              </div>
            )}
            <div className={styles.div_line_profile}></div>
            <CartButton onClick={onCartClick} />
          </div>
        ) : (
          // ❌ Si no hay sesión
          <>
            <div
              className={styles.user_actions_profile}
              onClick={handleLoginRedirect}
            >
              <span className="material-symbols-outlined">person</span>
              <button>Iniciar sesión</button>
            </div>
            <div className={styles.div_line_profile}></div>
            <CartButton onClick={onCartClick} />
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
