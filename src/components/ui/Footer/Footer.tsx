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
                    <p>Trabaja con nosotros</p>
                </div>
                <div className={styles.texts_second}>
                    <h2>¿Necesitas ayuda?</h2>
                    <p>Contactanos al 123456789</p>
                    <p>Mira el video de explicacion</p>
                </div>
                <div className={styles.texts_third}>
                    <h2>Descubre</h2>
                    <p>Dias de celebración</p>
                    <p>Juegos recreativos</p>
                    <p>Videos explicativos</p>
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
