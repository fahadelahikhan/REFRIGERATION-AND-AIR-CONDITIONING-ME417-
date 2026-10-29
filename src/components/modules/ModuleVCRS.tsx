import React, { useState, useMemo } from 'react';
import { analyzeVCRSCycle, VCRSInputs, REFRIGERANTS_DB } from '../../utils/thermodynamics';
import { Gauge, Sliders, CheckCircle2, ChevronRight, Layers, Info } from 'lucide-react';

export const ModuleVCRS: React.FC = () => {
  const [refrigerant, setRefrigerant] = useState<string>('R-134a');
  const [tEvap, setTEvap] = useState<number>(-5); // °C
  const [tCond, setTCond] = useState<number>(45); // °C
  const [superheat, setSuperheat] = useState<number>(5); // K
  const [subcooling, setSubcooling] = useState<number>(5); // K
  const [isentropicEff, setIsentropicEff] = useState<number>(0.80);
  const [clearanceRatio, setClearanceRatio] = useState<number>(0.04);
  const [capacityTR, setCapacityTR] = useState<number>(2.0); // TR
  const [activeTab, setActiveTab] = useState<'cycle' | 'components' | 'volumetric'>('cycle');
  const [selectedComponent, setSelectedComponent] = useState<'compressor' | 'condenser' | 'expansion' | 'evaporator'>('compressor');

  const cycleResults = useMemo(() => {
    const inputs: VCRSInputs = {
      refrigerant,
      T_evap_C: tEvap,
      T_cond_C: tCond,
      superheat_K: superheat,
      subcooling_K: subcooling,
      compressorIsentropicEfficiency: isentropicEff,
      clearanceRatio,
      coolingCapacity_TR: capacityTR
    };
    return analyzeVCRSCycle(inputs);
  }, [refrigerant, tEvap, tCond, superheat, subcooling, isentropicEff, clearanceRatio, capacityTR]);

  return (
    <div className="space-y-6">
      {/* Syllabus Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-sky-400">ME417 · SYLLABUS TOPIC 2</span>
            <h2 className="text-xl font-bold text-white mt-0.5">Vapor Compression Refrigeration Systems (VCRS)</h2>
            <p className="text-sm text-slate-400 mt-1">
              Interactive thermodynamic analysis on P-h & T-s coordinates, actual non-ideal effects (superheating, subcooling, isentropic losses),
              reciprocating volumetric efficiency, and component selection.
            </p>
          </div>
          <div className="flex items-center gap-2 p-1 bg-slate-800 rounded-lg self-start">
            <button
              onClick={() => setActiveTab('cycle')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'cycle' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              P-h & T-s Simulator
            </button>
            <button
              onClick={() => setActiveTab('volumetric')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'volumetric' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Volumetric Efficiency
            </button>
            <button
              onClick={() => setActiveTab('components')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'components' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Study of Components
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'cycle' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Refrigerant</label>
                <select
                  value={refrigerant}
                  onChange={(e) => setRefrigerant(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                >
                  {Object.keys(REFRIGERANTS_DB).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1">
                  <span>T_evap</span>
                  <span className="text-sky-400 font-mono">{tEvap}°C</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="10"
                  step="1"
                  value={tEvap}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val < tCond - 10) setTEvap(val);
                  }}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1">
                  <span>T_cond</span>
                  <span className="text-rose-400 font-mono">{tCond}°C</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="60"
                  step="1"
                  value={tCond}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val > tEvap + 10) setTCond(val);
                  }}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1">
                  <span>Superheat (ΔT_sh)</span>
                  <span className="text-amber-400 font-mono">{superheat} K</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={superheat}
                  onChange={(e) => setSuperheat(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1">
                  <span>Subcooling (ΔT_sc)</span>
                  <span className="text-emerald-400 font-mono">{subcooling} K</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={subcooling}
                  onChange={(e) => setSubcooling(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1">
                  <span>Isentropic Eff (η_isen)</span>
                  <span className="text-sky-400 font-mono">{(isentropicEff * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.55"
                  max="0.95"
                  step="0.05"
                  value={isentropicEff}
                  onChange={(e) => setIsentropicEff(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1">
                  <span>Duty Capacity</span>
                  <span className="text-purple-400 font-mono">{capacityTR} TR</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={capacityTR}
                  onChange={(e) => setCapacityTR(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Interactive P-h & T-s Diagrams */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pressure-Enthalpy (P-h) Diagram */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  1. Pressure - Enthalpy (P-h) Diagram
                </span>
                <span className="text-[11px] text-sky-400 font-mono">
                  P_e: {cycleResults.P_evap_bar.toFixed(2)} bar · P_c: {cycleResults.P_cond_bar.toFixed(2)} bar
                </span>
              </div>

              <div className="w-full bg-slate-950 p-3 rounded-lg border border-slate-800 flex-1 flex items-center justify-center">
                <svg viewBox="0 0 460 280" className="w-full h-auto">
                  {/* Saturation Vapor Dome (Bell shape) */}
                  {/* Critical Point at approx (240, 50) */}
                  <path
                    d="M 60,250 C 90,200 160,110 240,50 C 310,110 370,180 410,250"
                    fill="rgba(14, 165, 233, 0.05)"
                    stroke="#0284c7"
                    strokeWidth="2"
                  />
                  {/* Dome Annotations */}
                  <text x="110" y="160" fill="#64748b" fontSize="10" fontFamily="monospace">Subcooled Liquid</text>
                  <text x="210" y="180" fill="#64748b" fontSize="10" fontFamily="monospace">Wet Vapor (Liquid + Gas)</text>
                  <text x="340" y="160" fill="#64748b" fontSize="10" fontFamily="monospace">Superheated Vapor</text>
                  <text x="240" y="40" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Critical Point</text>

                  {/* Saturated Liquid line label */}
                  <text x="80" y="220" fill="#0284c7" fontSize="9" transform="rotate(-45 80 220)">x = 0 (Sat Liquid)</text>
                  {/* Saturated Vapor line label */}
                  <text x="370" y="210" fill="#0284c7" fontSize="9" transform="rotate(45 370 210)">x = 1 (Sat Vapor)</text>

                  {/* Dynamic Cycle Coordinates */}
                  {(() => {
                    // Map pressures (bar) to y-axis: high pressure P_c ~ y=95, low pressure P_e ~ y=210
                    const yHigh = 95;
                    const yLow = 210;

                    // Enthalpy scale:
                    // 150 -> x=80, 450 -> x=420
                    const mapH = (h: number) => {
                      const minH = 150;
                      const maxH = 470;
                      return 60 + ((h - minH) / (maxH - minH)) * 360;
                    };

                    const x1 = mapH(cycleResults.h1);
                    const x2 = mapH(cycleResults.h2);
                    const x2s = mapH(cycleResults.h2s);
                    const x3 = mapH(cycleResults.h3);
                    const x4 = mapH(cycleResults.h4); // h4 = h3

                    return (
                      <>
                        {/* Isobars */}
                        <line x1="45" y1={yHigh} x2="430" y2={yHigh} stroke="#f43f5e" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
                        <line x1="45" y1={yLow} x2="430" y2={yLow} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
                        <text x="40" y={yHigh + 4} fill="#f43f5e" fontSize="9" textAnchor="end" fontFamily="monospace">P_c</text>
                        <text x="40" y={yLow + 4} fill="#38bdf8" fontSize="9" textAnchor="end" fontFamily="monospace">P_e</text>

                        {/* Isentropic path 1 -> 2s (dotted) */}
                        <line x1={x1} y1={yLow} x2={x2s} y2={yHigh} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
                        <text x={x2s - 2} y={yHigh - 6} fill="#f59e0b" fontSize="9" fontFamily="monospace">2s</text>

                        {/* VCRS Loop: 1 -> 2 -> 3 -> 4 -> 1 */}
                        {/* 1 -> 2 (Actual compression) */}
                        <line x1={x1} y1={yLow} x2={x2} y2={yHigh} stroke="#f97316" strokeWidth="2.5" />
                        {/* 2 -> 3 (Condensation & Subcooling at P_c) */}
                        <line x1={x2} y1={yHigh} x2={x3} y2={yHigh} stroke="#ef4444" strokeWidth="2.5" />
                        {/* 3 -> 4 (Isenthalpic Throttling at h=const) */}
                        <line x1={x3} y1={yHigh} x2={x4} y2={yLow} stroke="#10b981" strokeWidth="2.5" />
                        {/* 4 -> 1 (Evaporation & Superheating at P_e) */}
                        <line x1={x4} y1={yLow} x2={x1} y2={yLow} stroke="#0ea5e9" strokeWidth="2.5" />

                        {/* State Points */}
                        {/* Point 1 */}
                        <circle cx={x1} cy={yLow} r="4.5" fill="#38bdf8" />
                        <text x={x1 + 6} y={yLow + 14} fill="#e2e8f0" fontSize="11" fontWeight="bold">1 (Suction)</text>

                        {/* Point 2 */}
                        <circle cx={x2} cy={yHigh} r="4.5" fill="#f97316" />
                        <text x={x2 + 6} y={yHigh - 6} fill="#e2e8f0" fontSize="11" fontWeight="bold">2 (Discharge)</text>

                        {/* Point 3 */}
                        <circle cx={x3} cy={yHigh} r="4.5" fill="#ef4444" />
                        <text x={x3 - 8} y={yHigh - 6} fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="end">3 (Subcooled)</text>

                        {/* Point 4 */}
                        <circle cx={x4} cy={yLow} r="4.5" fill="#10b981" />
                        <text x={x4 - 6} y={yLow + 14} fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="end">4 (Inlet)</text>

                        {/* Process Labels */}
                        <text x={(x4 + x1) / 2} y={yLow - 8} fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Refrigerating Effect (RE = h₁ - h₄)
                        </text>
                        <text x={(x3 + x2) / 2} y={yHigh - 12} fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Heat Rejected (q_c = h₂ - h₃)
                        </text>
                      </>
                    );
                  })()}

                  {/* Axes */}
                  <line x1="45" y1="245" x2="435" y2="245" stroke="#475569" strokeWidth="1.5" />
                  <line x1="45" y1="245" x2="45" y2="25" stroke="#475569" strokeWidth="1.5" />
                  <text x="435" y="265" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">Enthalpy h (kJ/kg)</text>
                  <text x="25" y="30" fill="#94a3b8" fontSize="10" textAnchor="start" fontFamily="monospace">Log P (bar)</text>
                </svg>
              </div>
            </div>

            {/* Temperature-Entropy (T-s) Diagram */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  2. Temperature - Entropy (T-s) Diagram
                </span>
                <span className="text-[11px] text-amber-400 font-mono">
                  Discharge Temp T₂: {cycleResults.T2_C.toFixed(1)}°C
                </span>
              </div>

              <div className="w-full bg-slate-950 p-3 rounded-lg border border-slate-800 flex-1 flex items-center justify-center">
                <svg viewBox="0 0 460 280" className="w-full h-auto">
                  {/* Saturation Dome on T-s */}
                  <path
                    d="M 70,250 C 130,220 200,100 240,60 C 270,100 320,180 370,250"
                    fill="rgba(245, 158, 11, 0.05)"
                    stroke="#f59e0b"
                    strokeWidth="2"
                  />

                  {/* Axis */}
                  <line x1="45" y1="245" x2="435" y2="245" stroke="#475569" strokeWidth="1.5" />
                  <line x1="45" y1="245" x2="45" y2="25" stroke="#475569" strokeWidth="1.5" />
                  <text x="435" y="265" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="monospace">Entropy s (kJ/kg·K)</text>
                  <text x="25" y="30" fill="#94a3b8" fontSize="10" textAnchor="start" fontFamily="monospace">Temperature T (°C)</text>

                  {/* State coordinates on T-s */}
                  {(() => {
                    const yCond = 110;
                    const yEvap = 205;
                    const yDischarge = 70;

                    const x3 = 140; // Subcooled liquid
                    const x4 = 175; // Throttled inlet (s4 > s3 due to throttling irreversibility)
                    const x1 = 340; // Superheated suction vapor
                    const x2s = 340; // Isentropic vertical line from 1
                    const x2 = 365; // Actual discharge with entropy increase

                    return (
                      <>
                        {/* Isobars / Isotherms */}
                        <line x1="45" y1={yCond} x2="430" y2={yCond} stroke="#f43f5e" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                        <line x1="45" y1={yEvap} x2="430" y2={yEvap} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                        <text x="40" y={yCond + 4} fill="#f43f5e" fontSize="9" textAnchor="end" fontFamily="monospace">{tCond}°C</text>
                        <text x="40" y={yEvap + 4} fill="#38bdf8" fontSize="9" textAnchor="end" fontFamily="monospace">{tEvap}°C</text>

                        {/* Isentropic line 1 -> 2s */}
                        <line x1={x1} y1={yEvap} x2={x2s} y2={yCond - 20} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
                        <text x={x2s - 14} y={yCond - 22} fill="#94a3b8" fontSize="9" fontFamily="monospace">2s</text>

                        {/* Actual Compression 1 -> 2 */}
                        <line x1={x1} y1={yEvap} x2={x2} y2={yDischarge} stroke="#f97316" strokeWidth="2.5" />

                        {/* Condensation 2 -> Desuperheat -> 3 */}
                        <path
                          d={`M ${x2},${yDischarge} Q ${x2 - 30},${yCond} 250,${yCond} L ${x3},${yCond}`}
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2.5"
                        />

                        {/* Throttling 3 -> 4 (Irreversible, s increases: Δs > 0) */}
                        <path
                          d={`M ${x3},${yCond} Q ${x3 + 10},${(yCond + yEvap) / 2} ${x4},${yEvap}`}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeDasharray="4,3"
                        />

                        {/* Evaporation 4 -> 1 */}
                        <line x1={x4} y1={yEvap} x2={x1} y2={yEvap} stroke="#0ea5e9" strokeWidth="2.5" />

                        {/* State points */}
                        <circle cx={x1} cy={yEvap} r="4" fill="#38bdf8" />
                        <text x={x1 + 6} y={yEvap + 14} fill="#e2e8f0" fontSize="11" fontWeight="bold">1</text>

                        <circle cx={x2} cy={yDischarge} r="4" fill="#f97316" />
                        <text x={x2 + 6} y={yDischarge - 4} fill="#e2e8f0" fontSize="11" fontWeight="bold">2</text>

                        <circle cx={x3} cy={yCond} r="4" fill="#ef4444" />
                        <text x={x3 - 8} y={yCond - 4} fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="end">3</text>

                        <circle cx={x4} cy={yEvap} r="4" fill="#10b981" />
                        <text x={x4 - 6} y={yEvap + 14} fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="end">4</text>
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>
          </div>

          {/* Detailed Cycle Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono block">ACTUAL COP</span>
              <span className="text-2xl font-black text-sky-400 font-mono mt-1 block">
                {cycleResults.actualCOP.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                Carnot COP: {cycleResults.carnotCOP.toFixed(2)} (η_II: {(cycleResults.secondLawEfficiency * 100).toFixed(1)}%)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono block">REFRIGERATING EFFECT</span>
              <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                {cycleResults.refrigeratingEffect_kJ_kg.toFixed(1)} <span className="text-xs font-normal">kJ/kg</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                h₁ - h₄ (Vapor quality x₄: {(cycleResults.vaporQuality4 * 100).toFixed(1)}%)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono block">COMPRESSOR POWER</span>
              <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">
                {cycleResults.compressorPower_kW.toFixed(2)} <span className="text-xs font-normal">kW</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                Specific work: {cycleResults.workCompression_kJ_kg.toFixed(1)} kJ/kg
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono block">MASS FLOW RATE</span>
              <span className="text-2xl font-black text-purple-400 font-mono mt-1 block">
                {(cycleResults.massFlowRate_kg_s * 60).toFixed(2)} <span className="text-xs font-normal">kg/min</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                For {capacityTR} TR load ({(capacityTR * 3.517).toFixed(2)} kW)
              </span>
            </div>
          </div>

          {/* State Points Thermodynamic Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Thermodynamic State Points Table ({refrigerant})
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Pressure Ratio: {cycleResults.pressureRatio.toFixed(2)}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 text-left border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-2.5">State Point</th>
                    <th className="px-4 py-2.5">Location</th>
                    <th className="px-4 py-2.5">Pressure (bar)</th>
                    <th className="px-4 py-2.5">Temp (°C)</th>
                    <th className="px-4 py-2.5">Enthalpy (kJ/kg)</th>
                    <th className="px-4 py-2.5">Fluid Phase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-sky-400">1</td>
                    <td className="px-4 py-2.5">Compressor Suction</td>
                    <td className="px-4 py-2.5">{cycleResults.P_evap_bar.toFixed(2)}</td>
                    <td className="px-4 py-2.5">{cycleResults.T1_C.toFixed(1)}</td>
                    <td className="px-4 py-2.5 font-semibold text-white">{cycleResults.h1.toFixed(1)}</td>
                    <td className="px-4 py-2.5 text-amber-300">Superheated Vapor ({superheat}K SH)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-amber-400">2s</td>
                    <td className="px-4 py-2.5">Isentropic Discharge</td>
                    <td className="px-4 py-2.5">{cycleResults.P_cond_bar.toFixed(2)}</td>
                    <td className="px-4 py-2.5">-</td>
                    <td className="px-4 py-2.5">{cycleResults.h2s.toFixed(1)}</td>
                    <td className="px-4 py-2.5 text-slate-400">Ideal Reversible Discharge</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-rose-400">2</td>
                    <td className="px-4 py-2.5">Actual Compressor Discharge</td>
                    <td className="px-4 py-2.5">{cycleResults.P_cond_bar.toFixed(2)}</td>
                    <td className="px-4 py-2.5">{cycleResults.T2_C.toFixed(1)}</td>
                    <td className="px-4 py-2.5 font-semibold text-white">{cycleResults.h2.toFixed(1)}</td>
                    <td className="px-4 py-2.5 text-rose-400">Superheated Vapor</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-emerald-400">3</td>
                    <td className="px-4 py-2.5">Condenser Outlet</td>
                    <td className="px-4 py-2.5">{cycleResults.P_cond_bar.toFixed(2)}</td>
                    <td className="px-4 py-2.5">{cycleResults.T3_C.toFixed(1)}</td>
                    <td className="px-4 py-2.5 font-semibold text-white">{cycleResults.h3.toFixed(1)}</td>
                    <td className="px-4 py-2.5 text-emerald-300">Subcooled Liquid ({subcooling}K SC)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-sky-400">4</td>
                    <td className="px-4 py-2.5">Expansion Valve Outlet / Evap Inlet</td>
                    <td className="px-4 py-2.5">{cycleResults.P_evap_bar.toFixed(2)}</td>
                    <td className="px-4 py-2.5">{tEvap.toFixed(1)}</td>
                    <td className="px-4 py-2.5 font-semibold text-white">{cycleResults.h4.toFixed(1)}</td>
                    <td className="px-4 py-2.5 text-sky-300">Liquid-Vapor Mixture (x = {(cycleResults.vaporQuality4).toFixed(3)})</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'volumetric' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Gauge className="w-5 h-5 text-sky-400" />
                Volumetric Efficiency of Reciprocating Compressors
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Influence of cylinder clearance volume, re-expansion of clearance vapor, and pressure ratio on compressor delivery volume.
              </p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-amber-300">
              η_v = 1 + C - C · (P_c / P_e)^(1/n)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                <span>Clearance Ratio (C = V_c / V_d):</span>
                <span className="text-sky-400 font-mono">{(clearanceRatio * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.08"
                step="0.005"
                value={clearanceRatio}
                onChange={(e) => setClearanceRatio(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-mono">Typically 3% - 6% in industrial compressors</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                <span>Pressure Ratio (r_p = P_c / P_e):</span>
                <span className="text-rose-400 font-mono">{cycleResults.pressureRatio.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-400">
                Governed by condensing pressure ({cycleResults.P_cond_bar.toFixed(2)} bar) and evaporating pressure ({cycleResults.P_evap_bar.toFixed(2)} bar).
              </p>
            </div>

            <div className="p-3 bg-sky-950/40 border border-sky-800/60 rounded-lg text-center">
              <span className="text-[10px] text-sky-300 font-mono block">COMPUTED VOLUMETRIC EFFICIENCY</span>
              <span className="text-3xl font-black text-white font-mono mt-1 block">
                {(cycleResults.volumetricEfficiency * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed">
            <h4 className="font-bold text-white text-sm">Key Engineering Factors Governing Volumetric Efficiency:</h4>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400">
              <li><strong className="text-slate-200">Clearance Volume Re-expansion:</strong> The high-pressure gas trapped in clearance volume $V_c$ must re-expand below suction pressure before the suction valve can open, reducing fresh suction intake stroke.</li>
              <li><strong className="text-slate-200">Pressure Ratio Impact:</strong> Higher pressure ratios cause deeper re-expansion, drastically degrading volumetric efficiency. When (P_c/P_e)^(1/n) &ge; (1+C)/C, volumetric efficiency drops to zero!</li>
              <li><strong className="text-slate-200">Valve Throttling & Wire Drawing:</strong> Pressure drops across suction and discharge reed valves lower the effective cylinder pressure and density.</li>
              <li><strong className="text-slate-200">Cylinder Wall Heating:</strong> Hot cylinder walls heat the incoming suction vapor, reducing its density ($v \uparrow$) and volumetric mass flow.</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'components' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Study of Primary System Components</h3>
              <p className="text-xs text-slate-400">Compressor, Condenser, Expansion Devices, and Evaporators used in modern refrigeration.</p>
            </div>
          </div>

          <div className="flex gap-2 border-b border-slate-800 pb-3">
            {(['compressor', 'condenser', 'expansion', 'evaporator'] as const).map((comp) => (
              <button
                key={comp}
                onClick={() => setSelectedComponent(comp)}
                className={`px-4 py-2 text-xs font-bold rounded-lg uppercase transition-all cursor-pointer ${
                  selectedComponent === comp
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {comp}
              </button>
            ))}
          </div>

          {/* Component Deep Dives */}
          {selectedComponent === 'compressor' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-sky-400 text-sm block">1. Reciprocating Compressor</span>
                <p className="text-slate-300">
                  Piston-cylinder with crankshaft. Positive displacement. Ideal for low-to-medium capacities and high pressure ratios. Available in hermetic (sealed domestic units), semi-hermetic, and open-drive designs.
                </p>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <strong>Pros:</strong> High pressure capability, cost-effective · <strong>Cons:</strong> Valve losses, vibration, clearance volume re-expansion.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400 text-sm block">2. Scroll Compressor</span>
                <p className="text-slate-300">
                  Two interleaving spiral scrolls (one fixed, one orbiting). Continuous crescent-shaped pocket compression with zero clearance volume, smooth torque, and high isentropic efficiency. Dominates residential & light commercial AC.
                </p>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <strong>Pros:</strong> 100% volumetric efficiency, quiet · <strong>Cons:</strong> Precise manufacturing tolerances, limited to ~30 TR per unit.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 text-sm block">3. Screw Compressor (Rotary)</span>
                <p className="text-slate-300">
                  Male and female helical rotors meshing together. Positive displacement with slide-valve capacity control (10%-100%). Heavily utilized in large commercial water chillers and ammonia industrial cold storages.
                </p>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <strong>Capacity Range:</strong> 50 to 500 TR · Oil injection required for sealing and cooling.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-purple-400 text-sm block">4. Centrifugal Compressor</span>
                <p className="text-slate-300">
                  Dynamic compressor. High-speed impeller converts kinetic velocity energy into pressure in the diffuser ring. Operates on high volumetric flow and low pressure ratio refrigerants (e.g., R-1233zd, R-134a).
                </p>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <strong>Capacity:</strong> 300 to 3000+ TR · Prone to surging at low flow / high pressure lift.
                </div>
              </div>
            </div>
          )}

          {selectedComponent === 'condenser' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-sky-400 text-sm block">Air-Cooled Condensers</span>
                <p className="text-slate-300">
                  Copper tubes with aluminum fins. Natural convection (domestic refrigerators) or forced draft fan. Condensing temp is typically 10-15°C above dry bulb temp (T_cond ≈ 45-55°C).
                </p>
                <span className="text-[11px] text-slate-400 block">Low maintenance, no water treatment needed.</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400 text-sm block">Water-Cooled (Shell & Tube)</span>
                <p className="text-slate-300">
                  Cooling water from cooling tower circulates inside tubes while refrigerant condenses on shell exterior. High heat transfer coefficient. Condensing temp is T_cond ≈ 35-40°C (based on ambient wet bulb).
                </p>
                <span className="text-[11px] text-slate-400 block">Requires cooling tower, pump & descaling water treatment.</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 text-sm block">Evaporative Condensers</span>
                <p className="text-slate-300">
                  Combines cooling tower and condenser in a single unit. Water sprays over refrigerant condensing coils while air is drawn upward. Lowest condensing temperature among all designs.
                </p>
                <span className="text-[11px] text-slate-400 block">Extensively used in ammonia cold storage plants.</span>
              </div>
            </div>
          )}

          {selectedComponent === 'expansion' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-sky-400 text-sm block">Capillary Tube</span>
                <p className="text-slate-300">
                  Fixed length of narrow copper tubing (ID ~0.5 to 2 mm, length 1-4 m). Frictional resistance and flashing vapor drop pressure. Non-modulating; requires equalized starting pressure.
                </p>
                <span className="text-[11px] text-slate-400 font-mono">Used in: Domestic refrigerators, room air conditioners.</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400 text-sm block">Thermostatic Expansion Valve (TXV)</span>
                <p className="text-slate-300">
                  Maintains constant degree of superheat at evaporator exit. Feeler bulb on suction line exerts pressure $P_b$ on diaphragm against evaporator pressure $P_e$ and spring force $P_s$ ($P_b = P_e + P_s$).
                </p>
                <span className="text-[11px] text-slate-400 font-mono">Prevents liquid slugging back to compressor.</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 text-sm block">Electronic Expansion Valve (EEV)</span>
                <p className="text-slate-300">
                  Stepper motor driven needle valve controlled by microprocessor PID loop based on temperature and pressure sensors. Ultra-fast precision modulation from 10% to 100% capacity.
                </p>
                <span className="text-[11px] text-slate-400 font-mono">Standard in inverter split AC and multi-split VRF systems.</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-purple-400 text-sm block">Automatic Expansion Valve (AXV)</span>
                <p className="text-slate-300">
                  Maintains constant evaporating pressure in evaporator regardless of load. When load decreases, superheat drops. Useful for constant-load water chillers and freeze dryers.
                </p>
              </div>
            </div>
          )}

          {selectedComponent === 'evaporator' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-sky-400 text-sm block">Direct Expansion (DX) Coil</span>
                <p className="text-slate-300">
                  Refrigerant evaporates inside finned copper tubes while air blows across exterior fins. Complete evaporation and superheating happen inside tube passes before exiting to suction line.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400 text-sm block">Flooded Evaporator</span>
                <p className="text-slate-300">
                  Evaporator tubes are completely flooded with boiling liquid refrigerant fed by surge drum and float valve. Superior heat transfer coefficient because inner tube surface is 100% wetted.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 text-sm block">Shell & Tube Liquid Chiller</span>
                <p className="text-slate-300">
                  Chills water or secondary brine to 6-7°C for central air conditioning air handlers (AHUs). Either direct expansion on tube side or flooded on shell side.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
