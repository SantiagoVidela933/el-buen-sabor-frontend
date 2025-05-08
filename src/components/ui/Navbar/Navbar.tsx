import { useState } from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const isLoggedIn = true;
  const [optionUser, setOptionUser] = useState(false); 

  const handleOptionUser = () => {
    setOptionUser(prev => !prev);
  }

  return (
    <div className={styles.navbar}>
      {/* Input de Busqueda */}
      <div className={styles.box_search}>
        <form className={styles.search_form}>
          <input type="text" placeholder="Buscar..." />
          <span className="material-symbols-outlined">search</span>
        </form>
      </div>

      {/* Logo App */}
      <div className={styles.box_logo}>
        <img className={styles.logo} src='/src/assets/logos/logo_buenSabor.png' />
      </div>

      {/* Perfil Usuario */}
      <div className={styles.box_user}>
        {isLoggedIn ? (
          // ESTA LOGUEADO
          <div className={styles.user_actions}>
            <div className={styles.user_actions_profile} onClick={handleOptionUser}>
              <span className="material-symbols-outlined">person</span>
              <button>Mi Cuenta</button>
            </div>
            {optionUser && (
                <div className={styles.profile_options}>
                    <a href="#">Mis datos personales</a>
                    <a href="#">Mis pedidos</a>
                    <a href="#">Cerrar sesión</a>
                </div>
              )}
            <div className={styles.div_line_profile}></div>
            <div className={styles.profile_carrito}>
              <button>
                <span className="material-symbols-outlined">local_mall</span>
              </button>
            </div>
          </div>
        ) : (
          // NO ESTA LOGUEADO
          <>
            <div className={styles.user_actions_profile}>
              <span className="material-symbols-outlined">person</span>
              <button onClick={handleOptionUser}>Iniciar sesión</button>
            </div>
            <div className={styles.div_line_profile}></div>
            <div className={styles.profile_carrito}>
              <button>
                <span className="material-symbols-outlined">local_mall</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
