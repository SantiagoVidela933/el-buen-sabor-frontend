import { Route, Routes } from 'react-router-dom'
import LandingPage from '../pages/LandingPage/LandingPage'
import ClientLayout from '../layouts/ClientLayout/ClientLayout'
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

    </Routes>
  )
}

export default AppRoutes
