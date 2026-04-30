/**
 * fica.js — FICA 세금 계산 순수 함수
 * 출처: https://www.irs.gov/taxtopics/tc751
 */
import { FICA_2024 } from '../data/fica-2024.js';

/**
 * FICA 세금 계산 (Social Security + Medicare)
 * @param {number} grossCents - FICA 과세 총 급여 (센트) — pre-tax 공제 전 W-2 wages
 * @param {string} filingStatus - 'single'|'mfj'|'mfs'|'hoh'
 * @returns {{
 *   ssCents: number,
 *   medicareCents: number,
 *   additionalMedicareCents: number,
 *   totalFicaCents: number
 * }}
 */
export function calcFICA(grossCents, filingStatus) {
  if (grossCents <= 0) {
    return { ssCents: 0, medicareCents: 0, additionalMedicareCents: 0, totalFicaCents: 0 };
  }

  const { SS_RATE, SS_WAGE_BASE, MEDICARE_RATE, ADDITIONAL_MEDICARE_RATE, ADDITIONAL_MEDICARE_THRESHOLD } = FICA_2024;

  // Social Security: 6.2% up to wage base
  const ssWageBaseCents = SS_WAGE_BASE * 100;
  const ssWagesCents = Math.min(grossCents, ssWageBaseCents);
  const ssCents = Math.round(ssWagesCents * SS_RATE);

  // Medicare: 1.45% on all wages
  const medicareCents = Math.round(grossCents * MEDICARE_RATE);

  // Additional Medicare: 0.9% above threshold
  const status = filingStatus in ADDITIONAL_MEDICARE_THRESHOLD ? filingStatus : 'single';
  const thresholdCents = ADDITIONAL_MEDICARE_THRESHOLD[status] * 100;
  const additionalMedicareWagesCents = Math.max(0, grossCents - thresholdCents);
  const additionalMedicareCents = Math.round(additionalMedicareWagesCents * ADDITIONAL_MEDICARE_RATE);

  const totalFicaCents = ssCents + medicareCents + additionalMedicareCents;

  return { ssCents, medicareCents, additionalMedicareCents, totalFicaCents };
}
