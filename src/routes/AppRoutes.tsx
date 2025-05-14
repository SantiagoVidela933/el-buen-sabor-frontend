import { Route, Routes } from 'react-router-dom'
import LandingPage from '../pages/LandingPage/LandingPage'
import AdminPage from '../pages/AdminPage/AdminPage'
import ClientLayout from '../layouts/ClientLayout/ClientLayout'
import AdminLayout from '../layouts/AdminLayout/AdminLayout'
import { CartProvider } from '../context/CartContext'
import { OrderProvider } from '../context/OrderContext'

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
      <Route path="/admin" element={
          <AdminLayout>
            <AdminPage />
          </AdminLayout>
        }
      />

    </Routes>
  )
}

export default AppRoutes
