import {
  interpolatePercentile,
  calcUSPercentile,
  calcGlobalPercentile,
  calcIncomePercentiles,
} from '../../src/utils/percentile.js';
import { US_INCOME_PERCENTILES } from '../../src/data/income-percentiles-us.js';
import { GLOBAL_INCOME_PERCENTILES } from '../../src/data/income-percentiles-global.js';

// ── interpolatePercentile ─────────────────────────────────────────────────

describe('interpolatePercentile — 경계값', () => {
  test('0 소득 → 0%', () => {
    expect(interpolatePercentile(0, US_INCOME_PERCENTILES)).toBe(0);
  });
  test('음수 소득 → 0%', () => {
    expect(interpolatePercentile(-1000, US_INCOME_PERCENTILES)).toBe(0);
  });
  test('테이블 최고값 초과 → 테이블 최고 percentile 반환', () => {
    const result = interpolatePercentile(999_999_999, US_INCOME_PERCENTILES);
    const maxPct = US_INCOME_PERCENTILES[US_INCOME_PERCENTILES.length - 1][1];
    expect(result).toBe(maxPct);
  });
});

describe('interpolatePercentile — US 알려진 구간 점검', () => {
  test('$46,000 (중간값) → ~50%', () => {
    const pct = interpolatePercentile(46_000, US_INCOME_PERCENTILES);
    expect(pct).toBeGreaterThanOrEqual(49);
    expect(pct).toBeLessThanOrEqual(51);
  });
  test('$141,000 (top 10%) → ~85%', () => {
    const pct = interpolatePercentile(141_000, US_INCOME_PERCENTILES);
    expect(pct).toBeGreaterThanOrEqual(84);
    expect(pct).toBeLessThanOrEqual(86);
  });
  test('$548,000 (top 1%) → ~99%', () => {
    const pct = interpolatePercentile(548_000, US_INCOME_PERCENTILES);
    expect(pct).toBeGreaterThanOrEqual(98.5);
    expect(pct).toBeLessThanOrEqual(99.5);
  });
  test('단조증가: 소득이 높을수록 분위도 높음', () => {
    const p1 = interpolatePercentile(50_000,  US_INCOME_PERCENTILES);
    const p2 = interpolatePercentile(100_000, US_INCOME_PERCENTILES);
    const p3 = interpolatePercentile(200_000, US_INCOME_PERCENTILES);
    expect(p1).toBeLessThan(p2);
    expect(p2).toBeLessThan(p3);
  });
});

// ── calcUSPercentile ──────────────────────────────────────────────────────

describe('calcUSPercentile', () => {
  test('반환 구조 확인', () => {
    const r = calcUSPercentile(80_000);
    expect(r).toHaveProperty('percentile');
    expect(r).toHaveProperty('beatPercent');
    expect(r).toHaveProperty('label');
    expect(r).toHaveProperty('emoji');
  });
  test('$400,000 → top 5% 라벨', () => {
    const { label } = calcUSPercentile(400_000);
    expect(label).toMatch(/top 5%/i);
  });
  test('$548,000 → top 1% 라벨', () => {
    const { label } = calcUSPercentile(548_000);
    expect(label).toMatch(/top 1%/i);
  });
  test('$40,000 → beatPercent < 50', () => {
    const { beatPercent } = calcUSPercentile(40_000);
    expect(beatPercent).toBeLessThan(50);
  });
  test('$60,000 → beatPercent > 50', () => {
    const { beatPercent } = calcUSPercentile(60_000);
    expect(beatPercent).toBeGreaterThan(50);
  });
});

// ── calcGlobalPercentile ──────────────────────────────────────────────────

describe('calcGlobalPercentile', () => {
  test('반환 구조 확인', () => {
    const r = calcGlobalPercentile(50_000);
    expect(r).toHaveProperty('percentile');
    expect(r).toHaveProperty('beatPercent');
    expect(r).toHaveProperty('label');
    expect(r).toHaveProperty('emoji');
    expect(r).toHaveProperty('context');
    expect(r).toHaveProperty('funFact');
  });
  test('전세계 중간값($1,900) → 약 50%', () => {
    const { beatPercent } = calcGlobalPercentile(1_900);
    expect(beatPercent).toBeGreaterThanOrEqual(48);
    expect(beatPercent).toBeLessThanOrEqual(52);
  });
  test('$14,500 (global top 10%) → ~90%', () => {
    const { beatPercent } = calcGlobalPercentile(14_500);
    expect(beatPercent).toBeGreaterThanOrEqual(88);
    expect(beatPercent).toBeLessThanOrEqual(92);
  });
  test('미국 평균 연봉 $60,000 → global top 1%', () => {
    const { label } = calcGlobalPercentile(60_000);
    expect(label).toMatch(/top 1%/i);
  });
  test('미국 최저임금 수준 $15,000 → global top 10% 이상', () => {
    const { beatPercent } = calcGlobalPercentile(15_000);
    expect(beatPercent).toBeGreaterThanOrEqual(88);
  });
  test('funFact은 빈 문자열이 아님', () => {
    const { funFact } = calcGlobalPercentile(50_000);
    expect(funFact.length).toBeGreaterThan(10);
  });
});

// ── calcIncomePercentiles ─────────────────────────────────────────────────

describe('calcIncomePercentiles — 통합', () => {
  test('us, global 두 결과 모두 반환', () => {
    const r = calcIncomePercentiles(100_000);
    expect(r).toHaveProperty('us');
    expect(r).toHaveProperty('global');
  });
  test('US 분위 < 전세계 분위 (같은 소득 기준, US는 경쟁 심함)', () => {
    // $100k는 미국에서 ~76%, 전세계에서 ~99%
    const { us, global } = calcIncomePercentiles(100_000);
    expect(global.beatPercent).toBeGreaterThan(us.beatPercent);
  });
  test('0 소득 → 두 결과 모두 0%', () => {
    const { us, global } = calcIncomePercentiles(0);
    expect(us.beatPercent).toBe(0);
    expect(global.beatPercent).toBe(0);
  });
});
