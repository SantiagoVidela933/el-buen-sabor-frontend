import { useState } from 'react';
import styles from './Navbar.module.css';
import CartButton from './CartButton/CartButton';
import Modal from '../Modal/Modal';
import UserData from '../../User/UserData/UserData';

interface NavbarProps {
  onCartClick: ()=>void;
  onViewChange: (view: 'main' | 'cart' | 'orders') => void;
}

const Navbar = ({onCartClick, onViewChange}: NavbarProps) => {
  const isLoggedIn = true;
  const [optionUser, setOptionUser] = useState(false); 
  
  const [openModal, setOpenModal] = useState(false);

  const handleOptionUser = () => {
    setOptionUser(prev => !prev);
  }

  return (
    <div className={styles.navbar}>
      {/* Logo App */}
      <div className={styles.box_logo} onClick={() => onViewChange('main')}>
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
                    <button onClick={() => setOpenModal(true)}>Mis datos personales</button>
                    {openModal && (
                      <Modal onClose={() => {setOpenModal(false); setOptionUser(false);}}>
                        <UserData />
                      </Modal>
                    )}
                    <button onClick={() => { onViewChange('orders'); setOptionUser(false);}}>Mis pedidos</button>
                    <button>Cerrar sesión</button>
                </div>
                
              )}
            <div className={styles.div_line_profile}></div>
            <CartButton onClick={onCartClick} />
          </div>
        ) : (
          // NO ESTA LOGUEADO
          <>
            <div className={styles.user_actions_profile}>
              <span className="material-symbols-outlined">person</span>
              <button onClick={handleOptionUser}>Iniciar sesión</button>
            </div>
            <div className={styles.div_line_profile}></div>
            <CartButton onClick={onCartClick} />
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
