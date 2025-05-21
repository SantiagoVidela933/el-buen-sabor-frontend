import { ReactNode, useState } from "react";
import Footer from "../../components/ui/Footer/Footer";
import Navbar from "../../components/ui/Navbar/Navbar";
import styles from "./CocineroLayout.module.css";
import PhotoLanding from "../../components/LandingPage/PhotoLanding/PhotoLanding";

import PedidosView from "../../components/Views/CocineroViews/PedidosView/PedidosView";
import { columns, pedidos } from "../../data/pedidosCocinero";
import Dashboard from "../../components/Views/CocineroViews/DashboardCocinero/DashboardCocinero";
import ProductosView from "../../components/Views/CocineroViews/StockView/ProductosView/ProductosView";
import IngredientesView from "../../components/Views/CocineroViews/StockView/IngredientesView/IngredientesView";

interface CocineroLayoutProps {
  children: ReactNode;
}

const CocineroLayout = ({ children }: CocineroLayoutProps) => {
  const [activeView, setActiveView] = useState<"main" | "cart" | "orders">(
    "main"
  );
  const [selectedDashboardView, setSelectedDashboardView] = useState<
    string | null
  >(null);

  const renderActiveView = () => {
    console.log("selectedDashboardView:", selectedDashboardView);
    switch (selectedDashboardView) {
      case "pedidos":
        return (
          <PedidosView
            columns={columns}
            data={pedidos}
            title="LISTA DE PEDIDOS A PREPARAR"
            itemsPerPage={5}
          />
        );
      case "productosStock":
        return <ProductosView />;
      case "ingredientesStock":
        return <IngredientesView />;
      default:
        return <div>Selecciona una opción del panel</div>;
    }
  };

  const handleDashboardSelect = (view: string) => {
    setSelectedDashboardView(view);
  };

  return (
    <div className={styles.cocineroLayout_wrapper}>
      <Navbar
        onCartClick={() => setActiveView("cart")}
        onViewChange={setActiveView}
      />
      <PhotoLanding />

      {activeView === "main" && (
        <div className={styles.dashboard_and_content}>
          <Dashboard onSelect={handleDashboardSelect} />
          <main className={styles.cocineroLayout_main}>
            {!selectedDashboardView && children}
            {selectedDashboardView && renderActiveView()}
          </main>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CocineroLayout;
