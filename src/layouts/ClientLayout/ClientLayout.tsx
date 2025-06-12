import { ReactNode, useState } from "react";
import Footer from "../../components/ui/Footer/Footer"
import Navbar from "../../components/ui/Navbar/Navbar"
import styles from "./ClientLayout.module.css";
import CartView from "../../components/Cart/CartView";
import PhotoLanding from "../../components/LandingPage/PhotoLanding/PhotoLanding";
import UserOrderList from "../../components/User/UserOrderList/UserOrderList";
import SobreNosotros from "../../components/LandingPage/SobreNosotros/SobreNosotros";
import Destacados from "../../components/LandingPage/Destacados/Destacados";

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout = ({children}: ClientLayoutProps) => {

  const [activeView, setActiveView] = useState<'main'|'cart'|'orders'>('main');

  return (
    <div className={styles.clientLayout_wrapper}>
      <Navbar onCartClick={() => setActiveView('cart')} onViewChange={setActiveView}/>
      <PhotoLanding/>
      <main className={styles.clientLayout_main}>
        {activeView === 'cart' && <CartView onClose={() => setActiveView('main')} />}
        {activeView === 'orders' && <UserOrderList onBack={() => setActiveView('main')} />}
        {activeView === 'main' && children}
      </main>
      <Footer />
    </div>
  )
}

export default ClientLayout
