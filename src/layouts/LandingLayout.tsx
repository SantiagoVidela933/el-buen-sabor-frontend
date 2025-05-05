import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar/Navbar"

const LandingLayout = () => {
  return (
    <>
        <Navbar />
        <main>
            <Outlet />
        </main>
    </>
  )
}

export default LandingLayout
