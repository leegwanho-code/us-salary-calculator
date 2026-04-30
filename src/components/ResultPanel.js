/**
 * ResultPanel.js — 결과 패널 컴포넌트
 * Gross→Net 흐름 + 소득 분위 위젯
 */
import { formatCurrency, formatPercent } from '../utils/format.js';

/**
 * @typedef {{
 *   grossCents: number,
 *   netCents: number,
 *   federalTaxCents: number,
 *   stateTaxCents: number,
 *   totalFicaCents: number,
 *   preTaxDeductionsCents: number,
 *   usPercentile: { percentile: number, beatPercent: number, label: string, emoji: string },
 *   globalPercentile: { percentile: number, beatPercent: number, label: string, emoji: string, context: string, funFact: string },
 *   stateName: string,
 *   stateCode: string,
 *   hasStateTax: boolean,
 *   federalEffectiveRate: number,
 * }} ResultData
 */

/**
 * @param {ResultData} data
 * @returns {HTMLElement}
 */
export function ResultPanel(data) {
  const { grossCents, netCents, federalTaxCents, stateTaxCents, totalFicaCents, preTaxDeductionsCents } = data;

  const section = document.createElement('section');
  section.className = 'card animate-in';
  section.setAttribute('aria-label', 'Take-home pay summary');

  // ── Tax flow bar widths ──
  const totalTaxCents = federalTaxCents + stateTaxCents + totalFicaCents;
  const deductionsCents = preTaxDeductionsCents;
  const totalDeductions = totalTaxCents + deductionsCents;

  const federalPct  = grossCents > 0 ? (federalTaxCents / grossCents) * 100 : 0;
  const statePct    = grossCents > 0 ? (stateTaxCents    / grossCents) * 100 : 0;
  const ficaPct     = grossCents > 0 ? (totalFicaCents   / grossCents) * 100 : 0;
  const netPct      = grossCents > 0 ? (netCents         / grossCents) * 100 : 0;

  const netPerMonth = Math.round(netCents / 12);

  section.innerHTML = `
    <div class="card-header">
      <div class="card-icon blue">✦</div>
      <h2>Take-Home Pay</h2>
    </div>

    <!-- Net Pay Hero -->
    <div class="net-pay-hero">
      <div class="net-pay-label">Annual Take-Home</div>
      <div class="net-pay-amount" id="net-pay-display">${formatCurrency(netCents)}</div>
      <div class="net-pay-sub">
        <strong>${formatCurrency(netPerMonth)}/mo</strong>
        &nbsp;·&nbsp; ${formatPercent(netCents / grossCents)} of gross
      </div>

      <!-- Tax flow bar -->
      <div class="tax-flow" aria-label="Tax allocation bar">
        <div class="tax-flow-bar" role="img" aria-label="Tax breakdown visual">
          <div class="tax-flow-segment federal"  style="width:${federalPct.toFixed(2)}%" title="Federal: ${formatCurrency(federalTaxCents)}"></div>
          <div class="tax-flow-segment state"    style="width:${statePct.toFixed(2)}%"   title="State: ${formatCurrency(stateTaxCents)}"></div>
          <div class="tax-flow-segment fica"     style="width:${ficaPct.toFixed(2)}%"    title="FICA: ${formatCurrency(totalFicaCents)}"></div>
          <div class="tax-flow-segment take-home"style="width:${netPct.toFixed(2)}%"     title="Take-home: ${formatCurrency(netCents)}"></div>
        </div>
        <div class="tax-flow-legend">
          <span><span class="legend-dot federal"></span>Federal ${formatPercent(federalTaxCents / grossCents)}</span>
          <span><span class="legend-dot state"></span>${data.stateCode} ${data.hasStateTax ? formatPercent(stateTaxCents / grossCents) : '0%'}</span>
          <span><span class="legend-dot fica"></span>FICA ${formatPercent(totalFicaCents / grossCents)}</span>
          <span><span class="legend-dot take-home"></span>Take-home ${formatPercent(netCents / grossCents)}</span>
        </div>
      </div>
    </div>

    <!-- Income Percentile Widget -->
    <div style="margin-top: var(--space-xl)">
      <p class="form-section-title" style="margin-bottom: var(--space-md)">Income Ranking</p>
      <div class="percentile-grid">

        <!-- US -->
        <div class="percentile-card">
          <div class="percentile-scope">🇺🇸 United States</div>
          <div class="percentile-emoji">${data.usPercentile.emoji}</div>
          <div class="percentile-value">Top ${(100 - data.usPercentile.beatPercent).toFixed(1)}%</div>
          <div class="percentile-label">${data.usPercentile.label}</div>
          <div style="font-size:0.72rem; color:var(--color-text-muted); margin-top: var(--space-xs)">
            Earns more than ${data.usPercentile.beatPercent.toFixed(1)}% of US workers
          </div>
        </div>

        <!-- Global -->
        <div class="percentile-card">
          <div class="percentile-scope">🌍 World</div>
          <div class="percentile-emoji">${data.globalPercentile.emoji}</div>
          <div class="percentile-value">Top ${(100 - data.globalPercentile.beatPercent).toFixed(1)}%</div>
          <div class="percentile-label">${data.globalPercentile.label}</div>
          <div style="font-size:0.72rem; color:var(--color-text-muted); margin-top: var(--space-xs)">
            ${data.globalPercentile.context}
          </div>
        </div>
      </div>

      <!-- Fun Fact -->
      <div class="fun-fact" aria-label="Global income fun fact">
        💡 ${data.globalPercentile.funFact}
      </div>
    </div>
  `;

  return section;
}
