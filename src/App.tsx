import React, { useState } from 'react';
import { TopNav } from './components/TopNav';
import { ModuleSelector } from './components/ModuleSelector';
import { ModuleCarnot } from './components/modules/ModuleCarnot';
import { ModuleVCRS } from './components/modules/ModuleVCRS';
import { ModuleRefrigerants } from './components/modules/ModuleRefrigerants';
import { ModuleMultiPressure } from './components/modules/ModuleMultiPressure';
import { ModuleAbsorptionAndSpecial } from './components/modules/ModuleAbsorptionAndSpecial';
import { ModulePsychrometrics } from './components/modules/ModulePsychrometrics';
import { ModuleCoolingLoad } from './components/modules/ModuleCoolingLoad';
import { ModuleDistribution } from './components/modules/ModuleDistribution';
import { ModuleControlsAndFood } from './components/modules/ModuleControlsAndFood';
import { ModuleExamSolver } from './components/modules/ModuleExamSolver';
import { Snowflake, BookOpen, Layers, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeModule, setActiveModule] = useState<string>('carnot');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* 1. Universal Top Navigation Bar (Zone 1, Zone 2, Zone 3) */}
      <TopNav
        activeModule={activeModule}
        onSelectModule={(id) => setActiveModule(id)}
        onOpenExamPractice={() => setActiveModule('exam_solver')}
      />

      {/* 2. Interactive Syllabus Module Bar */}
      <ModuleSelector
        activeModule={activeModule}
        onSelect={(id) => setActiveModule(id)}
      />

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeModule === 'carnot' && <ModuleCarnot />}
        {activeModule === 'vcrs' && <ModuleVCRS />}
        {activeModule === 'refrigerants' && <ModuleRefrigerants />}
        {activeModule === 'multi_pressure' && <ModuleMultiPressure />}
        {activeModule === 'absorption_special' && <ModuleAbsorptionAndSpecial />}
        {activeModule === 'psychrometrics' && <ModulePsychrometrics />}
        {activeModule === 'load_calc' && <ModuleCoolingLoad />}
        {activeModule === 'distribution' && <ModuleDistribution />}
        {activeModule === 'controls_food' && <ModuleControlsAndFood />}
        {activeModule === 'exam_solver' && <ModuleExamSolver />}
      </main>

      {/* 4. Engineering Reference Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 px-6 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">ME417 Refrigeration & Air Conditioning</span>
            <span aria-hidden="true">·</span>
            <span>Mechanical Engineering Department</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-sky-400">ASHRAE Standard Reference</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>SI Metric Units</span>
            <span aria-hidden="true">·</span>
            <span>P_atm = 101.325 kPa</span>
            <span aria-hidden="true">·</span>
            <span>1 TR = 3.51685 kW</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
