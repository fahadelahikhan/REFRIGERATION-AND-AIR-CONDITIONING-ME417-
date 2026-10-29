import React, { useState } from 'react';
import { REFRIGERANTS_DB, decodeRefrigerantNumber } from '../../utils/thermodynamics';
import { Droplets, Search, Check, AlertTriangle, ShieldCheck, Flame, Globe } from 'lucide-react';

export const ModuleRefrigerants: React.FC = () => {
  const [searchCode, setSearchCode] = useState<string>('R-134a');
  const [selectedRefId, setSelectedRefId] = useState<string>('R-134a');

  const decoded = decodeRefrigerantNumber(searchCode);
  const activeRef = REFRIGERANTS_DB[selectedRefId] || REFRIGERANTS_DB['R-134a'];

  return (
    <div className="space-y-6">
      {/* Syllabus Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-sky-400">ME417 · SYLLABUS TOPIC 3</span>
            <h2 className="text-xl font-bold text-white mt-0.5">Refrigerants & ASHRAE Designation System</h2>
            <p className="text-sm text-slate-400 mt-1">
              Chemical classification, Montreal & Kigali environmental mandates (ODP/GWP), ASHRAE safety groups (toxicity & flammability),
              and thermodynamic property comparison of primary and secondary working fluids.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive ASHRAE Designation Decoder */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 text-sky-400" />
            ASHRAE Standard 34 Designation Decoder
          </h3>
          <span className="text-xs text-slate-400 font-mono">Formula: R-(C-1)(H+1)(F)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs text-slate-300 font-medium">Enter Refrigerant Code to Decode:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="e.g. R-134a, R-22, R-717, R-12, R-410A"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono uppercase focus:outline-none focus:border-sky-500"
              />
              <button
                onClick={() => setSearchCode('R-134a')}
                className="px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-mono cursor-pointer"
              >
                R-134a
              </button>
              <button
                onClick={() => setSearchCode('R-22')}
                className="px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-mono cursor-pointer"
              >
                R-22
              </button>
              <button
                onClick={() => setSearchCode('R-717')}
                className="px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-mono cursor-pointer"
              >
                R-717
              </button>
            </div>
          </div>

          <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400">DECODED STRUCTURE</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                {decoded.type}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono mb-2">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">CARBON (C)</span>
                <span className="text-sm font-bold text-sky-400">{decoded.carbon !== undefined ? decoded.carbon : '-'}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">HYDROGEN (H)</span>
                <span className="text-sm font-bold text-emerald-400">{decoded.hydrogen !== undefined ? decoded.hydrogen : '-'}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">FLUORINE (F)</span>
                <span className="text-sm font-bold text-amber-400">{decoded.fluorine !== undefined ? decoded.fluorine : '-'}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">CHLORINE (Cl)</span>
                <span className="text-sm font-bold text-rose-400">{decoded.chlorine !== undefined ? decoded.chlorine : '-'}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {decoded.notes}
            </p>
          </div>
        </div>
      </div>

      {/* Refrigerant Database & Comparative Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Selector List */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-mono text-slate-400 block px-1">SELECT REFRIGERANT TO INSPECT:</span>
          {Object.values(REFRIGERANTS_DB).map((ref) => {
            const isSelected = selectedRefId === ref.id;
            return (
              <button
                key={ref.id}
                onClick={() => setSelectedRefId(ref.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-sky-950/70 border-sky-600 shadow-md'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-mono">{ref.id}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({ref.chemicalFormula})</span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">{ref.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {ref.safetyGroup.split(' ')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Property Inspector */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-start justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white font-mono">{activeRef.id}</span>
                <span className="text-xs text-slate-400 font-mono font-medium">· {activeRef.chemicalFormula}</span>
              </div>
              <span className="text-xs text-sky-400 block mt-0.5">{activeRef.classification}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">ASHRAE Safety Group</span>
              <span className="text-sm font-bold text-amber-400 font-mono">{activeRef.safetyGroup}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">OZONE DEPLETION (ODP)</span>
              <span className={`text-base font-bold mt-1 block ${activeRef.odp === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {activeRef.odp}
              </span>
              <span className="text-[9px] text-slate-500">Ref R-11 = 1.0</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">GLOBAL WARMING (GWP)</span>
              <span className={`text-base font-bold mt-1 block ${activeRef.gwp < 10 ? 'text-emerald-400' : activeRef.gwp > 1000 ? 'text-rose-400' : 'text-amber-400'}`}>
                {activeRef.gwp}
              </span>
              <span className="text-[9px] text-slate-500">100-yr CO₂ equivalent</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">NORMAL BOILING POINT</span>
              <span className="text-base font-bold text-sky-400 mt-1 block">
                {activeRef.boilingPoint1atm} °C
              </span>
              <span className="text-[9px] text-slate-500">At 1.013 bar (1 atm)</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">CRITICAL TEMP & PRES</span>
              <span className="text-sm font-bold text-purple-400 mt-1 block">
                {activeRef.criticalTemp}°C / {activeRef.criticalPressure} bar
              </span>
              <span className="text-[9px] text-slate-500">Liquid-vapor boundary</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2 font-mono">
              Primary Industrial Applications:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeRef.applications.map((app, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-200"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
            <span className="font-bold text-sky-400 block">Desirable Thermodynamic & Environmental Properties:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400">
              <div>• <strong>High Latent Heat (h_fg):</strong> Minimizes refrigerant charge and mass flow rate.</div>
              <div>• <strong>Positive Evaporator Pressure:</strong> Above 1 atm to prevent ambient air/moisture leaking in.</div>
              <div>• <strong>Moderate Condensing Pressure:</strong> Reduces pipe wall thickness and compressor weight.</div>
              <div>• <strong>High Dielectric Strength:</strong> Essential for hermetic motors submerged in vapor.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary vs Secondary Refrigerants & Azeotropes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
            <Droplets className="w-4 h-4 text-sky-400" />
            Primary vs Secondary Refrigerants
          </h3>
          <p className="text-slate-300 leading-relaxed">
            <strong>Primary Refrigerants:</strong> The working fluid that undergoes cyclical phase transformations (evaporation and condensation) directly inside the closed refrigeration loop (e.g., R-134a, R-717, R-410A).
          </p>
          <p className="text-slate-300 leading-relaxed">
            <strong>Secondary Refrigerants (Brines & Glycols):</strong> Liquids cooled by the primary refrigerant in a central plant and circulated to distant cooling coils without changing phase.
          </p>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px] text-slate-400">
            <div>• Water: Used for AC above 4°C (chilled water systems).</div>
            <div>• Propylene Glycol: Non-toxic secondary fluid for food & dairy processing.</div>
            <div>• Calcium Chloride (CaCl2) Brine: Eutectic point at -55°C (29.9% salt by mass).</div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            Azeotropes (500 Series) vs Zeotropes (400 Series)
          </h3>
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-bold text-emerald-400 block">Azeotropes (e.g., R-500, R-502, R-507A)</span>
              <p className="text-slate-300 mt-0.5">
                Blends of multiple refrigerants that evaporate and condense at a <strong>constant temperature</strong> without changing chemical composition. Behaves as a single pure chemical. Zero temperature glide.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-bold text-amber-400 block">Zeotropes / Near-Azeotropes (e.g., R-407C, R-410A)</span>
              <p className="text-slate-300 mt-0.5">
                Blends where components have differing boiling points. Phase transition occurs over a <strong>temperature glide</strong> (bubble point to dew point). Fractionation occurs during leaks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
