import { Route, Routes } from 'react-router-dom'
import LandingPage from '../pages/LandingPage/LandingPage'
import ClientLayout from '../layouts/ClientLayout/ClientLayout'
import { CartProvider } from '../context/CartContext'

const AppRoutes = () => {
  return (
    <Routes>
      
      {/* Rol CLIENTE */}
      <Route path="/" element={
          <CartProvider>
            <ClientLayout>
                <LandingPage />
            </ClientLayout>
          </CartProvider>
        }
      />

    </Routes>
  )
}

export default AppRoutes
