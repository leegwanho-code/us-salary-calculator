/**
 * SalaryForm.js — 입력 폼 컴포넌트
 * 연봉, filing status, 주, pre-tax 공제 입력
 */
import { STATE_LIST } from '../data/state-tax-2024.js';
import { DEDUCTION_LIMITS_2024, validate401k } from '../utils/deductions.js';
import { parseDollarsToCents } from '../utils/format.js';

/**
 * 폼 상태 인터페이스
 * @typedef {{
 *   grossCents: number,
 *   payPeriod: 'annual'|'monthly'|'biweekly'|'weekly'|'hourly',
 *   filingStatus: 'single'|'mfj'|'mfs'|'hoh',
 *   stateCode: string,
 *   isOver50: boolean,
 *   k401Cents: number,
 *   iraCents: number,
 *   hsaCents: number,
 *   fsaCents: number,
 *   healthInsuranceCents: number,
 * }} FormState
 */

/** 지급 주기 → 연봉 환산 배수 */
const PAY_PERIOD_MULTIPLIER = {
  annual:    1,
  monthly:   12,
  biweekly:  26,
  weekly:    52,
  hourly:    2080, // 52 weeks × 40 hours
};

/**
 * SalaryForm 컴포넌트 생성
 * @param {function(FormState): void} onCalculate - 계산 콜백
 * @returns {HTMLElement}
 */
export function SalaryForm(onCalculate) {
  const section = document.createElement('section');
  section.className = 'card';
  section.setAttribute('aria-label', 'Salary input form');

  section.innerHTML = `
    <div class="card-header">
      <div class="card-icon blue">💼</div>
      <h2>Your Income</h2>
    </div>

    <form id="salary-form" novalidate>

      <!-- ── Income ── -->
      <div class="form-section">
        <p class="form-section-title">Income</p>
        <div class="form-group">
          <label for="gross-input">Salary Amount</label>
          <div class="input-wrapper">
            <span class="input-prefix">$</span>
            <input
              type="number"
              id="gross-input"
              class="has-prefix"
              placeholder="100,000"
              min="0"
              step="1000"
              inputmode="numeric"
              aria-label="Gross salary amount"
            />
          </div>
        </div>
        <div class="form-group">
          <label for="pay-period">Pay Period</label>
          <select id="pay-period" aria-label="Pay period">
            <option value="annual"   selected>Annual</option>
            <option value="monthly">Monthly</option>
            <option value="biweekly">Bi-Weekly</option>
            <option value="weekly">Weekly</option>
            <option value="hourly">Hourly</option>
          </select>
        </div>
      </div>

      <!-- ── Tax Profile ── -->
      <div class="form-section">
        <p class="form-section-title">Tax Profile</p>
        <div class="form-group">
          <label for="filing-status">Filing Status</label>
          <select id="filing-status" aria-label="Filing status">
            <option value="single" selected>Single</option>
            <option value="mfj">Married Filing Jointly</option>
            <option value="mfs">Married Filing Separately</option>
            <option value="hoh">Head of Household</option>
          </select>
        </div>
        <div class="form-group">
          <label for="state-select">State</label>
          <select id="state-select" aria-label="State of residence"></select>
        </div>
        <div class="form-group">
          <div class="checkbox-group">
            <input type="checkbox" id="is-over50" />
            <label for="is-over50">Age 50 or older (catch-up contributions)</label>
          </div>
        </div>
      </div>

      <!-- ── Pre-Tax Deductions ── -->
      <div class="form-section">
        <p class="form-section-title">Pre-Tax Deductions <span style="font-weight:400;text-transform:none;letter-spacing:0">(optional)</span></p>

        <div class="form-group">
          <label for="k401-input">401(k) Contribution</label>
          <div class="input-wrapper">
            <span class="input-prefix">$</span>
            <input type="number" id="k401-input" class="has-prefix" placeholder="0" min="0" inputmode="numeric" aria-label="401k contribution" />
          </div>
          <div id="k401-warning" class="field-warning" hidden>⚠️ <span></span></div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="ira-input">Traditional IRA</label>
            <div class="input-wrapper">
              <span class="input-prefix">$</span>
              <input type="number" id="ira-input" class="has-prefix" placeholder="0" min="0" inputmode="numeric" aria-label="IRA contribution" />
            </div>
          </div>
          <div class="form-group">
            <label for="hsa-input">HSA</label>
            <div class="input-wrapper">
              <span class="input-prefix">$</span>
              <input type="number" id="hsa-input" class="has-prefix" placeholder="0" min="0" inputmode="numeric" aria-label="HSA contribution" />
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="fsa-input">FSA</label>
            <div class="input-wrapper">
              <span class="input-prefix">$</span>
              <input type="number" id="fsa-input" class="has-prefix" placeholder="0" min="0" inputmode="numeric" aria-label="FSA contribution" />
            </div>
          </div>
          <div class="form-group">
            <label for="health-input">Health Insurance</label>
            <div class="input-wrapper">
              <span class="input-prefix">$</span>
              <input type="number" id="health-input" class="has-prefix" placeholder="0" min="0" inputmode="numeric" aria-label="Health insurance premium" />
            </div>
          </div>
        </div>
      </div>

      <button type="submit" class="btn-calculate" id="calculate-btn">
        Calculate Take-Home Pay ✦
      </button>
    </form>
  `;

  // ── 주 드롭다운 채우기 ──
  const stateSelect = section.querySelector('#state-select');
  STATE_LIST.forEach(({ code, name }) => {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = name;
    if (code === 'CA') option.selected = true;
    stateSelect.appendChild(option);
  });

  // ── 401k 실시간 경고 ──
  const k401Input   = section.querySelector('#k401-input');
  const k401Warning = section.querySelector('#k401-warning');
  const isOver50Cb  = section.querySelector('#is-over50');

  function check401k() {
    const cents = parseDollarsToCents(k401Input.value);
    if (cents <= 0) { k401Warning.hidden = true; return; }
    const isOver50 = isOver50Cb.checked;
    const { valid, message } = validate401k(cents, isOver50);
    if (!valid) {
      k401Warning.hidden = false;
      k401Warning.querySelector('span').textContent = message;
    } else {
      k401Warning.hidden = true;
    }
  }

  k401Input.addEventListener('input', check401k);
  isOver50Cb.addEventListener('change', check401k);

  // ── 폼 제출 ──
  const form = section.querySelector('#salary-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const payPeriod    = section.querySelector('#pay-period').value;
    const rawAmount    = parseDollarsToCents(section.querySelector('#gross-input').value);
    const multiplier   = PAY_PERIOD_MULTIPLIER[payPeriod] ?? 1;
    const grossCents   = rawAmount * multiplier;

    const filingStatus          = section.querySelector('#filing-status').value;
    const stateCode             = stateSelect.value;
    const isOver50              = isOver50Cb.checked;
    const k401Cents             = parseDollarsToCents(k401Input.value);
    const iraCents              = parseDollarsToCents(section.querySelector('#ira-input').value);
    const hsaCents              = parseDollarsToCents(section.querySelector('#hsa-input').value);
    const fsaCents              = parseDollarsToCents(section.querySelector('#fsa-input').value);
    const healthInsuranceCents  = parseDollarsToCents(section.querySelector('#health-input').value);

    /** @type {FormState} */
    const state = {
      grossCents, payPeriod, filingStatus, stateCode, isOver50,
      k401Cents, iraCents, hsaCents, fsaCents, healthInsuranceCents,
    };

    onCalculate(state);
  });

  return section;
}
