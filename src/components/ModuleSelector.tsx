import React from 'react';
import {
  Thermometer,
  Gauge,
  Layers,
  Wind,
  Flame,
  Droplets,
  Activity,
  Compass,
  Cpu,
  BookOpen
} from 'lucide-react';

export interface ModuleTab {
  id: string;
  part: 'Refrigeration' | 'Air Conditioning' | 'Practice';
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const MODULES: ModuleTab[] = [
  {
    id: 'carnot',
    part: 'Refrigeration',
    title: '1. Introduction & Reversed Carnot',
    subtitle: 'SFEE, Methods of Refrigeration, Carnot & Heat Pump COP',
    icon: Thermometer
  },
  {
    id: 'vcrs',
    part: 'Refrigeration',
    title: '2. Vapor Compression (VCRS)',
    subtitle: 'Interactive P-h / T-s Diagrams, Components, Volumetric Efficiency',
    icon: Gauge
  },
  {
    id: 'refrigerants',
    part: 'Refrigeration',
    title: '3. Refrigerants & Nomenclature',
    subtitle: 'ASHRAE Designation Decoder, Primary/Secondary, ODP & GWP',
    icon: Droplets
  },
  {
    id: 'multi_pressure',
    part: 'Refrigeration',
    title: '4. Multi-Pressure & Cascade',
    subtitle: 'Flash Gas Removal, Intercooling Savings, Cascade Cryogenics',
    icon: Layers
  },
  {
    id: 'absorption_special',
    part: 'Refrigeration',
    title: '5. Absorption & Special Cycles',
    subtitle: 'VARS, Electrolux 3-fluid, Aircraft Bootstrap, Steam Jet, Vortex & Dry Ice',
    icon: Flame
  },
  {
    id: 'psychrometrics',
    part: 'Air Conditioning',
    title: '6. Psychrometric Chart & Processes',
    subtitle: 'Interactive ASHRAE Chart, Sensible/Latent, ADP & Bypass Factor',
    icon: Wind
  },
  {
    id: 'load_calc',
    part: 'Air Conditioning',
    title: '7. Cooling Load & Comfort',
    subtitle: 'Thermal Comfort Chart, RSHF, CFM Sizing, Cooling Coil Selection',
    icon: Activity
  },
  {
    id: 'distribution',
    part: 'Air Conditioning',
    title: '8. Duct & Hydronic Distribution',
    subtitle: 'Equal Friction Duct Design, Fan Selection, Direct vs Reverse Return',
    icon: Compass
  },
  {
    id: 'controls_food',
    part: 'Air Conditioning',
    title: '9. Controls & Food Preservation',
    subtitle: 'Pneumatic/DDC Controls, Freezing Curves, Chilling & Freeze-Drying',
    icon: Cpu
  },
  {
    id: 'exam_solver',
    part: 'Practice',
    title: '10. Exam Numerical Problem Solver',
    subtitle: 'Step-by-step thermodynamic problem solver for ME417 exam problems',
    icon: BookOpen
  }
];

interface ModuleSelectorProps {
  activeModule: string;
  onSelect: (id: string) => void;
}

export const ModuleSelector: React.FC<ModuleSelectorProps> = ({ activeModule, onSelect }) => {
  return (
    <div className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-2.5 overflow-x-auto scrollbar-thin">
      <div className="flex items-center gap-2 min-w-max">
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          const isActive = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => onSelect(mod.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-500/20'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-sky-400'}`} />
              <div className="flex flex-col">
                <span className="font-semibold leading-tight">{mod.title}</span>
                <span className={`text-[10px] ${isActive ? 'text-sky-100' : 'text-slate-400'}`}>
                  {mod.part}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
