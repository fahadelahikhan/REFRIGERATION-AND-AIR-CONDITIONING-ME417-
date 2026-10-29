/**
 * ME417 Refrigeration & Air Conditioning Thermodynamic Engine
 * Contains verified thermodynamic equations, refrigerant state approximations,
 * psychrometric relations, and HVAC design algorithms.
 */

export interface RefrigerantData {
  id: string;
  name: string;
  chemicalFormula: string;
  classification: string;
  safetyGroup: string; // A1, A2L, B2, etc.
  odp: number; // Ozone Depletion Potential
  gwp: number; // Global Warming Potential
  boilingPoint1atm: number; // °C
  criticalTemp: number; // °C
  criticalPressure: number; // bar
  applications: string[];
  molarMass: number; // kg/kmol
  color: string;
}

export const REFRIGERANTS_DB: Record<string, RefrigerantData> = {
  'R-134a': {
    id: 'R-134a',
    name: 'Tetrafluoroethane (1,1,1,2-Tetrafluoroethane)',
    chemicalFormula: 'CF3CH2F',
    classification: 'HFC (Hydrofluorocarbon)',
    safetyGroup: 'A1 (Non-toxic, Non-flammable)',
    odp: 0,
    gwp: 1430,
    boilingPoint1atm: -26.1,
    criticalTemp: 101.06,
    criticalPressure: 40.59,
    applications: ['Domestic refrigerators', 'Automotive AC', 'Commercial water chillers'],
    molarMass: 102.03,
    color: '#0284c7'
  },
  'R-410A': {
    id: 'R-410A',
    name: 'Near-Azeotropic Blend (R-32/R-125 50/50%)',
    chemicalFormula: 'CH2F2 / CHF2CF3',
    classification: 'Near-Azeotropic HFC Blend',
    safetyGroup: 'A1 (Non-toxic, Non-flammable)',
    odp: 0,
    gwp: 2088,
    boilingPoint1atm: -51.6,
    criticalTemp: 72.8,
    criticalPressure: 49.2,
    applications: ['Residential & Commercial Split AC', 'VRF / Heat Pumps'],
    molarMass: 72.6,
    color: '#3b82f6'
  },
  'R-717': {
    id: 'R-717',
    name: 'Ammonia',
    chemicalFormula: 'NH3',
    classification: 'Natural Inorganic Refrigerant',
    safetyGroup: 'B2L (Toxic, Low flammability)',
    odp: 0,
    gwp: 0,
    boilingPoint1atm: -33.3,
    criticalTemp: 132.25,
    criticalPressure: 113.3,
    applications: ['Large Industrial Cold Storage', 'Ice plants', 'Food freezing plants'],
    molarMass: 17.03,
    color: '#10b981'
  },
  'R-290': {
    id: 'R-290',
    name: 'Propane',
    chemicalFormula: 'C3H8',
    classification: 'Natural Hydrocarbon (HC)',
    safetyGroup: 'A3 (Non-toxic, Highly flammable)',
    odp: 0,
    gwp: 3,
    boilingPoint1atm: -42.1,
    criticalTemp: 96.7,
    criticalPressure: 42.5,
    applications: ['Small self-contained commercial refrigeration', 'Heat pumps', 'Portable AC'],
    molarMass: 44.1,
    color: '#f59e0b'
  },
  'R-22': {
    id: 'R-22',
    name: 'Chlorodifluoromethane',
    chemicalFormula: 'CHClF2',
    classification: 'HCFC (Phase-out Montreal Protocol)',
    safetyGroup: 'A1 (Non-toxic, Non-flammable)',
    odp: 0.055,
    gwp: 1810,
    boilingPoint1atm: -40.8,
    criticalTemp: 96.2,
    criticalPressure: 49.9,
    applications: ['Legacy residential AC', 'Legacy cold storage (phasing out)'],
    molarMass: 86.47,
    color: '#ef4444'
  },
  'R-744': {
    id: 'R-744',
    name: 'Carbon Dioxide',
    chemicalFormula: 'CO2',
    classification: 'Natural Inorganic (Transcritical)',
    safetyGroup: 'A1 (Non-toxic, Non-flammable)',
    odp: 0,
    gwp: 1,
    boilingPoint1atm: -78.5, // Sublimation
    criticalTemp: 31.1,
    criticalPressure: 73.8,
    applications: ['Supermarket cascade low-temp refrigeration', 'Dry ice manufacturing', 'Heat pump water heaters'],
    molarMass: 44.01,
    color: '#8b5cf6'
  }
};

