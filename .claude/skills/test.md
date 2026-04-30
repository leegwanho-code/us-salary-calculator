# Skill: test

## 원칙
- 세금 계산 함수는 **100% 커버리지** 목표
- IRS 공식 샘플로 정확도 검증
- 경계값(bracket 경계, FICA 한도, 공제 한도) 반드시 테스트

## Jest 설정
`package.json`의 `jest.testEnvironment`가 `jsdom`인지 확인.

## 테스트 파일 위치
```
tests/utils/
├── federal-tax.test.js
├── state-tax.test.js
├── fica.test.js
└── deductions.test.js
```

## 세금 계산 테스트 패턴
```js
// tests/utils/federal-tax.test.js
import { calcFederalTax } from '../../src/utils/federal-tax.js';

describe('calcFederalTax', () => {
  // 케이스 A: $50,000 Single — IRS 검증값 근사
  test('$50,000 Single: ~$5,500 연방세', () => {
    const gross = 50_000_00; // 센트
    const stdDeduction = 14_600_00;
    const taxable = gross - stdDeduction;
    const { taxCents } = calcFederalTax(taxable, 'single');
    // IRS 2024 기준 $4,718
    expect(taxCents).toBeGreaterThan(4_600_00);
    expect(taxCents).toBeLessThan(4_900_00);
  });

  // 세율 구간 경계값 테스트
  test('Single: $11,600 → 정확히 10% 구간 최대', () => {
    const { marginalRate } = calcFederalTax(0, 'single'); // 0 소득
    expect(marginalRate).toBe(0);
  });

  // 무효 입력 처리
  test('음수 소득은 0 반환', () => {
    const { taxCents } = calcFederalTax(-1_000_00, 'single');
    expect(taxCents).toBe(0);
  });
});
```

## FICA 경계값 테스트
```js
describe('calcFICA', () => {
  test('SS 한도($168,600) 초과분은 SS 없음', () => {
    const { ssCents } = calcFICA(200_000_00, 'single');
    // SS = $168,600 × 6.2% = $10,453.20
    expect(ssCents).toBeCloseTo(10_453_20, -2);
  });

  test('Additional Medicare: $200,000 초과 0.9%', () => {
    const { additionalMedicareCents } = calcFICA(300_000_00, 'single');
    // ($300,000 - $200,000) × 0.9% = $900
    expect(additionalMedicareCents).toBeCloseTo(90_000, -1);
  });
});
```

## 실행
```bash
npm test                  # 전체
npm run test:watch        # watch 모드
npm run test:coverage     # 커버리지
```
