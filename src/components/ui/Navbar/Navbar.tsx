import { useState } from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {

  const [optionUser, setOptionUser] = useState(false); // Estado para controlar el desplegable
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Estado para el menú móvil

  const handleOptionUser = () => {
    setOptionUser(prev => !prev); // Alternar el estado de las opciones de usuario
  }

  const isLoggedIn = true;

  return (
    <div className={styles.navbar}>
      {/* btn mobile */}
      <button className={styles.menu_btn} onClick={() => setMobileMenuOpen(prev => !prev)}>
        <span className="material-symbols-outlined">menu</span>
      </button>
      
      {/* menú desplegable móvil */}
      <div className={`${styles.mobile_menu} ${mobileMenuOpen ? styles.show : styles.hidden}`}>
        {isLoggedIn ? (
          <div className={styles.profile_options}>
            <div className={styles.profile_options_user}>
              <span className="material-symbols-outlined">account_circle</span>
              <button>Mi perfil</button>
            </div>
            <div className={styles.profile_options_closeSesion}>
              <span className="material-symbols-outlined">logout</span>
              <button>Cerrar sesión</button>
            </div>
          </div>
        ) : (
          <div className={styles.guest_actions}>
            <button className={styles.guest_actions_btn}>Ingresar</button>
            <button className={styles.guest_actions_btn}>Registrate</button>
          </div>
        )}
      </div>

      {/* Navbar elements */}
      <div className={styles.box_search}>
        <input type="text" placeholder="Buscar..." />
        <span className="material-symbols-outlined">search</span>
      </div>
      
      <div className={styles.box_logo}>
        <img className={styles.logo} src='/src/assets/logos/logo_buenSabor.png' />
      </div>

      <div className={styles.box_user}>
        {/* Perfil de usuario logueado */}
        <div className={styles.user_actions}>
          <div className={styles.user_actions_profile}>
            <span className="material-symbols-outlined">person</span>
            <button className={styles.profile_name} onClick={handleOptionUser}>Nombre Apellido</button>
            {/* Opciones de perfil solo si optionUser es true */}
            {optionUser && (
              <div className={styles.profile_options}>
                <div className={styles.profile_options_user}>
                  <span className="material-symbols-outlined">account_circle</span>
                  <button>Mi perfil</button>
                </div>
                <div className={styles.profile_options_closeSesion}>
                  <span className="material-symbols-outlined">logout</span>
                  <button>Cerrar sesión</button>
                </div>
              </div>
            )}
          </div>
          <div className={styles.div_line_profile}></div>
          <div className={styles.profile_carrito}>
            <button>
              <span className="material-symbols-outlined">local_mall</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
