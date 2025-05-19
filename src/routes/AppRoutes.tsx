import { Route, Routes } from 'react-router-dom'
import { CartProvider } from '../context/CartContext'
import { OrderProvider } from '../context/OrderContext'
import LandingPage from '../pages/LandingPage/LandingPage'
import ClientLayout from '../layouts/ClientLayout/ClientLayout'
import AdminLayout from '../layouts/AdminLayout/AdminLayout'
import DeliveryLayout from '../layouts/DeliveryLayout/DeliveryLayout'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rol CLIENTE */}
      <Route path="/" element={
          <CartProvider>
            <OrderProvider>
              <ClientLayout>
                <LandingPage />
            </ClientLayout>
            </OrderProvider>
          </CartProvider>
        }
      />
      {/* Rol ADMINISTRADOR */}
      <Route path="/admin" element={<AdminLayout />} />

      {/* Rol DELIVERY */}
      <Route path="/delivery" element={<DeliveryLayout />} />

    </Routes>
  )
}

export default AppRoutes
