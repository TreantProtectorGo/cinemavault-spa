import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Result } from "antd";
import { useAuth } from "../hooks/useAuth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function AdminRoute({ children }: ProtectedRouteProps) {
  const { isAdmin } = useAuth();

  return (
    <ProtectedRoute>
      {isAdmin ? (
        children
      ) : (
        <Result
          status="403"
          title="Access denied"
          subTitle="This area is restricted to CinemaVault administrators."
        />
      )}
    </ProtectedRoute>
  );
}
