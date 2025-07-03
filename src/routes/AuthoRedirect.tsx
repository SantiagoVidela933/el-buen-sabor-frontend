// src/components/AutoRedirect.tsx
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation } from "react-router-dom";

const AutoRedirect = () => {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const namespace = "https://buensaboroto.com/roles";
  const userRoles: string[] = user?.[namespace] || [];
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && !isLoading && location.pathname === "/") {
      if (userRoles.includes("ADMINISTRADOR")) return; 

      if (userRoles.includes("COCINERO")) {
        navigate("/cocinero", { replace: true });
      } else if (userRoles.includes("DELIVERY")) {
        navigate("/delivery", { replace: true });
      } else if (userRoles.includes("CAJERO")) {
        navigate("/cajero", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, userRoles, location.pathname, navigate]);

  return null;
};

export default AutoRedirect;
