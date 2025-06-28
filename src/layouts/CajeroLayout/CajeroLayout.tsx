import { ReactNode, useState } from "react";
import Footer from "../../components/ui/Footer/Footer"
import Navbar from "../../components/ui/Navbar/Navbar"
import styles from "./CajeroLayout.module.css";
import PhotoLanding from "../../components/LandingPage/PhotoLanding/PhotoLanding";

interface CajeroLayoutProps {
  children: ReactNode;
}

const CajeroLayout = ({children}: CajeroLayoutProps) => {

  const [activeView, setActiveView] = useState<'main'|'cart'|'orders'>('main');

  return (
    <div className={styles.cajeroLayout_wrapper}>
      <Navbar onCartClick={() => setActiveView('cart')} onViewChange={setActiveView}/>
      <PhotoLanding/>
      <main className={styles.cajeroLayout_main}>
        {activeView === 'main' && children}
      </main>
      <Footer />
    </div>
  )
}

export default CajeroLayout