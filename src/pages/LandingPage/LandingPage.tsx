import styles from './LandingPage.module.css';
import ProductSection from '../../components/Products/ProductSection/ProductSection';
import Destacados from '../../components/LandingPage/Destacados/Destacados';
import Promociones from '../../components/LandingPage/Promociones/Promociones';
import HeroSection from '../../components/LandingPage/HeroSection/HeroSection';

const LandingPage = () => {
  return (
    <div className={styles.landingPage_wrapper}>
      <Promociones/>
      <ProductSection />
      <Destacados/>
      <HeroSection/>
    </div>
  )
}

export default LandingPage
