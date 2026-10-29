import React, { useState, useMemo } from 'react';
import { calculateSpaceCoolingLoad, LoadSheetInputs } from '../../utils/thermodynamics';
import { Activity, Sliders, CheckCircle2, Shield, Flame, Sun, Users, Lightbulb, Wind } from 'lucide-react';

export const ModuleCoolingLoad: React.FC = () => {
  // Building and space parameters
  const [roomArea, setRoomArea] = useState<number>(120); // m²
  const [ceilingHeight, setCeilingHeight] = useState<number>(3.0); // m
  const [occupants, setOccupants] = useState<number>(20);
  const [lightingWPerM2, setLightingWPerM2] = useState<number>(12); // W/m²
  const [equipmentPowerW, setEquipmentPowerW] = useState<number>(2500); // W
  const [solarGlassW, setSolarGlassW] = useState<number>(3200); // W
  const [wallTransmissionW, setWallTransmissionW] = useState<number>(2800); // W

  // Design weather conditions
  const [outdoorT, setOutdoorT] = useState<number>(38); // °C DB
  const [outdoorRH, setOutdoorRH] = useState<number>(45); // %
  const [indoorT, setIndoorT] = useState<number>(24); // °C DB
  const [indoorRH, setIndoorRH] = useState<number>(50); // %
  const [ventRate, setVentRate] = useState<number>(10); // L/s per person

  const loadInputs: LoadSheetInputs = {
    roomArea_m2: roomArea,
    ceilingHeight_m: ceilingHeight,
    numberOfOccupants: occupants,
    lightingPowerDensity_W_m2: lightingWPerM2,
    equipmentPower_W: equipmentPowerW,
    solarHeatGain_W: solarGlassW,
    wallHeatTransmission_W: wallTransmissionW,
    outdoorTemp_C: outdoorT,
    outdoorRH_percent: outdoorRH,
    indoorTemp_C: indoorT,
    indoorRH_percent: indoorRH,
    ventilationRate_L_s_per_person: ventRate,
    airChangesPerHourInfiltration: 0.5
  };

  const loadResults = useMemo(() => {
    return calculateSpaceCoolingLoad(loadInputs);
  }, [loadInputs]);

  return (
    <div className="space-y-6">
      {/* Syllabus Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-sky-400">ME417 · SYLLABUS TOPIC 7</span>
            <h2 className="text-xl font-bold text-white mt-0.5">Air Conditioning Cooling Load & Thermal Comfort</h2>
            <p className="text-sm text-slate-400 mt-1">
              Interactive ASHRAE 55 thermal comfort standard, room & grand sensible heat factors (RSHF/GSHF),
              building envelope heat gain, internal loads, ventilation air requirements, and dehumidified CFM air quantity.
            </p>
          </div>
          <div className="p-2.5 bg-slate-800 rounded-lg text-xs font-mono text-emerald-400">
            ASHRAE Standard 55 & 62.1
          </div>
        </div>
      </div>

      {/* Main Grid: Parameters & Real-time Load Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Panel */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Space Parameters & Design Conditions
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Floor Area:</span>
                <span className="text-sky-400 font-mono">{roomArea} m²</span>
              </div>
              <input
                type="range"
                min="30"
                max="500"
                step="10"
                value={roomArea}
                onChange={(e) => setRoomArea(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Occupants:</span>
                <span className="text-emerald-400 font-mono">{occupants} persons</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={occupants}
                onChange={(e) => setOccupants(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Lighting Density:</span>
                <span className="text-amber-400 font-mono">{lightingWPerM2} W/m²</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={lightingWPerM2}
                onChange={(e) => setLightingWPerM2(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Equipment Power:</span>
                <span className="text-purple-400 font-mono">{equipmentPowerW} W</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={equipmentPowerW}
                onChange={(e) => setEquipmentPowerW(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Solar Heat Glass:</span>
                <span className="text-rose-400 font-mono">{solarGlassW} W</span>
              </div>
              <input
                type="range"
                min="500"
                max="8000"
                step="250"
                value={solarGlassW}
                onChange={(e) => setSolarGlassW(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Wall Transmission:</span>
                <span className="text-orange-400 font-mono">{wallTransmissionW} W</span>
              </div>
              <input
                type="range"
                min="500"
                max="8000"
                step="250"
                value={wallTransmissionW}
                onChange={(e) => setWallTransmissionW(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 block font-mono">Weather Design Conditions:</span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">OUTDOOR DESIGN</span>
                <span className="text-rose-400 font-bold">{outdoorT}°C DB / {outdoorRH}% RH</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">INDOOR COMFORT</span>
                <span className="text-sky-400 font-bold">{indoorT}°C DB / {indoorRH}% RH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Load Sheet & Equipment Sizing */}
        <div className="lg:col-span-7 space-y-4">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-800/60">
              <span className="text-[11px] text-sky-300 font-mono block">TOTAL COOLING TONNAGE</span>
              <span className="text-3xl font-black text-white font-mono mt-1 block">
                {loadResults.totalCapacity_TR.toFixed(2)} <span className="text-sm font-normal">TR</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                {(loadResults.grandTotalHeat_W / 1000).toFixed(2)} kW total heat
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
              <span className="text-[11px] text-emerald-300 font-mono block">SUPPLY AIR FLOW RATE</span>
              <span className="text-3xl font-black text-white font-mono mt-1 block">
                {loadResults.supplyAirFlow_CFM.toFixed(0)} <span className="text-sm font-normal">CFM</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                {(loadResults.supplyAirFlow_m3_s * 3600).toFixed(0)} m³/h dehumidified air
              </span>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60">
              <span className="text-[11px] text-amber-300 font-mono block">ROOM SENSIBLE HEAT FACTOR</span>
              <span className="text-3xl font-black text-white font-mono mt-1 block">
                {loadResults.roomSensibleHeatFactor.toFixed(3)}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                RSHF = RSH / (RSH + RLH)
              </span>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase font-mono">
                Cooling Load Itemized Engineering Breakdown
              </span>
              <span className="text-[11px] text-sky-400 font-mono">ASHRAE Heat Balance Method</span>
            </div>

            <div className="p-4 font-mono text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">1. Solar Glass + Wall Transmission:</span>
                <span className="text-white">{(solarGlassW + wallTransmissionW).toFixed(0)} W (Sensible)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">2. Occupants Internal Load:</span>
                <span className="text-white">
                  {(occupants * 75).toFixed(0)} W (Sensible) + {(occupants * 55).toFixed(0)} W (Latent)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">3. Lighting & Equipment Power:</span>
                <span className="text-white">{(roomArea * lightingWPerM2 + equipmentPowerW).toFixed(0)} W (Sensible)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">4. Ventilation & Infiltration Fresh Air:</span>
                <span className="text-white">
                  {loadResults.freshAirSensible_W.toFixed(0)} W (Sensible) + {loadResults.freshAirLatent_W.toFixed(0)} W (Latent)
                </span>
              </div>
              <div className="flex justify-between pt-1 font-bold">
                <span className="text-sky-400">Grand Total Cooling Load:</span>
                <span className="text-emerald-400 text-sm">
                  {(loadResults.grandTotalHeat_W / 1000).toFixed(2)} kW ({loadResults.totalCapacity_TR.toFixed(2)} TR)
                </span>
              </div>
            </div>
          </div>

          {/* Equipment Selection Guide */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
            <span className="font-bold text-white uppercase tracking-wider block font-mono">
              Recommended Equipment Archetype for this Duty ({loadResults.totalCapacity_TR.toFixed(1)} TR):
            </span>
            {loadResults.totalCapacity_TR < 5 ? (
              <p className="text-sky-300">
                <strong>High-Efficiency Inverter Ductless Split / Multi-Split:</strong> Best cost, zone control, no ductwork losses.
              </p>
            ) : loadResults.totalCapacity_TR < 30 ? (
              <p className="text-emerald-300">
                <strong>Variable Refrigerant Flow (VRF / VRV System):</strong> Simultaneous cooling/heating, high part-load efficiency, modular outdoor units.
              </p>
            ) : (
              <p className="text-amber-300">
                <strong>Central Chilled Water Plant (AHUs + Water-Cooled Screw/Centrifugal Chiller):</strong> Optimum efficiency for large multistory commercial facilities.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
