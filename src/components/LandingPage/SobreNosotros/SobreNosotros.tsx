import styles from './SobreNosotros.module.css';

const SobreNosotros = () => {
  return (
    <section className={styles.sobreNosotros}>
      <div className={styles.contenedor}>
        <h2 className={styles.titulo}>¿Quiénes Somos?</h2>
        <p className={styles.descripcion}>
          Somos una plataforma dedicada a conectar a las personas con sus restaurantes favoritos. 
          Nuestra misión es brindar una experiencia rápida, cómoda y deliciosa, llevando los mejores sabores a tu puerta.
        </p>
        <p className={styles.descripcion}>
          Trabajamos con una amplia red de comercios locales, apoyando a emprendedores y facilitando que cada comida sea especial. 
          Ya sea un antojo de medianoche o una cena en familia, ¡estamos para vos!
        </p>
      </div>
    </section>
  );
};

export default SobreNosotros;
