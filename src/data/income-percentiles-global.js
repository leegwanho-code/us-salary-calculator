/**
 * Global Income Percentile Breakpoints (2024)
 *
 * Sources:
 *  - World Bank Poverty and Inequality Platform (PIP), 2022 data
 *    https://pip.worldbank.org/
 *  - Giving What We Can "How Rich Am I?" methodology
 *    https://www.givingwhatwecan.org/how-rich-am-i
 *  - Our World in Data — Global income distribution
 *    https://ourworldindata.org/global-economic-inequality
 *
 * ⚠️ Figures are USD per year, NOT PPP-adjusted.
 *    PPP adjustment would show even higher global percentile for US earners.
 *    We intentionally use nominal USD to be conservative.
 *
 * ⚠️ DO NOT EDIT without updating source reference and test cases.
 * Format: [gross_annual_income_usd, percentile_rank (0–100)]
 * percentile_rank = "earns more than X% of world's population"
 */
export const GLOBAL_INCOME_PERCENTILES = [
  //  income (USD/yr),  percentile (earns more than X% of world)
  [          200,   10 ],
  [          500,   20 ],
  [          800,   30 ],
  [        1_200,   40 ],
  [        1_900,   50 ],   // ← global median ~$1,900/yr (nominal USD)
  [        2_800,   60 ],
  [        4_200,   70 ],
  [        7_000,   80 ],
  [       11_000,   85 ],
  [       14_500,   90 ],   // ← global top 10% threshold
  [       20_000,   93 ],
  [       28_000,   95 ],
  [       40_000,   97 ],
  [       60_000,   99 ],   // ← global top 1% threshold (~$60k nominal USD)
  [       90_000,   99.5],
  [      150_000,   99.8],
  [      300_000,   99.9],
  [    1_000_000,   99.99],
];

/**
 * 전 세계 소득 분위 라벨 + 맥락 메시지
 * @type {Array<{minPercentile: number, label: string, emoji: string, context: string}>}
 */
export const GLOBAL_PERCENTILE_LABELS = [
  {
    minPercentile: 99,
    label:   'Global top 1%',
    emoji:   '🌍🏆',
    context: 'You earn more than 99% of the world\'s population.',
  },
  {
    minPercentile: 95,
    label:   'Global top 5%',
    emoji:   '🌍⭐',
    context: 'You\'re among the world\'s highest earners.',
  },
  {
    minPercentile: 90,
    label:   'Global top 10%',
    emoji:   '🌍🎯',
    context: 'You outpace 9 out of 10 people worldwide.',
  },
  {
    minPercentile: 75,
    label:   'Global top 25%',
    emoji:   '🌍📈',
    context: 'You\'re well above the global average.',
  },
  {
    minPercentile: 50,
    label:   'Above global median',
    emoji:   '🌍👍',
    context: 'You earn more than half the world\'s population.',
  },
  {
    minPercentile: 0,
    label:   'Below global median',
    emoji:   '🌍',
    context: 'Most US workers still rank above the global median.',
  },
];

/**
 * 전세계 인구 대비 흥미 팩트 (percentile 기반 선택)
 */
export const GLOBAL_FUN_FACTS = [
  {
    minPercentile: 99,
    fact: 'If the world were 100 people, only 1 would earn as much as you.',
  },
  {
    minPercentile: 90,
    fact: 'Your annual income exceeds what the average person in many countries earns in a decade.',
  },
  {
    minPercentile: 75,
    fact: 'The global median daily wage is about $5. You earn that in minutes.',
  },
  {
    minPercentile: 50,
    fact: 'Over 3.5 billion people live on less than $6.85 per day (World Bank poverty line).',
  },
  {
    minPercentile: 0,
    fact: 'Even at this income, you likely have access to clean water, electricity, and healthcare that billions lack.',
  },
];
