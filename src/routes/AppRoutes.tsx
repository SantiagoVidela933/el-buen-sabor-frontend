import { Route, Routes } from 'react-router-dom'
import LandingPage from '../pages/LandingPage/LandingPage'
import ClientLayout from '../layouts/ClientLayout/ClientLayout'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ClientLayout>
          <LandingPage />
        </ClientLayout>
        }
      />
    </Routes>
  )
}

export default AppRoutes
