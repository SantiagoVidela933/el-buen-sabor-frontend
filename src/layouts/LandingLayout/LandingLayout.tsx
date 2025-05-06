import { Outlet } from "react-router-dom"
import Navbar from "../../components/ui/Navbar/Navbar";
import styles from './LandingLayout.module.css';

const LandingLayout = () => {
  return (
    <div className={styles.layout}>
        <Navbar />
        <main className={styles.main}>
            <Outlet />
        </main>
    </div>
  )
}

export default LandingLayout
