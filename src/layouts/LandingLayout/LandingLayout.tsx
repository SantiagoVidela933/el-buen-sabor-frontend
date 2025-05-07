import { Outlet } from "react-router-dom"
import Navbar from "../../components/ui/Navbar/Navbar";
import styles from './LandingLayout.module.css';
import Footer from "../../components/ui/Footer/Footer";

const LandingLayout = () => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default LandingLayout
