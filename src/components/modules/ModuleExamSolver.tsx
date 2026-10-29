import React, { useState } from 'react';
import {
  calculateReversedCarnot,
  analyzeVCRSCycle,
  calculateMultiStageOptimum,
  calculatePsychrometricState,
  analyzeCoolingCoil,
  calculateEquivalentDuctDiameter
} from '../../utils/thermodynamics';
import { BookOpen, Check, Play, RefreshCw, Calculator, ArrowRight, Info } from 'lucide-react';

export const ModuleExamSolver: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<number>(1);

  // Problem 1: VCRS inputs
  const [p1TEvap, setP1TEvap] = useState<number>(-10);
  const [p1TCond, setP1TCond] = useState<number>(40);
  const [p1SH, setP1SH] = useState<number>(5);
  const [p1SC, setP1SC] = useState<number>(5);
  const [p1TR, setP1TR] = useState<number>(5);

  // Problem 2: Psychrometric coil inputs
  const [p2TDb, setP2TDb] = useState<number>(32);
  const [p2Rh, setP2Rh] = useState<number>(60);
  const [p2Adp, setP2Adp] = useState<number>(10);
  const [p2Bpf, setP2Bpf] = useState<number>(0.15);
  const [p2FlowCfm, setP2FlowCfm] = useState<number>(2500);

  // Problem 3: Carnot inputs
  const [p3TL, setP3TL] = useState<number>(-15);
  const [p3TH, setP3TH] = useState<number>(35);
  const [p3TR, setP3TR] = useState<number>(3);

  // Problem 4: Multi-stage inputs
  const [p4Pe, setP4Pe] = useState<number>(1.2);
  const [p4Pc, setP4Pc] = useState<number>(14.5);

  // Problem 5: Duct sizing
  const [p5W, setP5W] = useState<number>(600);
  const [p5H, setP5H] = useState<number>(350);

  return (
    <div className="space-y-6">
      {/* Syllabus Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-sky-400">ME417 · UNIVERSITY EXAM SUITE</span>
            <h2 className="text-xl font-bold text-white mt-0.5">Interactive Exam Problem Solver & Step-by-Step Verifier</h2>
            <p className="text-sm text-slate-400 mt-1">
              Test your engineering derivations against verified thermodynamic formulas.
              Select standard university examination problems below, adjust parameters, and review full mathematical solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Problem Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { id: 1, title: 'Problem 1: VCRS Cycle Analysis', desc: 'COP, Mass flow & Power' },
          { id: 2, title: 'Problem 2: Cooling Coil ADP & BPF', desc: 'Summer Air Conditioning' },
          { id: 3, title: 'Problem 3: Carnot vs Actual COP', desc: '2nd Law Thermodynamics' },
          { id: 4, title: 'Problem 4: Multi-Stage Intercooling', desc: 'Intermediate Pressure P_i' },
          { id: 5, title: 'Problem 5: Rectangular Duct Design', desc: 'Huebscher Equivalent Dia' }
        ].map((prob) => (
          <button
            key={prob.id}
            onClick={() => setSelectedProblem(prob.id)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedProblem === prob.id
                ? 'bg-sky-950/70 border-sky-600 shadow-md'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="font-bold text-xs text-white block">{prob.title}</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">{prob.desc}</span>
          </button>
        ))}
      </div>

      {/* Selected Problem Solution Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
        {selectedProblem === 1 && (() => {
          const res = analyzeVCRSCycle({
            refrigerant: 'R-134a',
            T_evap_C: p1TEvap,
            T_cond_C: p1TCond,
            superheat_K: p1SH,
            subcooling_K: p1SC,
            compressorIsentropicEfficiency: 0.82,
            clearanceRatio: 0.04,
            coolingCapacity_TR: p1TR
          });

          return (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  ME417 Numerical Problem 1: R-134a Vapor Compression Cycle with Superheating & Subcooling
                </h3>
              </div>

              {/* Adjustable Problem Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Evaporator Temp:</span>
                  <input
                    type="number"
                    value={p1TEvap}
                    onChange={(e) => setP1TEvap(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">°C (T_e)</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Condenser Temp:</span>
                  <input
                    type="number"
                    value={p1TCond}
                    onChange={(e) => setP1TCond(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">°C (T_c)</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Superheat:</span>
                  <input
                    type="number"
                    value={p1SH}
                    onChange={(e) => setP1SH(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">K (ΔT_sh)</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Subcooling:</span>
                  <input
                    type="number"
                    value={p1SC}
                    onChange={(e) => setP1SC(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">K (ΔT_sc)</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Cooling Duty:</span>
                  <input
                    type="number"
                    value={p1TR}
                    onChange={(e) => setP1TR(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">TR (Tonnage)</span>
                </div>
              </div>

              {/* Step-by-Step Mathematical Solution */}
              <div className="space-y-4 text-xs font-mono">
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-sky-400 font-bold block">Step 1: State Point Enthalpies from Saturation Properties</span>
                  <p className="text-slate-300">
                    At T_e = {p1TEvap}°C: P_e = {res.P_evap_bar.toFixed(2)} bar.
                    Suction vapor is superheated by {p1SH} K:
                    <span className="text-emerald-400 font-bold ml-2">h₁ = {res.h1.toFixed(1)} kJ/kg</span>.
                  </p>
                  <p className="text-slate-300">
                    At T_c = {p1TCond}°C: P_c = {res.P_cond_bar.toFixed(2)} bar.
                    Liquid leaving condenser is subcooled by {p1SC} K:
                    <span className="text-emerald-400 font-bold ml-2">h₃ = {res.h3.toFixed(1)} kJ/kg</span>.
                  </p>
                  <p className="text-slate-300">
                    Throttling across expansion valve is isenthalpic:
                    <span className="text-emerald-400 font-bold ml-2">h₄ = h₃ = {res.h4.toFixed(1)} kJ/kg</span>.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-amber-400 font-bold block">Step 2: Refrigerating Effect (RE)</span>
                  <p className="text-slate-300">
                    RE = h₁ - h₄ = {res.h1.toFixed(1)} - {res.h4.toFixed(1)} =
                    <span className="text-emerald-400 font-bold ml-2">{res.refrigeratingEffect_kJ_kg.toFixed(1)} kJ/kg</span>.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-purple-400 font-bold block">Step 3: Mass Flow Rate of Refrigerant</span>
                  <p className="text-slate-300">
                    Cooling capacity Q_e = {p1TR} TR × 3.517 kW/TR = {(p1TR * 3.51685).toFixed(2)} kW.
                  </p>
                  <p className="text-slate-300">
                    ṁ = Q_e / RE = {(p1TR * 3.51685).toFixed(2)} / {res.refrigeratingEffect_kJ_kg.toFixed(1)} =
                    <span className="text-emerald-400 font-bold ml-2">
                      {res.massFlowRate_kg_s.toFixed(4)} kg/s ({(res.massFlowRate_kg_s * 60).toFixed(2)} kg/min)
                    </span>.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-rose-400 font-bold block">Step 4: Compressor Power & Performance (COP)</span>
                  <p className="text-slate-300">
                    Specific compression work w = h₂ - h₁ = {res.h2.toFixed(1)} - {res.h1.toFixed(1)} = {res.workCompression_kJ_kg.toFixed(1)} kJ/kg.
                  </p>
                  <p className="text-slate-300">
                    Compressor Power P = ṁ · w = {res.massFlowRate_kg_s.toFixed(4)} × {res.workCompression_kJ_kg.toFixed(1)} =
                    <span className="text-emerald-400 font-bold ml-2">{res.compressorPower_kW.toFixed(2)} kW ({(res.compressorPower_kW * 1.341).toFixed(2)} HP)</span>.
                  </p>
                  <p className="text-slate-300">
                    Actual Coefficient of Performance:
                    <span className="text-sky-400 font-bold ml-2 text-sm">COP = RE / w = {res.actualCOP.toFixed(2)}</span>.
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {selectedProblem === 2 && (() => {
          const inlet = calculatePsychrometricState(p2TDb, p2Rh);
          const coil = analyzeCoolingCoil(inlet, p2Adp, p2Bpf);
          const massFlow_kg_s = (p2FlowCfm * 0.000471947) / inlet.specificVolume_m3_kg;
          const totalLoad_kW = massFlow_kg_s * coil.deltaH;
          const totalTR = totalLoad_kW / 3.51685;

          return (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                ME417 Numerical Problem 2: Cooling and Dehumidifying Coil Sizing (ADP & BPF)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Inlet Dry Bulb:</span>
                  <input
                    type="number"
                    value={p2TDb}
                    onChange={(e) => setP2TDb(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">°C (T_db1)</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Inlet RH:</span>
                  <input
                    type="number"
                    value={p2Rh}
                    onChange={(e) => setP2Rh(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">% (φ₁)</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Apparatus Dew Point:</span>
                  <input
                    type="number"
                    value={p2Adp}
                    onChange={(e) => setP2Adp(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">°C (ADP)</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Bypass Factor:</span>
                  <input
                    type="number"
                    step="0.01"
                    value={p2Bpf}
                    onChange={(e) => setP2Bpf(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">BPF (0 to 1)</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Air Flow:</span>
                  <input
                    type="number"
                    value={p2FlowCfm}
                    onChange={(e) => setP2FlowCfm(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">CFM</span>
                </div>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-sky-400 font-bold block">Step 1: Exit Dry Bulb Temperature via Bypass Factor</span>
                  <p className="text-slate-300">
                    T_db2 = ADP + BPF · (T_db1 - ADP) = {p2Adp} + {p2Bpf} × ({p2TDb} - {p2Adp}) =
                    <span className="text-emerald-400 font-bold ml-2">{coil.exitState.T_db_C.toFixed(2)} °C</span>.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-amber-400 font-bold block">Step 2: Moisture Removal & Exit Enthalpy</span>
                  <p className="text-slate-300">
                    Inlet Humidity: ω₁ = {inlet.humidityRatio_g_kg.toFixed(2)} g/kg (h₁ = {inlet.enthalpy_kJ_kg.toFixed(1)} kJ/kg).
                  </p>
                  <p className="text-slate-300">
                    Exit Humidity: ω₂ = {coil.exitState.humidityRatio_g_kg.toFixed(2)} g/kg (h₂ = {coil.exitState.enthalpy_kJ_kg.toFixed(1)} kJ/kg).
                  </p>
                  <p className="text-slate-300">
                    Moisture Removed = ω₁ - ω₂ =
                    <span className="text-emerald-400 font-bold ml-2">{coil.deltaW_g_kg.toFixed(2)} g/kg dry air</span>.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-purple-400 font-bold block">Step 3: Total Cooling Capacity & Sensible Heat Factor (SHF)</span>
                  <p className="text-slate-300">
                    Mass flow of air ṁ = {massFlow_kg_s.toFixed(2)} kg/s.
                  </p>
                  <p className="text-slate-300">
                    Coil Total Load = ṁ(h₁ - h₂) =
                    <span className="text-emerald-400 font-bold ml-2">{totalLoad_kW.toFixed(2)} kW ({totalTR.toFixed(2)} TR)</span>.
                  </p>
                  <p className="text-slate-300">
                    Sensible Heat Factor:
                    <span className="text-sky-400 font-bold ml-2 text-sm">SHF = {coil.sensibleHeatFactor.toFixed(3)}</span>.
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {selectedProblem === 3 && (() => {
          const carnot = calculateReversedCarnot(p3TL, p3TH, p3TR * 3.51685);

          return (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                ME417 Numerical Problem 3: Reversed Carnot Cycle Theoretical Upper Bound
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Evaporator Temp (T_L):</span>
                  <input
                    type="number"
                    value={p3TL}
                    onChange={(e) => setP3TL(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">°C (Cold Space)</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Condenser Temp (T_H):</span>
                  <input
                    type="number"
                    value={p3TH}
                    onChange={(e) => setP3TH(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">°C (Ambient Sink)</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Refrigeration Load:</span>
                  <input
                    type="number"
                    value={p3TR}
                    onChange={(e) => setP3TR(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">TR</span>
                </div>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-sky-400 font-bold block mb-1">Step 1: Convert to Absolute Temperature (Kelvin)</span>
                  <p className="text-slate-300">
                    T_L = {p3TL} + 273.15 = {carnot.T_L.toFixed(2)} K · T_H = {p3TH} + 273.15 = {carnot.T_H.toFixed(2)} K.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-amber-400 font-bold block mb-1">Step 2: Carnot Refrigerator COP & Work Input</span>
                  <p className="text-slate-300">
                    COP_R = T_L / (T_H - T_L) = {carnot.T_L.toFixed(2)} / ({carnot.T_H.toFixed(2)} - {carnot.T_L.toFixed(2)}) =
                    <span className="text-emerald-400 font-bold ml-2 text-sm">{carnot.copRef.toFixed(2)}</span>.
                  </p>
                  <p className="text-slate-300 mt-1">
                    Minimum Compressor Power W_min = Q_L / COP_R = {carnot.coolingLoad_kW.toFixed(2)} / {carnot.copRef.toFixed(2)} =
                    <span className="text-amber-400 font-bold ml-2">{carnot.workInput_kW.toFixed(2)} kW ({(carnot.workInput_kW * 1.341).toFixed(2)} HP)</span>.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-rose-400 font-bold block mb-1">Step 3: Heat Pump Mode</span>
                  <p className="text-slate-300">
                    COP_HP = T_H / (T_H - T_L) = COP_R + 1 =
                    <span className="text-emerald-400 font-bold ml-2 text-sm">{carnot.copHP.toFixed(2)}</span>.
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {selectedProblem === 4 && (() => {
          const opt = calculateMultiStageOptimum(p4Pe, p4Pc);

          return (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                ME417 Numerical Problem 4: Optimum Intermediate Pressure in Two-Stage Compression
              </h3>

              <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Evaporator Pressure (P_e):</span>
                  <input
                    type="number"
                    step="0.1"
                    value={p4Pe}
                    onChange={(e) => setP4Pe(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">bar</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Condenser Pressure (P_c):</span>
                  <input
                    type="number"
                    step="0.5"
                    value={p4Pc}
                    onChange={(e) => setP4Pc(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">bar</span>
                </div>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-sky-400 font-bold block mb-1">Derivation: Equal Pressure Ratios for Minimum Work</span>
                  <p className="text-slate-300">
                    For minimum compression work with perfect intercooling: r₁ = r₂ ⇒ P_i / P_e = P_c / P_i ⇒ P_i² = P_e · P_c.
                  </p>
                  <p className="text-slate-300 mt-1">
                    Optimum Intermediate Pressure:
                    <span className="text-emerald-400 font-bold ml-2 text-sm">P_i = √({p4Pe} × {p4Pc}) = {opt.P_intermediate_bar.toFixed(3)} bar</span>.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-amber-400 font-bold block mb-1">Stage Pressure Ratios & Power Savings</span>
                  <p className="text-slate-300">
                    Single-Stage Ratio: r = {opt.singleStageRatio.toFixed(2)} (Excessive!).
                  </p>
                  <p className="text-slate-300">
                    Each Stage Ratio: r₁ = r₂ = {opt.stage1Ratio.toFixed(2)}.
                  </p>
                  <p className="text-slate-300 mt-1 font-bold text-emerald-400">
                    Theoretical Compression Work Reduction: {opt.workSavingsPercent.toFixed(1)}% savings.
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {selectedProblem === 5 && (() => {
          const deq = calculateEquivalentDuctDiameter(p5W, p5H);

          return (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                ME417 Numerical Problem 5: Rectangular to Circular Equivalent Duct (Huebscher Equation)
              </h3>

              <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Duct Width (a):</span>
                  <input
                    type="number"
                    value={p5W}
                    onChange={(e) => setP5W(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">mm</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Duct Height (b):</span>
                  <input
                    type="number"
                    value={p5H}
                    onChange={(e) => setP5H(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">mm</span>
                </div>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-sky-400 font-bold block mb-1">Formula & Substitution</span>
                  <p className="text-slate-300">
                    D_eq = 1.30 × [(a · b)^0.625] / [(a + b)^0.25]
                  </p>
                  <p className="text-slate-300 mt-1">
                    D_eq = 1.30 × [({p5W} × {p5H})^0.625] / [({p5W} + {p5H})^0.25] =
                    <span className="text-emerald-400 font-bold ml-2 text-sm">{deq.toFixed(1)} mm</span>.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-amber-400 font-bold block mb-1">Aspect Ratio Verification</span>
                  <p className="text-slate-300">
                    Aspect Ratio AR = a / b = {p5W} / {p5H} = {(p5W / p5H).toFixed(2)} : 1.
                    {p5W / p5H <= 4 ? (
                      <span className="text-emerald-400 ml-2 font-bold">✓ Acceptable (&lt; 4:1)</span>
                    ) : (
                      <span className="text-rose-400 ml-2 font-bold">⚠ Excessive aspect ratio (&gt; 4:1)</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
