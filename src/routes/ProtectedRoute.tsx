import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactElement;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const namespace = "https://buensaboroto.com/roles"; 
  if (isLoading) {
    return <div>Cargando...</div>; 
  }
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  const userRoles: string[] = user?.[namespace] || [];

  const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;

