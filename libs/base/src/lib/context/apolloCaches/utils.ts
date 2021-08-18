import { FieldPolicy } from '@apollo/client'
import { BigNumber } from 'ethers'

// Doesn't check that T[field] is string
export const readAsBN = <T>(field: keyof T): FieldPolicy<BigNumber> => ({
  read(existing, options) {
    const exact = options.readField(field as string)
    return BigNumber.from(exact)
  },
})
