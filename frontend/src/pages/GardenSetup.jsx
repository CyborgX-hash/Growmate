import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Compass, 
  Sun, 
  Maximize2, 
  MapPin, 
  Layers, 
  GraduationCap, 
  HeartHandshake, 
  Sparkles,
  ArrowRight,
  Check
} from "lucide-react";
import { api } from "../services/api.js";
import { useGarden } from "../context/GardenContext.jsx";

export default function GardenSetup() {
  const navigate = useNavigate();
  const { garden, refreshGarden, showToast } = useGarden();

  const [name, setName] = useState("My Balcony Oasis");
  const [location, setLocation] = useState("");
  const [gardenType, setGardenType] = useState("balcony");
  const [spaceSize, setSpaceSize] = useState("Small Balcony (approx. 2x1m)");
  const [sunlightHours, setSunlightHours] = useState(5);
  const [soilType, setSoilType] = useState("Organic Potting Mix with Perlite");
  const [experienceLevel, setExperienceLevel] = useState("beginner");
  const [interests, setInterests] = useState(["herbs", "vegetables"]);
  const [climate, setClimate] = useState("Temperate");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (garden) {
      if (garden.name) setName(garden.name);
      if (garden.location) setLocation(garden.location);
      if (garden.gardenType) setGardenType(garden.gardenType);
      if (garden.spaceSize) setSpaceSize(garden.spaceSize);
      if (garden.sunlightHours) setSunlightHours(garden.sunlightHours);
      if (garden.soilType) setSoilType(garden.soilType);
      if (garden.experienceLevel) setExperienceLevel(garden.experienceLevel);
      if (garden.climate) setClimate(garden.climate);
      if (garden.interests) {
        try {
          const parsed = JSON.parse(garden.interests);
          if (Array.isArray(parsed)) setInterests(parsed);
        } catch (_) {
          setInterests(garden.interests.split(",").map(s => s.trim()));
        }
      }
    }
  }, [garden]);

  const toggleInterest = (tag) => {
    setInterests(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await api.saveGarden({
        name: name.trim() || "My Garden",
        location: location.trim() || null,
        gardenType,
        spaceSize,
        sunlightHours: Number(sunlightHours),
        soilType,
        experienceLevel,
        interests: interests.join(", "),
        climate
      });

      if (res.success) {
        showToast("🌿 Garden profile saved successfully!", "success");
        await refreshGarden();
        navigate("/planner");
      }
    } catch (err) {
      showToast(err.message || "Could not save garden settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  const gardenTypes = [
    { id: "balcony", title: "Balcony", desc: "Containers, railing boxes & vertical planters" },
    { id: "indoor", title: "Indoor / Windowsill", desc: "Sunny windowsills, grow lights & table pots" },
    { id: "terrace", title: "Terrace / Rooftop", desc: "Raised beds, large pots & full exposure" },
    { id: "outdoor", title: "Outdoor Yard", desc: "Backyard soil beds or patio containers" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE8D9] text-[#245B45] text-xs font-semibold">
          <Compass className="w-4 h-4" />
          <span>Step 1 of Cultivation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-heading text-[#245B45]">
          Garden Sanctuary Setup
        </h1>
        <p className="text-sm text-[#26352C]/75 leading-relaxed max-w-2xl">
          Tell us about your space and growing environment. Our Google Gemma 3 4B IT model will calibrate 
          plant recommendations and daily missions strictly to your light and space limits.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Garden Identity & Space */}
        <div className="botanical-card p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold font-serif-heading text-[#245B45] border-b border-[#EAE6D8] pb-3">
            1. Space & Growing Location
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#245B45] mb-1.5">
                Garden Sanctuary Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sunny South Balcony"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E4E0CE] bg-[#FCFBF7] focus:ring-2 focus:ring-[#245B45] focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#245B45] mb-1.5 flex items-center justify-between">
                <span>General City / Region</span>
                <span className="text-[11px] font-normal text-gray-500 lowercase">(Optional)</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Seattle, WA or Berlin (No exact address needed)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E0CE] bg-[#FCFBF7] focus:ring-2 focus:ring-[#245B45] focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Garden Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#245B45] mb-2.5">
              Garden Environment
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gardenTypes.map((type) => {
                const selected = gardenType === type.id;
                return (
                  <div
                    key={type.id}
                    onClick={() => setGardenType(type.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all ${
                      selected
                        ? "bg-[#DCE8D9]/40 border-[#245B45] shadow-sm ring-1 ring-[#245B45]"
                        : "bg-[#FCFBF7] border-[#E4E0CE] hover:border-[#245B45]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#245B45]">{type.title}</span>
                      {selected && <Check className="w-4 h-4 text-[#245B45]" />}
                    </div>
                    <p className="text-xs text-[#26352C]/70 mt-1 leading-relaxed">{type.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#245B45] mb-1.5">
              Available Space Size
            </label>
            <select
              value={spaceSize}
              onChange={(e) => setSpaceSize(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E4E0CE] bg-[#FCFBF7] focus:ring-2 focus:ring-[#245B45] focus:outline-none text-sm"
            >
              <option value="Small Balcony (approx. 2x1m)">Small Balcony (approx. 2x1m / 20 sq ft)</option>
              <option value="Medium Balcony / Railing (approx. 3x1.5m)">Medium Balcony (approx. 3x1.5m / 50 sq ft)</option>
              <option value="Windowsill / Tabletop Pots">Windowsill / Tabletop Pots</option>
              <option value="Terrace / Rooftop Corner (100+ sq ft)">Terrace / Rooftop Corner (100+ sq ft)</option>
              <option value="Outdoor Raised Bed Garden">Outdoor Raised Bed Garden</option>
            </select>
          </div>

        </div>

        {/* Section 2: Sunlight & Medium */}
        <div className="botanical-card p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold font-serif-heading text-[#245B45] border-b border-[#EAE6D8] pb-3">
            2. Sunlight & Growing Medium
          </h2>

          {/* Sunlight Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#245B45] flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Approximate Direct Sunlight Hours</span>
              </label>
              <span className="px-3 py-1 rounded-full bg-[#DCE8D9] text-[#245B45] text-xs font-bold">
                {sunlightHours} Hours / Day
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={sunlightHours}
              onChange={(e) => setSunlightHours(e.target.value)}
              className="w-full accent-[#245B45] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#26352C]/60">
              <span>1h (Deep shade)</span>
              <span>4-5h (Partial Sun - Herbs & Greens)</span>
              <span>8-10h (Full Direct Sun)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#245B45] mb-1.5">
                Soil / Medium Type
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E4E0CE] bg-[#FCFBF7] focus:ring-2 focus:ring-[#245B45] focus:outline-none text-sm"
              >
                <option value="Organic Potting Mix with Perlite">Organic Potting Mix with Perlite</option>
                <option value="Coco Coir + Organic Compost">Coco Coir + Organic Compost</option>
                <option value="Standard Multi-purpose Garden Soil">Standard Multi-purpose Garden Soil</option>
                <option value="Cactus & Succulent Sandy Mix">Cactus & Succulent Sandy Mix</option>
                <option value="Not sure / Standard Store Soil">Not sure / Standard Store Soil</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#245B45] mb-1.5">
                Climate / Season
              </label>
              <select
                value={climate}
                onChange={(e) => setClimate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E4E0CE] bg-[#FCFBF7] focus:ring-2 focus:ring-[#245B45] focus:outline-none text-sm"
              >
                <option value="Temperate / Mild">Temperate / Mild</option>
                <option value="Mediterranean (Dry Summers, Mild Winters)">Mediterranean (Dry Summers)</option>
                <option value="Humid Subtropical">Humid Subtropical</option>
                <option value="Cold / Short Growing Season">Cold / Short Growing Season</option>
                <option value="Arid / Dry">Arid / Dry</option>
              </select>
            </div>
          </div>

        </div>

        {/* Section 3: Experience & Plant Interests */}
        <div className="botanical-card p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold font-serif-heading text-[#245B45] border-b border-[#EAE6D8] pb-3">
            3. Experience & Plant Preferences
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#245B45] mb-2">
              Gardening Experience
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "beginner", label: "Beginner", sub: "First time container gardener" },
                { id: "intermediate", label: "Intermediate", sub: "Kept a few herbs or potted plants alive" },
                { id: "advanced", label: "Experienced", sub: "Comfortable with pruning & pest care" },
              ].map(level => {
                const selected = experienceLevel === level.id;
                return (
                  <button
                    type="button"
                    key={level.id}
                    onClick={() => setExperienceLevel(level.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selected
                        ? "bg-[#DCE8D9]/50 border-[#245B45] ring-1 ring-[#245B45]"
                        : "bg-[#FCFBF7] border-[#E4E0CE] hover:border-[#245B45]/40"
                    }`}
                  >
                    <div className="font-bold text-xs text-[#245B45]">{level.label}</div>
                    <div className="text-[11px] text-[#26352C]/65 mt-0.5">{level.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#245B45] mb-2">
              What would you love to grow?
            </label>
            <div className="flex flex-wrap gap-2.5">
              {[
                { id: "herbs", label: "Culinary Herbs (Basil, Mint, Rosemary)" },
                { id: "vegetables", label: "Compact Vegetables (Cherry Tomatoes, Peppers, Lettuce)" },
                { id: "flowers", label: "Pollinator Flowers (Marigolds, Alyssum)" },
                { id: "fruits", label: "Strawberries & Berry Bushes" },
                { id: "air-purifying", label: "Foliage & Air Purifiers" }
              ].map(item => {
                const isSelected = interests.includes(item.id);
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => toggleInterest(item.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#245B45] text-white border-[#245B45] shadow-xs"
                        : "bg-[#FCFBF7] text-[#26352C]/80 border-[#E4E0CE] hover:border-[#245B45]/40"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-xs font-semibold text-[#26352C]/70 hover:text-[#245B45]"
          >
            Skip for now & go to Dashboard
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#245B45] hover:bg-[#1E4D3A] text-white text-sm font-semibold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
          >
            <span>{saving ? "Saving Space..." : "Generate My Garden Plan"}</span>
            <ArrowRight className="w-4 h-4 text-[#DCE8D9]" />
          </button>
        </div>

      </form>

    </div>
  );
}
