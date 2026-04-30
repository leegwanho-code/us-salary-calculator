/**
 * US Income Percentile Breakpoints (2024 estimates)
 *
 * Sources:
 *  - IRS Statistics of Income (SOI) 2022 Individual Income Tax Returns
 *    https://www.irs.gov/statistics/soi-tax-stats-individual-income-tax-returns-publication-1304
 *  - U.S. Census Bureau, Current Population Survey 2023
 *    https://www.census.gov/topics/income-poverty/income.html
 *  - Pew Research Center income calculator methodology
 *
 * All figures are GROSS annual income in USD (2024 adjusted from 2022 base).
 * Inflation adjustment factor applied: ~1.08× (2022→2024 CPI adjustment).
 *
 * ⚠️ DO NOT EDIT without updating source reference and test cases.
 * Format: [gross_annual_income_dollars, percentile_rank (0–100)]
 * percentile_rank = "earns more than X% of US income earners"
 */
export const US_INCOME_PERCENTILES = [
  //  income ($),  percentile (earns more than X%)
  [       1_000,   5  ],
  [       5_000,  10  ],
  [      10_000,  15  ],
  [      15_000,  20  ],
  [      20_000,  27  ],
  [      25_000,  33  ],
  [      30_000,  38  ],
  [      35_000,  43  ],
  [      40_000,  48  ],
  [      46_000,  50  ],  // ← 2024 US median household income
  [      50_000,  54  ],
  [      60_000,  60  ],
  [      70_000,  65  ],
  [      80_000,  69  ],
  [      90_000,  73  ],
  [     100_000,  76  ],
  [     120_000,  80  ],
  [     141_000,  85  ],  // ← top 10% threshold
  [     175_000,  88  ],
  [     220_000,  90  ],  // ← top 5% threshold (IRS 2022, CPI-adjusted)
  [     300_000,  93  ],
  [     400_000,  96  ],
  [     548_000,  99  ],  // ← top 1% threshold
  [     750_000,  99.5],
  [   1_000_000,  99.7],
  [   1_500_000,  99.9],
  [   5_000_000,  99.99],
];

/**
 * 미국 소득 분위 라벨
 * @type {Array<{minPercentile: number, label: string, emoji: string}>}
 */
export const US_PERCENTILE_LABELS = [
  { minPercentile: 99,  label: 'Top 1% earner',         emoji: '🏆' },
  { minPercentile: 95,  label: 'Top 5% earner',         emoji: '⭐' },
  { minPercentile: 90,  label: 'Top 10% earner',        emoji: '🎯' },
  { minPercentile: 75,  label: 'Top 25% earner',        emoji: '📈' },
  { minPercentile: 50,  label: 'Above-median earner',   emoji: '👍' },
  { minPercentile: 25,  label: 'Below-median earner',   emoji: '💼' },
  { minPercentile: 0,   label: 'Lower-income earner',   emoji: '💪' },
];