/**
 * Reversed Carnot & Carnot Cycle calculations
 */
export function calculateReversedCarnot(T_evap_C: number, T_cond_C: number, coolingLoad_kW: number = 3.517) {
  const T_L = T_evap_C + 273.15; // Kelvin
  const T_H = T_cond_C + 273.15; // Kelvin

  if (T_H <= T_L) {
    throw new Error('Condenser temperature must be strictly greater than evaporator temperature.');
  }

  const copRef = T_L / (T_H - T_L);
  const copHP = T_H / (T_H - T_L);
  const workInput_kW = coolingLoad_kW / copRef;
  const heatRejected_kW = coolingLoad_kW + workInput_kW;
  const carnotEfficiency = (T_H - T_L) / T_H;

  return {
    T_L,
    T_H,
    copRef,
    copHP,
    workInput_kW,
    heatRejected_kW,
    coolingLoad_kW,
    coolingLoad_TR: coolingLoad_kW / 3.51685,
    carnotEfficiency
  };
}

/**
 * Saturation pressure estimation for R-134a (Antoine / Martin-Hou formulation in bar)
 * Temperature in °C, returns Pressure in bar
 */
export function getSatPressureR134a(T_C: number): number {
  // Good approximation from -40°C to 70°C for R-134a
  const T_K = T_C + 273.15;
  // Wagner-type equation simplified
  const p = Math.exp(10.158 - (2150.8 / (T_K - 32.1)));
  return Math.max(0.2, Math.min(35, p));
}

/**
 * Approximate saturated liquid and vapor enthalpy for R-134a (kJ/kg)
 */
export function getR134aEnthalpies(T_C: number) {
  // At 0°C, h_f ~ 200 kJ/kg, h_g ~ 398.6 kJ/kg
  const h_f = 200 + 1.42 * T_C + 0.0018 * T_C * T_C;
  const h_g = 398.6 + 0.58 * T_C - 0.0016 * T_C * T_C;
  return {
    h_f,
    h_g,
    h_fg: h_g - h_f
  };
}

/**
 * Volumetric Efficiency of Reciprocating Compressor
 * eta_v = 1 + C - C * (P_cond / P_evap)^(1/n)
 */
export function calculateVolumetricEfficiency(
  clearanceRatio: number, // e.g. 0.05 (5%)
  pressureRatio: number, // P_cond / P_evap
  polytropicIndex: number = 1.25
): number {
  if (pressureRatio <= 0 || clearanceRatio < 0) return 0;
  const eta_v = 1 + clearanceRatio - clearanceRatio * Math.pow(pressureRatio, 1 / polytropicIndex);
  return Math.max(0, Math.min(1, eta_v));
}

/**
 * VCRS Thermodynamic Cycle Analysis
 */
export interface VCRSInputs {
  refrigerant: string;
  T_evap_C: number;
  T_cond_C: number;
  superheat_K: number;
  subcooling_K: number;
  compressorIsentropicEfficiency: number; // 0.6 - 0.95
  clearanceRatio: number; // 0.02 - 0.08
  coolingCapacity_TR: number; // e.g. 1 TR = 3.517 kW
}

