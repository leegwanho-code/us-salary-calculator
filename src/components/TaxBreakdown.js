/**
 * TaxBreakdown.js — 세금 항목별 breakdown 테이블 컴포넌트
 */
import { formatCurrency, formatPercent } from '../utils/format.js';

/**
 * @typedef {{
 *   grossCents: number,
 *   federalTaxCents: number,
 *   stateTaxCents: number,
 *   ssCents: number,
 *   medicareCents: number,
 *   additionalMedicareCents: number,
 *   totalFicaCents: number,
 *   preTaxDeductionsCents: number,
 *   deductionItems: Array<{label: string, amountCents: number}>,
 *   netCents: number,
 *   federalEffectiveRate: number,
 *   stateEffectiveRate: number,
 *   marginalRate: number,
 *   standardDeductionCents: number,
 *   taxableIncomeCents: number,
 *   stateName: string,
 *   stateCode: string,
 *   hasStateTax: boolean,
 * }} BreakdownData
 */

const ROWS = [
  { key: 'federal',   label: 'Federal Income Tax',     color: '#fc8181', rateKey: 'federalEffectiveRate' },
  { key: 'state',     label: 'State Income Tax',       color: '#f6ad55', rateKey: 'stateEffectiveRate'   },
  { key: 'ss',        label: 'Social Security (6.2%)', color: '#9f7aea', rateKey: null },
  { key: 'medicare',  label: 'Medicare (1.45%)',        color: '#b794f4', rateKey: null },
];

/**
 * @param {BreakdownData} data
 * @returns {HTMLElement}
 */
export function TaxBreakdown(data) {
  const section = document.createElement('section');
  section.className = 'card animate-in';
  section.setAttribute('aria-label', 'Tax breakdown');

  const addMedicare = data.additionalMedicareCents > 0;
  const totalTaxCents = data.federalTaxCents + data.stateTaxCents
    + data.ssCents + data.medicareCents + data.additionalMedicareCents;
  const totalEffRate = data.grossCents > 0 ? totalTaxCents / data.grossCents : 0;

  // Deductions rows HTML
  const deductionRowsHtml = data.deductionItems.map(item => `
    <tr>
      <td class="row-label">
        <span class="row-dot" style="background:#68d391"></span>
        ${item.label}
      </td>
      <td class="row-amount" style="color: #68d391">
        −${formatCurrency(item.amountCents)}
      </td>
      <td class="row-rate">—</td>
    </tr>
  `).join('');

  // Additional Medicare row
  const addMedicareHtml = addMedicare ? `
    <tr>
      <td class="row-label">
        <span class="row-dot" style="background:#d6bcfa"></span>
        Addl. Medicare (0.9%)
      </td>
      <td class="row-amount">${formatCurrency(data.additionalMedicareCents)}</td>
      <td class="row-rate">${formatPercent(data.additionalMedicareCents / data.grossCents)}</td>
    </tr>
  ` : '';

  section.innerHTML = `
    <div class="card-header">
      <div class="card-icon violet">📊</div>
      <h2>Tax Breakdown</h2>
    </div>

    <table class="breakdown-table" aria-label="Tax breakdown table">
      <tbody>
        <!-- Gross -->
        <tr>
          <td class="row-label" style="font-weight:600; color: var(--color-text-primary)">
            Gross Pay
          </td>
          <td class="row-amount" style="font-size:1rem">${formatCurrency(data.grossCents)}</td>
          <td class="row-rate"></td>
        </tr>

        <!-- Pre-tax Deductions -->
        ${deductionRowsHtml}

        <!-- Federal Tax -->
        <tr>
          <td class="row-label">
            <span class="row-dot" style="background:#fc8181"></span>
            Federal Income Tax
          </td>
          <td class="row-amount">${formatCurrency(data.federalTaxCents)}</td>
          <td class="row-rate">${formatPercent(data.federalEffectiveRate)}</td>
        </tr>

        <!-- State Tax -->
        <tr>
          <td class="row-label">
            <span class="row-dot" style="background:#f6ad55"></span>
            ${data.stateName} State Tax
            ${!data.hasStateTax ? '<span style="font-size:0.7rem;color:var(--color-accent-3);margin-left:4px">No Tax</span>' : ''}
          </td>
          <td class="row-amount">${formatCurrency(data.stateTaxCents)}</td>
          <td class="row-rate">${data.hasStateTax ? formatPercent(data.stateEffectiveRate) : '—'}</td>
        </tr>

        <!-- Social Security -->
        <tr>
          <td class="row-label">
            <span class="row-dot" style="background:#9f7aea"></span>
            Social Security (6.2%)
          </td>
          <td class="row-amount">${formatCurrency(data.ssCents)}</td>
          <td class="row-rate">${formatPercent(data.ssCents / data.grossCents)}</td>
        </tr>

        <!-- Medicare -->
        <tr>
          <td class="row-label">
            <span class="row-dot" style="background:#b794f4"></span>
            Medicare (1.45%)
          </td>
          <td class="row-amount">${formatCurrency(data.medicareCents)}</td>
          <td class="row-rate">${formatPercent(data.medicareCents / data.grossCents)}</td>
        </tr>

        ${addMedicareHtml}

        <!-- Total Tax -->
        <tr class="row-total">
          <td class="row-label" style="color:var(--color-text-primary);font-weight:700">
            Total Deductions
          </td>
          <td class="row-amount">${formatCurrency(totalTaxCents + data.preTaxDeductionsCents)}</td>
          <td class="row-rate" style="color:var(--color-accent-danger)">${formatPercent(totalEffRate)}</td>
        </tr>

        <!-- Net -->
        <tr class="row-net">
          <td class="row-label" style="color:var(--color-accent-1);font-weight:700">
            ✦ Take-Home Pay
          </td>
          <td class="row-amount" style="color:var(--color-accent-1)">${formatCurrency(data.netCents)}</td>
          <td class="row-rate" style="color:var(--color-accent-1)">${formatPercent(data.netCents / data.grossCents)}</td>
        </tr>
      </tbody>
    </table>

    <!-- Additional info -->
    <div style="margin-top: var(--space-lg); padding-top: var(--space-md); border-top: 1px solid var(--color-border); display:grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm);">
      <div style="font-size:0.78rem; color:var(--color-text-muted)">
        <div style="font-weight:600; color:var(--color-text-secondary); margin-bottom:2px">Marginal Rate</div>
        <div style="font-size:1rem; font-weight:700; color:var(--color-text-primary)">${formatPercent(data.marginalRate)}</div>
      </div>
      <div style="font-size:0.78rem; color:var(--color-text-muted)">
        <div style="font-weight:600; color:var(--color-text-secondary); margin-bottom:2px">Taxable Income</div>
        <div style="font-size:1rem; font-weight:700; color:var(--color-text-primary)">${formatCurrency(data.taxableIncomeCents)}</div>
      </div>
      <div style="font-size:0.78rem; color:var(--color-text-muted)">
        <div style="font-weight:600; color:var(--color-text-secondary); margin-bottom:2px">Std. Deduction</div>
        <div style="font-size:1rem; font-weight:700; color:var(--color-text-primary)">${formatCurrency(data.standardDeductionCents)}</div>
      </div>
      <div style="font-size:0.78rem; color:var(--color-text-muted)">
        <div style="font-weight:600; color:var(--color-text-secondary); margin-bottom:2px">Total Eff. Rate</div>
        <div style="font-size:1rem; font-weight:700; color:var(--color-accent-danger)">${formatPercent(totalEffRate)}</div>
      </div>
    </div>
  `;

  return section;
}
