import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.footer}>
        <div className={styles.box_logo}>
            <img src="/src/assets/logos/logo_buenSabor.png" alt="logo_bs" />
        </div>
        <div className={styles.box_main}>
            <div className={styles.main_texts}>
                <div className={styles.texts_first}>
                    <h2>Conocenos</h2>
                    <p>¿Quienes somos?</p>
                </div>
                <div className={styles.texts_second}>
                    <h2>Contacto</h2>
                    <p>+54-9-1234567890</p>
                    <p>elbuensabor@gmail.com</p>
                    <p>Mendoza - Argentina</p>
                </div>
            </div>
            <div className={styles.main_icons}>
                <a href="#" aria-label="Instagram">
                    <i className="fa-brands fa-instagram"></i>
                </a>
                <a href="#" aria-label="Facebook">
                    <i className="fa-brands fa-facebook"></i>
                </a>
                <a href="#" aria-label="Instagram">
                    <i className="fa-brands fa-twitter"></i>
                </a>
                <a href="#" aria-label="Instagram">
                    <i className="fa-brands fa-whatsapp"></i>
                </a>
            </div>
        </div>
        <div className={styles.box_copyright}>
            <h3>© 2025 El Buen Sabor. Todos los derechos reservados.</h3>
        </div>
    </div>
  )
}

export default Footer
