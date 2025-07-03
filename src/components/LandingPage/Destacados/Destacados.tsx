import styles from './Destacados.module.css';
import ubicacionIcon from '../../../assets/images/ubicacion-icon.png';
import comidaIcon from '../../../assets/images/comida-icon.png';
import chicaComiendo from '../../../assets/images/chica-pizza.webp';

const Destacados = () => {
  return (
    <section className={styles.destacados}>
      <div className={styles.contenido}>
        <img src={chicaComiendo} alt="Chica comiendo pizza" className={styles.imagen} />
        
        <div className={styles.info}>
          <div className={styles.item}>
            <img src={ubicacionIcon} alt="Icono ubicación" className={styles.icono} />
            <div>
              <h3 className={styles.titulo}>Top Ciudades</h3>
              <p className={styles.texto}>Buenos Aires, Córdoba, Rosario, La Plata, Mendoza, Mar del Plata.</p>
            </div>
          </div>

          <div className={styles.item}>
            <img src={comidaIcon} alt="Icono comida" className={styles.icono} />
            <div>
              <h3 className={styles.titulo}>Top Comidas</h3>
              <p className={styles.texto}>Helados, Pizzas, Hamburguesas, Empanadas, Postres, Sándwiches.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Destacados;
