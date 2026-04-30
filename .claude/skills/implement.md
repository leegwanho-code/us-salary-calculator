# Skill: implement

## 언제 사용
새로운 기능 컴포넌트 또는 유틸 함수를 작성할 때.
반드시 `.claude/skills/tax-logic.md`를 함께 참조할 것.

---

## 절차
1. `src/data/` 해당 파일 읽기 (세율 데이터 확인)
2. `src/utils/` 순수 함수 작성
3. `tests/utils/` 테스트 작성 → `npm test` 통과
4. `src/components/` UI 클래스 작성
5. `public/index.html` 연결

---

## 센트 단위 계산 패턴 (필수)
```js
// 부동소수점 오차 방지 — 항상 센트 단위로 중간 계산
const grossCents = Math.round(parseFloat(grossStr) * 100);
const taxCents = calcBracketTax(grossCents, brackets);
const taxDollars = taxCents / 100;
```

## 누진세 계산 패턴
```js
/**
 * 누진 세율 구간 적용
 * @param {number} incomeCents - 과세 소득 (센트)
 * @param {Array<{min: number, max: number|null, rate: number}>} brackets - 달러 단위 구간
 * @returns {number} 세금 (센트)
 */
export function applyBrackets(incomeCents, brackets) {
  let taxCents = 0;
  const incomeDollars = incomeCents / 100;

  for (const { min, max, rate } of brackets) {
    if (incomeDollars <= min) break;
    const upper = max !== null ? Math.min(incomeDollars, max) : incomeDollars;
    taxCents += Math.round((upper - min) * rate * 100);
  }
  return taxCents;
}
```

## 컴포넌트 클래스 패턴
```js
// src/components/ResultPanel.js
export class ResultPanel {
  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    this._container = container;
    this._el = null;
  }

  mount() {
    this._el = document.createElement('section');
    this._el.className = 'result-panel';
    this._el.setAttribute('aria-live', 'polite');
    this._container.appendChild(this._el);
  }

  /**
   * @param {TaxResult} result
   */
  update(result) {
    this._render(result);
  }

  unmount() {
    this._el?.remove();
  }

  _render(result) {
    // textContent 또는 createElement만 사용 — innerHTML 금지
  }
}
```

## 금액 포맷 유틸
```js
// src/utils/format.js
export const formatCurrency = (cents) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);

export const formatPercent = (rate) =>
  new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rate);
```
