import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BottomNav } from "@/components/BottomNav";
import { DashboardPage } from "@/pages/DashboardPage";
import { PoliciesPage } from "@/pages/PoliciesPage";
import { PolicyDetailPage } from "@/pages/PolicyDetailPage";
import { UploadPage } from "@/pages/UploadPage";
import { RenewPage } from "@/pages/RenewPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { MotAdvisoriesPage } from "@/pages/MotAdvisoriesPage";
import { ClaimPage } from "@/pages/ClaimPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="max-w-lg mx-auto relative min-h-screen bg-[#F5F4FB]">
          <main>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/policies" element={<PoliciesPage />} />
              <Route path="/policies/:id" element={<PolicyDetailPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/renew" element={<RenewPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route
                path="/mot-advisories/:id"
                element={<MotAdvisoriesPage />}
              />
              <Route path="/claim" element={<ClaimPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
