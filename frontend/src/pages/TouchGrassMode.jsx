import React, { useState, useEffect } from "react";
import { 
  Footprints, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Share2, 
  Camera, 
  FileText, 
  History, 
  Sun, 
  Timer, 
  Play, 
  Pause, 
  RotateCcw,
  Heart
} from "lucide-react";
import { api } from "../services/api.js";
import { offlineStorage } from "../services/offlineStorage.js";
import { useGarden } from "../context/GardenContext.jsx";

export default function TouchGrassMode() {
  const { todayMission, refreshTodayMission, completeMissionItem, showToast } = useGarden();

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [completionNote, setCompletionNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Outdoor Timer (for stepping outside)
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 minutes default
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      setLoadingHistory(true);
      try {
        const res = await api.getMissionHistory();
        if (res.success && res.data) {
          setHistory(res.data);
        }
      } catch (e) {
        console.warn("Could not load mission history:", e);
      } finally {
        setLoadingHistory(false);
      }
    }
    loadHistory();
  }, []);

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
      showToast("🌿 Time's up! Great job spending time outdoors.", "success");
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds, showToast]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    if (!todayMission) return;
    setSubmitting(true);
    try {
      await completeMissionItem(todayMission.id, completionNote.trim());
      setCompletionNote("");
      // Refresh history
      const histRes = await api.getMissionHistory();
      if (histRes.success) setHistory(histRes.data);
    } finally {
      setSubmitting(false);
    }
  };

  const completedCount = history.filter(h => h.isCompleted).length;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Signature Header Banner */}
      <div className="bg-[#245B45] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-elevated">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE8D9]/20 text-[#DCE8D9] text-xs font-semibold">
            <Footprints className="w-4 h-4 text-[#DCE8D9]" />
            <span>Hacktoberfest Signature Feature</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold font-serif-heading text-[#F6F4EC]">
            Touch Grass Mode
          </h1>

          <p className="text-xs sm:text-sm text-white/85 max-w-2xl leading-relaxed">
            Read your mission, put your phone down, step outdoors into the garden air, and return only 
            after you've completed the physical action.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#DCE8D9]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{completedCount} Outdoor Missions Completed</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-300" />
              <span>Gemma 3 4B IT Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Mission Card */}
      {todayMission ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Main Action Steps */}
          <div className="lg:col-span-8 space-y-6">
            <div className="botanical-card p-6 sm:p-8 space-y-6">
              
              {/* Mission Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE6D8]">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#6F9477] mb-1">
                    <span>Today's Persistent Mission</span>
                    <span>•</span>
                    <span>{todayMission.missionDate}</span>
                  </div>
                  <h2 className="text-2xl font-bold font-serif-heading text-[#245B45]">
                    {todayMission.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#DCE8D9] text-[#245B45] text-xs font-bold shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{todayMission.durationMinutes || 10} Mins</span>
                  </span>
                  {todayMission.isCompleted && (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">
                      ✓ Completed Today
                    </span>
                  )}
                </div>
              </div>

              {/* Explanation */}
              <div className="space-y-1 text-sm text-[#26352C]/85 leading-relaxed bg-[#FCFBF7] p-4 rounded-xl border border-[#E4E0CE]">
                <span className="font-bold text-[#245B45] block text-xs uppercase tracking-wider">
                  Why this physical activity matters:
                </span>
                <p>{todayMission.explanation}</p>
              </div>

              {/* Materials Required */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#245B45]">
                  Materials to take outside:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {todayMission.materialsRequired?.map((mat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#26352C]/80 bg-[#F6F4EC] p-2.5 rounded-lg border border-[#EAE6D8]">
                      <div className="w-2 h-2 rounded-full bg-[#C87552]" />
                      <span>{mat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step by step */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#245B45]">
                  Real-world Action Steps:
                </h3>
                <div className="space-y-2.5">
                  {todayMission.steps?.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs text-[#26352C]/85 bg-white p-3 rounded-xl border border-[#EAE6D8]">
                      <span className="w-5 h-5 rounded-full bg-[#245B45] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completion Action / Form */}
              <div className="pt-4 border-t border-[#EAE6D8]">
                {todayMission.isCompleted ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Mission Recorded as Complete</span>
                    </div>
                    {todayMission.completionNote && (
                      <p className="italic text-emerald-800">
                        "{todayMission.completionNote}"
                      </p>
                    )}
                    <span className="text-[11px] opacity-75 block">
                      Completed at: {new Date(todayMission.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleComplete} className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#245B45]">
                      Step Back Inside? Record Your Progress Note
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g., Felt the basil soil — it was damp underneath so held off watering. Removed 2 dry bottom leaves."
                      value={completionNote}
                      onChange={(e) => setCompletionNote(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E0CE] bg-[#FCFBF7] text-xs focus:ring-2 focus:ring-[#245B45] focus:outline-none"
                    />

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#245B45] hover:bg-[#1E4D3A] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#DCE8D9]" />
                      <span>{submitting ? "Saving Outdoor Action..." : "Mark Mission Completed Today"}</span>
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>

          {/* Right Column: Outdoor Timer & Mission History */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Screen-Free Countdown Companion */}
            <div className="botanical-card p-6 text-center space-y-4 bg-gradient-to-b from-[#FCFBF7] to-[#F5F2E7]">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCE8D9] text-[#245B45] text-[11px] font-bold uppercase tracking-wider">
                <Timer className="w-3.5 h-3.5" />
                <span>Outdoor Timer</span>
              </div>

              <div className="text-4xl font-bold font-serif-heading text-[#245B45] tracking-tight">
                {formatTimer(timerSeconds)}
              </div>

              <p className="text-[11px] text-[#26352C]/70">
                Hit start, leave your phone on the desk, and enjoy the outdoor air.
              </p>

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setTimerActive(!timerActive)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all ${
                    timerActive ? "bg-amber-600 hover:bg-amber-700" : "bg-[#245B45] hover:bg-[#1E4D3A]"
                  }`}
                >
                  {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{timerActive ? "Pause" : "Start Outdoor Time"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setTimerActive(false); setTimerSeconds(600); }}
                  className="p-2 rounded-xl border border-[#E4E0CE] text-[#26352C]/70 hover:bg-white text-xs"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Past History Log */}
            <div className="botanical-card p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#EAE6D8] pb-3">
                <History className="w-4 h-4 text-[#245B45]" />
                <h3 className="font-bold text-sm text-[#245B45] font-serif-heading">
                  Recent Outdoor Missions
                </h3>
              </div>

              {history.length > 0 ? (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {history.map((m) => (
                    <div key={m.id} className="p-3 rounded-xl bg-[#FCFBF7] border border-[#E4E0CE] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#245B45] truncate">{m.title}</span>
                        <span className="text-[10px] text-gray-500 shrink-0">{m.missionDate}</span>
                      </div>
                      <div className="text-[11px] text-[#26352C]/70 line-clamp-1">
                        {m.explanation}
                      </div>
                      {m.isCompleted && (
                        <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Done</span>
                          {m.completionNote && <span className="text-gray-500 truncate">- "{m.completionNote}"</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-[#26352C]/60 italic text-center py-4">
                  No previous missions recorded yet.
                </div>
              )}
            </div>

          </div>

        </div>
      ) : (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-3 border-[#245B45] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-[#26352C]/70">Loading today's outdoor mission...</p>
        </div>
      )}

    </div>
  );
}
