import "./global.css";
import React, { useState } from "react";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/lib/i18n";
import { AuthProvider, ProtectedRoute } from "@/lib/auth";
import { AnimeStoreProvider } from "@/lib/animeStore";
import LoadingScreen from "@/components/LoadingScreen";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AnimeDetails from "./pages/AnimeDetails";
import Browse from "./pages/Browse";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AnimeRequest from "./pages/AnimeRequest";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(() => {
    // Only show loading on first visit per session
    return !sessionStorage.getItem('aniwa_app_loaded');
  });

  if (isLoading) {
    return <LoadingScreen onComplete={() => {
      setIsLoading(false);
      sessionStorage.setItem('aniwa_app_loaded', 'true');
    }} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <AnimeStoreProvider>
            <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/anime/:id" element={
                  <ProtectedRoute>
                    <AnimeDetails />
                  </ProtectedRoute>
                } />
                <Route path="/anime" element={<Browse />} />
                <Route path="/movies" element={<Browse />} />
                <Route path="/trending" element={<Browse />} />
                <Route path="/anime-request" element={<AnimeRequest />} />
                <Route path="/my-list" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <Admin />
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            </TooltipProvider>
          </AnimeStoreProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
