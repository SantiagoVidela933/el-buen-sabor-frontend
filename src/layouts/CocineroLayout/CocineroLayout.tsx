import { useState } from "react";
import Footer from "../../components/ui/Footer/Footer";
import Navbar from "../../components/ui/Navbar/Navbar";
import styles from "./CocineroLayout.module.css";
import PhotoLanding from "../../components/LandingPage/PhotoLanding/PhotoLanding";
import PedidosView from "../../components/CocineroViews/PedidosView";
import Dashboard from "../../components/ui/DashboardCocinero/DashboardCocinero";
import StockProducto from "../../components/AdminViews/StockView/StockProducto/StockProducto";
import StockIngrediente from "../../components/AdminViews/StockView/StockIngrediente/StockIngrediente";
import RubroProducto from "../../components/AdminViews/RubrosView/RubroProducto/RubroProducto";
import RubroIngrediente from "../../components/AdminViews/RubrosView/RubroIngrediente/RubroIngrediente";

const CocineroLayout = () => {
  const [activeView, setActiveView] = useState<string>("clientes");

  const renderActiveView = () => {
    switch (activeView) {
      case "pedidos":
        return <PedidosView/>
      case "stockProducto":
        return <StockProducto />; 
      case "stockIngrediente":
        return <StockIngrediente />; 
      case "rubroProducto":
        return <RubroProducto />;   
      case "rubroIngrediente":
        return <RubroIngrediente />; 
      default:
        return <div>Selecciona una opción del panel</div>;
    }
  };

  return (
    <div className={styles.cocineroLayout_wrapper}>
      <Navbar
        onCartClick={() => setActiveView("cart")}
        onViewChange={setActiveView}
      />
      <PhotoLanding />

        <div className={styles.dashboard_and_content}>
          <Dashboard onSelect={setActiveView} />
          <main className={styles.cocineroLayout_main}>
            {renderActiveView()}
          </main>
        </div>

      <Footer />
    </div>
  );
};

export default CocineroLayout;
