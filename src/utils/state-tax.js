/**
 * state-tax.js — 주세 계산 순수 함수
 * 출처: src/data/state-tax-2024.js 각 주 주석 참조
 */
import { STATE_TAX_2024 } from '../data/state-tax-2024.js';
import { applyBrackets } from './federal-tax.js';

/**
 * 주세 계산
 * @param {number} grossCents - 총 급여 (센트)
 * @param {string} stateCode - 'CA'|'NY'|'TX' 등
 * @param {string} filingStatus - 'single'|'mfj'|'mfs'|'hoh'
 * @param {number} preTaxDeductionsCents - 세전 공제 합계 (센트)
 * @returns {{
 *   stateTaxCents: number,
 *   effectiveRate: number,
 *   stateCode: string,
 *   stateName: string,
 *   hasStateTax: boolean
 * }}
 */
export function calcStateTax(grossCents, stateCode, filingStatus, preTaxDeductionsCents = 0) {
  const state = STATE_TAX_2024[stateCode];
  const stateName = state?.name ?? stateCode;

  if (!state || state.type === 'none') {
    return { stateTaxCents: 0, effectiveRate: 0, stateCode, stateName, hasStateTax: false };
  }

  const agiCents = Math.max(0, grossCents - preTaxDeductionsCents);

  if (state.type === 'flat') {
    const stateTaxCents = Math.round(agiCents * state.rate);
    const effectiveRate = grossCents > 0 ? stateTaxCents / grossCents : 0;
    return { stateTaxCents, effectiveRate, stateCode, stateName, hasStateTax: true };
  }

  // Progressive
  const status = filingStatus in (state.brackets ?? {}) ? filingStatus
    : ('single' in (state.brackets ?? {})) ? 'single' : null;

  if (!status) {
    return { stateTaxCents: 0, effectiveRate: 0, stateCode, stateName, hasStateTax: false };
  }

  const brackets = state.brackets[status];
  const stateStdDeductionDollars = state.standardDeduction?.[filingStatus] ?? 0;
  const stateStdDeductionCents = stateStdDeductionDollars * 100;
  const taxableIncomeCents = Math.max(0, agiCents - stateStdDeductionCents);

  const stateTaxCents = applyBrackets(taxableIncomeCents, brackets);
  const effectiveRate = grossCents > 0 ? stateTaxCents / grossCents : 0;

  return { stateTaxCents, effectiveRate, stateCode, stateName, hasStateTax: true };
}
