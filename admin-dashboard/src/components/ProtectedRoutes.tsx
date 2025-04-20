import { JSX } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

/**
 * Protects a route from unauthenticated users.
 * If no user is logged in, redirects to /login.
 */
export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading)
    return <div className="flex items-center justify-center h-screen">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};
