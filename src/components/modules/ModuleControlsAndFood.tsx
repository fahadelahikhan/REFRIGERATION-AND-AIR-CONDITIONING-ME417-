import React, { useState } from 'react';
import { Cpu, ShieldCheck, Snowflake, Flame, Apple, Coffee, Layers, Info } from 'lucide-react';

export const ModuleControlsAndFood: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'controls' | 'food_thermo' | 'applications'>('controls');

  return (
    <div className="space-y-6">
      {/* Syllabus Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-sky-400">ME417 · SYLLABUS TOPIC 9</span>
            <h2 className="text-xl font-bold text-white mt-0.5">Controls & Food Processing Preservation</h2>
            <p className="text-sm text-slate-400 mt-1">
              Safety cutouts, pneumatic vs. DDC electronics, food freezing thermodynamics, freeze-drying (lyophilization),
              and environmental storage engineering for confectionery, bakery, and produce.
            </p>
          </div>
          <div className="flex items-center gap-2 p-1 bg-slate-800 rounded-lg self-start">
            <button
              onClick={() => setActiveTab('controls')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'controls' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              HVAC & RAC Controls
            </button>
            <button
              onClick={() => setActiveTab('food_thermo')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'food_thermo' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Chilling & Freezing Physics
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'applications' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Food Industry Applications
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'controls' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-sky-400 text-sm block">1. Pneumatic Controls</span>
              <p className="text-slate-300 leading-relaxed">
                Uses clean compressed air at 3 to 15 psi (0.2 to 1.0 bar). Flapper-nozzle mechanisms modulate bleed pressure to move spring-loaded diaphragms on large valves.
              </p>
              <span className="text-[11px] text-slate-400 block pt-1 border-t border-slate-800 font-mono">
                Safe in explosive/flammable environments (refineries).
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-emerald-400 text-sm block">2. Hydraulic Controls</span>
              <p className="text-slate-300 leading-relaxed">
                Uses incompressible hydraulic oil under pressure (50 to 150 bar). High force-to-size ratio.
              </p>
              <span className="text-[11px] text-slate-400 block pt-1 border-t border-slate-800 font-mono">
                Used for massive industrial chiller slide-valves & heavy dampers.
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-amber-400 text-sm block">3. Electric Controls</span>
              <p className="text-slate-300 leading-relaxed">
                Line-voltage (230V) or low-voltage (24V AC) circuits. Bimetallic thermostats, solenoid valves, magnetic motor starters, and differential pressure safety cutouts.
              </p>
              <span className="text-[11px] text-slate-400 block pt-1 border-t border-slate-800 font-mono">
                High / Low pressure cutouts (HP/LP) protect compressor.
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-purple-400 text-sm block">4. Electronic / DDC (BMS)</span>
              <p className="text-slate-300 leading-relaxed">
                Microprocessor-based Direct Digital Control (DDC). Runs software PID loops based on 10k thermistors, 4-20mA pressure transmitters, communicating via BACnet/Modbus.
              </p>
              <span className="text-[11px] text-slate-400 block pt-1 border-t border-slate-800 font-mono">
                Modern standard for energy optimization & scheduling.
              </span>
            </div>
          </div>

          {/* Safety & Operational Reasons */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
            <span className="font-bold text-white text-sm block">Core Reasons for Controls in Refrigeration & Air Conditioning:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-400">
              <div>• <strong>Compressor Safety:</strong> LP cutout prevents running in vacuum; HP cutout trips before condenser rupture pressure; Oil differential pressure cutout protects bearings.</div>
              <div>• <strong>Capacity Modulation:</strong> Variable Speed Drives (VFD), cylinder unloader valves, and electronic expansion valves match cooling output to fluctuating cooling loads.</div>
              <div>• <strong>Thermal Comfort & Process Tolerances:</strong> Holding cleanrooms and computer suites within ±0.5°C and ±3% RH.</div>
              <div>• <strong>Defrost Management:</strong> Electric heater or reverse-cycle hot gas defrost timers prevent choking ice accumulation on evaporator coils.</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'food_thermo' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Food Freezing Curve & Preservation Physics</h3>
            <p className="text-xs text-slate-400 mt-1">
              Thermodynamic sensible cooling, crystallization plateau, eutectic freeze point, and lyophilization (freeze-drying).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-sky-400 text-sm block">1. Chilling (0°C to +5°C)</span>
              <p className="text-slate-300 leading-relaxed">
                Reduces food temperature down to just above its initial freezing point (-1°C to -2°C).
                Slows bacterial multiplication and enzyme degradation without cell wall disruption from ice crystals.
              </p>
              <span className="text-[11px] text-slate-400 block pt-1 border-t border-slate-800">
                Extends shelf life from days to weeks for fresh meat, dairy, and leafy greens.
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 text-sm block">2. Fast Freezing (-18°C to -35°C)</span>
              <p className="text-slate-300 leading-relaxed">
                <strong>Fast Blast Freezing vs Slow Freezing:</strong> Fast freezing passes through the zone of maximum ice crystal formation (-1°C to -5°C) within minutes, producing tiny intracellular crystals that preserve food cell membranes and prevent "drip loss" during thawing.
              </p>
              <span className="text-[11px] text-slate-400 block pt-1 border-t border-slate-800">
                Latent heat of freezing of bound moisture: L_f ≈ 333.5 · (% water / 100) kJ/kg.
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-purple-400 text-sm block">3. Freeze-Drying (Lyophilization)</span>
              <p className="text-slate-300 leading-relaxed">
                Food is frozen, then placed in a vacuum chamber below water's triple point ($P &lt; 0.611$ kPa / 4.58 mmHg).
                Ice directly sublimates into vapor without melting!
                Retains 98% original food structure, aroma, vitamins, and instant rehydration capability.
              </p>
              <span className="text-[11px] text-slate-400 block pt-1 border-t border-slate-800">
                Used in: Instant coffee, military MREs, pharmaceuticals, space food.
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Specific Food Processing Applications</h3>
            <p className="text-xs text-slate-400 mt-1">
              Temperature, relative humidity, and air velocity design specifications for confectionery, bakery, and produce cold storages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <span className="font-bold text-amber-400 text-sm block flex items-center gap-1.5">
                <Coffee className="w-4 h-4" /> Candy & Confectionery
              </span>
              <p className="text-slate-300 leading-relaxed">
                Sugar is hygroscopic. If ambient Relative Humidity exceeds <strong>50% RH</strong>, moisture dissolves surface sugar crystals, causing stickiness and "sugar bloom" on chocolate cooling tunnels.
              </p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-0.5">
                <div>• Chocolate cooling tunnels: 12°C - 15°C, 45% RH</div>
                <div>• Hard candy packaging: 20°C, 35% - 40% RH</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <span className="font-bold text-rose-400 text-sm block flex items-center gap-1.5">
                <Flame className="w-4 h-4" /> Bakery Products
              </span>
              <p className="text-slate-300 leading-relaxed">
                Dough fermentation proofing requires warm humid air (35°C, 85% RH) to promote yeast activity without crust drying.
                Conversely, dough retarder chillers (2°C to 4°C) put yeast into dormancy for scheduled morning baking.
              </p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-0.5">
                <div>• Par-baked blast freezing: -35°C air blast</div>
                <div>• Flour ingredient storage: 18°C - 20°C, 60% RH</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <span className="font-bold text-emerald-400 text-sm block flex items-center gap-1.5">
                <Apple className="w-4 h-4" /> Fruits & Vegetables (CA Storage)
              </span>
              <p className="text-slate-300 leading-relaxed">
                Fresh produce continues living and respirating, releasing heat of respiration (q_resp) and ethylene gas that accelerates decay.
                Requires <strong>Controlled Atmosphere (CA) Storage</strong>: lowering O2 from 21% down to 2%, elevating CO2 to 3-5%, and maintaining 90-95% RH to stop moisture transpiration.
              </p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-0.5">
                <div>• Apples: 0°C - 2°C, 92% RH (stored up to 12 months)</div>
                <div>• Bananas: 13°C - 14°C (chilling injury below 12°C)</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
