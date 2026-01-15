import { Navigate, Outlet, useLocation } from "react-router";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function ProtectedRoute() {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  const { isAuthenticated, loading } = auth;

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}