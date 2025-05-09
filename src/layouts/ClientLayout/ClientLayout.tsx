import { ReactNode, useState } from "react";
import Footer from "../../components/ui/Footer/Footer"
import Navbar from "../../components/ui/Navbar/Navbar"
import styles from "./ClientLayout.module.css";
import CartView from "../../components/Cart/CartView";
import PhotoLanding from "../../components/LandingPage/PhotoLanding/PhotoLanding";

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout = ({children}: ClientLayoutProps) => {

  const [showCart, setShowCart] = useState(false);


  return (
    <div className={styles.clientLayout_wrapper}>
      <Navbar onCartClick={()=>setShowCart(true)}/>
      <PhotoLanding/>
      <main className={styles.clientLayout_main}>
        {showCart ? <CartView onClose={()=>setShowCart(false)}/> : children}
      </main>
      <Footer />
    </div>
  )
}

export default ClientLayout
