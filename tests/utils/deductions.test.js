import { calcPreTaxDeductions, validate401k, DEDUCTION_LIMITS_2024 } from '../../src/utils/deductions.js';

describe('calcPreTaxDeductions', () => {
  test('모든 공제 0 → totalCents 0, items 빈 배열', () => {
    const { totalCents, items } = calcPreTaxDeductions({});
    expect(totalCents).toBe(0);
    expect(items).toHaveLength(0);
  });

  test('401k만 입력 → items에 하나만 포함', () => {
    const { totalCents, items } = calcPreTaxDeductions({ k401Cents: 5_000_00 });
    expect(totalCents).toBe(5_000_00);
    expect(items).toHaveLength(1);
    expect(items[0].label).toBe('401(k) Contribution');
  });

  test('여러 공제 합산 정확성', () => {
    const { totalCents } = calcPreTaxDeductions({
      k401Cents: 10_000_00,
      iraCents: 3_000_00,
      hsaCents: 2_000_00,
      healthInsuranceCents: 1_200_00,
    });
    expect(totalCents).toBe(16_200_00);
  });

  test('음수 값 → 0으로 처리', () => {
    const { totalCents } = calcPreTaxDeductions({ k401Cents: -5_000_00 });
    expect(totalCents).toBe(0);
  });
});

describe('validate401k', () => {
  const limit50Under = DEDUCTION_LIMITS_2024['401k_under50'] * 100;
  const limit50Over  = DEDUCTION_LIMITS_2024['401k_over50']  * 100;

  test('한도 이하 → valid: true', () => {
    const { valid } = validate401k(10_000_00, false);
    expect(valid).toBe(true);
  });

  test('50세 미만 한도($23,000) 초과 → valid: false', () => {
    const { valid, message } = validate401k(limit50Under + 1, false);
    expect(valid).toBe(false);
    expect(message).toContain('23,000');
  });

  test('50세 이상 한도($30,500) 이하 → valid: true', () => {
    const { valid } = validate401k(limit50Over, true);
    expect(valid).toBe(true);
  });

  test('50세 이상 한도($30,500) 초과 → valid: false', () => {
    const { valid } = validate401k(limit50Over + 100, true);
    expect(valid).toBe(false);
  });
});
