/**
 * deductions.js — 세전 공제 계산 순수 함수
 * 출처: https://www.irs.gov/retirement-plans/401k-plan-contribution-limits
 */

/** 2024 공제 한도 (달러) */
export const DEDUCTION_LIMITS_2024 = {
  '401k_under50':  23_000,
  '401k_over50':   30_500,
  'ira_under50':   7_000,
  'ira_over50':    8_000,
  'hsa_individual': 4_150,
  'hsa_family':    8_300,
  'fsa':           3_200,
};

/**
 * 세전 공제 합계 계산
 * @param {{
 *   k401Cents: number,
 *   iraCents: number,
 *   hsaCents: number,
 *   fsaCents: number,
 *   healthInsuranceCents: number
 * }} deductions
 * @returns {{ totalCents: number, items: Array<{label: string, amountCents: number}> }}
 */
export function calcPreTaxDeductions(deductions) {
  const {
    k401Cents = 0,
    iraCents = 0,
    hsaCents = 0,
    fsaCents = 0,
    healthInsuranceCents = 0,
  } = deductions;

  const items = [
    { label: '401(k) Contribution',       amountCents: Math.max(0, k401Cents) },
    { label: 'Traditional IRA',            amountCents: Math.max(0, iraCents) },
    { label: 'HSA',                        amountCents: Math.max(0, hsaCents) },
    { label: 'FSA',                        amountCents: Math.max(0, fsaCents) },
    { label: 'Health Insurance Premium',   amountCents: Math.max(0, healthInsuranceCents) },
  ].filter(item => item.amountCents > 0);

  const totalCents = items.reduce((sum, item) => sum + item.amountCents, 0);
  return { totalCents, items };
}

/**
 * 공제 한도 초과 여부 검증
 * @param {number} k401Cents
 * @param {boolean} isOver50
 * @returns {{ valid: boolean, limitCents: number, message?: string }}
 */
export function validate401k(k401Cents, isOver50 = false) {
  const limitKey = isOver50 ? '401k_over50' : '401k_under50';
  const limitCents = DEDUCTION_LIMITS_2024[limitKey] * 100;
  if (k401Cents > limitCents) {
    return {
      valid: false,
      limitCents,
      message: `401(k) contribution exceeds 2024 limit of $${DEDUCTION_LIMITS_2024[limitKey].toLocaleString()}`,
    };
  }
  return { valid: true, limitCents };
}
