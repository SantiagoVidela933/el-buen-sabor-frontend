import PhotoLanding from '../../components/LandingPage/PhotoLanding/PhotoLanding';
import Footer from '../../components/ui/Footer/Footer';
import DeliveryPage from '../../pages/DeliveryPage/DeliveryPage';
import styles from './DeliveryLayout.module.css';

const DeliveryLayout = () => {
  return (
    <div className={styles.deliveryLayout_wrapper}>
      <PhotoLanding />
      <main className={styles.deliveryLayout_main}>
        <DeliveryPage />
      </main>
      <Footer />
    </div>
  )
}

export default DeliveryLayout
