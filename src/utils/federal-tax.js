/**
 * federal-tax.js — 연방 소득세 계산 순수 함수
 * 출처: https://www.irs.gov/newsroom/irs-provides-tax-inflation-adjustments-for-tax-year-2024
 */
import { FEDERAL_BRACKETS, STANDARD_DEDUCTIONS } from '../data/federal-tax-2024.js';

/**
 * 누진 세율 구간 적용 (센트 단위)
 * @param {number} incomeCents - 과세 소득 (센트, 음수면 0 처리)
 * @param {Array<{min: number, max: number|null, rate: number}>} brackets - 달러 단위 구간
 * @returns {number} 세금 (센트)
 */
export function applyBrackets(incomeCents, brackets) {
  if (incomeCents <= 0) return 0;
  const incomeDollars = incomeCents / 100;
  let taxCents = 0;

  for (const { min, max, rate } of brackets) {
    if (incomeDollars <= min) break;
    const upper = max !== null ? Math.min(incomeDollars, max) : incomeDollars;
    taxCents += Math.round((upper - min) * rate * 100);
  }
  return taxCents;
}

/**
 * 연방 소득세 계산
 * @param {number} grossCents - 총 급여 (센트)
 * @param {string} filingStatus - 'single'|'mfj'|'mfs'|'hoh'
 * @param {number} preTaxDeductionsCents - 세전 공제 합계 (센트)
 * @returns {{
 *   taxableIncomeCents: number,
 *   federalTaxCents: number,
 *   effectiveRate: number,
 *   marginalRate: number,
 *   standardDeductionCents: number
 * }}
 */
export function calcFederalTax(grossCents, filingStatus, preTaxDeductionsCents = 0) {
  const status = filingStatus in FEDERAL_BRACKETS ? filingStatus : 'single';
  const stdDeductionDollars = STANDARD_DEDUCTIONS[status] ?? STANDARD_DEDUCTIONS.single;
  const stdDeductionCents = stdDeductionDollars * 100;

  const agiCents = Math.max(0, grossCents - preTaxDeductionsCents);
  const taxableIncomeCents = Math.max(0, agiCents - stdDeductionCents);

  const brackets = FEDERAL_BRACKETS[status];
  const federalTaxCents = applyBrackets(taxableIncomeCents, brackets);

  const effectiveRate = grossCents > 0 ? federalTaxCents / grossCents : 0;
  const marginalRate = getMarginalRate(taxableIncomeCents, brackets);

  return {
    taxableIncomeCents,
    federalTaxCents,
    effectiveRate,
    marginalRate,
    standardDeductionCents: stdDeductionCents,
  };
}

/**
 * 현재 소득에 적용되는 한계세율 반환
 * @param {number} incomeCents
 * @param {Array} brackets
 * @returns {number}
 */
export function getMarginalRate(incomeCents, brackets) {
  if (incomeCents <= 0) return 0;
  const incomeDollars = incomeCents / 100;
  let marginal = 0;
  for (const { min, rate } of brackets) {
    if (incomeDollars > min) marginal = rate;
  }
  return marginal;
}
