import { Route, Routes } from 'react-router-dom'
import LandingLayout from '../layouts/LandingLayout'
import Landing from '../pages/Landing'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Público */}
      <Route path="/" element={<LandingLayout />}>
        <Route index element={<Landing  />} />
        {/* <Route path="menu" element={<MenuPage />} /> */}
        {/* <Route path="login" element={<Login />} /> */}
        </Route>

      {/* Cliente */}
      {/* <Route path="/cliente" element={<ClienteLayout />}>
        <Route index element={<MenuCliente />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="historial" element={<HistorialPedidos />} />
      </Route> */}

      {/* Admin */}
      {/* <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="usuarios" element={<GestionUsuarios />} />
        <Route path="estadisticas" element={<Estadisticas />} />
      </Route> */}

      {/* Repartidor, Cocinero, Cajero... similar */}
    </Routes>

  )
}

export default AppRoutes
