import { BigDecimal } from '@apps/bigdecimal'
import { LPPriceAdjustment } from '@apps/types'

import { getDistancePercentage, getSignedDistance } from './getDistancePercentage'

describe('getSignedDistance', () => {
  const makeAssertion = (input: number, output: number, reverse: boolean, expected: string) => {
    const absoluteDistance = output / input
    const result = getSignedDistance(absoluteDistance, reverse)
    expect(result.toFixed(2)).toEqual(expected)
  }

  it('should handle zero slippage', () => {
    makeAssertion(1, 1, false, '0.00')
  })

  it('should handle small penalty', () => {
    makeAssertion(1, 0.99, false, '-1.00')
  })

  it('should handle large penalty', () => {
    makeAssertion(1, 0.31, false, '-69.00')
  })

  it('should handle a small bonus', () => {
    makeAssertion(1, 1.01, false, '1.00')
  })

  it('should handle large bonus', () => {
    makeAssertion(1, 1.21, false, '21.00')
  })

  it('should handle zero slippage (reverse)', () => {
    makeAssertion(1, 1, true, '0.00')
  })

  it('should handle small penalty (reverse)', () => {
    makeAssertion(1, 0.99, true, '1.00')
  })

  it('should handle large penalty (reverse)', () => {
    makeAssertion(1, 0.31, true, '69.00')
  })

  it('should handle a small bonus (reverse)', () => {
    makeAssertion(1, 1.01, true, '-1.00')
  })

  it('should handle large bonus (reverse)', () => {
    makeAssertion(1, 1.21, true, '-21.00')
  })
})

describe('getDistancePercentage', () => {
  const makeAssertion = (
    inputAmount: number | undefined,
    outputAmount: number | undefined,
    lpPriceAdjustment: LPPriceAdjustment | undefined,
    reverse: boolean | undefined,
    expected: string | undefined,
  ) => {
    const result = getDistancePercentage(
      inputAmount === undefined ? undefined : BigDecimal.fromSimple(inputAmount),
      outputAmount === undefined ? undefined : BigDecimal.fromSimple(outputAmount),
      lpPriceAdjustment,
      reverse,
    )
    expect(result?.toFixed(2)).toEqual(expected)
  }

  it('should handle null inputs', () => {
    makeAssertion(undefined, undefined, undefined, undefined, undefined)
    makeAssertion(1, undefined, undefined, undefined, undefined)
    makeAssertion(undefined, 1, undefined, undefined, undefined)
    makeAssertion(0, 1, undefined, undefined, undefined)
  })

  it('should handle zero slippage', () => {
    makeAssertion(1, 1, undefined, false, '0.00')
  })

  it('should handle zero slippage (reverse)', () => {
    makeAssertion(1, 1, undefined, true, '0.00')
  })

  it('should handle a small penalty', () => {
    makeAssertion(1, 0.99, undefined, false, '-1.00')
  })

  it('should handle a small bonus', () => {
    makeAssertion(1, 1.01, undefined, false, '1.00')
  })

  describe('zero slippage', () => {
    it('should handle scaling same-priced assets', () => {
      // 1 of each, same price, so 0%
      makeAssertion(1, 1, { price: BigDecimal.fromSimple(1), isInput: true }, false, '0.00')
      makeAssertion(1, 1, { price: BigDecimal.fromSimple(1), isInput: false }, false, '0.00')
    })

    it('should handle scaling overpriced input', () => {
      // 1 of each, but input is worth 2x output, so -50% penalty
      makeAssertion(1, 1, { price: BigDecimal.fromSimple(2), isInput: true }, false, '-50.00')
    })

    it('should handle scaling overpriced output', () => {
      // 1 of each, but output is worth 2x input, so 100% bonus
      makeAssertion(1, 1, { price: BigDecimal.fromSimple(2), isInput: false }, false, '100.00')
    })

    it('should handle scaling underpriced input', () => {
      // 1 of each, but input is worth 0.5x output, so 100% bonus
      makeAssertion(1, 1, { price: BigDecimal.fromSimple(0.5), isInput: true }, false, '100.00')
    })

    it('should handle scaling underpriced output', () => {
      // 1 of each, but output is worth 0.5x input, so -50% penalty
      makeAssertion(1, 1, { price: BigDecimal.fromSimple(0.5), isInput: false }, false, '-50.00')
    })
  })

  describe('small bonus', () => {
    it('should handle scaling same-priced assets', () => {
      // 1% more output, same price, so 1%
      makeAssertion(1, 1.01, { price: BigDecimal.fromSimple(1), isInput: true }, false, '1.00')
      makeAssertion(1, 1.01, { price: BigDecimal.fromSimple(1), isInput: false }, false, '1.00')
    })

    it('should handle scaling overpriced input', () => {
      // 1% more output, but input is worth 2x output, so -50% penalty + (1% * 0.5) = -49.50%
      makeAssertion(1, 1.01, { price: BigDecimal.fromSimple(2), isInput: true }, false, '-49.50')
    })

    it('should handle scaling overpriced output', () => {
      // 1% more output, but output is worth 2x input, so 100% bonus + (1% * 2) = 102%
      makeAssertion(1, 1.01, { price: BigDecimal.fromSimple(2), isInput: false }, false, '102.00')
    })

    it('should handle scaling underpriced input', () => {
      // 1% more output, but input is worth 0.5x output, so 100% bonus + (1% * 2) = 102%
      makeAssertion(1, 1.01, { price: BigDecimal.fromSimple(0.5), isInput: true }, false, '102.00')
    })

    it('should handle scaling underpriced output', () => {
      // 1% more output, but output is worth 0.5x input, so -50% penalty + (1% * 0.5) = -49.50%
      makeAssertion(1, 1.01, { price: BigDecimal.fromSimple(0.5), isInput: false }, false, '-49.50')
    })
  })

  describe('small penalty', () => {
    it('should handle scaling same-priced assets', () => {
      // 1% less output, same price, so -1%
      makeAssertion(1, 0.99, { price: BigDecimal.fromSimple(1), isInput: true }, false, '-1.00')
      makeAssertion(1, 0.99, { price: BigDecimal.fromSimple(1), isInput: false }, false, '-1.00')
    })

    it('should handle scaling overpriced input', () => {
      // 1% less output, but input is worth 2x output, so 50% penalty - (1% * 0.5) = -50.50%
      makeAssertion(1, 0.99, { price: BigDecimal.fromSimple(2), isInput: true }, false, '-50.50')
    })

    it('should handle scaling overpriced output', () => {
      // 1% less output, but output is worth 2x input, so 100% bonus - (1% * 2) = 98%
      makeAssertion(1, 0.99, { price: BigDecimal.fromSimple(2), isInput: false }, false, '98.00')
    })

    it('should handle scaling underpriced input', () => {
      // 1% less output, but input is worth 0.5x output, so 100% penalty - (1% * 2) = 98%
      makeAssertion(1, 0.99, { price: BigDecimal.fromSimple(0.5), isInput: true }, false, '98.00')
    })

    it('should handle scaling underpriced output', () => {
      // 1% less output, but output is worth 0.5x input, so -50% penalty - (1% * 0.5) = -50.50%
      makeAssertion(1, 0.99, { price: BigDecimal.fromSimple(0.5), isInput: false }, false, '-50.50')
    })
  })
})
