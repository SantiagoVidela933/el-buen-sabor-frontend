import { useState } from 'react';
import styles from './AdminLayout.module.css';
import PhotoLanding from '../../components/LandingPage/PhotoLanding/PhotoLanding';
import Footer from '../../components/ui/Footer/Footer';
import Dashboard from '../../components/ui/Dashboard/Dashboard';
import UserEmpleado from '../../components/AdminViews/UserView/UserEmpleado/UserEmpleado';
import UserClient from '../../components/AdminViews/UserView/UserClient/UserClient';
import StockProducto from '../../components/AdminViews/StockView/StockProducto/StockProducto';
import StockIngrediente from '../../components/AdminViews/StockView/StockIngrediente/StockIngrediente';
import RubroProducto from '../../components/AdminViews/RubrosView/RubroProducto/RubroProducto';
import RubroIngrediente from '../../components/AdminViews/RubrosView/RubroIngrediente/RubroIngrediente';
import ClientStats from '../../components/AdminViews/StatsView/ClientStats/ClientStats';
import Movimientos from '../../components/AdminViews/StatsView/Movimientos/Movimientos';
import ProductStats from '../../components/AdminViews/StatsView/ProductStats/ProductStats';
import Facturacion from '../../components/AdminViews/Facturacion/Facturacion';
import Navbar from '../../components/ui/Navbar/Navbar';
import Promociones from '../../components/AdminViews/PromocionesView/Promociones';

const AdminLayout = () => {

  const [activeView, setActiveView] = useState<string>("clientes");

  const renderActiveView = () => {
    switch (activeView) {
      case "userEmpleado":
        return <UserEmpleado />;
      case "userCliente":
        return <UserClient />;
      case "stockProducto":
        return <StockProducto />; 
      case "stockIngrediente":
        return <StockIngrediente />; 
      case "rubroProducto":
        return <RubroProducto />;   
      case "rubroIngrediente":
        return <RubroIngrediente />;       
      case "clientStats":
        return <ClientStats />;  
      case "movimientos":
        return <Movimientos />; 
      case "productStats":
        return <ProductStats />;
      case "facturacion":
        return <Facturacion />; 
      case "promociones":
        return <Promociones />; 
      default:
        return <div>Selecciona una opción del panel</div>;
    }
  };

  return (
    <div className={styles.adminLayout_wrapper}>
      <Navbar onCartClick={() => setActiveView('cart')} onViewChange={setActiveView}/>
      <PhotoLanding />
      <div className={styles.adminLayout_content}>
        <Dashboard onSelect={setActiveView} />
        <main className={styles.adminLayout_main}>
          {renderActiveView()}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AdminLayout
