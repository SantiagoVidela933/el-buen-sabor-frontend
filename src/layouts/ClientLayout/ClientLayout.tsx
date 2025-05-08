import { ReactNode } from "react";
import Footer from "../../components/ui/Footer/Footer"
import Navbar from "../../components/ui/Navbar/Navbar"
import styles from "./ClientLayout.module.css";

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout = ({children}: ClientLayoutProps) => {
  return (
    <div className={styles.clientLayout_wrapper}>
      <Navbar />
      <main className={styles.clientLayout_main}>{children}</main>
      <Footer />
    </div>
  )
}

export default ClientLayout
