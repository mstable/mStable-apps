import { FieldPolicy } from '@apollo/client'
import { BigNumber } from 'ethers'
import { BigDecimal } from '@apps/bigdecimal'

// Doesn't check that T[field] is string
export const readAsBN = <T>(field: keyof T): FieldPolicy<BigNumber> => ({
  read(existing, options) {
    const exact = options.readField(field as string)
    return BigNumber.from(exact)
  },
})

// Doesn't check that T[field] is string
export const readAsBD = <T>(field: keyof T, decimals = 18): FieldPolicy<BigDecimal> => ({
  read(existing, options) {
    const exact: number = options.readField(field as string) as number
    return new BigDecimal(exact, decimals)
  },
})
