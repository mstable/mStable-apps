import { BigDecimal } from '@apps/bigdecimal'

import { getPriceImpact } from './getPriceImpact'

describe('getPriceImpact', () => {
  const makeAssertion = (
    {
      inputLow,
      inputHigh,
      outputLow,
      outputHigh,
      lpPriceAdjustment,
      reverse,
    }: {
      inputLow: number
      inputHigh: number
      outputLow: number
      outputHigh: number
      lpPriceAdjustment?: { price: number; isInput: boolean }
      reverse?: boolean
    },
    expectation: { distancePercentage: string; impactPercentage: string; showImpactWarning: boolean },
  ) => {
    const result = getPriceImpact(
      // Just format the simple parameters
      [BigDecimal.fromSimple(inputLow), BigDecimal.fromSimple(inputHigh)],
      [BigDecimal.fromSimple(outputLow), BigDecimal.fromSimple(outputHigh)],
      lpPriceAdjustment ? { price: BigDecimal.fromSimple(lpPriceAdjustment.price), isInput: lpPriceAdjustment.isInput } : undefined,
      reverse,
    )

    expect(result.distancePercentage.toFixed(2)).toEqual(expectation.distancePercentage)
    expect(result.impactPercentage.toFixed(2)).toEqual(expectation.impactPercentage)
    expect(result.showImpactWarning).toEqual(expectation.showImpactWarning)
  }

  describe('zero slippage', () => {
    const zeroSlippage = {
      inputHigh: 1,
      inputLow: 1,
      outputLow: 1,
      outputHigh: 1,
    }

    it('should show no impact without LP price adjustment', () => {
      makeAssertion(zeroSlippage, {
        // No impact
        distancePercentage: '0.00',
        impactPercentage: '0.00',
        showImpactWarning: false,
      })
    })

    it('should show no impact for same-priced output', () => {
      makeAssertion(
        {
          ...zeroSlippage,
          lpPriceAdjustment: { isInput: false, price: 1 },
        },
        {
          // No impact
          distancePercentage: '0.00',
          impactPercentage: '0.00',
          showImpactWarning: false,
        },
      )
    })

    it('should show no impact for same-priced input', () => {
      makeAssertion(
        {
          ...zeroSlippage,
          lpPriceAdjustment: { isInput: true, price: 1 },
        },
        {
          // No impact
          distancePercentage: '0.00',
          impactPercentage: '0.00',
          showImpactWarning: false,
        },
      )
    })

    it('should show no impact for overpriced input', () => {
      makeAssertion(
        {
          ...zeroSlippage,
          lpPriceAdjustment: { isInput: true, price: 2 },
        },
        {
          // 1:1, but input is 2x priced, so -50% distance, 0% impact; no warning
          distancePercentage: '-50.00',
          impactPercentage: '0.00',
          showImpactWarning: false,
        },
      )
    })

    it('should show no impact for underpriced input', () => {
      makeAssertion(
        {
          ...zeroSlippage,
          lpPriceAdjustment: { isInput: true, price: 0.5 },
        },
        {
          // 1:1, but input is 0.5x priced, so 100% distance, 0% impact; no warning
          distancePercentage: '100.00',
          impactPercentage: '0.00',
          showImpactWarning: false,
        },
      )
    })

    it('should show no impact for overpriced output', () => {
      makeAssertion(
        {
          ...zeroSlippage,
          lpPriceAdjustment: { isInput: false, price: 2 },
        },
        {
          // 1:1, but output is 2x priced, so 100% distance, 0% impact; no warning
          distancePercentage: '100.00',
          impactPercentage: '0.00',
          showImpactWarning: false,
        },
      )
    })

    it('should show no impact for underpriced output', () => {
      makeAssertion(
        {
          ...zeroSlippage,
          lpPriceAdjustment: { isInput: false, price: 0.5 },
        },
        {
          // 1:1, but output is 0.5x priced, so -50% distance, 0% impact; no warning
          distancePercentage: '-50.00',
          impactPercentage: '0.00',
          showImpactWarning: false,
        },
      )
    })
  })

  describe('with slippage', () => {
    it('should show minor impact without a warning (penalty)', () => {
      makeAssertion(
        {
          inputHigh: 1,
          inputLow: 1,
          outputLow: 0.78,
          outputHigh: 0.8,
        },
        {
          // endRate     = 0.78
          // startRate   = 0.80
          // impact      = 0.02
          // 1.00 - 0.80 = 0.20; -20% distance
          // 0.80 - 0.78 = 0.02;   2% impact
          distancePercentage: '-20.00',
          impactPercentage: '2.00',
          showImpactWarning: false,
        },
      )
    })

    it('should show large impact with a warning (penalty)', () => {
      makeAssertion(
        {
          inputHigh: 1,
          inputLow: 1,
          outputLow: 0.75,
          outputHigh: 0.8,
        },
        {
          // endRate     = 0.75
          // startRate   = 0.80
          // impact      = 0.05
          // 1.00 - 0.80 = 0.20; -20% distance
          // 0.80 - 0.75 = 0.05;   5% impact
          distancePercentage: '-20.00',
          impactPercentage: '5.00',
          showImpactWarning: true,
        },
      )
    })

    it('should show large impact with a warning (bonus)', () => {
      makeAssertion(
        {
          inputHigh: 1,
          inputLow: 1,
          outputLow: 2,
          outputHigh: 2.05,
        },
        {
          // endRate     = 2.05
          // startRate   = 2.00
          // impact      = 0.05
          // 2.05 - 1.00 = 1.05; 105% distance
          // 2.05 - 2.00 = 0.05;   5% impact
          distancePercentage: '105.00',
          impactPercentage: '5.00',
          showImpactWarning: true,
        },
      )
    })
  })
})
