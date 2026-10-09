import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GardenProvider } from "./context/GardenContext.jsx";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import OfflineBanner from "./components/OfflineBanner.jsx";
import Toast from "./components/Toast.jsx";

import LandingPage from "./pages/LandingPage.jsx";
import GardenSetup from "./pages/GardenSetup.jsx";
import GardenPlanner from "./pages/GardenPlanner.jsx";
import PlantHealthScanner from "./pages/PlantHealthScanner.jsx";
import TouchGrassMode from "./pages/TouchGrassMode.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CareCalendar from "./pages/CareCalendar.jsx";
import SettingsAbout from "./pages/SettingsAbout.jsx";

export default function App() {
  return (
    <GardenProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#F6F4EC] text-[#26352C]">
          <OfflineBanner />
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/setup" element={<GardenSetup />} />
              <Route path="/planner" element={<GardenPlanner />} />
              <Route path="/scanner" element={<PlantHealthScanner />} />
              <Route path="/touch-grass" element={<TouchGrassMode />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/calendar" element={<CareCalendar />} />
              <Route path="/settings" element={<SettingsAbout />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
          <Toast />
        </div>
      </Router>
    </GardenProvider>
  );
}
