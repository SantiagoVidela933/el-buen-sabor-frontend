import { Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage/LandingPage';
import ClientLayout from '../layouts/ClientLayout/ClientLayout';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';
import DeliveryLayout from '../layouts/DeliveryLayout/DeliveryLayout';
import CajeroLayout from '../layouts/CajeroLayout/CajeroLayout';
import CajeroPage from '../pages/CajeroPage/CajeroPage';
import CocineroPage from '../pages/CocineroPage/CocineroPage';
import CocineroLayout from '../layouts/CocineroLayout/CocineroLayout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rol CLIENTE */}
      <Route
        path="/"
        element={
          <ClientLayout>
            <LandingPage />
          </ClientLayout>
        }
      />

      {/* Rol ADMINISTRADOR */}
      <Route path="/admin" element={<AdminLayout />} />

      {/* Rol DELIVERY */}
      <Route path="/delivery" element={<DeliveryLayout />} />

      {/* Rol CAJERO */}
      <Route
        path="/cajero"
        element={
          <CajeroLayout>
            <CajeroPage />
          </CajeroLayout>
        }
      />

      {/* Rol COCINERO */}
      <Route
        path="/cocinero"
        element={
          <CocineroLayout>
            <CocineroPage />
          </CocineroLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
