import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage/LandingPage";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import DeliveryLayout from "../layouts/DeliveryLayout/DeliveryLayout";
import CajeroLayout from "../layouts/CajeroLayout/CajeroLayout";
import CajeroPage from "../pages/CajeroPage/CajeroPage";
import CocineroPage from "../pages/CocineroPage/CocineroPage";
import CocineroLayout from "../layouts/CocineroLayout/CocineroLayout";
import ClientLayout from "../layouts/ClientLayout/ClientLayout";
import ProtectedRoute from "./ProtectedRoute";

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
            <CocineroLayout>
              <CocineroPage />
            </CocineroLayout>
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
      <Route path="*" element={<div>404 - Página no encontrada</div>} />
    </Routes>
  );
};

export default AppRoutes;