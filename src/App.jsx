import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/ThemeProvider.jsx";
import AuthProvider, { useAuth } from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register.jsx";
import DJDashboard from "./pages/DJ/DJDashboard.jsx";
import PubDashboard from "./pages/Pub/PubDashboard.jsx";
import CustomerDashboard from "./pages/Customer/CustomerDashboard.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import DJProfile from "./pages/DJProfile.jsx";
import VenueProfile from "./pages/VenueProfile.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import Events from "./pages/Events.jsx";
import DJs from "./pages/DJs.jsx";
import Venues from "./pages/Venues.jsx";
import NotFound from "./pages/NotFound.jsx";
import EventManagementDashboard from "./pages/EventManagement/EventManagementDashboard.jsx";
import EventManagementProfile from './pages/EventManagementProfile.jsx';
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import LoginRequiredModal from './components/ui/LoginRequiredModal';

const queryClient = new QueryClient();

const publicRoutes = ['/', '/login', '/register'];

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const location = window.location.pathname;
  const navigate = useNavigate();

  // If the current route is public, just render children
  if (publicRoutes.includes(location)) {
    return children;
  }

  // If not authenticated and not on a public route, show modal
  if (!isAuthenticated) {
    return (
      <LoginRequiredModal
        open={true}
        onLogin={() => {
          setModalOpen(false);
          navigate('/login');
        }}
        onClose={() => {
          setModalOpen(false)
          navigate('/')
        }}
      />
    );
  }

  // Authenticated, render children
  return children;
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="hopznite-ui-theme">
        <TooltipProvider>
          <Sonner position="top-right" richColors closeButton />
          <BrowserRouter>
            <AuthProvider>
              <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <RequireAuth>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/events" element={<Events />} />
                      <Route path="/events/:id" element={<EventDetails />} />
                      <Route path="/djs" element={<DJs />} />
                      <Route path="/djs/:id" element={<DJProfile />} />
                      <Route path="/venues" element={<Venues />} />
                      <Route path="/venues/:id" element={<VenueProfile />} />
                      <Route path="/dashboard/dj" element={
                        <ProtectedRoute allowedRoles={["DJ"]}>
                          <DJDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/pub" element={
                        <ProtectedRoute allowedRoles={["PubOwner"]}>
                          <PubDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/customer" element={
                        <ProtectedRoute allowedRoles={["Customer"]}>
                          <CustomerDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/admin" element={
                        <ProtectedRoute allowedRoles={["Admin"]}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard/eventmanagement" element={
                        <ProtectedRoute allowedRoles={["EventManagement"]}>
                          <EventManagementDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/eventmgmt/:name" element={<EventManagementProfile />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </RequireAuth>
                </main>
                <Footer />
              </div>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
