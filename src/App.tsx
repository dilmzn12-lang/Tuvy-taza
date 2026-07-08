import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { VerifyEmail } from './pages/VerifyEmail';
import { Onboarding } from './pages/Onboarding';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CustomerMenu } from './pages/CustomerMenu';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { POSDashboard } from './pages/POSDashboard';
import { LiveMap } from './pages/LiveMap';
import { KitchenDisplay } from './pages/KitchenDisplay';
import { WaitstaffPOS } from './pages/WaitstaffPOS';
import { MenuManagement } from './pages/MenuManagement';
import { Settings } from './pages/Settings';
import { StaffManagement } from './pages/StaffManagement';
import { SuperAdminConsole } from './pages/SuperAdminConsole';
import type { Role } from './lib/types';

const SUPER_ADMIN_ONLY: Role[] = ['super_admin'];
const OWNER_AND_ADMIN: Role[] = ['owner', 'super_admin'];
const STAFF_AND_ADMIN: Role[] = ['owner', 'employee', 'super_admin'];

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/menu/:restaurantId" element={<CustomerMenu />} />

          <Route element={<ProtectedRoute allow={SUPER_ADMIN_ONLY} />}>
            <Route path="/admin" element={<SuperAdminConsole />} />
          </Route>

          <Route element={<ProtectedRoute allow={OWNER_AND_ADMIN} />}>
            <Route path="/dashboard" element={<OwnerDashboard />} />
            <Route path="/menu-management" element={<MenuManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/staff" element={<StaffManagement />} />
          </Route>

          <Route element={<ProtectedRoute allow={STAFF_AND_ADMIN} />}>
            <Route path="/pos" element={<POSDashboard />} />
            <Route path="/kitchen" element={<KitchenDisplay />} />
            <Route path="/waitstaff" element={<WaitstaffPOS />} />
            <Route path="/map" element={<LiveMap />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
