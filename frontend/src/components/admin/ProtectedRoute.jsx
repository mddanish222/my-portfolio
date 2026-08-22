import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "/admin-portal";
    return <Navigate to={`${ADMIN_PATH}/login`} replace />;
  }

  return children;
}

export default ProtectedRoute;
