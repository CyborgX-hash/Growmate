import React from "react";
import { Link } from "react-router-dom";
import { 
  Sliders, 
  Cpu, 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  ExternalLink, 
  Github, 
  Heart, 
  Footprints,
  Leaf,
  Database
} from "lucide-react";
import { useGarden } from "../context/GardenContext.jsx";

export default function SettingsAbout() {
  const { garden } = useGarden();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Header */}
      <div className="space-y-1 pb-6 border-b border-[#E4E0CE]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCE8D9] text-[#245B45] text-xs font-semibold">
          <Sliders className="w-3.5 h-3.5" />
          <span>System & Transparency</span>
        </div>
        <h1 className="text-3xl font-bold font-serif-heading text-[#245B45]">
          Settings, Models & Attribution
        </h1>
        <p className="text-xs sm:text-sm text-[#26352C]/75">
          Full technical disclosure of open-weight AI models, data privacy, and horticultural boundaries.
        </p>
      </div>

      {/* Section 1: Garden Preferences Quick Link */}
      <div className="botanical-card p-6 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-[#245B45]">Active Garden Sanctuary</h3>
          <p className="text-xs text-[#26352C]/70">
            Current configuration: <strong>{garden?.name || "My Garden"}</strong> ({garden?.gardenType || "Balcony"}, {garden?.sunlightHours || 4}h sun, {garden?.spaceSize || "Small Balcony"})
          </p>
        </div>
        <Link
          to="/setup"
          className="px-4 py-2 rounded-xl bg-[#245B45] text-white text-xs font-semibold hover:bg-[#1E4D3A] transition-colors shrink-0"
        >
          Edit Garden Setup
        </Link>
      </div>

      {/* Section 2: AI Model Specifications */}
      <div className="botanical-card p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-bold font-serif-heading text-[#245B45] border-b border-[#EAE6D8] pb-3 flex items-center gap-2">
          <Cpu className="w-5 h-5" />
          <span>AI Architecture & Open-Weight Models</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Gemma 3 4B IT Card */}
          <div className="p-5 rounded-2xl bg-[#FCFBF7] border border-[#E4E0CE] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#245B45] uppercase tracking-wider">Horticultural Planner</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCE8D9] text-[#245B45] font-bold">LLM</span>
            </div>
            <h4 className="font-bold text-base text-[#245B45]">Google Gemma 3 4B IT</h4>
            <p className="text-xs text-[#26352C]/75 leading-relaxed">
              Used for structured container planning, botanical care explanations, and outdoor Touch Grass mission generation. Calibrated with strict JSON schema validation.
            </p>
            <div className="pt-2">
              <a
                href="https://huggingface.co/google/gemma-3-4b-it"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-[#245B45] hover:underline inline-flex items-center gap-1"
              >
                <span>Hugging Face Model Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* PlantVillage ViT Card */}
          <div className="p-5 rounded-2xl bg-[#FCFBF7] border border-[#E4E0CE] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#245B45] uppercase tracking-wider">Leaf Health Vision</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCE8D9] text-[#245B45] font-bold">ViT</span>
            </div>
            <h4 className="font-bold text-base text-[#245B45]">PlantVillage ViT Classifier</h4>
            <p className="text-xs text-[#26352C]/75 leading-relaxed">
              Vision Transformer fine-tuned on the PlantVillage leaf dataset (38 conditions across 14 crops). Screenings return organic physical cultural steps without hazardous chemical prescriptions.
            </p>
            <div className="pt-2">
              <a
                href="https://huggingface.co/kimcomehome/plantvillage-vit-leaf-disease"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-[#245B45] hover:underline inline-flex items-center gap-1"
              >
                <span>Vision Model Identifier</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Section 3: Limitations & Safety Guidelines */}
      <div className="botanical-card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-white to-[#FAF8F2]">
        <h2 className="text-base font-bold font-serif-heading text-[#245B45] flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span>Horticultural & AI Limitations</span>
        </h2>

        <div className="space-y-2.5 text-xs text-[#26352C]/85 leading-relaxed">
          <p>
            • <strong>Screening, Not Confirmed Diagnosis:</strong> Plant leaf photographs alone cannot replace laboratory soil culture or physical agricultural inspection. Always observe moisture and stem vigor before taking drastic actions.
          </p>
          <p>
            • <strong>No Unsafe Pesticide Prescriptions:</strong> GrowMate emphasizes physical hygiene (pruning infected leaves, mulching, air circulation, base watering) and organic amendments rather than heavy chemical pesticides.
          </p>
          <p>
            • <strong>Microclimate Estimates:</strong> AI planning provides estimates calibrated to your reported space and sunlight. Local balcony wind tunnels and wall heat reflection can alter watering needs.
          </p>
        </div>
      </div>

      {/* Section 4: Data & Privacy */}
      <div className="botanical-card p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold font-serif-heading text-[#245B45] flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#245B45]" />
          <span>Data Privacy & Zero Tracking</span>
        </h2>

        <p className="text-xs text-[#26352C]/80 leading-relaxed">
          GrowMate is designed with complete user privacy. Garden data is isolated by a lightweight local guest ID stored solely on your browser. 
          Uploaded leaf images are processed entirely in-memory for model screening and are <strong>never permanently stored or monetized</strong>.
        </p>
      </div>

      {/* Section 5: Hacktoberfest 2026 Credits */}
      <div className="p-6 rounded-2xl bg-[#245B45] text-white space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#DCE8D9]">
          <Footprints className="w-4 h-4" />
          <span>Hacktoberfest 2026 • Touch Grass Edition</span>
        </div>
        <h3 className="font-bold text-lg font-serif-heading text-white">
          Crafted to reconnect humans with the soil
        </h3>
        <p className="text-xs text-white/80 leading-relaxed">
          Built as an open-source demonstration of human-centric AI that turns screen time into healthy outdoor gardening habit loops.
        </p>
      </div>

    </div>
  );
}