export interface VCRSResults {
  P_evap_bar: number;
  P_cond_bar: number;
  pressureRatio: number;
  // State 1: Compressor suction (superheated)
  T1_C: number;
  h1: number; // kJ/kg
  // State 2: Compressor discharge
  h2s: number; // isentropic
  h2: number; // actual
  T2_C: number;
  // State 3: Condenser outlet (subcooled)
  T3_C: number;
  h3: number;
  // State 4: Evaporator inlet
  h4: number;
  vaporQuality4: number;
  // Performance
  refrigeratingEffect_kJ_kg: number;
  workCompression_kJ_kg: number;
  heatRejected_kJ_kg: number;
  theoreticalCOP: number;
  actualCOP: number;
  carnotCOP: number;
  secondLawEfficiency: number;
  massFlowRate_kg_s: number;
  compressorPower_kW: number;
  volumetricEfficiency: number;
}

export function analyzeVCRSCycle(inputs: VCRSInputs): VCRSResults {
  const {
    T_evap_C,
    T_cond_C,
    superheat_K,
    subcooling_K,
    compressorIsentropicEfficiency,
    clearanceRatio,
    coolingCapacity_TR
  } = inputs;

  const P_evap_bar = getSatPressureR134a(T_evap_C);
  const P_cond_bar = getSatPressureR134a(T_cond_C);
  const pressureRatio = P_cond_bar / P_evap_bar;

  const evapSat = getR134aEnthalpies(T_evap_C);
  const condSat = getR134aEnthalpies(T_cond_C);

  // Vapor specific heat at suction ~ 0.95 kJ/kg.K
  const c_pv = 0.96;
  // Liquid specific heat ~ 1.45 kJ/kg.K
  const c_pl = 1.44;

  // State 1: Suction
  const T1_C = T_evap_C + superheat_K;
  const h1 = evapSat.h_g + c_pv * superheat_K;

  // State 2s: Isentropic discharge approximation
  // For ideal gas / vapor compression: delta_h_s ~ w_s
  // Polytropic work approx: (gamma/(gamma-1))*P1*v1 * [(P2/P1)^((gamma-1)/gamma) - 1]
  const gamma = 1.18;
  const isentropicFactor = Math.pow(pressureRatio, (gamma - 1) / gamma) - 1;
  const delta_h_s = 65 * (pressureRatio / 4) * 0.85 + 20 * isentropicFactor;
  const h2s = h1 + Math.max(15, delta_h_s);

  // State 2: Actual discharge
  const actualWork = (h2s - h1) / compressorIsentropicEfficiency;
  const h2 = h1 + actualWork;
  const T2_C = T_cond_C + (h2 - condSat.h_g) / 1.15; // superheated discharge temp

  // State 3: Condenser exit (subcooled)
  const T3_C = T_cond_C - subcooling_K;
  const h3 = condSat.h_f - c_pl * subcooling_K;

  // State 4: Isenthalpic throttling
  const h4 = h3;
  const vaporQuality4 = Math.max(0, Math.min(1, (h4 - evapSat.h_f) / evapSat.h_fg));

  // Refrigerating effect and capacities
  const refrigeratingEffect_kJ_kg = h1 - h4;
  const workCompression_kJ_kg = h2 - h1;
  const heatRejected_kJ_kg = h2 - h3;

  const theoreticalCOP = refrigeratingEffect_kJ_kg / (h2s - h1);
  const actualCOP = refrigeratingEffect_kJ_kg / workCompression_kJ_kg;
  const carnot = calculateReversedCarnot(T_evap_C, T_cond_C, 1);
  const carnotCOP = carnot.copRef;
  const secondLawEfficiency = actualCOP / carnotCOP;

  const capacity_kW = coolingCapacity_TR * 3.51685;
  const massFlowRate_kg_s = capacity_kW / refrigeratingEffect_kJ_kg;
  const compressorPower_kW = massFlowRate_kg_s * workCompression_kJ_kg;

  const volumetricEfficiency = calculateVolumetricEfficiency(clearanceRatio, pressureRatio, 1.25);

  return {
    P_evap_bar,
    P_cond_bar,
    pressureRatio,
    T1_C,
    h1,
    h2s,
    h2,
    T2_C,
    T3_C,
    h3,
    h4,
    vaporQuality4,
    refrigeratingEffect_kJ_kg,
    workCompression_kJ_kg,
    heatRejected_kJ_kg,
    theoreticalCOP,
    actualCOP,
    carnotCOP,
    secondLawEfficiency,
    massFlowRate_kg_s,
    compressorPower_kW,
    volumetricEfficiency
  };
}

