import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Loader2 } from "lucide-react";

export function ProtectedRoute() {
  const { user, loading, restaurantId } = useAuth();

  if (loading) {
    return <div className="min-h-[100dvh] bg-[#050505] flex items-center justify-center"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!restaurantId) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
