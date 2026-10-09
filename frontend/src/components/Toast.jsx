import React from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useGarden } from "../context/GardenContext.jsx";

export default function Toast() {
  const { notification } = useGarden();

  if (!notification) return null;

  const bgColors = {
    success: "bg-[#245B45] text-white border-emerald-700",
    error: "bg-[#C87552] text-white border-orange-700",
    warning: "bg-amber-700 text-white border-amber-800",
    info: "bg-[#26352C] text-white border-gray-700"
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#DCE8D9]" />,
    error: <AlertCircle className="w-5 h-5 text-white" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-200" />,
    info: <Info className="w-5 h-5 text-[#DCE8D9]" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short no-print">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${bgColors[notification.type] || bgColors.info}`}>
        {icons[notification.type] || icons.info}
        <span>{notification.message}</span>
      </div>
    </div>
  );
}