/**
 * Multi-Stage Intermediate Pressure Optimization
 * P_i = sqrt(P_e * P_c)
 */
export function calculateMultiStageOptimum(P_evap_bar: number, P_cond_bar: number) {
  const P_intermediate_bar = Math.sqrt(P_evap_bar * P_cond_bar);
  const stage1Ratio = P_intermediate_bar / P_evap_bar;
  const stage2Ratio = P_cond_bar / P_intermediate_bar;
  const singleStageRatio = P_cond_bar / P_evap_bar;

  // Theoretical work reduction with perfect intercooling:
  // W_single ~ 1 * (r^m - 1), W_2stage ~ 2 * ((sqrt(r))^m - 1)
  const m = (1.25 - 1) / 1.25;
  const wSingleNorm = Math.pow(singleStageRatio, m) - 1;
  const w2StageNorm = 2 * (Math.pow(stage1Ratio, m) - 1);
  const workSavingsPercent = Math.max(0, ((wSingleNorm - w2StageNorm) / wSingleNorm) * 100);

  return {
    P_intermediate_bar,
    stage1Ratio,
    stage2Ratio,
    singleStageRatio,
    workSavingsPercent
  };
}

/**
 * Vapor Absorption Refrigeration (VARS) COP
 * COP = (T_E / T_G) * ((T_G - T_C) / (T_C - T_E))
 */
export function calculateVARS_COP(T_evap_C: number, T_cond_absorber_C: number, T_generator_C: number): number {
  const T_E = T_evap_C + 273.15;
  const T_C = T_cond_absorber_C + 273.15;
  const T_G = T_generator_C + 273.15;

  if (T_G <= T_C || T_C <= T_E) {
    return 0;
  }

  const carnotRef = T_E / (T_C - T_E);
  const carnotEngine = (T_G - T_C) / T_G;
  return carnotRef * carnotEngine;
}

/**
 * Refrigerant Designation Decoder (ASHRAE Standard 34)
 * R-XYZ:
 * X = Number of carbon atoms - 1 (omitted if zero)
 * Y = Number of hydrogen atoms + 1
 * Z = Number of fluorine atoms
 * Inorganic: R-700 + molecular weight (e.g., NH3: 700 + 17 = R-717, H2O: 700 + 18 = R-718, CO2: 700 + 44 = R-744)
 */
