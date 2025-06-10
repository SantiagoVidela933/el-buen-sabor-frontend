import styles from './HeroSection.module.css';
import heroImage from '../../../assets/images/comida-heroSection.png'; // Asegúrate de tener una imagen en esa ruta

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.textContainer}>
        <h2>Todo lo que necesitás, ¡te lo llevamos!</h2>
        <p>
          En el Buen Sabor podés dejar volar tu imaginación porque ahora todo lo que quieras lo llevamos directo desde tu cabeza a donde estés, ¡en minutos!
        </p>
        <p>
          ¿Lo querés? ¡Lo tenés! Pedí a los mejores restaurantes, hacé el pedido del súper, comprá la comida para tu mascota, la bebida para los amigos, pedí lo que necesites de la farmacia ¡y mucho más!
        </p>
        <p>
          En simples pasos podés tener lo que quieras directamente en tu puerta: descubrí, pedí y recibí a domicilio con el Buen Sabor.
        </p>
      </div>
      <div className={styles.imageContainer}>
        <img src={heroImage} alt="Comida" />
      </div>
    </section>
  );
};

export default HeroSection;
