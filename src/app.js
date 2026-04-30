/**
 * app.js — 진입점
 * 폼 → 계산 → 결과 렌더링 루프
 */
import { SalaryForm }    from './components/SalaryForm.js';
import { ResultPanel }   from './components/ResultPanel.js';
import { TaxBreakdown }  from './components/TaxBreakdown.js';
import { PaySchedule }   from './components/PaySchedule.js';

import { calcFederalTax }           from './utils/federal-tax.js';
import { calcStateTax }             from './utils/state-tax.js';
import { calcFICA }                 from './utils/fica.js';
import { calcPreTaxDeductions }     from './utils/deductions.js';
import { calcIncomePercentiles }    from './utils/percentile.js';

/**
 * 전체 세금 계산 오케스트레이터
 * @param {import('./components/SalaryForm.js').FormState} formState
 * @returns {object} 결과 데이터
 */
function calculate(formState) {
  const {
    grossCents, filingStatus, stateCode, isOver50,
    k401Cents, iraCents, hsaCents, fsaCents, healthInsuranceCents,
  } = formState;

  // 1. Pre-tax 공제 계산
  const { totalCents: preTaxDeductionsCents, items: deductionItems } =
    calcPreTaxDeductions({ k401Cents, iraCents, hsaCents, fsaCents, healthInsuranceCents });

  // 2. 연방세 계산
  const {
    federalTaxCents, taxableIncomeCents, effectiveRate: federalEffectiveRate,
    marginalRate, standardDeductionCents,
  } = calcFederalTax(grossCents, filingStatus, preTaxDeductionsCents);

  // 3. 주세 계산
  const {
    stateTaxCents, effectiveRate: stateEffectiveRate,
    stateName, stateCode: resolvedStateCode, hasStateTax,
  } = calcStateTax(grossCents, stateCode, filingStatus, preTaxDeductionsCents);

  // 4. FICA 계산 (pre-tax 공제 전 W-2 소득 기준)
  const { ssCents, medicareCents, additionalMedicareCents, totalFicaCents } =
    calcFICA(grossCents, filingStatus);

  // 5. 실수령액
  const totalTaxCents = federalTaxCents + stateTaxCents + totalFicaCents;
  const netCents = Math.max(0, grossCents - preTaxDeductionsCents - totalTaxCents);

  // 6. 소득 분위
  const grossAnnualDollars = grossCents / 100;
  const { us: usPercentile, global: globalPercentile } =
    calcIncomePercentiles(grossAnnualDollars);

  return {
    grossCents,
    netCents,
    federalTaxCents,
    stateTaxCents,
    ssCents,
    medicareCents,
    additionalMedicareCents,
    totalFicaCents,
    preTaxDeductionsCents,
    deductionItems,
    taxableIncomeCents,
    federalEffectiveRate,
    stateEffectiveRate,
    marginalRate,
    standardDeductionCents,
    stateName,
    stateCode: resolvedStateCode,
    hasStateTax,
    usPercentile,
    globalPercentile,
  };
}

/**
 * 결과 패널 영역을 업데이트한다.
 * @param {object} data
 */
function renderResults(data) {
  const resultsColumn = document.getElementById('results-column');
  resultsColumn.innerHTML = '';

  const resultPanel  = ResultPanel(data);
  const taxBreakdown = TaxBreakdown(data);
  const paySchedule  = PaySchedule(data);
  const adSlot       = createAdSlot();

  resultsColumn.appendChild(resultPanel);
  resultsColumn.appendChild(taxBreakdown);
  resultsColumn.appendChild(paySchedule);
  resultsColumn.appendChild(adSlot);
}

/**
 * AdSense 인피드 슬롯 생성 (플레이스홀더)
 */
function createAdSlot() {
  const div = document.createElement('div');
  div.className = 'ad-inline';
  div.innerHTML = `
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="__ADSENSE_CLIENT__"
         data-ad-slot="__ADSENSE_SLOT_INLINE__"
         data-ad-format="auto"
         data-full-width-responsive="true">
    </ins>
  `;
  return div;
}

/**
 * 앱 초기화
 */
function init() {
  const formContainer = document.getElementById('form-container');
  const resultsColumn = document.getElementById('results-column');

  // 빈 상태 표시
  resultsColumn.innerHTML = `
    <div class="card empty-state animate-in">
      <div class="empty-icon">🧮</div>
      <p>Enter your salary above and click<br><strong>Calculate Take-Home Pay</strong> to see results.</p>
    </div>
  `;

  // 폼 컴포넌트 삽입
  const form = SalaryForm((formState) => {
    if (formState.grossCents <= 0) {
      resultsColumn.innerHTML = `
        <div class="card empty-state animate-in">
          <div class="empty-icon">⚠️</div>
          <p>Please enter a valid salary amount.</p>
        </div>
      `;
      return;
    }

    try {
      const data = calculate(formState);
      renderResults(data);

      // AdSense 재초기화 (push new ad)
      if (window.adsbygoogle) {
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (_) {}
      }

      // 모바일에서 결과로 스크롤
      if (window.innerWidth < 769) {
        resultsColumn.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err) {
      console.error('Calculation error:', err);
      resultsColumn.innerHTML = `
        <div class="card empty-state animate-in">
          <div class="empty-icon">❌</div>
          <p>An error occurred. Please check your inputs and try again.</p>
        </div>
      `;
    }
  });

  formContainer.appendChild(form);
}

// DOM 준비 후 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