export function decodeRefrigerantNumber(code: string): {
  type: string;
  carbon?: number;
  hydrogen?: number;
  fluorine?: number;
  chlorine?: number;
  molarMass?: number;
  notes: string;
} {
  const clean = code.trim().toUpperCase().replace(/^R-?/, '');

  // Check 700 series inorganic
  if (/^7\d{2}$/.test(clean)) {
    const mw = parseInt(clean.substring(1), 10);
    let name = 'Inorganic Compound';
    if (mw === 17) name = 'Ammonia (NH3)';
    if (mw === 18) name = 'Water (H2O)';
    if (mw === 44) name = 'Carbon Dioxide (CO2)';
    if (mw === 29) name = 'Air';
    if (mw === 28) name = 'Nitrogen (N2)';
    return {
      type: '700 Series (Inorganic)',
      molarMass: mw,
      notes: `${name} with molecular weight = ${mw} g/mol.`
    };
  }

  // Check 500 series (Azeotropes)
  if (/^5\d{2}/.test(clean)) {
    return {
      type: '500 Series (Azeotropic Blend)',
      notes: 'Constant boiling mixture that behaves as a pure substance without temperature glide during phase change.'
    };
  }

  // Check 400 series (Zeotropes)
  if (/^4\d{2}/.test(clean)) {
    return {
      type: '400 Series (Zeotropic Blend)',
      notes: 'Non-azeotropic mixture exhibiting temperature glide during evaporation and condensation.'
    };
  }

  // Halocarbon series: 2 or 3 digits
  const num = parseInt(clean.replace(/[A-Z]/g, ''), 10);
  if (!isNaN(num)) {
    let x = 0, y = 0, z = 0;
    if (clean.length === 2 || num < 100) {
      // 2 digits: X = 0 (1 Carbon)
      x = 0;
      y = Math.floor(num / 10);
      z = num % 10;
    } else {
      // 3 digits
      x = Math.floor(num / 100);
      y = Math.floor((num % 100) / 10);
      z = num % 10;
    }

    const c = x + 1;
    const h = y - 1;
    const f = z;
    const maxValence = 2 * c + 2;
    const cl = Math.max(0, maxValence - h - f);

    return {
      type: cl > 0 ? (h > 0 ? 'HCFC' : 'CFC') : (h > 0 ? 'HFC' : 'FC / Hydrocarbon'),
      carbon: c,
      hydrogen: h,
      fluorine: f,
      chlorine: cl,
      notes: `Formula: C${c > 1 ? c : ''}H${h > 0 ? (h > 1 ? h : '') : ''}Cl${cl > 0 ? (cl > 1 ? cl : '') : ''}F${f > 0 ? (f > 1 ? f : '') : ''}`
    };
  }

  return {
    type: 'Unknown / Custom',
    notes: 'Please enter a valid ASHRAE refrigerant number like R-134a, R-22, R-717, R-410A.'
  };
}

/**
 * PSYCHROMETRIC ENGINE
 * Formulations based on ASHRAE Fundamentals at 101.325 kPa standard sea-level barometric pressure.
 */
export const P_ATM = 101.325; // kPa

/**
 * Saturation vapor pressure of water over liquid in kPa (Magnus-Tetens formula)
 */
export function getSatVaporPressure_kPa(T_db_C: number): number {
  if (T_db_C >= 0) {
    return 0.61078 * Math.exp((17.27 * T_db_C) / (T_db_C + 237.3));
  } else {
    // Over ice
    return 0.61078 * Math.exp((21.875 * T_db_C) / (T_db_C + 265.5));
  }
}

/**
 * Full Psychrometric State calculation given Dry Bulb Temperature (°C) and Relative Humidity (%)
 */
export interface PsychrometricState {
  T_db_C: number;
  RH_percent: number; // 0 - 100
  P_v_kPa: number;
  P_vs_kPa: number;
  humidityRatio_g_kg: number; // grams of water vapor per kg dry air
  humidityRatio_kg_kg: number;
  dewPoint_C: number;
  wetBulb_C: number;
  enthalpy_kJ_kg: number;
  specificVolume_m3_kg: number;
}

export function calculatePsychrometricState(T_db_C: number, RH_percent: number): PsychrometricState {
  const phi = Math.max(0.01, Math.min(100, RH_percent)) / 100;
  const P_vs_kPa = getSatVaporPressure_kPa(T_db_C);
  const P_v_kPa = phi * P_vs_kPa;

  // Specific humidity W = 0.622 * Pv / (Patm - Pv)
  const W_kg_kg = (0.622 * P_v_kPa) / (P_ATM - P_v_kPa);
  const humidityRatio_g_kg = W_kg_kg * 1000;

  // Dew point temperature: inverse of Magnus
  const alpha = Math.log(P_v_kPa / 0.61078);
  const dewPoint_C = (237.3 * alpha) / (17.27 - alpha);

  // Wet bulb approximation (Stull formula 2011)
  const T = T_db_C;
  const rh = RH_percent;
  const wetBulb_C =
    T * Math.atan(0.151977 * Math.pow(rh + 8.313659, 0.5)) +
    Math.atan(T + rh) -
    Math.atan(rh - 1.676331) +
    0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) -
    4.686035;

  // Enthalpy h = 1.006 * T_db + W * (2501 + 1.86 * T_db) in kJ/kg
  const enthalpy_kJ_kg = 1.006 * T_db_C + W_kg_kg * (2501 + 1.86 * T_db_C);

  // Specific volume v = Ra * T_K / (Patm - Pv)
  const T_K = T_db_C + 273.15;
  const specificVolume_m3_kg = (0.28705 * T_K) / (P_ATM - P_v_kPa);

  return {
    T_db_C,
    RH_percent,
    P_v_kPa,
    P_vs_kPa,
    humidityRatio_g_kg,
    humidityRatio_kg_kg: W_kg_kg,
    dewPoint_C,
    wetBulb_C,
    enthalpy_kJ_kg,
    specificVolume_m3_kg
  };
}

