/**
 * PaySchedule.js — 연/월/격주/주 단위 실수령액 컴포넌트
 */
import { formatCurrency, calcPaySchedule } from '../utils/format.js';

/**
 * @param {{ grossCents: number, netCents: number }} data
 * @returns {HTMLElement}
 */
export function PaySchedule({ grossCents, netCents }) {
  const section = document.createElement('section');
  section.className = 'card animate-in';
  section.setAttribute('aria-label', 'Pay schedule');

  const grossSchedule = calcPaySchedule(grossCents);
  const netSchedule   = calcPaySchedule(netCents);

  const periods = [
    { key: 'annual',   label: 'Annual',    icon: '📅' },
    { key: 'monthly',  label: 'Monthly',   icon: '🗓️' },
    { key: 'biweekly', label: 'Bi-Weekly', icon: '📆' },
    { key: 'weekly',   label: 'Weekly',    icon: '📋' },
  ];

  const cardsHtml = periods.map(({ key, label, icon }) => `
    <div class="pay-schedule-card">
      <div class="pay-schedule-label">${icon} ${label}</div>
      <div class="pay-schedule-gross">${formatCurrency(grossSchedule[key])}</div>
      <div class="pay-schedule-divider">↓ take-home</div>
      <div class="pay-schedule-net">${formatCurrency(netSchedule[key])}</div>
    </div>
  `).join('');

  section.innerHTML = `
    <div class="card-header">
      <div class="card-icon green">💰</div>
      <h2>Pay Schedule</h2>
    </div>
    <div class="pay-schedule-grid" role="list" aria-label="Pay schedule by period">
      ${cardsHtml}
    </div>
  `;

  return section;
}
