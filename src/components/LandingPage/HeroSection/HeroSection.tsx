import styles from './HeroSection.module.css';
import heroImage from '../../../assets/images/comida-heroSection.png';

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.imageContainer}>
        <img src={heroImage} alt="Comida" />
      </div>
      <div className={styles.textContainer}>
        <h2>Todo lo que necesitás, ¡te lo llevamos!</h2>
        <p>
          En Buen Sabor podés dejar volar tu imaginación, porque todo lo que se te antoje lo llevamos directo desde la cocina hasta tu mesa, ¡en minutos!
        </p>
        <p>
          ¿Lo querés? ¡Lo tenés! Pedí tus platos favoritos de los mejores locales gastronómicos, hacé tu pedido fácil y rápido, y disfrutá de una experiencia de sabor sin moverte de donde estés.
        </p>
        <p>
          En simples pasos podés tener lo que quieras directamente en tu puerta: descubrí, pedí y recibí comida deliciosa con Buen Sabor.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