/**
 * Mixing of two air streams
 */
export function mixAirStreams(
  state1: PsychrometricState,
  flowRate1_m3_s: number,
  state2: PsychrometricState,
  flowRate2_m3_s: number
): PsychrometricState {
  const m1 = flowRate1_m3_s / state1.specificVolume_m3_kg;
  const m2 = flowRate2_m3_s / state2.specificVolume_m3_kg;
  const m_total = m1 + m2;

  if (m_total <= 0) return state1;

  const T_db_mix = (m1 * state1.T_db_C + m2 * state2.T_db_C) / m_total;
  const W_mix = (m1 * state1.humidityRatio_kg_kg + m2 * state2.humidityRatio_kg_kg) / m_total;

  // Derive RH from W_mix and T_db_mix
  const P_v_mix = (W_mix * P_ATM) / (0.622 + W_mix);
  const P_vs_mix = getSatVaporPressure_kPa(T_db_mix);
  const RH_mix = Math.min(100, Math.max(1, (P_v_mix / P_vs_mix) * 100));

  return calculatePsychrometricState(T_db_mix, RH_mix);
}

/**
 * Cooling and Dehumidification Coil Analysis (ADP and Bypass Factor)
 */
export function analyzeCoolingCoil(
  inletState: PsychrometricState,
  apparatusDewPoint_C: number,
  bypassFactor: number // 0.05 - 0.25
) {
  const adpState = calculatePsychrometricState(apparatusDewPoint_C, 100);

  const T_db_out = apparatusDewPoint_C + bypassFactor * (inletState.T_db_C - apparatusDewPoint_C);
  const W_out = adpState.humidityRatio_kg_kg + bypassFactor * (inletState.humidityRatio_kg_kg - adpState.humidityRatio_kg_kg);

  // Derive RH out
  const P_v_out = (W_out * P_ATM) / (0.622 + W_out);
  const P_vs_out = getSatVaporPressure_kPa(T_db_out);
  const RH_out = Math.min(100, Math.max(1, (P_v_out / P_vs_out) * 100));

  const exitState = calculatePsychrometricState(T_db_out, RH_out);

  // Sensible and latent heat ratios
  const deltaH = inletState.enthalpy_kJ_kg - exitState.enthalpy_kJ_kg;
  const deltaW = inletState.humidityRatio_kg_kg - exitState.humidityRatio_kg_kg;
  const sensibleLoad = 1.006 * (inletState.T_db_C - exitState.T_db_C);
  const latentLoad = deltaW * 2501;
  const shf = sensibleLoad / Math.max(0.001, sensibleLoad + latentLoad);

  return {
    inletState,
    adpState,
    exitState,
    deltaH,
    deltaW_g_kg: deltaW * 1000,
    sensibleHeatFactor: Math.max(0, Math.min(1, shf)),
    coilEfficiency: 1 - bypassFactor
  };
}

/**
 * Equivalent diameter for rectangular duct
 * Huebscher formula: D_eq = 1.30 * (a * b)^0.625 / (a + b)^0.25
 * Dimensions in mm
 */
