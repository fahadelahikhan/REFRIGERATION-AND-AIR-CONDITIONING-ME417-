import React, { useState, useMemo } from 'react';
import { calculateMultiStageOptimum } from '../../utils/thermodynamics';
import { Layers, Sliders, ArrowRight, Zap, CheckCircle2, Shield, Snowflake } from 'lucide-react';

export const ModuleMultiPressure: React.FC = () => {
  const [pEvap, setPEvap] = useState<number>(1.5); // bar
  const [pCond, setPCond] = useState<number>(16.0); // bar
  const [activeSubTab, setActiveSubTab] = useState<'flash' | 'cascade' | 'liquefaction'>('flash');

  const multiOpt = useMemo(() => {
    return calculateMultiStageOptimum(pEvap, pCond);
  }, [pEvap, pCond]);

  return (
    <div className="space-y-6">
      {/* Syllabus Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-sky-400">ME417 · SYLLABUS TOPIC 4</span>
            <h2 className="text-xl font-bold text-white mt-0.5">Multi-Pressure Systems, Cascade & Gas Liquefaction</h2>
            <p className="text-sm text-slate-400 mt-1">
              Intermediate pressure optimization, flash vapor removal, intercooling compression work savings,
              cascade cryogenic systems (-50°C to -100°C), and industrial liquefaction of air, methane, and helium.
            </p>
          </div>
          <div className="flex items-center gap-2 p-1 bg-slate-800 rounded-lg self-start">
            <button
              onClick={() => setActiveSubTab('flash')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeSubTab === 'flash' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Flash & Intercooling
            </button>
            <button
              onClick={() => setActiveSubTab('cascade')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeSubTab === 'cascade' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cascade System
            </button>
            <button
              onClick={() => setActiveSubTab('liquefaction')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeSubTab === 'liquefaction' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Gas Liquefaction
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'flash' && (
        <div className="space-y-6">
          {/* Controls & Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Pressure Controls & Intermediate Optimization
              </h3>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Evaporator Pressure (P_e):</span>
                  <span className="text-sky-400 font-mono">{pEvap.toFixed(1)} bar</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.1"
                  value={pEvap}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val < pCond - 2) setPEvap(val);
                  }}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Condenser Pressure (P_c):</span>
                  <span className="text-rose-400 font-mono">{pCond.toFixed(1)} bar</span>
                </div>
                <input
                  type="range"
                  min="8.0"
                  max="28.0"
                  step="0.5"
                  value={pCond}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val > pEvap + 2) setPCond(val);
                  }}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono space-y-1">
                <div className="text-slate-400">Total Single-Stage Ratio:</div>
                <div className="text-rose-400 font-bold text-sm">
                  r_p = P_c / P_e = {multiOpt.singleStageRatio.toFixed(2)}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Single-stage compression beyond r_p &gt; 6 to 8 causes excessive discharge temperatures and near-zero volumetric efficiency.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-800/60">
                <span className="text-[11px] text-sky-300 font-mono block">OPTIMUM INTERMEDIATE PRESSURE</span>
                <span className="text-2xl font-black text-white font-mono mt-1 block">
                  P_i = {multiOpt.P_intermediate_bar.toFixed(2)} bar
                </span>
                <span className="text-[10px] text-slate-400 font-mono block mt-1">
                  Formula: P_i = √(P_e · P_c)
                </span>
                <div className="mt-3 text-xs text-slate-300 space-y-1">
                  <div>Stage 1 Ratio: <span className="font-mono text-sky-400 font-bold">{multiOpt.stage1Ratio.toFixed(2)}</span></div>
                  <div>Stage 2 Ratio: <span className="font-mono text-sky-400 font-bold">{multiOpt.stage2Ratio.toFixed(2)}</span></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
                <span className="text-[11px] text-emerald-300 font-mono block">THEORETICAL WORK SAVINGS</span>
                <span className="text-2xl font-black text-white font-mono mt-1 block">
                  {multiOpt.workSavingsPercent.toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400 font-mono block mt-1">
                  Compared to single-stage compression
                </span>
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  Intercooling reduces the specific volume ($v_1 &gt; v_2$) of suction gas to the high-pressure stage, shifting compression closer to the isothermal work minimum ($w = \int v \, dP$).
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Flow Schematic */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-4">
              Two-Stage Compression Flow Circuit with Flash Gas Removal & Intercooling
            </h3>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto">
              <svg viewBox="0 0 680 260" className="w-full min-w-[600px] h-auto font-mono text-xs">
                {/* Evaporator (Low Pressure P_e) */}
                <rect x="30" y="90" width="100" height="70" rx="8" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
                <text x="80" y="125" fill="#fff" fontWeight="bold" textAnchor="middle">Evaporator</text>
                <text x="80" y="142" fill="#bae6fd" fontSize="10" textAnchor="middle">P_e: {pEvap.toFixed(1)} bar</text>

                {/* Low Stage Compressor */}
                <path d="M 170,100 L 230,115 L 230,145 L 170,160 Z" fill="#b45309" stroke="#f59e0b" strokeWidth="2" />
                <text x="200" y="134" fill="#fff" fontWeight="bold" fontSize="10" textAnchor="middle">LP Comp</text>

                {/* Flash Intercooler Drum */}
                <rect x="280" y="70" width="110" height="110" rx="10" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />
                <text x="335" y="100" fill="#38bdf8" fontWeight="bold" textAnchor="middle">Flash Chamber</text>
                <text x="335" y="115" fill="#94a3b8" fontSize="10" textAnchor="middle">& Intercooler</text>
                <text x="335" y="135" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">P_i: {multiOpt.P_intermediate_bar.toFixed(1)} bar</text>
                {/* Liquid Level */}
                <rect x="282" y="145" width="106" height="33" rx="0" fill="rgba(14, 165, 233, 0.4)" />
                <text x="335" y="165" fill="#bae6fd" fontSize="9" textAnchor="middle">Liquid Pool</text>

                {/* High Stage Compressor */}
                <path d="M 430,70 L 490,85 L 490,115 L 430,130 Z" fill="#be123c" stroke="#f43f5e" strokeWidth="2" />
                <text x="460" y="104" fill="#fff" fontWeight="bold" fontSize="10" textAnchor="middle">HP Comp</text>

                {/* Condenser (High Pressure P_c) */}
                <rect x="530" y="80" width="110" height="70" rx="8" fill="#991b1b" stroke="#f87171" strokeWidth="2" />
                <text x="585" y="115" fill="#fff" fontWeight="bold" textAnchor="middle">Condenser</text>
                <text x="585" y="132" fill="#fecaca" fontSize="10" textAnchor="middle">P_c: {pCond.toFixed(1)} bar</text>

                {/* Piping Connections */}
                {/* Evaporator to LP Comp */}
                <line x1="130" y1="125" x2="170" y2="125" stroke="#38bdf8" strokeWidth="3" />
                {/* LP Comp discharge into Flash Intercooler */}
                <line x1="230" y1="130" x2="280" y2="130" stroke="#f59e0b" strokeWidth="3" />
                {/* Flash vapor from drum to HP Comp */}
                <path d="M 335,70 L 335,50 L 410,50 L 410,100 L 430,100" fill="none" stroke="#38bdf8" strokeWidth="3" />
                {/* HP Comp to Condenser */}
                <line x1="490" y1="100" x2="530" y2="100" stroke="#f43f5e" strokeWidth="3" />
                {/* Condenser liquid to Expansion Valve 1 */}
                <path d="M 585,150 L 585,210 L 360,210 L 360,180" fill="none" stroke="#10b981" strokeWidth="2.5" />
                <polygon points="460,205 470,215 470,205 460,215" fill="#10b981" />
                <text x="465" y="230" fill="#10b981" fontSize="9" textAnchor="middle">Exp Valve 1 (P_c → P_i)</text>

                {/* Flash Chamber subcooled liquid to Expansion Valve 2 */}
                <path d="M 300,180 L 300,210 L 80,210 L 80,160" fill="none" stroke="#06b6d4" strokeWidth="2.5" />
                <polygon points="180,205 190,215 190,205 180,215" fill="#06b6d4" />
                <text x="185" y="230" fill="#06b6d4" fontSize="9" textAnchor="middle">Exp Valve 2 (P_i → P_e)</text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'cascade' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Snowflake className="w-5 h-5 text-sky-400" />
                Cascade Refrigeration Systems for Cryogenic Temperatures (-50°C to -100°C)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Combining two or more individual vapor compression circuits using chemically tailored refrigerants connected through a cascade condenser.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="font-bold text-rose-400 text-sm block">High-Temperature Circuit (Top Stage)</span>
              <p className="text-slate-300 leading-relaxed">
                Uses a moderate-pressure refrigerant like <strong>Ammonia (R-717)</strong> or <strong>R-134a</strong>.
                Condenses against ambient air or cooling tower water at +35°C to +40°C.
                Evaporator of this cycle acts as the condenser for the bottom cycle at approx -10°C to -15°C.
              </p>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[11px]">
                Ambient (+35°C) → Condenser → Expansion Valve → Cascade Condenser (-10°C)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="font-bold text-sky-400 text-sm block">Low-Temperature Circuit (Bottom Stage)</span>
              <p className="text-slate-300 leading-relaxed">
                Uses a low-boiling-point fluid like <strong>Carbon Dioxide (R-744, CO2)</strong>, <strong>Ethane (R-170)</strong>, or <strong>R-23</strong>.
                Condenses at -10°C inside the cascade heat exchanger and evaporates in the ultra-cold room at -50°C to -80°C.
              </p>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[11px]">
                Cascade Condenser (-10°C) → Expansion Valve → Ultra-Cold Evap (-70°C)
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-white">Why Single-Stage Fails at Cryogenic Temperatures:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-400">
              <div>• <strong>Vacuum Pressure Hazards:</strong> Refrigerants like R-134a would operate deep in vacuum at -60°C, drawing air/moisture in through seals.</div>
              <div>• <strong>Massive Specific Volume:</strong> Low suction pressures produce huge specific volume ($v_g$), requiring gargantuan compressor cylinders.</div>
              <div>• <strong>Freezing Point Limits:</strong> Refrigerant must never freeze inside coils (CO2 solidifies at triple point -56.6°C / 5.18 bar).</div>
              <div>• <strong>Cascade Energy Balance:</strong> ṁ_top · (h_top,evap - h_top,in) = ṁ_bot · (h_bot,dis - h_bot,liq).</div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'liquefaction' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Liquefaction of Gases: Air, Natural Gas & Helium</h3>
            <p className="text-xs text-slate-400 mt-1">
              Thermodynamic principles: Inversion temperature curve, Joule-Thomson effect (μ_JT &gt; 0), regenerative cooling, and expansion work extraction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-sky-400 text-sm block">1. Air Liquefaction (-194°C)</span>
              <p className="text-slate-300 leading-relaxed">
                <strong>Linde-Hampson Cycle:</strong> Air compressed to 200 bar, pre-cooled, passes through counter-flow regenerative heat exchanger, and throttles across JT valve. Liquid air collects in separator while unliquefied vapor returns to cool incoming air.
              </p>
              <span className="text-[11px] text-slate-400 block pt-2 border-t border-slate-800">
                <strong>Claude Cycle:</strong> Adds an isentropic expansion engine extracting work ($T \downarrow$), drastically increasing liquid yield.
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 text-sm block">2. Liquefied Natural Gas (-162°C)</span>
              <p className="text-slate-300 leading-relaxed">
                Methane ($CH_4$) liquefaction reduces volume by 600 times for maritime ocean transport. Uses <strong>Mixed Refrigerant Cascade (CMR)</strong> consisting of nitrogen, methane, ethane, and propane tailored to match natural gas cooling curves.
              </p>
              <span className="text-[11px] text-slate-400 block pt-2 border-t border-slate-800">
                Key equipment: Cryogenic spiral-wound heat exchangers (MCHE).
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-purple-400 text-sm block">3. Helium Liquefaction (4.2 K)</span>
              <p className="text-slate-300 leading-relaxed">
                Helium has an ultra-low maximum Joule-Thomson inversion temperature of only <strong>40 K (-233°C)</strong>! Throttling above 40K heats helium up. Must be pre-cooled with liquid nitrogen (77 K) and liquid hydrogen (20 K) before final throttling.
              </p>
              <span className="text-[11px] text-slate-400 block pt-2 border-t border-slate-800">
                Collins Helium Cryostat with dual reciprocating expansion engines.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
