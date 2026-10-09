import React from "react";
import { Link } from "react-router-dom";
import { 
  Sprout, 
  Footprints, 
  Sparkles, 
  Activity, 
  WifiOff, 
  ArrowRight, 
  Sun, 
  ShieldCheck, 
  CheckCircle2, 
  Heart,
  Droplets,
  CalendarCheck
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="space-y-24 py-6">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:py-20 bg-cream-mesh rounded-3xl border border-[#E4E0CE] max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 shadow-soft">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCE8D9] text-[#245B45] text-xs font-semibold tracking-wide border border-[#C6DAC2]">
              <Footprints className="w-4 h-4 text-[#245B45]" />
              <span>Hacktoberfest 2026 — Touch Grass Edition</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#245B45] leading-[1.15]">
              AI that gets your hands dirty in real soil.
            </h1>

            <p className="text-base sm:text-lg text-[#26352C]/80 leading-relaxed max-w-2xl">
              Meet <strong>GrowMate</strong>, the gentle horticultural companion for home and balcony gardeners. 
              We use open-weight AI to generate tailored plant plans, screen leaf health, and guide you through 
              <strong> 10-minute daily outdoor missions</strong> — so you spend less time on screens and more time in nature.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/setup"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#245B45] hover:bg-[#1E4D3A] text-white text-sm font-semibold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <span>Start Your Garden</span>
                <ArrowRight className="w-4 h-4 text-[#DCE8D9]" />
              </Link>
              
              <Link
                to="/touch-grass"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#FFFFFF] hover:bg-[#F0ECE1] text-[#245B45] border border-[#E4E0CE] text-sm font-semibold shadow-xs transition-all"
              >
                <Footprints className="w-4 h-4 text-[#C87552]" />
                <span>Explore Touch Grass Mode</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-[#E4E0CE]/70 text-xs text-[#26352C]/75">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#245B45] shrink-0" />
                <span>Google Gemma 3 4B IT</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#245B45] shrink-0" />
                <span>38-Class ViT Leaf Scanner</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#245B45] shrink-0" />
                <span>Offline-Friendly Care</span>
              </div>
            </div>

          </div>

          {/* Hero Visual Card / Interactive Preview */}
          <div className="lg:col-span-5">
            <div className="botanical-card p-6 relative overflow-hidden bg-gradient-to-br from-white to-[#FAF8F2] border-[#D8D2BC]">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE6D8]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#C87552]" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-[#245B45]" />
                  <span className="ml-2 text-xs font-semibold text-[#245B45] font-serif-heading">Today's Outdoor Mission</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#DCE8D9] text-[#245B45] font-bold">10 Min</span>
              </div>

              <div className="mt-4 space-y-3">
                <h3 className="font-bold text-base text-[#245B45] leading-snug">
                  Soil Hydration Depth & Sunlight Audit
                </h3>
                <p className="text-xs text-[#26352C]/80 leading-relaxed">
                  Put your phone inside. Step onto your balcony and test topsoil moisture depth with your finger. 
                  Turn your Basil pot 90° toward the morning light.
                </p>

                <div className="p-3 bg-[#F6F4EC] rounded-xl border border-[#EAE6D8] space-y-1.5 text-xs text-[#26352C]/90">
                  <div className="flex items-center gap-2 text-[#245B45] font-semibold text-[11px]">
                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                    <span>Real-world action required:</span>
                  </div>
                  <p className="italic text-[11px] text-[#26352C]/70">
                    "Feel the soil temperature. If damp particles stick, leave it unwatered today."
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-[#26352C]/60">Gemma 3 4B IT verified</span>
                  <Link
                    to="/touch-grass"
                    className="text-xs font-bold text-[#245B45] hover:text-[#1E4D3A] flex items-center gap-1"
                  >
                    Open Full Mission →
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Signature Feature: Touch Grass Mode Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#245B45] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-elevated">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE8D9]/20 text-[#DCE8D9] text-xs font-semibold">
                <Footprints className="w-4 h-4 text-[#DCE8D9]" />
                <span>The Core Philosophy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif-heading text-[#F6F4EC]">
                "Touch Grass Mode" — AI Designed to be Closed
              </h2>
              <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl">
                Most apps want to keep your eyes glued to pixels. GrowMate is the opposite. 
                Our daily missions give you a clear, bite-sized gardening action, then explicitly prompt you 
                to put your phone away, step outdoors, breathe fresh air, and feel real soil with your hands.
              </p>
              <div className="pt-2">
                <Link
                  to="/touch-grass"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C87552] hover:bg-[#B36342] text-white text-xs font-bold tracking-wide transition-all shadow-sm"
                >
                  <span>Step Outside Today</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-xs p-6 rounded-2xl border border-white/20 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#DCE8D9]">Daily Streak Principle</div>
              <p className="text-xs text-white/90 leading-relaxed">
                Consistency over complexity. 10 minutes outdoors every day builds thriving balcony plants and calms your nervous system.
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs font-medium text-[#DCE8D9]">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Persistent daily task</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Offline accessible</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Feature Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-3xl font-bold font-serif-heading text-[#245B45]">
            Horticultural Intelligence at Every Stage
          </h2>
          <p className="text-sm text-[#26352C]/75">
            Every feature connects beginner-friendly advice with verified open-source AI models and deterministic safeguards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="botanical-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DCE8D9] flex items-center justify-center text-[#245B45]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#245B45] font-serif-heading">Gemma Garden Planner</h3>
            <p className="text-xs text-[#26352C]/75 leading-relaxed">
              Google Gemma 3 4B IT analyzes your balcony size, sunlight hours, and experience to generate personalized container plant plans with zero fluff.
            </p>
            <Link to="/planner" className="inline-flex items-center gap-1 text-xs font-bold text-[#245B45] hover:underline">
              Plan your space →
            </Link>
          </div>

          {/* Card 2 */}
          <div className="botanical-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DCE8D9] flex items-center justify-center text-[#245B45]">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#245B45] font-serif-heading">PlantVillage ViT Scanner</h3>
            <p className="text-xs text-[#26352C]/75 leading-relaxed">
              Upload a leaf photo to screen for 38 crop diseases across 14 species. Returns plain explanations and cautious organic cultural steps.
            </p>
            <Link to="/scanner" className="inline-flex items-center gap-1 text-xs font-bold text-[#245B45] hover:underline">
              Scan a leaf →
            </Link>
          </div>

          {/* Card 3 */}
          <div className="botanical-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DCE8D9] flex items-center justify-center text-[#245B45]">
              <Footprints className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#245B45] font-serif-heading">Touch Grass Missions</h3>
            <p className="text-xs text-[#26352C]/75 leading-relaxed">
              Daily persistent outdoor missions tailored to your plants. Rotate sunlight, check moisture, deadhead blooms, and record real progress.
            </p>
            <Link to="/touch-grass" className="inline-flex items-center gap-1 text-xs font-bold text-[#245B45] hover:underline">
              View mission →
            </Link>
          </div>

          {/* Card 4 */}
          <div className="botanical-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DCE8D9] flex items-center justify-center text-[#245B45]">
              <WifiOff className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#245B45] font-serif-heading">Offline Care & Print</h3>
            <p className="text-xs text-[#26352C]/75 leading-relaxed">
              Take your care calendar outside without internet anxiety. Download or print clean physical checklists to clip by your balcony watering can.
            </p>
            <Link to="/calendar" className="inline-flex items-center gap-1 text-xs font-bold text-[#245B45] hover:underline">
              View calendar →
            </Link>
          </div>

        </div>
      </section>

      {/* Real-world Action Quote Banner */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <blockquote className="text-xl sm:text-2xl font-serif-heading italic text-[#245B45]">
          "The best fertilizer for any garden is the gardener's shadow."
        </blockquote>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#6F9477]">
          Old Horticultural Proverb
        </p>
      </section>

    </div>
  );
}
