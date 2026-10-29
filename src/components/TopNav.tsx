import React from 'react';
import { Snowflake, BookOpen, Sparkles } from 'lucide-react';

interface TopNavProps {
  activeModule: string;
  onSelectModule: (id: string) => void;
  onOpenExamPractice: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeModule,
  onSelectModule,
  onOpenExamPractice,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-6 py-3.5 flex items-center justify-between gap-8 transition-colors">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
          <Snowflake className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
            ME417 Refrigeration & Air Conditioning
          </span>
          <span className="text-xs text-sky-400 font-mono">Thermodynamic Simulation Suite</span>
        </div>
      </div>

      {/* Zone 2: Single-line Navigation Links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => onSelectModule('carnot')}
          className={`hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 ${
            activeModule === 'carnot' ? 'text-sky-400 font-semibold' : ''
          }`}
        >
          Reversed Carnot
        </button>
        <button
          onClick={() => onSelectModule('vcrs')}
          className={`hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 ${
            activeModule === 'vcrs' ? 'text-sky-400 font-semibold' : ''
          }`}
        >
          VCRS Cycle & Diagrams
        </button>
        <button
          onClick={() => onSelectModule('refrigerants')}
          className={`hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 ${
            activeModule === 'refrigerants' ? 'text-sky-400 font-semibold' : ''
          }`}
        >
          Refrigerants DB
        </button>
        <button
          onClick={() => onSelectModule('psychrometrics')}
          className={`hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 ${
            activeModule === 'psychrometrics' ? 'text-sky-400 font-semibold' : ''
          }`}
        >
          Psychrometric Chart
        </button>
        <button
          onClick={() => onSelectModule('load_calc')}
          className={`hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 ${
            activeModule === 'load_calc' ? 'text-sky-400 font-semibold' : ''
          }`}
        >
          AC Load & Systems
        </button>
      </nav>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenExamPractice}
          className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-all shadow-md shadow-sky-600/20 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Interactive Problem Solver</span>
        </button>
      </div>
    </header>
  );
};
