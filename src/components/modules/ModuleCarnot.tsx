import React, { useState, useMemo } from 'react';
import { calculateReversedCarnot } from '../../utils/thermodynamics';
import { Thermometer, Zap, Flame, Snowflake, Info, Sliders, ArrowRight } from 'lucide-react';

export const ModuleCarnot: React.FC = () => {
  const [tEvap, setTEvap] = useState<number>(-10); // °C
  const [tCond, setTCond] = useState<number>(40); // °C
  const [capacityTR, setCapacityTR] = useState<number>(1.5); // TR
  const [selectedSFEEComponent, setSelectedSFEEComponent] = useState<'compressor' | 'condenser' | 'expansion' | 'evaporator'>('compressor');

  const coolingLoadKW = capacityTR * 3.51685;

  const results = useMemo(() => {
    try {
      return calculateReversedCarnot(tEvap, tCond, coolingLoadKW);
    } catch {
      return null;
    }
  }, [tEvap, tCond, coolingLoadKW]);

  return (
    <div className="space-y-6">
      {/* Overview & Syllabus Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-sky-400">ME417 · SYLLABUS TOPIC 1</span>
            <h2 className="text-xl font-bold text-white mt-0.5">Introduction, SFEE & Reversed Carnot Cycle</h2>
            <p className="text-sm text-slate-400 mt-1">
              Thermodynamic foundations of refrigeration: Steady-Flow Energy Equation across cycle organs,
              ideal Carnot limitations, and the fundamental Coefficient of Performance (COP).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2 text-center">
              <span className="text-[10px] text-slate-400 block font-mono">1 TON OF REFRIG (TR)</span>
              <span className="text-sm font-bold text-sky-400 font-mono">3.517 kW (210 kJ/min)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Methods of Producing Refrigeration & SFEE Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Methods of Producing Refrigeration */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Snowflake className="w-4 h-4 text-sky-400" />
            Methods of Producing Artificial Refrigeration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="font-semibold text-sky-300 block mb-1">1. Phase Change of Liquid</span>
              <p className="text-slate-400 leading-relaxed">
                Boiling/evaporating a volatile fluid at low saturation pressure. The latent heat of vaporization absorbs large thermal energy from the refrigerated space.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="font-semibold text-emerald-300 block mb-1">2. Adiabatic Expansion of Gas</span>
              <p className="text-slate-400 leading-relaxed">
                High-pressure gas expanding through an expansion turbine producing work (T₂ &lt; T₁), or throttling via Joule-Thomson expansion below inversion temperature.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="font-semibold text-amber-300 block mb-1">3. Thermoelectric (Peltier)</span>
              <p className="text-slate-400 leading-relaxed">
                Passing direct electric current through dissimilar semiconductor junctions (Bi2Te3) absorbs heat at one junction and rejects it at the other (Q = Π · I).
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="font-semibold text-purple-300 block mb-1">4. Sublimation of Solids</span>
              <p className="text-slate-400 leading-relaxed">
                Direct transition from solid to vapor without melting, e.g., solid carbon dioxide (Dry Ice) at atmospheric pressure (-78.5°C, latent heat 571 kJ/kg).
              </p>
            </div>
          </div>
        </div>

        {/* Steady-Flow Energy Equation (SFEE) Across Components */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Steady-Flow Energy Equation (SFEE)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">1st Law for Open Systems</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-center text-slate-200">
            {"q - w = (h₂ - h₁) + (V₂² - V₁²)/2000 + g(z₂ - z₁)/1000"}
          </div>

          <div className="flex gap-2">
            {(['compressor', 'condenser', 'expansion', 'evaporator'] as const).map((comp) => (
              <button
                key={comp}
                onClick={() => setSelectedSFEEComponent(comp)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md uppercase transition-colors cursor-pointer ${
                  selectedSFEEComponent === comp
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {comp}
              </button>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-slate-800/70 border border-slate-700/50 text-xs text-slate-300 space-y-1.5">
            {selectedSFEEComponent === 'compressor' && (
              <>
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Compressor (Work Absorbing Organ)</span>
                  <span className="text-sky-400 font-mono">q ≈ 0 (Adiabatic), Δke ≈ 0, Δpe ≈ 0</span>
                </div>
                <p className="text-slate-400">
                  Work required per unit mass: <span className="font-mono text-amber-300 font-semibold">w_in = h₂ - h₁ (kJ/kg)</span>.
                  Discharge enthalpy is higher due to irreversible compression work.
                </p>
              </>
            )}
            {selectedSFEEComponent === 'condenser' && (
              <>
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Condenser (Heat Rejection Organ)</span>
                  <span className="text-rose-400 font-mono">w = 0, Δke ≈ 0, Δpe ≈ 0</span>
                </div>
                <p className="text-slate-400">
                  Heat rejected to ambient: <span className="font-mono text-rose-300 font-semibold">q_out = h₂ - h₃ (kJ/kg)</span>.
                  Superheated vapor desuperheats, condenses to liquid, and subcools.
                </p>
              </>
            )}
            {selectedSFEEComponent === 'expansion' && (
              <>
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Expansion Valve (Throttling Device)</span>
                  <span className="text-emerald-400 font-mono">q = 0, w = 0, Δpe ≈ 0</span>
                </div>
                <p className="text-slate-400">
                  Isenthalpic process: <span className="font-mono text-emerald-300 font-semibold">h₄ = h₃ (kJ/kg)</span>.
                  Irreversible throttling reduces pressure and flashes part of the liquid into flash vapor.
                </p>
              </>
            )}
            {selectedSFEEComponent === 'evaporator' && (
              <>
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Evaporator (Refrigerating Effect)</span>
                  <span className="text-sky-400 font-mono">w = 0, Δke ≈ 0, Δpe ≈ 0</span>
                </div>
                <p className="text-slate-400">
                  Refrigerating effect produced: <span className="font-mono text-sky-300 font-semibold">q_in = h₁ - h₄ (kJ/kg)</span>.
                  Refrigerant absorbs heat at low constant temperature and pressure.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Reversed Carnot Simulation */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-sky-400" />
              Reversed Carnot Cycle Interactive Thermodynamic Simulator
            </h3>
            <span className="text-xs text-slate-400">
              Benchmark ideal cycle operating between isothermal heat absorption at T_L and isothermal heat rejection at T_H.
            </span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Theoretical Maximum Upper Bound
          </div>
        </div>

        {/* Sliders & Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-300">Evaporator Temp (T_L):</span>
              <span className="text-sky-400 font-mono">{tEvap} °C ({(tEvap + 273.15).toFixed(1)} K)</span>
            </div>
            <input
              type="range"
              min="-35"
              max="15"
              step="1"
              value={tEvap}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val < tCond) setTEvap(val);
              }}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>-35°C (Deep Freezing)</span>
              <span>15°C (Comfort Chilled)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-300">Condenser Temp (T_H):</span>
              <span className="text-rose-400 font-mono">{tCond} °C ({(tCond + 273.15).toFixed(1)} K)</span>
            </div>
            <input
              type="range"
              min="20"
              max="65"
              step="1"
              value={tCond}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val > tEvap) setTCond(val);
              }}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>20°C (Water Cooled)</span>
              <span>65°C (Tropical Air Cooled)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-300">Cooling Capacity:</span>
              <span className="text-emerald-400 font-mono">{capacityTR.toFixed(1)} TR ({coolingLoadKW.toFixed(2)} kW)</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={capacityTR}
              onChange={(e) => setCapacityTR(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0.5 TR (Domestic)</span>
              <span>10 TR (Commercial)</span>
            </div>
          </div>
        </div>

        {/* Live Thermodynamic Diagram and Performance Cards */}
        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* SVG T-s Diagram */}
            <div className="lg:col-span-6 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                <span>IDEAL REVERSED CARNOT T-s DIAGRAM</span>
                <span className="text-sky-400">ΔT = {(results.T_H - results.T_L).toFixed(1)} K</span>
              </div>
              <svg viewBox="0 0 400 260" className="w-full max-w-md h-auto">
                {/* Axes */}
                <line x1="50" y1="220" x2="370" y2="220" stroke="#475569" strokeWidth="1.5" />
                <line x1="50" y1="220" x2="50" y2="20" stroke="#475569" strokeWidth="1.5" />
                <text x="370" y="240" fill="#94a3b8" fontSize="11" textAnchor="end" fontFamily="monospace">Entropy s (kJ/kg·K)</text>
                <text x="35" y="25" fill="#94a3b8" fontSize="11" textAnchor="start" fontFamily="monospace">Temp T (K)</text>

                {/* Grid guidelines */}
                {/* Map T_H (313K ~ y=60) and T_L (263K ~ y=170) */}
                {(() => {
                  const yH = Math.max(40, Math.min(180, 220 - ((results.T_H - 220) / 140) * 180));
                  const yL = Math.max(50, Math.min(210, 220 - ((results.T_L - 220) / 140) * 180));
                  const x1 = 120;
                  const x2 = 300;

                  return (
                    <>
                      {/* Carnot Rectangular Cycle */}
                      {/* Area under Q_L (Heat absorbed) */}
                      <rect x={x1} y={yL} width={x2 - x1} height={220 - yL} fill="rgba(2, 132, 199, 0.12)" />
                      {/* Area of Work (W_net) */}
                      <rect x={x1} y={yH} width={x2 - x1} height={yL - yH} fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />

                      {/* Main Carnot Cycle Loop */}
                      <polygon
                        points={`${x1},${yL} ${x1},${yH} ${x2},${yH} ${x2},${yL}`}
                        fill="rgba(14, 165, 233, 0.2)"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                      />

                      {/* State point markers */}
                      {/* State 1: Compressor suction */}
                      <circle cx={x2} cy={yL} r="4.5" fill="#38bdf8" />
                      <text x={x2 + 8} y={yL + 4} fill="#e2e8f0" fontSize="11" fontWeight="bold">1</text>

                      {/* State 2: Compressor discharge */}
                      <circle cx={x2} cy={yH} r="4.5" fill="#f43f5e" />
                      <text x={x2 + 8} y={yH - 2} fill="#e2e8f0" fontSize="11" fontWeight="bold">2</text>

                      {/* State 3: Condenser exit */}
                      <circle cx={x1} cy={yH} r="4.5" fill="#f43f5e" />
                      <text x={x1 - 15} y={yH - 2} fill="#e2e8f0" fontSize="11" fontWeight="bold">3</text>

                      {/* State 4: Expander exit */}
                      <circle cx={x1} cy={yL} r="4.5" fill="#38bdf8" />
                      <text x={x1 - 15} y={yL + 4} fill="#e2e8f0" fontSize="11" fontWeight="bold">4</text>

                      {/* Arrows indicating counter-clockwise direction (Reversed cycle) */}
                      {/* Process 1 -> 2 (Isentropic compression, s = const) */}
                      <path d={`M ${x2} ${yL - 10} L ${x2} ${yH + 20}`} stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow)" />
                      {/* Process 2 -> 3 (Isothermal condensation at T_H) */}
                      <line x1={x2 - 10} y1={yH} x2={x1 + 20} y2={yH} stroke="#f43f5e" strokeWidth="2" />
                      {/* Process 3 -> 4 (Isentropic expansion) */}
                      <line x1={x1} y1={yH + 10} x2={x1} y2={yL - 20} stroke="#38bdf8" strokeWidth="2" />
                      {/* Process 4 -> 1 (Isothermal evaporation at T_L) */}
                      <line x1={x1 + 10} y1={yL} x2={x2 - 20} y2={yL} stroke="#0ea5e9" strokeWidth="2" />

                      {/* Labels for T_H and T_L on axis */}
                      <line x1="45" y1={yH} x2="55" y2={yH} stroke="#f43f5e" strokeWidth="2" />
                      <text x="40" y={yH + 4} fill="#f43f5e" fontSize="10" textAnchor="end" fontFamily="monospace">T_H: {results.T_H.toFixed(0)}K</text>

                      <line x1="45" y1={yL} x2="55" y2={yL} stroke="#38bdf8" strokeWidth="2" />
                      <text x="40" y={yL + 4} fill="#38bdf8" fontSize="10" textAnchor="end" fontFamily="monospace">T_L: {results.T_L.toFixed(0)}K</text>

                      {/* Annotation of Work & Heat */}
                      <text x={(x1 + x2) / 2} y={(yH + yL) / 2 + 4} fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle">W_net (Work Input)</text>
                      <text x={(x1 + x2) / 2} y={yL - 10} fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">Q_L (Refrigerating Effect)</text>
                      <text x={(x1 + x2) / 2} y={yH - 8} fill="#f43f5e" fontSize="11" fontWeight="bold" textAnchor="middle">Q_H (Heat Rejected)</text>
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* Performance Indicators */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-800/60">
                  <span className="text-xs text-sky-300 font-mono block">CARNOT REFRIGERATOR COP</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-white font-mono">{results.copRef.toFixed(2)}</span>
                    <span className="text-xs text-slate-400 font-mono">T_L / (T_H - T_L)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Theoretical maximum coefficient of performance for a refrigeration machine between these temperatures.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60">
                  <span className="text-xs text-amber-300 font-mono block">CARNOT HEAT PUMP COP</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-white font-mono">{results.copHP.toFixed(2)}</span>
                    <span className="text-xs text-amber-400 font-mono">COP_R + 1</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Heat pump provides heating at $T_H$, absorbing waste heat at $T_L$. Always strictly 1 greater than $COP_R$.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Cooling Duty (Q_L):</span>
                  <span className="text-white font-semibold">{results.coolingLoad_kW.toFixed(2)} kW ({results.coolingLoad_TR.toFixed(1)} TR)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Minimum Work Required (W_in):</span>
                  <span className="text-amber-400 font-semibold">{results.workInput_kW.toFixed(2)} kW ({(results.workInput_kW * 1.341).toFixed(2)} HP)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Heat Rejected to Sink (Q_H):</span>
                  <span className="text-rose-400 font-semibold">{results.heatRejected_kW.toFixed(2)} kW</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Carnot Engine Efficiency (η_c):</span>
                  <span className="text-emerald-400 font-semibold">{(results.carnotEfficiency * 100).toFixed(1)} %</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-sky-950/30 border border-sky-900/50 flex items-start gap-2 text-xs text-sky-200">
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Thermodynamic Law:</strong> As the temperature lift ($T_H - T_L$) narrows, the COP surges dramatically.
                  Raising evaporator temperature by just 1°C or lowering condenser temperature by 1°C yields a 2-4% reduction in compressor power!
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
