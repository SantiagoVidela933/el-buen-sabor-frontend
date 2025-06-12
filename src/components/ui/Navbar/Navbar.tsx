import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import CartButton from "./CartButton/CartButton";
import Modal from "../Modal/Modal";
import UserData from "../../User/UserData/UserData";
import { useAuth0 } from "@auth0/auth0-react";
import Cliente from "../../../models/prueba/Client";
import { getClientesMailJSONFetch } from "../../../api/cliente";

import axios from "axios";

interface Auth0User {
  email: string;
  name?: string;
  sub: string;
}

interface NavbarProps {
  onCartClick: () => void;
  onViewChange: (view: "main" | "cart" | "orders") => void;
}

const Navbar = ({ onCartClick, onViewChange }: NavbarProps) => {
  const [optionUser, setOptionUser] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();
  const [cliente, setCliente] = useState<Cliente | null>(null);




  useEffect(() => {
    const verificarRegistro = async () => {
      if (isAuthenticated && user && !isLoading) {
        const auth0User = user as Auth0User;
        try {
          await axios.get(
            `http://localhost:8080/api/clientes/email/${auth0User.email}`
          );
        
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
           
            window.location.href = `/registro?auth0Id=${encodeURIComponent(auth0User.sub)}`;
          } else {
            console.error("Error al verificar cliente:", error);
          }
        }
      }
    };
    verificarRegistro();
  }, [isAuthenticated, user, isLoading]);

  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
        const auth0User = user as Auth0User;
        try {
        getClientesMailJSONFetch(auth0User.email).then(setCliente);
        } catch (error) {
          console.log ("Error al obtener cliente")
        }
      }
    
  }, [isAuthenticated, user, isLoading]);



  const handleOptionUser = () => {
    setOptionUser((prev) => !prev);
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: "http://localhost:5173" } });
  };

  if (isLoading) return null;

  return (
    <div className={styles.navbar}>
      {/* Logo App */}
      <div className={styles.box_logo} onClick={() => onViewChange("main")}>
        <img
          className={styles.logo}
          src="/src/assets/logos/logo_buenSabor.png"
          alt="Logo BuenSabor"
        />
      </div>

      {/* Perfil Usuario */}
      <div className={styles.box_user}>
        {isAuthenticated ? (
          <div className={styles.user_actions}>
            <div
              className={styles.user_actions_profile}
              onClick={handleOptionUser}
            >
              <span className="material-symbols-outlined">person</span>
              <span style={{ marginLeft: "8px", fontSize: "11px" }}>
                Bienvenido {user?.name ?? user?.email ?? "Usuario"}
              </span>
              <button style={{ marginLeft: "10px" }}>Mi Cuenta</button>
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
                    <UserData cliente={cliente} />
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
          <>
            <div
              className={styles.user_actions_profile}
              onClick={() => loginWithRedirect()}
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
