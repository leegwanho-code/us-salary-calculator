/**
 * percentile.js — 소득 분위 계산 순수 함수
 * 선형 보간(linear interpolation)으로 분위 추정
 */
import {
  US_INCOME_PERCENTILES,
  US_PERCENTILE_LABELS,
} from '../data/income-percentiles-us.js';
import {
  GLOBAL_INCOME_PERCENTILES,
  GLOBAL_PERCENTILE_LABELS,
  GLOBAL_FUN_FACTS,
} from '../data/income-percentiles-global.js';

/**
 * 선형 보간으로 소득 → 분위 추정
 * @param {number} incomeDollars - 연간 소득 (달러)
 * @param {Array<[number, number]>} table - [income, percentile] 쌍 배열 (오름차순)
 * @returns {number} 분위 (0.0 – 100.0, 소수점 1자리)
 */
export function interpolatePercentile(incomeDollars, table) {
  if (incomeDollars <= 0) return 0;

  // 테이블 범위 초과 처리
  if (incomeDollars >= table[table.length - 1][0]) {
    return table[table.length - 1][1];
  }
  if (incomeDollars <= table[0][0]) {
    // 최솟값 미만은 0~첫 구간 사이 선형 보간
    const [minIncome, minPct] = table[0];
    return parseFloat(((incomeDollars / minIncome) * minPct).toFixed(1));
  }

  // 해당 구간 찾아 선형 보간
  for (let i = 0; i < table.length - 1; i++) {
    const [lo, pctLo] = table[i];
    const [hi, pctHi] = table[i + 1];

    if (incomeDollars >= lo && incomeDollars <= hi) {
      const ratio = (incomeDollars - lo) / (hi - lo);
      const interpolated = pctLo + ratio * (pctHi - pctLo);
      return parseFloat(interpolated.toFixed(1));
    }
  }

  return 0;
}

/**
 * 미국 내 소득 분위 계산
 * @param {number} grossAnnualDollars - 연간 총 소득 (달러)
 * @returns {{
 *   percentile: number,       // 0–100
 *   beatPercent: number,      // 이보다 적게 버는 미국인 비율 (%)
 *   label: string,
 *   emoji: string
 * }}
 */
export function calcUSPercentile(grossAnnualDollars) {
  const percentile = interpolatePercentile(grossAnnualDollars, US_INCOME_PERCENTILES);
  const beatPercent = parseFloat(percentile.toFixed(1));

  const labelEntry = US_PERCENTILE_LABELS.find(l => beatPercent >= l.minPercentile)
    ?? US_PERCENTILE_LABELS[US_PERCENTILE_LABELS.length - 1];

  return {
    percentile,
    beatPercent,
    label: labelEntry.label,
    emoji: labelEntry.emoji,
  };
}

/**
 * 전 세계 소득 분위 계산
 * @param {number} grossAnnualDollars - 연간 총 소득 (달러, 명목 USD)
 * @returns {{
 *   percentile: number,
 *   beatPercent: number,
 *   label: string,
 *   emoji: string,
 *   context: string,
 *   funFact: string
 * }}
 */
export function calcGlobalPercentile(grossAnnualDollars) {
  const percentile = interpolatePercentile(grossAnnualDollars, GLOBAL_INCOME_PERCENTILES);
  const beatPercent = parseFloat(percentile.toFixed(1));

  const labelEntry = GLOBAL_PERCENTILE_LABELS.find(l => beatPercent >= l.minPercentile)
    ?? GLOBAL_PERCENTILE_LABELS[GLOBAL_PERCENTILE_LABELS.length - 1];

  const factEntry = GLOBAL_FUN_FACTS.find(f => beatPercent >= f.minPercentile)
    ?? GLOBAL_FUN_FACTS[GLOBAL_FUN_FACTS.length - 1];

  return {
    percentile,
    beatPercent,
    label:   labelEntry.label,
    emoji:   labelEntry.emoji,
    context: labelEntry.context,
    funFact: factEntry.fact,
  };
}

/**
 * US + 전세계 분위를 한 번에 계산
 * @param {number} grossAnnualDollars
 * @returns {{ us: ReturnType<calcUSPercentile>, global: ReturnType<calcGlobalPercentile> }}
 */
export function calcIncomePercentiles(grossAnnualDollars) {
  return {
    us:     calcUSPercentile(grossAnnualDollars),
    global: calcGlobalPercentile(grossAnnualDollars),
  };
}
