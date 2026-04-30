/**
 * 2024 State Income Tax Data
 * Sources vary by state — see individual state entries.
 * type: 'none' | 'flat' | 'progressive'
 *
 * ⚠️ DO NOT EDIT without updating source reference and test cases.
 * Progressive brackets: { min, max (null=no limit), rate } in dollars.
 */

export const STATE_TAX_2024 = {
  // ── No Income Tax States ──────────────────────────────────────────────────
  AK: { name: 'Alaska',        type: 'none' },
  FL: { name: 'Florida',       type: 'none' },
  NV: { name: 'Nevada',        type: 'none' },
  NH: { name: 'New Hampshire', type: 'none' }, // interest/dividend only
  SD: { name: 'South Dakota',  type: 'none' },
  TN: { name: 'Tennessee',     type: 'none' },
  TX: { name: 'Texas',         type: 'none' },
  WA: { name: 'Washington',    type: 'none' },
  WY: { name: 'Wyoming',       type: 'none' },

  // ── Flat Rate States ──────────────────────────────────────────────────────
  AZ: { name: 'Arizona',       type: 'flat', rate: 0.025  }, // Source: azdor.gov
  CO: { name: 'Colorado',      type: 'flat', rate: 0.044  }, // Source: colorado.gov
  ID: { name: 'Idaho',         type: 'flat', rate: 0.058  }, // Source: tax.idaho.gov
  IL: { name: 'Illinois',      type: 'flat', rate: 0.0495 }, // Source: tax.illinois.gov
  IN: { name: 'Indiana',       type: 'flat', rate: 0.0305 }, // Source: in.gov/dor
  KY: { name: 'Kentucky',      type: 'flat', rate: 0.045  }, // Source: revenue.ky.gov
  MA: {
    name: 'Massachusetts', type: 'progressive',
    // Source: mass.gov/dor — 5% flat + 4% surtax on income >$1,000,000 (Millionaire's Tax)
    brackets: {
      single: [
        { min: 0,         max: 1_000_000, rate: 0.05  },
        { min: 1_000_000, max: null,      rate: 0.09  }, // 5% + 4% surtax
      ],
      mfj: [
        { min: 0,         max: 1_000_000, rate: 0.05  },
        { min: 1_000_000, max: null,      rate: 0.09  },
      ],
    },
    standardDeduction: { single: 0, mfj: 0, mfs: 0, hoh: 0 }, // MA no standard deduction
  },
  MI: { name: 'Michigan',      type: 'flat', rate: 0.0425 }, // Source: michigan.gov/taxes
  MS: { name: 'Mississippi',   type: 'flat', rate: 0.047  }, // Source: dor.ms.gov
  NC: { name: 'North Carolina',type: 'flat', rate: 0.0450 }, // Source: ncdor.gov
  PA: { name: 'Pennsylvania',  type: 'flat', rate: 0.0307 }, // Source: revenue.pa.gov
  UT: { name: 'Utah',          type: 'flat', rate: 0.0465 }, // Source: tax.utah.gov

  // ── Progressive Rate States ───────────────────────────────────────────────
  AL: {
    name: 'Alabama', type: 'progressive',
    // Source: revenue.alabama.gov
    brackets: {
      single: [
        { min: 0,      max: 500,    rate: 0.02 },
        { min: 500,    max: 3_000,  rate: 0.04 },
        { min: 3_000,  max: null,   rate: 0.05 },
      ],
      mfj: [
        { min: 0,      max: 1_000,  rate: 0.02 },
        { min: 1_000,  max: 6_000,  rate: 0.04 },
        { min: 6_000,  max: null,   rate: 0.05 },
      ],
    },
    standardDeduction: { single: 2_500, mfj: 7_500, mfs: 3_750, hoh: 4_700 },
  },
  AR: {
    name: 'Arkansas', type: 'progressive',
    // Source: dfa.arkansas.gov (2024 top rate 3.9%)
    brackets: {
      single: [
        { min: 0,      max: 4_300,  rate: 0.02 },
        { min: 4_300,  max: 8_500,  rate: 0.04 },
        { min: 8_500,  max: null,   rate: 0.039 },
      ],
      mfj: [
        { min: 0,      max: 4_300,  rate: 0.02 },
        { min: 4_300,  max: 8_500,  rate: 0.04 },
        { min: 8_500,  max: null,   rate: 0.039 },
      ],
    },
    standardDeduction: { single: 2_200, mfj: 4_400, mfs: 2_200, hoh: 2_200 },
  },
  CA: {
    name: 'California', type: 'progressive',
    // Source: ftb.ca.gov — 2024 rates
    brackets: {
      single: [
        { min: 0,          max: 10_412,    rate: 0.01   },
        { min: 10_412,     max: 24_684,    rate: 0.02   },
        { min: 24_684,     max: 38_959,    rate: 0.04   },
        { min: 38_959,     max: 54_081,    rate: 0.06   },
        { min: 54_081,     max: 68_350,    rate: 0.08   },
        { min: 68_350,     max: 349_137,   rate: 0.093  },
        { min: 349_137,    max: 418_961,   rate: 0.103  },
        { min: 418_961,    max: 698_274,   rate: 0.113  },
        { min: 698_274,    max: 1_000_000, rate: 0.123  },
        { min: 1_000_000,  max: null,      rate: 0.133  }, // Mental Health Services Tax
      ],
      mfj: [
        { min: 0,          max: 20_824,    rate: 0.01   },
        { min: 20_824,     max: 49_368,    rate: 0.02   },
        { min: 49_368,     max: 77_918,    rate: 0.04   },
        { min: 77_918,     max: 108_162,   rate: 0.06   },
        { min: 108_162,    max: 136_700,   rate: 0.08   },
        { min: 136_700,    max: 698_274,   rate: 0.093  },
        { min: 698_274,    max: 837_922,   rate: 0.103  },
        { min: 837_922,    max: 1_000_000, rate: 0.113  },
        { min: 1_000_000,  max: 1_396_542, rate: 0.123  },
        { min: 1_396_542,  max: null,      rate: 0.133  },
      ],
    },
    standardDeduction: { single: 5_202, mfj: 10_404, mfs: 5_202, hoh: 10_404 },
  },
  CT: {
    name: 'Connecticut', type: 'progressive',
    // Source: portal.ct.gov/DRS
    brackets: {
      single: [
        { min: 0,       max: 10_000,  rate: 0.03   },
        { min: 10_000,  max: 50_000,  rate: 0.05   },
        { min: 50_000,  max: 100_000, rate: 0.055  },
        { min: 100_000, max: 200_000, rate: 0.06   },
        { min: 200_000, max: 250_000, rate: 0.065  },
        { min: 250_000, max: 500_000, rate: 0.069  },
        { min: 500_000, max: null,    rate: 0.0699 },
      ],
      mfj: [
        { min: 0,       max: 20_000,  rate: 0.03   },
        { min: 20_000,  max: 100_000, rate: 0.05   },
        { min: 100_000, max: 200_000, rate: 0.055  },
        { min: 200_000, max: 400_000, rate: 0.06   },
        { min: 400_000, max: 500_000, rate: 0.065  },
        { min: 500_000, max: 1_000_000, rate: 0.069 },
        { min: 1_000_000, max: null,  rate: 0.0699 },
      ],
    },
    standardDeduction: { single: 15_000, mfj: 24_000, mfs: 12_000, hoh: 19_000 },
  },
  DC: {
    name: 'District of Columbia', type: 'progressive',
    // Source: otr.cfo.dc.gov
    brackets: {
      single: [
        { min: 0,       max: 10_000,  rate: 0.04   },
        { min: 10_000,  max: 40_000,  rate: 0.06   },
        { min: 40_000,  max: 60_000,  rate: 0.065  },
        { min: 60_000,  max: 250_000, rate: 0.085  },
        { min: 250_000, max: 500_000, rate: 0.0925 },
        { min: 500_000, max: 1_000_000, rate: 0.0975 },
        { min: 1_000_000, max: null,  rate: 0.1075 },
      ],
      mfj: [
        { min: 0,       max: 10_000,  rate: 0.04   },
        { min: 10_000,  max: 40_000,  rate: 0.06   },
        { min: 40_000,  max: 60_000,  rate: 0.065  },
        { min: 60_000,  max: 250_000, rate: 0.085  },
        { min: 250_000, max: 500_000, rate: 0.0925 },
        { min: 500_000, max: 1_000_000, rate: 0.0975 },
        { min: 1_000_000, max: null,  rate: 0.1075 },
      ],
    },
    standardDeduction: { single: 12_950, mfj: 25_900, mfs: 12_950, hoh: 19_400 },
  },
  DE: {
    name: 'Delaware', type: 'progressive',
    // Source: revenue.delaware.gov
    brackets: {
      single: [
        { min: 2_000,  max: 5_000,  rate: 0.022 },
        { min: 5_000,  max: 10_000, rate: 0.039 },
        { min: 10_000, max: 20_000, rate: 0.048 },
        { min: 20_000, max: 25_000, rate: 0.052 },
        { min: 25_000, max: 60_000, rate: 0.0555 },
        { min: 60_000, max: null,   rate: 0.066 },
      ],
      mfj: [
        { min: 2_000,  max: 5_000,  rate: 0.022 },
        { min: 5_000,  max: 10_000, rate: 0.039 },
        { min: 10_000, max: 20_000, rate: 0.048 },
        { min: 20_000, max: 25_000, rate: 0.052 },
        { min: 25_000, max: 60_000, rate: 0.0555 },
        { min: 60_000, max: null,   rate: 0.066 },
      ],
    },
    standardDeduction: { single: 3_250, mfj: 6_500, mfs: 3_250, hoh: 3_250 },
  },
  GA: {
    name: 'Georgia', type: 'flat',  // Moved to flat in 2024
    // Source: dor.georgia.gov (5.49% flat rate 2024)
    rate: 0.0549,
  },
  HI: {
    name: 'Hawaii', type: 'progressive',
    // Source: tax.hawaii.gov
    brackets: {
      single: [
        { min: 0,       max: 2_400,   rate: 0.014 },
        { min: 2_400,   max: 4_800,   rate: 0.032 },
        { min: 4_800,   max: 9_600,   rate: 0.055 },
        { min: 9_600,   max: 14_400,  rate: 0.064 },
        { min: 14_400,  max: 19_200,  rate: 0.068 },
        { min: 19_200,  max: 24_000,  rate: 0.072 },
        { min: 24_000,  max: 48_000,  rate: 0.076 },
        { min: 48_000,  max: 150_000, rate: 0.079 },
        { min: 150_000, max: 175_000, rate: 0.0825 },
        { min: 175_000, max: 200_000, rate: 0.09  },
        { min: 200_000, max: null,    rate: 0.11  },
      ],
      mfj: [
        { min: 0,       max: 4_800,   rate: 0.014 },
        { min: 4_800,   max: 9_600,   rate: 0.032 },
        { min: 9_600,   max: 19_200,  rate: 0.055 },
        { min: 19_200,  max: 28_800,  rate: 0.064 },
        { min: 28_800,  max: 38_400,  rate: 0.068 },
        { min: 38_400,  max: 48_000,  rate: 0.072 },
        { min: 48_000,  max: 96_000,  rate: 0.076 },
        { min: 96_000,  max: 300_000, rate: 0.079 },
        { min: 300_000, max: 350_000, rate: 0.0825 },
        { min: 350_000, max: 400_000, rate: 0.09  },
        { min: 400_000, max: null,    rate: 0.11  },
      ],
    },
    standardDeduction: { single: 2_200, mfj: 4_400, mfs: 2_200, hoh: 3_212 },
  },
  IA: {
    name: 'Iowa', type: 'flat', // Flat as of 2024
    // Source: tax.iowa.gov (5.7% flat in 2024, moving to 3.9% by 2026)
    rate: 0.057,
  },
  KS: {
    name: 'Kansas', type: 'progressive',
    // Source: ksrevenue.gov
    brackets: {
      single: [
        { min: 0,       max: 15_000, rate: 0.031 },
        { min: 15_000,  max: 30_000, rate: 0.0525 },
        { min: 30_000,  max: null,   rate: 0.057 },
      ],
      mfj: [
        { min: 0,       max: 30_000, rate: 0.031 },
        { min: 30_000,  max: 60_000, rate: 0.0525 },
        { min: 60_000,  max: null,   rate: 0.057 },
      ],
    },
    standardDeduction: { single: 3_500, mfj: 8_000, mfs: 4_000, hoh: 6_000 },
  },
  LA: {
    name: 'Louisiana', type: 'progressive',
    // Source: revenue.louisiana.gov
    brackets: {
      single: [
        { min: 0,       max: 12_500, rate: 0.0185 },
        { min: 12_500,  max: 50_000, rate: 0.035  },
        { min: 50_000,  max: null,   rate: 0.0425 },
      ],
      mfj: [
        { min: 0,       max: 25_000, rate: 0.0185 },
        { min: 25_000,  max: 100_000, rate: 0.035 },
        { min: 100_000, max: null,   rate: 0.0425 },
      ],
    },
    standardDeduction: { single: 4_500, mfj: 9_000, mfs: 4_500, hoh: 4_500 },
  },
  ME: {
    name: 'Maine', type: 'progressive',
    // Source: maine.gov/revenue
    brackets: {
      single: [
        { min: 0,       max: 24_500,  rate: 0.058 },
        { min: 24_500,  max: 58_050,  rate: 0.0675 },
        { min: 58_050,  max: null,    rate: 0.0715 },
      ],
      mfj: [
        { min: 0,       max: 49_050,  rate: 0.058 },
        { min: 49_050,  max: 116_100, rate: 0.0675 },
        { min: 116_100, max: null,    rate: 0.0715 },
      ],
    },
    standardDeduction: { single: 14_600, mfj: 29_200, mfs: 14_600, hoh: 21_900 },
  },
  MD: {
    name: 'Maryland', type: 'progressive',
    // Source: marylandtaxes.gov
    brackets: {
      single: [
        { min: 0,       max: 1_000,   rate: 0.02   },
        { min: 1_000,   max: 2_000,   rate: 0.03   },
        { min: 2_000,   max: 3_000,   rate: 0.04   },
        { min: 3_000,   max: 100_000, rate: 0.0475 },
        { min: 100_000, max: 125_000, rate: 0.05   },
        { min: 125_000, max: 150_000, rate: 0.0525 },
        { min: 150_000, max: 250_000, rate: 0.055  },
        { min: 250_000, max: null,    rate: 0.0575 },
      ],
      mfj: [
        { min: 0,       max: 1_000,   rate: 0.02   },
        { min: 1_000,   max: 2_000,   rate: 0.03   },
        { min: 2_000,   max: 3_000,   rate: 0.04   },
        { min: 3_000,   max: 150_000, rate: 0.0475 },
        { min: 150_000, max: 175_000, rate: 0.05   },
        { min: 175_000, max: 225_000, rate: 0.0525 },
        { min: 225_000, max: 300_000, rate: 0.055  },
        { min: 300_000, max: null,    rate: 0.0575 },
      ],
    },
    standardDeduction: { single: 2_400, mfj: 4_800, mfs: 2_400, hoh: 2_400 },
  },
  MN: {
    name: 'Minnesota', type: 'progressive',
    // Source: revenue.state.mn.us
    brackets: {
      single: [
        { min: 0,       max: 30_070,  rate: 0.0535 },
        { min: 30_070,  max: 98_760,  rate: 0.068  },
        { min: 98_760,  max: 183_340, rate: 0.0785 },
        { min: 183_340, max: null,    rate: 0.0985 },
      ],
      mfj: [
        { min: 0,       max: 43_950,  rate: 0.0535 },
        { min: 43_950,  max: 174_610, rate: 0.068  },
        { min: 174_610, max: 304_970, rate: 0.0785 },
        { min: 304_970, max: null,    rate: 0.0985 },
      ],
    },
    standardDeduction: { single: 14_575, mfj: 29_150, mfs: 14_575, hoh: 21_900 },
  },
  MO: {
    name: 'Missouri', type: 'progressive',
    // Source: dor.mo.gov (top rate 4.95% in 2024)
    brackets: {
      single: [
        { min: 0,      max: 1_121,   rate: 0.015  },
        { min: 1_121,  max: 2_242,   rate: 0.02   },
        { min: 2_242,  max: 3_363,   rate: 0.025  },
        { min: 3_363,  max: 4_484,   rate: 0.03   },
        { min: 4_484,  max: 5_605,   rate: 0.035  },
        { min: 5_605,  max: 6_726,   rate: 0.04   },
        { min: 6_726,  max: 7_847,   rate: 0.045  },
        { min: 7_847,  max: null,    rate: 0.0495 },
      ],
      mfj: [
        { min: 0,      max: 1_121,   rate: 0.015  },
        { min: 1_121,  max: 2_242,   rate: 0.02   },
        { min: 2_242,  max: 3_363,   rate: 0.025  },
        { min: 3_363,  max: 4_484,   rate: 0.03   },
        { min: 4_484,  max: 5_605,   rate: 0.035  },
        { min: 5_605,  max: 6_726,   rate: 0.04   },
        { min: 6_726,  max: 7_847,   rate: 0.045  },
        { min: 7_847,  max: null,    rate: 0.0495 },
      ],
    },
    standardDeduction: { single: 14_600, mfj: 29_200, mfs: 14_600, hoh: 21_900 },
  },
  MT: {
    name: 'Montana', type: 'progressive',
    // Source: mtrevenue.gov (top rate 5.9% in 2024)
    brackets: {
      single: [
        { min: 0,       max: 3_600,   rate: 0.01  },
        { min: 3_600,   max: 6_300,   rate: 0.02  },
        { min: 6_300,   max: 9_700,   rate: 0.03  },
        { min: 9_700,   max: 13_000,  rate: 0.04  },
        { min: 13_000,  max: 16_800,  rate: 0.05  },
        { min: 16_800,  max: 21_600,  rate: 0.06  },
        { min: 21_600,  max: null,    rate: 0.069 }, // top rate 6.9%
      ],
      mfj: [
        { min: 0,       max: 3_600,   rate: 0.01  },
        { min: 3_600,   max: 6_300,   rate: 0.02  },
        { min: 6_300,   max: 9_700,   rate: 0.03  },
        { min: 9_700,   max: 13_000,  rate: 0.04  },
        { min: 13_000,  max: 16_800,  rate: 0.05  },
        { min: 16_800,  max: 21_600,  rate: 0.06  },
        { min: 21_600,  max: null,    rate: 0.069 }, // top rate 6.9%
      ],
    },
    standardDeduction: { single: 5_540, mfj: 11_080, mfs: 5_540, hoh: 5_540 },
  },
  NE: {
    name: 'Nebraska', type: 'progressive',
    // Source: revenue.nebraska.gov (top rate 5.84% in 2024)
    brackets: {
      single: [
        { min: 0,       max: 3_700,   rate: 0.0246 },
        { min: 3_700,   max: 22_170,  rate: 0.0351 },
        { min: 22_170,  max: 35_730,  rate: 0.0501 },
        { min: 35_730,  max: null,    rate: 0.0584 },
      ],
      mfj: [
        { min: 0,       max: 7_390,   rate: 0.0246 },
        { min: 7_390,   max: 44_350,  rate: 0.0351 },
        { min: 44_350,  max: 71_460,  rate: 0.0501 },
        { min: 71_460,  max: null,    rate: 0.0584 },
      ],
    },
    standardDeduction: { single: 7_900, mfj: 15_800, mfs: 7_900, hoh: 7_900 },
  },
  NJ: {
    name: 'New Jersey', type: 'progressive',
    // Source: nj.gov/treasury/taxation
    brackets: {
      single: [
        { min: 0,       max: 20_000,  rate: 0.014  },
        { min: 20_000,  max: 35_000,  rate: 0.0175 },
        { min: 35_000,  max: 40_000,  rate: 0.035  },
        { min: 40_000,  max: 75_000,  rate: 0.05525},
        { min: 75_000,  max: 500_000, rate: 0.0637 },
        { min: 500_000, max: 1_000_000, rate: 0.0897 },
        { min: 1_000_000, max: null,  rate: 0.1075 },
      ],
      mfj: [
        { min: 0,       max: 20_000,  rate: 0.014  },
        { min: 20_000,  max: 50_000,  rate: 0.0175 },
        { min: 50_000,  max: 70_000,  rate: 0.0245 },
        { min: 70_000,  max: 80_000,  rate: 0.035  },
        { min: 80_000,  max: 150_000, rate: 0.05525},
        { min: 150_000, max: 500_000, rate: 0.0637 },
        { min: 500_000, max: 1_000_000, rate: 0.0897 },
        { min: 1_000_000, max: null,  rate: 0.1075 },
      ],
    },
    standardDeduction: { single: 0, mfj: 0, mfs: 0, hoh: 0 }, // NJ no standard deduction
  },
  NM: {
    name: 'New Mexico', type: 'progressive',
    // Source: tax.newmexico.gov
    brackets: {
      single: [
        { min: 0,       max: 5_500,   rate: 0.017  },
        { min: 5_500,   max: 11_000,  rate: 0.032  },
        { min: 11_000,  max: 16_000,  rate: 0.047  },
        { min: 16_000,  max: 210_000, rate: 0.049  },
        { min: 210_000, max: null,    rate: 0.059  },
      ],
      mfj: [
        { min: 0,       max: 8_000,   rate: 0.017  },
        { min: 8_000,   max: 16_000,  rate: 0.032  },
        { min: 16_000,  max: 24_000,  rate: 0.047  },
        { min: 24_000,  max: 315_000, rate: 0.049  },
        { min: 315_000, max: null,    rate: 0.059  },
      ],
    },
    standardDeduction: { single: 14_600, mfj: 29_200, mfs: 14_600, hoh: 21_900 },
  },
  NY: {
    name: 'New York', type: 'progressive',
    // Source: tax.ny.gov (2024 rates)
    brackets: {
      single: [
        { min: 0,        max: 17_150,  rate: 0.04   },
        { min: 17_150,   max: 23_600,  rate: 0.045  },
        { min: 23_600,   max: 27_900,  rate: 0.0525 },
        { min: 27_900,   max: 161_550, rate: 0.0585 },
        { min: 161_550,  max: 323_200, rate: 0.0625 },
        { min: 323_200,  max: 2_155_350, rate: 0.0685 },
        { min: 2_155_350, max: 5_000_000, rate: 0.0965 },
        { min: 5_000_000, max: 25_000_000, rate: 0.103 },
        { min: 25_000_000, max: null,  rate: 0.109  },
      ],
      mfj: [
        { min: 0,        max: 27_900,  rate: 0.04   },
        { min: 27_900,   max: 43_000,  rate: 0.045  },
        { min: 43_000,   max: 161_550, rate: 0.0525 },
        { min: 161_550,  max: 323_200, rate: 0.0585 },
        { min: 323_200,  max: 2_155_350, rate: 0.0625 },
        { min: 2_155_350, max: 5_000_000, rate: 0.0685 },
        { min: 5_000_000, max: 25_000_000, rate: 0.0965 },
        { min: 25_000_000, max: null,  rate: 0.103  },
      ],
    },
    standardDeduction: { single: 8_000, mfj: 16_050, mfs: 8_000, hoh: 11_200 },
  },
  ND: {
    name: 'North Dakota', type: 'progressive',
    // Source: nd.gov/tax (top rate 2.5% in 2024)
    brackets: {
      single: [
        { min: 0,        max: 44_725,  rate: 0.0195 },
        { min: 44_725,   max: 225_975, rate: 0.0213 },
        { min: 225_975,  max: null,    rate: 0.025  },
      ],
      mfj: [
        { min: 0,        max: 74_750,  rate: 0.0195 },
        { min: 74_750,   max: 275_925, rate: 0.0213 },
        { min: 275_925,  max: null,    rate: 0.025  },
      ],
    },
    standardDeduction: { single: 14_600, mfj: 29_200, mfs: 14_600, hoh: 21_900 },
  },
  OH: {
    name: 'Ohio', type: 'progressive',
    // Source: tax.ohio.gov (top rate 3.75% in 2024)
    brackets: {
      single: [
        { min: 0,        max: 26_050,  rate: 0       },
        { min: 26_050,   max: 100_000, rate: 0.02765 },
        { min: 100_000,  max: null,    rate: 0.0375  },
      ],
      mfj: [
        { min: 0,        max: 26_050,  rate: 0       },
        { min: 26_050,   max: 100_000, rate: 0.02765 },
        { min: 100_000,  max: null,    rate: 0.0375  },
      ],
    },
    standardDeduction: { single: 2_400, mfj: 4_800, mfs: 2_400, hoh: 2_400 },
  },
  OK: {
    name: 'Oklahoma', type: 'progressive',
    // Source: tax.ok.gov (top rate 4.75% in 2024)
    brackets: {
      single: [
        { min: 0,      max: 1_000,   rate: 0.0025 },
        { min: 1_000,  max: 2_500,   rate: 0.0075 },
        { min: 2_500,  max: 3_750,   rate: 0.0175 },
        { min: 3_750,  max: 4_900,   rate: 0.0275 },
        { min: 4_900,  max: 7_200,   rate: 0.0375 },
        { min: 7_200,  max: null,    rate: 0.0475 },
      ],
      mfj: [
        { min: 0,      max: 2_000,   rate: 0.0025 },
        { min: 2_000,  max: 5_000,   rate: 0.0075 },
        { min: 5_000,  max: 7_500,   rate: 0.0175 },
        { min: 7_500,  max: 9_800,   rate: 0.0275 },
        { min: 9_800,  max: 12_200,  rate: 0.0375 },
        { min: 12_200, max: null,    rate: 0.0475 },
      ],
    },
    standardDeduction: { single: 6_350, mfj: 12_700, mfs: 6_350, hoh: 9_350 },
  },
  OR: {
    name: 'Oregon', type: 'progressive',
    // Source: oregon.gov/dor (top rate 9.9% in 2024)
    brackets: {
      single: [
        { min: 0,        max: 4_050,   rate: 0.0475 },
        { min: 4_050,    max: 10_200,  rate: 0.0675 },
        { min: 10_200,   max: 125_000, rate: 0.0875 },
        { min: 125_000,  max: null,    rate: 0.099  },
      ],
      mfj: [
        { min: 0,        max: 8_100,   rate: 0.0475 },
        { min: 8_100,    max: 20_400,  rate: 0.0675 },
        { min: 20_400,   max: 250_000, rate: 0.0875 },
        { min: 250_000,  max: null,    rate: 0.099  },
      ],
    },
    standardDeduction: { single: 2_420, mfj: 4_840, mfs: 2_420, hoh: 4_840 },
  },
  RI: {
    name: 'Rhode Island', type: 'progressive',
    // Source: tax.ri.gov
    brackets: {
      single: [
        { min: 0,        max: 73_450,  rate: 0.0375 },
        { min: 73_450,   max: 166_950, rate: 0.0475 },
        { min: 166_950,  max: null,    rate: 0.0599 },
      ],
      mfj: [
        { min: 0,        max: 73_450,  rate: 0.0375 },
        { min: 73_450,   max: 166_950, rate: 0.0475 },
        { min: 166_950,  max: null,    rate: 0.0599 },
      ],
    },
    standardDeduction: { single: 10_550, mfj: 21_150, mfs: 10_550, hoh: 10_550 },
  },
  SC: {
    name: 'South Carolina', type: 'progressive',
    // Source: dor.sc.gov (top rate 6.4% in 2024)
    brackets: {
      single: [
        { min: 0,       max: 3_460,   rate: 0     },
        { min: 3_460,   max: 17_330,  rate: 0.03  },
        { min: 17_330,  max: null,    rate: 0.064 },
      ],
      mfj: [
        { min: 0,       max: 3_460,   rate: 0     },
        { min: 3_460,   max: 17_330,  rate: 0.03  },
        { min: 17_330,  max: null,    rate: 0.064 },
      ],
    },
    standardDeduction: { single: 14_600, mfj: 29_200, mfs: 14_600, hoh: 21_900 },
  },
  VT: {
    name: 'Vermont', type: 'progressive',
    // Source: tax.vermont.gov (top rate 8.75% in 2024)
    brackets: {
      single: [
        { min: 0,        max: 45_400,  rate: 0.0335 },
        { min: 45_400,   max: 110_050, rate: 0.066  },
        { min: 110_050,  max: 229_550, rate: 0.076  },
        { min: 229_550,  max: null,    rate: 0.0875 },
      ],
      mfj: [
        { min: 0,        max: 75_850,  rate: 0.0335 },
        { min: 75_850,   max: 183_400, rate: 0.066  },
        { min: 183_400,  max: 279_450, rate: 0.076  },
        { min: 279_450,  max: null,    rate: 0.0875 },
      ],
    },
    standardDeduction: { single: 7_000, mfj: 14_050, mfs: 7_000, hoh: 7_000 },
  },
  VA: {
    name: 'Virginia', type: 'progressive',
    // Source: tax.virginia.gov (top rate 5.75% in 2024)
    brackets: {
      single: [
        { min: 0,      max: 3_000,   rate: 0.02   },
        { min: 3_000,  max: 5_000,   rate: 0.03   },
        { min: 5_000,  max: 17_000,  rate: 0.05   },
        { min: 17_000, max: null,    rate: 0.0575 },
      ],
      mfj: [
        { min: 0,      max: 3_000,   rate: 0.02   },
        { min: 3_000,  max: 5_000,   rate: 0.03   },
        { min: 5_000,  max: 17_000,  rate: 0.05   },
        { min: 17_000, max: null,    rate: 0.0575 },
      ],
    },
    standardDeduction: { single: 8_000, mfj: 16_000, mfs: 8_000, hoh: 8_000 },
  },
  WI: {
    name: 'Wisconsin', type: 'progressive',
    // Source: revenue.wi.gov (top rate 7.65% in 2024)
    brackets: {
      single: [
        { min: 0,        max: 14_320,  rate: 0.0354 },
        { min: 14_320,   max: 28_640,  rate: 0.0465 },
        { min: 28_640,   max: 315_310, rate: 0.053  },
        { min: 315_310,  max: null,    rate: 0.0765 },
      ],
      mfj: [
        { min: 0,        max: 19_090,  rate: 0.0354 },
        { min: 19_090,   max: 38_190,  rate: 0.0465 },
        { min: 38_190,   max: 420_420, rate: 0.053  },
        { min: 420_420,  max: null,    rate: 0.0765 },
      ],
    },
    standardDeduction: { single: 14_600, mfj: 29_200, mfs: 14_600, hoh: 21_900 },
  },
  WV: {
    name: 'West Virginia', type: 'progressive',
    // Source: tax.wv.gov (top rate 5.12% in 2024, reducing over years)
    brackets: {
      single: [
        { min: 0,       max: 10_000,  rate: 0.03   },
        { min: 10_000,  max: 25_000,  rate: 0.04   },
        { min: 25_000,  max: 40_000,  rate: 0.045  },
        { min: 40_000,  max: 60_000,  rate: 0.06   },
        { min: 60_000,  max: null,    rate: 0.065  },
      ],
      mfj: [
        { min: 0,       max: 10_000,  rate: 0.03   },
        { min: 10_000,  max: 25_000,  rate: 0.04   },
        { min: 25_000,  max: 40_000,  rate: 0.045  },
        { min: 40_000,  max: 60_000,  rate: 0.06   },
        { min: 60_000,  max: null,    rate: 0.065  },
      ],
    },
    standardDeduction: { single: 0, mfj: 0, mfs: 0, hoh: 0 },
  },
};

/**
 * 주 코드 → 주 이름 매핑 (드롭다운 정렬용)
 */
export const STATE_LIST = Object.entries(STATE_TAX_2024)
  .map(([code, data]) => ({ code, name: data.name }))
  .sort((a, b) => a.name.localeCompare(b.name));
