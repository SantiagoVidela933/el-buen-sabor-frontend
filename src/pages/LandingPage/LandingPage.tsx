import styles from './LandingPage.module.css';
import PhotoLanding from '../../components/LandingPage/PhotoLanding/PhotoLanding';
import ProductSection from '../../components/Products/ProductSection/ProductSection';

const LandingPage = () => {
  return (
    <div className={styles.landingPage_wrapper}>
      <PhotoLanding />
      <ProductSection />
    </div>
  )
}

export default LandingPage
