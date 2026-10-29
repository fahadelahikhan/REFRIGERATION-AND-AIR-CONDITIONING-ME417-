import React, { useState, useMemo } from 'react';
import {
  calculatePsychrometricState,
  analyzeCoolingCoil,
  mixAirStreams,
  P_ATM
} from '../../utils/thermodynamics';
import { Wind, Sliders, Droplets, ArrowRight, Play, Info, RotateCcw } from 'lucide-react';

export const ModulePsychrometrics: React.FC = () => {
  // State 1 inputs
  const [tDb, setTDb] = useState<number>(30); // °C
  const [rh, setRh] = useState<number>(60); // %

  // Process mode
  const [selectedProcess, setSelectedProcess] = useState<
    'none' | 'sensible_heating' | 'sensible_cooling' | 'humidification' | 'dehumidification' | 'cooling_dehumid' | 'heating_humid' | 'evaporative' | 'mixing'
  >('cooling_dehumid');

  // Process parameter sliders
  const [processDeltaT, setProcessDeltaT] = useState<number>(-10);
  const [coilAdp, setCoilAdp] = useState<number>(10); // °C Apparatus Dew Point
  const [coilBpf, setCoilBpf] = useState<number>(0.15); // Bypass Factor
  const [mixTDb2, setMixTDb2] = useState<number>(24);
  const [mixRh2, setMixRh2] = useState<number>(50);
  const [mixRatio, setMixRatio] = useState<number>(0.3); // fraction of state 1

  // Primary psychrometric state
  const state1 = useMemo(() => {
    return calculatePsychrometricState(tDb, rh);
  }, [tDb, rh]);

  // Derived state 2 based on chosen process
  const processResult = useMemo(() => {
    if (selectedProcess === 'none') {
      return { state2: state1, name: 'State 1 Only' };
    }
    if (selectedProcess === 'sensible_heating') {
      const t2 = Math.min(50, tDb + 12);
      // constant humidity ratio: find RH at t2 with same W
      const targetW = state1.humidityRatio_kg_kg;
      const Pv = (targetW * P_ATM) / (0.622 + targetW);
      const Pvs2 = 0.61078 * Math.exp((17.27 * t2) / (t2 + 237.3));
      const rh2 = Math.min(100, Math.max(1, (Pv / Pvs2) * 100));
      return { state2: calculatePsychrometricState(t2, rh2), name: 'Sensible Heating (W = const)' };
    }
    if (selectedProcess === 'sensible_cooling') {
      const t2 = Math.max(state1.dewPoint_C + 1, tDb - 8);
      const targetW = state1.humidityRatio_kg_kg;
      const Pv = (targetW * P_ATM) / (0.622 + targetW);
      const Pvs2 = 0.61078 * Math.exp((17.27 * t2) / (t2 + 237.3));
      const rh2 = Math.min(100, Math.max(1, (Pv / Pvs2) * 100));
      return { state2: calculatePsychrometricState(t2, rh2), name: 'Sensible Cooling (Above DPT, W = const)' };
    }
    if (selectedProcess === 'humidification') {
      const rh2 = Math.min(95, rh + 25);
      return { state2: calculatePsychrometricState(tDb, rh2), name: 'Pure Humidification (T_db = const)' };
    }
    if (selectedProcess === 'dehumidification') {
      const rh2 = Math.max(15, rh - 30);
      return { state2: calculatePsychrometricState(tDb, rh2), name: 'Chemical Dehumidification (Silica Gel / Desiccant)' };
    }
    if (selectedProcess === 'cooling_dehumid') {
      const coilRes = analyzeCoolingCoil(state1, coilAdp, coilBpf);
      return {
        state2: coilRes.exitState,
        adpState: coilRes.adpState,
        name: `Cooling & Dehumidification (ADP: ${coilAdp}°C, BPF: ${coilBpf})`,
        shf: coilRes.sensibleHeatFactor
      };
    }
    if (selectedProcess === 'heating_humid') {
      const t2 = tDb + 8;
      const rh2 = Math.min(85, rh + 15);
      return { state2: calculatePsychrometricState(t2, rh2), name: 'Heating & Humidification (Winter AC)' };
    }
    if (selectedProcess === 'evaporative') {
      // Adiabatic saturation / wet bulb line: enthalpy approx constant
      const targetH = state1.enthalpy_kJ_kg;
      const t2 = Math.max(state1.wetBulb_C, tDb - 6);
      const rh2 = Math.min(95, rh + 30);
      return { state2: calculatePsychrometricState(t2, rh2), name: 'Adiabatic Evaporative Cooling (Along Wet Bulb)' };
    }
    if (selectedProcess === 'mixing') {
      const state2Input = calculatePsychrometricState(mixTDb2, mixRh2);
      const mixed = mixAirStreams(state1, mixRatio, state2Input, 1 - mixRatio);
      return {
        state2: state2Input,
        mixedState: mixed,
        name: `Adiabatic Mixing (${(mixRatio * 100).toFixed(0)}% State 1 + ${((1 - mixRatio) * 100).toFixed(0)}% State 2)`
      };
    }
    return { state2: state1, name: 'Standard' };
  }, [selectedProcess, state1, tDb, rh, coilAdp, coilBpf, mixTDb2, mixRh2, mixRatio]);

  // Coordinate mapping for SVG Psychrometric Chart:
  // X axis: T_db from 0°C (x=60) to 50°C (x=450)
  // Y axis: Humidity ratio W from 0 g/kg (y=260) to 30 g/kg (y=30)
  const mapCoords = (t: number, w_g_kg: number) => {
    const x = 60 + ((t - 0) / (50 - 0)) * 390;
    const y = 260 - ((w_g_kg - 0) / (30 - 0)) * 230;
    return { x: Math.max(50, Math.min(460, x)), y: Math.max(20, Math.min(270, y)) };
  };

  const pt1 = mapCoords(state1.T_db_C, state1.humidityRatio_g_kg);
  const pt2 = processResult.state2 ? mapCoords(processResult.state2.T_db_C, processResult.state2.humidityRatio_g_kg) : pt1;
  const ptAdp = processResult.adpState ? mapCoords(processResult.adpState.T_db_C, processResult.adpState.humidityRatio_g_kg) : null;
  const ptMix = processResult.mixedState ? mapCoords(processResult.mixedState.T_db_C, processResult.mixedState.humidityRatio_g_kg) : null;

  return (
    <div className="space-y-6">
      {/* Syllabus Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-sky-400">ME417 · SYLLABUS TOPIC 6</span>
            <h2 className="text-xl font-bold text-white mt-0.5">Psychrometrics & Air Conditioning Processes</h2>
            <p className="text-sm text-slate-400 mt-1">
              Properties of moist air mixtures, construction of ASHRAE psychrometric chart (101.325 kPa),
              interactive process simulations, Apparatus Dew Point (ADP), Bypass Factor (BPF), and Lewis Relation.
            </p>
          </div>
          <div className="p-2.5 bg-slate-800 rounded-lg text-xs font-mono text-sky-300">
            P_atm = 101.325 kPa (Standard Sea Level)
          </div>
        </div>
      </div>

      {/* Process Selection Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <span className="text-xs font-mono text-slate-400 block mb-2 font-medium">SELECT AIR CONDITIONING PROCESS:</span>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'cooling_dehumid', label: 'Cooling & Dehumidification (Summer AC)' },
            { id: 'sensible_cooling', label: 'Sensible Cooling' },
            { id: 'sensible_heating', label: 'Sensible Heating' },
            { id: 'evaporative', label: 'Evaporative Cooling (Desert Cooler)' },
            { id: 'heating_humid', label: 'Heating & Humidification (Winter AC)' },
            { id: 'humidification', label: 'Humidification' },
            { id: 'dehumidification', label: 'Dehumidification (Chemical)' },
            { id: 'mixing', label: 'Adiabatic Mixing of Two Streams' }
          ].map((proc) => (
            <button
              key={proc.id}
              onClick={() => setSelectedProcess(proc.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                selectedProcess === proc.id
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {proc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Workstation: Chart & Live Data */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: SVG Psychrometric Chart */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              ASHRAE Standard Psychrometric Chart Visualizer
            </span>
            <span className="text-[11px] text-sky-400 font-mono">{processResult.name}</span>
          </div>

          <div className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 flex-1 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 500 310" className="w-full h-auto">
              {/* Axes lines */}
              <line x1="60" y1="260" x2="450" y2="260" stroke="#475569" strokeWidth="1.5" />
              <line x1="450" y1="260" x2="450" y2="30" stroke="#475569" strokeWidth="1.5" />

              {/* T_db tick marks & labels */}
              {[0, 10, 20, 30, 40, 50].map((t) => {
                const x = 60 + (t / 50) * 390;
                return (
                  <g key={t}>
                    <line x1={x} y1="260" x2={x} y2="265" stroke="#64748b" strokeWidth="1" />
                    <text x={x} y="278" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                      {t}°C
                    </text>
                    {/* Vertical dry bulb gridlines */}
                    <line x1={x} y1="260" x2={x} y2="30" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.4" />
                  </g>
                );
              })}

              {/* Specific Humidity W tick marks & labels */}
              {[0, 5, 10, 15, 20, 25, 30].map((w) => {
                const y = 260 - (w / 30) * 230;
                return (
                  <g key={w}>
                    <line x1="450" y1={y} x2="455" y2={y} stroke="#64748b" strokeWidth="1" />
                    <text x="460" y={y + 3} fill="#94a3b8" fontSize="9" textAnchor="start" fontFamily="monospace">
                      {w}
                    </text>
                    {/* Horizontal humidity ratio lines */}
                    <line x1="60" y1={y} x2="450" y2={y} stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.4" />
                  </g>
                );
              })}

              {/* Saturation Curve (RH = 100%) */}
              {/* Computed points for RH=100% curve from 0°C to 35°C */}
              <path
                d="M 60,231 C 120,215 180,185 240,140 C 300,90 350,30 380,20"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
              />
              <text x="210" y="145" fill="#38bdf8" fontSize="9" fontWeight="bold" transform="rotate(-38 210 145)" fontFamily="monospace">
                Saturation Curve (φ = 100%)
              </text>

              {/* RH = 50% Curve */}
              <path
                d="M 60,245 C 130,238 210,218 290,180 C 350,145 410,95 440,65"
                fill="none"
                stroke="#0284c7"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.6"
              />
              <text x="320" y="170" fill="#0284c7" fontSize="8" transform="rotate(-28 320 170)" fontFamily="monospace">
                φ = 50%
              </text>

              {/* RH = 20% Curve */}
              <path
                d="M 60,254 C 140,252 240,242 330,220 C 390,200 430,170 450,150"
                fill="none"
                stroke="#0284c7"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.4"
              />
              <text x="360" y="215" fill="#0284c7" fontSize="8" transform="rotate(-18 360 215)" fontFamily="monospace">
                φ = 20%
              </text>

              {/* Process Vector Display */}
              {/* Point 1 (Inlet / Room Air) */}
              <circle cx={pt1.x} cy={pt1.y} r="5" fill="#38bdf8" stroke="#fff" strokeWidth="1.5" />
              <text x={pt1.x + 8} y={pt1.y - 6} fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                1 (Initial)
              </text>

              {/* If ADP exists, plot ADP point and connect to 1 */}
              {ptAdp && (
                <>
                  <circle cx={ptAdp.x} cy={ptAdp.y} r="4.5" fill="#f43f5e" stroke="#fff" strokeWidth="1.5" />
                  <text x={ptAdp.x - 8} y={ptAdp.y - 6} fill="#f43f5e" fontSize="10" fontWeight="bold" textAnchor="end" fontFamily="monospace">
                    ADP ({coilAdp}°C)
                  </text>
                  <line x1={pt1.x} y1={pt1.y} x2={ptAdp.x} y2={ptAdp.y} stroke="#f43f5e" strokeWidth="1" strokeDasharray="3,3" />
                </>
              )}

              {/* Process Vector Arrow from 1 to 2 */}
              {selectedProcess !== 'none' && selectedProcess !== 'mixing' && (
                <>
                  <line x1={pt1.x} y1={pt1.y} x2={pt2.x} y2={pt2.y} stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow)" />
                  <circle cx={pt2.x} cy={pt2.y} r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                  <text x={pt2.x + 8} y={pt2.y + 4} fill="#10b981" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    2 (Exit)
                  </text>
                </>
              )}

              {/* Mixing Display */}
              {selectedProcess === 'mixing' && ptMix && (
                <>
                  <line x1={pt1.x} y1={pt1.y} x2={pt2.x} y2={pt2.y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="3,3" />
                  <circle cx={pt2.x} cy={pt2.y} r="5" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
                  <text x={pt2.x + 8} y={pt2.y + 4} fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    2 (Stream 2)
                  </text>

                  <circle cx={ptMix.x} cy={ptMix.y} r="6" fill="#ec4899" stroke="#fff" strokeWidth="2" />
                  <text x={ptMix.x + 8} y={ptMix.y - 6} fill="#ec4899" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    M (Mixed)
                  </text>
                </>
              )}

              {/* Axis Labels */}
              <text x="250" y="295" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                Dry Bulb Temperature T_db (°C)
              </text>
              <text x="475" y="15" fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="monospace">
                Humidity Ratio ω (g/kg dry air)
              </text>
            </svg>
          </div>
        </div>

        {/* Right: Controls & Psychrometric Properties Sheet */}
        <div className="lg:col-span-5 space-y-4">
          {/* State 1 Sliders */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block font-mono">
              Inlet Condition (State 1) Controls
            </span>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                <span>Dry Bulb Temp (T_db1):</span>
                <span className="text-sky-400 font-mono">{tDb} °C</span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                step="1"
                value={tDb}
                onChange={(e) => setTDb(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                <span>Relative Humidity (RH1):</span>
                <span className="text-emerald-400 font-mono">{rh} %</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                step="5"
                value={rh}
                onChange={(e) => setRh(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Conditional Sub-controls based on Process */}
          {selectedProcess === 'cooling_dehumid' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block font-mono">
                Cooling Coil Parameters
              </span>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Apparatus Dew Point (ADP):</span>
                  <span className="text-rose-400 font-mono">{coilAdp} °C</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="16"
                  step="0.5"
                  value={coilAdp}
                  onChange={(e) => setCoilAdp(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Coil Bypass Factor (BPF):</span>
                  <span className="text-amber-400 font-mono">{coilBpf.toFixed(2)} (Eff: {((1 - coilBpf) * 100).toFixed(0)}%)</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.30"
                  step="0.01"
                  value={coilBpf}
                  onChange={(e) => setCoilBpf(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Live Properties Comparison Sheet */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Psychrometric Property</span>
              <span className="text-sky-400 font-bold">State 1</span>
              {processResult.state2 && <span className="text-emerald-400 font-bold">State 2</span>}
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Dry Bulb Temp (T_db):</span>
              <span className="text-white">{state1.T_db_C.toFixed(1)} °C</span>
              {processResult.state2 && <span className="text-emerald-400">{processResult.state2.T_db_C.toFixed(1)} °C</span>}
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Relative Humidity (φ):</span>
              <span className="text-white">{state1.RH_percent.toFixed(0)} %</span>
              {processResult.state2 && <span className="text-emerald-400">{processResult.state2.RH_percent.toFixed(0)} %</span>}
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Wet Bulb Temp (T_wb):</span>
              <span className="text-white">{state1.wetBulb_C.toFixed(1)} °C</span>
              {processResult.state2 && <span className="text-emerald-400">{processResult.state2.wetBulb_C.toFixed(1)} °C</span>}
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Dew Point Temp (T_dp):</span>
              <span className="text-white">{state1.dewPoint_C.toFixed(1)} °C</span>
              {processResult.state2 && <span className="text-emerald-400">{processResult.state2.dewPoint_C.toFixed(1)} °C</span>}
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Humidity Ratio (ω):</span>
              <span className="text-white">{state1.humidityRatio_g_kg.toFixed(2)} g/kg</span>
              {processResult.state2 && <span className="text-emerald-400">{processResult.state2.humidityRatio_g_kg.toFixed(2)} g/kg</span>}
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Specific Enthalpy (h):</span>
              <span className="text-white">{state1.enthalpy_kJ_kg.toFixed(1)} kJ/kg</span>
              {processResult.state2 && <span className="text-emerald-400">{processResult.state2.enthalpy_kJ_kg.toFixed(1)} kJ/kg</span>}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Specific Volume (v):</span>
              <span className="text-white">{state1.specificVolume_m3_kg.toFixed(3)} m³/kg</span>
              {processResult.state2 && <span className="text-emerald-400">{processResult.state2.specificVolume_m3_kg.toFixed(3)} m³/kg</span>}
            </div>
          </div>

          {/* Lewis Relation and Wetted Surface Card */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-400">Lewis Relation (Heat & Mass Transfer):</span>
              <span className="font-mono text-emerald-400 font-bold">Le = h_c / (h_d · c_pm) ≈ 1.0</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              For air-water vapor mixtures, the Lewis number is practically unity.
              Consequently, the convective heat transfer coefficient $h_c$ and mass transfer coefficient $h_d$ are directly coupled, meaning wet-bulb temperature is virtually identical to adiabatic saturation temperature!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
