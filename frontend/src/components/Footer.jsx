import React from "react";
import { Link } from "react-router-dom";
import { Sprout, Heart, ShieldCheck, Cpu, Github, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#E4E0CE] bg-[#FCFBF7] text-[#26352C] mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand & Philosophy */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#245B45] flex items-center justify-center text-white">
                <Sprout className="w-5 h-5 text-[#DCE8D9]" />
              </div>
              <span className="text-lg font-bold font-serif-heading text-[#245B45]">GrowMate</span>
            </div>
            <p className="text-xs text-[#26352C]/75 leading-relaxed">
              An AI gardening companion crafted to turn digital intelligence into real-world horticultural action. 
              Designed for beginner, home, and balcony plant lovers.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#DCE8D9]/70 text-[#245B45] text-xs font-semibold">
              <span>Hacktoberfest 2026</span>
              <span>•</span>
              <span>Touch Grass</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#245B45] mb-3">Gardening Tools</h4>
            <ul className="space-y-2 text-xs text-[#26352C]/80 font-medium">
              <li><Link to="/touch-grass" className="hover:text-[#245B45] transition-colors">Touch Grass Mode (Daily)</Link></li>
              <li><Link to="/planner" className="hover:text-[#245B45] transition-colors">Gemma Garden Planner</Link></li>
              <li><Link to="/scanner" className="hover:text-[#245B45] transition-colors">PlantVillage ViT Health Scanner</Link></li>
              <li><Link to="/calendar" className="hover:text-[#245B45] transition-colors">Care Calendar & Printable Checklist</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#245B45] transition-colors">Garden Sanctuary Dashboard</Link></li>
            </ul>
          </div>

          {/* Col 3: AI & Technology */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#245B45] mb-3">AI & Open Weights</h4>
            <ul className="space-y-2 text-xs text-[#26352C]/80">
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#6F9477]" />
                <a href="https://huggingface.co/google/gemma-3-4b-it" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                  Google Gemma 3 4B IT <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#6F9477]" />
                <a href="https://huggingface.co/kimcomehome/plantvillage-vit-leaf-disease" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                  PlantVillage ViT (38 Classes) <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li className="text-[11px] text-[#26352C]/60 pt-1">
                Zero data tracking. Image bytes processed strictly for screening without surveillance.
              </li>
            </ul>
          </div>

          {/* Col 4: Open Source & Attribution */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#245B45] mb-3">Attribution & Links</h4>
            <p className="text-xs text-[#26352C]/75 leading-relaxed mb-3">
              Built with React, Vite, Tailwind CSS, Node.js, Express, and Prisma ORM.
            </p>
            <div className="flex items-center gap-2">
              <Link 
                to="/settings" 
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EAE6D8] hover:bg-[#DED9C7] text-xs font-medium text-[#245B45] transition-colors"
              >
                Model Details & Disclaimers
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#E4E0CE] flex flex-col sm:flex-row items-center justify-between text-xs text-[#26352C]/60 gap-4">
          <div className="flex items-center gap-1">
            <span>Cultivated with care for</span>
            <span className="font-semibold text-[#245B45]">Hacktoberfest 2026</span>
            <span>— Leave the screen and touch grass today 🌱</span>
          </div>
          <div>
            <span>GrowMate MVP • AI Assisted Screening Only • Not Confirmed Diagnosis</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
