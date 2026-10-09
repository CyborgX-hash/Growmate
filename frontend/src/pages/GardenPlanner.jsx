import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Sun, 
  Droplets, 
  Maximize2, 
  Layers, 
  CheckCircle2, 
  Calendar, 
  Footprints, 
  RefreshCw, 
  ArrowRight,
  Info,
  ShieldAlert,
  Plus
} from "lucide-react";
import { api } from "../services/api.js";
import { offlineStorage } from "../services/offlineStorage.js";
import { useGarden } from "../context/GardenContext.jsx";

export default function GardenPlanner() {
  const navigate = useNavigate();
  const { garden, refreshPlants, refreshTasks, showToast } = useGarden();

  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState(null);
  const [error, setError] = useState(null);
  const [adopting, setAdopting] = useState(false);

  useEffect(() => {
    // Check if we have cached latest plan or load from server
    async function loadPlan() {
      try {
        const cached = offlineStorage.getCachedGardenPlan();
        if (cached?.data) {
          setPlanResult(cached.data);
        }

        const res = await api.getLatestPlan();
        if (res.success && res.data) {
          setPlanResult(res.data);
          offlineStorage.saveGardenPlan(res.data);
        } else if (!cached?.data) {
          // Auto-generate if first time
          handleGenerate();
        }
      } catch (e) {
        console.warn("Could not fetch remote plan, using cached if available:", e);
      }
    }
    loadPlan();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.generatePlan(garden || {});
      if (res.success && res.data) {
        setPlanResult(res.data);
        offlineStorage.saveGardenPlan(res.data);
        showToast("🌱 Garden plan generated successfully!", "success");
      }
    } catch (err) {
      setError(err.message || "Failed to generate plan.");
      showToast("Could not contact AI planner. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptPlants = async () => {
    if (!planResult?.plan?.recommendedPlants) return;
    setAdopting(true);
    try {
      const res = await api.adoptPlanPlants(planResult.plan.recommendedPlants);
      if (res.success) {
        showToast(`🌿 Added ${res.data.length} recommended plants to your sanctuary!`, "success");
        await Promise.all([refreshPlants(), refreshTasks()]);
        navigate("/dashboard");
      }
    } catch (e) {
      showToast(e.message || "Could not adopt plants.", "error");
    } finally {
      setAdopting(false);
    }
  };

  const plan = planResult?.plan;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E4E0CE]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCE8D9] text-[#245B45] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Horticultural Strategy</span>
          </div>
          <h1 className="text-3xl font-bold font-serif-heading text-[#245B45]">
            Garden Plan: {garden?.name || "Your Garden"}
          </h1>
          <p className="text-xs sm:text-sm text-[#26352C]/75">
            Calibrated for {garden?.sunlightHours || 4}h daily sunlight • {garden?.gardenType || "Balcony"} space • {garden?.soilType || "Potting Mix"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/setup"
            className="px-3.5 py-2 rounded-xl border border-[#E4E0CE] bg-[#FCFBF7] text-xs font-semibold text-[#26352C]/80 hover:bg-[#F0ECE1] transition-colors"
          >
            Edit Space Conditions
          </Link>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#245B45] hover:bg-[#1E4D3A] text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Gemma Generating..." : "Regenerate Plan"}</span>
          </button>
        </div>
      </div>

      {/* Model Attribution & Status Banner */}
      {planResult && (
        <div className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          planResult.isFallback 
            ? "bg-amber-50/70 border-amber-200 text-amber-900" 
            : "bg-[#DCE8D9]/40 border-[#C6DAC2] text-[#245B45]"
        }`}>
          <div className="flex items-center gap-2.5">
            {planResult.isFallback ? (
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-[#245B45] shrink-0" />
            )}
            <div>
              <span className="font-bold">Model Engine: </span>
              <span>{planResult.modelAttribution}</span>
              {planResult.isFallback && (
                <span className="block text-[11px] text-amber-800/80 mt-0.5">
                  Showing verified deterministic horticultural recommendations ({planResult.fallbackReason || "API key placeholder"}).
                </span>
              )}
            </div>
          </div>
          <div className="text-[11px] opacity-75">
            Generated: {new Date(planResult.createdAt || Date.now()).toLocaleDateString()}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="py-20 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#245B45] border-t-transparent animate-spin mx-auto" />
          <h3 className="font-serif-heading font-bold text-lg text-[#245B45]">
            Consulting Google Gemma 3 4B IT...
          </h3>
          <p className="text-xs text-[#26352C]/70 max-w-md mx-auto">
            Structuring container plant varieties, soil ratios, and daily outdoor timelines for your {garden?.gardenType || "balcony"}...
          </p>
        </div>
      )}

      {/* Error Banner */}
      {error && !loading && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={handleGenerate} className="underline font-bold">Retry</button>
        </div>
      )}

      {/* Plan Content */}
      {!loading && plan && (
        <div className="space-y-8">
          
          {/* Strategy Summary Card */}
          <div className="botanical-card p-6 sm:p-8 bg-gradient-to-br from-white to-[#FAF8F2] space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#245B45]">
              Executive Growing Strategy
            </h2>
            <p className="text-base text-[#26352C] leading-relaxed font-serif-heading">
              "{plan.summary}"
            </p>
            {plan.soilPreparation && (
              <div className="pt-3 border-t border-[#EAE6D8] text-xs text-[#26352C]/80">
                <span className="font-bold text-[#245B45]">Soil Preparation Note: </span>
                <span>{plan.soilPreparation}</span>
              </div>
            )}
          </div>

          {/* Recommended Plants Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-serif-heading text-[#245B45]">
                  Recommended Plant Varieties
                </h2>
                <p className="text-xs text-[#26352C]/70">
                  Selected for {garden?.sunlightHours || 4}h sunlight and container resilience
                </p>
              </div>

              <button
                onClick={handleAdoptPlants}
                disabled={adopting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#245B45] hover:bg-[#1E4D3A] text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{adopting ? "Adding Plants..." : "Add All to My Garden"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plan.recommendedPlants?.map((plant, idx) => (
                <div key={idx} className="botanical-card p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-base text-[#245B45] font-serif-heading">
                          {plant.name}
                        </h3>
                        {plant.species && (
                          <span className="text-[11px] italic text-[#6F9477]">{plant.species}</span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCE8D9] text-[#245B45]">
                        Container Ready
                      </span>
                    </div>

                    <p className="text-xs text-[#26352C]/80 leading-relaxed">
                      {plant.whySuitable}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-[#EAE6D8] text-xs text-[#26352C]/80">
                      <div className="flex items-center gap-2">
                        <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span><strong>Light:</strong> {plant.sunlightReq}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span><strong>Water:</strong> {plant.wateringGuidance}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Maximize2 className="w-3.5 h-3.5 text-[#C87552] shrink-0" />
                        <span><strong>Pot:</strong> {plant.spaceNeeded}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#EAE6D8] bg-[#F6F4EC] -mx-6 -mb-6 p-4 rounded-b-2xl">
                    <div className="text-[11px] font-bold text-[#245B45] uppercase tracking-wider mb-1">
                      Beginner Tip
                    </div>
                    <p className="text-xs text-[#26352C]/85 italic">
                      "{plant.careTip}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* First Week Action Plan Timeline */}
          {plan.firstWeekPlan && (
            <div className="botanical-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-[#EAE6D8] pb-3">
                <Calendar className="w-5 h-5 text-[#245B45]" />
                <h2 className="text-lg font-bold font-serif-heading text-[#245B45]">
                  First-Week Outdoor Setup Timeline
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plan.firstWeekPlan.map((step, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#FCFBF7] border border-[#E4E0CE] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#C87552] uppercase tracking-wider">
                        {step.day}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-gray-300" />
                    </div>
                    <h4 className="font-bold text-sm text-[#245B45]">{step.action}</h4>
                    <p className="text-xs text-[#26352C]/75 leading-relaxed">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Touch Grass Outdoor Suggestion */}
          {plan.outdoorMissionIdea && (
            <div className="bg-[#245B45] text-white p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-soft">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-medium text-[#DCE8D9]">
                  <Footprints className="w-3.5 h-3.5" />
                  <span>Immediate Touch Grass Action</span>
                </div>
                <h3 className="font-serif-heading font-bold text-lg text-white">
                  Ready to start? Step outside for 10 minutes.
                </h3>
                <p className="text-xs text-white/80 max-w-xl">
                  {plan.outdoorMissionIdea}
                </p>
              </div>

              <Link
                to="/touch-grass"
                className="shrink-0 px-5 py-3 rounded-xl bg-[#C87552] hover:bg-[#B36342] text-white text-xs font-bold transition-all shadow-sm"
              >
                Launch Today's Mission →
              </Link>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
