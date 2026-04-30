import { calcFICA } from '../../src/utils/fica.js';

describe('calcFICA', () => {
  test('0 소득 → 모두 0', () => {
    const r = calcFICA(0, 'single');
    expect(r.ssCents).toBe(0);
    expect(r.medicareCents).toBe(0);
    expect(r.additionalMedicareCents).toBe(0);
  });

  // SS: $50,000 × 6.2% = $3,100
  test('$50,000 → SS $3,100', () => {
    const { ssCents } = calcFICA(50_000_00, 'single');
    expect(ssCents).toBe(3_100_00);
  });

  // SS 한도 테스트: $168,600 wage base
  // SS = $168,600 × 6.2% = $10,453.20
  test('$200,000 → SS 한도($168,600) 적용: ~$10,453', () => {
    const { ssCents } = calcFICA(200_000_00, 'single');
    expect(ssCents).toBeGreaterThan(10_450_00);
    expect(ssCents).toBeLessThan(10_460_00);
  });

  // $300,000 → SS 한도 동일: $168,600 × 6.2%
  test('$300,000 → SS는 $168,600 한도 그대로', () => {
    const { ssCents: r200 } = calcFICA(200_000_00, 'single');
    const { ssCents: r300 } = calcFICA(300_000_00, 'single');
    expect(r200).toBe(r300); // 한도 초과 후 SS 동일
  });

  // Medicare: $100,000 × 1.45% = $1,450
  test('$100,000 → Medicare $1,450', () => {
    const { medicareCents } = calcFICA(100_000_00, 'single');
    expect(medicareCents).toBe(1_450_00);
  });

  // Additional Medicare: Single $200,000 초과 0.9%
  // $300,000 → ($300,000 - $200,000) × 0.9% = $900
  test('$300,000 Single → Additional Medicare $900', () => {
    const { additionalMedicareCents } = calcFICA(300_000_00, 'single');
    expect(additionalMedicareCents).toBe(900_00);
  });

  // MFJ threshold: $250,000
  // $300,000 MFJ → ($300,000 - $250,000) × 0.9% = $450
  test('$300,000 MFJ → Additional Medicare $450 (threshold $250k)', () => {
    const { additionalMedicareCents } = calcFICA(300_000_00, 'mfj');
    expect(additionalMedicareCents).toBe(450_00);
  });

  // $200,000 Single → Additional Medicare = 0 (threshold 딱 맞음)
  test('$200,000 Single → Additional Medicare $0 (threshold 경계)', () => {
    const { additionalMedicareCents } = calcFICA(200_000_00, 'single');
    expect(additionalMedicareCents).toBe(0);
  });

  // totalFicaCents 검증
  test('totalFicaCents = SS + Medicare + AdditionalMedicare', () => {
    const r = calcFICA(250_000_00, 'single');
    expect(r.totalFicaCents).toBe(r.ssCents + r.medicareCents + r.additionalMedicareCents);
  });
});
