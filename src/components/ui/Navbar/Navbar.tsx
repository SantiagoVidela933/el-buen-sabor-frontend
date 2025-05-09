import { useState } from 'react';
import styles from './Navbar.module.css';
import CarritoButton from './CarritoButton/CarritoButton';

const Navbar = () => {
  const isLoggedIn = false;
  const [optionUser, setOptionUser] = useState(false); 

  const handleOptionUser = () => {
    setOptionUser(prev => !prev);
  }

  return (
    <div className={styles.navbar}>
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
            <CarritoButton />
          </div>
        ) : (
          // NO ESTA LOGUEADO
          <>
            <div className={styles.user_actions_profile}>
              <span className="material-symbols-outlined">person</span>
              <button onClick={handleOptionUser}>Iniciar sesión</button>
            </div>
            <div className={styles.div_line_profile}></div>
            <CarritoButton />
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
