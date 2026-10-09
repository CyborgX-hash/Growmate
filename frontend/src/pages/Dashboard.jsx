import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Sprout, 
  Sun, 
  Droplets, 
  Footprints, 
  Activity, 
  Sparkles, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Maximize2
} from "lucide-react";
import { useGarden } from "../context/GardenContext.jsx";
import AddPlantModal from "../components/AddPlantModal.jsx";

export default function Dashboard() {
  const { garden, plants, tasks, todayMission, completeTaskItem, showToast } = useGarden();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const pendingTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E4E0CE]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCE8D9] text-[#245B45] text-xs font-semibold">
            <Sprout className="w-3.5 h-3.5" />
            <span>Garden Sanctuary Overview</span>
          </div>
          <h1 className="text-3xl font-bold font-serif-heading text-[#245B45]">
            {garden?.name || "My Garden"}
          </h1>
          <p className="text-xs sm:text-sm text-[#26352C]/75">
            {garden?.gardenType?.toUpperCase() || "BALCONY"} • {garden?.sunlightHours || 4}h Direct Sun • {plants.length} Active Plants
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#245B45] hover:bg-[#1E4D3A] text-white text-xs font-semibold shadow-xs transition-all hover:shadow"
          >
            <Plus className="w-4 h-4 text-[#DCE8D9]" />
            <span>Add Plant</span>
          </button>

          <Link
            to="/planner"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F0ECE1] border border-[#E4E0CE] text-[#245B45] text-xs font-semibold shadow-xs transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#245B45]" />
            <span>Gemma Planner</span>
          </Link>

          <Link
            to="/scanner"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F0ECE1] border border-[#E4E0CE] text-[#245B45] text-xs font-semibold shadow-xs transition-all"
          >
            <Activity className="w-4 h-4 text-[#245B45]" />
            <span>Leaf Scanner</span>
          </Link>
        </div>
      </div>

      {/* Grid: 1. Today's Touch Grass Mission (Hero Widget) */}
      {todayMission && (
        <div className="bg-[#245B45] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-elevated">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#DCE8D9]/20 text-[#DCE8D9] text-[11px] font-bold uppercase tracking-wider">
                  Today's Touch Grass Action
                </span>
                <span className="text-xs text-white/70 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  ~{todayMission.durationMinutes || 10} min
                </span>
              </div>

              <h2 className="text-2xl font-bold font-serif-heading text-[#F6F4EC]">
                {todayMission.title}
              </h2>

              <p className="text-xs sm:text-sm text-white/85 leading-relaxed line-clamp-2">
                {todayMission.explanation}
              </p>

              <div className="pt-1">
                <Link
                  to="/touch-grass"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C87552] hover:bg-[#B36342] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Footprints className="w-4 h-4" />
                  <span>{todayMission.isCompleted ? "View Completed Mission" : "Step Outside & Complete"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/20 text-xs text-white/90 space-y-2">
              <span className="font-bold text-[#DCE8D9] uppercase tracking-wider text-[10px] block">
                Quick Action Preview:
              </span>
              <p className="italic text-xs leading-relaxed">
                "{todayMission.steps?.[0] || 'Step outside and feel topsoil moisture.'}"
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Main Content Grid: Plants on Left, Tasks on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col (8 cols): Plant Collection */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-xl font-bold font-serif-heading text-[#245B45]">
                Your Plants ({plants.length})
              </h2>
              <p className="text-xs text-[#26352C]/70">
                Track hydration, schedule watering, and screen leaf health
              </p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs font-bold text-[#245B45] hover:text-[#1E4D3A] flex items-center gap-1"
            >
              + Add Plant
            </button>
          </div>

          {plants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plants.map((plant) => {
                const isNeedsCare = plant.status === "needs_care";
                return (
                  <div key={plant.id} className="botanical-card p-5 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-base text-[#245B45] font-serif-heading">
                            {plant.name}
                          </h3>
                          {plant.species && (
                            <span className="text-[11px] italic text-[#6F9477] block">
                              {plant.species} {plant.variety ? `• ${plant.variety}` : ""}
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isNeedsCare 
                            ? "bg-amber-100 text-amber-800" 
                            : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {isNeedsCare ? "Needs Care" : "Healthy"}
                        </span>
                      </div>

                      {plant.notes && (
                        <p className="text-xs text-[#26352C]/75 mt-2 line-clamp-2">
                          {plant.notes}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#EAE6D8] flex items-center justify-between text-xs text-[#26352C]/70">
                      <div className="flex items-center gap-1.5">
                        <Droplets className="w-3.5 h-3.5 text-sky-600" />
                        <span>Every {plant.wateringFreqDays}d</span>
                      </div>
                      
                      <Link
                        to={`/scanner`}
                        className="text-[11px] font-bold text-[#245B45] hover:underline"
                      >
                        Screen Leaf →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="botanical-card p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#DCE8D9]/40 text-[#245B45] flex items-center justify-center mx-auto">
                <Sprout className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif-heading font-bold text-base text-[#245B45]">
                  No Plants Added Yet
                </h3>
                <p className="text-xs text-[#26352C]/70 max-w-sm mx-auto">
                  Start by adding your first herb or container vegetable, or let Google Gemma recommend plants tailored to your balcony.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#245B45] text-white text-xs font-semibold shadow-xs"
                >
                  Add Plant Manually
                </button>
                <Link
                  to="/planner"
                  className="px-4 py-2 rounded-xl border border-[#E4E0CE] text-xs font-semibold text-[#245B45]"
                >
                  Generate Plan with AI
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Col (4 cols): Care Checklist */}
        <div className="lg:col-span-4 space-y-6">
          <div className="botanical-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE6D8] pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#245B45]" />
                <h3 className="font-bold text-sm text-[#245B45] font-serif-heading">
                  Care Tasks ({pendingTasks.length} Due)
                </h3>
              </div>
              <Link to="/calendar" className="text-[11px] font-bold text-[#245B45] hover:underline">
                View All →
              </Link>
            </div>

            {pendingTasks.length > 0 ? (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-[#FCFBF7] border border-[#E4E0CE] flex items-start gap-3 text-xs"
                  >
                    <button
                      onClick={() => completeTaskItem(task.id, true)}
                      className="mt-0.5 w-4 h-4 rounded border border-[#245B45] hover:bg-[#DCE8D9] flex items-center justify-center shrink-0 transition-colors"
                      title="Mark task completed"
                    >
                      {task.isCompleted && <CheckCircle2 className="w-4 h-4 text-[#245B45]" />}
                    </button>
                    <div className="space-y-0.5 min-w-0">
                      <span className="font-bold text-[#26352C] block truncate">{task.title}</span>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <span>Due: {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        {task.plant && <span>• {task.plant.name}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#26352C]/60 space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-medium">All care tasks completed!</p>
                <p className="text-[11px]">Your garden sanctuary is up to date.</p>
              </div>
            )}

            <div className="pt-2 border-t border-[#EAE6D8]">
              <Link
                to="/calendar"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#F6F4EC] hover:bg-[#ECE8D9] text-xs font-semibold text-[#245B45] transition-colors"
              >
                <span>Printable Offline Checklist</span>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Add Plant Modal */}
      <AddPlantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

    </div>
  );
}
