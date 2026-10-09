import React, { useState } from "react";
import { X, Sprout, Plus, Sun, Droplets, BookOpen } from "lucide-react";
import { api } from "../services/api.js";
import { useGarden } from "../context/GardenContext.jsx";

export default function AddPlantModal({ isOpen, onClose }) {
  const { refreshPlants, refreshTasks, showToast } = useGarden();
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [variety, setVariety] = useState("");
  const [sunlightReq, setSunlightReq] = useState("4-6 hours direct sunlight");
  const [wateringFreqDays, setWateringFreqDays] = useState(2);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.createPlant({
        name: name.trim(),
        species: species.trim() || null,
        variety: variety.trim() || null,
        sunlightReq,
        wateringFreqDays: Number(wateringFreqDays),
        notes: notes.trim() || null,
        status: "healthy"
      });

      if (res.success) {
        showToast(`🌱 Added ${name} to your garden sanctuary!`, "success");
        await Promise.all([refreshPlants(), refreshTasks()]);
        setName("");
        setSpecies("");
        setVariety("");
        setNotes("");
        onClose();
      }
    } catch (err) {
      showToast(err.message || "Failed to add plant.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs no-print">
      <div className="bg-[#FFFFFF] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E4E0CE] relative animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E4E0CE]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#DCE8D9] flex items-center justify-center text-[#245B45]">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#245B45]">Add Plant to Garden</h3>
              <p className="text-xs text-[#26352C]/70">Track care, schedule watering, and screen leaf health</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-sm text-[#26352C]">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#245B45] mb-1">
              Plant Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Sweet Genovese Basil or Roma Tomato"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E0CE] focus:outline-none focus:ring-2 focus:ring-[#245B45] bg-[#FCFBF7]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#26352C]/80 mb-1">
                Botanical Species (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Ocimum basilicum"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E4E0CE] focus:outline-none focus:ring-2 focus:ring-[#245B45] bg-[#FCFBF7] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#26352C]/80 mb-1">
                Cultivar / Variety
              </label>
              <input
                type="text"
                placeholder="e.g., Italian Large Leaf"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E4E0CE] focus:outline-none focus:ring-2 focus:ring-[#245B45] bg-[#FCFBF7] text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#26352C]/80 mb-1 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                Sunlight Exposure
              </label>
              <select
                value={sunlightReq}
                onChange={(e) => setSunlightReq(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E4E0CE] focus:outline-none focus:ring-2 focus:ring-[#245B45] bg-[#FCFBF7] text-xs"
              >
                <option value="6-8 hours full direct sunlight">6-8 hours full direct sun</option>
                <option value="4-6 hours partial sunlight">4-6 hours partial sun</option>
                <option value="2-4 hours gentle morning light">2-4 hours morning light</option>
                <option value="Bright indirect / filtered shade">Bright indirect light / shade</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#26352C]/80 mb-1 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
                Watering Frequency
              </label>
              <select
                value={wateringFreqDays}
                onChange={(e) => setWateringFreqDays(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E4E0CE] focus:outline-none focus:ring-2 focus:ring-[#245B45] bg-[#FCFBF7] text-xs"
              >
                <option value={1}>Every day (high thirst/small pot)</option>
                <option value={2}>Every 2 days (standard herbs/veg)</option>
                <option value={3}>Every 3-4 days (moderate)</option>
                <option value={7}>Once a week (succulents/low thirst)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#26352C]/80 mb-1">
              Care Notes / Location
            </label>
            <textarea
              rows={2}
              placeholder="e.g., Positioned on south corner of balcony railing. Prune tips every 2 weeks."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E4E0CE] focus:outline-none focus:ring-2 focus:ring-[#245B45] bg-[#FCFBF7] text-xs"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E4E0CE]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E4E0CE] text-xs font-semibold text-[#26352C]/80 hover:bg-[#F0ECE1]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#245B45] text-white text-xs font-semibold hover:bg-[#1E4D3A] disabled:opacity-50 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? "Saving Plant..." : "Save Plant"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
