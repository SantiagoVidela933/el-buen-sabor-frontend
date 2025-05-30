// src/routes/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  allowedRoles: string[];
}

export const PrivateRoute = ({ allowedRoles }: Props) => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return <Outlet />;
};