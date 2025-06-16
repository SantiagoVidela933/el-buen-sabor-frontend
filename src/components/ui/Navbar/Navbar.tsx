import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import CartButton from "./CartButton/CartButton";
import Modal from "../Modal/Modal";
import UserData from "../../User/UserData/UserData";
import { useAuth0 } from "@auth0/auth0-react";
import Cliente from "../../../models/prueba/Client";
import { getClientesMailJSONFetch } from "../../../api/cliente";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

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
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const namespace = "https://buensaboroto.com/roles";
  const userRoles: string[] = user?.[namespace] || [];
  const isAdmin = userRoles.includes("ADMINISTRADOR");
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const hasItemsInCart = cartItems.length > 0;

  useEffect(() => {
    const verificarRegistro = async () => {
      if (isAuthenticated && user && !isLoading) {
        const auth0User = user as Auth0User;
        try {
          await axios.get(`http://localhost:8080/api/clientes/email/${auth0User.email}`);
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
        console.log("Error al obtener cliente");
      }
    }
  }, [isAuthenticated, user, isLoading]);

  const handleOptionUser = () => {
    setOptionUser((prev) => {
      if (!prev) setShowAdminMenu(false);
      return !prev;
    });
  };

  const handleShowAdminMenu = () => {
    setShowAdminMenu((prev) => {
      if (!prev) setOptionUser(false);
      return !prev;
    });
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: "http://localhost:5173" } });
  };

  if (isLoading) return null;

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.box_logo} onClick={() => onViewChange("main")}>
          <img
            className={styles.logo}
            src="/src/assets/logos/logo_buenSabor.png"
            alt="Logo BuenSabor"
          />
        </div>

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
                <button style={{ marginLeft: "10px" }}>
                  {isAdmin ? "Rol | Admin" : "Mi Cuenta"}
                </button>
              </div>

              {optionUser && (
                <div className={styles.profile_options}>
                  <button onClick={() => setOpenModal(true)}>
                    Mis datos personales
                  </button>

                  {!isAdmin && (
                    <button
                      onClick={() => {
                        onViewChange("orders");
                        setOptionUser(false);
                      }}
                    >
                      Mis pedidos
                    </button>
                  )}
                  <button onClick={handleLogout}>Cerrar sesión</button>
                </div>
              )}

              <div className={styles.div_line_profile}></div>

              {isAdmin ? (
                <div className={styles.admin_nav_menu}>
                  <button
                    onClick={handleShowAdminMenu}
                    className={styles.iconButton}
                    title="Vistas"
                  >
                    <span className="material-symbols-outlined">visibility</span>
                  </button>
                  {showAdminMenu && (
                    <div className={styles.adminViewsDropdown}>
                      <button onClick={() => {
                        navigate("/admin");
                        setShowAdminMenu(false);
                      }}>Admin</button>
                      <button onClick={() => {
                        navigate("/cajero");
                        setShowAdminMenu(false);
                      }}>Cajero</button>
                      <button onClick={() => {
                        navigate("/cocinero");
                        setShowAdminMenu(false);
                      }}>Cocinero</button>
                      <button onClick={() => {
                        navigate("/delivery");
                        setShowAdminMenu(false);
                      }}>Delivery</button>
                      <button onClick={() => {
                        window.location.href = "/";
                        setShowAdminMenu(false);
                      }}>Cliente</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.cartButtonContainer}>
                  <CartButton onClick={onCartClick} />
                  {hasItemsInCart && (
                    <span className={styles.cartAlertBadge}>
                      {cartItems.length > 9 ? "9+" : cartItems.length}
                    </span>
                  )}
                </div>
              )}
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
              <div className={styles.cartButtonContainer}>
                <CartButton onClick={onCartClick} />
                {hasItemsInCart && (
                  <span className={styles.cartAlertBadge}>
                    {cartItems.length > 9 ? "9+" : cartItems.length}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

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
    </>
  );
};

export default Navbar;
