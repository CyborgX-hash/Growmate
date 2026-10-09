import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Plus, 
  Droplets, 
  Scissors, 
  ShieldAlert, 
  Sparkles, 
  Filter,
  Trash2
} from "lucide-react";
import { api } from "../services/api.js";
import { useGarden } from "../context/GardenContext.jsx";

export default function CareCalendar() {
  const { garden, plants, tasks, refreshTasks, completeTaskItem, showToast } = useGarden();

  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddingTask, setIsAddingTask] = useState(false);

  // New task form state
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState("watering");
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [selectedPlantId, setSelectedPlantId] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    setSubmitting(true);
    try {
      const res = await api.createTask({
        title: title.trim(),
        taskType,
        dueDate: new Date(dueDate).toISOString(),
        plantId: selectedPlantId || null,
        notes: notes.trim() || null
      });

      if (res.success) {
        showToast("🗓️ Care task scheduled!", "success");
        await refreshTasks();
        setTitle("");
        setNotes("");
        setIsAddingTask(false);
      }
    } catch (err) {
      showToast(err.message || "Failed to schedule task.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      showToast("Task deleted.", "info");
      await refreshTasks();
    } catch (err) {
      showToast("Failed to delete task.", "error");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === "pending" && t.isCompleted) return false;
    if (filterStatus === "completed" && !t.isCompleted) return false;
    if (filterType !== "all" && t.taskType !== filterType) return false;
    return true;
  });

  const getTaskIcon = (type) => {
    switch (type) {
      case "watering": return <Droplets className="w-4 h-4 text-sky-600" />;
      case "pruning": return <Scissors className="w-4 h-4 text-[#C87552]" />;
      case "pest_check": return <ShieldAlert className="w-4 h-4 text-amber-600" />;
      case "fertilizing": return <Sparkles className="w-4 h-4 text-emerald-600" />;
      default: return <CalendarIcon className="w-4 h-4 text-[#245B45]" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E0CE] no-print">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCE8D9] text-[#245B45] text-xs font-semibold">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Outdoor Care Checklist</span>
          </div>
          <h1 className="text-3xl font-bold font-serif-heading text-[#245B45]">
            Garden Care Calendar
          </h1>
          <p className="text-xs sm:text-sm text-[#26352C]/75">
            Organize watering, soil inspection, pruning, and feeding routines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E4E0CE] bg-[#FCFBF7] hover:bg-[#F0ECE1] text-[#245B45] text-xs font-semibold shadow-xs transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Checklist</span>
          </button>

          <button
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#245B45] hover:bg-[#1E4D3A] text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4 text-[#DCE8D9]" />
            <span>{isAddingTask ? "Close Form" : "Schedule Task"}</span>
          </button>
        </div>
      </div>

      {/* Print-Only Header (visible only on paper printout) */}
      <div className="hidden print:block mb-8">
        <div className="flex items-center justify-between border-b-2 border-black pb-4">
          <div>
            <h1 className="text-2xl font-bold font-serif">GrowMate — Garden Care Checklist</h1>
            <p className="text-xs text-gray-700">Sanctuary: {garden?.name || "My Garden"} • Printed on: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Hacktoberfest Touch Grass Edition
          </div>
        </div>
      </div>

      {/* Add Task Form Collapsible */}
      {isAddingTask && (
        <form onSubmit={handleCreateTask} className="botanical-card p-6 space-y-4 no-print animate-in fade-in">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#245B45]">
            Schedule New Horticultural Task
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#26352C]/80 mb-1">
                Task Description *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Deep watering & rotate pot"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4E0CE] bg-[#FCFBF7] text-xs focus:ring-2 focus:ring-[#245B45] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#26352C]/80 mb-1">
                Task Type
              </label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4E0CE] bg-[#FCFBF7] text-xs focus:ring-2 focus:ring-[#245B45] focus:outline-none"
              >
                <option value="watering">Watering</option>
                <option value="pruning">Pruning / Pinching</option>
                <option value="pest_check">Pest / Foliage Inspection</option>
                <option value="fertilizing">Fertilizing / Organic Feed</option>
                <option value="repotting">Repotting / Soil Refresh</option>
                <option value="general">General Garden Care</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#26352C]/80 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4E0CE] bg-[#FCFBF7] text-xs focus:ring-2 focus:ring-[#245B45] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#26352C]/80 mb-1">
                Associate with Plant
              </label>
              <select
                value={selectedPlantId}
                onChange={(e) => setSelectedPlantId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E4E0CE] bg-[#FCFBF7] text-xs focus:ring-2 focus:ring-[#245B45] focus:outline-none"
              >
                <option value="">-- General Garden Sanctuary --</option>
                {plants.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-4 py-2 rounded-xl border border-[#E4E0CE] text-xs font-semibold text-[#26352C]/70 hover:bg-[#F0ECE1]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="px-4 py-2 rounded-xl bg-[#245B45] text-white text-xs font-semibold hover:bg-[#1E4D3A] disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Task"}
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#FCFBF7] border border-[#E4E0CE] no-print text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#245B45]" />
          <span className="font-bold text-[#245B45]">Filters:</span>
          <div className="flex items-center gap-1">
            {["all", "pending", "completed"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-colors ${
                  filterStatus === st 
                    ? "bg-[#245B45] text-white" 
                    : "text-[#26352C]/70 hover:bg-[#EAE6D8]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#26352C]/70">Type:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-[#E4E0CE] bg-white text-xs focus:outline-none"
          >
            <option value="all">All Task Types</option>
            <option value="watering">Watering</option>
            <option value="pruning">Pruning</option>
            <option value="pest_check">Pest Inspection</option>
            <option value="fertilizing">Fertilizing</option>
          </select>
        </div>
      </div>

      {/* Tasks List Table */}
      <div className="botanical-card overflow-hidden">
        {filteredTasks.length > 0 ? (
          <div className="divide-y divide-[#EAE6D8]">
            {filteredTasks.map((task) => {
              const due = new Date(task.dueDate);
              const isOverdue = !task.isCompleted && due < new Date(new Date().setHours(0,0,0,0));

              return (
                <div
                  key={task.id}
                  className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                    task.isCompleted ? "bg-[#F6F4EC]/50 opacity-70" : "bg-white hover:bg-[#FAF8F2]"
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      onClick={() => completeTaskItem(task.id, !task.isCompleted)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                        task.isCompleted 
                          ? "bg-[#245B45] border-[#245B45] text-white" 
                          : "border-[#A6A088] hover:border-[#245B45]"
                      }`}
                      title={task.isCompleted ? "Mark pending" : "Mark completed"}
                    >
                      {task.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {getTaskIcon(task.taskType)}
                        <span className={`text-sm font-bold text-[#26352C] ${task.isCompleted ? "line-through text-gray-500" : ""}`}>
                          {task.title}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#26352C]/70">
                        <span className={isOverdue ? "font-bold text-red-700" : ""}>
                          Due: {due.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {task.plant && (
                          <span>• Plant: <strong>{task.plant.name}</strong></span>
                        )}
                        {task.notes && (
                          <span className="italic">• {task.notes}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 no-print">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-[#26352C]/60 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="font-semibold text-sm text-[#245B45]">No tasks found for selected filters</p>
            <p>Schedule a new task or enjoy your clean gardening calendar!</p>
          </div>
        )}
      </div>

    </div>
  );
}
