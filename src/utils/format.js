/**
 * format.js — 숫자/통화 포맷 유틸리티
 */

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const usdFormatterCents = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const pctFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/**
 * 센트 → 달러 통화 문자열 ($1,234)
 * @param {number} cents
 * @returns {string}
 */
export const formatCurrency = (cents) => usdFormatter.format(cents / 100);

/**
 * 센트 → 달러 통화 문자열 (소수점 포함, $1,234.56)
 * @param {number} cents
 * @returns {string}
 */
export const formatCurrencyDetailed = (cents) => usdFormatterCents.format(cents / 100);

/**
 * 비율 → 퍼센트 문자열 (12.3%)
 * @param {number} rate - 0.0~1.0 사이 비율
 * @returns {string}
 */
export const formatPercent = (rate) => pctFormatter.format(rate);

/**
 * 달러 문자열 → 센트 정수 파싱
 * @param {string} value - "100000" 또는 "100,000" 또는 "100000.50"
 * @returns {number} 센트 (반올림)
 */
export const parseDollarsToCents = (value) => {
  const cleaned = String(value).replace(/[^0-9.]/g, '');
  const dollars = parseFloat(cleaned) || 0;
  return Math.round(dollars * 100);
};

/**
 * 연봉 → 지급 주기별 금액 계산 (센트)
 * @param {number} annualCents
 * @returns {{ annual: number, monthly: number, biweekly: number, weekly: number }}
 */
export const calcPaySchedule = (annualCents) => ({
  annual:   annualCents,
  monthly:  Math.round(annualCents / 12),
  biweekly: Math.round(annualCents / 26),
  weekly:   Math.round(annualCents / 52),
});
