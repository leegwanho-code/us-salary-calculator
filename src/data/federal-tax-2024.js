/**
 * 2024 Federal Income Tax Data
 * Source: https://www.irs.gov/newsroom/irs-provides-tax-inflation-adjustments-for-tax-year-2024
 * Revenue Procedure 2023-34
 *
 * ⚠️ DO NOT EDIT without updating source reference and test cases.
 */

/**
 * Standard deductions by filing status (dollars)
 * @type {Record<string, number>}
 */
export const STANDARD_DEDUCTIONS = {
  single: 14_600,
  mfj: 29_200,    // Married Filing Jointly
  mfs: 14_600,    // Married Filing Separately
  hoh: 21_900,    // Head of Household
};

/**
 * Tax brackets by filing status.
 * Each bracket: { min, max (null = no limit), rate }
 * min/max are in dollars (not cents).
 * @type {Record<string, Array<{min: number, max: number|null, rate: number}>>}
 */
export const FEDERAL_BRACKETS = {
  single: [
    { min: 0,       max: 11_600,  rate: 0.10 },
    { min: 11_600,  max: 47_150,  rate: 0.12 },
    { min: 47_150,  max: 100_525, rate: 0.22 },
    { min: 100_525, max: 191_950, rate: 0.24 },
    { min: 191_950, max: 243_725, rate: 0.32 },
    { min: 243_725, max: 609_350, rate: 0.35 },
    { min: 609_350, max: null,    rate: 0.37 },
  ],
  mfj: [
    { min: 0,       max: 23_200,  rate: 0.10 },
    { min: 23_200,  max: 94_300,  rate: 0.12 },
    { min: 94_300,  max: 201_050, rate: 0.22 },
    { min: 201_050, max: 383_900, rate: 0.24 },
    { min: 383_900, max: 487_450, rate: 0.32 },
    { min: 487_450, max: 731_200, rate: 0.35 },
    { min: 731_200, max: null,    rate: 0.37 },
  ],
  mfs: [
    { min: 0,       max: 11_600,  rate: 0.10 },
    { min: 11_600,  max: 47_150,  rate: 0.12 },
    { min: 47_150,  max: 100_525, rate: 0.22 },
    { min: 100_525, max: 191_950, rate: 0.24 },
    { min: 191_950, max: 243_725, rate: 0.32 },
    { min: 243_725, max: 365_600, rate: 0.35 },
    { min: 365_600, max: null,    rate: 0.37 },
  ],
  hoh: [
    { min: 0,       max: 16_550,  rate: 0.10 },
    { min: 16_550,  max: 63_100,  rate: 0.12 },
    { min: 63_100,  max: 100_500, rate: 0.22 },
    { min: 100_500, max: 191_950, rate: 0.24 },
    { min: 191_950, max: 243_700, rate: 0.32 },
    { min: 243_700, max: 609_350, rate: 0.35 },
    { min: 609_350, max: null,    rate: 0.37 },
  ],
};
