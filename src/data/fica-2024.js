/**
 * 2024 FICA (Federal Insurance Contributions Act) Data
 * Source: https://www.irs.gov/taxtopics/tc751
 * SSA: https://www.ssa.gov/oact/cola/cbb.html
 *
 * ⚠️ DO NOT EDIT without updating source reference and test cases.
 */

export const FICA_2024 = {
  /** Social Security employee rate */
  SS_RATE: 0.062,

  /** Social Security wage base limit (dollars) */
  SS_WAGE_BASE: 168_600,

  /** Medicare employee rate */
  MEDICARE_RATE: 0.0145,

  /** Additional Medicare rate (above threshold) */
  ADDITIONAL_MEDICARE_RATE: 0.009,

  /**
   * Additional Medicare threshold by filing status (dollars)
   * Source: https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax
   */
  ADDITIONAL_MEDICARE_THRESHOLD: {
    single: 200_000,
    mfj:    250_000,
    mfs:    125_000,
    hoh:    200_000,
  },
};