export function calculateEquivalentDuctDiameter(width_mm: number, height_mm: number): number {
  if (width_mm <= 0 || height_mm <= 0) return 0;
  const num = Math.pow(width_mm * height_mm, 0.625);
  const den = Math.pow(width_mm + height_mm, 0.25);
  return 1.30 * (num / den);
}

/**
 * Air Conditioning Load Sheet Calculation
 */
export interface LoadSheetInputs {
  roomArea_m2: number;
  ceilingHeight_m: number;
  numberOfOccupants: number;
  lightingPowerDensity_W_m2: number;
  equipmentPower_W: number;
  solarHeatGain_W: number;
  wallHeatTransmission_W: number;
  outdoorTemp_C: number;
  outdoorRH_percent: number;
  indoorTemp_C: number;
  indoorRH_percent: number;
  ventilationRate_L_s_per_person: number;
  airChangesPerHourInfiltration: number;
}

export function calculateSpaceCoolingLoad(inputs: LoadSheetInputs) {
  const indoor = calculatePsychrometricState(inputs.indoorTemp_C, inputs.indoorRH_percent);
  const outdoor = calculatePsychrometricState(inputs.outdoorTemp_C, inputs.outdoorRH_percent);

  // Internal sensible
  const occupantsSensible = inputs.numberOfOccupants * 75; // 75 W per sedentary person
  const occupantsLatent = inputs.numberOfOccupants * 55; // 55 W latent per person
  const lightingSensible = inputs.roomArea_m2 * inputs.lightingPowerDensity_W_m2;
  const equipmentSensible = inputs.equipmentPower_W;

  // Building fabric sensible
  const fabricSensible = inputs.solarHeatGain_W + inputs.wallHeatTransmission_W;

  // Ventilation and infiltration flow rates
  const roomVolume_m3 = inputs.roomArea_m2 * inputs.ceilingHeight_m;
  const infRate_m3_s = (inputs.airChangesPerHourInfiltration * roomVolume_m3) / 3600;
  const ventRate_m3_s = (inputs.numberOfOccupants * inputs.ventilationRate_L_s_per_person) / 1000;
  const freshAir_m3_s = infRate_m3_s + ventRate_m3_s;

  // Fresh air loads (air density ~ 1.2 kg/m3)
  const freshAirMass_kg_s = freshAir_m3_s * 1.2;
  const freshAirSensible_W = freshAirMass_kg_s * 1006 * (outdoor.T_db_C - indoor.T_db_C);
  const freshAirLatent_W = freshAirMass_kg_s * 2501000 * Math.max(0, outdoor.humidityRatio_kg_kg - indoor.humidityRatio_kg_kg);

  // Totals
  const roomSensibleHeat_W = fabricSensible + occupantsSensible + lightingSensible + equipmentSensible;
  const roomLatentHeat_W = occupantsLatent;
  const roomSensibleHeatFactor = roomSensibleHeat_W / Math.max(1, roomSensibleHeat_W + roomLatentHeat_W);

  const grandTotalSensible_W = roomSensibleHeat_W + freshAirSensible_W;
  const grandTotalLatent_W = roomLatentHeat_W + freshAirLatent_W;
  const grandTotalHeat_W = grandTotalSensible_W + grandTotalLatent_W;

  const totalCapacity_TR = grandTotalHeat_W / 3516.85;

  // Dehumidified air supply flow rate required
  // Supply air temp is typically roomTemp - 10°C
  const deltaT_supply = 10;
  const supplyAirFlow_m3_s = roomSensibleHeat_W / (1.2 * 1006 * deltaT_supply);
  const supplyAirFlow_CFM = supplyAirFlow_m3_s * 2118.88;

  return {
    indoor,
    outdoor,
    roomSensibleHeat_W,
    roomLatentHeat_W,
    roomSensibleHeatFactor,
    freshAirSensible_W,
    freshAirLatent_W,
    grandTotalSensible_W,
    grandTotalLatent_W,
    grandTotalHeat_W,
    totalCapacity_TR,
    supplyAirFlow_m3_s,
    supplyAirFlow_CFM
  };
}
