import styles from './LandingPage.module.css';
import ProductSection from '../../components/Products/ProductSection/ProductSection';

const LandingPage = () => {
  return (
    <div className={styles.landingPage_wrapper}>
      <ProductSection />
    </div>
  )
}

export default LandingPage
