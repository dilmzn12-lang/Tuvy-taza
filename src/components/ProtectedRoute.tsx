import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { VerifyEmailBanner } from './VerifyEmailBanner';
import { homeRouteForRole, isManagementRole, requiresRestaurant } from '@/lib/roles';
import type { Role } from '@/lib/types';

interface ProtectedRouteProps {
  allow?: Role[];
}

export function ProtectedRoute({ allow }: ProtectedRouteProps) {
  const { user, loading, restaurantId, role, emailVerified } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#050505]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!role) {
    return <Navigate to={homeRouteForRole(null)} replace />;
  }

  if (allow && !allow.includes(role)) {
    return <Navigate to={homeRouteForRole(role)} replace />;
  }

  if (requiresRestaurant(role) && !restaurantId) {
    return <Navigate to="/onboarding" replace />;
  }

  const showVerificationBanner = isManagementRole(role) && !emailVerified;

  if (showVerificationBanner) {
    return (
      <div className="min-h-[100dvh] bg-[#050505] text-slate-300">
        <VerifyEmailBanner />
        <Outlet />
      </div>
    );
  }

  return <Outlet />;
}
