import styles from './LandingPage.module.css';
import ProductSection from '../../components/Products/ProductSection/ProductSection';
import Destacados from '../../components/LandingPage/Destacados/Destacados';
import SobreNosotros from '../../components/LandingPage/SobreNosotros/SobreNosotros';

const LandingPage = () => {
  return (
    <div className={styles.landingPage_wrapper}>
      <ProductSection />
      <Destacados/>
      <SobreNosotros/>
    </div>
  )
}

export default LandingPage
