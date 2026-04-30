import { calcStateTax } from '../../src/utils/state-tax.js';

describe('calcStateTax — 무세 주', () => {
  test('TX (무세): stateTaxCents = 0', () => {
    const r = calcStateTax(100_000_00, 'TX', 'single');
    expect(r.stateTaxCents).toBe(0);
    expect(r.hasStateTax).toBe(false);
  });
  test('FL (무세): stateTaxCents = 0', () => {
    const r = calcStateTax(100_000_00, 'FL', 'single');
    expect(r.stateTaxCents).toBe(0);
  });
  test('존재하지 않는 주 코드 → 세금 0', () => {
    const r = calcStateTax(100_000_00, 'ZZ', 'single');
    expect(r.stateTaxCents).toBe(0);
    expect(r.hasStateTax).toBe(false);
  });
});

describe('calcStateTax — 정률세 주 (IL 4.95%)', () => {
  test('$100,000 IL Single → $4,950', () => {
    const r = calcStateTax(100_000_00, 'IL', 'single');
    expect(r.stateTaxCents).toBe(4_950_00);
    expect(r.hasStateTax).toBe(true);
  });
  test('$0 IL → $0', () => {
    const r = calcStateTax(0, 'IL', 'single');
    expect(r.stateTaxCents).toBe(0);
  });
});

describe('calcStateTax — 누진세 주 (CA)', () => {
  // $50,000 CA Single — CA 표준공제 $5,202
  // 과세소득 = $50,000 - $5,202 = $44,798
  test('$50,000 CA Single → 유의미한 주세 존재', () => {
    const r = calcStateTax(50_000_00, 'CA', 'single');
    expect(r.stateTaxCents).toBeGreaterThan(1_000_00);
    expect(r.hasStateTax).toBe(true);
    expect(r.stateName).toBe('California');
  });

  // $100,000 CA Single → effectiveRate > 0
  test('$100,000 CA Single → effectiveRate > 0', () => {
    const r = calcStateTax(100_000_00, 'CA', 'single');
    expect(r.effectiveRate).toBeGreaterThan(0.04);
    expect(r.effectiveRate).toBeLessThan(0.10);
  });

  // MFJ 더 낮은 세율 (더 넓은 구간)
  test('$100,000 CA MFJ → Single보다 낮거나 같은 세금', () => {
    const single = calcStateTax(100_000_00, 'CA', 'single');
    const mfj = calcStateTax(100_000_00, 'CA', 'mfj');
    expect(mfj.stateTaxCents).toBeLessThanOrEqual(single.stateTaxCents);
  });
});

describe('calcStateTax — Pre-tax 공제 반영', () => {
  test('401k 공제 $10,000 → IL 세금 감소', () => {
    const withDeduction = calcStateTax(100_000_00, 'IL', 'single', 10_000_00);
    const withoutDeduction = calcStateTax(100_000_00, 'IL', 'single', 0);
    expect(withDeduction.stateTaxCents).toBeLessThan(withoutDeduction.stateTaxCents);
  });
});
