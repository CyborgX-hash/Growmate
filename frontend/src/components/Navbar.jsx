import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Sprout, 
  Calendar, 
  Activity, 
  Sliders, 
  Sparkles, 
  Menu, 
  X,
  Footprints,
  LayoutDashboard,
  Compass,
  ChevronRight
} from "lucide-react";
import { useGarden } from "../context/GardenContext.jsx";

export default function Navbar() {
  const location = useLocation();
  const { isOnline } = useGarden();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/touch-grass", label: "Touch Grass", icon: Footprints, badge: "Daily" },
    { path: "/planner", label: "Planner", icon: Sparkles },
    { path: "/scanner", label: "Health", icon: Activity },
    { path: "/calendar", label: "Calendar", icon: Calendar },
    { path: "/setup", label: "Setup", icon: Compass },
    { path: "/settings", label: "Settings", icon: Sliders },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6 max-w-7xl mx-auto w-full transition-all duration-300">
      <div className="liquid-glass-nav rounded-2xl sm:rounded-full px-3.5 sm:px-5 py-2 flex items-center justify-between gap-3 shadow-lg">
        
        {/* Left: Glass Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#245B45] to-[#163C2D] flex items-center justify-center text-white shadow-sm ring-1 ring-white/50 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
            <Sprout className="w-5 h-5 text-[#DCE8D9] group-hover:rotate-6 transition-transform" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-bold tracking-tight text-[#245B45] font-serif-heading">
                GrowMate
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#DCE8D9]/80 text-[#245B45] text-[9px] font-bold uppercase tracking-wider border border-white/60">
                AI
              </span>
            </div>
            <span className="text-[9px] font-medium text-[#6F9477] -mt-0.5 hidden sm:block tracking-tight">
              Touch Grass Companion
            </span>
          </div>
        </Link>

        {/* Center: Liquid Glass Nav Capsule */}
        <nav className="hidden lg:flex items-center p-1 rounded-full liquid-glass-capsule">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  active
                    ? "liquid-pill-active text-[#245B45] font-bold scale-[1.02]"
                    : "text-[#26352C]/75 hover:text-[#245B45] hover:bg-white/40"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? "text-[#245B45]" : "text-[#6F9477]"}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-0.5 text-[9px] bg-[#C87552] text-white px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider leading-none shadow-xs">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Glass Status Pill & Liquid Action CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Liquid AI Status Pill */}
          <div 
            className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md transition-all ${
              isOnline 
                ? "bg-emerald-500/10 text-emerald-900 border-emerald-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" 
                : "bg-amber-500/10 text-amber-900 border-amber-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]"
            }`}
            title={isOnline ? "Google Gemma 3 4B IT & PlantVillage ViT Online" : "Offline mode active"}
          >
            <span className="relative flex h-2 w-2">
              {isOnline && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? "bg-emerald-600" : "bg-amber-600"}`} />
            </span>
            <span className="text-[11px] font-semibold whitespace-nowrap">
              {isOnline ? "AI Online" : "Offline"}
            </span>
          </div>

          {/* Liquid Action Button */}
          <Link
            to="/touch-grass"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#245B45] to-[#1A4533] hover:from-[#1E4D3A] hover:to-[#153829] active:scale-[0.98] text-white text-xs font-bold shadow-[0_4px_14px_rgba(36,91,69,0.25)] hover:shadow-[0_6px_20px_rgba(36,91,69,0.35)] transition-all duration-200 border border-white/20"
          >
            <Footprints className="w-3.5 h-3.5 text-[#DCE8D9] shrink-0" />
            <span className="whitespace-nowrap">Today's Mission</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full text-[#26352C] hover:bg-white/50 border border-white/60 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Liquid Glass Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 liquid-glass-nav rounded-2xl p-3 space-y-1 shadow-2xl border border-white/80 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between px-3 py-2 mb-1 bg-white/40 rounded-xl text-xs backdrop-blur-md">
            <span className="text-[#26352C]/70">AI Inference Engine</span>
            <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Gemma 3 4B IT Online</span>
            </div>
          </div>

          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "liquid-pill-active text-[#245B45]"
                    : "text-[#26352C] hover:bg-white/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? "text-[#245B45]" : "text-[#6F9477]"}`} />
                  <span>{item.label === "Planner" ? "Garden Planner" : item.label === "Health" ? "Plant Health Scanner" : item.label === "Calendar" ? "Care Calendar" : item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="text-[10px] bg-[#C87552] text-white px-2 py-0.5 rounded-full font-bold uppercase">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-4 h-4 ${active ? "text-[#245B45]" : "text-[#26352C]/30"}`} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
