# Skill: tax-logic

## 이 프로젝트의 핵심 스킬
세금 계산기이므로 이 파일을 항상 참조한다.

---

## 2024 연방세 구간 (Federal Income Tax Brackets)
출처: https://www.irs.gov/newsroom/irs-provides-tax-inflation-adjustments-for-tax-year-2024

### 표준 공제 (Standard Deduction)
| Filing Status | 공제액 |
|---|---|
| Single | $14,600 |
| Married Filing Jointly | $29,200 |
| Married Filing Separately | $14,600 |
| Head of Household | $21,900 |

### Single / MFS 세율 구간
| 세율 | 과세소득 구간 |
|------|-------------|
| 10% | $0 – $11,600 |
| 12% | $11,601 – $47,150 |
| 22% | $47,151 – $100,525 |
| 24% | $100,526 – $191,950 |
| 32% | $191,951 – $243,725 |
| 35% | $243,726 – $609,350 |
| 37% | $609,351+ |

### Married Filing Jointly / Qualifying Surviving Spouse 세율 구간
| 세율 | 과세소득 구간 |
|------|-------------|
| 10% | $0 – $23,200 |
| 12% | $23,201 – $94,300 |
| 22% | $94,301 – $201,050 |
| 24% | $201,051 – $383,900 |
| 32% | $383,901 – $487,450 |
| 35% | $487,451 – $731,200 |
| 37% | $731,201+ |

### Head of Household 세율 구간
| 세율 | 과세소득 구간 |
|------|-------------|
| 10% | $0 – $16,550 |
| 12% | $16,551 – $63,100 |
| 22% | $63,101 – $100,500 |
| 24% | $100,501 – $191,950 |
| 32% | $191,951 – $243,700 |
| 35% | $243,701 – $609,350 |
| 37% | $609,351+ |

---

## FICA 세금 (2024)
출처: https://www.irs.gov/taxtopics/tc751

| 항목 | 세율 | 한도 |
|------|------|------|
| Social Security (Employee) | 6.2% | $168,600 |
| Medicare (Employee) | 1.45% | 없음 |
| Additional Medicare | 0.9% | $200,000 초과분 (Single/HOH/MFS)<br>$250,000 초과분 (MFJ) |

---

## Pre-tax 공제 한도 (2024)
출처: https://www.irs.gov/retirement-plans/401k-plan-contribution-limits

| 항목 | 50세 미만 | 50세 이상 |
|------|----------|----------|
| 401(k) Traditional | $23,000 | $30,500 |
| Traditional IRA | $7,000 | $8,000 |
| HSA (개인) | $4,150 | $5,150 |
| HSA (가족) | $8,300 | $9,300 |
| FSA | $3,200 | $3,200 |

---

## 계산 순서
```
1. Gross Salary (입력)
2. - Pre-tax 공제 (401k, IRA, HSA, FSA, Health Insurance)
   = FICA 과세 기준 (W-2 wages)
3. - Standard Deduction (Filing Status 기준)
   = 연방세 과세 소득 (Federal Taxable Income)
4. 연방세 계산 (누진 구간 적용)
5. 주세 계산 (주별 방식 상이)
6. FICA 계산 (SS + Medicare, Additional Medicare)
7. Net Take-Home = Gross - Federal Tax - State Tax - SS - Medicare - Pre-tax 공제
```

---

## 주요 계산 함수 시그니처

```js
/**
 * 연방 소득세 계산
 * @param {number} taxableIncomeCents - 센트 단위 과세 소득
 * @param {string} filingStatus - 'single'|'mfj'|'mfs'|'hoh'
 * @returns {{ taxCents: number, effectiveRate: number, marginalRate: number }}
 */
export function calcFederalTax(taxableIncomeCents, filingStatus) {}

/**
 * FICA 계산
 * @param {number} grossCents - 센트 단위 FICA 과세 총 급여
 * @param {string} filingStatus
 * @returns {{ ssCents: number, medicareCents: number, additionalMedicareCents: number }}
 */
export function calcFICA(grossCents, filingStatus) {}

/**
 * 주세 계산
 * @param {number} taxableIncomeCents - 센트 단위 주 과세 소득
 * @param {string} stateCode - 'CA'|'NY'|'TX' 등
 * @param {string} filingStatus
 * @returns {{ taxCents: number, effectiveRate: number }}
 */
export function calcStateTax(taxableIncomeCents, stateCode, filingStatus) {}
```

---

## 검증 샘플 케이스
Claude Code가 구현 후 이 케이스로 수동 검증할 것.
IRS Withholding Estimator 결과와 5% 이내 오차 목표.

| 케이스 | Gross | Filing | State | 예상 연방세 (근사) |
|--------|-------|--------|-------|-----------------|
| A | $50,000 | Single | TX (무세) | ~$5,500 |
| B | $100,000 | Single | CA | ~$18,000 연방 + ~$6,000 주 |
| C | $200,000 | MFJ | NY | ~$30,000 연방 + ~$13,000 주 |
| D | $500,000 | Single | CA | ~$150,000 연방 + ~$46,000 주 |

---

## 소득 분위 기능 (Income Percentile Widget)

### 데이터 소스
- `src/data/income-percentiles-us.js` — IRS SOI 2022 + Census 2023, CPI-adjusted 2024
- `src/data/income-percentiles-global.js` — World Bank PIP 2022, 명목 USD

### 계산 방식
`src/utils/percentile.js`의 `interpolatePercentile()` 함수로 선형 보간.
입력: **gross annual income (달러)** — 세전 연봉 기준으로 비교.

### UI 배치 원칙
- 세금 계산 결과 바로 아래 배치 (흥미 요소이므로 결과 다음)
- 미국 / 전세계 두 카드로 나란히 표시
- 분위 숫자는 크고 굵게 (소셜 공유 유도)
- Fun Fact는 작은 이탤릭체로

### 마케팅 활용 포인트
- "Share your result" 버튼 → SNS 공유 텍스트 자동 생성
  예: "I'm in the top 3% of US earners and top 1% globally 🌍"
- 높은 소셜 공유율 → 백링크 + 오가닉 트래픽 증가
