import photoLanding from '/src/assets/images/fondo_1920x800.jpg';
import styles from './PhotoLanding.module.css';

const PhotoLanding = () => {
  return (
    <>
      <div className={styles.image_wrapper} style={{ backgroundImage: `url(${photoLanding})`}}>
        <p className={styles.image_title}>Las mejores hamburguesas de Mendoza</p>
      </div>
    </>
  )
}

export default PhotoLanding
