import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateReversedCarnot,
  calculateVolumetricEfficiency,
  analyzeVCRSCycle,
  calculateMultiStageOptimum,
  calculateVARS_COP,
  decodeRefrigerantNumber,
  calculatePsychrometricState,
  calculateEquivalentDuctDiameter,
  mixAirStreams
} from './thermodynamics';

test('Reversed Carnot COP calculation', () => {
  // Evaporator at -10°C (263.15 K), Condenser at 40°C (313.15 K)
  // COP_R = 263.15 / (313.15 - 263.15) = 263.15 / 50 = 5.263
  const res = calculateReversedCarnot(-10, 40, 3.517);
  assert.ok(Math.abs(res.copRef - 5.263) < 0.05);
  assert.ok(Math.abs(res.copHP - (res.copRef + 1)) < 0.001);
  assert.ok(res.workInput_kW > 0);
  assert.ok(res.heatRejected_kW > res.coolingLoad_kW);
});

test('Compressor volumetric efficiency calculation', () => {
  // clearance 0.05, pressure ratio 4, n=1.25
  // eta_v = 1 + 0.05 - 0.05 * 4^(1/1.25) = 1.05 - 0.05 * 3.0314 = 1.05 - 0.1515 = 0.898
  const eta = calculateVolumetricEfficiency(0.05, 4, 1.25);
  assert.ok(eta > 0.85 && eta < 0.95);
});

test('VCRS cycle thermodynamic analysis', () => {
  const result = analyzeVCRSCycle({
    refrigerant: 'R-134a',
    T_evap_C: 0,
    T_cond_C: 40,
    superheat_K: 5,
    subcooling_K: 5,
    compressorIsentropicEfficiency: 0.8,
    clearanceRatio: 0.04,
    coolingCapacity_TR: 2
  });

  assert.ok(result.actualCOP > 1.5 && result.actualCOP < 7.0);
  assert.ok(result.refrigeratingEffect_kJ_kg > 100);
  assert.ok(result.workCompression_kJ_kg > 15);
  assert.ok(result.volumetricEfficiency > 0.7);
  assert.ok(result.pressureRatio > 1.5);
});

test('Multi-stage intermediate pressure optimization', () => {
  // P_e = 2 bar, P_c = 18 bar -> P_i = sqrt(36) = 6 bar
  const res = calculateMultiStageOptimum(2, 18);
  assert.equal(Math.round(res.P_intermediate_bar), 6);
  assert.equal(res.stage1Ratio, 3);
  assert.equal(res.stage2Ratio, 3);
  assert.ok(res.workSavingsPercent > 5);
});

test('VARS COP estimation', () => {
  // T_E = 5°C (278.15 K), T_C = 35°C (308.15 K), T_G = 90°C (363.15 K)
  // COP_carnot = (278.15 / 30) * ((363.15 - 308.15) / 363.15) = 9.27 * (55 / 363.15) = 1.404
  const cop = calculateVARS_COP(5, 35, 90);
  assert.ok(cop > 1.2 && cop < 1.6);
});

test('Refrigerant decoder parses halocarbons and inorganics', () => {
  const r134a = decodeRefrigerantNumber('R-134a');
  assert.equal(r134a.carbon, 2);
  assert.equal(r134a.hydrogen, 2);
  assert.equal(r134a.fluorine, 4);
  assert.equal(r134a.chlorine, 0);

  const r717 = decodeRefrigerantNumber('R-717');
  assert.equal(r717.type, '700 Series (Inorganic)');
  assert.equal(r717.molarMass, 17);
});

test('Psychrometric state computation', () => {
  // Standard comfort condition: 25°C, 50% RH
  const state = calculatePsychrometricState(25, 50);
  assert.ok(state.humidityRatio_g_kg > 8 && state.humidityRatio_g_kg < 12);
  assert.ok(state.dewPoint_C > 12 && state.dewPoint_C < 16);
  assert.ok(state.wetBulb_C > 16 && state.wetBulb_C < 19);
  assert.ok(state.enthalpy_kJ_kg > 45 && state.enthalpy_kJ_kg < 55);
});

test('Equivalent duct diameter calculation', () => {
  // Rectangular duct 400mm x 250mm
  const deq = calculateEquivalentDuctDiameter(400, 250);
  assert.ok(deq > 300 && deq < 360);
});

test('Psychrometric air mixing', () => {
  const state1 = calculatePsychrometricState(35, 40); // Outdoor
  const state2 = calculatePsychrometricState(25, 50); // Recirculated
  const mix = mixAirStreams(state1, 0.2, state2, 0.8);
  assert.ok(mix.T_db_C > 25 && mix.T_db_C < 35);
});
