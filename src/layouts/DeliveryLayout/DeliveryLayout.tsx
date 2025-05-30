import { useState } from 'react';
import PhotoLanding from '../../components/LandingPage/PhotoLanding/PhotoLanding';
import Footer from '../../components/ui/Footer/Footer';
import Navbar from '../../components/ui/Navbar/Navbar';
import DeliveryPage from '../../pages/DeliveryPage/DeliveryPage';
import styles from './DeliveryLayout.module.css';

const DeliveryLayout = () => {

  const [, setActiveView] = useState<string>("clientes");

  return (
    <div className={styles.deliveryLayout_wrapper}>
      <Navbar onCartClick={() => setActiveView('cart')} onViewChange={setActiveView}/>
      <PhotoLanding />
      <main className={styles.deliveryLayout_main}>
        <DeliveryPage />
      </main>
      <Footer />
    </div>
  )
}

export default DeliveryLayout
