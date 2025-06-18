
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/ThemeProvider.jsx";
import AuthProvider from "./components/AuthProvider";
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

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="hopznite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-1">
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
                    
                    {/* Protected Routes */}
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
                    
                    {/* Catch all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
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
