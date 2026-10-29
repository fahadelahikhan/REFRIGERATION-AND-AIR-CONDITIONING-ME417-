import React, { useState, useMemo } from 'react';
import { calculateVARS_COP } from '../../utils/thermodynamics';
import { Flame, Wind, Droplets, Zap, ShieldAlert, Cpu, Sparkles, RefreshCw } from 'lucide-react';

export const ModuleAbsorptionAndSpecial: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vars' | 'electrolux' | 'aircraft' | 'steam_jet' | 'dry_ice' | 'unconventional'>('vars');

  // VARS Inputs
  const [tEvap, setTEvap] = useState<number>(5); // °C
  const [tCondAbs, setTCondAbs] = useState<number>(35); // °C
  const [tGen, setTGen] = useState<number>(90); // °C

  const varsCop = useMemo(() => {
    return calculateVARS_COP(tEvap, tCondAbs, tGen);
  }, [tEvap, tCondAbs, tGen]);

  return (
    <div className="space-y-6">
      {/* Syllabus Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-sky-400">ME417 · SYLLABUS TOPIC 5</span>
            <h2 className="text-xl font-bold text-white mt-0.5">Absorption & Non-Conventional Refrigeration Systems</h2>
            <p className="text-sm text-slate-400 mt-1">
              Thermal heat-driven cycles (VARS, Electrolux 3-fluid), aircraft air-cycle (Bootstrap),
              steam-jet ejector refrigeration, dry ice manufacturing, vortex tubes, thermoelectric, and magnetocaloric cooling.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-800 rounded-lg">
            <button
              onClick={() => setActiveTab('vars')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'vars' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              VARS Absorption
            </button>
            <button
              onClick={() => setActiveTab('electrolux')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'electrolux' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Electrolux 3-Fluid
            </button>
            <button
              onClick={() => setActiveTab('aircraft')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'aircraft' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Aircraft Bootstrap
            </button>
            <button
              onClick={() => setActiveTab('steam_jet')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'steam_jet' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Steam-Jet
            </button>
            <button
              onClick={() => setActiveTab('dry_ice')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'dry_ice' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dry Ice (CO2)
            </button>
            <button
              onClick={() => setActiveTab('unconventional')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'unconventional' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Vortex / Peltier / Magnet
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'vars' && (
        <div className="space-y-6">
          {/* VARS Simulator */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  Vapor Absorption Refrigeration System (VARS)
                </h3>
                <span className="text-xs text-slate-400">
                  Heat-operated system where the mechanical compressor is replaced by an Absorber, Generator, and Solution Pump.
                </span>
              </div>
              <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-sky-400">
                COP = (T_E / T_G) · [(T_G - T_C) / (T_C - T_E)]
              </div>
            </div>

            {/* Interactive Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Evaporator Temp (T_E):</span>
                  <span className="text-sky-400 font-mono">{tEvap} °C ({(tEvap + 273.15).toFixed(1)} K)</span>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  step="1"
                  value={tEvap}
                  onChange={(e) => setTEvap(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Condenser & Absorber (T_C):</span>
                  <span className="text-rose-400 font-mono">{tCondAbs} °C ({(tCondAbs + 273.15).toFixed(1)} K)</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="50"
                  step="1"
                  value={tCondAbs}
                  onChange={(e) => setTCondAbs(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Generator Heating Source (T_G):</span>
                  <span className="text-amber-400 font-mono">{tGen} °C ({(tGen + 273.15).toFixed(1)} K)</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="160"
                  step="2"
                  value={tGen}
                  onChange={(e) => setTGen(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60">
                <span className="text-[11px] text-amber-300 font-mono block">THEORETICAL MAXIMUM COP</span>
                <span className="text-3xl font-black text-white font-mono mt-1 block">
                  {varsCop.toFixed(3)}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block mt-1">
                  Product of Carnot heat engine and Carnot refrigerator
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono block">CARNOT REFRIGERATOR TERM</span>
                <span className="text-2xl font-bold text-sky-400 font-mono mt-1 block">
                  {((tEvap + 273.15) / Math.max(1, (tCondAbs - tEvap))).toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  T_E / (T_C - T_E)
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono block">CARNOT ENGINE EFFICIENCY TERM</span>
                <span className="text-2xl font-bold text-amber-400 font-mono mt-1 block">
                  {(((tGen - tCondAbs) / (tGen + 273.15)) * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  (T_G - T_C) / T_G
                </span>
              </div>
            </div>

            {/* Working Fluid Pairs Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-sky-400 text-sm block">1. Ammonia - Water (NH3 - H2O) System</span>
                <p className="text-slate-300">
                  <strong>Refrigerant:</strong> Ammonia (NH3) · <strong>Absorbent:</strong> Water (H2O).
                  Because water is volatile, water vapor leaves the generator along with ammonia.
                  Requires an <strong>Analyzer</strong> and <strong>Rectifier</strong> to condense water droplets and deliver pure 99.9% anhydrous ammonia to the condenser, avoiding ice formation in expansion valve.
                </p>
                <div className="text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800">
                  Applications: Low-temp industrial refrigeration, cold stores, gas-fired absorption chillers.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400 text-sm block">2. Water - Lithium Bromide (H2O - LiBr)</span>
                <p className="text-slate-300">
                  <strong>Refrigerant:</strong> Water (H2O) · <strong>Absorbent:</strong> Lithium Bromide (LiBr salt solution).
                  Since LiBr is non-volatile, pure water vapor distills off in the generator (no rectifier needed).
                  Operates under deep vacuum (0.008 bar). Cannot produce temperatures below 0°C (water freezes).
                </p>
                <div className="text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800">
                  Applications: Large commercial HVAC water chillers (utilizing waste steam or solar thermal).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'electrolux' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              Electrolux 3-Fluid Absorption System (Munters-Tanders Refrigerator)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Pumpless, noiseless domestic refrigerator operating entirely on natural circulation via a bubble pump (thermosiphon).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-sky-400 font-bold block text-sm">Ammonia (NH3)</span>
              <span className="text-slate-400 text-[11px] block mt-1">Refrigerant</span>
              <p className="text-slate-300 font-sans mt-2 text-xs">
                Evaporates in the evaporator absorbing heat. High latent heat of vaporization.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-emerald-400 font-bold block text-sm">Water (H2O)</span>
              <span className="text-slate-400 text-[11px] block mt-1">Absorbent Solvent</span>
              <p className="text-slate-300 font-sans mt-2 text-xs">
                Absorbs ammonia vapor in the absorber, forming strong aqua solution.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-amber-400 font-bold block text-sm">Hydrogen (H2)</span>
              <span className="text-slate-400 text-[11px] block mt-1">Inert Balancing Gas</span>
              <p className="text-slate-300 font-sans mt-2 text-xs">
                Maintains constant total pressure (~18 bar) while lowering ammonia partial pressure (P_NH3 ≈ 2 bar) in evaporator.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-3">
            <h4 className="font-bold text-white text-sm">Key Operating Innovations:</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>
                <strong className="text-slate-200">Dalton’s Law of Partial Pressures:</strong> The entire system operates at one uniform total pressure (P_total ≈ 18 bar), eliminating valves and mechanical pumps! In the evaporator, hydrogen gas mixes with ammonia, lowering ammonia's partial pressure to 2 bar so it boils at -15°C.
              </li>
              <li>
                <strong className="text-slate-200">Thermosiphon / Bubble Pump:</strong> Heat applied at the generator base produces ammonia gas bubbles inside a narrow vertical tube that lift slugs of liquid solution upward into the separator like a coffee percolator.
              </li>
              <li>
                <strong className="text-slate-200">Gravity & Density Driven Circulation:</strong> Heavy ammonia-hydrogen mixture in the evaporator sinks down into the absorber, while lighter hydrogen gas rises back into the evaporator.
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'aircraft' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wind className="w-5 h-5 text-sky-400" />
              Air-Cycle Aircraft Air Conditioning (Simple & Bootstrap Cycles)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Reversed Brayton / Bell-Coleman cycle using atmospheric air as refrigerant. Lightweight and safe for aviation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <span className="font-bold text-sky-400 text-sm block">Simple Aircraft Cycle</span>
              <p className="text-slate-300 leading-relaxed">
                Bleed air from jet engine compressor (200°C, 3-4 bar) passes through a <strong>Primary Heat Exchanger</strong> cooled by ambient ram air.
                Pre-cooled air then expands through a <strong>Cooling Turbine</strong>, dropping temperature to 0°C to 5°C before entering the passenger cabin.
                The turbine power is dissipated driving an ambient cooling air suction fan.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <span className="font-bold text-emerald-400 text-sm block">Bootstrap Aircraft Air-Conditioning System</span>
              <p className="text-slate-300 leading-relaxed">
                Used in high-speed, high-altitude commercial airliners. Features <strong>two heat exchangers</strong> and a <strong>secondary compressor</strong> driven directly by the cooling expansion turbine shaft ("bootstrapping").
              </p>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[11px]">
                Bleed Air → 1st HX → Secondary Compressor → 2nd HX → Cooling Turbine → Cabin
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-amber-400 block mb-1">Why Air Cycle Dominates Aviation despite Lower COP:</span>
            <p className="text-slate-400 leading-relaxed">
              Air cycle COP is lower (~0.5 - 1.2) than VCRS, but weight per TR is only 15% of a fluorocarbon system. Air is non-flammable, non-toxic, and passenger cabin pressurization requires continuous fresh air exchange anyway.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'steam_jet' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-sky-400" />
              Steam-Jet Ejector Refrigeration System
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Water is the refrigerant! Uses high-velocity steam ejectors to create extreme vacuum over water.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-sky-400 text-sm block">Operating Principle</span>
              <p className="text-slate-300 leading-relaxed">
                High-pressure boiler motive steam (5 to 10 bar) accelerates through a <strong>convergent-divergent supersonic nozzle</strong> to supersonic speeds (1000+ m/s).
                The high velocity jet creates high vacuum (approx 0.008 bar = 0.8 kPa) in the mixing chamber connected to a water flash tank.
                Water flashes/boils at 5°C to 8°C, chilling the remaining return water.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 text-sm block">Advantages & Industrial Fit</span>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Zero moving mechanical parts (no compressor shaft seals).</li>
                <li>Operates on low-grade waste steam from chemical/petrochemical plants.</li>
                <li>Water is non-toxic, non-flammable, and zero GWP.</li>
                <li>Ideal for chemical refining, food processing, and breweries.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dry_ice' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Manufacturing of Dry Ice (Solid Carbon Dioxide CO2)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Phase behavior around the CO2 triple point (5.18 bar, -56.6°C) and commercial snow press cycles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-sky-400 text-sm block">1. Three-Stage Compression</span>
              <p className="text-slate-300">
                Carbon dioxide gas at atmospheric pressure is compressed in 3 stages up to 70 bar with intermediate intercoolers and water separators.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 text-sm block">2. Flashing & Snow Chamber</span>
              <p className="text-slate-300">
                Liquid CO2 at 70 bar passes through throttling valves into a snow chamber at 1 atm. Because 1 atm is far below the triple point (5.18 bar), CO2 cannot exist as liquid: it instantly separates into cold vapor and solid <strong>CO2 snow</strong> (-78.5°C).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-purple-400 text-sm block">3. Hydraulic Snow Press</span>
              <p className="text-slate-300">
                Hydraulic rams compress the loose snow under 100 bar pressure into dense blocks (density ~1500 kg/m³). Latent heat of sublimation is 571 kJ/kg (nearly double ice at 333 kJ/kg).
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'unconventional' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Non-Conventional Refrigeration Systems</h3>
            <p className="text-xs text-slate-400 mt-1">
              Vortex tube, Thermoelectric (Peltier), and Magnetocaloric cooling mechanisms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-sky-400 text-sm block">Ranque-Hilsch Vortex Tube</span>
              <p className="text-slate-300 leading-relaxed">
                Compressed air (5-8 bar) enters tangentially into a swirl chamber at sonic speed. The centrifugal vortex splits: outer peripheral air loses energy and exits hot (+50°C to +100°C), while inner axial core air drops temperature and exits cold (-20°C to -40°C).
              </p>
              <span className="text-[11px] text-slate-400 block pt-2 border-t border-slate-800">
                Zero moving parts. Used in CNC spot machining tool cooling and welding jackets.
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 text-sm block">Thermoelectric (Peltier Effect)</span>
              <p className="text-slate-300 leading-relaxed">
                Direct current passing through p-type and n-type Bismuth Telluride (Bi2Te3) semiconductor pellets causes heat absorption at the cold junction and heat rejection at the hot junction (Q_c = Π · I - 0.5 I² R - K ΔT).
              </p>
              <span className="text-[11px] text-slate-400 block pt-2 border-t border-slate-800">
                Solid state. Used in spacecraft electronics, wine coolers, PCR medical instruments.
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 text-sm block">Magnetic Refrigeration (MCE)</span>
              <p className="text-slate-300 leading-relaxed">
                Based on the <strong>magnetocaloric effect</strong> in paramagnetic materials (e.g., Gadolinium alloys). Applying a strong magnetic field aligns magnetic dipoles, reducing magnetic entropy and heating the metal. Removing field causes temperature drop.
              </p>
              <span className="text-[11px] text-slate-400 block pt-2 border-t border-slate-800">
                Reaches near absolute zero (cryogenics) and next-gen zero-GWP commercial chillers.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
