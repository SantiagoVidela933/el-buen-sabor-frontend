import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage/LandingPage";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import DeliveryLayout from "../layouts/DeliveryLayout/DeliveryLayout";
import CajeroLayout from "../layouts/CajeroLayout/CajeroLayout";
import CajeroPage from "../pages/CajeroPage/CajeroPage";
import CocineroLayout from "../layouts/CocineroLayout/CocineroLayout";
import ClientLayout from "../layouts/ClientLayout/ClientLayout";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../pages/Unauthorized/Unauthorized";
import RegistroPage from "../pages/RegistroPage/RegistroPage";

const AppRoutes = () => {
  return (
    <Routes>
     
      {/* Rol CLIENTE (acceso libre) */}
      <Route
        path="/"
        element={
          <ClientLayout>
            <LandingPage />
          </ClientLayout>
        }
      />
      
      <Route path="/registro" element={<RegistroPage />}/>
      
      {/* ADMIN: acceso a admin + vistas de cocinero, delivery y cajero */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMINISTRADOR"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      />

      {/* COCINERO: landing + cocinero */}
      <Route
        path="/cocinero/*"
        element={
          <ProtectedRoute allowedRoles={["COCINERO", "ADMINISTRADOR"]}>
            <CocineroLayout/>
          </ProtectedRoute>
        }
      />

      {/* DELIVERY: landing + delivery */}
      <Route
        path="/delivery/*"
        element={
          <ProtectedRoute allowedRoles={["DELIVERY", "ADMINISTRADOR"]}>
            <DeliveryLayout />
          </ProtectedRoute>
        }
      />

      {/* CAJERO: landing + cajero */}
      <Route
        path="/cajero/*"
        element={
          <ProtectedRoute allowedRoles={["CAJERO", "ADMINISTRADOR"]}>
            <CajeroLayout>
              <CajeroPage />
            </CajeroLayout>
          </ProtectedRoute>
        }
      />

      {/* Ruta comodín */}
      <Route path="/unauthorized" element={<Unauthorized/>} />
    </Routes>
  );
};

export default AppRoutes;