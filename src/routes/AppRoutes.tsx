// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import { OrderProvider } from "../context/OrderContext";
import LandingPage from "../pages/LandingPage/LandingPage";
import LoginPage from "../../src/pages/LoginPage/LoginPage";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import DeliveryLayout from "../layouts/DeliveryLayout/DeliveryLayout";
import CajeroLayout from "../layouts/CajeroLayout/CajeroLayout";
import CajeroPage from "../pages/CajeroPage/CajeroPage";
import CocineroPage from "../pages/CocineroPage/CocineroPage";
import CocineroLayout from "../layouts/CocineroLayout/CocineroLayout";
import { PrivateRoute } from "./PrivateRoute";
import ClientLayout from "../layouts/ClientLayout/ClientLayout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* NO AUTORIZADO */}
      <Route path="/unauthorized" element={<div>No autorizado</div>} />

      {/* Rol CLIENTE (acceso libre) */}
      <Route
        path="/"
        element={
          <CartProvider>
            <OrderProvider>
              <ClientLayout>
                <LandingPage />
            </ClientLayout>
            </OrderProvider>
          </CartProvider>
        }
      />

      {/* Rol ADMIN */}
      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />} />
      </Route>

      {/* Rol DELIVERY */}
      <Route element={<PrivateRoute allowedRoles={["delivery"]} />}>
        <Route path="/delivery" element={<DeliveryLayout />} />
      </Route>

      {/* Rol CAJERO */}
      <Route element={<PrivateRoute allowedRoles={["cajero"]} />}>
        <Route
          path="/cajero"
          element={
            <CajeroLayout>
              <CajeroPage />
            </CajeroLayout>
          }
        />
      </Route>

      {/* Rol COCINERO */}
      <Route element={<PrivateRoute allowedRoles={["cocinero"]} />}>
        <Route
          path="/cocinero"
          element={
            <CocineroLayout>
              <CocineroPage />
            </CocineroLayout>
          }
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div>404 - Página no encontrada</div>} />
    </Routes>
  );
};

export default AppRoutes;