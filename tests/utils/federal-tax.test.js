import { calcFederalTax, applyBrackets, getMarginalRate } from '../../src/utils/federal-tax.js';
import { FEDERAL_BRACKETS } from '../../src/data/federal-tax-2024.js';

describe('applyBrackets', () => {
  const singleBrackets = FEDERAL_BRACKETS.single;

  test('0 소득 → 0 세금', () => {
    expect(applyBrackets(0, singleBrackets)).toBe(0);
  });
  test('음수 소득 → 0 세금', () => {
    expect(applyBrackets(-100_00, singleBrackets)).toBe(0);
  });
  test('$11,600 → 10% 구간 최대: $1,160', () => {
    // $11,600 × 10% = $1,160
    expect(applyBrackets(11_600_00, singleBrackets)).toBe(1_160_00);
  });
  test('$47,150 → 10%+12% 구간: $5,426', () => {
    // 10%: $11,600 × 0.10 = $1,160
    // 12%: ($47,150 - $11,600) × 0.12 = $4,266
    // total = $5,426
    const result = applyBrackets(47_150_00, singleBrackets);
    expect(result).toBeGreaterThan(5_400_00);
    expect(result).toBeLessThan(5_450_00);
  });
});

describe('calcFederalTax', () => {
  // 샘플 케이스 A: $50,000 Single (표준공제 $14,600 적용)
  // 과세소득 = $50,000 - $14,600 = $35,400
  // 연방세 = $1,160 (10%) + ($35,400-$11,600)×12% = $1,160 + $2,856 = $4,016
  test('$50,000 Single: 과세소득 $35,400, 연방세 ~$4,016', () => {
    const { federalTaxCents, taxableIncomeCents } = calcFederalTax(50_000_00, 'single');
    expect(taxableIncomeCents).toBe(35_400_00);
    expect(federalTaxCents).toBeGreaterThan(3_900_00);
    expect(federalTaxCents).toBeLessThan(4_200_00);
  });

  // 샘플 케이스 B: $100,000 Single
  // 과세소득 = $100,000 - $14,600 = $85,400
  test('$100,000 Single: 과세소득 $85,400', () => {
    const { taxableIncomeCents, effectiveRate } = calcFederalTax(100_000_00, 'single');
    expect(taxableIncomeCents).toBe(85_400_00);
    expect(effectiveRate).toBeGreaterThan(0.12);
    expect(effectiveRate).toBeLessThan(0.18);
  });

  // MFJ: $100,000 — 표준공제 $29,200
  test('$100,000 MFJ: 과세소득 $70,800', () => {
    const { taxableIncomeCents } = calcFederalTax(100_000_00, 'mfj');
    expect(taxableIncomeCents).toBe(70_800_00);
  });

  // Pre-tax 공제 반영
  test('pre-tax 공제 $10,000 → 과세소득 감소', () => {
    const withDeduction = calcFederalTax(100_000_00, 'single', 10_000_00);
    const withoutDeduction = calcFederalTax(100_000_00, 'single', 0);
    expect(withDeduction.federalTaxCents).toBeLessThan(withoutDeduction.federalTaxCents);
    expect(withDeduction.taxableIncomeCents).toBe(withoutDeduction.taxableIncomeCents - 10_000_00);
  });

  // 유효하지 않은 filing status → single 폴백
  test('잘못된 filingStatus → single 기준 적용', () => {
    const r1 = calcFederalTax(80_000_00, 'invalid');
    const r2 = calcFederalTax(80_000_00, 'single');
    expect(r1.federalTaxCents).toBe(r2.federalTaxCents);
  });

  // 표준공제 초과 시 과세소득 0
  test('소득이 표준공제 미만 → 과세소득 0, 세금 0', () => {
    const { taxableIncomeCents, federalTaxCents } = calcFederalTax(10_000_00, 'single');
    expect(taxableIncomeCents).toBe(0);
    expect(federalTaxCents).toBe(0);
  });

  // 한계세율 확인
  test('$200,000 Single → 한계세율 24% (과세소득 $185,400)', () => {
    const { marginalRate } = calcFederalTax(200_000_00, 'single');
    expect(marginalRate).toBe(0.24);
  });
});

describe('getMarginalRate', () => {
  test('0 소득 → 0%', () => {
    expect(getMarginalRate(0, FEDERAL_BRACKETS.single)).toBe(0);
  });
  test('$20,000 → 12%', () => {
    expect(getMarginalRate(20_000_00, FEDERAL_BRACKETS.single)).toBe(0.12);
  });
  test('$700,000 → 37%', () => {
    expect(getMarginalRate(700_000_00, FEDERAL_BRACKETS.single)).toBe(0.37);
  });
});
