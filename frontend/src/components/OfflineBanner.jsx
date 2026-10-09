import React from "react";
import { WifiOff, Info } from "lucide-react";
import { useGarden } from "../context/GardenContext.jsx";

export default function OfflineBanner() {
  const { isOnline } = useGarden();

  if (isOnline) return null;

  return (
    <div className="bg-[#C87552]/10 border-b border-[#C87552]/30 px-4 py-2.5 text-xs text-[#7D5340] flex items-center justify-between no-print">
      <div className="max-w-7xl mx-auto flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-[#C87552] shrink-0" />
        <div>
          <span className="font-semibold">Offline Mode Active: </span>
          <span>
            You are browsing cached garden instructions and missions. You can complete tasks and print checklists locally. New AI planning requires internet.
          </span>
        </div>
      </div>
    </div>
  );
}
