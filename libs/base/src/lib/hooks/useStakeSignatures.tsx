import { Dispatch, SetStateAction } from 'react'
import { useLocalStorage } from 'react-use'

export interface StakeSignatures {
  [x: string]: string
}

// small hack because the returned types are wrong: https://github.com/streamich/react-use/pull/1438
export const useStakeSignatures = () =>
  useLocalStorage<StakeSignatures>('stakeSignatures', {}) as unknown as [StakeSignatures, Dispatch<SetStateAction<StakeSignatures>>]
