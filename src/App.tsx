import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Onboarding } from "./pages/Onboarding";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { POSDashboard } from "./pages/POSDashboard";
import { LiveMap } from "./pages/LiveMap";
import { CustomerMenu } from "./pages/CustomerMenu";
import { OwnerDashboard } from "./pages/OwnerDashboard";
import { KitchenDisplay } from "./pages/KitchenDisplay";
import { WaitstaffPOS } from "./pages/WaitstaffPOS";
import { MenuManagement } from "./pages/MenuManagement";
import { Settings } from "./pages/Settings";
import { StaffManagement } from "./pages/StaffManagement";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          <Route path="/menu/:restaurantId" element={<CustomerMenu />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<OwnerDashboard />} />
            <Route path="/pos" element={<POSDashboard />} />
            <Route path="/map" element={<LiveMap />} />
            <Route path="/menu-management" element={<MenuManagement />} />
            <Route path="/kitchen" element={<KitchenDisplay />} />
            <Route path="/waitstaff" element={<WaitstaffPOS />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/staff" element={<StaffManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
