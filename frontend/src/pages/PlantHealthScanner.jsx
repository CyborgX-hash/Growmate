import React, { useState, useRef } from "react";
import { 
  Activity, 
  UploadCloud, 
  Image as ImageIcon, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw, 
  Info, 
  Leaf,
  Plus,
  ArrowRight
} from "lucide-react";
import { api } from "../services/api.js";
import { useGarden } from "../context/GardenContext.jsx";

export default function PlantHealthScanner() {
  const { plants, refreshPlants, showToast } = useGarden();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedPlantId, setSelectedPlantId] = useState("");
  const [scanning, setScanning] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [error, setError] = useState(null);
  const [missingCreds, setMissingCreds] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, or WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image file size exceeds 10MB limit.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    setDiagnosisResult(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError(null);
        setDiagnosisResult(null);
      } else {
        setError("Please drop a valid image file.");
      }
    }
  };

  const handleScan = async () => {
    if (!selectedFile) return;

    setScanning(true);
    setError(null);
    setMissingCreds(false);

    const formData = new FormData();
    formData.append("image", selectedFile);
    if (selectedPlantId) {
      formData.append("plantId", selectedPlantId);
    }

    try {
      const res = await api.diagnoseLeaf(formData);
      if (res.success && res.data) {
        setDiagnosisResult(res.data);
        showToast("🌿 Leaf scan completed!", "success");
        if (selectedPlantId) {
          refreshPlants();
        }
      }
    } catch (err) {
      if (err.data?.missingCredentials) {
        setMissingCreds(true);
      }
      setError(err.message || "Failed to complete leaf screening.");
      showToast(err.message || "Screening failed.", "error");
    } finally {
      setScanning(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDiagnosisResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-[#E4E0CE]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCE8D9] text-[#245B45] text-xs font-semibold">
          <Activity className="w-3.5 h-3.5" />
          <span>PlantVillage ViT Leaf Vision</span>
        </div>
        <h1 className="text-3xl font-bold font-serif-heading text-[#245B45]">
          Plant Leaf Health Scanner
        </h1>
        <p className="text-xs sm:text-sm text-[#26352C]/75 max-w-2xl leading-relaxed">
          Upload a clear photograph of a single plant leaf. The <strong>PlantVillage ViT</strong> vision model 
          screens for 38 conditions across 14 fruit, vegetable, and berry crops.
        </p>
      </div>

      {/* Model Scope & Ethical Guardrail Callout */}
      <div className="p-4 rounded-2xl bg-[#FCFBF7] border border-[#E4E0CE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#26352C]/80">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#245B45] shrink-0" />
          <div>
            <span className="font-bold text-[#245B45]">Supported Crops: </span>
            <span>Tomato, Pepper, Potato, Strawberry, Apple, Grape, Cherry, Corn, Citrus, Peach, Raspberry, Blueberry, Squash, Soybean.</span>
          </div>
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#DCE8D9] text-[#245B45] shrink-0">
          38 Classes
        </span>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Upload Area & Plant Selector */}
        <div className="lg:col-span-6 space-y-6">
          <div className="botanical-card p-6 space-y-5">
            
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#245B45]">
              Upload Leaf Image
            </h2>

            {/* Drag & Drop Box */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                previewUrl 
                  ? "border-[#245B45] bg-[#DCE8D9]/10" 
                  : "border-[#D8D2BC] hover:border-[#245B45] bg-[#FCFBF7]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {previewUrl ? (
                <div className="space-y-3">
                  <img
                    src={previewUrl}
                    alt="Leaf Preview"
                    className="max-h-60 mx-auto rounded-xl object-contain border border-[#E4E0CE] shadow-xs"
                  />
                  <div className="text-xs text-[#245B45] font-semibold">
                    Click or drop another image to replace
                  </div>
                </div>
              ) : (
                <div className="py-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#DCE8D9] text-[#245B45] flex items-center justify-center mx-auto">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#245B45]">Click to upload</span>
                    <span className="text-xs text-[#26352C]/70"> or drag and drop leaf photo</span>
                  </div>
                  <p className="text-[11px] text-[#26352C]/60">
                    Supports JPEG, PNG, WebP up to 10MB.
                  </p>
                </div>
              )}
            </div>

            {/* Associate with Garden Plant */}
            {plants.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#245B45] mb-1.5 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" />
                  <span>Attach result to plant history (Optional)</span>
                </label>
                <select
                  value={selectedPlantId}
                  onChange={(e) => setSelectedPlantId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4E0CE] bg-[#FCFBF7] text-xs focus:ring-2 focus:ring-[#245B45] focus:outline-none"
                >
                  <option value="">-- General / Unassigned Leaf Scan --</option>
                  {plants.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} {p.species ? `(${p.species})` : ""}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleScan}
                disabled={!selectedFile || scanning}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#245B45] hover:bg-[#1E4D3A] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
              >
                {scanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#DCE8D9]" />
                    <span>Analyzing Leaf Pixels...</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4 text-[#DCE8D9]" />
                    <span>Run PlantVillage Screening</span>
                  </>
                )}
              </button>

              {previewUrl && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-3 rounded-xl border border-[#E4E0CE] text-xs font-semibold text-[#26352C]/70 hover:bg-[#F0ECE1]"
                >
                  Clear
                </button>
              )}
            </div>

          </div>

          {/* Missing Credentials Warning Banner */}
          {missingCreds && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>AI Vision Inference Endpoint Setup</span>
              </div>
              <p className="leading-relaxed">
                To run live inference with <code>kimcomehome/plantvillage-vit-leaf-disease</code>:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li>Add your free <code>HUGGINGFACE_API_KEY</code> to <code>backend/.env</code>, OR</li>
                <li>Run the included Python FastAPI microservice: <code>cd python-vision-service && uvicorn main:app --port 8000</code></li>
              </ul>
            </div>
          )}

          {error && !missingCreds && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

        </div>

        {/* Right Column: Diagnostic Results */}
        <div className="lg:col-span-6">
          {diagnosisResult ? (
            <div className="botanical-card p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
              
              {/* Top Result Banner */}
              <div className="flex items-start justify-between pb-4 border-b border-[#EAE6D8]">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F9477]">
                    Screening Result
                  </span>
                  <h3 className="text-xl font-bold font-serif-heading text-[#245B45]">
                    {diagnosisResult.crop} • {diagnosisResult.disease}
                  </h3>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  diagnosisResult.isHealthy 
                    ? "bg-emerald-100 text-emerald-800" 
                    : "bg-amber-100 text-amber-900"
                }`}>
                  {diagnosisResult.isHealthy ? "Healthy Leaf" : "Needs Attention"}
                </div>
              </div>

              {/* Confidence & Model details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#FCFBF7] rounded-xl border border-[#E4E0CE]">
                  <span className="text-[11px] text-[#26352C]/60 block">Confidence Score</span>
                  <span className="font-bold text-sm text-[#245B45]">
                    {diagnosisResult.confidenceScore !== null 
                      ? `${(diagnosisResult.confidenceScore * 100).toFixed(1)}%` 
                      : "Screening Match"}
                  </span>
                </div>
                <div className="p-3 bg-[#FCFBF7] rounded-xl border border-[#E4E0CE]">
                  <span className="text-[11px] text-[#26352C]/60 block">ViT Model Engine</span>
                  <span className="font-bold text-xs text-[#245B45] truncate block">
                    PlantVillage ViT
                  </span>
                </div>
              </div>

              {/* Plain Language Explanation */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#245B45]">
                  Plain Language Assessment
                </h4>
                <p className="text-xs text-[#26352C]/85 leading-relaxed bg-[#F6F4EC] p-4 rounded-xl border border-[#EAE6D8]">
                  {diagnosisResult.plainExplanation}
                </p>
              </div>

              {/* Cautious Next Steps */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#245B45]">
                  Cautious Horticultural Steps
                </h4>
                <div className="space-y-2">
                  {diagnosisResult.cautiousNextSteps?.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#26352C]/80">
                      <CheckCircle2 className="w-4 h-4 text-[#245B45] shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cautious AI Screening Disclaimer */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-700" />
                  <span>Important Safety & Screening Notice</span>
                </div>
                <p>
                  {diagnosisResult.disclaimer || "AI-assisted screening only. Photographs do not constitute official laboratory proof. Always avoid unsafe synthetic pesticide overuse."}
                </p>
              </div>

            </div>
          ) : (
            <div className="botanical-card p-12 text-center space-y-4 text-[#26352C]/70">
              <div className="w-16 h-16 rounded-2xl bg-[#DCE8D9]/40 text-[#245B45] flex items-center justify-center mx-auto">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="font-serif-heading font-bold text-lg text-[#245B45]">
                Awaiting Leaf Photograph
              </h3>
              <p className="text-xs max-w-sm mx-auto leading-relaxed">
                Take a close, well-lit photo of a single leaf showing both healthy areas and any spots, curling, or discoloration.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
