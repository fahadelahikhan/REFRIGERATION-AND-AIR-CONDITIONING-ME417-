import React, { useState, useMemo } from 'react';
import { calculateEquivalentDuctDiameter } from '../../utils/thermodynamics';
import { Compass, Wind, Droplets, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';

export const ModuleDistribution: React.FC = () => {
  // Duct calculator state
  const [ductWidth, setDuctWidth] = useState<number>(500); // mm
  const [ductHeight, setDuctHeight] = useState<number>(300); // mm
  const [airFlowCFM, setAirFlowCFM] = useState<number>(2000); // CFM
  const [activeTab, setActiveTab] = useState<'duct' | 'fans' | 'piping'>('duct');

  const deq = useMemo(() => {
    return calculateEquivalentDuctDiameter(ductWidth, ductHeight);
  }, [ductWidth, ductHeight]);

  const ductArea_m2 = (ductWidth / 1000) * (ductHeight / 1000);
  const airFlow_m3_s = airFlowCFM * 0.000471947;
  const airVelocity_m_s = airFlow_m3_s / Math.max(0.01, ductArea_m2);
  const aspectRatio = Math.max(ductWidth, ductHeight) / Math.min(ductWidth, ductHeight);

  return (
    <div className="space-y-6">
      {/* Syllabus Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-sky-400">ME417 · SYLLABUS TOPIC 8</span>
            <h2 className="text-xl font-bold text-white mt-0.5">Air & Hydronic Distribution Systems</h2>
            <p className="text-sm text-slate-400 mt-1">
              Conditioned air duct design (Equal Friction, Velocity Reduction, Static Regain), fan selection curves,
              and chilled water direct vs. reverse return (Tichelmann) hydraulic balancing.
            </p>
          </div>
          <div className="flex items-center gap-2 p-1 bg-slate-800 rounded-lg self-start">
            <button
              onClick={() => setActiveTab('duct')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'duct' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Duct Design & Sizing
            </button>
            <button
              onClick={() => setActiveTab('fans')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'fans' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Fan Selection
            </button>
            <button
              onClick={() => setActiveTab('piping')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'piping' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hydronic Piping Loops
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'duct' && (
        <div className="space-y-6">
          {/* Interactive Equivalent Duct Sizing Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Interactive Huebscher Equivalent Duct Calculator
              </h3>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1 font-medium">
                  <span>Rectangular Duct Width (a):</span>
                  <span className="text-sky-400 font-mono">{ductWidth} mm</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="1200"
                  step="25"
                  value={ductWidth}
                  onChange={(e) => setDuctWidth(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1 font-medium">
                  <span>Rectangular Duct Height (b):</span>
                  <span className="text-sky-400 font-mono">{ductHeight} mm</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="800"
                  step="25"
                  value={ductHeight}
                  onChange={(e) => setDuctHeight(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1 font-medium">
                  <span>Design Airflow Rate:</span>
                  <span className="text-emerald-400 font-mono">{airFlowCFM} CFM ({(airFlow_m3_s * 3600).toFixed(0)} m³/h)</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="6000"
                  step="100"
                  value={airFlowCFM}
                  onChange={(e) => setAirFlowCFM(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-800/60 text-center">
                <span className="text-[10px] text-sky-300 font-mono block">EQUIVALENT CIRCULAR DIA (D_eq)</span>
                <span className="text-3xl font-black text-white font-mono mt-1 block">
                  {deq.toFixed(0)} <span className="text-sm font-normal">mm</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  1.30 · (a·b)^0.625 / (a+b)^0.25
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-mono block">AIR VELOCITY</span>
                <span className={`text-3xl font-black font-mono mt-1 block ${airVelocity_m_s > 8.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {airVelocity_m_s.toFixed(2)} <span className="text-sm font-normal">m/s</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  {airVelocity_m_s <= 6.0 ? 'Low Noise Comfort' : airVelocity_m_s <= 8.5 ? 'Moderate Main Duct' : 'High Noise Warning'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-mono block">ASPECT RATIO (W/H)</span>
                <span className={`text-3xl font-black font-mono mt-1 block ${aspectRatio > 4 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {aspectRatio.toFixed(2)} : 1
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  {aspectRatio <= 4 ? 'Within ASHRAE limit (< 4:1)' : 'Excessive sheet metal weight'}
                </span>
              </div>
            </div>
          </div>

          {/* Duct Design Methods Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-bold text-sky-400 text-sm block">1. Equal Friction Method</span>
              <p className="text-slate-300 leading-relaxed">
                Most popular commercial method. Sized so that friction loss per unit length of duct ($\Delta P_f / L$) is maintained constant throughout (typically <strong>0.8 to 1.2 Pa/m</strong>).
              </p>
              <span className="text-[11px] text-slate-400 block pt-1 border-t border-slate-800 font-mono">
                Requires manual dampers on branch runouts to balance pressure drops.
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 text-sm block">2. Velocity Reduction Method</span>
              <p className="text-slate-300 leading-relaxed">
                Velocity is stepped down after every branch takeoff (e.g., 8 m/s in main trunk → 6 m/s in sub-main → 4 m/s in branch diffusers).
              </p>
              <span className="text-[11px] text-slate-400 block pt-1 border-t border-slate-800 font-mono">
                Simple, but does not equalize pressure drops across branches.
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-bold text-purple-400 text-sm block">3. Static Regain Method</span>
              <p className="text-slate-300 leading-relaxed">
                Velocity is deliberately decreased in each subsequent duct section such that the regain in static pressure (ΔPs = η_r · 0.5ρ (V₁² - V₂²)) exactly offsets the friction loss in that section.
              </p>
              <span className="text-[11px] text-slate-400 block pt-1 border-t border-slate-800 font-mono">
                Self-balancing high velocity systems (airports, concert halls).
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fans' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Fan Selection & Centrifugal Blade Geometry</h3>
            <p className="text-xs text-slate-400 mt-1">
              Fan laws, total efficiency, and aerodynamic comparison of forward-curved, backward-inclined, and axial fans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-sky-400 text-sm block">Forward-Curved (Squirrel Cage)</span>
              <p className="text-slate-300 leading-relaxed">
                Blades curve in the direction of impeller rotation. Produces large volume flow at low speeds and compact casing. Lower efficiency (55-65%). Overloading power curve.
              </p>
              <span className="text-[11px] text-slate-400 font-mono block">Used in: Residential packaged units, fan coil units (FCUs).</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 text-sm block">Backward-Inclined / Aerofoil</span>
              <p className="text-slate-300 leading-relaxed">
                Blades curve opposite to rotation. Highest aerodynamic efficiency (75-85%). <strong>Non-overloading power characteristic:</strong> brake horsepower reaches a peak and flattens out, preventing motor burnout.
              </p>
              <span className="text-[11px] text-slate-400 font-mono block">Used in: Large commercial Air Handling Units (AHUs).</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 text-sm block">Vane-Axial & Tube-Axial</span>
              <p className="text-slate-300 leading-relaxed">
                Airflow continues straight parallel to shaft axis. Guide vanes straighten swirl velocity into static pressure. Compact in-line duct installation.
              </p>
              <span className="text-[11px] text-slate-400 font-mono block">Used in: Car park smoke ventilation, tunnel ventilation.</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'piping' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Chilled Water Distribution: Direct Return vs Reverse Return</h3>
            <p className="text-xs text-slate-400 mt-1">
              Hydraulic pipe circuit design and pressure balancing principles (The Tichelmann Loop).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="font-bold text-rose-400 text-sm block">Direct Return System (Two-Pipe)</span>
              <p className="text-slate-300 leading-relaxed">
                The terminal unit closest to the chiller has the shortest supply pipe AND the shortest return pipe.
                Terminal unit 1 experiences a huge pressure differential (hf1 &lt;&lt; hf3), causing severe water starvation at distant unit 3.
              </p>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-rose-300 font-mono text-[11px]">
                Requires expensive manual or automatic dynamic balancing valves to choke flow at near units.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="font-bold text-emerald-400 text-sm block">Reverse Return System (Tichelmann Loop)</span>
              <p className="text-slate-300 leading-relaxed">
                The first terminal unit supplied is the <strong>last returned</strong>!
                Total equivalent pipe length (Supply + Return) is virtually identical for every cooling coil in the building: L_sup,1 + L_ret,1 = L_sup,3 + L_ret,3.
              </p>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-emerald-300 font-mono text-[11px]">
                Naturally self-balancing hydraulic network with minimal balancing valve friction throttling.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
