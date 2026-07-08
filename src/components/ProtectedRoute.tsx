import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { LoadingScreen } from "@/components/LoadingScreen";

export function ProtectedRoute() {
  const { user, loading, restaurantId } = useAuth();

  if (loading) {
    return <LoadingScreen dvh />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!restaurantId) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
